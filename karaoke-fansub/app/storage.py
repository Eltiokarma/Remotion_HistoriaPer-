"""Proyectos en disco: ``proyectos/<slug>/proyecto.json`` + el video copiado."""
from __future__ import annotations

import json
import os
import re
import shutil
import unicodedata
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


def save(slug: str, data: dict) -> dict:
    p = normalize(data)
    d = project_dir(slug)
    d.mkdir(parents=True, exist_ok=True)
    tmp = d / (PROJECT_FILE + ".tmp")
    tmp.write_text(json.dumps(p, ensure_ascii=False, indent=1), encoding="utf-8")
    os.replace(tmp, d / PROJECT_FILE)  # escritura atómica: un corte de luz no deja el .json a medias
    return p


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
