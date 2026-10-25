"""Generación de .ass (karaoke con \\kf) y .srt.

Es la única fuente de verdad: la vista previa (JASSUB) y el video quemado
(ffmpeg) usan exactamente el mismo texto que sale de ``build_ass``.
"""
from __future__ import annotations

from . import fonts
from .lyrics import line_text, parse_lyrics
from .project import output_size

FADE_MS = 150
TAIL = 0.35          # segundos que el verso sigue en pantalla después de cantarse
SAME_ROW_GAP = 0.25  # separación mínima con el verso anterior de la misma fila


# ---------------------------------------------------------------- colores

def hex_rgb(h: str):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def rgb_hex(rgb) -> str:
    return "#" + "".join(f"{round(max(0, min(255, v))):02x}" for v in rgb)


def darken(h: str, k: float) -> str:
    return rgb_hex([v * (1 - k) for v in hex_rgb(h)])


def ass_color(h: str, alpha: int = 0) -> str:
    r, g, b = hex_rgb(h)
    return f"&H{alpha:02X}{b:02X}{g:02X}{r:02X}"


def ass_inline_color(h: str) -> str:
    r, g, b = hex_rgb(h)
    return f"&H{b:02X}{g:02X}{r:02X}&"


# ---------------------------------------------------------------- tiempos

def ass_time(t: float) -> str:
    cs = max(0, round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def srt_time(t: float) -> str:
    ms = max(0, round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def _timed(s) -> bool:
    return s["t0"] is not None and s["t1"] is not None


def timed_span(line, off: float):
    t = [s for s in line["syls"] if _timed(s)]
    if not t:
        return None
    return {"s": min(x["t0"] for x in t) + off, "e": max(x["t1"] for x in t) + off}


def windows(lines, style):
    """Cuándo aparece y desaparece cada verso; alterna dos filas (como el prototipo)."""
    off = style["offset"] / 1000
    spans = [timed_span(l, off) for l in lines]
    out = []
    for i, x in enumerate(spans):
        if not x:
            out.append(None)
            continue
        vs = x["s"] - style["lead"]
        prev_same = spans[i - 2] if i >= 2 else None
        if prev_same:
            vs = max(vs, prev_same["e"] + SAME_ROW_GAP)
        vs = max(0.0, min(vs, x["s"] - 0.15))
        out.append({"vs": vs, "ve": x["e"] + TAIL, "s": x["s"], "e": x["e"], "row": i % 2})
    return out


# ---------------------------------------------------------------- geometría

def layout(style, W: int, H: int):
    px = round(H * style["size"] / 100)  # tamaño del em en píxeles, como en el prototipo
    return {
        "px": px,
        "fs": fonts.ass_size(style["font"], px),
        "ow": round(px * style["outline"] / 100, 1),
        "margin": round(H * style.get("margin", 6.5) / 100),
        "gap": round(px * 1.28),
        "W": W,
    }


def row_y(row: int, style, geo, H: int) -> int:
    """Línea base de cada fila (fila 0 = verso par, fila 1 = verso impar)."""
    px, margin, gap = geo["px"], geo["margin"], geo["gap"]
    if style["pos"] == "top":
        return margin + px if row == 0 else margin + px + gap
    return H - margin - gap if row == 0 else H - margin


def fit_scale(line, style, geo, W: int) -> int:
    """Escala (en %) para que un verso largo quepa en el 92 % del ancho."""
    w = fonts.text_width(style["font"], line_text(line), geo["fs"])
    if not w:
        return 100
    w += geo["ow"] * 2
    return min(100, int(W * 0.92 / max(1, w) * 100))


# ---------------------------------------------------------------- .ass

def _clean(text: str) -> str:
    return text.replace("{", "").replace("}", "").replace("\\", "")


def style_names(chars) -> dict:
    """Nombre de estilo por personaje, sin comas y sin repetidos ("A,B" y "A B" chocarían)."""
    out, used = {}, set()
    for key, c in chars.items():
        base = (c.get("name") or key).replace(",", " ").strip()[:30] or "Voz"
        name, n = base, 2
        while name.lower() in used:
            name = f"{base} {n}"
            n += 1
        used.add(name.lower())
        out[key] = name
    return out


def _karaoke(line, vs_cs: int, off: float, tag: str) -> str:
    out, cur = "", vs_cs
    for s in line["syls"]:
        txt = _clean(s["text"])
        if not _timed(s):
            out += "{\\k0}" + txt
            continue
        a = round((s["t0"] + off) * 100)
        b = round((s["t1"] + off) * 100)
        if a > cur:
            out += f"{{\\k{a - cur}}}"
            cur = a
        d = max(1, b - cur)
        out += f"{{\\{tag}{d}}}{txt}"
        cur += d
    return out


def syllable_positions(line, style, geo, sc: int, W: int):
    """Centro x y texto visible de cada sílaba, para dibujarlas por separado.

    Usa los anchos de la fuente (libass escala con usWinAscent + usWinDescent, igual que
    ``fonts.text_width``). Devuelve None si no hay métricas (sin fontTools).
    """
    k = sc / 100
    widths = []
    for s in line["syls"]:
        full = fonts.text_width(style["font"], _clean(s["text"]), geo["fs"])
        vis = fonts.text_width(style["font"], _clean(s["text"]).rstrip(), geo["fs"])
        if full is None or vis is None:
            return None
        widths.append((full * k, vis * k))
    x = W / 2 - sum(f for f, _ in widths) / 2
    out = []
    for s, (full, vis) in zip(line["syls"], widths):
        out.append((_clean(s["text"]).rstrip(), x + vis / 2))
        x += full
    return out


def _bounce_events(line, w, style, geo, sc, y, sname, color, off):
    """Salto por sílaba: cada sílaba es un evento propio que crece un instante al cantarse."""
    pos = syllable_positions(line, style, geo, sc, geo["W"])
    if pos is None:
        return None
    vs_cs = round(w["vs"] * 100)
    start, end = ass_time(w["vs"]), ass_time(w["ve"])
    big = round(sc * 1.12)
    glow = style["glow"]
    events = []
    for s, (text, cx) in zip(line["syls"], pos):
        if not text:
            continue
        base = f"\\an2\\pos({cx:.1f},{y})\\fad({FADE_MS},{FADE_MS})\\fscx{sc}\\fscy{sc}"
        if _timed(s):
            a = round((s["t0"] + off) * 100) - vs_cs
            d = max(1, round((s["t1"] + off) * 100) - vs_cs - a)
            a_ms = a * 10
            pulse = (f"\\t({a_ms},{a_ms + 90},\\fscx{big}\\fscy{big})"
                     f"\\t({a_ms + 90},{a_ms + 260},\\fscx{sc}\\fscy{sc})")

            def kar(tag, a=a, d=d, text=text):
                return (f"{{\\k{a}}}" if a > 0 else "") + f"{{\\{tag}{d}}}{text}"
        else:
            pulse = ""

            def kar(tag, text=text):
                return "{\\k0}" + text
        if glow > 0:
            off_ms = round((w["e"] - w["vs"]) * 1000)
            gb = round(geo["ow"] + geo["px"] * 0.06, 1)
            g = (f"{{{base}{pulse}\\1a&HFF&\\2a&HFF&\\3c{ass_inline_color(color)}\\3a&H30&"
                 f"\\bord{gb:g}\\blur{glow:g}\\t({off_ms},{off_ms + 250},\\3a&HFF&)}}")
            events.append(f"Dialogue: 0,{start},{end},{sname},{sname},0,0,0,brillo,{g}" + kar("ko"))
        events.append(f"Dialogue: 1,{start},{end},{sname},{sname},0,0,0,karaoke,{{{base}{pulse}}}"
                      + kar("kf"))
    return events


def build_ass(project: dict, title: str = "Karaoke Fansub") -> str:
    style = project["style"]
    lines, chars = parse_lyrics(project["lyrics"], project.get("chars", {}), project.get("times"))
    W, H = output_size(project)
    geo = layout(style, W, H)
    off = style["offset"] / 1000
    family = fonts.family(style["font"])
    names = style_names(chars)
    align = 2

    out = [
        "[Script Info]",
        "; Hecho con Karaoke Fansub",
        f"Title: {_clean(title)}",
        "ScriptType: v4.00+",
        "WrapStyle: 2",
        "ScaledBorderAndShadow: yes",
        f"PlayResX: {W}",
        f"PlayResY: {H}",
        "YCbCr Matrix: TV.709",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
        "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, "
        "Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    ]
    for key, c in chars.items():
        out.append(
            f"Style: {names[key]},{family},{geo['fs']},{ass_color(c['color'])},"
            f"{ass_color(style['unsung'])},{ass_color(darken(c['color'], .72))},&H80000000,"
            f"0,0,0,0,100,100,0,0,1,{geo['ow']:g},0,{align},20,20,{geo['margin']},1"
        )
    out += [
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]

    glow = style["glow"]
    for i, (line, w) in enumerate(zip(lines, windows(lines, style))):
        if not w:
            continue
        sname = names.get(line["charKey"], "Voz")
        color = chars.get(line["charKey"], {}).get("color", "#ffffff")
        sc = fit_scale(line, style, geo, W)
        y = row_y(w["row"], style, geo, H)
        base = f"\\an{align}\\pos({W // 2},{y})\\fad({FADE_MS},{FADE_MS})"
        if sc < 100:
            base += f"\\fscx{sc}\\fscy{sc}"
        if style.get("bounce"):
            ev = _bounce_events(line, w, style, geo, sc, y, sname, color, off)
            if ev is not None:
                out.extend(ev)
                continue
        vs_cs = round(w["vs"] * 100)
        start, end = ass_time(w["vs"]), ass_time(w["ve"])
        if glow > 0:
            # Capa de brillo: solo el borde, en el color del personaje, borroso.
            # \ko lo va encendiendo sílaba por sílaba; se apaga al terminar el verso.
            off_ms = round((w["e"] - w["vs"]) * 1000)
            gb = round(geo["ow"] + geo["px"] * 0.06, 1)
            glow_tags = (
                f"{{{base}\\1a&HFF&\\2a&HFF&\\3c{ass_inline_color(color)}\\3a&H30&"
                f"\\bord{gb:g}\\blur{glow:g}\\t({off_ms},{off_ms + 250},\\3a&HFF&)}}"
            )
            out.append(
                f"Dialogue: 0,{start},{end},{sname},{sname},0,0,0,brillo,"
                + glow_tags + _karaoke(line, vs_cs, off, "ko")
            )
        out.append(
            f"Dialogue: 1,{start},{end},{sname},{sname},0,0,0,karaoke,"
            + f"{{{base}}}" + _karaoke(line, vs_cs, off, "kf")
        )
    return "\n".join(out) + "\n"


def build_srt(project: dict) -> str:
    lines, _ = parse_lyrics(project["lyrics"], project.get("chars", {}), project.get("times"))
    out, n = [], 0
    for line, w in zip(lines, windows(lines, project["style"])):
        if not w:
            continue
        n += 1
        out.append(f"{n}\n{srt_time(w['s'])} --> {srt_time(w['e'])}\n{line_text(line)}\n")
    return "\n".join(out)
