"""Música, ambientes y efectos del prototipo, sintetizados desde cero (sin muestras de terceros).

Todo sale de este script, así que no hay licencias que rastrear: es material propio.
Uso (necesita numpy y ffmpeg):
    python scripts/generar_audio.py              → lo que falte (no pisa archivos que ya existen)
    python scripts/generar_audio.py compartido   → efectos y ambientes (public/compartido/audio/)
    python scripts/generar_audio.py 000-quiroz   → la música de ese video (public/videos/000-quiroz/musica/)
    … --forzar                                   → vuelve a generar aunque ya existan

La música de cada escena se compone sobre sus beats: el script lee videos/<id>/escenas.json y la
duración de la voz (la real si está, si no la provisional). Cuando llegue la voz real y se
cuadren los beats, se vuelve a generar con --forzar y la música cae en los nuevos tiempos.
Para la música de un video nuevo, agrega una función como musica_000_quiroz() y su entrada en MUSICA.
"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
rng = np.random.default_rng(1781)
FORZAR = "--forzar" in sys.argv
# Todos los ambientes a la misma sonoridad, bien por debajo de la voz (que va a −16 LUFS):
# así el "nivel" de escenas.json significa lo mismo para todos y el fondo nunca tapa la narración.
AMBIENTE_LUFS = -30


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


# ---------------------------------------------------------------- música del video 000 (sobre sus beats)

J = 0.4  # el sonido de cada escena (menos la primera) entra 12 frames antes que su imagen
RAMPA = 0.5  # una música que "entra" en un beat empieza a sonar medio segundo antes


def tiempos_video(video):
    """Beats (en segundos de la escena) y duración de cada escena, como los calcula el Studio."""
    datos = json.loads((ROOT / "videos" / video / "escenas.json").read_text(encoding="utf-8"))
    out = {}
    for e in datos["escenas"]:
        cola = e.get("cola_s", 0.8)
        voz = None
        for ruta in (f"voz/{e['id']}.wav", f"voz/{e['id']}.mp3", f"voz-provisional/{e['id']}.mp3"):
            p = PUBLIC / "videos" / video / ruta
            if p.exists():
                voz = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]))
                break
        k = 1.0 if voz is None or e.get("beats_ajustados") else voz / e["duracion_s"]
        dur = (voz if voz is not None else e["duracion_s"]) + cola
        out[e["id"]] = ({n: v * k for n, v in e["beats"].items()}, dur)
    return out


class Partitura:
    """Un buffer estéreo con el reloj de la escena: `en(t)` pasa de segundos de escena a segundos del archivo."""

    def __init__(self, dur, desfase):
        self.buf = estereo(int((dur + desfase + 4) * SR))
        self.desfase = desfase

    def poner(self, sig, t, gan=1.0, pan=0.0):
        poner(self.buf, sig, max(0.0, t + self.desfase), gan, pan)

    def mezcla(self, segundos=2.6, cantidad=0.32):
        return reverb(self.buf, segundos, cantidad)


def acordes(p, desde, hasta, progresion, paso, gan=0.14, corte=1100, octava=0):
    t, i = desde, 0
    while t < hasta:
        d = min(paso, hasta - t)
        p.poner(colchon([m + octava for m in ACORDES[progresion[i % len(progresion)]]], d + 2.0, ataque=min(1.2, d * 0.4), cierre=1.8, corte=corte), t, gan)
        t += paso
        i += 1


def m000_s01(b, dur):
    """Entra al final, cuando se nombra al hombre: un acorde grave y dos notas, nada más."""
    p = Partitura(10, RAMPA)
    p.poner(colchon(ACORDES["Dm"], 10, ataque=3.0, cierre=4.0, corte=700), 0, 0.22)
    p.poner(punteo(62, 4.0, 0.7), 1.2, 0.2, -0.2)
    p.poner(punteo(69, 4.0, 0.7), 3.4, 0.16, 0.2)
    return p.mezcla(3.4, 0.4)


def m000_s02(b, dur):
    """El nadador: arpegio continuo (el braceo) que frena con el carril y se abre en la palabra."""
    p = Partitura(dur, J)
    frenar, renglon, palabra = b["frenar"], b["renglon"], b["palabra"]
    prog = ["Dm", "Bb", "F", "C"]
    acordes(p, 0, palabra, prog, 4.0, 0.12)
    t, i = 0.3, 0
    while t < renglon + 2:
        acorde = ACORDES[prog[int(t // 4.0) % 4]]
        nota = acorde[1:][i % 3] + 12 + (12 if i % 6 == 5 else 0)
        p.poner(punteo(nota, 1.8, 1.1), t, 0.16, -0.3 + 0.2 * (i % 4))
        # al frenar, cada nota llega un poco más tarde (como el agua que se aquieta)
        frena = min(1.0, max(0.0, (t - frenar) / (renglon - frenar)))
        t += 0.33 + 0.6 * frena ** 1.5
        i += 1
    p.poner(colchon([53, 57, 60, 65, 69], dur - palabra + 2, ataque=1.5, cierre=3, corte=1500), palabra - 0.3, 0.2)
    p.poner(punteo(77, 4.0, 0.8), palabra + 0.2, 0.18, 0.2)
    return p.mezcla()


def m000_s03(b, dur):
    """Una generación: calma en la lista, un ostinato de época en los afiches y, al final, solo el bordón."""
    p = Partitura(dur, J)
    af, desp, capas, bajar = b["afiches"], b["despegue"], b["capas"], b["bajar"]
    acordes(p, 0, af, ["Dm", "Gm"], 5.0, 0.12)
    negra = 60 / 100
    t, i = af, 0
    patron = [38, 38, 41, 38, 45, 38, 48, 38]
    while t < capas:
        p.poner(punteo(patron[i % 8], 0.9, 0.5), t, 0.2, -0.1)
        if i % 4 == 0 and t < desp:
            p.poner(bombo(), t, 0.22)
        t += negra / 2
        i += 1
    acordes(p, af, capas, ["Dm", "Gm", "Bb", "A"], 4 * negra * 2, 0.11)
    # las tres capas: arriba notas rápidas, al medio acordes lentos, abajo un bordón que no se va
    t = capas
    r = np.random.default_rng(1949)
    while t < dur:
        if t < bajar:
            p.poner(punteo(r.choice(RE_MENOR) + 12, 0.7, 1.6), t, 0.07, r.uniform(-0.8, 0.8))
        t += 0.16
    acordes(p, capas + 1.5, bajar + 1.5, ["Dm", "Bb", "Gm", "A"], 4.0, 0.1, corte=1400)
    tb = tt(dur - capas + 3)
    bordon = (np.sin(2 * np.pi * hz(38) * tb) + 0.5 * np.sin(2 * np.pi * hz(45) * tb)) * np.minimum(1, tb / 3) * 0.16
    p.poner(bordon, capas + 2.5, 1.0)
    return p.mezcla(3.0, 0.36)


def m000_s04(b, dur):
    """El mecanismo: mar abierto, la plata que cuenta, tensión que crece con el vale y se corta en la frase."""
    p = Partitura(dur, J)
    r = np.random.default_rng(1850)
    fl, val, prom, exp_, inf, cau, fra, mec, tes, lib, tit = (b[k] for k in ("flecha", "vales", "promesa", "expedientes", "inflado", "caudal", "frase", "mecanismo", "tesis", "libro", "titulo"))
    acordes(p, 0, fl, ["Dm", "Bb"], 6.0, 0.1, corte=1600, octava=12)
    t = 0.8
    while t < fl:
        p.poner(punteo(r.choice(RE_MENOR) + 12, 2.5, 1.3), t, 0.1, r.uniform(-0.7, 0.7))
        t += r.uniform(0.9, 1.6)
    # la plata que entra: un pulso grave que cuenta
    t = fl
    while t < fra:
        acel = min(1.0, max(0.0, (t - exp_) / (cau - exp_)))
        p.poner(punteo(38 if int((t - fl) * 2) % 2 == 0 else 45, 0.8, 0.5), t, 0.18 + 0.08 * acel)
        t += 0.6 - 0.3 * acel
    acordes(p, fl, prom, ["Dm", "Gm"], 4.0, 0.1)
    acordes(p, prom, exp_, ["F", "C", "Dm", "A"], 3.5, 0.1)
    # la nota ajena (mi bemol) aparece cuando se infla el vale y crece hasta la frase
    tb = tt(fra - inf)
    ajena = filtro(rng.standard_normal(len(tb)), bajo=hz(75) * 0.98, alto=hz(75) * 1.02, orden=8)
    p.poner(ajena / (np.max(np.abs(ajena)) + 1e-9) * (tb / (fra - inf)) ** 2 * 0.06, inf, 1.0)
    acordes(p, exp_, fra, ["Dm", "Bb", "Gm", "A"], 2.6, 0.13)
    # la frase: casi silencio; en "mecanismo" un acorde grave y seco
    p.poner(colchon([38, 45, 50], 3.0, ataque=0.05, cierre=2.5, corte=500), mec, 0.25)
    # la tesis se vuelve libro: resolución tranquila
    acordes(p, tes, dur, ["Dm", "F", "Bb", "Dm"], 3.0, 0.12)
    for k, m in enumerate([62, 65, 69, 74]):
        p.poner(punteo(m, 3.0, 0.8), tit + k * 0.12, 0.14, -0.3 + 0.2 * k)
    return p.mezcla()


def m000_s05(b, dur):
    """Aprender a medir: viaje, datos que caen a tempo, una balanza suspendida y una brújula que cambia de modo."""
    p = Partitura(dur, J)
    r = np.random.default_rng(1983)
    pun, rec, bal, cla, est, bru, giro = (b[k] for k in ("puntos", "recta", "balanza", "claridad", "estante", "brujula", "giro"))
    acordes(p, 0, pun, ["Dm", "Bb", "C", "A"], 4.0, 0.1, corte=1700, octava=12)
    t = 0.6
    while t < pun:
        p.poner(punteo(r.choice(RE_MENOR) + 12, 2.6, 1.2), t, 0.1, r.uniform(-0.7, 0.7))
        t += r.uniform(0.7, 1.4)
    # los datos: punteos en corcheas parejas; en la recta, un arpegio que sube
    t, i = pun, 0
    while t < bal:
        p.poner(punteo([62, 65, 69, 65][i % 4] + 12, 0.6, 1.5), t, 0.11, -0.4 + 0.27 * (i % 4))
        t += 0.3125
        i += 1
    for k, m in enumerate([62, 65, 69, 72, 74, 77, 81]):
        p.poner(punteo(m + 12, 1.5, 1.2), rec + k * 0.12, 0.13, -0.5 + k * 0.15)
    acordes(p, pun, bal, ["Dm", "Dm", "Bb", "C"], 2.5, 0.08)
    # balanza: acorde suspendido que se resuelve con "claridad"
    p.poner(colchon([50, 55, 57, 62], cla - bal + 1, ataque=1, cierre=1, corte=1300), bal, 0.15)
    p.poner(colchon([50, 57, 62, 65], est - cla + 1.5, ataque=0.3, cierre=1.2, corte=1300), cla, 0.15)
    acordes(p, est, bru, ["F", "C", "Dm", "Bb"], 3.75, 0.12)
    t = est + 0.5
    while t < bru:
        p.poner(punteo(r.choice([72, 74, 77, 79, 81]), 2.0, 1.0), t, 0.1, r.uniform(-0.5, 0.5))
        t += r.choice([0.5, 0.75, 1.0])
    # la brújula: re menor que, al girar la aguja, se vuelve re mayor (las ideas cambian)
    p.poner(colchon([50, 57, 62, 65], giro - bru + 2, ataque=1.5, cierre=2, corte=1100), bru, 0.15)
    p.poner(colchon([50, 57, 62, 66], dur - giro + 2, ataque=3.0, cierre=3, corte=1100), giro, 0.17)
    p.poner(punteo(78, 4.0, 0.8), giro + 4.6, 0.14, 0.2)
    return p.mezcla()


def m000_s06(b, dur):
    """La pregunta: un latido y una nota que no resuelve; la tele casi sin música; el mundo crece; respuesta en 'pruebas'."""
    p = Partitura(dur, J)
    tv, glo, pre, pru = b["tv"], b["globo"], b["pregunta"], b["pruebas"]
    for t in np.arange(0.5, tv, 1.0):
        p.poner(bombo(0.7), t, 0.18)
    tb = tt(tv)
    p.poner(np.sin(2 * np.pi * hz(69) * tb) * np.minimum(1, tb / 2) * np.minimum(1, (tv - tb) / 0.8) * 0.05, 0, 1.0)
    tb = tt(glo - tv)
    p.poner(np.sin(2 * np.pi * hz(38) * tb) * 0.06 * np.minimum(1, tb / 2) * np.minimum(1, (glo - tv - tb) / 1.5), tv, 1.0)
    acordes(p, glo, pre, ["Dm", "Bb", "Gm", "A"], (pre - glo) / 4, 0.13, corte=1500)
    p.poner(colchon(ACORDES["A"], pru - pre + 0.5, ataque=0.5, cierre=0.6, corte=1400), pre, 0.17)
    p.poner(colchon([38, 50, 57, 62, 65], dur - pru + 2, ataque=0.2, cierre=3, corte=1200), pru, 0.2)
    p.poner(punteo(62, 3.5, 0.8), pru, 0.18)
    return p.mezcla()


def m000_s07(b, dur):
    """Las objeciones: un pulso que suma capas tarjeta a tarjeta, el engranaje a toda máquina y un corte en seco al trabarse."""
    p = Partitura(dur, J)
    t1, t2, t3, t4, eng, cor, gra, tra = (b[k] for k in ("t1", "t2", "t3", "t4", "engranaje", "corte", "grava", "traba"))
    negra = 60 / 84
    acordes(p, 0, t1, ["Dm"], 6, 0.1, corte=800)
    # pulso de bombo desde la primera tarjeta; cada tarjeta suma una capa
    t, i = t1, 0
    while t < tra:
        capa = 1 + (t >= t2) + (t >= t3) + (t >= t4) + (t >= eng)
        if i % 2 == 0 or capa >= 4:
            p.poner(bombo(), t, 0.2 + 0.05 * capa)
        if capa >= 2 and t < cor:
            p.poner(punteo([50, 53, 57, 53][i % 4], 0.7, 1.0), t + 0.01, 0.1 + 0.02 * capa, 0.3)
        if capa >= 3 and i % 2 == 1:
            p.poner(punteo(62 + 12 * (i % 4 == 1), 0.6, 1.4), t, 0.08, -0.4)
        t += negra / (2 if capa >= 5 else 1)
        i += 1
    acordes(p, t1, eng, ["Dm", "C", "Bb", "A"], 4 * negra, 0.11)
    acordes(p, eng, cor, ["Dm", "C", "Bb", "A"], 2 * negra, 0.15, corte=1500)
    t = eng + 4 * negra
    while t < cor:
        for m, d in MELODIA[:7]:
            if t >= cor:
                break
            p.poner(quena(m, d * negra * 0.95), t, 0.17, 0.15)
            t += d * negra
    # después del corte: solo lo grave, cada vez más apretado, hasta trabarse
    tb = tt(tra - cor)
    zumbido = np.sin(2 * np.pi * np.cumsum(hz(38) * (1 + 0.06 * tb / (tra - cor))) / SR) * (0.4 + 0.6 * tb / (tra - cor)) * 0.18
    p.poner(zumbido, cor, 1.0)
    # nada después de la traba: lo que sigue es silencio
    i0 = int((tra + p.desfase) * SR)
    p.buf[:, i0:] *= np.exp(-np.arange(p.buf.shape[1] - i0) / SR * 60)
    salida = p.mezcla(2.0, 0.25)
    salida[:, i0 + int(0.3 * SR):] = 0
    return salida


def m000_s08(b, dur):
    """La cuenta: notas sueltas que cuentan, una figura que cae, un tic por año y un colchón desde la conclusión."""
    p = Partitura(dur, J)
    dec, barra, cae, pib, niv, baja, ni, sil, mit = (b[k] for k in ("decadas", "barra", "cae", "pib", "niveles", "baja", "ni", "crecer", "mitad"))
    acordes(p, 0, niv, ["Dm", "Gm"], 6, 0.09, corte=800)
    for k, t in enumerate(np.arange(dec, dec + 4.2, 4.2 / 12)):
        p.poner(punteo(62 + (k % 3) * 3, 1.0, 0.8), t, 0.1, -0.4 + 0.07 * k)
    for k, m in enumerate([74, 72, 69, 65, 62, 57, 50]):
        p.poner(punteo(m, 1.6, 1.0), cae + k * 0.11, 0.13, 0.4 - 0.12 * k)
    for t in np.arange(pib + 1, niv, 1.15):
        p.poner(punteo(81, 0.9, 1.5), t, 0.09, 0.4)
    acordes(p, niv, baja, ["Dm", "Bb", "Gm", "A"], (baja - niv) / 3, 0.12)
    acordes(p, ni, sil, ["Dm"], sil - ni, 0.1, corte=700)
    # bajo la cuenta, dos acordes en suspenso (Gm, A) que se resuelven en el colchón de la conclusión
    acordes(p, sil, mit, ["Gm", "A"], (mit - sil) / 2, 0.08, corte=700)
    p.poner(colchon([50, 57, 62, 65, 69, 74], dur - mit + 2, ataque=2.5, cierre=4, corte=1600), mit, 0.18)
    return p.mezcla(3.2, 0.38)


def m000_s09(b, dur):
    """Círculos: un ostinato de cinco notas que da vueltas; en el cartel, notas secas y una grave al final."""
    p = Partitura(dur, J)
    red, car, fra, tac, rob = (b[k] for k in ("red", "cartel", "frase", "tachar", "roba"))
    giro = [62, 65, 67, 69, 65]
    t, i = 0.3, 0
    while t < car:
        p.poner(punteo(giro[i % 5] + 12, 1.2, 1.2), t, 0.13, -0.3 + 0.15 * (i % 5))
        if t >= red and i % 5 == 0:
            p.poner(punteo(giro[0] + 24, 1.5, 1.4), t, 0.08, 0.5)
        t += 0.28
        i += 1
    acordes(p, 0, car, ["Dm", "Dm", "Gm", "Dm"], 2.8, 0.1)
    for k in range(4):
        p.poner(punteo(50 + 3 * k, 0.4, 0.4), fra + k * 0.35, 0.14)
    p.poner(colchon([50, 51, 57], 2.0, ataque=0.05, cierre=1.5, corte=900), tac, 0.13)
    p.poner(punteo(38, 4.0, 0.4), rob, 0.28)
    p.poner(colchon([38, 50], dur - rob + 1, ataque=0.05, cierre=dur - rob, corte=500), rob, 0.16)
    return p.mezcla()


def m000_s10(b, dur):
    """La serie: quena sobre la cordillera, brillo de metal, un corte en seco y la serie que arranca."""
    p = Partitura(dur, J)
    r = np.random.default_rng(1758)
    cor, hua, mer, per, otr, cap, ser = (b[k] for k in ("cordillera", "huanca", "mercurio", "perdio", "otros", "capitulos", "serie"))
    acordes(p, 0, mer, ["Dm", "Bb", "Gm", "Dm"], 4, 0.1, corte=900)
    negra = 60 / 72
    t = cor + 0.8
    frase = [(69, 1), (72, 0.5), (74, 1.5), (72, 0.5), (69, 0.5), (67, 1), (65, 1), (62, 2)]
    for m, d in frase:
        if t >= mer:
            break
        p.poner(quena(m, d * negra * 0.95), t, 0.17, 0.1)
        t += d * negra
    p.poner(bombo(), hua, 0.3)
    t = mer
    while t < per:
        p.poner(punteo(r.choice([86, 88, 91, 93]), 1.4, 1.8), t, 0.07, r.uniform(-0.8, 0.8))
        t += r.uniform(0.15, 0.4)
    # el corte: nada entre "perdió" y la línea; después, un pulso grave que marca el paso del tiempo
    # mientras la cámara la recorre, y una nota más arriba al llegar a cada nombre
    for t in np.arange(otr, cap, 1.0):
        p.poner(punteo(38, 1.2, 0.4), t, 0.12)
    for k in ("nombre_1", "nombre_2", "nombre_3", "nombre_4", "nombre_5", "nombre_6"):
        if k in b:
            p.poner(punteo(50, 1.6, 0.6), b[k], 0.1)
    compas = 4 * (60 / 80)
    for i, t0 in enumerate(np.arange(cap, dur, compas)):
        acorde = ACORDES[["Dm", "C", "Bb", "A"][i % 4]]
        p.poner(colchon(acorde, compas + 1.5, ataque=0.4, cierre=1.2), t0, 0.13)
        for bt, g in ((0, 0.5), (2, 0.32), (2.5, 0.22)):
            p.poner(bombo(), t0 + bt * 60 / 80, g)
        for c in range(8):
            for j, m in enumerate(acorde[1:]):
                p.poner(punteo(m + 12, 1.1, 1.3), t0 + c * 60 / 160 + j * 0.012, 0.08 if c % 2 else 0.11, -0.3 + 0.3 * j)
    p.poner(colchon([50, 57, 62, 65, 69], 5, ataque=0.3, cierre=4), ser, 0.14)
    salida = p.mezcla()
    a, z = int((per + J) * SR), int((otr + J - 0.3) * SR)
    salida[:, a:z] *= 0.0  # el corte a negro también es un corte de música
    return salida


# El tema del canal: la firma de la serie. Quena en re menor sobre bombo y charango.
TEMA = [(69, 1), (72, 1), (74, 2), (77, 1), (76, 0.5), (74, 0.5), (72, 2),
        (69, 1), (72, 1), (74, 1), (72, 0.5), (69, 0.5), (67, 1), (65, 1), (62, 2)]


def musica_tema(bpm=80):
    """Tema del canal: dos compases de bombo y rasgueo, la quena con la frase y un acorde que queda."""
    negra = 60 / bpm
    compas = 4 * negra
    total = compas * 5
    p = Partitura(total + 8, RAMPA)
    for i, t0 in enumerate(np.arange(0, total, compas)):
        acorde = ACORDES[["Dm", "Dm", "Bb", "C", "Dm"][i % 5]]
        p.poner(colchon(acorde, compas + 1.6, ataque=0.5, cierre=1.2), t0, 0.12)
        for bt, g in ((0, 0.5), (2, 0.3), (2.5, 0.22)):
            p.poner(bombo(), t0 + bt * negra, g)
        for c in range(8):
            for j, m in enumerate(acorde[1:]):
                p.poner(punteo(m + 12, 1.1, 1.3), t0 + c * negra / 2 + j * 0.012, 0.08 if c % 2 else 0.12, -0.3 + 0.3 * j)
    t = compas * 0.75
    for m, d in TEMA:
        p.poner(quena(m, d * negra * 0.96), t, 0.22, 0.12)
        t += d * negra
    p.poner(colchon([50, 57, 62, 65, 69], 7, ataque=0.2, cierre=5), total, 0.18)
    p.poner(punteo(62, 5, 0.7), total, 0.2)
    p.poner(bombo(1.2), total, 0.45)
    return p.mezcla(3.0, 0.32)


def m000_s11(b, dur):
    """Cierre: el tema del canal entra con el negro."""
    return musica_tema()


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


def amb_hospital(d=32):
    """Habitación de hospital de noche: aire acondicionado, zumbido eléctrico leve, ciudad muy lejos."""
    n = int(d * SR)
    t = tt(d)
    aire = filtro(ruido_rosa(n), bajo=80, alto=1200) * 0.6
    zumbido = (np.sin(2 * np.pi * 120 * t) + 0.3 * np.sin(2 * np.pi * 240 * t)) * 0.025
    lejos = filtro(ruido_rosa(n), alto=260) * (0.6 + 0.4 * lfo(d, 0.05))
    buf = estereo(n)
    poner(buf, aire / np.max(np.abs(aire)) * 0.35 + zumbido, 0, 1.0)
    poner(buf, lejos / np.max(np.abs(lejos)) * 0.25, 0, 1.0, 0.3)
    return bucle(buf)


def sfx_lapiz(d=0.7):
    """Lápiz sobre papel: grano más grueso y más grave que la pluma."""
    t = tt(d)
    s = filtro(rng.standard_normal(len(t)), bajo=900, alto=5000)
    grano = (rng.random(len(t)) < 0.04) * rng.uniform(0.5, 1.5, len(t))
    grano = filtro(grano, bajo=1500, alto=6000)
    trazo = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * rng.uniform(5, 8) * t))
    env = np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.12)
    return (s * 0.35 + grano * 2.2) * trazo * env


def sfx_afiche():
    """Afiche que se pega en un muro: palmada sorda y el papel que se asienta."""
    t = tt(0.6)
    palmada = filtro(rng.standard_normal(len(t)), bajo=150, alto=2500) * np.exp(-t * 35)
    cuerpo = np.sin(2 * np.pi * np.cumsum(110 + 40 * np.exp(-t * 40)) / SR) * np.exp(-t * 18) * 0.7
    papel = np.zeros(len(t))
    h = sfx_hoja()[: len(t)]
    papel[: len(h)] = h
    return palmada + cuerpo + papel * 0.5


def sfx_saco():
    """Saco que cae sobre cubierta: golpe sordo y grano."""
    t = tt(0.5)
    golpe = np.sin(2 * np.pi * np.cumsum(60 + 30 * np.exp(-t * 30)) / SR) * np.exp(-t * 14)
    grano = filtro(rng.standard_normal(len(t)), bajo=400, alto=3000) * np.exp(-t * 22) * 0.35
    return golpe + grano


def _moneda(f0):
    t = tt(0.9)
    parciales = [1, 2.76, 5.4, 8.93]
    s = sum(np.sin(2 * np.pi * f0 * p * t + rng.uniform(0, 6)) * np.exp(-t * (6 + 5 * i)) / (i + 1) for i, p in enumerate(parciales))
    return s * np.minimum(1, t / 0.001)


def sfx_monedas():
    """Monedas que caen unas sobre otras."""
    buf = estereo(int(1.4 * SR))
    for tm in np.sort(rng.uniform(0, 0.7, 9)):
        poner(buf, _moneda(rng.uniform(2200, 3600)) * rng.uniform(0.2, 0.45), tm, 1.0, rng.uniform(-0.5, 0.5))
    return reverb(buf, 0.8, 0.2)


def sfx_borrar(d=0.8):
    """Goma de borrar: frotado de ida y vuelta."""
    t = tt(d)
    s = filtro(rng.standard_normal(len(t)), bajo=300, alto=2500)
    vaiven = np.abs(np.sin(2 * np.pi * 4.5 * t)) ** 0.7
    return s * vaiven * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.1) * 0.6


def sfx_metal():
    """Choque metálico pequeño (platillo de balanza, barra de plata)."""
    t = tt(1.6)
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in ((1220, 4), (1876, 6), (2934, 9), (4410, 13)))
    return reverb(np.array([s, s]) * 0.3, 1.2, 0.25)


def sfx_carta():
    """Carta que se da vuelta: soplo corto y el chasquido del cartón."""
    t = tt(0.35)
    aire = filtro(rng.standard_normal(len(t)), bajo=800, alto=6000) * np.sin(np.pi * np.clip(t / 0.25, 0, 1)) ** 2 * 0.4
    chasquido = filtro(rng.standard_normal(len(t)), bajo=2000, alto=8000) * np.exp(-np.maximum(0, t - 0.22) * 90) * (t > 0.22)
    return aire + chasquido * 0.8


def sfx_engranaje(d=4.0):
    """Engranaje girando (en bucle): un diente cada 1/6 s, zumbido grave y un chirrido."""
    n = int(d * SR)
    t = tt(d)
    buf = estereo(n)
    for k, tm in enumerate(np.arange(0, d, 1 / 6)):
        diente = filtro(rng.standard_normal(int(0.05 * SR)), bajo=600 if k % 2 else 900, alto=4500) * np.exp(-tt(0.05) * 90)
        poner(buf, diente * 0.5, tm, 1.0, -0.2)
    zumbido = (np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 110 * t)) * 0.12 * (0.8 + 0.2 * lfo(d, 1.5))
    chirrido = filtro(rng.standard_normal(n), bajo=2800, alto=3400, orden=8) * (lfo(d, 0.5) ** 6) * 0.25
    poner(buf, zumbido + chirrido, 0, 1.0)
    return buf


def sfx_gota():
    """Gota que cae: «plip» que sube de tono y un salpicón chico."""
    t = tt(0.4)
    plip = np.sin(2 * np.pi * np.cumsum(700 + 1400 * np.minimum(1, t / 0.06)) / SR) * np.exp(-t * 28)
    salpica = filtro(rng.standard_normal(len(t)), bajo=3000, alto=9000) * np.exp(-t * 60) * 0.25
    return reverb(np.array([plip + salpica] * 2) * 0.6, 0.9, 0.25)


def sfx_grava(d=1.3):
    """Grava que cae entre los dientes: cientos de golpecitos."""
    n = int(d * SR)
    buf = estereo(n)
    for tm in np.sort(rng.uniform(0, d - 0.1, 260) ** 1.3):
        piedra = filtro(rng.standard_normal(int(0.02 * SR)), bajo=rng.uniform(800, 2500), alto=7000) * np.exp(-tt(0.02) * 220)
        poner(buf, piedra * rng.uniform(0.05, 0.25), tm, 1.0, rng.uniform(-0.6, 0.6))
    return buf


def sfx_traba():
    """El engranaje se traba: el único golpe fuerte del video. Metal grave, chirrido y cola larga."""
    t = tt(3.5)
    golpe = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t * k) for f, k in ((62, 1.8), (97, 2.5), (151, 3.4), (233, 4.6), (419, 7)))
    sub = np.sin(2 * np.pi * np.cumsum(38 + 30 * np.exp(-t * 12)) / SR) * np.exp(-t * 2.2) * 1.2
    chirrido = filtro(rng.standard_normal(len(t)), bajo=1800, alto=3200, orden=6) * np.exp(-t * 6) * 0.5
    crujido = filtro(rng.standard_normal(len(t)), bajo=300, alto=5000) * np.exp(-t * 25) * 0.8
    s = golpe * 0.5 + sub + chirrido + crujido
    return reverb(np.array([s, s]), 3.0, 0.3)


def sfx_golpe_tecla():
    """Tecla de máquina golpeada con fuerza (los signos de interrogación)."""
    t = tt(0.12)
    golpe = filtro(rng.standard_normal(len(t)), bajo=600, alto=5000) * np.exp(-t * 70)
    cuerpo = np.sin(2 * np.pi * 120 * t) * np.exp(-t * 40)
    return golpe + cuerpo


def sfx_crt():
    """Televisor de tubo que se enciende: chasquido, zumbido que sube y un soplo de estática."""
    t = tt(1.0)
    chasquido = filtro(rng.standard_normal(len(t)), bajo=100, alto=3000) * np.exp(-t * 50)
    zumbido = np.sin(2 * np.pi * np.cumsum(80 + 120 * np.minimum(1, t / 0.4)) / SR) * np.exp(-t * 3) * 0.3
    estatica = filtro(rng.standard_normal(len(t)), bajo=1500, alto=9000) * np.clip((t - 0.2) / 0.3, 0, 1) * np.exp(-np.maximum(0, t - 0.5) * 4) * 0.3
    return chasquido + zumbido + estatica


def sfx_estatica(d=4.0):
    """Estática de televisor (en bucle)."""
    n = int(d * SR)
    s = filtro(rng.standard_normal(n), bajo=400, alto=9000) * (0.85 + 0.15 * lfo(d, 3.7))
    buf = estereo(n)
    poner(buf, s / np.max(np.abs(s)) * 0.5, 0, 1.0)
    return bucle(buf, 0.5)


def sfx_cartel():
    """Cartel que se planta: golpe de poste en la tierra y el tablero que vibra."""
    t = tt(1.2)
    golpe = np.sin(2 * np.pi * np.cumsum(70 + 50 * np.exp(-t * 25)) / SR) * np.exp(-t * 8)
    tablero = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 9) for f in (310, 523, 788)) * 0.15
    tierra = filtro(rng.standard_normal(len(t)), bajo=200, alto=2000) * np.exp(-t * 18) * 0.4
    return golpe + tablero + tierra


# ---------------------------------------------------------------- escribir

def sonoridad(archivo: Path) -> float:
    """Sonoridad integrada (LUFS) de un archivo, medida con ffmpeg (EBU R128)."""
    salida = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(archivo), "-af", "ebur128", "-f", "null", "-"],
                            capture_output=True, text=True).stderr
    lineas = [l for l in salida.splitlines() if l.strip().startswith("I:")]
    return float(lineas[-1].split()[1])


def guardar(st, ruta: Path, kbps=128, normalizar=-1.0, lufs=None):
    """Escribe un mp3. Con `lufs`, además lo deja a esa sonoridad (para que los ambientes suenen parejos)."""
    if ruta.exists() and not FORZAR:
        print("ya existe", ruta.relative_to(ROOT))
        return
    if callable(st):  # se genera recién aquí: lo que ya existe no gasta tiempo
        st = st()
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
        filtros = []
        if lufs is not None:
            filtros = ["-af", f"volume={lufs - sonoridad(wav):.2f}dB"]
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), *filtros, "-c:a", "libmp3lame", "-b:a", f"{kbps}k",
                        str(ruta)], check=True)
    print("ok", ruta.relative_to(ROOT))


def compartido():
    """Efectos y ambientes: sirven para cualquier video."""
    a = PUBLIC / "compartido" / "audio" / "ambiente"
    for nombre, fn in [("ciudad", amb_ciudad), ("agua", amb_agua), ("mar", amb_mar),
                       ("cuarto", amb_cuarto), ("viento", amb_viento)]:
        guardar(fn(), a / f"{nombre}.mp3", kbps=96, normalizar=-3, lufs=AMBIENTE_LUFS)
    s = PUBLIC / "compartido" / "audio" / "sfx"
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
    # fase 2 del video 000 (agregados al final para no cambiar los anteriores)
    guardar(amb_hospital(), a / "hospital.mp3", 96, -3, lufs=AMBIENTE_LUFS)
    for nombre, fn, kbps, norm in [("lapiz", sfx_lapiz, 96, -3), ("afiche", sfx_afiche, 96, -2), ("saco", sfx_saco, 96, -3),
                                   ("monedas", sfx_monedas, 96, -3), ("borrar", sfx_borrar, 96, -3), ("metal", sfx_metal, 96, -3),
                                   ("carta", sfx_carta, 96, -3), ("engranaje", sfx_engranaje, 96, -3), ("gota", sfx_gota, 96, -3),
                                   ("grava", sfx_grava, 96, -2), ("traba", sfx_traba, 128, -0.5), ("golpe-tecla", sfx_golpe_tecla, 96, -2),
                                   ("crt", sfx_crt, 96, -3), ("estatica", sfx_estatica, 96, -4), ("cartel", sfx_cartel, 96, -2)]:
        guardar(fn(), s / f"{nombre}.mp3", kbps, norm)


def musica_000_quiroz():
    """Música del video 000: una pista por escena, compuesta sobre sus beats."""
    m = PUBLIC / "videos" / "000-quiroz" / "musica"
    tiempos = tiempos_video("000-quiroz")
    pistas = [("s00", "s00-gancho", m001_s00), ("s01", "s01-entrada", m000_s01), ("s02", "s02-nadador", m000_s02), ("s03", "s03-generacion", m000_s03),
              ("s04", "s04-mecanismo", m000_s04), ("s05", "s05-medir", m000_s05), ("s06", "s06-pregunta", m000_s06),
              ("s07", "s07-objeciones", m000_s07), ("s08", "s08-cuenta", m000_s08), ("s09", "s09-circulos", m000_s09),
              ("s10", "s10-serie", m000_s10), ("s11", "s11-tema", m000_s11)]
    for escena, nombre, fn in pistas:
        beats, dur = tiempos[escena]
        guardar(lambda fn=fn, beats=beats, dur=dur: fn(beats, dur), m / f"{nombre}.mp3")


def m001_s02(b, dur):
    """El nadador, versión 0·1: la página en calma; el braceo entra con el agua («nadador»), frena con el carril y se abre en la palabra."""
    p = Partitura(dur, J)
    pis, frenar, renglon, palabra = b["piscina"], b["frenar"], b["renglon"], b["palabra"]
    prog = ["Dm", "Bb", "F", "C"]
    acordes(p, 0, palabra, prog, 4.0, 0.12)
    t, i = pis, 0
    while t < renglon + 2:
        acorde = ACORDES[prog[int(t // 4.0) % 4]]
        nota = acorde[1:][i % 3] + 12 + (12 if i % 6 == 5 else 0)
        p.poner(punteo(nota, 1.8, 1.1), t, 0.16, -0.3 + 0.2 * (i % 4))
        frena = min(1.0, max(0.0, (t - frenar) / (renglon - frenar)))
        t += 0.33 + 0.6 * frena ** 1.5
        i += 1
    p.poner(colchon([53, 57, 60, 65, 69], dur - palabra + 2, ataque=1.5, cierre=3, corte=1500), palabra - 0.3, 0.2)
    p.poner(punteo(77, 4.0, 0.8), palabra + 0.2, 0.18, 0.2)
    return p.mezcla()


def m001_s03(b, dur):
    """Su generación: calma en la lista, el ostinato de época en los afiches y, con la pregunta, un acorde que no resuelve."""
    p = Partitura(dur, J)
    af, desp = b["afiches"], b["despegue"]
    acordes(p, 0, af, ["Dm", "Gm"], 5.0, 0.12)
    negra = 60 / 100
    t, i = af, 0
    patron = [38, 38, 41, 38, 45, 38, 48, 38]
    while t < desp - 3.5:
        p.poner(punteo(patron[i % 8], 0.9, 0.5), t, 0.2, -0.1)
        if i % 4 == 0:
            p.poner(bombo(), t, 0.22)
        t += negra / 2
        i += 1
    acordes(p, af, desp - 3.0, ["Dm", "Gm", "Bb", "A"], 4 * negra * 2, 0.11)
    # la pregunta: el pulso se va y queda una cuarta suspendida, sin resolver
    p.poner(colchon([50, 55, 57, 62], dur - desp + 3.0, ataque=1.2, cierre=2.0), desp - 3.0, 0.12)
    return p.mezcla()


def m001_s04(b, dur):
    """Larga duración: cada capa entra con su frase (notas rápidas, acordes lentos, un bordón que no se va); la palabra, sola sobre el bordón."""
    p = Partitura(dur, J)
    r = np.random.default_rng(1949)
    c1, c2, c3, baj, pal, sub = (b[k] for k in ("capa1", "capa2", "capa3", "bajar", "palabra", "subir"))
    acordes(p, 0, c1, ["Dm"], 6.0, 0.08, corte=1400)
    # arriba: notas nerviosas desde la primera capa; se callan cuando la cámara baja y vuelven, más lejos, al subir
    t = c1
    while t < dur:
        if t < baj or t > sub + 1.0:
            p.poner(punteo(r.choice(RE_MENOR) + 12, 0.7, 1.6), t, 0.07 if t < baj else 0.04, r.uniform(-0.8, 0.8))
        t += 0.16
    # al medio: acordes lentos desde la segunda
    acordes(p, c2, baj + 1.0, ["Dm", "Bb", "Gm", "A"], 4.0, 0.1, corte=1400)
    acordes(p, sub, dur, ["Dm", "Bb", "F", "Dm"], 4.0, 0.1, corte=1400)
    # abajo: el bordón, desde la tercera, que ya no se va
    tb = tt(dur - c3 + 3)
    bordon = (np.sin(2 * np.pi * hz(38) * tb) + 0.5 * np.sin(2 * np.pi * hz(45) * tb)) * np.minimum(1, tb / 3) * 0.16
    p.poner(bordon, c3, 1.0)
    # la palabra: una quinta alta, quieta
    p.poner(colchon([62, 69, 74], sub - pal + 1.0, ataque=0.8, cierre=1.5), pal - 0.2, 0.1)
    return p.mezcla(3.0, 0.36)


def m001_s05(b, dur):  # (el puente: hoy es la escena s06 del 0·1)
    """Puente al 0·2: el comienzo del mecanismo (mar abierto, la plata que entra) y la pregunta en el aire."""
    p = Partitura(dur, J)
    r = np.random.default_rng(1850)
    fl, con = b["flecha"], b["consolidacion"]
    acordes(p, 0, fl, ["Dm", "Bb"], 6.0, 0.1, corte=1600, octava=12)
    t = 0.8
    while t < fl:
        p.poner(punteo(r.choice(RE_MENOR) + 12, 2.5, 1.3), t, 0.1, r.uniform(-0.7, 0.7))
        t += r.uniform(0.9, 1.6)
    # la plata que entra: el mismo pulso grave del mecanismo, hasta el sello
    t = fl
    while t < con + 0.6:
        p.poner(punteo(38 if int((t - fl) * 2) % 2 == 0 else 45, 0.8, 0.5), t, 0.18)
        t += 0.6
    acordes(p, fl, con + 1.2, ["Dm", "Gm"], 4.0, 0.1)
    # la pregunta queda sola: un acorde suspendido que no resuelve (la respuesta es el próximo episodio)
    p.poner(colchon([50, 55, 57], dur - con - 1.2, ataque=0.6, cierre=1.5), con + 1.2, 0.11)
    return p.mezcla()


def m001_s00(b, dur):
    """El gancho: un pulso grave con cada año que pasa, las monedas que caen en notas, un acorde
    oscuro en «el sistema» que se alarga hacia la colonia, una nota sola en «lo calculó» y, sobre el
    libro, todo se va apagando hasta el silencio (la escena siguiente entra sin música)."""
    p = Partitura(dur, J)
    an, rojo, sol, cae, cua, sue, sis, col, cal, lib = (b[k] for k in ("anio", "rojo", "soles", "caen", "cuatro", "sueltos", "sistema", "colonia", "calculo", "libro"))
    # debajo de los años, un colchón tenso que no resuelve
    acordes(p, an, sol - 0.4, ["Dm", "Bb", "Gm", "A"], (sol - an) / 4, 0.09, corte=900)
    # desde la tajada roja: el pulso, uno por año que cae
    t = rojo + 0.5
    while t < sol - 1.0:
        p.poner(bombo(0.7), t + 0.5, 0.32)
        t += 0.42
    # las monedas: notas que bajan
    for k, m in enumerate([69, 65, 62]):
        p.poner(punteo(m, 1.6, 1.1), cae + k * 0.09 + 0.3, 0.14, 0.3 - 0.2 * k)
    p.poner(punteo(57, 2.4, 0.8), cua + 0.8, 0.11, -0.2)
    acordes(p, sol, sue - 0.3, ["Dm"], sue - sol, 0.07, corte=800)
    # el sistema: un acorde grave que entra y se queda, y crece cuando la franja vuelve a la colonia
    p.poner(colchon([38, 50, 57, 62], cal - sis + 1.5, ataque=0.4, cierre=1.5, corte=700), sis, 0.17)
    p.poner(colchon([33, 45, 52], cal - col + 1.0, ataque=1.0, cierre=1.2, corte=500), col, 0.13)
    # lo calculó: una nota sola, arriba
    p.poner(punteo(74, 3.0, 1.2), cal + 0.1, 0.12, 0.2)
    # el libro: un acorde menor que se apaga despacio hasta el silencio
    p.poner(colchon([50, 57, 62, 65], dur - lib, ataque=0.8, cierre=dur - lib - 0.6, corte=1200), lib, 0.13)
    return p.mezcla()


def musica_001_el_hombre():
    """Música del 0·1: las escenas que vienen de 000 conservan su pista (compuesta sobre los mismos beats)."""
    m = PUBLIC / "videos" / "001-el-hombre" / "musica"
    tiempos = tiempos_video("001-el-hombre")
    pistas = [("s00", "s00-gancho", m001_s00), ("s01", "s01-entrada", m000_s01), ("s02", "s02-nadador", m001_s02), ("s03", "s03-epoca", m001_s03),
              ("s04", "s04-capas", m001_s04), ("s05", "s05-medir", m000_s05), ("s06", "s06-puente", m001_s05),
              ("s07", "s07-tema", m000_s11)]
    for escena, nombre, fn in pistas:
        beats, dur = tiempos[escena]
        guardar(lambda fn=fn, beats=beats, dur=dur: fn(beats, dur), m / f"{nombre}.mp3")


MUSICA = {"000-quiroz": musica_000_quiroz, "001-el-hombre": musica_001_el_hombre}


def main(que: str = "todo"):
    if que in ("todo", "compartido"):
        compartido()
    for video, fn in MUSICA.items():
        if que in ("todo", video):
            fn()
    if que not in ("todo", "compartido", *MUSICA):
        raise SystemExit(f"No sé generar «{que}». Opciones: todo, compartido, {', '.join(MUSICA)}")


if __name__ == "__main__":
    pedidos = [a for a in sys.argv[1:] if not a.startswith("--")]
    main(pedidos[0] if pedidos else "todo")
