"""Genera la voz PROVISIONAL (TTS) de un video, para probar ritmo y tiempos.

Se reemplaza por la voz real: si existe public/videos/<video>/voz/sNN.wav (o .mp3), esa manda.

Uso: python scripts/voz_provisional.py 000-quiroz /ruta/a/es_MX-claude-high.onnx [s03 s04 …]
Necesita: pip install piper-tts, la voz de https://huggingface.co/rhasspy/piper-voices y ffmpeg.

Además del audio escribe public/videos/<video>/voz-provisional/tiempos.json: en qué segundo
empieza cada frase y (estimado) cada palabra. Sirve para cuadrar los beats con la voz.
"""
import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SILENCIO_FRASE = 0.45  # pausa después de cada frase, como un narrador
AIRE_INICIAL = 0.3


def trozos(texto: str):
    """El texto de una escena en frases y pausas: [("voz", "Nueva York."), ("pausa", 0.6), …]."""
    salida = []
    for i, parte in enumerate(re.split(r"\[PAUSA ([\d.]+)\]", texto)):
        if i % 2:
            salida.append(("pausa", float(parte)))
        else:
            salida += [("voz", f) for f in re.split(r"(?<=[.!?])\s+", parte.strip()) if f]
    return salida


def leer_wav(ruta: Path):
    with wave.open(str(ruta)) as w:
        return w.getframerate(), w.readframes(w.getnframes())


def palabras_de(frase: str, desde: float, dur: float):
    """Reparte la duración de la frase entre sus palabras según su largo (estimado)."""
    pals = frase.split()
    pesos = [len(p) + 1 for p in pals]
    total, t, salida = sum(pesos), desde, []
    for p, w in zip(pals, pesos):
        salida.append([round(t, 2), p])
        t += dur * w / total
    return salida


def main(video: str, modelo: str, solo: list[str]):
    textos = {}
    for linea in (ROOT / "videos" / video / "voz_provisional.txt").read_text(encoding="utf-8").splitlines():
        if linea.strip() and not linea.startswith("#"):
            escena, _, texto = linea.partition(":")
            textos[escena.strip()] = texto.strip()
    out = ROOT / "public" / "videos" / video / "voz-provisional"
    out.mkdir(parents=True, exist_ok=True)
    archivo_tiempos = out / "tiempos.json"
    tiempos = json.loads(archivo_tiempos.read_text(encoding="utf-8")) if archivo_tiempos.exists() else {}

    for escena, texto in textos.items():
        if solo and escena not in solo:
            continue
        with tempfile.TemporaryDirectory() as tmp:
            sr, pcm = None, bytearray()
            frases, palabras = [], []
            t = AIRE_INICIAL
            partes = trozos(texto)
            for i, (tipo, valor) in enumerate(partes):
                if tipo == "pausa":
                    pcm += b"\x00\x00" * int(valor * (sr or 22050))
                    t += valor
                    continue
                trozo = Path(tmp) / f"f{i}.wav"
                # Un poco más lento que el habla normal: tono de narrador.
                subprocess.run([sys.executable, "-m", "piper", "-m", modelo, "-f", str(trozo), "--length-scale", "1.08"],
                               input=valor.encode("utf-8"), check=True, capture_output=True)
                sr, datos = leer_wav(trozo)
                dur = len(datos) / 2 / sr
                frases.append({"desde": round(t, 2), "hasta": round(t + dur, 2), "texto": valor})
                palabras += palabras_de(valor, t, dur)
                pcm += datos
                t += dur
                if i < len(partes) - 1:
                    pcm += b"\x00\x00" * int(SILENCIO_FRASE * sr)
                    t += SILENCIO_FRASE
            wav = Path(tmp) / "voz.wav"
            with wave.open(str(wav), "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(sr)
                w.writeframes(bytes(pcm))
            # aire al inicio y volumen normalizado (-16 LUFS, estándar de YouTube)
            ms = int(AIRE_INICIAL * 1000)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav),
                            "-af", f"adelay={ms}|{ms},loudnorm=I=-16:TP=-1.5:LRA=11",
                            "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "96k",
                            str(out / f"{escena}.mp3")], check=True)
        tiempos[escena] = {"duracion": round(t, 2), "frases": frases, "palabras": palabras}
        print(f"ok {escena}  {t:.1f} s")

    archivo_tiempos.write_text(json.dumps(dict(sorted(tiempos.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
