"""Manuscrito de locución del 0·2: la voz con su emoción, sus pausas y sus tiempos reales.

    python3 historia/videos/002-la-deuda-defraudada/manuscrito.py

Lee narracion.json (texto, etiquetas de emoción y pausa pedida después de cada frase) y, si existe,
narracion_tiempos.json (dónde empieza y termina cada frase en voz/sNN.mp3, según scripts/narracion.py).
Escribe manuscrito.md. Sirve para leer la locución, revisar la emoción y montar: cada frase dice en
qué segundo de su escena empieza. No se edita a mano.
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
TITULOS = {"s00": "El gancho", "s01": "Las islas y el país", "s02": "Un reclamo pasa por varias manos",
           "s03": "El expediente de Novoa", "s04": "Lo investigan y los títulos siguen circulando",
           "s05": "De estos expedientes al método de Quiroz"}


def mmss(s):
    return f"{int(s // 60)}:{s % 60:04.1f}"


def main():
    cfg = json.loads((AQUI / "narracion.json").read_text(encoding="utf-8"))
    ruta_t = AQUI / "narracion_tiempos.json"
    tiempos = json.loads(ruta_t.read_text(encoding="utf-8")) if ruta_t.exists() else {}
    total = sum(v["duracion"] for v in tiempos.values())
    out = ["# La deuda defraudada · Manuscrito de locución", "",
           f"Generado con `manuscrito.py` desde [narracion.json](narracion.json) y "
           f"[narracion_tiempos.json](narracion_tiempos.json); no se edita a mano. Voz «{cfg['nombre']}», "
           f"modelo `{cfg['modelo']}`, una toma por escena (`scripts/narracion.py`)."
           + (f" Duración real: {mmss(total)}." if tiempos else ""), "",
           "Cada frase dice en qué segundo de su escena empieza (`voz/sNN.mp3`), con qué emoción se dijo "
           "(las etiquetas entre corchetes, que la voz no lee) y cuánto respira después. "
           "`/` es una pausa de menos de 1 s y `//`, una de 1 s o más; ✂ marca dónde la escena se generó en otra toma. "
           "Las láminas, encuadres y sonido están en `storyboard.html`.", ""]
    for s, frases in cfg["frases"].items():
        t = tiempos.get(s, {})
        reales = t.get("frases", [])
        cortes = cfg.get("cortes", {}).get(s, {})
        cab = f"## {s} · {TITULOS.get(s, '')}"
        if t:
            cab += f" · {mmss(t['duracion'])}"
        out += [cab, ""]
        for i, (texto, pausa) in enumerate(frases):
            tags = " ".join(re.findall(r"\[[^\]]*\]", texto))
            limpio = re.sub(r"\[[^\]]*\]\s*", "", texto).strip()
            inicio = f"`{mmss(reales[i]['desde'])}` " if i < len(reales) else ""
            real = ""
            if i + 1 < len(reales):
                real = f" ({reales[i + 1]['desde'] - reales[i]['hasta']:.1f} s)"
            barra = "//" if pausa >= 1 else "/"
            corte = " ✂" if str(i) in cortes else ""
            out.append(f"- {inicio}*{tags}* {limpio} {barra}{real}{corte}")
        out.append("")
    (AQUI / "manuscrito.md").write_text("\n".join(out), encoding="utf-8")
    print("manuscrito.md")


if __name__ == "__main__":
    main()
