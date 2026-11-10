"""Narración de ElevenLabs con una toma por escena (notas de Gerson del 2026-11-10).

    python scripts/narracion.py 001-el-hombre            → todas las escenas
    python scripts/narracion.py 001-el-hombre s02 s03    → solo esas

Lee videos/<video>/narracion.json (voz, modelo, ajustes, el texto de cada frase con sus etiquetas de
emoción y los «cortes»: dónde se parte la toma porque el guion pide una pausa larga) y la voz
provisional (voz-provisional/tiempos.json: dónde va cada frase y cuánto respira).

Por escena:
1. Genera una sola toma (o una por tramo si hay un corte). Las tomas quedan en
   public/videos/<video>/voz-pruebas/tomas/ (fuera de git) y no se regeneran si ya existen:
   borrar una toma es la manera de pedir otra.
2. Une los tramos con el aire de la propia toma (nunca silencio digital).
3. Transcribe con tiempos por palabra y empareja cada palabra con el guion: así sabe dónde empieza y
   termina cada frase, y avisa si falta o sobra algo.
4. Alarga los respiros (pausas del guion de 1,4 s o más) con el aire de la toma, si la voz los acortó.
   Las pausas cortas quedan como las dijo la voz.
5. Normaliza la escena entera a −16 LUFS y la escribe en voz/<escena>.mp3.
6. Guarda los tiempos nuevos de cada frase en videos/<video>/narracion_tiempos.json.

Después, `python scripts/beats_a_la_voz.py <video>` mueve los beats de escenas.json a esos tiempos.
La clave de ElevenLabs la pone el proxy de la sesión (o ELEVENLABS_API_KEY en la laptop).
"""
import json, os, re, subprocess, sys, unicodedata, difflib
from pathlib import Path
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
SR = 44100
RESPIRO = 1.4          # una pausa del guion desde este largo es un respiro: se garantiza
API = "https://api.elevenlabs.io/v1"
CLAVE = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
NUM = {"1820": "mil ochocientos veinte", "1850": "mil ochocientos cincuenta", "1956": "mil novecientos cincuenta y seis",
       "1974": "mil novecientos setenta y cuatro", "2013": "dos mil trece", "80": "ochenta", "19": "diecinueve",
       "15": "quince", "10": "diez", "3": "tres", "4": "cuatro", "%": "por ciento"}


def curl(*args):
    return subprocess.run(["curl", "-sS", "-H", f"xi-api-key: {CLAVE}", *args], capture_output=True, text=True)


def leer(f):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                        capture_output=True).stdout, np.float32).copy()


def escribir(x, f, kbps=None):
    args = ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-"]
    args += (["-c:a", "libmp3lame", "-b:a", f"{kbps}k"] if kbps else []) + [str(f)]
    subprocess.run(args, input=x.astype(np.float32).tobytes(), check=True)


def lufs(f):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(f), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float([l for l in r.splitlines() if l.strip().startswith("I:")][-1].split()[1])


def tokens(s):
    s = s.lower().replace("a dónde", "adónde")
    for k, v in NUM.items():
        s = s.replace(k, f" {v} ")
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-zñ]+", s)


def sin_relleno(x):
    """Quita solo el silencio digital que el MP3 deja en los bordes; el aire de la toma se queda."""
    nz = np.where(np.abs(x) > 1e-5)[0]
    return x[nz[0]:nz[-1] + 1] if len(nz) else x


def aire(muestra, segundos):
    """El tramo más quieto de la toma, repetido con fundidos: el piso de la misma voz."""
    w = int(0.25 * SR)
    r = [np.sqrt((muestra[i:i + w] ** 2).mean()) for i in range(0, max(1, len(muestra) - w), w // 2)]
    j = int(np.argmin(r)) * (w // 2)
    p = muestra[j:j + w]
    k = int(0.05 * SR)
    f = np.linspace(0, 1, k)
    out = p.copy()
    while len(out) < segundos * SR + k:
        out = np.concatenate([out[:-k], out[-k:] * (1 - f) + p[:k] * f, p[k:]])
    return out[: int(segundos * SR)]


def toma(cfg, texto, destino):
    if destino.exists() and destino.stat().st_size > 3000:
        return
    cuerpo = {"text": texto, "model_id": cfg["modelo"], "voice_settings": cfg["voice_settings"], "language_code": "es"}
    r = curl("-X", "POST", f"{API}/text-to-speech/{cfg['voz']}?output_format=mp3_44100_128", "-H", "Content-Type: application/json",
             "-d", json.dumps(cuerpo), "-o", str(destino), "-w", "%{http_code}")
    if r.stdout != "200":
        msg = destino.read_bytes()[:300] if destino.exists() else b""
        destino.unlink(missing_ok=True)
        raise SystemExit(f"ElevenLabs respondió {r.stdout}: {msg!r}")


EVENTOS = []   # lo que no es palabra ni respiración (carraspeos, risas, golpes): se avisa


def palabras(f):
    r = curl("-X", "POST", f"{API}/speech-to-text", "-F", "model_id=scribe_v1", "-F", "language_code=spa",
             "-F", "timestamps_granularity=word", "-F", "tag_audio_events=true", "-F", f"file=@{f}")
    d = json.loads(r.stdout)
    EVENTOS.clear()
    EVENTOS.extend((w["text"], w["start"], w["end"]) for w in d["words"] if w.get("type") == "audio_event"
                   and not re.search(r"respir|breath|inhal|exhal|suspir|sigh", w["text"], re.I))
    PALABRAS[:] = [(w["start"], w["end"]) for w in d["words"] if w.get("type") == "word"]
    return [(tk, w["start"], w["end"]) for w in d["words"] if w.get("type") == "word" for tk in tokens(w["text"])]


PALABRAS = []


def limpiar_eventos(x):
    """Un carraspeo (o un ruido) que cae en una pausa se reemplaza por el aire de la toma, con fundidos
    de 30 ms. Si pisa una palabra, no se toca: se avisa para regenerar."""
    quedan = []
    for txt, a, b in EVENTOS:
        antes = [we for ws, we in PALABRAS if ws < a]
        despues = [ws for ws, we in PALABRAS if ws > a]
        a0 = max(a - 0.06, (max(antes) + 0.03) if antes else 0.0)
        b0 = min(b + 0.08, (min(despues) - 0.03) if despues else b + 0.08)
        if b0 - a0 < 0.1 or any(ws < b0 - 0.02 and we > a0 + 0.02 for ws, we in PALABRAS):
            quedan.append((txt, a))
            continue
        i, j = int(a0 * SR), min(len(x), int(b0 * SR))
        relleno = aire(np.concatenate([x[:i], x[j:]]), (j - i) / SR + 0.01)[: j - i]
        k = min(int(0.03 * SR), (j - i) // 2)
        f = np.linspace(0, 1, k)
        relleno[:k] = x[i:i + k] * (1 - f) + relleno[:k] * f
        relleno[-k:] = relleno[-k:] * (1 - f) + x[j - k:j] * f
        x[i:j] = relleno
    return x, quedan


def frases_en_la_toma(x, frases, tmp):
    """Dónde empieza y termina cada frase del guion dentro de la toma x."""
    escribir(x, tmp, kbps=128)
    oido = palabras(tmp)
    esp = [(tk, i) for i, f in enumerate(frases) for tk in tokens(f["texto"])]
    sm = difflib.SequenceMatcher(None, [e[0] for e in esp], [o[0] for o in oido], autojunk=False)
    mapa = {a + k: b + k for a, b, n in sm.get_matching_blocks() for k in range(n)}
    out = []
    for i, f in enumerate(frases):
        idx = [mapa[j] for j, (_, fi) in enumerate(esp) if fi == i and j in mapa]
        total = sum(1 for e in esp if e[1] == i)
        if not idx:
            raise SystemExit(f"la frase «{f['texto']}» no aparece en la toma")
        out.append({"desde": oido[idx[0]][1], "hasta": oido[idx[-1]][2], "cubre": len(idx) / total})
    return out, sm.ratio()


def escena(video, s, cfg, prov):
    H = RAIZ / "public" / "videos" / video
    tomas = H / "voz-pruebas" / "tomas"
    tomas.mkdir(parents=True, exist_ok=True)
    fr_prov = prov[s]["frases"]
    textos = cfg["frases"][s]
    textos = [x if isinstance(x, str) else x[0] for x in textos]
    cortes = sorted(cfg.get("cortes", {}).get(s, {}).items(), key=lambda kv: int(kv[0]))   # {"7": 6.65}: después de la frase 7
    tramos, ini = [], 0
    for fin, pausa in [(int(k), v) for k, v in cortes] + [(len(textos) - 1, None)]:
        tramos.append((ini, fin, pausa))
        ini = fin + 1
    partes = []
    for n, (a, b, pausa) in enumerate(tramos):
        f = tomas / f"{s}-toma{n}.mp3"
        toma(cfg, " ".join(textos[a:b + 1]), f)
        x = sin_relleno(leer(f))
        # la toma de ElevenLabs suele terminar con un resto de sonido: sin fundido, el paso al aire
        # (o al final de la escena) se oye como un corte
        a_, b_ = int(0.05 * SR), int(0.15 * SR)
        x[:a_] *= np.linspace(0, 1, a_)
        x[-b_:] *= np.linspace(1, 0, b_)
        partes.append(x)
        if pausa:
            partes.append(aire(x, pausa))
    x = np.concatenate(partes)
    tmp = Path("/tmp") / f"narracion-{s}.mp3"
    pos, ratio = frases_en_la_toma(x, fr_prov, tmp)
    x, eventos_pisados = limpiar_eventos(x)
    limpiados = len(EVENTOS) - len(eventos_pisados)
    # respiros: si el guion pide 1,4 s o más y la toma respiró menos, se agrega aire en medio de la pausa
    insertos = []
    for i in range(len(fr_prov) - 1):
        quiere = fr_prov[i + 1]["desde"] - fr_prov[i]["hasta"]
        tiene = pos[i + 1]["desde"] - pos[i]["hasta"]
        if quiere >= RESPIRO and tiene < quiere:
            insertos.append(((pos[i]["hasta"] + pos[i + 1]["desde"]) / 2, quiere - tiene))
    trozos, prev, corrida = [], 0, 0.0
    for t, extra in insertos:
        c = int(t * SR)
        trozos += [x[prev:c], aire(x, extra)]
        prev = c
    trozos.append(x[prev:])
    x = np.concatenate(trozos)
    for f in pos:   # corre los tiempos por lo agregado antes de cada frase
        f["desde"] += sum(e for t, e in insertos if t < f["desde"])
        f["hasta"] += sum(e for t, e in insertos if t < f["hasta"])
    # entrada: la primera palabra donde la ponía la provisional (0,3 s; en s07, después de su pausa)
    lead = max(0.0, fr_prov[0]["desde"] - pos[0]["desde"])
    x = np.concatenate([np.zeros(int(lead * SR), np.float32), x, np.zeros(int(0.15 * SR), np.float32)])
    for f in pos:
        f["desde"] = round(f["desde"] + lead, 3)
        f["hasta"] = round(f["hasta"] + lead, 3)
    wav = Path("/tmp") / f"narracion-{s}.wav"
    escribir(x, wav)
    dst = H / "voz" / f"{s}.mp3"
    dst.parent.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-af", f"volume={-16 - lufs(wav):.2f}dB",
                    "-c:a", "libmp3lame", "-b:a", "128k", str(dst)], check=True)
    dur = len(x) / SR
    faltan = [fr_prov[i]["texto"] for i, f in enumerate(pos) if f["cubre"] < 0.9]
    print(f"{s}: {dur:6.2f} s (provisional {prov[s]['duracion']:6.2f}) · guion {ratio * 100:.0f} % · "
          f"{len(insertos)} respiro(s) alargado(s)" + (f" · REVISAR: {faltan}" if faltan else "")
          + (f" · {limpiados} ruido(s) limpiado(s)" if limpiados else "")
          + (f" · REGENERAR, ruido sobre una palabra: {eventos_pisados}" if eventos_pisados else ""))
    return {"duracion": round(dur, 3), "frases": [{"texto": fr_prov[i]["texto"], **f} for i, f in enumerate(pos)]}


def main(video, escenas):
    V = RAIZ / "videos" / video
    cfg = json.loads((V / "narracion.json").read_text(encoding="utf-8"))
    prov = json.loads((RAIZ / "public" / "videos" / video / "voz-provisional" / "tiempos.json").read_text(encoding="utf-8"))
    salida = V / "narracion_tiempos.json"
    tiempos = json.loads(salida.read_text(encoding="utf-8")) if salida.exists() else {}
    for s in escenas or list(cfg["frases"]):
        tiempos[s] = escena(video, s, cfg, prov)
        salida.write_text(json.dumps(tiempos, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
