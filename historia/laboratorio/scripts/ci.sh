#!/usr/bin/env bash
# Lo que corre la CI (workflow «laboratorio»): las finales (tanda 1 y de la 06 a la 13), su revisión y el carrete de la tanda 1.
# Una sola pasada (sin frío/caliente): sirve para reproducir en una máquina limpia y entregar los MP4.
set -euo pipefail
export LAB_SOBRESCRIBIR=1 # estas corridas reemplazan los registros a propósito
cd "$(dirname "$0")/.."
LAB_CONDICION=ci ./scripts/manim.sh final
for m in 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento 06-lluvia-pixi 09-puno-noche 10-balsa-inkscape 11-titulo-inkscape 12-titulo-editable 13-efectos 14-grabado-buril; do
  LAB_CONDICION=ci ./scripts/remotion.sh "$m" final
done
for m in 01-monedas-manim 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento 06-lluvia-pixi 09-puno-noche 10-balsa-inkscape 11-titulo-inkscape 12-titulo-editable 13-efectos 14-grabado-buril; do
  python3 scripts/revisar.py "$m" "out/$m/final.mp4"
done
./scripts/carrete.sh
