# Animatic de la escena 3 del 0·2: «El expediente de Novoa»

Prueba de ritmo y énfasis sobre la **voz real** (`voz/s03.mp3`, «Joder Jolines», `eleven_v4`), con los fondos, papeles y fichas de la galería del episodio. Sale del [storyboard versión 2](../../../videos/002-la-deuda-defraudada/storyboard.md) (planos 3.1 a 3.7) y de su propuesta de comparar versiones cambiando una variable por vez. No es la escena terminada: no hay música, personajes, cámara en movimiento ni efectos finos.

## Las tres versiones

| Versión | Qué cambia | Duración |
|---|---|---|
| A · base | Cámara quieta. La cifra de Novoa entra como cualquier papel: se desliza sobre los folios de Elías y de la respuesta, con un halo. | la de la voz |
| B · + momento reservado | En «Días después» la mesa se vacía; el vale aparece solo y quieto, sin deslizarse ni halo, y se sostiene en el silencio. Lo demás, igual que A. | la de la voz |
| C · + respiros | B más los respiros de montaje del storyboard al final de cada plano (7,5 s en total): la voz se corta en esas pausas y la imagen se sostiene. | voz + 7,5 s |
| E1–E6 · auditoría | Versiones acumulativas sobre D, una capa por versión: E1 mesa desaturada, E2 una presentación por persona, E3 composición, E4 física, E5 texto en tinta, E6 etiquetas de cartón. Ver INFORME. | voz + 7,5 s |
| **F · en revisión** | E6 más dos cambios que pidió Gerson el 21 de noviembre de 2026. Cada persona, la primera vez que se nombra, sale en primer plano: medallón grande, nombre y función, con la mesa desenfocada. A los 1,3 s el medallón vuela a la etiqueta de su papel, que entra a la vez. Además, un papel distinto por dueño: carta de Elías, oficio del gobierno y recibo de Novoa. | voz + 7,5 s |
| D | C, pero el vale entra deslizándose como en A (sin halo). Con caja negra en los textos y etiqueta de dueño sobre cada documento. Elegida por Gerson el 20 de noviembre de 2026; reemplazada por E6. | voz + 7,5 s |
| E6 | Todas las capas de la auditoría. Gerson la eligió el 21 de noviembre de 2026 y pidió tres arreglos: la etiqueta del vale pisaba la de Elías en 3.5, la voz repetía una «s» hacia el segundo 66 y no se entendía si los 180 000 eran aparte o parte de los 948 500. Ver INFORME. | voz + 7,5 s |

La comparación que importa: **A frente a B** (¿se siente distinta la cifra?) y **B frente a C** (¿los respiros dejan asentar o vuelven lento el caso?). Ver sin sonido y con sonido.

## Reproducir

Desde `historia/`, con las dependencias instaladas y la galería extraída en `public/videos/002-la-deuda-defraudada/imagenes/chatgpt/` (ver `videos/002-la-deuda-defraudada/galeria.md`):

```sh
node laboratorio/muestras/16-animatic-novoa/preparar.mjs
npx remotion studio laboratorio/muestras/16-animatic-novoa/index.tsx --public-dir=laboratorio/muestras/16-animatic-novoa/public
node laboratorio/muestras/16-animatic-novoa/renderizar.mjs
```

`renderizar.mjs` saca cuadros de revisión y las tres versiones a 960 × 540, 30 fps, en `laboratorio/out/16-animatic-novoa/` (fuera de git). `--solo-cuadros` saca solo los cuadros; `A`, `B` o `C` renderizan una sola versión. Los tiempos quedan en `resultados/render-*.json`.

## Cómo está hecho

- `linea.ts`: la voz manda. Cada plano del storyboard ocupa su tramo de voz (de la primera frase del plano a la primera del siguiente); en C se suma su respiro. Lo visual se calcula en «tiempo de voz», que se queda quieto durante un respiro.
- `Animatic.tsx`: papeles de la galería con texto encima (máquina de escribir para lo que se anota, EB Garamond para la cifra), fichas a máquina del canal (`Ficha`), el subrayado del corrector (`TrazoRojo`), `tramo` con los pesos del canal y un `Sfx` de hoja por papel que entra (ninguno en la cifra de B y C: es silencio).
- `preparar.mjs`: copia a `public/` (fuera de git) solo lo que se usa: cuatro imágenes, la voz, fuentes, texturas y dos efectos.

## Fuentes

Datos de Q, p. 171 (Novoa, Elías, Echenique, Torrico, montos en vales), como en `videos/002-la-deuda-defraudada/fuentes.md`. La ficha de la abolición sale del decreto de Huancayo (3 de diciembre de 1854). Las imágenes son de la galería del episodio, generadas con ChatGPT (registro en `fuentes.md`).
