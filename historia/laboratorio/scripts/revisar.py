#!/usr/bin/env python3
"""
Revisa un clip del laboratorio y deja la evidencia en resultados/<muestra>/.

  python3 scripts/revisar.py <muestra> <video.mp4>

Hace dos cosas:
1. Hoja de contactos (hoja.jpg, 12 cuadros, 1 de cada ~0,4 s, ancho 1440): para mirar el clip entero
   de un vistazo y versionarla sin subir el MP4.
2. Cuentas por cuadro (revision.json), sobre una copia gris de 320 px:
   - cambio medio entre cuadros consecutivos (0–255);
   - «parpadeos»: un cuadro que se aparta de sus dos vecinos mientras ellos se parecen entre sí
     (lo típico de una textura que no cargó o un elemento que aparece un solo cuadro);
   - cuadros casi vacíos (desviación estándar muy baja: negro o un color plano);
   - quietud final: el cambio medio del último segundo (si la imagen debía quedar quieta).
No reemplaza mirar el clip: marca dónde mirar.
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

LAB = Path(__file__).resolve().parents[1]
W, H = 320, 180


def cuadros(video: Path) -> np.ndarray:
    crudo = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video), "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(crudo, np.uint8).reshape(-1, H, W).astype(np.float32)


def main() -> int:
    muestra, video = sys.argv[1], Path(sys.argv[2]).resolve()
    destino = LAB / "resultados" / muestra
    destino.mkdir(parents=True, exist_ok=True)
    f = cuadros(video)
    n = len(f)
    paso = max(1, n // 12)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf",
         f"select='not(mod(n\\,{paso}))',scale=360:-1,tile=4x3:padding=4:color=0x1c1b19", "-frames:v", "1",
         "-q:v", "4", str(destino / "hoja.jpg")],
        check=True,
    )
    dif = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))  # dif[i] = |f[i+1] - f[i]|
    parpadeos = []
    for i in range(1, n - 1):
        vecinos = np.abs(f[i + 1] - f[i - 1]).mean()
        salto = min(dif[i - 1], dif[i])
        if salto > 4 and salto > 4 * (vecinos + 0.5):
            parpadeos.append({"cuadro": i, "salto": round(float(salto), 2), "vecinos": round(float(vecinos), 2)})
    vacios = [i for i in range(n) if f[i].std() < 2.0]
    fps = 30 if n >= 150 else 15
    ultimo = dif[-(fps - 1):] if n > fps else dif
    rev = {
        "video": str(video.relative_to(LAB)) if video.is_relative_to(LAB) else str(video),
        "cuadros": n,
        "cambio_medio": round(float(dif.mean()), 3),
        "cambio_maximo": {"cuadro": int(dif.argmax()) + 1, "valor": round(float(dif.max()), 2)},
        "parpadeos": parpadeos,
        "cuadros_vacios": vacios,
        "cambio_medio_ultimo_segundo": round(float(ultimo.mean()), 3),
        "metodo": f"gris {W}×{H}; parpadeo = salto > 4 y > 4× la diferencia entre sus vecinos; vacío = desviación < 2",
    }
    (destino / "revision.json").write_text(json.dumps(rev, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: rev[k] for k in ("cuadros", "cambio_medio", "parpadeos", "cuadros_vacios", "cambio_medio_ultimo_segundo")}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
