#!/usr/bin/env python3
"""Propone dónde caen los beats de una escena a partir de la voz: pausas y comienzos de frase.

Prueba de laboratorio (librosa, licencia ISC, como dependencia; no se copia código). Nunca escribe en
escenas.json: deja una propuesta para que Gerson la mire y decida con `beats_ajustados`.

Uso (desde historia/):
    python3 laboratorio/scripts/beats_voz.py 001-el-hombre s05
    python3 laboratorio/scripts/beats_voz.py 001-el-hombre s05 --umbral 32 --pausa 0.35

Lee la voz real (public/videos/<id>/voz/<escena>.wav|mp3) o, si no está, la provisional. Escribe
laboratorio/resultados/beats-voz/<id>-<escena>.json con:
  pausas     — silencios de al menos --pausa segundos (inicio, fin, duración): donde respira el párrafo
  frases     — dónde vuelve la voz después de cada pausa (el ataque más cercano, con librosa.onset)
  propuesta  — por cada beat de escenas.json, el comienzo de frase más cercano (si está a ≤ --ventana s)
"""
import argparse
import json
from pathlib import Path

import librosa
import numpy as np

RAIZ = Path(__file__).resolve().parents[2]


def voz_de(video: str, escena: str) -> Path:
    for carpeta in ("voz", "voz-provisional"):
        for ext in ("wav", "mp3"):
            p = RAIZ / "public" / "videos" / video / carpeta / f"{escena}.{ext}"
            if p.exists():
                return p
    raise SystemExit(f"No hay voz para {video} {escena}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("escena")
    ap.add_argument("--umbral", type=float, default=35, help="dB bajo el pico que cuentan como silencio")
    ap.add_argument("--pausa", type=float, default=0.3, help="silencio mínimo (s) para contar como pausa")
    ap.add_argument("--ventana", type=float, default=0.8, help="distancia máxima (s) entre un beat y la frase propuesta")
    a = ap.parse_args()

    archivo = voz_de(a.video, a.escena)
    y, sr = librosa.load(archivo, sr=22050, mono=True)
    tramos = librosa.effects.split(y, top_db=a.umbral)  # tramos con voz, en muestras
    voz = [(s / sr, e / sr) for s, e in tramos]
    pausas = [(voz[i][1], voz[i + 1][0]) for i in range(len(voz) - 1) if voz[i + 1][0] - voz[i][1] >= a.pausa]
    # dónde ataca la voz al volver: el onset más cercano al fin de cada pausa (más fino que el borde del silencio)
    onsets = librosa.onset.onset_detect(y=y, sr=sr, units="time", backtrack=True)
    frases = [0.0 if not voz else round(voz[0][0], 3)]
    for _, fin in pausas:
        cerca = onsets[np.abs(onsets - fin) < 0.25] if len(onsets) else []
        frases.append(round(float(cerca[np.argmin(np.abs(cerca - fin))]) if len(cerca) else fin, 3))

    escenas = json.loads((RAIZ / "videos" / a.video / "escenas.json").read_text())["escenas"]
    beats = next((e.get("beats", {}) for e in escenas if e["id"] == a.escena), {})
    propuesta = {}
    for nombre, t in sorted(beats.items(), key=lambda kv: kv[1]):
        if not frases:
            break
        f = min(frases, key=lambda x: abs(x - t))
        propuesta[nombre] = {"actual": t, "frase": f, "diferencia": round(f - t, 3)} if abs(f - t) <= a.ventana else {"actual": t, "frase": None}

    salida = RAIZ / "laboratorio" / "resultados" / "beats-voz" / f"{a.video}-{a.escena}.json"
    salida.parent.mkdir(parents=True, exist_ok=True)
    datos = {
        "voz": str(archivo.relative_to(RAIZ)), "duracion_s": round(len(y) / sr, 3),
        "parametros": {"umbral_db": a.umbral, "pausa_min_s": a.pausa, "ventana_s": a.ventana, "librosa": librosa.__version__},
        "pausas": [{"inicio": round(s, 3), "fin": round(e, 3), "dura": round(e - s, 3)} for s, e in pausas],
        "frases": frases, "propuesta": propuesta,
    }
    salida.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n")
    cerca = sum(1 for p in propuesta.values() if p.get("frase") is not None)
    print(f"{archivo.name}: {len(pausas)} pausas, {len(frases)} comienzos de frase; {cerca}/{len(propuesta)} beats con una frase a ≤ {a.ventana} s → {salida.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
