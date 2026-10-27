"""Música, ambientes y efectos del prototipo, sintetizados desde cero (sin muestras de terceros).

Todo sale de este script, así que no hay licencias que rastrear: es material propio.
Uso: python scripts/generar_audio.py      (necesita numpy y ffmpeg)

Escribe en public/audio/{musica,ambiente,sfx}/. Las pistas de música son más largas que
su escena: Remotion las corta y las funde, así que siguen sirviendo si la voz real dura más.
"""
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
rng = np.random.default_rng(1781)


# ---------------------------------------------------------------- utilidades

def tt(d):
    return np.arange(int(d * SR)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def filtro(x, bajo=None, alto=None, orden=4):
    """Pasa banda suave por FFT (sirve para audio fuera de línea, sin scipy)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if bajo:
        m *= 1 / (1 + (bajo / np.maximum(f, 1e-3)) ** orden)
    if alto:
        m *= 1 / (1 + (f / alto) ** orden)
    return np.fft.irfft(X * m, len(x))


def convolver(x, ir):
    n = len(x) + len(ir) - 1
    nfft = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[:n]


def reverb(st, segundos=2.4, mezcla=0.28, brillo=4000):
    """Reverb de sala: ruido con caída exponencial, distinto en cada canal."""
    out = []
    for canal in st:
        ir = rng.standard_normal(int(segundos * SR)) * np.exp(-tt(segundos) * 6.9 / segundos)
        ir = filtro(ir, alto=brillo)
        ir /= np.sqrt(np.sum(ir ** 2))
        wet = convolver(canal, ir)[: len(canal)]
        out.append(canal * (1 - mezcla) + wet * mezcla * 1.6)
    return np.array(out)


def estereo(n):
    return np.zeros((2, n))


def poner(buf, sig, en, gan=1.0, pan=0.0):
    """Mezcla una señal mono en un buffer estéreo (pan de -1 a 1, potencia constante)."""
    i = int(en * SR)
    if i >= buf.shape[1]:
        return
    sig = sig[: buf.shape[1] - i]
    a = (pan + 1) * np.pi / 4
    buf[0, i:i + len(sig)] += sig * gan * np.cos(a)
    buf[1, i:i + len(sig)] += sig * gan * np.sin(a)


def bucle(st, cruce=2.0):
    """Hace que la pista empalme consigo misma (para ambientes que se repiten)."""
    c = int(cruce * SR)
    fade = np.linspace(0, 1, c)
    out = st[:, :-c].copy()
    out[:, :c] = st[:, :c] * fade + st[:, -c:] * (1 - fade)
    return out


def ruido_rosa(n):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X /= np.sqrt(np.maximum(f, 20))
    return np.fft.irfft(X, n)


def lfo(d, frec, fase=0.0):
    return 0.5 + 0.5 * np.sin(2 * np.pi * frec * tt(d) + fase)


# ---------------------------------------------------------------- instrumentos

def punteo(midi, dur=2.6, brillo=1.0):
    """Cuerda punteada (tipo charango): armónicos agudos que se apagan antes."""
    t = tt(dur)
    f = hz(midi)
    s = np.zeros_like(t)
    for k in range(1, 15):
        if f * k > SR / 2.2:
            break
        amp = abs(np.sin(np.pi * k * 0.23)) / k
        s += amp * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k) * t) * np.exp(-t * (1.6 + 0.9 * k * brillo))
    s *= np.minimum(1, t / 0.003)
    return s / (np.max(np.abs(s)) + 1e-9)


def colchon(notas, dur, ataque=1.8, cierre=2.0, corte=1100):
    """Colchón armónico: sierras desafinadas apenas, filtradas y con entrada lenta."""
    t = tt(dur)
    s = np.zeros_like(t)
    for m in notas:
        for desaf in (-0.004, 0.004):
            f = hz(m) * (1 + desaf)
            for k in range(1, 11):
                s += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6)) / k
    s = filtro(s, alto=corte)
    env = np.minimum(1, t / ataque) * np.minimum(1, (dur - t) / cierre)
    s *= np.clip(env, 0, 1)
    return s / (np.max(np.abs(s)) + 1e-9)


def quena(midi, dur):
    """Flauta andina: vibrato que llega tarde y aire en el sonido."""
    t = tt(dur)
    f0 = hz(midi)
    vib = 1 + 0.004 * np.minimum(1, np.maximum(0, t - 0.25) / 0.4) * np.sin(2 * np.pi * 5.3 * t)
    fase = 2 * np.pi * np.cumsum(f0 * vib) / SR
    s = np.sin(fase) + 0.22 * np.sin(2 * fase) + 0.08 * np.sin(3 * fase)
    aire = filtro(rng.standard_normal(len(t)), bajo=f0 * 1.5, alto=f0 * 4) * 0.35
    s = s + aire
    env = np.minimum(1, t / 0.09) * np.clip((dur - t) / 0.18, 0, 1)
    return s * env / 1.6


def bombo(dur=0.9):
    t = tt(dur)
    f = 48 + 30 * np.exp(-t * 18)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5)
    golpe = filtro(rng.standard_normal(len(t)), alto=1400) * np.exp(-t * 60) * 0.5
    return (s + golpe) / 1.3


# ---------------------------------------------------------------- música por escena

RE_MENOR = [62, 65, 67, 69, 72, 74, 77, 79, 81]  # pentatónica de re menor (re fa sol la do)
ACORDES = {
    "Dm": [50, 57, 62, 65], "Bb": [46, 53, 58, 62], "F": [53, 57, 60, 65],
    "C": [48, 55, 60, 64], "A": [45, 52, 57, 61], "Gm": [43, 50, 55, 58],
}


def musica_presente(dur, progresion, semilla, punteos=0.55, octava=12):
    """Estado 'presente': colchón y punteos sueltos. Acompaña sin empujar."""
    r = np.random.default_rng(semilla)
    buf = estereo(int(dur * SR))
    paso = 4.0
    for i, t0 in enumerate(np.arange(0, dur, paso)):
        acorde = ACORDES[progresion[i % len(progresion)]]
        poner(buf, colchon(acorde, paso + 2.5, ataque=1.2, cierre=2.2), t0, 0.16, 0)
        # punteos: notas del acorde, una octava arriba, sin patrón fijo
        t = t0 + r.uniform(0.2, 0.8)
        while t < t0 + paso:
            if r.random() < punteos:
                m = r.choice(acorde[1:]) + octava
                poner(buf, punteo(m, 2.4), t, 0.2, r.uniform(-0.5, 0.5))
            t += r.choice([0.5, 0.75, 1.0])
    return reverb(buf, 2.6, 0.32)


def musica_tensa(dur, semilla):
    """Tensión: bordón grave y punteos graves con una nota ajena (mi bemol) que incomoda."""
    r = np.random.default_rng(semilla)
    n = int(dur * SR)
    buf = estereo(n)
    t = tt(dur)
    bordon = (np.sin(2 * np.pi * hz(38) * t) + 0.5 * np.sin(2 * np.pi * hz(45) * t)) * (0.6 + 0.4 * lfo(dur, 0.12))
    sube = np.minimum(1, t / (dur * 0.7))  # la tensión crece a lo largo de la escena
    poner(buf, bordon * 0.18 * (0.5 + 0.5 * sube), 0, 1.0)
    alto = filtro(rng.standard_normal(n), bajo=hz(75) * 0.98, alto=hz(75) * 1.02, orden=8)
    poner(buf, alto / (np.max(np.abs(alto)) + 1e-9) * 0.05 * sube ** 2, 0, 1.0)
    tm = 0.4
    while tm < dur:
        m = r.choice([50, 53, 57, 51, 55])  # 51 = mi bemol: la nota que no debería estar
        poner(buf, punteo(m, 3.0, brillo=0.6), tm, 0.24, r.uniform(-0.4, 0.4))
        tm += r.choice([1.5, 2.0, 2.5])
    return reverb(buf, 3.2, 0.35)


def musica_mundo(dur, semilla):
    """El mapa: colchón agudo y destellos lejanos (los archivos que se encienden)."""
    r = np.random.default_rng(semilla)
    buf = estereo(int(dur * SR))
    for i, t0 in enumerate(np.arange(0, dur, 6.0)):
        acorde = [ACORDES["Dm"], ACORDES["Bb"], ACORDES["Gm"], ACORDES["A"]][i % 4]
        poner(buf, colchon([m + 12 for m in acorde], 8.5, ataque=2.5, cierre=3, corte=1800), t0, 0.12, 0)
    tm = 0.8
    while tm < dur:
        poner(buf, punteo(r.choice(RE_MENOR) + 12, 3.0, brillo=1.4), tm, 0.12, r.uniform(-0.8, 0.8))
        tm += r.uniform(0.8, 1.8)
    return reverb(buf, 3.5, 0.45)


# Melodía de quena: (nota, tiempos de negra). Frase de 8 compases en re menor.
MELODIA = [(74, 1), (77, 1), (79, 1), (81, 1), (81, 1.5), (79, 0.5), (77, 2),
           (72, 1), (74, 1), (77, 1), (79, 1), (77, 1.5), (74, 0.5), (74, 2),
           (81, 1), (84, 1), (81, 1), (79, 1), (77, 1.5), (79, 0.5), (81, 2),
           (79, 1), (77, 1), (74, 1), (72, 1), (74, 4)]


def musica_protagonista(dur, bpm=76):
    """Estado 'protagonista': bombo, rasgueo, colchón y la quena al frente."""
    negra = 60 / bpm
    buf = estereo(int(dur * SR))
    progresion = ["Dm", "C", "Bb", "A"]
    compas = 4 * negra
    for i, t0 in enumerate(np.arange(0, dur, compas)):
        acorde = ACORDES[progresion[i % 4]]
        poner(buf, colchon(acorde, compas + 1.5, ataque=0.4, cierre=1.2), t0, 0.12, 0)
        # bombo de huayno: fuerte en 1, más suave en el 3 y su contratiempo
        for b, g in ((0, 0.55), (2, 0.35), (2.5, 0.25)):
            poner(buf, bombo(), t0 + b * negra, g, 0)
        # rasgueo en corcheas, acentuando el pulso
        for c in range(8):
            for j, m in enumerate(acorde[1:]):
                poner(buf, punteo(m + 12, 1.2, brillo=1.3), t0 + c * negra / 2 + j * 0.012,
                      0.09 if c % 2 else 0.13, -0.3 + 0.3 * j)
    t = 2 * compas  # la quena entra después de dos compases
    while t < dur:
        for m, d in MELODIA:
            if t >= dur:
                break
            poner(buf, quena(m, d * negra * 0.96), t, 0.2, 0.15)
            t += d * negra
    return reverb(buf, 2.8, 0.3)


def musica_cierre(dur):
    """Vuelve a casi nada: un acorde largo que se apaga."""
    buf = estereo(int(dur * SR))
    poner(buf, colchon(ACORDES["Dm"], dur, ataque=1.5, cierre=dur * 0.6, corte=900), 0, 0.2, 0)
    poner(buf, punteo(62, 4.0, 0.8), 0.6, 0.18, -0.2)
    return reverb(buf, 3.5, 0.4)


# ---------------------------------------------------------------- ambientes (bucles de 30 s)

def amb_ciudad(d=32):
    """Habitación en una ciudad: tráfico lejano y un reloj."""
    n = int(d * SR)
    lejos = filtro(ruido_rosa(n), alto=380) * (0.7 + 0.3 * lfo(d, 0.07))
    buf = estereo(n)
    poner(buf, lejos / np.max(np.abs(lejos)) * 0.5, 0, 1.0)
    for k, tm in enumerate(np.arange(0.5, d, 1.0)):
        tic = filtro(rng.standard_normal(int(0.03 * SR)), bajo=2500 if k % 2 else 1800) * np.exp(-tt(0.03) * 160)
        poner(buf, tic * 0.35, tm, 1.0, 0.3)
    return bucle(buf)


def amb_agua(d=32):
    """Piscina: agua que se mueve y burbujas."""
    n = int(d * SR)
    agua = filtro(ruido_rosa(n), bajo=150, alto=1400) * (0.5 + 0.5 * lfo(d, 0.31) * lfo(d, 0.17, 1))
    buf = estereo(n)
    poner(buf, agua / np.max(np.abs(agua)) * 0.6, 0, 1.0)
    for tm in np.sort(rng.uniform(0, d - 0.2, 70)):
        f0 = rng.uniform(500, 1400)
        tb = tt(0.06)
        burbuja = np.sin(2 * np.pi * np.cumsum(f0 * (1 + 2.5 * tb)) / SR) * np.exp(-tb * 60)
        poner(buf, burbuja * 0.12, tm, 1.0, rng.uniform(-0.7, 0.7))
    return bucle(buf)


def amb_mar(d=32):
    """Mar abierto: olas largas y viento."""
    n = int(d * SR)
    t = tt(d)
    ola = np.sin(np.pi * ((t / 6.4) % 1)) ** 3
    mar = filtro(ruido_rosa(n), alto=900) * (0.25 + 0.75 * ola)
    espuma = filtro(rng.standard_normal(n), bajo=2500, alto=7000) * ola ** 4 * 0.08
    buf = estereo(n)
    poner(buf, (mar / np.max(np.abs(mar)) + espuma) * 0.6, 0, 1.0)
    return bucle(buf)


def amb_cuarto(d=32):
    """Archivo silencioso: aire de habitación, apenas."""
    n = int(d * SR)
    aire = filtro(ruido_rosa(n), bajo=60, alto=300)
    buf = estereo(n)
    poner(buf, aire / np.max(np.abs(aire)) * 0.35, 0, 1.0)
    return bucle(buf)


def amb_viento(d=32):
    """Viento del altiplano: ráfagas que suben y bajan."""
    n = int(d * SR)
    a = filtro(ruido_rosa(n), bajo=200, alto=700) * (0.35 + 0.65 * lfo(d, 0.09))  # nunca baja a cero
    b = filtro(ruido_rosa(n), bajo=500, alto=1600) * lfo(d, 0.13, 2.0) ** 2
    v = a + 0.6 * b
    buf = estereo(n)
    poner(buf, v / np.max(np.abs(v)) * 0.6, 0, 1.0)
    return bucle(buf)


# ---------------------------------------------------------------- efectos

def sfx_tecla():
    golpe = filtro(rng.standard_normal(int(0.04 * SR)), bajo=1200, alto=6000) * np.exp(-tt(0.04) * 120)
    cuerpo = np.sin(2 * np.pi * 170 * tt(0.04)) * np.exp(-tt(0.04) * 70) * 0.6
    return golpe + cuerpo


def sfx_hoja():
    d = 0.5
    s = filtro(rng.standard_normal(int(d * SR)), bajo=1200, alto=7000)
    env = np.zeros(int(d * SR))
    for tm in np.sort(rng.uniform(0, d * 0.7, 9)):
        i = int(tm * SR)
        k = np.arange(len(env) - i)
        env[i:] += np.exp(-k / SR * 30) * rng.uniform(0.4, 1)
    return s * env / 3


def sfx_sello():
    t = tt(0.45)
    golpe = np.sin(2 * np.pi * np.cumsum(70 + 40 * np.exp(-t * 30)) / SR) * np.exp(-t * 9)
    madera = filtro(rng.standard_normal(len(t)), bajo=300, alto=2500) * np.exp(-t * 45) * 0.6
    return golpe + madera


def sfx_pluma(d=1.1):
    t = tt(d)
    s = filtro(rng.standard_normal(len(t)), bajo=2200, alto=8000)
    raspa = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * rng.uniform(25, 40) * t + 3 * np.sin(2 * np.pi * 3 * t)))
    env = np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.1)
    return s * raspa * env * 0.5


def sfx_soplo(d=1.0):
    t = tt(d)
    s = filtro(ruido_rosa(len(t)), bajo=300, alto=2600)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return s / (np.max(np.abs(s)) + 1e-9) * env * 0.6


def sfx_campana():
    t = tt(2.0)
    s = (np.sin(2 * np.pi * 1318 * t) + 0.35 * np.sin(2 * np.pi * 2637 * t) + 0.15 * np.sin(2 * np.pi * 3950 * t)) * np.exp(-t * 3)
    return reverb(np.array([s, s]) * 0.4, 2.0, 0.35)


def sfx_tic():
    t = tt(0.08)
    return np.sin(2 * np.pi * 880 * t) * np.exp(-t * 70) + filtro(rng.standard_normal(len(t)), bajo=2000) * np.exp(-t * 200) * 0.3


def sfx_carpeta():
    roce = filtro(rng.standard_normal(int(0.5 * SR)), bajo=800, alto=5000) * np.linspace(0, 1, int(0.5 * SR)) ** 2 * 0.25
    t = tt(0.5)
    golpe = np.sin(2 * np.pi * np.cumsum(90 + 30 * np.exp(-t * 25)) / SR) * np.exp(-t * 10)
    return np.concatenate([roce, golpe])


def sfx_golpe():
    """El golpe grave del dato fuerte (la mitad)."""
    t = tt(4.0)
    s = np.sin(2 * np.pi * np.cumsum(42 + 25 * np.exp(-t * 8)) / SR) * np.exp(-t * 1.4)
    s += colchon(ACORDES["Dm"], 4.0, ataque=0.05, cierre=3.0, corte=700) * 0.5
    return reverb(np.array([s, s]) * 0.6, 3.0, 0.35)


def sfx_nota_final():
    buf = estereo(int(5 * SR))
    for i, m in enumerate([50, 57, 62, 65, 69]):
        poner(buf, punteo(m, 4.5, 0.7), i * 0.045, 0.3, -0.4 + 0.2 * i)
    return reverb(buf, 3.5, 0.4)


# ---------------------------------------------------------------- escribir

def guardar(st, ruta: Path, kbps=128, normalizar=-1.0):
    ruta.parent.mkdir(parents=True, exist_ok=True)
    st = np.atleast_2d(st)
    pico = np.max(np.abs(st)) + 1e-9
    st = st / pico * 10 ** (normalizar / 20)
    canales = st.shape[0]
    pcm = (np.clip(st.T, -1, 1) * 32767).astype(np.int16)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "x.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(canales)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", f"{kbps}k",
                        str(ruta)], check=True)
    print("ok", ruta.relative_to(ROOT))


def main():
    m = OUT / "musica"
    # Pistas más largas que su escena estimada: si la voz real dura más, igual alcanzan.
    guardar(musica_presente(40, ["Dm", "Bb", "F", "C"], 2), m / "s02-presente.mp3")
    guardar(musica_tensa(40, 3), m / "s03-tension.mp3")
    guardar(musica_mundo(45, 4), m / "s04-mundo.mp3")
    guardar(musica_protagonista(40), m / "s05-protagonista.mp3")
    guardar(musica_cierre(16), m / "s06-cierre.mp3")
    a = OUT / "ambiente"
    for nombre, fn in [("ciudad", amb_ciudad), ("agua", amb_agua), ("mar", amb_mar),
                       ("cuarto", amb_cuarto), ("viento", amb_viento)]:
        guardar(fn(), a / f"{nombre}.mp3", kbps=96, normalizar=-3)
    s = OUT / "sfx"
    for k in range(3):
        guardar(sfx_tecla(), s / f"tecla-{k + 1}.mp3", kbps=96, normalizar=-3)
    guardar(sfx_hoja(), s / "hoja.mp3", 96, -3)
    guardar(sfx_sello(), s / "sello.mp3", 96, -1)
    guardar(sfx_pluma(), s / "pluma.mp3", 96, -3)
    guardar(sfx_soplo(), s / "soplo.mp3", 96, -3)
    guardar(sfx_campana(), s / "campana.mp3", 96, -3)
    guardar(sfx_tic(), s / "tic.mp3", 96, -3)
    guardar(sfx_carpeta(), s / "carpeta.mp3", 96, -2)
    guardar(sfx_golpe(), s / "golpe.mp3", 128, -1)
    guardar(sfx_nota_final(), s / "nota-final.mp3", 128, -1)


if __name__ == "__main__":
    main()
