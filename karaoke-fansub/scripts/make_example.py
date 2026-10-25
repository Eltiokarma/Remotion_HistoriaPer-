"""Genera el proyecto de ejemplo (ejemplo/): letra inventada con 3 personajes, tiempos y un
clip de video con una melodía sintética que suena justo en cada sílaba.

Uso: python scripts/make_example.py   (necesita ffmpeg)
"""
import json
import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.lyrics import parse_lyrics, times_of  # noqa: E402
from app.project import new_project  # noqa: E402

LYRICS = """Kaito: Zar|pa|mos con el al|ba
Mirei: el vien|to can|ta a fa|vor
Kaito: no hay ma|pa que nos de|ten|ga
Coro: ¡más a|llá del ho|ri|zon|te!
Mirei: guar|da la luz de tu fa|ro
Coro: ¡que la mar nos lle|va a ca|sa!"""

CHARS = {
    "kaito": {"name": "Kaito", "color": "#ff5a5f", "auto": False},
    "mirei": {"name": "Mirei", "color": "#5ec8ff", "auto": False},
    "coro": {"name": "Coro", "color": "#ffc94a", "auto": False},
}

RATE = 44100
# Escala pentatónica (La menor) para que suene "a canción"
SCALE = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]
VOICE = {"kaito": 0, "mirei": 2, "coro": 1}


def build_project():
    lines, chars = parse_lyrics(LYRICS, CHARS)
    t = 1.0
    for line in lines:
        for s in line["syls"]:
            d = 0.26 + 0.035 * len(s["text"].strip())
            s["t0"], s["t1"] = round(t, 2), round(t + d, 2)
            t += d + 0.05
        t += 0.8
    p = new_project(LYRICS)
    p["name"] = "Ejemplo: Más allá del horizonte"
    p["chars"] = chars
    p["times"] = times_of(lines)
    return p, lines, t + 1.5


def synth(lines, dur, path):
    n = int(dur * RATE)
    buf = [0.0] * n
    # Bajo suave de fondo, un acorde por verso
    for li, line in enumerate(lines):
        a, b = line["syls"][0]["t0"], line["syls"][-1]["t1"]
        f = SCALE[[0, 3, 4, 0, 3, 4][li % 6]] / 2
        for i in range(int(a * RATE), min(n, int((b + 0.4) * RATE))):
            tt = i / RATE - a
            env = min(1, tt / 0.3) * min(1, (b + 0.4 - i / RATE) / 0.4)
            buf[i] += 0.10 * env * math.sin(2 * math.pi * f * tt)
    # Una nota por sílaba
    for li, line in enumerate(lines):
        base = VOICE.get(line["charKey"], 0)
        for k, s in enumerate(line["syls"]):
            f = SCALE[(base + (k * 3 + li) % 5) % len(SCALE)]
            a, b = s["t0"], s["t1"]
            for i in range(int(a * RATE), min(n, int((b + 0.08) * RATE))):
                tt = i / RATE - a
                env = min(1, tt / 0.015) * math.exp(-tt * 2.2) * min(1, (b + 0.08 - i / RATE) / 0.08)
                v = math.sin(2 * math.pi * f * tt) + 0.3 * math.sin(4 * math.pi * f * tt)
                buf[i] += 0.28 * env * v
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, x)) * 32000)) for x in buf))


def main():
    out = ROOT / "ejemplo"
    out.mkdir(exist_ok=True)
    p, lines, dur = build_project()
    wav = out / "melodia.wav"
    synth(lines, dur, wav)
    video = out / "ejemplo.mp4"
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "lavfi", "-i", f"gradients=s=1280x720:c0=0x101a38:c1=0x2a4a7a:c2=0x5a2d5e:c3=0x0e1426:nb_colors=4:speed=0.012:d={dur:.2f}:r=24",
        "-i", str(wav),
        "-vf", "noise=alls=6:allf=t,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-c:a", "aac", "-b:a", "96k",
        "-shortest", "-movflags", "+faststart", str(video),
    ], check=True)
    wav.unlink()
    p["video"] = {"file": "ejemplo.mp4", "width": 1280, "height": 720, "duration": round(dur, 2)}
    (out / "proyecto.json").write_text(json.dumps(p, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Listo: {video} ({video.stat().st_size // 1024} KB, {dur:.1f} s)")


if __name__ == "__main__":
    main()
