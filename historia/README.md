# Historia del Altiplano: videos animados (Remotion)

Cada video es **datos** (un guion y un `escenas.json`) que se dibujan con una biblioteca de
escenas y piezas compartidas. El prototipo es el video **000: El hombre que le sacó la cuenta
al Perú** (fase 2: 11 escenas, ~9 min), todo animado: tipografía, grabados, mapas y objetos
dibujados en código, sin fotos ni metraje.

## Usar

Necesitas Node 18 o más nuevo.

```
npm install
npm run studio                    # vista previa en el navegador
npm run validar                   # revisa todos los videos contra las reglas del canal
npx remotion render v000-quiroz out/000-quiroz.mp4    # video final (1920×1080, 30 fps)
```

Antes del render final: `npm run validar -- 000-quiroz --final` tiene que pasar sin errores
(exige la voz real, cero `[VERIFICAR]` en `fuentes.md` y ningún «POR COMPLETAR»).

Las reglas del canal (dirección, sonido, cómo enseñar) están en **`CLAUDE.md`**: léelo antes de
escribir un guion o una escena.

Para revisar un guion sin ver el video: `npm run escaleta -- 000-quiroz` escribe
`videos/000-quiroz/escaleta.md`, con lo que dice la voz, lo que pasa en pantalla y lo que suena
segundo a segundo, y un semáforo por escena (voz seguida, largo de frases, datos por minuto). El
diagnóstico del video 000 está en `videos/000-quiroz/diagnostico.md`.

En el Studio hay una carpeta por video (el video entero y **cada escena sola**, para trabajarla
sin esperar el resto) y la carpeta **catalogo** (ver «Reciclar» más abajo).

## Cómo está ordenado

```
videos/                        ← lo que se escribe para cada video (todo en git)
  000-quiroz/
    escenas.json               ← plan de dirección: escenas, textos, cifras, beats, paleta, audio
    guion.md                   ← la narración
    fuentes.md                 ← cada dato con su fuente y cada asset con su licencia
    glosario.txt               ← nombres propios (para los subtítulos)
    voz_provisional.txt        ← texto para la voz de prueba (TTS)
    escaleta.md                ← generada: voz, imagen y sonido segundo a segundo
    diagnostico.md             ← dónde se separan guion, imagen e intención
  _plantilla/                  ← de aquí sale cada video nuevo
public/
  compartido/                  ← sirve para cualquier video
    fuentes/  texturas/  audio/sfx/  audio/ambiente/
  videos/000-quiroz/           ← lo propio de un video
    musica/  voz-provisional/  voz/ (fuera de git)  imagenes/ (fuera de git)
bibliografia/                  ← fichas de lectura (citas textuales con página), una por libro
  quiroz-2013.md               ← el libro de la serie: índice, cuadros, prólogo, prefacio, introducción
src/
  escenas/                     ← catálogo de escenas: cada una en su carpeta
    Presentacion/  esquema.ts (qué datos acepta, beats, ejemplo) + Escena.tsx (la coreografía)
  components/                  ← piezas sueltas que usan las escenas
    graficos/  texto/  atmosfera/  audio/
  direction/                   ← gramática: easings por peso, tiempos, reglas de ritmo
  estilo/                      ← fuentes tipográficas, colores, rutas de archivos
  templates/                   ← formato largo (16:9) y el catálogo del Studio
  registro.ts                  ← lista de videos (npm run nuevo-video la actualiza)
scripts/                       ← validar, escaleta, nuevo-video, audio, texturas, voz provisional
```

Regla de oro: **ningún componente tiene contenido de un video escrito adentro.** Nombres,
cifras, fechas y lugares viven en `escenas.json`; los componentes solo saben dibujar.

## Quiero cambiar…

| Quiero cambiar…                                    | Dónde                                                                 |
|----------------------------------------------------|-----------------------------------------------------------------------|
| un texto, nombre, cifra o lugar en pantalla        | `videos/<id>/escenas.json` → `props` de esa escena                    |
| cuándo pasa algo (el sello, la flecha, la barra)   | `escenas.json` → `beats` de la escena (segundos)                      |
| cuánto dura una escena                             | la voz manda; lo que sigue después de la voz es `cola_s`              |
| los colores del video                              | `escenas.json` → `paleta` (4 colores)                                 |
| la música de una escena                            | `audio.musica` (archivo en `public/videos/<id>/musica/`)              |
| el ambiente (viento, mar, ciudad…)                 | `audio.ambientes` (biblioteca en `public/compartido/audio/ambiente/`) |
| un silencio deliberado                             | `audio.silencio` con dos beats                                        |
| cuánto baja la música cuando hablo                 | `audio.duck_db`                                                       |
| el grano de película o la viñeta                   | `escenas.json` → `atmosfera`                                          |
| cómo se dibuja un gráfico (mapa, libro, repisa…)   | `src/components/graficos/<Pieza>.tsx`                                 |
| la coreografía de una escena                       | `src/escenas/<Escena>/Escena.tsx`                                     |
| qué datos acepta una escena                        | `src/escenas/<Escena>/esquema.ts`                                     |
| las curvas de movimiento (solemne, pesado…)        | `src/direction/easings.ts`                                            |
| las reglas de ritmo que revisa `validar`           | `src/direction/ritmo.ts`                                              |
| las tipografías                                    | `src/estilo/fuentes.ts` + archivos en `public/compartido/fuentes/`    |
| los efectos de sonido y ambientes                  | `scripts/generar_audio.py` → `npm run generar:audio`                  |

Si `escenas.json` tiene un error, el Studio y `npm run validar` dicen exactamente qué campo
está mal, por ejemplo:
`s03 · props.cifra.hasta: Entrada inválida: se esperaba número, recibido texto`.

## Reciclar

### El catálogo

En el Studio, la carpeta **catalogo** tiene cada escena con datos de muestra. El panel de
props de la derecha deja cambiar textos, cifras, lugares y colores y ver el resultado al
instante. Lo que quede bien se copia tal cual a las `props` de una escena en `escenas.json`.

| Escena            | Qué hace                                                                                     | Datos principales                                  |
|-------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------|
| Escena              | Qué hace                                                                                                   | En 000 |
|---------------------|------------------------------------------------------------------------------------------------------------|--------|
| `PruebasDeImprenta` | Ficha a máquina, pruebas con marcas de corrector, una frase de libro subrayada, dos sellos con corte seco  | s01    |
| `Presentacion`      | Nombre grande y años; fondo `papel` o `piscina` (el carril se vuelve renglón); sello y/o palabra final sola | s02    |
| `TiempoLargo`       | Sello sobre una lista, muro de afiches de época (uno se despega), volante y las tres capas de Braudel       | s03    |
| `MecanismoDeuda`    | Islas con sacos, plata al Estado, vales consolidados, lo prometido en punteado, vale que se infla, caudal a bolsillos, frase tachada, tesis → libro | s04 |
| `AprenderAMedir`    | Ruta que duda y cambia de destino, nube de puntos con recta, balanza, repisa de temas, aula, brújula        | s05    |
| `LaPregunta`        | Título a máquina con signos rojos, televisor con estática y REC, globo con fichas, dos palabras finales     | s06    |
| `Objeciones`        | Cuatro tarjetas que pasan al centro y se dan vuelta (legajos, medidor, diccionario, tachado) + engranaje que se traba | s07 |
| `LaCuenta`          | Regla de décadas, 100 unidades de las que cae el rango rojo, franja anual del PBI, niveles por época, país y su fantasma | s08 |
| `CirculosCorruptos` | Anillos que se cierran y red que crece alrededor de un título; cartel de obra con una palabra tachada        | s09    |
| `Denunciantes`      | Lista tachada, cordillera con punto que baja y escala de altura, mercurio → plata, corte a negro, nombres, índice de la serie | s10 |
| `Cierre`            | La pila del inicio se limpia y se cierra; fundido a negro; tarjeta del próximo episodio con emblema          | s11    |
| `DiasYManuscrito`   | Calendario que suelta hojas cada vez más lento + manuscrito que una pluma corrige                           | (v1)   |
| `PaisajeALibro`     | Grabado que se da vuelta como página: libro de cuentas, cifra que se infla, flecha                           | (v1)   |
| `MapaRutas`         | Carta antigua con rutas; se apaga, queda una pregunta y una barra                                            | (v1)   |
| `SerieCapitulos`    | Repisa con un libro por época, de grosor proporcional a sus años                                             | (v1)   |

(v1) = se usaron en la primera versión del video 000; siguen en el catálogo para reciclarlas.

Los beats de cada escena (y qué hace cada uno) están descritos en su `esquema.ts`.

### Las piezas sueltas

Para una escena nueva no hace falta empezar de cero: estas piezas reciben todo por props y se
pueden combinar.

- **Gráficos** (`components/graficos/`):
  - papel y archivo: `PilaDePaginas` (manuscrito o pruebas de imprenta, con correcciones que se
    pueden borrar), `Carpeta`, `Pluma`, `Sello` y `SelloFecha`, `Vale` (bono con guilloché),
    `PortadaLibro`, `Afiche`, `LibroContable`;
  - grabados: `GrabadoGuanero` (islas, aves, fragata, sacos), `Barco`, `EdificioEstado` (fachada
    con ventanas que se encienden), `Cordillera` (Andes con escala de altura), `Engranaje`;
  - mapas y datos: `Mapa`, `Globo`, `SiluetaPais`, `RosaDeLosVientos`, `Barra`, `BarraUnidades`
    (100 unidades que se desprenden), `GraficoNiveles`, `Dispersion` (nube de puntos y regresión
    de verdad), `CapasDeTiempo`, `CirculosRed`, `IndiceSerie`, `LomosDeLibro`, `Estante`;
  - objetos: `Balanza`, `Brujula`, `TelevisorCRT` (estática, nunca imágenes), `GotaMercurio`
    (mercurio que se vuelve plata), `CartelObra`, `Aula`, `Calendario`, `Piscina`.
- **Texto** (`components/texto/`): `Ficha` (dato de archivo a máquina), `TrazoRojo` (subrayar o
  tachar a mano), `Renglones` (texto simulado: llena páginas sin inventar contenido),
  `MaquinaDeEscribir`, `Odometro` (cifras que ruedan con acarreo real), `Tarjeta`, `Ornamento`.
- **Atmósfera** (`components/atmosfera/`): `Papel` (textura y bordes envejecidos), `Luz` (luz de
  lámpara), `Atmosfera` (grano de película y viñeta, ya puesta en todo video).
- **SVG** (`components/graficos/svg.tsx`): filtros de tinta y desgaste, bordes de papel,
  escritura asémica, renglones tipeados.
- **Dirección** (`direction/`): `tramo()` (0→1 entre dos segundos, con el peso que digas),
  `peso` (solemne, pesado, natural, ligero, tenso), `azar()` (aleatorio con semilla: el mismo
  dibujo en cada render).

### Una escena nueva

1. Crea `src/escenas/MiEscena/esquema.ts` con `esquema` (zod), `beats` (descripción de cada
   uno) y `ejemplo` (datos de muestra). Copia uno existente como modelo.
2. Crea `src/escenas/MiEscena/Escena.tsx`: recibe `escena`, `props` y `video`.
3. Regístrala en `src/escenas/esquemas.ts` y `src/escenas/index.ts`. Aparece sola en el catálogo.

### Un video nuevo

```
npm run nuevo-video -- 001-reformas "El fracaso de las reformas coloniales"
npm run nuevo-video -- 001-reformas "El fracaso…" --desde 000-quiroz   # parte de las escenas de otro video
```

Crea `videos/001-reformas/` desde la plantilla, las carpetas de `public/videos/001-reformas/`
y lo agrega al Studio. Lo que falta llenar dice «POR COMPLETAR».

## La voz manda

Por ahora suena una **voz provisional** (TTS, en `public/videos/000-quiroz/voz-provisional/`),
solo para probar ritmo y tiempos. Para reemplazarla, graba cada escena por separado y guárdala
en `public/videos/000-quiroz/voz/s01.wav`, `s02.wav`… (esa carpeta está fuera de git). No hay
que tocar nada más: la voz real gana sola.

- Cada escena dura **lo que dura su voz + `cola_s`** (si no hay voz: `duracion_s` + `cola_s`).
- `duracion_s` son los segundos de narración estimados, y los `beats` están medidos sobre ese
  tiempo. Cuando llega la voz real, los beats se estiran en la misma proporción. La cola no los
  mueve.
- Para el corte final, cuadra cada beat con la palabra justa (por ejemplo `s02.beats.sello`
  cuando dices "1974") y pon `"beats_ajustados": true` en esa escena para que ya no se estiren.

La voz provisional sale de `videos/<id>/voz_provisional.txt` con
`python scripts/voz_provisional.py 000-quiroz <voz.onnx>` (necesita `piper-tts` y ffmpeg).
Además escribe `voz-provisional/tiempos.json`: en qué segundo empieza cada frase y, estimado,
cada palabra. Con eso se cuadraron los beats de la fase 2 (y servirá para los subtítulos).

## Música, ambiente y efectos

Todo el audio es sintetizado con `scripts/generar_audio.py` (numpy, sin muestras de terceros):

```
npm run generar:audio                     # lo que falte (no pisa lo que ya existe)
npm run generar:audio -- compartido       # efectos y ambientes
npm run generar:audio -- 000-quiroz       # la música de ese video
npm run generar:audio -- 000-quiroz --forzar   # volver a componerla (p. ej. con la voz real)
```

La música de cada escena se compone **sobre sus beats**: el script lee `escenas.json` y la
duración de la voz, y pone cada cambio donde pasa algo (el arpegio que frena con el carril, el
pulso que se acelera con el vale, el corte en seco cuando se traba el engranaje). Cuando llegue la
voz real y se cuadren los beats, `--forzar` la vuelve a componer en los nuevos tiempos. El tema del
canal (quena sobre bombo y charango) suena recién en el cierre: es la firma de la serie.

En `escenas.json`, cada escena tiene su bloque `audio`:

- `musica` y `ambientes`: pista, `nivel` (0–1) y opcionalmente `desde_beat` / `hasta_beat`
  (entran o salen con un fundido en ese beat). Si la música trae `desde_beat`, el archivo
  empieza a sonar en ese beat (la música *entra* ahí, como al final de s01 o el tema en s11).
- `silencio`: música y ambiente se callan del todo entre dos beats.
- `duck_db`: cuánto baja la música cuando habla la voz (se mide la voz cuadro a cuadro).

Entre escenas, el sonido de la siguiente entra 12 frames antes que su imagen y el de la anterior
se queda 15 frames (cortes J/L); `"transicion_salida": "duro"` los quita. Los efectos (teclas,
hojas, sello, pluma, campanas, golpe…) están en cada escena y caen en sus beats, así que se
mueven solos si cambian los tiempos.

## Lo que revisa `npm run validar`

Las reglas del canal (CLAUDE.md §3–§6), además de la forma del JSON:

- **Errores**: campos mal puestos; beats que no existen o que caen después del final; música o
  ambientes que no están; tres escenas seguidas que duran casi lo mismo (±10 %); curva de
  intensidad plana (desviación < 1); video que no está en `src/registro.ts`.
- **Avisos** (errores con `--final`): sin silencio deliberado; la música no pasa por ausente,
  presente y protagonista; `[VERIFICAR]` en `fuentes.md`; «POR COMPLETAR»; voz provisional.
- **Avisos**: ducking fuera de −12 a −18 dB; silencio fuera de 1.5–3 s; pico de intensidad
  muy al principio; beats que la escena no usa; falta `glosario.txt`.
- **Errores** también si una escena pide un efecto de sonido que no existe.

## Render

`remotion.config.ts` usa 4 hilos (laptop i7-11370H; nunca 8). El grano de película se nota en
el peso del archivo final: es normal.

El video 000 completo (9:20) tardó ~14 min a media resolución en la máquina de pruebas; a
resolución completa en la laptop calculo entre 45 y 70 min. Mientras se trabaja conviene
renderizar una escena sola:

```
npx remotion render v000-quiroz-s04 out/s04.mp4
```

## Pendiente

- Cotejado con el libro hasta la p. 59 (`bibliografia/quiroz-2013.md`). `fuentes.md` lista 26
  correcciones para el guion (C1–C26) y lo que sigue `[VERIFICAR]`: la cita de s01 en pantalla,
  las cifras y **los niveles por período de s08, que son un marcador** (Apéndice, pp. 535–554),
  el desenlace de Ulloa (cap. 1), la «grava» (pp. 536–537) y el lugar de nacimiento.
- Grabar la voz real, cuadrar los beats con ella (`"beats_ajustados": true`) y recomponer la
  música (`npm run generar:audio -- 000-quiroz --forzar`).
- Subtítulos nativos en Remotion (el guion lo propone): `tiempos.json` ya da el punto de partida.
