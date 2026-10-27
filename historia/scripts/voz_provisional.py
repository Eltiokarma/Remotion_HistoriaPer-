"""Genera la voz PROVISIONAL (TTS) de un video, para probar ritmo y tiempos.

Se reemplaza por la voz real: si existe public/videos/<video>/voz/sNN.wav (o .mp3), esa manda.

Uso: python scripts/voz_provisional.py 000-quiroz /ruta/a/es_MX-claude-high.onnx
Necesita: pip install piper-tts, la voz de https://huggingface.co/rhasspy/piper-voices y ffmpeg.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main(video: str, modelo: str):
    textos = {}
    for linea in (ROOT / "videos" / video / "voz_provisional.txt").read_text(encoding="utf-8").splitlines():
        if linea.strip() and not linea.startswith("#"):
            escena, _, texto = linea.partition(":")
            textos[escena.strip()] = texto.strip()
    out = ROOT / "public" / "videos" / video / "voz-provisional"
    out.mkdir(parents=True, exist_ok=True)
    for escena, texto in textos.items():
        with tempfile.TemporaryDirectory() as tmp:
            # [PAUSA n] parte el texto: entre trozo y trozo, n segundos de silencio.
            partes = re.split(r"\[PAUSA ([\d.]+)\]", texto)
            lista = Path(tmp) / "lista.txt"
            entradas = []
            for i, parte in enumerate(partes):
                if i % 2:
                    sil = Path(tmp) / f"sil{i}.wav"
                    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
                                    "-t", parte, str(sil)], check=True)
                    entradas.append(sil)
                elif parte.strip():
                    trozo = Path(tmp) / f"voz{i}.wav"
                    # Un poco más lento que el habla normal y con pausas entre frases: tono de narrador.
                    subprocess.run([sys.executable, "-m", "piper", "-m", modelo, "-f", str(trozo),
                                    "--length-scale", "1.08", "--sentence-silence", "0.45"],
                                   input=parte.strip().encode("utf-8"), check=True, capture_output=True)
                    entradas.append(trozo)
            lista.write_text("".join(f"file '{e.as_posix()}'\n" for e in entradas), encoding="utf-8")
            wav = Path(tmp) / "voz.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lista),
                            "-ar", "22050", "-ac", "1", str(wav)], check=True)
            # 0.3 s de aire al inicio y volumen normalizado (-16 LUFS, estándar de YouTube).
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav),
                            "-af", "adelay=300|300,loudnorm=I=-16:TP=-1.5:LRA=11",
                            "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "96k",
                            str(out / f"{escena}.mp3")], check=True)
        print("ok", escena)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
