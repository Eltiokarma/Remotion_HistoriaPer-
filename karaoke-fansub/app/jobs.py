"""Trabajos en segundo plano (exportar video, Whisper) con progreso y cancelación."""
from __future__ import annotations

import subprocess
import threading
import time
import uuid
from collections import deque
from pathlib import Path

from . import ffmpeg_tools as ff
from .paths import EXPORTS_DIR, ROOT


class Cancelled(Exception):
    pass


class Job:
    def __init__(self, kind: str):
        self.id = uuid.uuid4().hex[:12]
        self.kind = kind
        self.status = "running"   # running | done | error | cancelled
        self.progress = 0.0
        self.message = "Empezando…"
        self.result: dict | None = None
        self.error: str | None = None
        self.started = time.time()
        self.proc: subprocess.Popen | None = None
        self._cancel = threading.Event()

    @property
    def cancelled(self) -> bool:
        return self._cancel.is_set()

    def cancel(self):
        self._cancel.set()
        p = self.proc
        if p and p.poll() is None:
            # kill y no terminate: con SIGTERM ffmpeg primero vacía el codificador (segundos);
            # el archivo a medias se borra igual.
            p.kill()

    def check(self):
        if self._cancel.is_set():
            raise Cancelled()

    def to_dict(self):
        return {"id": self.id, "kind": self.kind, "status": self.status, "progress": round(self.progress, 4),
                "message": self.message, "result": self.result, "error": self.error,
                "elapsed": round(time.time() - self.started, 1)}


JOBS: dict[str, Job] = {}


def start(kind: str, fn, *args) -> Job:
    job = Job(kind)
    JOBS[job.id] = job

    def runner():
        try:
            job.result = fn(job, *args)
            job.status = "done"
            job.progress = 1.0
        except Cancelled:
            job.status = "cancelled"
            job.message = "Cancelado"
        except Exception as e:  # noqa: BLE001 - el mensaje va a la interfaz
            if job.cancelled:
                job.status, job.message = "cancelled", "Cancelado"
            else:
                job.status = "error"
                job.error = str(e) or e.__class__.__name__
                job.message = "Falló"

    threading.Thread(target=runner, daemon=True, name=f"job-{kind}-{job.id}").start()
    return job


def get(job_id: str) -> Job | None:
    return JOBS.get(job_id)


# ---------------------------------------------------------------- exportar

def _unique(path: Path) -> Path:
    if not path.exists():
        return path
    for n in range(2, 1000):
        cand = path.with_name(f"{path.stem}_{n}{path.suffix}")
        if not cand.exists():
            return cand
    return path


def run_ffmpeg(job: Job, cmd: list[str], duration: float, out: Path, label: str):
    """Corre ffmpeg leyendo ``-progress pipe:1`` para un porcentaje real."""
    log_tail: deque[str] = deque(maxlen=25)
    job.proc = subprocess.Popen(cmd, cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                text=True, encoding="utf-8", errors="replace", creationflags=ff.NO_WINDOW)

    def read_err():
        for line in job.proc.stderr:
            log_tail.append(line.rstrip())

    t = threading.Thread(target=read_err, daemon=True)
    t.start()
    speed = ""
    for line in job.proc.stdout:
        key, _, val = line.strip().partition("=")
        if key in ("out_time_us", "out_time_ms") and val.isdigit() and duration > 0:
            job.progress = min(0.999, int(val) / 1e6 / duration)
        elif key == "speed":
            speed = val
        elif key == "progress":
            job.message = f"{label} {job.progress * 100:.0f} %" + (f" · {speed}" if speed and speed != "N/A" else "")
    code = job.proc.wait()
    t.join(timeout=2)
    if job.cancelled:
        out.unlink(missing_ok=True)
        raise Cancelled()
    if code != 0:
        out.unlink(missing_ok=True)
        tail = "\n".join(l for l in log_tail if l.strip())[-1500:]
        raise RuntimeError(f"ffmpeg terminó con error ({code}).\n{tail}")


def export_video(job: Job, src: Path, ass_text: str, fmt: str, size, preset: str, base: str,
                 out_dir: Path = EXPORTS_DIR):
    if not ff.ffmpeg_path():
        raise RuntimeError("No encuentro ffmpeg. Descárgalo de " + ff.DOWNLOAD_URL)
    out_dir.mkdir(parents=True, exist_ok=True)
    # El .ass temporal siempre va dentro de la carpeta del programa: ffmpeg lo recibe
    # con una ruta relativa (ver ffmpeg_tools.video_filter).
    tmp = ROOT / "exportados" / ".tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    ass_file = tmp / f"{job.id}.ass"
    ass_file.write_text(ass_text, encoding="utf-8")
    try:
        job.message = "Leyendo el video…"
        info = ff.probe(src)
        W, H = size
        graph = ff.video_filter(fmt, W, H, info["width"], info["height"], ass_file.relative_to(ROOT).as_posix())
        suffix = "_vertical" if fmt != "original" else ""
        out = _unique(out_dir / f"{base}_karaoke{suffix}.mp4")
        cmd = ff.export_cmd(str(src), str(out), graph, info["acodec"], preset)
        job.message = "Quemando la letra…"
        run_ffmpeg(job, cmd, info["duration"], out, "Exportando")
    finally:
        ass_file.unlink(missing_ok=True)
    return {"file": out.name, "path": str(out), "url": f"/exportados/{out.name}"}


def make_proxy(job: Job, src: Path, dst: Path):
    """Copia H.264 liviana solo para la vista previa (p. ej. si el video es HEVC del celular)."""
    if not ff.ffmpeg_path():
        raise RuntimeError("No encuentro ffmpeg. Descárgalo de " + ff.DOWNLOAD_URL)
    info = ff.probe(src)
    tmp = dst.with_name(dst.stem + ".tmp.mp4")
    cmd = [ff.ffmpeg_path(), "-hide_banner", "-nostdin", "-y", "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?",
           "-vf", "scale=-2:'min(720,ih)'", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
           "-progress", "pipe:1", "-nostats", str(tmp)]
    run_ffmpeg(job, cmd, info["duration"], tmp, "Convirtiendo")
    tmp.replace(dst)
    return {"preview": dst.name}
