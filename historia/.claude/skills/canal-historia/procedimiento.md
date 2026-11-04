# Procedimiento de una muestra del laboratorio

Desde `historia/`. Las reglas de comparación están en `laboratorio/README.md`.

## 1. Preparar

- Carpeta `laboratorio/muestras/NN-nombre/` con el código y un `INFORME.md`.
- Remotion: componente en `Muestra.tsx`, registrado en `laboratorio/remotion/Root.tsx`
  (`lab-NN-nombre`, 150 cuadros, 1920×1080, 30 fps; `comun.ts`; otra duración solo si se pide, declarada
  en `Root.tsx`).
- Otra herramienta (Manim, Blender…): su script y un `.sh` en `laboratorio/scripts/` que pase por
  `medir.py`.
- Beats en cuadros, pesos del canal (`tramo`), azar con semilla, paleta y fuentes del canal.
- Antes de escribir: buscar en el catálogo lo que ya existe (`Atmosfera`, `Pluma`, `Papel`, texturas).
- El movimiento, en funciones puras del tiempo aparte del dibujo (`movimiento.ts`, modelo: la 06): así
  se mide sin renderizar.
- Recursos externos: origen y licencia en el informe antes de usarlos.

## 2. Comprobar el código

```bash
npm run typecheck && npm run reglas
```

## 3. Movimiento y fluidez (antes de mirar)

- **La curva, por el material:** lo pesado cae con `tenso` y golpea (`impacto`); el papel cae con aire
  (`natural` al bajar, `ligero` al avanzar, vaivén que se apaga); lo que escribe o traza, `natural`.
- **La velocidad no se corta** entre tramos: cero a los dos lados, o continuada (el roce después de apoyar).
  Solo un golpe declarado frena en seco.
- **Entradas y salidas:** lo que entra o sale de cuadro empieza y termina fuera; nada aparece ni
  desaparece dentro del cuadro.
- **Desenfoque de movimiento** (obturador de 180°) en lo que avanza más de ~25 px por cuadro: copias en
  instantes intermedios, más cuantas más lejos va (`estela` en la 06). Quieto, una copia: no cuesta.
- **Medirlo** (sin navegador): frenazos, sacudidas y cuadros colgados por trayectoria.

```bash
npx tsx laboratorio/scripts/fluidez.ts laboratorio/muestras/NN-nombre/movimiento.ts --json laboratorio/resultados/NN-nombre/fluidez.json
```

## 4. Cuadros sueltos, previa y revisión

Cuadros sueltos sin renderizar el clip (un bundle y un navegador para todos; con `--recorte` a tamaño real):

```bash
node laboratorio/scripts/cuadros.mjs lab-NN-nombre 20,104-106,200 --escala 0.4 --columnas 4
```

Cada vuelta, con una pregunta: el primer y el último cuadro visible de cada cosa; el detalle a tamaño
real (`--recorte x,y,w,h`); el costo por cuadro (`ms_por_cuadro`).

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

## 5. Final medida

```bash
LAB_MAQUINA="<máquina real>" LAB_CONDICION=caliente ./laboratorio/scripts/remotion.sh NN-nombre final
```

Para frío y caliente de toda la tanda: `laboratorio/scripts/medir_tanda.sh`. En la CI corre
`laboratorio/scripts/ci.sh` y deja los MP4 como artefacto.

## 6. Informe (`INFORME.md` de la muestra)

1. Qué demuestra (con evidencia).
2. Qué salió mal: tabla con el problema y su estado (resuelto, con evidencia antes/después; o queda).
3. Qué costó: render (máquina, frío/caliente), agente (de registros), humano (desconocido si no se midió).
4. Para qué escenas del canal sirve.
5. Cómo reproducirlo, parámetros, recursos externos y licencias.

## 7. Roadmap

Actualizar la tarea en `roadmap/roadmap.json` (estado, fecha real, evidencia, tiempos medidos o
`null`) y luego:

```bash
node roadmap/generar.mjs && node roadmap/generar.mjs --comprobar
```
