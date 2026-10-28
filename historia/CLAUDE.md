# CLAUDE.md — Canal de Historia del Altiplano

Este archivo es la referencia fija del proyecto. Léelo completo antes de tocar código, escenas o
guiones. Si una instrucción puntual del usuario contradice este archivo, gana el usuario, pero
avísale qué regla se está rompiendo.

## 0. Qué es este proyecto

Canal de YouTube de historia de Puno y el altiplano (Perú + Bolivia: Titicaca, collas, lupacas,
aimaras, quechuas, colonia, rebeliones, república). Meta: ~200 videos, ritmo objetivo de un video
semanal bien hecho, no volumen. Los videos se agrupan en **series** sobre un tema (la primera:
*Historia de la corrupción en el Perú*, a partir del libro de Alfonso W. Quiroz).

- **Autor y narrador:** Gerson. Raíz aimara (Azángaro), vive en Juliaca (3825 m). Su voz y su punto
  de vista son el producto.
- **Idioma:** español peruano. Términos en quechua/aimara con su grafía correcta.
- **Motor:** Remotion (React → video). Licencia gratuita (individuo).
- **Máquina de render:** laptop Huawei, i7-11370H (4 núcleos / 8 hilos), Intel Iris Xe, 16 GB RAM.
  4 hilos de render (`remotion.config.ts`), máximo 6, nunca 8.

**El problema que este proyecto existe para resolver.** Los videos hechos con IA salen correctos
pero robóticos: planos de duración idéntica, la misma curva de easing en todo, música pareja de
inicio a fin, narración que llena cada segundo, texto en pantalla que repite la voz, cámara que se
mueve sin motivo. Nada está mal, pero nada está decidido.

**Regla madre:** cada elemento en pantalla debe existir por una decisión, no por defecto. Si no
puedes explicar por qué un plano dura lo que dura, o por qué algo se mueve, está mal.

**Y el propósito:** educar, no solo exponer y sorprender. El espectador tiene que poder armar
párrafos: entender una idea, verla probada y quedarse con ella antes de la siguiente (§8).

## 1. Tres niveles de reglas

Una serie se hace en el tiempo y necesita libertad para decidir. Por eso las reglas no pesan igual.

### 1.1 Innegociables

No tienen excepción.

1. **Narración con la voz real de Gerson.** No usar TTS para la narración principal (la política
   de YouTube de julio de 2025 sobre "contenido inauténtico" desmonetiza voz sintética sobre
   material producido en serie). TTS solo para citas o personajes puntuales, marcado como tal, y
   como **voz provisional** de trabajo, que nunca se publica.
2. **Rigor histórico.** Todo dato (fecha, cifra, nombre) tiene su fuente en `fuentes.md` del video.
   Si no la tiene, se marca `[VERIFICAR]` y no se renderiza el final hasta resolverlo. No se
   inventan datos: si falta uno, se marca y se sigue. Una frase entre comillas o compuesta como cita
   es **textual**, copiada de la página (las fichas están en `bibliografia/`); si no, se dice sin
   comillas. Las cautelas del autor («casi con seguridad», «habría», «preliminares») se conservan.
3. **Imágenes con licencia clara.** Dominio público, CC compatible con uso comercial o material
   propio. Origen y licencia de cada asset en `fuentes.md`.
4. **Nada de plantillas clonadas.** Cada video tiene al menos una secuencia visual pensada para su
   tema. La plantilla es gramática, no molde.
5. **Archivos pesados fuera de git.** La voz real, las imágenes pesadas y `out/` están en
   `.gitignore` (excepción: SVG, JSON, fuentes tipográficas y el audio sintetizado, que es chico).

### 1.2 Reglas de oficio

Las de §3 a §8. Son el punto de partida: evitan lo robótico. **Se pueden romper**, pero solo a
propósito: la excepción se declara en `escenas.json` con su motivo y `npm run validar` la muestra
como decisión, no como error.

```json
"excepciones": [
  { "regla": "paleta", "escenas": ["s09"], "motivo": "el cartel de obra pide amarillo; sale del ocre y solo aparece ahí" }
]
```

Reglas que se pueden declarar: `duraciones-parejas`, `intensidad-plana`, `pico-temprano`,
`sin-silencio`, `estados-musica`, `ducking`, `largo-silencio`, `paleta`, `texto-repite-voz`,
`pregunta-tardia`, `ensenar` (la lista y su descripción están en `src/esquema.ts`, `REGLAS_DE_OFICIO`).
Una excepción sin motivo no es una decisión.

### 1.3 Gramática de la serie

Lo que se repite en todos los episodios de una serie y le da identidad. Libera al resto del
episodio para inventar. Para *Historia de la corrupción en el Perú*:

- **La ficha a máquina** (`Ficha`): lugar, fecha, institución, en monoespaciada con su cuadrito rojo.
- **Las pruebas de imprenta** abren y cierran: el libro como objeto que se corrige, se limpia y se
  cierra.
- **El índice como mapa de la serie** (`IndiceSerie`): en cada episodio, encendido el capítulo
  donde estamos.
- **Una palabra clave por episodio** a pantalla completa, como conclusión de un párrafo, quieta
  (no más de una: si hay más, se declara `texto-repite-voz`).
- **El rojo de corrector** es para lo que importa: subrayar, tachar, señalar el dato.
- **El tema del canal** (quena sobre bombo y charango) suena solo al final.

## 2. Estructura del repo

```
historia/
├── CLAUDE.md                     ← este archivo
├── bibliografia/                 ← fichas de lectura de los libros de la serie: citas textuales con página
├── src/
│   ├── Root.tsx                  ← registra los videos, cada escena sola y el catálogo
│   ├── esquema.ts                ← forma de escenas.json (zod) y las reglas de oficio
│   ├── registro.ts               ← lista de videos (npm run nuevo-video la actualiza)
│   ├── escenas/<Escena>/         ← catálogo: esquema.ts (props, beats, ejemplo) + Escena.tsx
│   ├── components/               ← piezas reutilizables: graficos/, texto/, atmosfera/, audio/
│   ├── direction/                ← gramática: easings.ts (peso), anim.ts, ritmo.ts, timing.ts, voz.ts
│   ├── estilo/                   ← fuentes, colores, rutas de archivos
│   └── templates/                ← VideoLargo (16:9) y el catálogo del Studio
├── videos/NNN-slug/
│   ├── guion.md                  ← lo escribe/revisa Gerson
│   ├── escenas.json              ← plan de dirección (§9)
│   ├── fuentes.md                ← bibliografía y licencias de assets
│   ├── glosario.txt              ← nombres propios (para los subtítulos)
│   ├── voz_provisional.txt       ← texto para la voz de trabajo (TTS)
│   ├── escaleta.md               ← GENERADA: voz, imagen y sonido segundo a segundo (§8)
│   └── diagnostico.md            ← revisión del guion contra imagen e intención
├── public/
│   ├── compartido/               ← fuentes, texturas, efectos y ambientes de todos los videos
│   └── videos/NNN-slug/          ← música, voz (fuera de git), voz-provisional, imagenes (fuera de git)
└── scripts/                      ← validar, escaleta, nuevo-video, generar_audio, generar_texturas, voz_provisional
```

Cada video es datos (guion + escenas), no un proyecto aparte. Los componentes se comparten.
`README.md` tiene la tabla «quiero cambiar X → archivo Y».

## 3. Montaje y ritmo

**Prioridades al decidir un corte (Walter Murch, regla de seis):**

1. Emoción (51 %): ¿qué debe sentir el espectador aquí?
2. Historia (23 %): ¿avanza el relato?
3. Ritmo (10 %): ¿se siente el pulso correcto?
4. Trayectoria del ojo: ¿dónde está mirando el espectador al cortar?
5. Plano 2D de la pantalla: continuidad de direcciones.
6. Espacio 3D: continuidad espacial.

Si un corte es técnicamente limpio pero emocionalmente muerto, está mal. Si sirve a la emoción
aunque rompa continuidad, probablemente está bien.

**Reglas de ritmo** (`src/direction/ritmo.ts`, las revisa `npm run validar`):

- No tres planos seguidos con la misma duración (tolerancia ±10 %).
- Alternar compresión y respiro: ráfagas de planos cortos (1,5–3 s) seguidas de un plano largo
  (6–12 s) que deja asentar.
- El plano más largo de cada sección va en su momento de mayor peso emocional, no al inicio.
- Un plano con texto dura al menos lo que se tarda en leerlo (≈ 0,3 s por palabra + 1 s).

**Montaje por choque (Eisenstein) y efecto Kuleshov.** El significado nace de la yuxtaposición. El
orden es el mensaje: antes de fijar una secuencia, pregúntate qué lee el espectador en la
transición. Al menos una yuxtaposición deliberada por video, anotada en `"intencion"`.

## 4. Movimiento y animación

**Principios de Disney que aplican:** slow in / slow out; anticipación (un pequeño movimiento
contrario antes de uno grande); follow through (las capas se asientan en cascada con 2–6 frames
de desfase); timing = peso (lo importante se mueve más lento y con más masa).

**Easings por peso** (`src/direction/easings.ts`): `solemne`, `pesado`, `natural`, `ligero`,
`tenso`. Nunca un easing global; cada animación declara su peso (con `tramo(t, desde, dura, peso)`).
Para lo físico (caída, rebote, asentamiento), `spring()` con `config` explícito.

**Cámara.**

- Toda cámara se mueve por un motivo, y el motivo se anota en `escenas.json` (`"camara"`: beat,
  movimiento, motivo). Lo que no está anotado es cámara quieta. Movimiento sin motivo = protector
  de pantalla.
- Planos estáticos permitidos y necesarios: al menos 20 % del tiempo con cámara quieta.
- No mover todo a la vez: si la cámara se mueve, los elementos quietos; si los elementos se mueven
  (una pluma que escribe, un afiche que se pega), la cámara quieta.

**El movimiento guía.** Cuando el guion pasa de un momento a otro (de una fecha a otra, de un
lugar a otro, de una causa a su efecto), el espectador no salta: **recorre**. Que pueda atravesar
en la cabeza los meses, los kilómetros o los pasos que hay en medio es lo que le permite ordenarlos
(secuenciar), y llegar da satisfacción.

- Un recorrido tiene un camino visible (una línea de tiempo, una ruta en el mapa, una cadena de
  causas), un destino que se anuncia antes de llegar y una cámara que lo sigue con peso: arranca
  despacio, viaja y frena (`solemne` o `pesado`, nunca lineal).
- Elementos que guían el ojo, elegidos por lo que pasa y lo que se siente, no por adorno: lo
  recorrido se enciende y lo que falta queda punteado; una flecha va delante; las marcas se
  iluminan al pasar; el destino brilla más mientras nos acercamos; lo que queda atrás se
  desvanece. Colores con sentido: el rojo apagado para una pérdida, el ocre que brilla para lo que
  se logró.
- El sonido cuenta el camino: un tic por tramo que pasa, un golpe o una hoja al llegar.
- Al llegar, la cámara se abre para que se vea el camino entero: el viaje queda como mapa.
- Recorrer no es mover por mover: sigue valiendo «toda cámara con motivo» (el motivo es el paso del
  tiempo o del espacio que dice la voz) y el silencio es su mejor momento (el viaje ocupa la pausa).
- El modelo: `LineaDeTiempo` en 000·s01 (de la muerte de Quiroz a la salida del libro, mes por mes).
  Se puede aplicar, por ejemplo, a la ruta Lima → Nueva York (000·s05), a los años entre la tesis y
  el libro (000·s04) o a los siete capítulos de la serie (000·s10).

## 5. Composición

**Contraste y afinidad (Bruce Block).** Afinidad en la exposición, contraste creciente hacia el
clímax, afinidad en el cierre. Cada escena declara `"intensidad": 1–5`; la curva del video sube
hacia el clímax y no es plana (desviación ≥ 1).

**Reglas de cuadro.**

- Una idea por cuadro. Si hay que leer, escuchar y mirar algo distinto al mismo tiempo, sobra algo.
- El texto en pantalla no transcribe la narración: aporta lo que la voz no dice (fecha, nombre,
  cifra, lugar). Excepción de la serie: la palabra clave (§1.3).
- El centro con intención (poder, solemnidad); los tercios para tensión y dirección.
- Aire en la dirección de la mirada o del movimiento.
- **Paleta por video** en `escenas.json`: tinta (`fondo`), `papel` y tres acentos (`ocre`, `rojo`,
  `verde`). No se sale de ahí sin declarar la excepción.

## 6. Sonido

El sonido transforma lo que se ve; no lo acompaña nomás (Michel Chion). Es la mitad del video.

- **La voz manda.** Va a −16 LUFS. Los ambientes están normalizados a −30 LUFS (14 dB por debajo)
  y bajan 8 dB más cuando hay voz; la música baja entre 12 y 18 dB (`duck_db`). El ducking se
  sostiene en las pausas cortas entre frases y vuelve despacio solo en las pausas largas.
- **Silencio deliberado:** al menos un momento de 1,5–3 s sin música por video, justo antes o
  después del dato más fuerte. En el guion: `[SILENCIO 2s]`; en `escenas.json`: `audio.silencio`.
- **La música no es una alfombra:** entra, sale, cambia. Mínimo tres estados por video (ausente,
  presente, protagonista). Se compone sobre los beats de cada escena (`scripts/generar_audio.py`).
- **Cortes J y L** entre escenas por defecto (12 y 15 frames); un corte duro es la excepción y se
  declara (`"transicion_salida": "duro"`).
- **Ambiente real:** viento, agua del lago, feria, campanas. Preferir grabaciones propias de Gerson.
  Los ambientes sintetizados son provisionales.
- **Fades siempre** (mínimo 6 frames). Ningún sonido entra ni sale en seco salvo intención.

## 7. Historia y guion

**Cada escena cambia algo (Robert McKee).** Campo obligatorio `"cambio"`: de qué a qué pasa el
espectador. Si no se puede llenar, la escena sobra.

**Preguntas abiertas.** Abre una pregunta en los primeros 15 segundos y respóndela tarde. Abre
preguntas secundarias dentro de cada sección. Respuesta antes de pregunta = información muerta.

**Lo específico vence a lo genérico.** Mal: "Los campesinos sufrían abusos." Bien: "Les obligaban
a comprar mulas que no necesitaban, a precio triple." Si una frase podría aparecer en cualquier
video de historia, reescríbela con un detalle concreto.

**Punto de vista (Bill Nichols).** Expositivo para contexto; participativo (Gerson en el lugar:
Sillustani, Chucuito, Juli, la plaza de Azángaro, grabado con celular), mínimo una aparición o
grabación de campo por video cuando sea posible; performativo (su relación personal con la
historia) cuando sea honesto y sume.

## 8. Enseñar

Exponer es decir algo; enseñar es que el otro lo pueda decir después. Un video que fluye sin parar
se siente bien y no deja nada. Estas reglas vienen de la investigación sobre aprendizaje con
imagen y palabra (Richard Mayer): segmentar, presentar los conceptos antes de usarlos, señalar la
estructura, juntar en el tiempo la imagen y su palabra, y sacar lo que distrae.

**El párrafo audiovisual.** La unidad no es la frase ni la escena: es el párrafo.

1. **Planteo:** una afirmación o una pregunta. Aparece la imagen ancla.
2. **Prueba:** un dato o un ejemplo concreto. La imagen **suma** algo; no se reemplaza.
3. **Sentido:** qué significa. La imagen se queda quieta.
4. **Respiro:** 1,5–3 s sin voz, con la imagen terminada a la vista. La música sostiene.

**Escribir para el oído.**

- Una idea por frase; frases de menos de 20–25 palabras. Nada de frases de inventario (cinco datos
  con comas).
- El término clave se repite igual; no se cambia por sinónimos.
- Los conceptos se presentan antes de usarlos (deuda interna, consolidación, larga duración…).
- Señales de estructura: «primero», «la segunda», «entonces». Cada sección cierra con una frase de
  «entonces» que recapitula.
- Las cifras, de a una, traducidas a algo que se imagina; dos porcentajes de bases distintas nunca
  van juntos sin decir cuál es cuál.

**Imagen para aprender.**

- Cada imagen nueva llega con su palabra (±0,5 s). Antes, el espectador mira algo que no entiende;
  sin imagen, la palabra se pierde.
- Tableros que **acumulan** en vez de cuadros que se reemplazan: al final de un párrafo, la idea
  completa a la vista (el modelo: el tablero de tarjetas de 000·s07).
- Al final de cada sección, una imagen que junta lo dicho.

**Medirlo.** `npm run escaleta -- NNN-slug` escribe `videos/NNN-slug/escaleta.md`: voz, imagen y
sonido segundo a segundo, con un semáforo por escena (`ENSENAR` en `src/direction/ritmo.ts`):

- ningún tramo de voz de más de 25 s sin una pausa de párrafo (≥ 1 s);
- la voz en ≤ 80 % del tiempo de cada escena (meta del episodio: ~70 %);
- frases de ≤ 25 palabras;
- ≤ 6 nombres y cifras nuevos por minuto.

**El tiempo es del contenido, no del calendario.** Si un tema no cabe en un episodio con párrafos y
respiros, se parte en dos o tres. Una serie puede tardar más videos de lo previsto con tal de que
cada uno enseñe.

## 9. Esquema de `escenas.json`

La forma completa está en `src/esquema.ts` (con zod); el Studio y `npm run validar` dicen
exactamente qué campo está mal.

- **Video:** `id` (`NNN-slug`), `titulo`, `formato`, `fps`, `ancho`, `alto`, `paleta`,
  `pregunta_central`, `atmosfera`, `excepciones` (§1.2), `escenas`.
- **Escena:** `id` (`sNN`), `seccion`, `componente` (una escena del catálogo), `duracion_s`
  (narración estimada; si hay voz, manda la voz), `cola_s` (lo que sigue después de la voz),
  `intensidad`, `cambio`, `intencion`, `transicion_salida`, `beats` (segundos de cada momento
  clave), `beats_ajustados`, `props` (los datos que dibuja la escena; los valida su `esquema.ts`),
  `camara` (§4), `audio` (`musica`, `ambientes`, `silencio`, `duck_db`, `duck_ambiente_db`),
  `estado_musica`.

## 10. Subtítulos

- Transcribir la narración real con whisper.cpp (modelo `small` o `medium`), con `glosario.txt`
  como prompt inicial para que reconozca nombres andinos.
- Revisar y corregir siempre a mano antes del render final. Whisper falla con quechua y aimara.
- Nativos en Remotion. En el formato largo, legibles y sin animación palabra por palabra estilo
  TikTok; en shorts sí se permite. (Pendiente: se hacen cuando el guion esté cerrado.)

## 11. Convenciones de código (Remotion)

- TypeScript estricto (`npm run typecheck`).
- Animación solo con `useCurrentFrame()` + `interpolate()` / `spring()` (o `tramo()`, que ya hace
  clamp y usa los pesos). Nada de transiciones CSS ni `setTimeout`.
- `interpolate` siempre con clamp salvo intención explícita.
- Easings desde `direction/easings.ts`; nunca `Easing.bezier` suelto en un componente.
- Assets con `staticFile()` a través de `estilo/recursos.ts` (`compartido()`, `delVideo()`, `sfx()`).
- Los componentes reciben los datos por props desde `escenas.json`; ningún contenido de un video
  escrito en un componente. Una escena nueva: `src/escenas/<Escena>/esquema.ts` (esquema, beats,
  ejemplo) + `Escena.tsx`, registrada en `esquemas.ts` e `index.ts`; aparece sola en el catálogo.
- Aleatorio siempre con semilla (`azar()`): el mismo dibujo en cada render.

## 12. Render

- Desarrollo: `npm run studio`.
- Una escena: `npx remotion render v000-quiroz-s04 out/s04.mp4`.
- Final: `npx remotion render v000-quiroz out/000-quiroz.mp4`.
- Antes de cada render final: `npm run validar -- NNN-slug --final` sin errores.

## 13. Checklist antes de dar un video por terminado

**Historia**

- [ ] La pregunta central se abre en los primeros 15 s.
- [ ] Toda escena tiene `cambio` real.
- [ ] Ningún `[VERIFICAR]` pendiente; `fuentes.md` completo.
- [ ] Al menos un detalle específico memorable por sección.

**Enseñar**

- [ ] La escaleta no tiene escenas en rojo (o la excepción `ensenar` está declarada con motivo).
- [ ] Cada concepto se presenta antes de usarse.
- [ ] Cada sección cierra con un «entonces» y una imagen que junta lo dicho.

**Ritmo e imagen**

- [ ] No hay tres planos seguidos de duración similar.
- [ ] La curva de intensidad sube hacia el clímax.
- [ ] Toda cámara en movimiento tiene `motivo` en `escenas.json`.
- [ ] ≥ 20 % del tiempo con cámara quieta.
- [ ] El texto en pantalla no repite la narración (salvo la palabra clave).
- [ ] Al menos una yuxtaposición deliberada.

**Sonido**

- [ ] Al menos un silencio deliberado.
- [ ] La música cambia de estado al menos tres veces.
- [ ] Transiciones con J/L por defecto.
- [ ] Ningún audio entra o sale en seco sin intención.

**Autenticidad**

- [ ] Narración con la voz de Gerson.
- [ ] Hay una secuencia visual propia de este tema (no solo plantilla).
- [ ] Grabación de campo o aparición de Gerson, si el tema lo permite.

Prueba final: ver el video completo sin mirar la pantalla, solo escuchando. Si el audio solo no
sostiene la atención, el video no está listo. Y otra: al terminar, ¿el espectador podría explicar
con sus palabras la idea central? Si no, el video expuso pero no enseñó.

## 14. Cómo trabajar conmigo (Claude Code)

- Antes de escribir componentes nuevos, revisa si uno existente con otras props resuelve el caso
  (carpeta «catalogo» del Studio).
- Cuando cambie el guion, primero la voz provisional y la escaleta; después las escenas.
- Cuando propongas escenas, explica en una línea la intención de cada decisión de ritmo, cámara y
  sonido. Si no hay intención, no hay decisión.
- Si un pedido produciría un resultado robótico según este archivo (todo animado, música
  constante, planos iguales, voz sin pausas), dilo y propone la alternativa.
- No inventes datos históricos. Si falta un dato, márcalo `[VERIFICAR]` y sigue.
- Lecturas de referencia detrás de estas reglas: Murch (*En el momento del parpadeo*), Block (*The
  Visual Story*), Chion (*La audiovisión*), McKee (*El guion*), Thomas & Johnston (*The Illusion of
  Life*), Williams (*The Animator's Survival Kit*), Nichols (*Introducción al documental*), Mayer
  (*Multimedia Learning*).
