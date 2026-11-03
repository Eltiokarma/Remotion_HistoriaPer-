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


def rss_arbol(pid: int) -> int:
    """RSS total (kB) del proceso y todos sus descendientes."""
    hijos: dict[int, list[int]] = {}
    rss: dict[int, int] = {}
    for d in os.listdir("/proc"):
        if not d.isdigit():
            continue
        try:
            st = open(f"/proc/{d}/stat").read()
            ppid = int(st.rsplit(")", 1)[1].split()[1])
            hijos.setdefault(ppid, []).append(int(d))
            for linea in open(f"/proc/{d}/status"):
                if linea.startswith("VmRSS"):
                    rss[int(d)] = int(linea.split()[1])
        except (OSError, ValueError, IndexError):
            continue
    total, pila = 0, [pid]
    while pila:
        p = pila.pop()
        total += rss.get(p, 0)
        pila.extend(hijos.get(p, []))
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
    proc = subprocess.Popen(cmd)
    pico = 0
    corriendo = True

    def muestrear():
        nonlocal pico
        while corriendo:
            pico = max(pico, rss_arbol(proc.pid))
            time.sleep(0.25)

    hilo = threading.Thread(target=muestrear, daemon=True)
    hilo.start()
    codigo = proc.wait()
    corriendo = False
    hilo.join()
    pared = time.monotonic() - t0
    uso = resource.getrusage(resource.RUSAGE_CHILDREN)

    registro = {
        "muestra": muestra,
        "etapa": etapa,
        "inicio_utc": inicio.isoformat(timespec="seconds"),
        "comando": " ".join(cmd),
        "codigo_salida": codigo,
        "segundos_pared": round(pared, 1),
        "segundos_cpu": round(uso.ru_utime + uso.ru_stime, 1),
        "pico_rss_mb": round(pico / 1024),
        "pico_rss_metodo": "suma del RSS del árbol de procesos, muestreo cada 0,25 s",
        "maquina": maquina(),
        "versiones": versiones(),
        "salida": probar(salida),
    }
    destino = LAB / "resultados" / muestra / f"{etapa}.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(registro, ensure_ascii=False, indent=2) + "\n")
    print(f"\n[medir] {muestra}/{etapa}: {registro['segundos_pared']} s, pico {registro['pico_rss_mb']} MB → {destino.relative_to(LAB)}")
    return codigo


if __name__ == "__main__":
    sys.exit(main())
