#!/usr/bin/env bash
# Une las cinco muestras finales en un solo clip de 25 s (out/tanda-1.mp4), con el número de cada
# muestra en una esquina, para verlas seguidas y compararlas. Solo la 01 trae sonido.
set -euo pipefail
cd "$(dirname "$0")/.."
ms=(01-monedas-manim 02-cordillera-tinta 03-viento-p5 04-libro-3d 05-mapa-documento)
args=(); filtro=""
for i in "${!ms[@]}"; do
  args+=(-i "out/${ms[$i]}/final.mp4")
  filtro+="[$i:v]setpts=PTS-STARTPTS,drawbox=x=24:y=24:w=120:h=48:color=0x1c1b19@0.8:t=fill,drawtext=text='${ms[$i]:0:2}':x=44:y=32:fontsize=30:fontcolor=0xede4d3:fontfile=../public/compartido/fuentes/IBMPlexMono-Regular.ttf[v$i];"
done
filtro+="[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]"
ffmpeg -v error -y "${args[@]}" -filter_complex "$filtro" -map "[v]" -c:v libx264 -pix_fmt yuv420p -crf 20 out/tanda-1.mp4
echo "out/tanda-1.mp4"
