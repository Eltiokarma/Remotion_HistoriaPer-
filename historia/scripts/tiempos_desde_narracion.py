"""Tiempos de referencia de la narración, sin voz provisional.

    python scripts/tiempos_desde_narracion.py 002-la-deuda-defraudada

narracion.py necesita public/videos/<video>/voz-provisional/tiempos.json para saber cuánto debe
respirar la voz entre frases. Cuando no hay voz provisional (Piper no está en todas las máquinas),
este script la reemplaza con tiempos calculados desde videos/<video>/narracion.json: cada frase es
una lista [texto con etiquetas, pausa después en segundos], y dura sus palabras a RITMO palabras
por segundo. Lo que importa son las pausas: narracion.py garantiza las de 1,4 s o más con el aire
de la propia toma. Los tiempos reales salen después, en narracion_tiempos.json.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RITMO = 2.6          # palabras por segundo de la voz (medido con eleven_v4, 19 de noviembre de 2026)
AIRE_INICIAL = 0.3


def limpio(texto):
    return re.sub(r"\[[^\]]*\]\s*", "", texto).strip()


def main(video):
    cfg = json.loads((RAIZ / "videos" / video / "narracion.json").read_text(encoding="utf-8"))
    salida = {}
    for s, frases in cfg["frases"].items():
        t, lista = AIRE_INICIAL, []
        for f in frases:
            texto, pausa = (f, 0.35) if isinstance(f, str) else (f[0], f[1])
            dur = len(limpio(texto).split()) / RITMO
            lista.append({"desde": round(t, 2), "hasta": round(t + dur, 2), "texto": limpio(texto)})
            t += dur + pausa
        salida[s] = {"duracion": round(t, 2), "frases": lista}
    destino = RAIZ / "public" / "videos" / video / "voz-provisional" / "tiempos.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(salida, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    total = sum(v["duracion"] for v in salida.values())
    print(f"{destino.relative_to(RAIZ)}: {len(salida)} escenas, {total / 60:.1f} min estimados")


if __name__ == "__main__":
    main(sys.argv[1])
