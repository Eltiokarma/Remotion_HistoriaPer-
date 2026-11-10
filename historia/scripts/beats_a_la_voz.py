"""Mueve los beats de escenas.json a los tiempos de la narración (la voz manda).

    python scripts/beats_a_la_voz.py 001-el-hombre

Los beats se escribieron sobre la voz provisional (voz-provisional/tiempos.json). La narración
nueva dice las mismas frases en otros tiempos (videos/<video>/narracion_tiempos.json, que escribe
scripts/narracion.py). Cada beat se lleva con la frase en la que cae: se interpola entre el inicio y
el final de cada frase de una voz y de la otra. Así un beat que caía en una palabra sigue cayendo en
esa palabra, y uno que caía en una pausa sigue en esa pausa.

Escribe los beats nuevos, `beats_ajustados: true` y `duracion_s` = lo que dura la narración nueva.
Guarda la correspondencia en videos/<video>/beats_voz.json (la usan los montajes de música).
"""
import json, sys
from pathlib import Path
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent


def anclas(prov, nueva):
    xs, ys = [0.0], [0.0]
    for p, n in zip(prov["frases"], nueva["frases"]):
        xs += [p["desde"], p["hasta"]]
        ys += [n["desde"], n["hasta"]]
    xs.append(prov["duracion"])
    ys.append(nueva["duracion"])
    return xs, ys


def main(video):
    V = RAIZ / "videos" / video
    prov = json.loads((RAIZ / "public" / "videos" / video / "voz-provisional" / "tiempos.json").read_text(encoding="utf-8"))
    nueva = json.loads((V / "narracion_tiempos.json").read_text(encoding="utf-8"))
    ruta = V / "escenas.json"
    datos = json.loads(ruta.read_text(encoding="utf-8"))
    mapa = {}
    for e in datos["escenas"]:
        s = e["id"]
        if s not in nueva or s not in prov:
            continue
        xs, ys = anclas(prov[s], nueva[s])
        if e.get("beats_ajustados"):
            print(f"{s}: ya tenía beats ajustados; no se tocan")
            continue
        k = prov[s]["duracion"] / e["duracion_s"]     # como los estiraba timing.ts sobre la provisional
        viejos = {b: v * k for b, v in e["beats"].items()}
        e["beats"] = {b: round(float(np.interp(v, xs, ys)), 2) for b, v in viejos.items()}
        e["beats_ajustados"] = True
        e["duracion_s"] = round(nueva[s]["duracion"], 2)
        mapa[s] = {"provisional": xs, "voz": ys}
        print(f"{s}: {len(e['beats'])} beats · voz {nueva[s]['duracion']:.2f} s (antes {prov[s]['duracion']:.2f})")
    ruta.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (V / "beats_voz.json").write_text(json.dumps(mapa, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1])
