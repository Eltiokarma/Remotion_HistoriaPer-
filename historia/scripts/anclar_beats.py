"""Ancla los beats de escenas.json a las palabras de la narración real (la voz manda).

    python scripts/anclar_beats.py 001-el-hombre               → usa las palabras guardadas (o transcribe las que faltan)
    python scripts/anclar_beats.py 001-el-hombre --transcribir → vuelve a transcribir todas las escenas (voz regenerada)

Lee videos/<video>/anclas.json: por escena, cada beat con la palabra (o las palabras) del guion en que cae:

    "s02": {
      "nombre": "alfonso",                              → al empezar esa palabra
      "frenar": {"en": "en la piscina", "mas": 0.2},    → al empezar, más (o menos) unos segundos
      "fecha": {"tras": "cincuenta y seis años", "mas": 0.3},  → al terminar la última palabra, más unos segundos
      "islas": {"fijo": 0.2}                            → un segundo fijo de la escena (sin voz)
    }

Las palabras salen de transcribir voz/<escena>.mp3 con Scribe de ElevenLabs (tiempos por palabra) y quedan
guardadas en videos/<video>/narracion_palabras.json. Si unas palabras aparecen dos veces, vale la primera:
para otra, se escriben más palabras. Escribe los beats en escenas.json (los demás beats no se tocan),
`duracion_s` = lo que dura la voz y `beats_ajustados: true`. Un ancla que no se encuentra detiene el script.
Después: `npm run validar`, `npm run escaleta` y, si la música está anclada a beats, `montar_musica.py`.
"""
import json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from narracion import tokens, CLAVE, API  # noqa: E402  (la misma normalización de palabras que la narración)

RAIZ = Path(__file__).resolve().parent.parent


def transcribir(mp3):
    r = subprocess.run(["curl", "-sS", "-H", f"xi-api-key: {CLAVE}", "-X", "POST", f"{API}/speech-to-text",
                        "-F", "model_id=scribe_v1", "-F", "language_code=spa", "-F", "timestamps_granularity=word",
                        "-F", f"file=@{mp3}"], capture_output=True, text=True)
    d = json.loads(r.stdout)
    if "words" not in d:
        raise SystemExit(f"Scribe no devolvió palabras para {mp3}: {r.stdout[:200]}")
    return [{"texto": w["text"], "desde": round(w["start"], 3), "hasta": round(w["end"], 3)} for w in d["words"] if w.get("type") == "word"]


def duracion(mp3):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
                                capture_output=True, text=True).stdout)


def main(video, retranscribir=False):
    V = RAIZ / "videos" / video
    voz = RAIZ / "public" / "videos" / video / "voz"
    anclas = json.loads((V / "anclas.json").read_text(encoding="utf-8"))
    ruta_pal = V / "narracion_palabras.json"
    palabras = json.loads(ruta_pal.read_text(encoding="utf-8")) if ruta_pal.exists() and not retranscribir else {}
    escenas_json = V / "escenas.json"
    datos = json.loads(escenas_json.read_text(encoding="utf-8"))
    por_id = {e["id"]: e for e in datos["escenas"]}
    for s, beats in anclas.items():
        if s.startswith("_"):
            continue
        mp3 = voz / f"{s}.mp3"
        if s not in palabras:
            palabras[s] = transcribir(mp3)
            ruta_pal.write_text(json.dumps(palabras, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        # cada palabra transcrita, en tokens (las cifras pasan a letras, sin tildes), con su tiempo
        toks = [(tk, w["desde"], w["hasta"]) for w in palabras[s] for tk in tokens(w["texto"])]
        seq = [x[0] for x in toks]
        e = por_id[s]
        for nombre, a in beats.items():
            if isinstance(a, str):
                a = {"en": a}
            if "fijo" in a:
                e["beats"][nombre] = round(a["fijo"], 2)
                continue
            frase = a.get("en", a.get("tras"))
            buscado = tokens(frase)
            i = next((k for k in range(len(seq) - len(buscado) + 1) if seq[k:k + len(buscado)] == buscado), None)
            if i is None:
                raise SystemExit(f"{s} · {nombre}: «{frase}» no está en la voz ({' '.join(seq[:12])}…)")
            base = toks[i + len(buscado) - 1][2] if "tras" in a else toks[i][1]
            e["beats"][nombre] = round(max(0.0, base + a.get("mas", 0.0)), 2)
        e["duracion_s"] = round(duracion(mp3), 2)
        e["beats_ajustados"] = True
        print(f"{s}: {len(beats)} beats anclados · voz {e['duracion_s']} s")
    escenas_json.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1], "--transcribir" in sys.argv[2:])
