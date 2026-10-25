import pytest

from app.lyrics import line_text, parse_lyrics, syllabify_text, syllabify_word, times_of


@pytest.mark.parametrize("word, expected", [
    ("zarpamos", "zar|pa|mos"),
    ("horizonte", "ho|ri|zon|te"),
    ("guitarra", "gui|ta|rra"),
    ("construir", "cons|truir"),
    ("Choquehuanca", "Cho|que|huan|ca"),
    ("ayer", "a|yer"),
    ("hablar", "ha|blar"),
    ("María", "Ma|rí|a"),
    # extra: diptongos, hiatos, grupos inseparables, dígrafos
    ("viento", "vien|to"),
    ("poeta", "po|e|ta"),
    ("calle", "ca|lle"),
    ("muchacho", "mu|cha|cho"),
    ("pingüino", "pin|güi|no"),
    ("hoy", "hoy"),
    ("sol", "sol"),
    ("instrumento", "ins|tru|men|to"),
])
def test_silabeo(word, expected):
    assert syllabify_word(word) == expected


def test_silabeo_respeta_puntuacion_y_mayusculas():
    assert syllabify_word("¡Horizonte!") == "¡Ho|ri|zon|te!"
    assert syllabify_word("faro,") == "fa|ro,"


def test_silabeo_no_toca_palabras_ya_separadas():
    assert syllabify_word("Cho|quehuanca") == "Cho|quehuanca"


def test_silabeo_texto_con_personaje():
    src = "Kaito: zarpamos con el alba\n\ncoro sin nombre"
    assert syllabify_text(src) == "Kaito: zar|pa|mos con el al|ba\n\nco|ro sin nom|bre"


def test_parser_personajes_heredados_y_automaticos():
    lyrics = "Kaito: Zar|pa|mos con el al|ba\nel vien|to\nMirei: hola"
    lines, chars = parse_lyrics(lyrics, {})
    assert [l["charKey"] for l in lines] == ["kaito", "kaito", "mirei"]
    assert chars["kaito"]["name"] == "Kaito" and chars["kaito"]["auto"]
    assert [s["text"] for s in lines[0]["syls"]] == ["Zar", "pa", "mos ", "con ", "el ", "al", "ba"]
    assert line_text(lines[0]) == "Zarpamos con el alba"


def test_parser_sin_nombre_usa_voz():
    lines, chars = parse_lyrics("la la", {})
    assert lines[0]["charKey"] == "voz" and chars["voz"]["name"] == "Voz"


def test_parser_borra_personajes_automaticos_sin_uso_y_conserva_los_manuales():
    chars = {"a": {"name": "A", "color": "#111111", "auto": True}, "b": {"name": "B", "color": "#222222", "auto": False}}
    _, out = parse_lyrics("C: hola", chars)
    assert "a" not in out and "b" in out and "c" in out


def test_parser_dos_puntos_sin_texto_no_es_personaje():
    lines, _ = parse_lyrics("Nota:", {})
    assert lines[0]["charKey"] == "voz"
    assert lines[0]["syls"][0]["text"] == "Nota:"


def test_tiempos_se_aplican_solo_si_coincide_la_cantidad_de_silabas():
    lines, chars = parse_lyrics("A: ho|la\nA: chau", {}, [[[1, 2], [2, 3]], [[5, 6], [6, 7]]])
    assert times_of(lines) == [[[1, 2], [2, 3]], [[None, None]]]
