"""Parser de letra y silabeador de español (portados del prototipo karaoke-fansub.html).

Formato de la letra:
  - Un verso por línea.
  - ``Nombre:`` al inicio asigna el personaje; si falta, hereda el del verso anterior.
  - ``|`` separa sílabas; una palabra sin ``|`` cuenta como una sola sílaba.
"""
from __future__ import annotations

import re
import unicodedata

PALETTE = ["#ff5a5f", "#5ec8ff", "#ffc94a", "#8be37a", "#c58bff", "#ff9a3c", "#4fe0d0", "#ff7fc1"]

_NAME_RE = re.compile(r"^([^:|]{1,24}):\s*(.*)$")
_PREFIX_RE = re.compile(r"^(\s*[^:|]{1,24}:\s*)(.*)$")


# ---------------------------------------------------------------- parser

def parse_lyrics(lyrics: str, chars: dict, times=None):
    """Devuelve ``(lines, chars)``.

    ``lines`` es una lista de ``{"charKey", "syls": [{"text", "t0", "t1"}]}``.
    ``chars`` se actualiza: se crean personajes nuevos con color automático y se
    borran los automáticos que ya no se usan (igual que el prototipo).
    ``times`` es el formato del proyecto: por verso, una lista de ``[t0, t1]``;
    solo se aplica a un verso si tiene la misma cantidad de sílabas.
    """
    chars = {k: dict(v) for k, v in (chars or {}).items()}
    used: set[str] = set()
    last_key = next(iter(chars), None)
    lines = []
    for raw in lyrics.split("\n"):
        r = raw.strip()
        if not r:
            continue
        body, key, name = r, last_key, None
        m = _NAME_RE.match(r)
        if m and m.group(2).strip():
            name = m.group(1).strip()
            body = m.group(2)
            key = name.lower()
        if not key:
            key, name = "voz", "Voz"
        if key not in chars:
            chars[key] = {"name": name or key, "color": PALETTE[len(chars) % len(PALETTE)], "auto": True}
        used.add(key)
        last_key = key
        words = body.split()
        syls = []
        for wi, w in enumerate(words):
            parts = [p for p in w.split("|") if p]
            for k, p in enumerate(parts):
                tail = " " if k == len(parts) - 1 and wi < len(words) - 1 else ""
                syls.append({"text": p + tail, "t0": None, "t1": None})
        if syls:
            lines.append({"charKey": key, "syls": syls})

    for k in list(chars):
        if chars[k].get("auto") and k not in used:
            del chars[k]

    apply_times(lines, times)
    return lines, chars


def apply_times(lines, times):
    if not isinstance(times, list):
        return
    for line, t in zip(lines, times):
        if isinstance(t, list) and len(t) == len(line["syls"]):
            for s, pair in zip(line["syls"], t):
                if isinstance(pair, (list, tuple)) and len(pair) == 2:
                    s["t0"], s["t1"] = pair[0], pair[1]


def times_of(lines):
    return [[[s["t0"], s["t1"]] for s in line["syls"]] for line in lines]


def line_text(line) -> str:
    return "".join(s["text"] for s in line["syls"]).rstrip()


# ---------------------------------------------------------------- silabeador

STRONG = "aeoáéóíú"
WEAK = "iuü"
INSEP = {"pl", "bl", "fl", "cl", "gl", "kl", "pr", "br", "fr", "cr", "gr", "kr", "tr", "dr"}


def _is_v(c: str | None) -> bool:
    return bool(c) and (c in STRONG or c in WEAK)


def _split_core(w: str) -> list[str]:
    lw = w.lower()
    units = []
    i = 0
    n_ = len(lw)
    while i < n_:
        c = lw[i]
        n = lw[i + 1] if i + 1 < n_ else None
        n2 = lw[i + 2] if i + 2 < n_ else None
        if (c == "c" and n == "h") or (c == "l" and n == "l") or (c == "r" and n == "r"):
            units.append({"t": "C", "s": i, "cl": c + n})
            i += 2
            continue
        if c in ("q", "g") and n == "u" and n2 and n2 in "eiéí":
            units.append({"t": "C", "s": i, "cl": c + "u"})
            i += 2
            continue
        if c in STRONG:
            units.append({"t": "V", "s": i, "strong": True})
        elif c in WEAK:
            units.append({"t": "V", "s": i, "strong": False})
        elif c == "y":
            units.append({"t": "C", "s": i, "cl": "y"} if _is_v(n) else {"t": "V", "s": i, "strong": False})
        else:
            units.append({"t": "C", "s": i, "cl": c})
        i += 1

    nuc = []
    i = 0
    while i < len(units):
        if units[i]["t"] != "V":
            i += 1
            continue
        st = j = i
        while j < len(units) and units[j]["t"] == "V":
            if j > st and units[j - 1]["strong"] and units[j]["strong"]:
                nuc.append((st, j))
                st = j
            j += 1
        nuc.append((st, j))
        i = j
    if len(nuc) < 2:
        return [w]

    cuts = []
    for k in range(len(nuc) - 1):
        cs, ce = nuc[k][1], nuc[k + 1][0]
        L = ce - cs
        if L <= 0:
            b = ce
        elif L == 1:
            b = cs
        elif L == 2:
            b = cs if units[cs]["cl"] + units[cs + 1]["cl"] in INSEP else cs + 1
        elif L == 3:
            b = cs + 1 if units[cs + 1]["cl"] + units[cs + 2]["cl"] in INSEP else cs + 2
        else:
            b = cs + 2
        cuts.append(units[b]["s"])

    parts, p = [], 0
    for c in cuts:
        parts.append(w[p:c])
        p = c
    parts.append(w[p:])
    return [x for x in parts if x]


def _is_letter(ch: str) -> bool:
    return unicodedata.category(ch).startswith("L")


def syllabify_word(word: str) -> str:
    if "|" in word:
        return word
    a = 0
    while a < len(word) and not _is_letter(word[a]):
        a += 1
    b = len(word)
    while b > a and not _is_letter(word[b - 1]):
        b -= 1
    core = word[a:b]
    if not core or not all(_is_letter(ch) for ch in core):
        return word
    return word[:a] + "|".join(_split_core(core)) + word[b:]


def syllabify_text(src: str) -> str:
    out = []
    for raw in src.split("\n"):
        m = _PREFIX_RE.match(raw)
        has_name = bool(m and m.group(2).strip())
        pre = m.group(1) if has_name else ""
        body = m.group(2) if has_name else raw
        toks = re.split(r"(\s+)", body)
        out.append(pre + "".join(t if t.isspace() or not t else syllabify_word(t) for t in toks))
    return "\n".join(out)
