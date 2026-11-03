#!/usr/bin/env bash
# Render medido de una muestra de Remotion del laboratorio.
#   ./laboratorio/scripts/remotion.sh 02-cordillera-tinta previa   → 960×540 (--scale 0.5), JPEG 70
#   ./laboratorio/scripts/remotion.sh 02-cordillera-tinta final    → 1920×1080, 30 fps
# Se corre desde historia/ (usa su remotion.config.ts: 4 hilos de render).
set -euo pipefail
cd "$(dirname "$0")/../.."
muestra="$1"; etapa="${2:-previa}"; shift 2 || true
case "$etapa" in
  previa) extra=(--scale 0.5 --jpeg-quality 70) ;;
  final)  extra=() ;;
  *) echo "etapa: previa | final"; exit 2 ;;
esac
salida="laboratorio/out/$muestra/$etapa.mp4"
mkdir -p "$(dirname "$salida")"
python3 laboratorio/scripts/medir.py "$muestra" "$etapa${LAB_CONDICION:+-$LAB_CONDICION}" "$salida" -- \
  npx remotion render laboratorio/remotion/index.ts "lab-$muestra" "$salida" "${extra[@]}" "$@"
