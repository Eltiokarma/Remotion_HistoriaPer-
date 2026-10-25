"""Modelo del proyecto (.json): letra, personajes, estilo, tiempos, video y formato.

Es compatible con los .json que guarda el prototipo karaoke-fansub.html
(``lyrics``, ``chars``, ``style``, ``times``); los campos nuevos tienen valores
por defecto.
"""
from __future__ import annotations

import copy

from .fonts import DEFAULT_FONT, FONTS

DEFAULT_STYLE = {
    "font": DEFAULT_FONT,
    "size": 7.0,        # % de la altura del video
    "outline": 9,       # % del tamaño de la fuente
    "unsung": "#ffffff",
    "pos": "bottom",    # bottom | top
    "margin": 6.5,      # % de la altura entre el borde y la letra
    "lead": 1.0,        # segundos que el verso aparece antes de cantarse
    "glow": 4,          # blur del brillo al cantar (0 = sin brillo)
    "offset": 0,        # ms, compensa el reflejo al marcar
    "bounce": False,    # salto por sílaba al cantarse
}

FORMATS = {"original", "vertical-crop", "vertical-blur"}
VERTICAL = (1080, 1920)
NO_VIDEO = (1280, 720)


def new_project(lyrics: str = "") -> dict:
    return {
        "app": "karaoke-fansub",
        "version": 1,
        "lyrics": lyrics,
        "chars": {},
        "style": dict(DEFAULT_STYLE),
        "times": [],
        "video": None,
        "output": {"format": "original"},
    }


def _num(v, default, lo, hi):
    try:
        v = float(v)
    except (TypeError, ValueError):
        return default
    return max(lo, min(hi, v))


def _color(v, default):
    if isinstance(v, str) and len(v) == 7 and v[0] == "#":
        try:
            int(v[1:], 16)
            return v.lower()
        except ValueError:
            pass
    return default


def normalize(data: dict) -> dict:
    """Completa y sanea un proyecto venido del navegador o de un archivo."""
    if not isinstance(data, dict) or not isinstance(data.get("lyrics"), str):
        raise ValueError("Ese archivo no es un proyecto de Karaoke Fansub")
    p = new_project(data["lyrics"])
    chars = data.get("chars") or {}
    if isinstance(chars, dict):
        for k, c in chars.items():
            if isinstance(c, dict):
                p["chars"][str(k)] = {
                    "name": str(c.get("name") or k)[:40],
                    "color": _color(c.get("color"), "#ffffff"),
                    "auto": bool(c.get("auto", False)),
                }
    st = dict(DEFAULT_STYLE)
    src = data.get("style") or {}
    if isinstance(src, dict):
        st["font"] = src.get("font") if src.get("font") in FONTS else DEFAULT_FONT
        st["size"] = _num(src.get("size"), st["size"], 2, 20)
        st["outline"] = _num(src.get("outline"), st["outline"], 0, 30)
        st["unsung"] = _color(src.get("unsung"), st["unsung"])
        st["pos"] = "top" if src.get("pos") == "top" else "bottom"
        st["margin"] = _num(src.get("margin"), st["margin"], 0, 40)
        st["lead"] = _num(src.get("lead"), st["lead"], 0.15, 5)
        st["glow"] = _num(src.get("glow"), st["glow"], 0, 20)
        st["offset"] = _num(src.get("offset"), st["offset"], -2000, 2000)
        st["bounce"] = bool(src.get("bounce", False))
    p["style"] = st
    if isinstance(data.get("times"), list):
        p["times"] = data["times"]
    v = data.get("video")
    if isinstance(v, dict) and v.get("file"):
        p["video"] = {
            "file": str(v["file"]),
            "width": int(_num(v.get("width"), 0, 0, 16384)),
            "height": int(_num(v.get("height"), 0, 0, 16384)),
            "duration": _num(v.get("duration"), 0, 0, 86400),
        }
        if isinstance(v.get("preview"), str) and v["preview"]:
            p["video"]["preview"] = v["preview"]  # copia liviana para el navegador (ver /proxy)
    out = data.get("output") or {}
    fmt = out.get("format") if isinstance(out, dict) else None
    p["output"] = {"format": fmt if fmt in FORMATS else "original"}
    for k in ("name", "glossary", "whisperModel"):
        if isinstance(data.get(k), str):
            p[k] = data[k]
    return p


def output_size(project: dict) -> tuple[int, int]:
    """Resolución del video final, que también es el PlayRes del .ass."""
    if project.get("output", {}).get("format", "original") != "original":
        return VERTICAL
    v = project.get("video") or {}
    w, h = int(v.get("width") or 0), int(v.get("height") or 0)
    if w > 0 and h > 0:
        # libx264 con yuv420p exige dimensiones pares
        return (w // 2 * 2, h // 2 * 2)
    return NO_VIDEO


def clone(p: dict) -> dict:
    return copy.deepcopy(p)
