"""Catálogo de fuentes incluidas en ``fonts/``.

libass (la vista previa con JASSUB y ffmpeg al quemar) busca la fuente por su
nombre de familia interno, que no siempre coincide con el nombre comercial:
M PLUS Rounded 1c ExtraBold se llama "Rounded Mplus 1c ExtraBold" por dentro.
Por eso el .ass usa ``family`` y la interfaz muestra ``label``.
"""
from __future__ import annotations

from functools import lru_cache

from .paths import FONTS_DIR

FONTS = {
    "M PLUS Rounded 1c": "MPLUSRounded1c-ExtraBold.ttf",
    "Dela Gothic One": "DelaGothicOne-Regular.ttf",
    "Bangers": "Bangers-Regular.ttf",
    "Anton": "Anton-Regular.ttf",
    "Kosugi Maru": "KosugiMaru-Regular.ttf",
}
DEFAULT_FONT = "M PLUS Rounded 1c"


@lru_cache(maxsize=None)
def _load(label: str):
    """Datos de la fuente: familia interna y anchos de glifos.

    Devuelve None si fontTools no está instalado o el archivo falta; en ese caso
    el .ass sigue saliendo, solo que sin el ajuste de ancho de versos largos.
    """
    path = FONTS_DIR / FONTS.get(label, FONTS[DEFAULT_FONT])
    try:
        from fontTools.ttLib import TTFont
        font = TTFont(str(path), lazy=True)
    except Exception:
        return None
    os2 = font["OS/2"]
    # libass escala la fuente para que ascenso + descenso midan el tamaño pedido.
    height = (os2.usWinAscent + os2.usWinDescent) or font["head"].unitsPerEm
    cmap = font.getBestCmap() or {}
    hmtx = font["hmtx"].metrics
    widths = {cp: hmtx[g][0] for cp, g in cmap.items() if g in hmtx}
    space = widths.get(ord(" "), height // 4)
    return {"family": font["name"].getDebugName(1) or label, "height": height, "upm": font["head"].unitsPerEm,
            "widths": widths, "fallback": space * 2}


def family(label: str) -> str:
    data = _load(label)
    if data:
        return data["family"]
    return {"M PLUS Rounded 1c": "Rounded Mplus 1c ExtraBold"}.get(label, label)


def ass_size(label: str, em_px: float) -> int:
    """Fontsize del .ass para que la letra mida ``em_px`` de em (como en un canvas/CSS).

    En ASS el tamaño es la altura de línea (ascenso + descenso), no el em.
    """
    data = _load(label)
    ratio = data["height"] / data["upm"] if data else 1.3
    return round(em_px * ratio)


def text_width(label: str, text: str, size: float) -> float | None:
    """Ancho aproximado del texto (en píxeles del .ass) a un tamaño dado."""
    data = _load(label)
    if not data:
        return None
    w = data["widths"]
    units = sum(w.get(ord(ch), data["fallback"]) for ch in text)
    return units * size / data["height"]


def catalog():
    return [{"label": k, "file": v, "family": family(k)} for k, v in FONTS.items()]
