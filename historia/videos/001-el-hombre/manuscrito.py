"""Manuscrito de locución del 0·1: la voz sola, para leer en voz alta.

    python3 historia/videos/001-el-hombre/manuscrito.py

Lee guion.md y escribe manuscrito.md. Las pausas del guion pasan a «/» (menos de 1 s) y «//»
(1 s o más). No se edita el manuscrito a mano. (Copiado del 0·2.)
"""
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent


def escenas():
    texto = (AQUI / "guion.md").read_text(encoding="utf-8")
    b = re.split(r"^## ESC (\d+) — (.+)$", texto, flags=re.M)
    for i in range(1, len(b), 3):
        voz = re.search(r"\*\*VO:\*\*\n(.*?)(?:\n\n\*\*|\n---|\Z)", b[i + 2], re.S)
        parrafos = [p.strip() for p in voz.group(1).split("\n\n") if p.strip()] if voz else []
        yield b[i], b[i + 1].split(" · ")[0].strip(), parrafos


def barras(p):
    p = re.sub(r"\s*\[(?:PAUSA|SILENCIO) ([\d,]+)s[^\]]*\]",
               lambda m: " //" if float(m.group(1).replace(",", ".")) >= 1 else " /", p)
    return re.sub(r"\s*\[[^\]]*\]\s*", " ", p).strip()


if __name__ == "__main__":
    out = ["# El hombre que le sacó la cuenta al Perú · Manuscrito de locución", "",
           "Generado desde [guion.md](guion.md) con `manuscrito.py`; no se edita a mano. "
           "`/` es una pausa corta y `//`, una de un segundo o más.", ""]
    for num, titulo, parrafos in escenas():
        out += [f"## {num}. {titulo}", ""]
        for p in parrafos:
            out += [barras(p) or "*(sin voz)*", ""]
    (AQUI / "manuscrito.md").write_text("\n".join(out), encoding="utf-8")
    print("manuscrito.md")
