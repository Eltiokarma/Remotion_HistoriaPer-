#!/usr/bin/env python3
"""
¿Sale igual un cuadro dibujado en frío que en caliente?

  python3 laboratorio/scripts/comprobar_texturas.py <etiqueta> <cuadro> <composición> [<composición>...]
  (desde historia/; usa src/index.ts, la entrada de los episodios; --entrada=<archivo> para otra)

Para cada composición:
1. «frío»: `remotion still` del cuadro pedido. Es una pestaña nueva de Chrome: ninguna imagen está
   cargada. Si una textura que se pinta como fondo CSS no llegó a tiempo, falta en esta captura.
2. «caliente»: `remotion render --sequence --concurrency=1` de los 4 cuadros que terminan en el
   pedido; el último se dibuja cuando la pestaña ya cargó las texturas en los anteriores.
3. Se comparan los dos PNG del mismo cuadro: todo lo demás es determinista (azar con semilla, el
   grano depende del cuadro), así que deberían ser iguales.

Deja resultados/infra-texturas/<etiqueta>.json con la diferencia media (0–255), el porcentaje de
píxeles que cambian más de 8 niveles y, si hay diferencia, un recorte comparado.
"""

import glob
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

LAB = Path(__file__).resolve().parents[1]
HISTORIA = LAB.parent


def correr(cmd: list[str]) -> None:
    r = subprocess.run(cmd, cwd=HISTORIA, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"falló: {' '.join(cmd)}\n{r.stdout[-1500:]}\n{r.stderr[-1500:]}")


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    entrada = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--entrada=")), "src/index.ts")
    etiqueta, cuadro, comps = args[0], int(args[1]), args[2:]
    destino = LAB / "resultados" / "infra-texturas"
    destino.mkdir(parents=True, exist_ok=True)
    filas = []
    for comp in comps:
        with tempfile.TemporaryDirectory() as tmp:
            frio = Path(tmp) / "frio.png"
            correr(["npx", "remotion", "still", entrada, comp, str(frio), f"--frame={cuadro}", "--image-format=png"])
            correr(["npx", "remotion", "render", entrada, comp, str(Path(tmp) / "seq"), "--sequence", "--image-format=png",
                    "--concurrency=1", f"--frames={max(0, cuadro - 3)}-{cuadro}"])
            caliente = Path(sorted(glob.glob(str(Path(tmp) / "seq" / "*.png")))[-1])
            a = np.asarray(Image.open(frio).convert("RGB"), dtype=np.int16)
            b = np.asarray(Image.open(caliente).convert("RGB"), dtype=np.int16)
            d = np.abs(a - b).max(axis=2)
            fila = {
                "composicion": comp,
                "cuadro": cuadro,
                "diferencia_media": round(float(d.mean()), 3),
                "pixeles_que_cambian_pct": round(float((d > 8).mean() * 100), 3),
            }
            if fila["pixeles_que_cambian_pct"] > 0.1:
                # recorte comparado: frío arriba, caliente abajo, en la zona de más diferencia
                ys, xs = np.nonzero(d > 8)
                cy, cx = int(np.median(ys)), int(np.median(xs))
                x0, y0 = max(0, min(cx - 320, a.shape[1] - 640)), max(0, min(cy - 180, a.shape[0] - 360))
                caja = (x0, y0, x0 + 640, y0 + 360)
                lado = Image.new("RGB", (640, 724), (28, 27, 25))
                lado.paste(Image.open(frio).convert("RGB").crop(caja), (0, 0))
                lado.paste(Image.open(caliente).convert("RGB").crop(caja), (0, 364))
                nombre = f"{etiqueta}-{comp}-f{cuadro}.jpg"
                lado.save(destino / nombre, quality=82)
                fila["recorte_frio_arriba_caliente_abajo"] = nombre
            print(json.dumps(fila, ensure_ascii=False))
            filas.append(fila)
    (destino / f"{etiqueta}.json").write_text(json.dumps({"entrada": entrada, "filas": filas}, ensure_ascii=False, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
