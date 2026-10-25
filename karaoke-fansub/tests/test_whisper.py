"""Modo automático: alineación y armado de versos. No necesita el modelo (usa palabras grabadas)."""
import json
from pathlib import Path

from app.lyrics import parse_lyrics
from app.project import normalize
from app.whisper_mod import align, norm, split_word_time, words_to_project

WORDS = json.loads((Path(__file__).parent / "data" / "whisper_palabras.json").read_text(encoding="utf-8"))


def test_transcribir_arma_versos_con_silabas_y_tiempos():
    r = words_to_project(WORDS, "Narrador")
    lines = r["lyrics"].split("\n")
    assert lines[0] == "Narrador: Ho|la a to|dos."
    assert "Cho|que|huan|ca" in r["lyrics"]
    parsed, _ = parse_lyrics(r["lyrics"], {}, r["times"])
    # cada sílaba tiene tiempo, en orden y sin solaparse
    flat = [s for l in parsed for s in l["syls"]]
    assert all(s["t0"] is not None for s in flat)
    assert all(a["t1"] <= b["t0"] + 1e-6 for a, b in zip(flat, flat[1:]))
    assert 0.8 < r["confidence"] <= 1


def test_alinear_letra_que_coincide():
    p = normalize({"lyrics": "Ho|la a to|dos\nhoy les cuen|to la his|to|ria\nde Cho|que|huan|ca en Pu|no"})
    r = align(p, WORDS)
    assert r["level"] == "alta" and r["coverage"] == 1.0
    choque = r["times"][2][1]  # "Cho" de Choquehuanca
    assert abs(choque[0] - next(w["start"] for w in WORDS if w["word"].startswith("Choque"))) < 0.01


def test_alinear_tolera_palabras_mal_reconocidas():
    words = [dict(w) for w in WORDS]
    for w in words:
        if w["word"] == "historia":
            w["word"] = "istoria"   # error típico de reconocimiento
    p = normalize({"lyrics": "hoy les cuen|to la his|to|ria de Cho|que|huan|ca"})
    r = align(p, words)
    assert r["level"] == "alta"
    assert all(t[0] is not None for t in r["times"][0])


def test_palabra_no_reconocida_se_interpola_entre_vecinas():
    p = normalize({"lyrics": "hoy les cuen|to la mag|ní|fi|ca his|to|ria"})
    r = align(p, WORDS)
    t = r["times"][0]
    # "magnífica" no existe en el audio: va entre "la" e "historia", y no en safeTimes
    # sílabas: hoy les cuen to la(4) mag(5) ní fi ca his(9) to ria
    assert t[5][0] is not None and t[4][1] <= t[5][0] <= t[9][0]
    assert r["safeTimes"][0][5] == [None, None] and r["safeTimes"][0][4][0] is not None


def test_confianza_baja_si_la_letra_no_es_la_del_audio():
    p = normalize({"lyrics": "o|tra can|ción que no tie|ne na|da que ver\ncon lo que se es|cu|cha a|quí"})
    r = align(p, WORDS)
    assert r["level"] == "baja"
    assert len(r["weakLines"]) == 2


def test_sin_palabras_oidas():
    r = align(normalize({"lyrics": "ho|la"}), [])
    assert r["level"] == "baja" and r["coverage"] == 0


def test_utilidades():
    assert norm("¡Ñandú!") == "nandu"
    assert split_word_time(["ho", "la"], 1.0, 2.0) == [[1.0, 1.5], [1.5, 2.0]]
