"""Todo lo que habla con ffmpeg / ffprobe."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from .paths import ROOT

DOWNLOAD_URL = "https://www.gyan.dev/ffmpeg/builds/"
# En Windows evita que se abra una ventana negra por cada llamada.
NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0
MP4_AUDIO = {"aac", "mp3", "ac3", "eac3", "opus", "alac", "flac"}


def _find(name: str) -> str | None:
    exe = name + (".exe" if sys.platform == "win32" else "")
    # ffmpeg/bin/, ffmpeg/ o una carpeta doble al descomprimir (ffmpeg/ffmpeg-7.1-essentials_build/bin/)
    cands = [ROOT / "ffmpeg" / "bin" / exe, ROOT / "ffmpeg" / exe, *sorted((ROOT / "ffmpeg").glob(f"*/bin/{exe}"))]
    for cand in cands:
        if cand.is_file():
            return str(cand)
    return shutil.which(name)


def ffmpeg_path() -> str | None:
    return _find("ffmpeg")


def ffprobe_path() -> str | None:
    return _find("ffprobe")


def run(cmd, **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace",
                          creationflags=NO_WINDOW, **kw)


def status() -> dict:
    ff, fp = ffmpeg_path(), ffprobe_path()
    version = None
    has_ass = False
    if ff:
        try:
            r = run([ff, "-hide_banner", "-version"], timeout=10)
            version = (r.stdout.splitlines() or [""])[0]
            r = run([ff, "-hide_banner", "-filters"], timeout=10)
            has_ass = any(l.split()[1:2] == ["ass"] for l in r.stdout.splitlines() if l.strip())
        except (OSError, subprocess.SubprocessError):
            ff = None
    return {"ffmpeg": bool(ff), "ffprobe": bool(fp), "version": version, "assFilter": has_ass,
            "downloadUrl": DOWNLOAD_URL}


def probe(path: Path | str) -> dict:
    """Duración, tamaño (ya rotado) y códecs. Lanza RuntimeError si no se puede."""
    fp = ffprobe_path()
    if not fp:
        raise RuntimeError("No encuentro ffprobe")
    r = run([fp, "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)], timeout=60)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip() or "ffprobe no pudo leer el archivo")
    data = json.loads(r.stdout or "{}")
    info = {"duration": float(data.get("format", {}).get("duration") or 0), "width": 0, "height": 0,
            "vcodec": None, "acodec": None}
    for s in data.get("streams", []):
        if s.get("codec_type") == "video" and info["vcodec"] is None and s.get("disposition", {}).get("attached_pic") != 1:
            w, h = int(s.get("width") or 0), int(s.get("height") or 0)
            rot = 0
            for sd in s.get("side_data_list", []) or []:
                if "rotation" in sd:
                    rot = int(float(sd["rotation"]))
            rot = rot or int(float((s.get("tags") or {}).get("rotate", 0) or 0))
            if abs(rot) % 180 == 90:
                w, h = h, w
            info.update(width=w, height=h, vcodec=s.get("codec_name"))
            if not info["duration"]:
                info["duration"] = float(s.get("duration") or 0)
        elif s.get("codec_type") == "audio" and info["acodec"] is None:
            info["acodec"] = s.get("codec_name")
    return info


def video_filter(fmt: str, W: int, H: int, src_w: int, src_h: int, ass_rel: str) -> str:
    """Grafo de filtros: encuadre según el formato y luego el .ass con las fuentes del proyecto.

    Las rutas son relativas a la carpeta del programa (ffmpeg corre con cwd ahí) para
    no tener que escapar ``C:`` dentro del filtro en Windows.
    """
    ass = f"ass={ass_rel}:fontsdir=fonts"
    if fmt == "vertical-crop":
        return (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,{ass}[v]")
    if fmt == "vertical-blur":
        return (
            f"[0:v]split=2[a][b];"
            f"[a]scale={W // 4}:{H // 4}:force_original_aspect_ratio=increase,crop={W // 4}:{H // 4},"
            f"boxblur=10:2,scale={W}:{H},setsar=1[bg];"
            f"[b]scale={W}:{H}:force_original_aspect_ratio=decrease,setsar=1[fg];"
            f"[bg][fg]overlay=(W-w)/2:(H-h)/2,{ass}[v]"
        )
    scale = f"scale={W}:{H}," if (src_w, src_h) != (W, H) else ""
    return f"[0:v]{scale}setsar=1,{ass}[v]"


def export_cmd(src: str, out: str, graph: str, acodec: str | None, preset: str) -> list[str]:
    cmd = [ffmpeg_path() or "ffmpeg", "-hide_banner", "-nostdin", "-y", "-i", src,
           "-filter_complex", graph, "-map", "[v]", "-map", "0:a:0?",
           "-c:v", "libx264", "-preset", preset, "-crf", "18", "-pix_fmt", "yuv420p"]
    if acodec is None or acodec in MP4_AUDIO:
        cmd += ["-c:a", "copy"]
    else:
        cmd += ["-c:a", "aac", "-b:a", "192k"]
    cmd += ["-movflags", "+faststart", "-progress", "pipe:1", "-nostats", out]
    return cmd


def open_folder(path: Path) -> None:
    if sys.platform == "win32":
        os.startfile(str(path))  # noqa: S606
    elif sys.platform == "darwin":
        subprocess.Popen(["open", str(path)])
    else:
        subprocess.Popen(["xdg-open", str(path)])
