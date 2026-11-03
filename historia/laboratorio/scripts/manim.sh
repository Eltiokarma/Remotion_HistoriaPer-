#!/usr/bin/env bash
# Render de la muestra 01 (Manim), medido.
#   ./scripts/manim.sh previa   → 854×480, 15 fps (rápida, para revisar el ritmo)
#   ./scripts/manim.sh final    → 1920×1080, 30 fps
# Requiere el entorno de Python de muestras/01-monedas-manim/requirements.txt
# (variable MANIM_PY con la ruta del python de ese entorno; por defecto, python3).
set -euo pipefail
cd "$(dirname "$0")/.."
etapa="${1:-previa}"
py="${MANIM_PY:-python3}"
case "$etapa" in
  previa) calidad=(-ql); carpeta=480p15 ;;
  final)  calidad=(--resolution 1920,1080 --frame_rate 30); carpeta=1080p30 ;;
  *) echo "etapa: previa | final"; exit 2 ;;
esac
crudo="out/manim/videos/monedas/$carpeta/$etapa.mp4"
python3 scripts/medir.py 01-monedas-manim "$etapa${LAB_CONDICION:+-$LAB_CONDICION}" "$crudo" -- \
  "$py" -m manim render "${calidad[@]}" --disable_caching --media_dir out/manim \
  -o "$etapa" muestras/01-monedas-manim/monedas.py DiezMonedas
mkdir -p out/01-monedas-manim && cp "$crudo" "out/01-monedas-manim/$etapa.mp4"
