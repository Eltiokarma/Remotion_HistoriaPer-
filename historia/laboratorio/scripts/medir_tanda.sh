#!/usr/bin/env bash
# Mediciones de la tanda 1 en condiciones definidas (correr con la máquina sin otra carga):
#   frío     = Remotion: caché de webpack borrada (node_modules/.cache), navegador ya descargado.
#              Manim: carpeta de medios y __pycache__ borrados.
#   caliente = el mismo comando repetido enseguida.
# Deja resultados/<muestra>/{final-frio,final-caliente,previa-caliente}.json y revisa las finales.
set -euo pipefail
cd "$(dirname "$0")/.."
export LAB_MAQUINA="${LAB_MAQUINA:-sin nombre}"
rm -rf out/manim muestras/01-monedas-manim/__pycache__
LAB_CONDICION=frio ./scripts/manim.sh final
LAB_CONDICION=caliente ./scripts/manim.sh final
LAB_CONDICION=caliente ./scripts/manim.sh previa
for m in 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  rm -rf ../node_modules/.cache
  LAB_CONDICION=frio ./scripts/remotion.sh "$m" final
  LAB_CONDICION=caliente ./scripts/remotion.sh "$m" final
  LAB_CONDICION=caliente ./scripts/remotion.sh "$m" previa
done
for m in 01-monedas-manim 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento; do
  python3 scripts/revisar.py "$m" "out/$m/final.mp4"
done
./scripts/carrete.sh
