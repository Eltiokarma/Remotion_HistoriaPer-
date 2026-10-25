import pytest
from fastapi.testclient import TestClient

from app import main, paths, storage


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(storage, "PROJECTS_DIR", tmp_path / "proyectos")
    monkeypatch.setattr(storage, "LAST_FILE", tmp_path / "proyectos" / ".ultimo")
    monkeypatch.setattr(storage, "EXAMPLE_DIR", paths.EXAMPLE_DIR)
    storage.ensure_example()
    return TestClient(main.app)


def test_status_y_ejemplo(client):
    st = client.get("/api/status").json()
    assert {f["label"] for f in st["fonts"]} == {"M PLUS Rounded 1c", "Dela Gothic One", "Bangers", "Anton", "Kosugi Maru"}
    assert any(p["slug"] == "ejemplo" for p in client.get("/api/projects").json())
    p = client.get("/api/projects/ejemplo").json()["project"]
    assert p["video"]["file"] == "ejemplo.mp4"
    r = client.get("/media/ejemplo/ejemplo.mp4", headers={"Range": "bytes=0-99"})
    assert r.status_code == 206 and len(r.content) == 100  # el <video> necesita poder saltar


def test_crear_guardar_y_compilar(client):
    r = client.post("/api/projects", json={"name": "Canción Ñandú"}).json()
    assert r["slug"] == "cancion-nandu"
    proj = r["project"] | {"lyrics": "Ana: ho|la\nchau", "times": [[[1, 1.5], [1.5, 2]], [[3, 4]]]}
    assert client.put(f"/api/projects/{r['slug']}", json=proj).json()["ok"]
    c = client.post("/api/compile", json=proj).json()
    assert [l["charKey"] for l in c["lines"]] == ["ana", "ana"]
    assert c["lines"][1]["syls"][0]["t0"] == 3
    assert "Dialogue:" in c["ass"]
    assert client.get("/api/status").json()["last"] == "cancion-nandu"


def test_silabear(client):
    assert client.post("/api/syllabify", json={"text": "Mirei: guitarra"}).json()["text"] == "Mirei: gui|ta|rra"


def test_importar_json_del_prototipo(client):
    # Formato que guarda karaoke-fansub.html: sin "video" ni "output", glow 0/1.
    old = {"lyrics": "Kaito: Zar|pa", "chars": {"kaito": {"name": "Kaito", "color": "#ff5a5f", "auto": False}},
           "style": {"font": "Bangers", "size": 7, "outline": 9, "unsung": "#ffffff", "pos": "top", "lead": 1,
                     "glow": 1, "offset": -50}, "times": [[[1, 1.2], [1.2, 1.5]]]}
    r = client.post("/api/projects", json={"name": "viejo", "project": old}).json()
    assert r["project"]["style"]["font"] == "Bangers" and r["project"]["output"]["format"] == "original"


def test_descargas(client):
    p = client.get("/api/projects/ejemplo").json()["project"]
    r = client.post("/api/download/ass", json=p)
    assert r.status_code == 200 and r.text.startswith("[Script Info]")
    assert "attachment" in r.headers["content-disposition"]
    assert client.post("/api/download/srt", json=p).text.startswith("1\n")


def test_errores_claros(client):
    assert client.get("/api/projects/no-existe").json()["error"] == "No existe ese proyecto"
    r = client.post("/api/compile", json={"nada": 1})
    assert r.status_code == 400 and "no es un proyecto" in r.json()["error"]


def test_plantillas(client, tmp_path, monkeypatch):
    monkeypatch.setattr(main, "TEMPLATES_DIR", tmp_path / "plantillas")
    p = client.get("/api/projects/ejemplo").json()["project"]
    p["style"]["font"] = "Anton"
    p["style"]["offset"] = -120
    t = client.post("/api/templates", json={"name": "Mi Canal", "style": p["style"], "chars": p["chars"]}).json()
    assert t["slug"] == "mi-canal" and t["style"]["font"] == "Anton"
    assert "offset" not in t["style"]               # el reflejo es de cada canción
    assert t["colors"]["kaito"] == "#ff5a5f"
    assert [x["name"] for x in client.get("/api/templates").json()] == ["Mi Canal"]
    assert client.delete("/api/templates/mi-canal").json()["ok"]
    assert client.get("/api/templates").json() == []
    assert client.post("/api/templates", json={"name": " "}).status_code == 400
