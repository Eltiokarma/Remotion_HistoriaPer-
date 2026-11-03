#!/usr/bin/env python3
"""
Mide un render y deja el registro en laboratorio/resultados/<muestra>/<etapa>.json.

  python3 scripts/medir.py <muestra> <etapa> <salida.mp4> -- <comando de render...>

Qué mide (solo lo que se puede medir; lo demás queda en null):
- segundos de pared del comando completo (incluye el empaquetado de Remotion o el arranque de Manim);
- CPU de usuario + sistema de los procesos hijos terminados (getrusage);
- pico de memoria: suma del RSS de todo el árbol de procesos, muestreada cada 0,25 s
  (aproximada: un pico más corto que el muestreo se puede perder);
- la máquina donde corrió de verdad (CPU, núcleos, RAM, GPU detectada) y las versiones;
- el archivo que salió (ffprobe: duración, cuadros contados, tamaño, fps, códec).

No mide tiempo humano ni tokens: eso se anota a mano en el informe de la muestra, o queda como
«desconocido».
"""

import datetime as dt
import json
import os
import platform
import resource
import shutil
import subprocess
import sys
import threading
import time
from pathlib import Path

LAB = Path(__file__).resolve().parents[1]


def leer(cmd: list[str]) -> str | None:
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=30).stdout.strip() or None
    except Exception:
        return None


def maquina() -> dict:
    cpu = None
    try:
        for linea in open("/proc/cpuinfo"):
            if linea.startswith("model name"):
                cpu = linea.split(":", 1)[1].strip()
                break
    except OSError:
        pass
    ram_gb = None
    try:
        for linea in open("/proc/meminfo"):
            if linea.startswith("MemTotal"):
                ram_gb = round(int(linea.split()[1]) / 1024 / 1024, 1)
    except OSError:
        pass
    gpu = leer(["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"]) if shutil.which("nvidia-smi") else None
    return {
        "nombre": os.environ.get("LAB_MAQUINA", "desconocida"),
        "cpu": cpu,
        "hilos_visibles": os.cpu_count(),
        "ram_gb": ram_gb,
        "gpu": gpu or "ninguna detectada",
        "so": f"{platform.system()} {platform.release()}",
    }


def versiones() -> dict:
    v = {
        "node": leer(["node", "-v"]),
        "ffmpeg": (leer(["ffmpeg", "-version"]) or "").split("\n")[0] or None,
        "python_medidor": platform.python_version(),
    }
    manim_py = os.environ.get("MANIM_PY")
    if manim_py:
        v["python_manim"] = leer([manim_py, "-c", "import sys; print(sys.version.split()[0])"])
        v["manim"] = leer([manim_py, "-c", "import manim; print(manim.__version__)"])
    pkg = LAB.parent / "node_modules"
    for nombre in ("remotion", "three", "@remotion/three", "@react-three/fiber", "@react-three/drei", "roughjs", "p5"):
        f = pkg / nombre / "package.json"
        if f.exists():
            v[nombre] = json.loads(f.read_text())["version"]
    return v


def categoria(comm: str) -> str:
    c = comm.lower()
    if "chrome" in c or "headless" in c: return "chrome"
    if c.startswith("node") or c == "npm exec" or "esbuild" in c: return "node"
    if "ffmpeg" in c or "ffprobe" in c: return "ffmpeg"
    if "python" in c or "manim" in c: return "python"
    return "otros"


def muestra_arbol(pid: int) -> dict:
    """RSS y PSS (kB) de todo el árbol de procesos, total y por tipo de proceso.

    RSS cuenta entera la memoria compartida en cada proceso (Chrome comparte mucho entre los suyos):
    sumarlo sobreestima. PSS reparte cada página compartida entre los procesos que la usan: la suma
    de PSS es la mejor medida de cuánta RAM ocupa el árbol.
    """
    hijos: dict[int, list[int]] = {}
    for d in os.listdir("/proc"):
        if not d.isdigit():
            continue
        try:
            st = open(f"/proc/{d}/stat").read()
            ppid = int(st.rsplit(")", 1)[1].split()[1])
            hijos.setdefault(ppid, []).append(int(d))
        except (OSError, ValueError, IndexError):
            continue
    total = {"rss": 0, "pss": 0, "procesos": 0, "por_tipo": {}}
    pila = [pid]
    while pila:
        p = pila.pop()
        pila.extend(hijos.get(p, []))
        try:
            comm = open(f"/proc/{p}/comm").read().strip()
            rss = pss = 0
            for linea in open(f"/proc/{p}/smaps_rollup"):
                if linea.startswith("Rss:"): rss = int(linea.split()[1])
                elif linea.startswith("Pss:"): pss = int(linea.split()[1])
        except (OSError, ValueError):
            continue
        cat = categoria(comm)
        t = total["por_tipo"].setdefault(cat, {"rss": 0, "pss": 0, "procesos": 0})
        for k, v in (("rss", rss), ("pss", pss), ("procesos", 1)):
            t[k] += v
            total[k] += v
    return total


def probar(salida: Path) -> dict | None:
    if not salida.exists():
        return None
    j = leer(["ffprobe", "-v", "error", "-count_frames", "-show_entries",
              "stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_frames:format=duration,size",
              "-of", "json", str(salida)])
    if not j:
        return None
    d = json.loads(j)
    video = next((s for s in d.get("streams", []) if s.get("codec_type") == "video"), {})
    audio = next((s for s in d.get("streams", []) if s.get("codec_type") == "audio"), None)
    return {
        "archivo": str(salida.relative_to(LAB)) if salida.is_relative_to(LAB) else str(salida),
        "duracion_s": float(d["format"]["duration"]),
        "cuadros": int(video.get("nb_read_frames", 0)),
        "ancho": video.get("width"),
        "alto": video.get("height"),
        "fps": video.get("r_frame_rate"),
        "codec": video.get("codec_name"),
        "audio": audio.get("codec_name") if audio else None,
        "mb": round(int(d["format"]["size"]) / 1e6, 2),
    }


def main() -> int:
    if "--" not in sys.argv or len(sys.argv) < 5:
        print(__doc__)
        return 2
    i = sys.argv.index("--")
    muestra, etapa, salida = sys.argv[1], sys.argv[2], Path(sys.argv[3]).resolve()
    cmd = sys.argv[i + 1:]

    inicio = dt.datetime.now(dt.timezone.utc)
    t0 = time.monotonic()
    # la salida del render se muestra y además se guarda (out/, fuera de git) para buscar en ella
    log_path = LAB / "out" / muestra / f"{etapa}.log"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log = open(log_path, "w")
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    pico = {"rss": 0, "pss": 0}
    pico_rss_detalle: dict = {}
    pico_pss_detalle: dict = {}
    corriendo = True

    def muestrear():
        nonlocal pico_rss_detalle, pico_pss_detalle
        while corriendo:
            m = muestra_arbol(proc.pid)
            if m["rss"] > pico["rss"]:
                pico["rss"], pico_rss_detalle = m["rss"], m
            if m["pss"] > pico["pss"]:
                pico["pss"], pico_pss_detalle = m["pss"], m
            time.sleep(0.25)

    hilo = threading.Thread(target=muestrear, daemon=True)
    hilo.start()
    destacadas = []
    for linea in proc.stdout:
        sys.stdout.write(linea)
        log.write(linea)
        if "[lab04]" in linea or "WebGL" in linea or "--gl" in linea.lower():
            destacadas.append(linea.strip()[:300])
    codigo = proc.wait()
    corriendo = False
    hilo.join()
    log.close()
    pared = time.monotonic() - t0
    uso = resource.getrusage(resource.RUSAGE_CHILDREN)
    mb = lambda kb: round(kb / 1024)
    detalle = lambda m: {k: {"pss_mb": mb(v["pss"]), "rss_mb": mb(v["rss"]), "procesos": v["procesos"]} for k, v in m.get("por_tipo", {}).items()}

    registro = {
        "muestra": muestra,
        "etapa": etapa,
        "inicio_utc": inicio.isoformat(timespec="seconds"),
        "comando": " ".join(cmd),
        "codigo_salida": codigo,
        "segundos_pared": round(pared, 1),
        "segundos_cpu": round(uso.ru_utime + uso.ru_stime, 1),
        "condicion": os.environ.get("LAB_CONDICION", "sin indicar"),
        "pico_pss_mb": mb(pico["pss"]),
        "pico_rss_mb": mb(pico["rss"]),
        "pico_pss_por_tipo": detalle(pico_pss_detalle),
        "pico_rss_por_tipo": detalle(pico_rss_detalle),
        "memoria_metodo": "árbol de procesos del comando (node/npx, webpack, Chrome headless y sus procesos, ffmpeg; o Python en Manim), muestreo cada 0,25 s de /proc/<pid>/smaps_rollup. PSS reparte la memoria compartida; RSS la cuenta en cada proceso y sobreestima. Un pico más corto que el muestreo se puede perder.",
        "registro_destacado": destacadas[:10],
        "maquina": maquina(),
        "versiones": versiones(),
        "salida": probar(salida),
    }
    destino = LAB / "resultados" / muestra / f"{etapa}.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(registro, ensure_ascii=False, indent=2) + "\n")
    print(f"\n[medir] {muestra}/{etapa} ({registro['condicion']}): {registro['segundos_pared']} s, pico PSS {registro['pico_pss_mb']} MB (RSS {registro['pico_rss_mb']} MB) → {destino.relative_to(LAB)}")
    return codigo


if __name__ == "__main__":
    sys.exit(main())
