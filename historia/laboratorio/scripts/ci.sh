#!/usr/bin/env bash
# Lo que corre la CI (workflow «laboratorio»): las cinco finales, su revisión y el carrete.
# Una sola pasada (sin frío/caliente): sirve para reproducir en una máquina limpia y entregar los MP4.
set -euo pipefail
cd "$(dirname "$0")/.."
LAB_CONDICION=ci ./scripts/manim.sh final
for m in 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  LAB_CONDICION=ci ./scripts/remotion.sh "$m" final
done
for m in 01-monedas-manim 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  python3 scripts/revisar.py "$m" "out/$m/final.mp4"
done
./scripts/carrete.sh
