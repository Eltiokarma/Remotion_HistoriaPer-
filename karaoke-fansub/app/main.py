"""Servidor local de Karaoke Fansub (FastAPI)."""
from __future__ import annotations

import json
import shutil

from fastapi import Body, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from . import ass_gen, ffmpeg_tools, fonts, jobs, storage, whisper_mod
from .lyrics import parse_lyrics, syllabify_text
from .paths import EXPORTS_DIR, FONTS_DIR, WEB_DIR
from .project import normalize, output_size

app = FastAPI(title="Karaoke Fansub", docs_url=None, redoc_url=None)


def _project_or_404(slug: str) -> dict:
    try:
        return storage.load(slug)
    except KeyError:
        raise HTTPException(404, "No existe ese proyecto")


def _bad(e: Exception):
    raise HTTPException(400, str(e))


# ---------------------------------------------------------------- estado

@app.get("/api/status")
def status():
    return {"ffmpeg": ffmpeg_tools.status(), "fonts": fonts.catalog(), "last": storage.last_slug(),
            "whisper": whisper_mod.status()}


# ---------------------------------------------------------------- proyectos

@app.get("/api/projects")
def projects():
    return storage.list_projects()


@app.post("/api/projects")
def create_project(body: dict = Body(...)):
    try:
        slug, p = storage.create(str(body.get("name") or "Nuevo proyecto"), body.get("project"))
    except ValueError as e:
        _bad(e)
    return {"slug": slug, "project": p}


@app.get("/api/projects/{slug}")
def get_project(slug: str):
    return {"slug": slug, "project": _project_or_404(slug)}


@app.put("/api/projects/{slug}")
def put_project(slug: str, body: dict = Body(...)):
    _project_or_404(slug)
    try:
        return {"ok": True, "project": storage.save(slug, body)}
    except ValueError as e:
        _bad(e)


@app.post("/api/projects/{slug}/beacon")
def beacon(slug: str, body: dict = Body(...)):
    """Último guardado al cerrar la pestaña (navigator.sendBeacon)."""
    return put_project(slug, body)


@app.post("/api/projects/{slug}/video")
async def upload_video(slug: str, file: UploadFile = File(...), width: int = Form(0), height: int = Form(0),
                       duration: float = Form(0)):
    p = _project_or_404(slug)
    d = storage.project_dir(slug)
    name = storage.safe_media_name(file.filename)
    old = (p.get("video") or {}).get("file")
    dst = d / name
    with dst.open("wb") as fh:
        shutil.copyfileobj(file.file, fh, length=1024 * 1024)
    info = {"width": width, "height": height, "duration": duration}
    if ffmpeg_tools.ffprobe_path():
        try:
            pi = ffmpeg_tools.probe(dst)
            if pi["width"]:
                info = {k: pi[k] for k in ("width", "height", "duration")}
        except RuntimeError:
            pass
    p["video"] = {"file": name, **info}
    storage.save(slug, p)
    if old and old != name:
        (d / old).unlink(missing_ok=True)
    return {"video": p["video"], "project": p}


@app.get("/media/{slug}/{name}")
def media(slug: str, name: str):
    try:
        f = storage.project_dir(slug) / storage.safe_media_name(name)
    except KeyError:
        raise HTTPException(404)
    if f.name != name or not f.is_file():
        raise HTTPException(404, "No encuentro el video")
    return FileResponse(f)


# ---------------------------------------------------------------- letra y .ass

@app.post("/api/compile")
def compile_project(body: dict = Body(...)):
    """Analiza la letra, aplica los tiempos y genera el .ass de la vista previa."""
    try:
        p = normalize(body)
    except ValueError as e:
        _bad(e)
    lines, chars = parse_lyrics(p["lyrics"], p["chars"], p["times"])
    p["chars"] = chars
    W, H = output_size(p)
    return {"lines": lines, "chars": chars, "size": [W, H], "ass": ass_gen.build_ass(p, p.get("name") or "Karaoke")}


@app.post("/api/syllabify")
def syllabify(body: dict = Body(...)):
    return {"text": syllabify_text(str(body.get("text", "")))}


def _download(text: str, filename: str, media_type: str):
    return Response(text.encode("utf-8"), media_type=media_type,
                    headers={"Content-Disposition": f"attachment; filename*=UTF-8''{filename}"})


@app.post("/api/download/{kind}")
def download(kind: str, body: dict = Body(...)):
    try:
        p = normalize(body)
    except ValueError as e:
        _bad(e)
    base = storage.slugify(p.get("name") or "karaoke")
    if kind == "ass":
        return _download(ass_gen.build_ass(p, p.get("name") or "Karaoke"), f"{base}.ass", "text/x-ssa; charset=utf-8")
    if kind == "srt":
        return _download(ass_gen.build_srt(p), f"{base}.srt", "application/x-subrip; charset=utf-8")
    if kind == "json":
        return _download(json.dumps(p, ensure_ascii=False, indent=1), f"{base}_karaoke.json", "application/json")
    raise HTTPException(404)


# ---------------------------------------------------------------- exportar

PRESETS = {"rapida": "veryfast", "equilibrada": "medium", "maxima": "slow"}


@app.post("/api/projects/{slug}/export")
def export(slug: str, body: dict = Body(...)):
    _project_or_404(slug)
    try:
        p = storage.save(slug, body.get("project") or {})
    except ValueError as e:
        _bad(e)
    if not ffmpeg_tools.ffmpeg_path():
        raise HTTPException(400, "No encuentro ffmpeg. Descárgalo de " + ffmpeg_tools.DOWNLOAD_URL)
    if not p.get("video"):
        raise HTTPException(400, "Primero carga un video")
    src = storage.project_dir(slug) / p["video"]["file"]
    if not src.is_file():
        raise HTTPException(400, "No encuentro el video del proyecto; vuelve a cargarlo")
    if not any(t for line in p["times"] for t in line if t and t[0] is not None):
        raise HTTPException(400, "Todavía no hay sílabas marcadas")
    preset = PRESETS.get(body.get("preset"), "medium")
    ass = ass_gen.build_ass(p, p.get("name") or "Karaoke")
    job = jobs.start("export", jobs.export_video, src, ass, p["output"]["format"], output_size(p), preset,
                     storage.slugify(p.get("name") or slug))
    return job.to_dict()


@app.post("/api/projects/{slug}/whisper")
def whisper(slug: str, body: dict = Body(...)):
    _project_or_404(slug)
    if not whisper_mod.available():
        raise HTTPException(400, "El modo automático no está instalado. Mira el README (requirements-whisper.txt).")
    try:
        p = storage.save(slug, body.get("project") or {})
    except ValueError as e:
        _bad(e)
    if not p.get("video"):
        raise HTTPException(400, "Primero carga un video")
    src = storage.project_dir(slug) / p["video"]["file"]
    mode = "align" if body.get("mode") == "align" else "transcribe"
    if mode == "align" and not p["lyrics"].strip():
        raise HTTPException(400, "Para alinear, primero pega la letra en la pestaña Letra")
    lang = body.get("language") or None
    job = jobs.start("whisper", whisper_mod.whisper_job, src, p, mode, str(body.get("model") or "small"),
                     None if lang == "auto" else lang, str(body.get("speaker") or "").strip()[:24])
    return job.to_dict()


@app.get("/api/jobs/{job_id}")
def job_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Ese trabajo ya no existe")
    return job.to_dict()


@app.post("/api/jobs/{job_id}/cancel")
def job_cancel(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Ese trabajo ya no existe")
    job.cancel()
    return job.to_dict()


@app.get("/exportados/{name}")
def exported(name: str):
    f = EXPORTS_DIR / name
    if "/" in name or "\\" in name or name.startswith(".") or not f.is_file():
        raise HTTPException(404, "No encuentro ese archivo")
    return FileResponse(f, filename=name)


@app.post("/api/open-exports")
def open_exports():
    EXPORTS_DIR.mkdir(exist_ok=True)
    try:
        ffmpeg_tools.open_folder(EXPORTS_DIR)
    except OSError as e:
        raise HTTPException(500, f"No pude abrir la carpeta: {e}")
    return {"path": str(EXPORTS_DIR)}


# ---------------------------------------------------------------- estáticos

@app.get("/")
def index():
    return FileResponse(WEB_DIR / "index.html", headers={"Cache-Control": "no-cache"})


app.mount("/fonts", StaticFiles(directory=FONTS_DIR), name="fonts")
app.mount("/", StaticFiles(directory=WEB_DIR), name="web")


@app.exception_handler(HTTPException)
async def http_error(_, exc: HTTPException):
    return JSONResponse({"error": exc.detail}, status_code=exc.status_code)
