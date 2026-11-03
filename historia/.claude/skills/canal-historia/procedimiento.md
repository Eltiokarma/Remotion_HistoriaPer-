# Procedimiento de una muestra del laboratorio

Desde `historia/`. Las reglas de comparación están en `laboratorio/README.md`.

## 1. Preparar

- Carpeta `laboratorio/muestras/NN-nombre/` con el código y un `INFORME.md`.
- Remotion: componente en `Muestra.tsx`, registrado en `laboratorio/remotion/Root.tsx`
  (`lab-NN-nombre`, 150 cuadros, 1920×1080, 30 fps; `comun.ts`).
- Otra herramienta (Manim, Blender…): su script y un `.sh` en `laboratorio/scripts/` que pase por
  `medir.py`.
- Beats en cuadros, pesos del canal (`tramo`), azar con semilla, paleta y fuentes del canal.
- Recursos externos: origen y licencia en el informe antes de usarlos.

## 2. Comprobar el código

```bash
npm run typecheck && npm run reglas
```

## 3. Previa y revisión

```bash
./laboratorio/scripts/remotion.sh NN-nombre previa
```

```bash
python3 laboratorio/scripts/revisar.py NN-nombre laboratorio/out/NN-nombre/previa.mp4
```

- Mirar `resultados/NN-nombre/hoja.jpg` y además los tramos de movimiento a tamaño real
  (`ffmpeg -ss <s> -i … -frames:v 1` o un `select` de cuadros con `tile`).
- Un parpadeo local en un objeto que se mueve rápido puede ser solo movimiento: mirar esos cuadros.
- Antes de corregir un defecto, guardar la evidencia en `resultados/NN-nombre/antes/`.

## 4. Final medida

```bash
LAB_MAQUINA="<máquina real>" LAB_CONDICION=caliente ./laboratorio/scripts/remotion.sh NN-nombre final
```

Para frío y caliente de toda la tanda: `laboratorio/scripts/medir_tanda.sh`. En la CI corre
`laboratorio/scripts/ci.sh` y deja los MP4 como artefacto.

## 5. Informe (`INFORME.md` de la muestra)

1. Qué demuestra (con evidencia).
2. Qué salió mal: tabla con el problema y su estado (resuelto, con evidencia antes/después; o queda).
3. Qué costó: render (máquina, frío/caliente), agente (de registros), humano (desconocido si no se midió).
4. Para qué escenas del canal sirve.
5. Cómo reproducirlo, parámetros, recursos externos y licencias.

## 6. Roadmap

Actualizar la tarea en `roadmap/roadmap.json` (estado, fecha real, evidencia, tiempos medidos o
`null`) y luego:

```bash
node roadmap/generar.mjs && node roadmap/generar.mjs --comprobar
```
