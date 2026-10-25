"""Generación de .ass: test dorado + reglas que necesita Aegisub."""
import json
import os
from pathlib import Path

from app.ass_gen import ass_color, ass_time, build_ass, build_srt, darken, srt_time
from app.project import normalize

DATA = Path(__file__).parent / "data"
GOLDEN = DATA / "esperado.ass"


def proyecto():
    return normalize(json.loads((DATA / "proyecto_ejemplo.json").read_text(encoding="utf-8")))


def test_ass_dorado():
    """Si cambias el generador a propósito, regenera con: UPDATE_GOLDEN=1 pytest tests/test_ass.py"""
    out = build_ass(proyecto(), "Ejemplo")
    if os.environ.get("UPDATE_GOLDEN"):
        GOLDEN.write_text(out, encoding="utf-8", newline="\n")
    assert out == GOLDEN.read_text(encoding="utf-8")


def test_estructura_compatible_con_aegisub():
    out = build_ass(proyecto(), "Ejemplo")
    sections = [l for l in out.splitlines() if l.startswith("[")]
    assert sections == ["[Script Info]", "[V4+ Styles]", "[Events]"]
    assert "ScriptType: v4.00+" in out
    styles = [l for l in out.splitlines() if l.startswith("Style: ")]
    assert [s.split(",")[0] for s in styles] == ["Style: Kaito", "Style: Mirei", "Style: Coro"]
    for s in styles:
        assert len(s.split(",")) == 23  # tantos campos como el Format de V4+
    for d in (l for l in out.splitlines() if l.startswith("Dialogue: ")):
        assert len(d.split(",", 9)) == 10
    # Cada verso: una capa de brillo (\ko) y una de karaoke (\kf)
    assert out.count(",karaoke,") == 6 and out.count(",brillo,") == 6


def test_sin_brillo_no_hay_capa_de_brillo():
    p = proyecto()
    p["style"]["glow"] = 0
    out = build_ass(p)
    assert ",brillo," not in out and out.count(",karaoke,") == 6


def test_offset_mueve_los_tiempos():
    p = proyecto()
    base = build_ass(p)
    p["style"]["offset"] = -100
    moved = build_ass(p)
    assert "0:00:00.00,0:00:03.96" in moved and "0:00:00.00,0:00:04.06" in base


def test_vertical_usa_1080x1920():
    p = proyecto()
    p["output"]["format"] = "vertical-blur"
    out = build_ass(p)
    assert "PlayResX: 1080" in out and "PlayResY: 1920" in out


def test_silabas_sin_tiempo_y_versos_sin_marcar():
    p = normalize({"lyrics": "A: ho|la\nA: chau", "times": [[[1.0, 1.5], [None, None]]]})
    out = build_ass(p)
    events = [l for l in out.splitlines() if l.startswith("Dialogue: 1")]
    assert len(events) == 1                      # el verso sin marcar no aparece
    assert "{\\kf50}ho{\\k0}la" in events[0]


def test_texto_con_llaves_no_rompe_el_ass():
    p = normalize({"lyrics": "A: {ho}|la\\", "times": [[[1, 2], [2, 3]]]})
    out = build_ass(p)
    assert "{\\kf100}ho{\\kf100}la" in out


def test_srt():
    srt = build_srt(proyecto())
    assert srt.startswith("1\n00:00:01,000 --> ")
    assert "Zarpamos con el alba" in srt and srt.count(" --> ") == 6


def test_colores_y_tiempos():
    assert ass_color("#ff5a5f") == "&H005F5AFF"
    assert darken("#ffffff", 0.5) == "#808080"
    assert ass_time(3725.456) == "1:02:05.46"
    assert srt_time(3725.456) == "01:02:05,456"
