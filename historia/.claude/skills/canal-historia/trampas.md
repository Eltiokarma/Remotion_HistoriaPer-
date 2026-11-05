# Trampas conocidas

Cada una con su síntoma (cómo se reconoce), la causa y el arreglo que funcionó. Evidencia en
`historia/laboratorio/INFORME_TECNICO.md` y en los informes de cada muestra.

## Manim: la duración no da

- **Síntoma:** un clip de 5 s sale de 5,13 s (77 cuadros a 15 fps en vez de 75).
- **Causa:** Manim cuenta los cuadros de una animación con `np.arange(0, run_time, 1/fps)` (redondea
  hacia arriba, y la coma flotante a veces suma uno) y los de una espera con `int(duración·fps)`
  (redondea hacia abajo).
- **Arreglo:** beats en cuadros que sean enteros a 15 y a 30 fps; medir lo que falta contra
  `self.renderer.time`; restar 0,0001 s al animar y sumarlo al esperar.
  Modelo: `laboratorio/muestras/01-monedas-manim/monedas.py`.

## Manim: `Transform` entre textos distintos

- **Síntoma:** durante 3–4 cuadros los glifos se deshacen en una «sopa» de trazos.
- **Arreglo:** `FadeTransform` (fundido cruzado) entre textos que no comparten forma.

## Objetos en vuelo que pasan por encima de otros

- **Síntoma:** se ve en movimiento, no en la hoja de contactos. Lo informé mal una vez («roce de
  2–3 cuadros» que era un solape de 39 px).
- **Arreglo:** medir la geometría, no adivinar: `laboratorio/scripts/geometria_monedas.py` calcula la
  distancia mínima entre trayectorias y objetos quietos. Cambiar el arco (`path_arc`) o el orden de
  salida.

## Remotion no espera los fondos CSS

- **Síntoma:** un cuadro sin la textura (papel liso). Visto una vez, no reproducido en 6 intentos.
- **Causa probable:** `background-image` y `<image>` de SVG no retienen la captura; `<Img>` sí.
- **Arreglo:** `PrecargaTexturas` (ya en `VideoLargo` y en el laboratorio). Una imagen nueva como
  fondo: agregarla a la precarga o usar `<Img>`. `npm run reglas` marca los fondos que no son texturas
  del canal (`fondo-sin-espera`).

## `ThreeCanvas` solo redibuja al cambiar el cuadro

- **Síntoma:** el objeto 3D falta en algunos cuadros (0 y 3 en un render), de forma intermitente.
- **Causa:** `@remotion/three` llama a `advance()` cuando cambia el cuadro. Si las texturas llegan
  después, la captura sale con la escena sin ellas.
- **Arreglo:** cuando lo asíncrono termina, llamar a `advance()` **dentro** del lienzo y recién
  entonces `continueRender()`. Modelo: `AlEstarListo` en `laboratorio/muestras/04-libro-3d/Muestra.tsx`.
  `requestAnimationFrame` solo no alcanza.

## Geometría que se deforma de cuadro en cuadro

- **Síntoma:** una hoja que se curva bien en el Studio y desaparece en el render.
- **Causa:** se leían las posiciones ya dobladas del cuadro anterior para calcular el siguiente.
- **Arreglo:** leer una sola vez los valores originales (en `useMemo`) y calcular siempre desde ellos.

## La previa a media escala no ahorra en WebGL ni p5

- **Medido:** con `--scale 0.5` el búfer WebGL sigue en 1920×1080 (R3F limita el dpr a un mínimo de
  1); p5 fija `pixelDensity(1)`. Ahorro de 3–7 % en la muestra 3D.
- **Para revisar ritmo:** el Studio o un tramo (`--frames=60-90`).

## Medir «en frío»

- El primer render en una máquina nueva descarga Chrome Headless Shell (en el contenedor fueron
  90 s). Eso no es «frío»: frío es la caché de webpack vacía con el navegador ya descargado.
- El contenedor y la CI son máquinas compartidas: repetir y dar el rango (±25 % visto).

## Memoria

- Sumar RSS cuenta varias veces la memoria compartida de Chrome. Usar PSS (`medir.py` lo hace).

## Mapas

- `world-atlas` trae países, no lagos ni ríos. No escribir en pantalla lo que el mapa no muestra.
  Para lagos, datos con licencia (QGIS / Natural Earth, tarea `t2-qgis`).

## Three.js

- `PCFSoftShadowMap` ya no existe en three 0.187 (usa `PCFShadowMap`, más duro).
- `RoundedBox` de drei: sus UV no cubren la cara de 0 a 1; para una tapa con imagen, caja simple con
  un material por cara.
- Sin GPU, WebGL corre por SwiftShader; queda registrado con el `console.warn` de la muestra 04.
  Con GPU hay que pasar `--gl` y comprobar en el registro que cambió.

## PixiJS sin GPU: los hilos de render no ayudan

- **Medido (muestra 06):** 30 cuadros tardan lo mismo con 1 hilo que con 4 (44,8 / 41,8 s). Todas las
  pestañas comparten un solo proceso GPU de Chrome con SwiftShader (235 % de CPU; cada pestaña ~9 %).
- **Lo que cuesta son los filtros a pantalla completa** (`BlurFilter`): la mitad del tiempo. La
  cantidad de sprites casi no importa (10× menos gotas, mismo tiempo).
- **Arreglo:** pocos filtros, y solo donde se ven. `cacheAsTexture` para lo quieto no ahorró y
  recortó el contenido en el borde: no usarlo sin mirar el cuadro.
- `segundos_cpu` de `medir.py` no contaba a Chrome (`RUSAGE_CHILDREN`). **Arreglado el 2026-11-05**:
  ahora suma la CPU de todo el árbol de procesos. En 30 cuadros de la 06: 158 s con el método nuevo,
  15 s con el viejo (Chrome eran 143 s). Los registros anteriores solo tienen el viejo.

## Degradados hechos con bandas

- **Síntoma:** rayas horizontales finas en un cielo que se oscurece (se ven a tamaño real, no en la
  hoja de contactos).
- **Causa:** bandas semitransparentes con 1 px de solape: el solape se pinta dos veces.
- **Arreglo:** bandas con bordes enteros y sin solape (muestra 06).

## Medir una muestra de referencia pisaba su registro

- **Síntoma:** al renderizar la 03 para compararla con la 06, su `final-caliente.json` de la tanda 1
  quedó reemplazado por el nuevo (se restauró desde git).
- **Causa:** `medir.py` escribía siempre en `resultados/<muestra>/<etapa>.json`.
- **Arreglo (2026-11-05):** si el registro existe, el nuevo va a `<etapa>-<fecha>.json` y se avisa.
  `medir_tanda.sh` y `ci.sh` reemplazan a propósito con `LAB_SOBRESCRIBIR=1`.
