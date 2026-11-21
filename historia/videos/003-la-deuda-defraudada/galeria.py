"""Catálogo de la galería de imágenes generadas (una sola para el 0·1 y el 0·3).

    python3 historia/videos/003-la-deuda-defraudada/galeria.py

Recorre public/videos/003-la-deuda-defraudada/imagenes/chatgpt/ (fuera de git), y escribe
galeria.md: cada archivo con su tipo, tamaño, transparencia y los planos del storyboard del 0·3 que
lo usan. Así las sesiones del 0·1 y del 0·3 ven la misma lista, aunque las imágenes no estén en git.
"""
import json
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent
CARPETA = AQUI.parents[1] / "public" / "videos" / "003-la-deuda-defraudada" / "imagenes" / "chatgpt"
TIPOS = [("obj01-", "Objeto o fondo (lote del 0·1)"), ("obj-", "Objeto o papel"), ("fondo-", "Fondo"),
         ("plano-", "Composición de referencia"), ("textura-", "Textura")]


def tipo(nombre):
    for prefijo, t in TIPOS:
        if nombre.startswith(prefijo):
            return t
    return "Personaje"


def usos():
    sb = json.loads((AQUI / "storyboard.json").read_text(encoding="utf-8"))
    out = {}
    for e in sb["escenas"]:
        for p in e["planos"]:
            for campo in ("personajes", "objetos"):
                for ruta in p.get(campo, []):
                    out.setdefault(Path(ruta).name, []).append(p["id"])
    return out


def main():
    u = usos()
    filas = []
    for f in sorted(CARPETA.glob("*.png")):
        im = Image.open(f)
        alfa = "sí" if im.mode == "RGBA" and im.getextrema()[3][0] < 255 else "no"
        filas.append(f"| `{f.name}` | {tipo(f.name)} | {im.width} × {im.height} | {alfa} | {', '.join(u.get(f.name, [])) or '—'} |")
    sin_archivo = sorted(n for n in u if not (CARPETA / n).exists())
    out = ["# Galería de imágenes generadas · serie *Historia de la corrupción en el Perú*", "",
           "Generado con `galeria.py`; no se edita a mano. Una sola carpeta para el 0·1 y el 0·3: "
           "`public/videos/003-la-deuda-defraudada/imagenes/chatgpt/` (fuera de git por peso; se comparte en zip). "
           "Origen, fecha y prompts de cada lote: `fuentes.md`. Nombres: `obj-NN-` objetos y papeles del 0·3, "
           "`obj01-NN-` piezas del 0·1, `fondo-`, `textura-`, y el resto personajes.", "",
           f"{len(filas)} imágenes.", "",
           "| Archivo | Tipo | Tamaño | Transparencia | Planos del 0·3 |", "|---|---|---|---|---|", *filas, ""]
    if sin_archivo:
        out += ["**Faltan en la carpeta** (el storyboard las pide): " + ", ".join(f"`{n}`" for n in sin_archivo), ""]
    (AQUI / "galeria.md").write_text("\n".join(out), encoding="utf-8")
    print(f"galeria.md: {len(filas)} imágenes" + (f"; faltan {sin_archivo}" if sin_archivo else ""))


if __name__ == "__main__":
    main()
