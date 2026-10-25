"""Proyectos en disco: ``proyectos/<slug>/proyecto.json`` + el video copiado."""
from __future__ import annotations

import json
import os
import re
import shutil
import threading
import time
import unicodedata
import uuid
from pathlib import Path

from .paths import EXAMPLE_DIR, PROJECTS_DIR
from .project import new_project, normalize

PROJECT_FILE = "proyecto.json"
LAST_FILE = PROJECTS_DIR / ".ultimo"


def slugify(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:40] or "proyecto"


def _valid(slug: str) -> bool:
    return bool(re.fullmatch(r"[a-z0-9][a-z0-9-]{0,59}", slug))


def project_dir(slug: str) -> Path:
    if not _valid(slug):
        raise KeyError(slug)
    return PROJECTS_DIR / slug


def ensure_example():
    """La primera vez copia el proyecto de ejemplo para que haya algo funcionando."""
    PROJECTS_DIR.mkdir(exist_ok=True)
    dst = PROJECTS_DIR / "ejemplo"
    if not dst.exists() and (EXAMPLE_DIR / PROJECT_FILE).exists():
        shutil.copytree(EXAMPLE_DIR, dst)


def list_projects():
    PROJECTS_DIR.mkdir(exist_ok=True)
    out = []
    for d in PROJECTS_DIR.iterdir():
        f = d / PROJECT_FILE
        if d.is_dir() and f.exists() and _valid(d.name):
            try:
                name = json.loads(f.read_text(encoding="utf-8")).get("name") or d.name
            except (OSError, ValueError):
                name = d.name
            out.append({"slug": d.name, "name": name, "updated": f.stat().st_mtime})
    out.sort(key=lambda x: -x["updated"])
    return out


def load(slug: str) -> dict:
    f = project_dir(slug) / PROJECT_FILE
    if not f.exists():
        raise KeyError(slug)
    p = normalize(json.loads(f.read_text(encoding="utf-8")))
    p.setdefault("name", slug)
    remember(slug)
    return p


_save_lock = threading.Lock()


def _replace(src: Path, dst: Path):
    """os.replace con reintentos: en Windows falla si otro hilo (o el antivirus) tiene
    abierto el destino en ese instante."""
    for i in range(10):
        try:
            os.replace(src, dst)
            return
        except PermissionError:
            if i == 9:
                raise
            time.sleep(0.05 * (i + 1))


def save(slug: str, data: dict) -> dict:
    p = normalize(data)
    d = project_dir(slug)
    d.mkdir(parents=True, exist_ok=True)
    # Un .tmp distinto por escritura y de a una: dos guardados a la vez (autoguardado +
    # exportar) no se pisan el archivo temporal.
    with _save_lock:
        tmp = d / f"{PROJECT_FILE}.{uuid.uuid4().hex[:8]}.tmp"
        try:
            tmp.write_text(json.dumps(p, ensure_ascii=False, indent=1), encoding="utf-8")
            _replace(tmp, d / PROJECT_FILE)  # atómico: un corte de luz no deja el .json a medias
        finally:
            tmp.unlink(missing_ok=True)
    return p


def unique_name(d: Path, name: str) -> str:
    """Un nombre que no exista en la carpeta (no se sobrescribe un video que el
    navegador podría estar leyendo)."""
    stem, ext = os.path.splitext(name)
    cand, n = name, 2
    while (d / cand).exists():
        cand = f"{stem}-{n}{ext}"
        n += 1
    return cand


def remove_quietly(path: Path):
    """Borra sin fallar: en Windows un archivo abierto (el video que se está viendo) no se
    puede borrar; queda como basura chica en vez de romper la operación."""
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass


def create(name: str, data: dict | None = None) -> tuple[str, dict]:
    base = slugify(name)
    slug, n = base, 2
    while (PROJECTS_DIR / slug).exists():
        slug = f"{base}-{n}"
        n += 1
    p = normalize(data) if data else new_project()
    p["name"] = name.strip()[:60] or slug
    if data:
        p["video"] = None  # el video no viaja dentro del .json
    save(slug, p)
    remember(slug)
    return slug, p


def remember(slug: str):
    try:
        PROJECTS_DIR.mkdir(exist_ok=True)
        LAST_FILE.write_text(slug, encoding="utf-8")
    except OSError:
        pass


def last_slug() -> str | None:
    try:
        slug = LAST_FILE.read_text(encoding="utf-8").strip()
        if _valid(slug) and (PROJECTS_DIR / slug / PROJECT_FILE).exists():
            return slug
    except OSError:
        pass
    items = list_projects()
    return items[0]["slug"] if items else None


def safe_media_name(filename: str) -> str:
    stem, ext = os.path.splitext(os.path.basename(filename or "video.mp4"))
    ext = re.sub(r"[^a-zA-Z0-9.]", "", ext)[:6] or ".mp4"
    return slugify(stem) + ext.lower()
