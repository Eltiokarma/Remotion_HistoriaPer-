# 06 · La mesa con volumen (10 s)

**Herramienta:** Remotion 4.0.539, CSS 3D (`perspective`, `preserve-3d`) y piezas del canal (`Papel`,
`trazoManuscrito`, `FiltroTinta`, `tramo`, `asienta`, `impacto`, `azar`, `Sfx`). Ninguna dependencia
nueva. **Código:** [`Muestra.tsx`](Muestra.tsx).

**Pregunta:** el veredicto de Gerson sobre la tanda 1 fue «está bien, pero se ve muy plano»
(`canal-historia/criterios.md`). ¿Deja de verse plana la misma escena de la 05 (un documento llega
a la mesa y el corrector señala «Puno») si se le da volumen, sin cambiar de herramienta?

**Dura 10 s, no 5:** lo pidió Gerson (2026-11-04). Es una excepción a la regla 1 del laboratorio,
declarada en `remotion/Root.tsx`.

![hoja de contactos](../../resultados/06-mesa-con-volumen/hoja.jpg)

## Qué cambia respecto de la 05

| Plano en la 05 | Con volumen en la 06 |
|---|---|
| La mesa es el fondo de la pantalla, de frente | Mesa en perspectiva; lo lejano se pierde en lo oscuro |
| Luz pareja | Una lámpara que se enciende (titila una vez), su charco ocre en la mesa y un haz con polvo que flota |
| Sombra fija bajo el papel | La sombra dice la altura: mientras el papel cae, se achica, se afila y se oscurece |
| Una sola capa | Primer plano desenfocado (lomos de libros) que se mueve más que la mesa: paralaje |
| Papel plano | Un libro con tapa, cantos de hojas y lomo, iluminado por un solo lado |
| Todo entra con el mismo pulso | Quietud → caída → quietud → golpe → quietud → trazo |

## Beats (s)

| Tramo | Qué pasa | Peso | Sonido |
|---|---|---|---|
| 0,0–1,2 | La lámpara se enciende. Cámara quieta | natural | tic |
| 1,2–3,4 | La cámara se acerca. Motivo: la luz invita a mirar. Nada más se mueve | pesado | — |
| 3,6–4,3 | El papel cae planeando, en arco, y se asienta con un roce | tenso | hoja |
| 4,3–5,6 | Quietud | — | — |
| 5,6–6,15 | El libro entra desde lo oscuro y cae; se aplasta como cartón (0,05). El borde del papel se levanta y el polvo del haz salta | tenso | golpe |
| 6,15–7,2 | Quietud | — | — |
| 7,2–7,8 | El rojo de corrector subraya «Puno» | ligero | lápiz |
| 8,2–9,4 | La cámara se abre para ver el tablero entero. Los objetos, quietos | solemne | — |
| 9,4–10 | Quieto | — | — |

Cámara quieta el 66 % del tiempo (se mueve 2,2 s + 1,2 s de 10). Cuando la cámara se mueve, los objetos están quietos. El ambiente
`cuarto` entra y sale con un fundido.

## Qué salió mal (corregido)

| Problema | Arreglo |
|---|---|
| Se veía el borde de la mesa arriba y el papel quedaba cortado abajo, fuera del charco de luz | Objetos y luz movidos al centro; degradado hacia lo oscuro en el fondo de la mesa |
| El libro caía desde tan alto que pasaba delante de la cámara y tapaba el papel (un cuadro negro) | Cae desde menos altura y entra desde el fondo oscuro, en arco |
| En el golpe, el papel desaparecía: el giro del «soplo» iba hacia abajo y lo hundía bajo la mesa | El giro va siempre hacia arriba (comentado en el código) |
| Los lomos del primer plano tapaban el libro | Más bajos, más oscuros y más desenfocados |
| Riesgo de que Chrome ordene una sombra encima del papel | Mesa, luz y sombras van en una capa plana; solo los objetos van en 3D |

## Revisión automática (`scripts/revisar.py`)

- **Medido:** 300 cuadros, 1920×1080, 30 fps, con audio. Ningún parpadeo global ni cuadro vacío.
- Dos saltos locales: el cuadro 128 (el papel aterriza, 4,3 s) y el 189 (el borde del papel se
  levanta tras el golpe). **Observado** a tamaño real: son los movimientos buscados, no defectos.

## Qué costó

- **Render final:** 63,2 s de reloj (34,8 s de CPU), pico de memoria (PSS) de 2,7 GB. **Medido** en
  el contenedor de la sesión en la nube (Xeon de 2,1 GHz, 4 hilos), no en la laptop: no se traslada.
- **Agente y humano:** desconocido (no medido).

## Lo que no prueba

- Si Gerson la ve con volumen o la sigue viendo plana: eso lo dice él.
- El haz y el polvo son una simulación 2D por encima de la mesa 3D: con un movimiento de cámara
  grande se notaría. Aquí la cámara se mueve poco.
- Sin voz: el ritmo no está anclado a una narración.

## Para qué escenas del canal

Cualquier escena de «documento en la mesa» (las pruebas de imprenta, cartas, expedientes) y, si se
aprueba, una pieza del catálogo: `Mesa` con lámpara, sombras por altura y objetos con cuerpo.

## Reproducir

```bash
cd historia
```

```bash
./laboratorio/scripts/remotion.sh 06-mesa-con-volumen final
```

```bash
python3 laboratorio/scripts/revisar.py 06-mesa-con-volumen laboratorio/out/06-mesa-con-volumen/final.mp4
```

Contenido: escritura asémica salvo «Puno»; sin citas, fechas ni cifras. Recursos externos: ninguno
(texturas, fuentes y sonidos de `public/compartido/`).
