"""Busca y baja ambientes y efectos de Freesound con licencia apta para un canal monetizado.

Solo acepta CC0 y CC BY (nunca NonCommercial ni Sampling+). Baja la vista previa de alta calidad
(MP3) — basta para ambientes a −30 LUFS y efectos — y anota el crédito en
public/compartido/audio/creditos-freesound.json, listo para copiar a fuentes.md.

Necesita la variable FREESOUND_API_KEY (https://freesound.org/apiv2/apply). Solo la librería estándar.
Desde la nube de Claude, Freesound responde 403 (bloquea esas IP): correrlo en la laptop.

    python scripts/freesound.py buscar "indoor swimming pool ambience"
    python scripts/freesound.py buscar "rubber stamp" --max 5 --dur 0.2-3
    python scripts/freesound.py bajar 123456 ambiente/agua-piscina      → public/compartido/audio/ambiente/agua-piscina.mp3
    python scripts/freesound.py bajar 123456 sfx/sello-goma

Al bajar un ambiente, falta normalizarlo a −30 LUFS como los demás (CLAUDE.md §6):
    ffmpeg -i entrada.mp3 -af loudnorm=I=-30:TP=-2 salida.mp3
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

API = "https://freesound.org/apiv2"
AUDIO = Path(__file__).resolve().parent.parent / "public" / "compartido" / "audio"
CREDITOS = AUDIO / "creditos-freesound.json"
CAMPOS = "id,name,username,license,duration,url,previews,tags"
# Freesound nombra las licencias por su URL; estas son las únicas que sirven para monetizar.
APTAS = {"creativecommons.org/publicdomain/zero": "CC0 1.0", "creativecommons.org/licenses/by/": "CC BY"}
FILTRO_LICENCIA = 'license:("Creative Commons 0" OR "Attribution")'


def licencia_apta(url_licencia: str):
    """Devuelve el nombre corto si la licencia sirve para uso comercial; None si no (NC, Sampling+…)."""
    u = url_licencia.lower()
    if "/by-nc" in u or "sampling" in u:
        return None
    for clave, nombre in APTAS.items():
        if clave in u:
            version = u.rstrip("/").split("/")[-1]
            return nombre if nombre.startswith("CC0") else f"{nombre} {version}"
    return None


def pedir(ruta: str, **params) -> dict:
    clave = os.environ.get("FREESOUND_API_KEY")
    if not clave:
        raise SystemExit("Falta FREESOUND_API_KEY en el entorno.")
    url = f"{API}{ruta}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"Authorization": f"Token {clave}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Freesound respondió {e.code} en {ruta}. 403 sin explicación = IP bloqueada (¿nube?).")


def buscar(consulta: str, maximo: int = 10, dur: str | None = None):
    filtro = FILTRO_LICENCIA + (f" duration:[{dur.replace('-', ' TO ')}]" if dur else "")
    datos = pedir("/search/text/", query=consulta, filter=filtro, fields=CAMPOS, page_size=maximo, sort="score")
    filas = [s for s in datos.get("results", []) if licencia_apta(s["license"])]
    for s in filas:
        print(f"{s['id']:>8}  {s['duration']:6.1f} s  {licencia_apta(s['license']):10}  {s['username'][:18]:18}  {s['name'][:60]}")
        print(f"{'':10}{s['url']}")
    if not filas:
        print("Nada con licencia apta. Probar otras palabras (en inglés).")
    return filas


def bajar(sonido_id: str, destino: str):
    s = pedir(f"/sounds/{sonido_id}/", fields=CAMPOS)
    lic = licencia_apta(s["license"])
    if not lic:
        raise SystemExit(f"{sonido_id}: licencia no apta para monetizar ({s['license']}).")
    salida = AUDIO / f"{destino}.mp3"
    salida.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(s["previews"]["preview-hq-mp3"], salida)
    creditos = json.loads(CREDITOS.read_text(encoding="utf-8")) if CREDITOS.exists() else []
    creditos = [c for c in creditos if c["archivo"] != f"{destino}.mp3"]
    creditos.append({
        "archivo": f"{destino}.mp3", "titulo": s["name"], "autor": s["username"], "licencia": lic,
        "licencia_url": s["license"], "fuente": s["url"], "id": s["id"], "bajado": date.today().isoformat(),
    })
    CREDITOS.write_text(json.dumps(creditos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    atribucion = "" if lic.startswith("CC0") else "  (CC BY: el crédito va en fuentes.md y en la descripción del video)"
    print(f"→ {salida.relative_to(AUDIO.parent.parent.parent)}  «{s['name']}» de {s['username']}, {lic}{atribucion}")


def main(argv):
    opciones = {argv[i][2:]: argv[i + 1] for i in range(len(argv) - 1) if argv[i].startswith("--")}
    resto = [a for i, a in enumerate(argv) if not a.startswith("--") and not (i and argv[i - 1].startswith("--"))]
    if len(resto) >= 2 and resto[0] == "buscar":
        buscar(" ".join(resto[1:]), int(opciones.get("max", 10)), opciones.get("dur"))
    elif len(resto) == 3 and resto[0] == "bajar":
        bajar(resto[1], resto[2])
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
