"""Integración real con ffmpeg: video de prueba de 5 s, quemar el .ass y verificar."""
import subprocess
import time

import pytest

from app import ffmpeg_tools as ff
from app import jobs
from app.ass_gen import build_ass
from app.project import normalize, output_size

pytestmark = pytest.mark.skipif(not ff.ffmpeg_path() or not ff.ffprobe_path(), reason="ffmpeg no está instalado")

LYRICS = "Ana: zar|pa|mos\nLuis: ho|ri|zon|te"
TIMES = [[[0.5, 0.9], [0.9, 1.3], [1.3, 1.8]], [[2.0, 2.4], [2.4, 2.8], [2.8, 3.3], [3.3, 3.9]]]


@pytest.fixture(scope="module")
def clip(tmp_path_factory):
    path = tmp_path_factory.mktemp("clip") / "prueba.mp4"
    subprocess.run([
        ff.ffmpeg_path(), "-hide_banner", "-loglevel", "error", "-y",
        "-f", "lavfi", "-i", "testsrc=size=640x360:rate=25:duration=5",
        "-f", "lavfi", "-i", "sine=frequency=440:duration=5",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(path),
    ], check=True)
    return path


def project(fmt="original"):
    return normalize({"lyrics": LYRICS, "times": TIMES, "output": {"format": fmt},
                      "video": {"file": "prueba.mp4", "width": 640, "height": 360, "duration": 5}})


@pytest.mark.parametrize("fmt, size", [("original", (640, 360)), ("vertical-blur", (1080, 1920)),
                                       ("vertical-crop", (1080, 1920))])
def test_quemar_ass(clip, tmp_path, fmt, size):
    p = project(fmt)
    assert output_size(p) == size
    job = jobs.Job("test")
    res = jobs.export_video(job, clip, build_ass(p), fmt, size, "ultrafast", "prueba", out_dir=tmp_path)
    out = tmp_path / res["file"]
    assert out.is_file() and out.stat().st_size > 10_000
    info = ff.probe(out)
    assert abs(info["duration"] - 5.0) < 0.15
    assert (info["width"], info["height"]) == size
    assert info["vcodec"] == "h264" and info["acodec"] == "aac"  # el audio se copió
    assert job.progress > 0.9


def test_la_letra_aparece_en_el_video(clip, tmp_path):
    """Con letra (t=1 s) el video quemado difiere mucho del original; sin letra (t=4.6 s) casi nada."""
    p = project()
    res = jobs.export_video(jobs.Job("t"), clip, build_ass(p), "original", (640, 360), "ultrafast", "x", out_dir=tmp_path)

    def frame(src, t):
        r = subprocess.run([ff.ffmpeg_path(), "-v", "error", "-ss", str(t), "-i", str(src), "-frames:v", "1",
                            "-vf", "crop=640:100:0:250", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                           capture_output=True, check=True)
        return r.stdout

    def changed_pixels(t):
        a, b = frame(clip, t), frame(tmp_path / res["file"], t)
        return sum(1 for x, y in zip(a, b) if abs(x - y) > 60) / len(a)

    con_letra, sin_letra = changed_pixels(1.0), changed_pixels(4.6)
    assert con_letra > 0.005, "no se ve la letra quemada en la franja inferior"
    assert con_letra > 5 * sin_letra, (con_letra, sin_letra)


def test_cancelar(clip, tmp_path, monkeypatch):
    p = project("vertical-blur")
    # Un video largo (loop) para que dé tiempo a cancelar.
    real_cmd = ff.export_cmd
    monkeypatch.setattr(ff, "export_cmd", lambda src, out, graph, ac, preset, *a: real_cmd(src, out, graph, ac, "veryslow", *a))
    job = jobs.start("export", jobs.export_video, clip, build_ass(p), "vertical-blur", (1080, 1920), "veryslow",
                     "cancelar", tmp_path)
    for _ in range(100):
        if job.proc is not None:
            break
        time.sleep(0.05)
    job.cancel()
    for _ in range(200):
        if job.status != "running":
            break
        time.sleep(0.05)
    assert job.status == "cancelled"
    assert not list(tmp_path.glob("*.mp4"))


def test_error_de_ffmpeg_se_informa(tmp_path):
    bad = tmp_path / "roto.mp4"
    bad.write_bytes(b"esto no es un video")
    job = jobs.start("export", jobs.export_video, bad, build_ass(project()), "original", (640, 360), "ultrafast",
                     "roto", tmp_path)
    for _ in range(200):
        if job.status != "running":
            break
        time.sleep(0.05)
    assert job.status == "error" and job.error


def test_copia_liviana_para_la_vista_previa(clip, tmp_path):
    dst = tmp_path / "vista-previa-x.mp4"
    res = jobs.make_proxy(jobs.Job("p"), clip, dst)
    info = ff.probe(dst)
    assert res["preview"] == dst.name and info["vcodec"] == "h264" and abs(info["duration"] - 5) < 0.2


def test_solo_audio_exporta_con_fondo_negro(tmp_path):
    mp3 = tmp_path / "tono.mp3"
    subprocess.run([ff.ffmpeg_path(), "-v", "error", "-f", "lavfi", "-i", "sine=frequency=330:duration=3", str(mp3)],
                   check=True)
    p = normalize({"lyrics": LYRICS, "times": TIMES, "video": {"file": "tono.mp3", "width": 0, "height": 0}})
    size = output_size(p)
    res = jobs.export_video(jobs.Job("a"), mp3, build_ass(p), "original", size, "ultrafast", "audio", out_dir=tmp_path)
    info = ff.probe(tmp_path / res["file"])
    assert (info["width"], info["height"]) == size and info["acodec"] == "mp3" and abs(info["duration"] - 3) < 0.2


def test_probe_tolera_duracion_desconocida(monkeypatch):
    class R:
        returncode, stderr = 0, ""
        stdout = '{"format": {"duration": "N/A"}, "streams": [{"codec_type": "video", "width": 10, "height": 20, "duration": "N/A"}]}'
    monkeypatch.setattr(ff, "run", lambda *a, **k: R())
    assert ff.probe("x") == {"duration": 0.0, "width": 10, "height": 20, "vcodec": None, "acodec": None}
