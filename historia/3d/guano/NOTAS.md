# Notas — experimento 3D «Chincha 1850»

Prueba de si se puede producir una escena 3D del canal con Blender controlado por código. Clip de
10 s (240 frames a 24 fps, 1280×720): la cámara entra desde el mar hacia la isla Norte, hace un
paneo leve y cierra sobre un velero fondeado al que bajan sacos por una manga desde el acantilado.
Hay bandadas de guanayes cruzando el cielo.

## Cómo se corre

```bash
blender -b -P historia/3d/guano/escena.py                       # escena + 240 frames + guano.mp4
blender -b -P historia/3d/guano/escena.py -- --prueba --tag v7  # solo frames 1, 120, 240 → pruebas/v7/
blender -b -P historia/3d/guano/escena.py -- --motor eevee      # en la laptop (Iris Xe)
```

Opciones: `--frames 1,60,…`, `--muestras N` (32 por defecto), `--escala 50` (% de resolución),
`--guardar-blend` (deja `out/guano.blend` para abrirlo en la interfaz). Los frames van a `out/frames/`
(fuera de git) y ffmpeg los junta en `guano.mp4` (H.264, yuv420p, CRF 16).

## Cuánto tardó

Máquina: contenedor en la nube, CPU de 4 núcleos, sin GPU. Blender 5.2.3 LTS, Cycles CPU, 32
muestras con muestreo adaptativo y OpenImageDenoise, 4 rebotes de luz.

| Paso | Tiempo |
|---|---|
| Construir la escena (todo procedural) | 0,3 s |
| Frame de prueba a 50 % y 16 muestras (para iterar) | 3–5 s |
| Frame final 1280×720, 32 muestras | 14–28 s (promedio 20 s; sube al acercarse a la isla) |
| **Clip completo, 240 frames** | **81 min (4867 s)** |
| ffmpeg → MP4 | ~8 s (2,6 MB, CRF 16) |

Iteraciones de prueba: 7 rondas (v1–v6 a media resolución, salvo v6, más `final`), cada una de
unos 15 s.

**En tu laptop** (i7-11370H, 4 núcleos y 8 hilos): con Cycles en CPU debería tardar parecido o un
poco menos, del orden de una hora y media para el clip. Con **Eevee en la Iris Xe** es probable que
baje a pocos segundos por frame; ahí no pude probarlo porque el contenedor no tiene contexto
gráfico (falta `libEGL`). Los materiales son nodos estándar que Eevee entiende, pero la luz y la
niebla no van a quedar idénticas a Cycles: antes de renderizar el clip con Eevee hay que mirar los
3 fotogramas de prueba (`--prueba --motor eevee`).

## Qué salió bien

- **Reproducible de punta a punta.** Un solo `escena.py`, sin assets externos ni licencias que
  cuidar. Todo el azar lleva semilla: el mismo dibujo en cada corrida.
- **La paleta se respeta.** Con la transformación de vista «Standard» (no AgX ni Filmic), los hex del
  canal salen como son. Papel #EDE4D3 en el guano, tinta #1C1B19 en el casco, rojo #B3261E solo en
  el gallardete, verde óxido #5E6B4E en el forro de cobre.
- **La garúa es barata.** Es un grupo de nodos que mezcla cada material con el color del horizonte
  según la distancia a la cámara. No mete ruido ni cuesta tiempo, y le da al plano la profundidad
  en capas de una ilustración.
- **Low-poly que se lee.** Facetas grandes en los cerros, sombreado plano y chorreaduras de guano
  cortadas en seco: se ven dibujadas y no fotográficas.
- **La cámara tiene un motivo:** recorrer la distancia del mar a la isla y llegar a la carga. Es una
  sola curva (arranca despacio, viaja, frena) más un vaivén de bote de 12 cm. El desplazamiento de
  lente baja el horizonte al tercio inferior al inicio y lo sube al final sin inclinar la cámara:
  los palos quedan verticales.
- **El ciclo de pruebas sirvió.** Encontró problemas que no se ven en el código: la manga vista de
  canto ocultaba los sacos, el cerro abierto mostraba su interior en el corte booleano, la rampa de
  color recortaba el umbral y las vetas desaparecían.

## Qué no pude lograr

- **Eevee en el contenedor** (sin GPU ni EGL). Usé Cycles en CPU, como acordamos.
- **El barco es esquemático.** Visto de costado es casi una caja con arrufo: no tiene borda, ni
  portas pintadas, ni mascarón, ni velas sueltas. Las jarcias son las mínimas.
- **Los sacos son chicos en pantalla** (unos 10 px). Se leen como «cosas que bajan», no como sacos
  de yute con textura. Además, **el método de carga es dudoso**: ver `fuentes.md`, G9.
- **El mar es correcto, no bonito.** Le faltan espuma alrededor del casco, estela y reflejos que se
  rompan.
- **No hay personas.** Probé tres siluetas al pie del corte, pero el cerro las tapa en todo el
  plano y las saqué.
- **Las aves no aletean.** Son puntos en V que se mueven en cinta. De lejos funciona; de cerca (la
  bandada baja, al final) se nota que son rígidas.
- **Sin sonido.** El clip no trae audio. El ambiente (mar, viento, guanayes) iría en Remotion.
- **Ningún dato histórico tiene fuente todavía.** Todo `fuentes.md` dice [VERIFICAR].

## Qué haría falta para calidad de publicación

1. **Resolver la historia antes que la imagen.** Cómo se cargaba de verdad (G9), el tamaño de los
   cerros (G3) y los barcos típicos (G6). Peck (1854) y Duffield (1877) son de dominio público y
   probablemente traen grabados que sirven de referencia visual directa.
2. **Un barco modelado a mano** (2–4 h en Blender, o un modelo CC0 o CC-BY de un clíper o una
   fragata, revisando la licencia). Es lo que más delata el experimento.
3. **GPU.** Con una GPU dedicada (RTX 3060 o superior, o una máquina en la nube por horas), Cycles
   bajaría de ~20 s a 1–2 s por frame. Eso permite 1920×1080, 64–128 muestras, niebla volumétrica
   de verdad y desenfoque de profundidad, y sobre todo más iteraciones.
4. **Assets CC0 de Poly Haven** solo donde sumen sin romper el low-poly. Por ejemplo, un HDRI
   nublado para los reflejos del mar. No hace falta para el estilo actual.
5. **Animación secundaria:** aves que aletean (dos poses alternadas), espuma en el casco, gallardete
   que flamea (hoy está quieto) y lanchas entre los barcos lejanos.
6. **Integración con el canal:** un paso de «papel» encima, que comparta la textura y el grano de
   `public/compartido` en Remotion. Así deja de verse como 3D pegado.

## Cómo insertarlo en Remotion («ventana al pasado»)

No toqué `historia/src`. Para usarlo:

- Copiar `guano.mp4` a `public/videos/NNN-slug/` y reproducirlo con `<OffthreadVideo>` dentro de un
  marco (una ventana de papel con borde de tinta, o un recorte que se abre).
- **Ojo con los fps:** los videos del canal van a 30 fps y el clip a 24. Remotion lo reproduce bien
  (10 s siguen siendo 10 s), pero repite 1 de cada 4 frames, y en un paneo lento se puede notar un
  tironeo. Si se va a usar, conviene renderizarlo a 30 fps: cambiar `FPS, FRAMES = 30, 300` arriba
  de `escena.py`.
- La cámara se mueve todo el clip. Si la escena de Remotion también mueve cosas encima, se rompe
  la regla de «no mover todo a la vez» (CLAUDE.md §4): dentro de la ventana el marco va quieto.
