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

## Movimiento y CSS 3D (muestra 06)

- **Un papel que cae con `tenso` se cuelga y se clava.** `tenso` empieza casi sin velocidad y termina
  con seis veces la media: la hoja queda quieta en el aire y frena en un cuadro (`fluidez.ts`: 5 cuadros
  colgada, frenazo de 195 px/c²). El papel cae con aire: `natural` para bajar (colchón de aire),
  `ligero` para avanzar (entra rápido y frena por roce), un vaivén que se apaga. `tenso`, para lo pesado.
- **Lo que gira cerca de la mesa la atraviesa.** Síntoma: el papel se pone negro o desaparece en un
  cuadro. Causa: girar en `rotateX` hunde una mitad bajo z = 0, y la sombra queda encima. Arreglo: el
  giro, siempre hacia arriba, y la inclinación limitada por la altura (`clamp(alto / 120)`).
- **Algo que cae desde muy alto pasa delante de la cámara.** Síntoma: un rectángulo oscuro tapa la
  escena un cuadro. Arreglo: menos altura, y que entre desde el fondo o desde un borde.
- **Sombras sobre los objetos.** Chrome a veces ordena una sombra a z = 0 sobre un papel a z = 1. Mesa,
  luz y sombras van en una capa plana (sin `preserve-3d`); los objetos, en 3D encima.
- **`opacity` < 1, `filter` y `clip-path` aplanan `preserve-3d`** (especificación CSS; aquí se evitó
  por diseño, no se vio fallar). Por eso la opacidad de la estela va en cada cara del libro, no en la caja.
- **Las copias de la estela en 3D se dibujan por profundidad, no por el orden del DOM.** Para que todas
  pesen igual (peso 1/(k+1)), se ordenan por altura.
- **Un piso plano con hijos tapa lo que se para sobre él.** Síntoma: al acercarse la cámara, la
  lámpara (un plano vertical sobre el escritorio) se «hunde» de abajo hacia arriba. Prueba: el cuadro
  sin piso la muestra entera; sin pared, no. Partir el piso por la línea de la lámpara no bastó (ni
  con `clip-path` ni con contenedores de su tamaño). Arreglo: escenas 3D separadas con la misma cámara,
  apiladas en orden fijo (pared, mesa, lámpara), cuando la coreografía asegura que nada pasa delante.
- **Planear el encuadre sin renderizar.** `proyectar` (muestra 06) repite la transformación CSS de la
  cámara: dice dónde cae en pantalla cada punto. Sirve para elegir la cámara con números y para dibujar
  en 2D lo que sale de un objeto 3D (el haz desde la pantalla de la lámpara).
- **Entradas y salidas de cuadro.** La pluma aparecía ya dentro del cuadro (200) y desaparecía dentro
  (245). Mirar el primer y el último cuadro visible de cada cosa; el origen y el destino, fuera de cuadro.

## Herramientas

- **`npx remotion still` arma el bundle en cada llamada:** 6,6 s por cuadro en caliente (38,7 s el
  primero tras arrancar el contenedor). `laboratorio/scripts/cuadros.mjs`: un bundle y un navegador
  para todos, 1,6–2 s por cuadro.
- **`tsx` compila los scripts como CommonJS:** sin `await` en el nivel superior (`fluidez.ts` usa `.then`).
- **`getPointAtLength` (@remotion/paths) puede devolver `null`** según sus tipos: envolverlo con un valor
  por defecto.
