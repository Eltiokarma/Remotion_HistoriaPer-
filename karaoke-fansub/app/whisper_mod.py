"""Modo automático con faster-whisper (opcional: requirements-whisper.txt).

Dos usos:
  - ``transcribe``: video hablado → versos y tiempos por palabra (repartidos entre sílabas).
  - ``align``: canción con la letra ya pegada → alinea las palabras de la letra con
    las que reconoció Whisper. Si la confianza es baja lo dice y no inventa tiempos.
"""
from __future__ import annotations

import os
import re
import subprocess
import unicodedata
from difflib import SequenceMatcher

from .jobs import Cancelled, Job
from .lyrics import parse_lyrics, syllabify_word
from .paths import ROOT

MODELS_DIR = ROOT / "modelos"
MODELS = ["tiny", "base", "small", "medium"]
DEFAULT_MODEL = "small"
MAX_WORDS_PER_LINE = 8
CONF_OK = 0.75     # desde aquí se aplican los tiempos sin avisar
CONF_LOW = 0.45    # por debajo no se aplican (salvo las palabras seguras, si el usuario quiere)


def available() -> bool:
    try:
        import faster_whisper  # noqa: F401
        return True
    except Exception:
        return False


def status() -> dict:
    downloaded = []
    if MODELS_DIR.exists():
        for m in MODELS:
            if any(MODELS_DIR.glob(f"models--Systran--faster-whisper-{m}")):
                downloaded.append(m)
    return {"installed": available(), "models": MODELS, "default": DEFAULT_MODEL, "downloaded": downloaded}


# ---------------------------------------------------------------- Whisper

def load_audio(src):
    """Audio a 16 kHz mono con ffmpeg (evita depender de la versión de PyAV)."""
    import numpy as np

    from . import ffmpeg_tools as ff
    exe = ff.ffmpeg_path()
    if not exe:
        return str(src)  # faster-whisper intentará decodificarlo por su cuenta
    r = subprocess.run([exe, "-nostdin", "-v", "error", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000",
                        "-f", "f32le", "-"], capture_output=True, creationflags=ff.NO_WINDOW)
    if r.returncode != 0 or not r.stdout:
        raise RuntimeError("No pude leer el audio del video: " + r.stderr.decode("utf-8", "replace")[-400:])
    return np.frombuffer(r.stdout, dtype=np.float32)


def run_whisper(job: Job, src, model_name: str, glossary: str, language: str | None, vad: bool):
    """Devuelve la lista de palabras ``[{word, start, end, prob}]`` y la duración."""
    from faster_whisper import WhisperModel

    if model_name not in MODELS:
        model_name = DEFAULT_MODEL
    MODELS_DIR.mkdir(exist_ok=True)
    first = model_name not in status()["downloaded"]
    job.message = f"Descargando el modelo «{model_name}» (solo la primera vez)…" if first else f"Cargando el modelo «{model_name}»…"
    threads = max(1, (os.cpu_count() or 2) - 1)  # deja un núcleo libre para que la PC siga usable
    model = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=threads,
                         download_root=str(MODELS_DIR))
    job.check()
    job.message = "Escuchando el audio…"
    segments, info = model.transcribe(
        load_audio(src), language=language or None, word_timestamps=True,
        initial_prompt=glossary.strip() or None, vad_filter=vad, beam_size=5,
        condition_on_previous_text=False,
    )
    words = []
    duration = info.duration or 1
    for seg in segments:  # es un generador: cada vuelta transcribe un trozo
        job.check()
        for w in seg.words or []:
            words.append({"word": w.word.strip(), "start": round(float(w.start), 3),
                          "end": round(float(w.end), 3), "prob": round(float(w.probability), 3)})
        job.progress = min(0.99, seg.end / duration)
        job.message = f"Transcribiendo… {seg.end:.0f} de {duration:.0f} s"
    return words, duration


# ---------------------------------------------------------------- utilidades

def norm(word: str) -> str:
    s = unicodedata.normalize("NFKD", word.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9ñ']", "", s.replace("ñ", "n"))


def split_word_time(parts: list[str], start: float, end: float):
    """Reparte el tiempo de una palabra entre sus sílabas según su largo."""
    total = sum(max(1, len(p.strip())) for p in parts)
    out, t = [], start
    for p in parts:
        d = (end - start) * max(1, len(p.strip())) / total
        out.append([round(t, 3), round(t + d, 3)])
        t += d
    out[-1][1] = round(end, 3)
    return out


# ---------------------------------------------------------------- video hablado

def words_to_project(words, speaker: str = ""):
    """Arma letra (con sílabas) y tiempos a partir de las palabras de Whisper."""
    words = [w for w in words if w["word"]]
    lines_words, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        gap = words[i + 1]["start"] - w["end"] if i + 1 < len(words) else 0
        # Fin de frase o pausa larga: siempre corta. Coma o pausa corta: corta si el verso
        # ya es mediano. Nunca más de MAX_WORDS_PER_LINE + 2 palabras.
        hard = re.search(r"[.!?…]$", w["word"]) or gap > 0.8
        soft = len(cur) >= MAX_WORDS_PER_LINE - 3 and (re.search(r"[,;:]$", w["word"]) or gap > 0.3)
        if hard or soft or len(cur) >= MAX_WORDS_PER_LINE + 2:
            lines_words.append(cur)
            cur = []
    if cur:
        lines_words.append(cur)

    text_lines, times = [], []
    for li, lw in enumerate(lines_words):
        toks, lt = [], []
        for w in lw:
            sy = syllabify_word(w["word"].replace("|", ""))
            parts = [p for p in sy.split("|") if p]
            toks.append(sy)
            lt += split_word_time(parts, w["start"], max(w["end"], w["start"] + 0.05))
        prefix = f"{speaker}: " if speaker and li == 0 else ""
        text_lines.append(prefix + " ".join(toks))
        times.append(lt)
    probs = [w["prob"] for w in words]
    return {"lyrics": "\n".join(text_lines), "times": times,
            "confidence": round(sum(probs) / len(probs), 3) if probs else 0.0}


# ---------------------------------------------------------------- alinear letra

def _lyric_words(lines):
    """Palabras de la letra con referencia a sus sílabas: [(norm, li, [si...]), ...]."""
    out = []
    for li, line in enumerate(lines):
        cur = []
        for si, s in enumerate(line["syls"]):
            cur.append(si)
            if s["text"].endswith(" ") or si == len(line["syls"]) - 1:
                word = "".join(line["syls"][k]["text"] for k in cur)
                n = norm(word)
                if n:
                    out.append((n, li, cur))
                cur = []
    return out


def _match(lyric, heard):
    """Empareja palabras de la letra con las oídas, tolerando errores de reconocimiento.

    Programación dinámica (como Needleman-Wunsch) con similitud de caracteres: una
    palabra cantada suele reconocerse "parecida" ("vien" ↔ "bien").
    """
    n, m = len(lyric), len(heard)
    GAP = -0.4
    sim = [[0.0] * m for _ in range(n)]
    for i, a in enumerate(lyric):
        for j, b in enumerate(heard):
            r = SequenceMatcher(None, a, b).ratio() if a and b else 0
            sim[i][j] = r if r >= 0.6 else -0.6
    score = [[0.0] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        score[i][0], back[i][0] = i * GAP, 1
    for j in range(1, m + 1):
        score[0][j], back[0][j] = j * GAP, 2
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            best, b = score[i - 1][j - 1] + sim[i - 1][j - 1], 0
            if score[i - 1][j] + GAP > best:
                best, b = score[i - 1][j] + GAP, 1
            if score[i][j - 1] + GAP > best:
                best, b = score[i][j - 1] + GAP, 2
            score[i][j], back[i][j] = best, b
    pairs, i, j = {}, n, m
    while i > 0 and j > 0:
        if back[i][j] == 0:
            if sim[i - 1][j - 1] > 0:
                pairs[i - 1] = (j - 1, sim[i - 1][j - 1])
            i, j = i - 1, j - 1
        elif back[i][j] == 1:
            i -= 1
        else:
            j -= 1
    return pairs


def align(project: dict, words):
    """Propone tiempos para la letra del proyecto a partir de las palabras de Whisper.

    Devuelve ``times`` (con interpolación entre palabras seguras), ``safeTimes`` (solo
    palabras emparejadas), la confianza y un reporte por verso.
    """
    lines, _ = parse_lyrics(project["lyrics"], project.get("chars", {}))
    lw = _lyric_words(lines)
    heard = [w for w in words if norm(w["word"])]
    if not lw:
        return {"error": "No hay letra que alinear: pégala primero en la pestaña Letra."}
    pairs = _match([x[0] for x in lw], [norm(w["word"]) for w in heard]) if heard else {}

    times = [[[None, None] for _ in l["syls"]] for l in lines]
    safe = [[[None, None] for _ in l["syls"]] for l in lines]
    word_t = [None] * len(lw)
    for k, (wi, r) in pairs.items():
        h = heard[wi]
        word_t[k] = (h["start"], max(h["end"], h["start"] + 0.08), r * h["prob"])

    def put(target, k, a, b):
        _, li, sis = lw[k]
        parts = [lines[li]["syls"][si]["text"] for si in sis]
        for si, ab in zip(sis, split_word_time(parts, a, b)):
            target[li][si] = ab

    for k, wt in enumerate(word_t):
        if wt:
            put(times, k, wt[0], wt[1])
            put(safe, k, wt[0], wt[1])

    # Palabras sin emparejar: se reparten entre las seguras vecinas del mismo verso,
    # nunca a través de huecos largos (ahí es mejor dejarlas sin tiempo).
    k = 0
    while k < len(lw):
        if word_t[k]:
            k += 1
            continue
        j = k
        while j < len(lw) and not word_t[j]:
            j += 1
        prev = word_t[k - 1] if k > 0 and lw[k - 1][1] == lw[k][1] else None
        nxt = word_t[j] if j < len(lw) and lw[j][1] == lw[j - 1][1] else None
        if prev and nxt and nxt[0] - prev[1] < 0.6 * (j - k) + 1.5:
            a, b = prev[1], nxt[0]
            if b - a < 0.05 * (j - k):
                b = a + 0.12 * (j - k)
            chars = [max(1, len(lw[x][0])) for x in range(k, j)]
            t = a
            for x, c in zip(range(k, j), chars):
                d = (b - a) * c / sum(chars)
                put(times, x, t, t + d)
                t += d
        k = j

    matched = sum(1 for w in word_t if w)
    coverage = matched / len(lw)
    quality = sum(w[2] for w in word_t if w) / matched if matched else 0
    confidence = round(coverage * (0.5 + 0.5 * quality), 3)
    report = []
    for li, line in enumerate(lines):
        idx = [k for k, x in enumerate(lw) if x[1] == li]
        ok = sum(1 for k in idx if word_t[k])
        if idx and ok / len(idx) < 0.5:
            report.append({"line": li, "matched": ok, "words": len(idx)})
    level = "alta" if confidence >= CONF_OK else "media" if confidence >= CONF_LOW else "baja"
    return {"times": times, "safeTimes": safe, "confidence": confidence, "coverage": round(coverage, 3),
            "level": level, "weakLines": report, "heard": " ".join(w["word"] for w in heard)[:2000]}


# ---------------------------------------------------------------- trabajo completo

def whisper_job(job: Job, src, project: dict, mode: str, model: str, language: str | None, speaker: str):
    if not available():
        raise RuntimeError("El modo automático no está instalado (requirements-whisper.txt)")
    # Solo el glosario va como initial_prompt. La letra NO: Whisper tiende a "repetir"
    # el prompt y eso daría coincidencias falsas (una confianza alta inventada).
    glossary = project.get("glossary", "")[:800]
    words, duration = run_whisper(job, src, model, glossary, language, vad=(mode != "align"))
    job.check()
    if not words:
        raise RuntimeError("Whisper no reconoció ninguna palabra en el audio.")
    job.message = "Ordenando el resultado…"
    if mode == "align":
        res = align(project, words)
    else:
        res = words_to_project(words, speaker)
    res["mode"] = mode
    res["words"] = len(words)
    return res


__all__ = ["available", "status", "whisper_job", "align", "words_to_project", "Cancelled"]
