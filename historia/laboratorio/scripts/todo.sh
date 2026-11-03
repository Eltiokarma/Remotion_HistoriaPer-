#!/usr/bin/env bash
# Renderiza y revisa toda la tanda 1 (previa y final), y arma el carrete de comparación.
#   LAB_MAQUINA="laptop Huawei i7-11370H" MANIM_PY=~/.venvs/manim/bin/python ./laboratorio/scripts/todo.sh
# Los MP4 quedan en laboratorio/out/ (fuera de git); los registros en laboratorio/resultados/.
set -euo pipefail
cd "$(dirname "$0")/.."
for etapa in previa final; do ./scripts/manim.sh "$etapa"; done
for m in 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  for etapa in previa final; do ./scripts/remotion.sh "$m" "$etapa"; done
done
for m in 01-monedas-manim 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  python3 scripts/revisar.py "$m" "out/$m/final.mp4"
done
./scripts/carrete.sh
