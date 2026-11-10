# Musicalización del 0·1 — «El hombre que le sacó la cuenta al Perú»

Borrador del 2026-11-10. Reemplaza la música sintetizada provisional (`scripts/generar_audio.py`)
por música de Suno y los ambientes sintetizados por grabaciones reales de Freesound. Las reglas que
manda: `historia/CLAUDE.md` §6 y `DIRECCION_DE_VIDEO.md` §2.15.

> **Regla que se rompe a propósito (avisar):** el skill de dirección (§5) dice «todo el audio es
> propio». Con Suno deja de serlo. Gerson lo pide; queda como decisión suya y se registra en
> `fuentes.md` con plan, fecha y enlace de cada pista. Dos condiciones para que no suene «a librería»:
> (1) un solo motivo para todo el episodio, no ocho pistas sueltas; (2) cada pista se corta, se funde
> y se cuadra a los beats aquí; Suno da material, la dirección se decide en el montaje.

## 1. Idea musical del episodio

**Un motivo, el de Quiroz.** Cuatro notas en re menor, a piano con fieltro. Aparece desnudo cuando
se habla de su muerte (s01), corre como agua cuando nada (s02), se vuelve método cuando aprende a
medir (s05) y no resuelve en el guano (s06). Si el espectador lo reconoce al final, el episodio se
siente como un retrato y no como una lista de datos.

**La quena se guarda para el tema del canal** (gramática de la serie, §1.3): ninguna pista anterior
la usa, para que el final suene a llegada.

**s04 es la escena donde la música enseña.** La larga duración se *escucha*: tres capas a tres
velocidades (arriba nerviosa, al medio lenta, al fondo casi quieta). Con las pistas separadas
(*stems*) de Suno, cada capa entra con su frase.

## 2. Hoja de pistas (con la voz provisional; se recalcula con la voz real)

| Escena | Inicio | Dura | Estado | Qué hace la música | Pista Suno |
|---|---|---|---|---|---|
| s00 gancho | 0:00 | 34,9 s | presente → se apaga | Pulso frío por cada tajada; notas que bajan con las monedas (12,7 s); acorde grave que crece en «el sistema» (21,7 s); se apaga sobre el libro (29,4 s) hasta el silencio | **A · Tajadas** |
| s01 días extra | 0:35 | 52,2 s | ausente → entra al final | Sin música. Silencio deliberado entre `fecha` y `linea` (36,5–39,0 s). El motivo entra solo en `final` (44,5 s) | **B · Días extra** |
| s02 inagotable | 1:27 | 33,0 s | presente | El motivo en arpegios que corren (la piscina, 8,6 s); se frena con `frenar` (20,6 s) y queda en renglón | **C · Inagotable** (cover de B) |
| s03 su generación | 2:00 | 47,8 s | presente → en suspenso | Promesa de los 70: rasgueo esperanzado que sube con los afiches; en el `despegue` (42,1 s) se corta a un acorde suspendido | **D · Un país nuevo** |
| s04 larga duración | 2:48 | 66,6 s | presente (la música enseña) | Capa rápida con `capa1` (14,6 s), lenta con `capa2` (24,8 s), dron con `capa3` (31,3 s); en la palabra (42,9 s) solo el dron; al final vuelve la de arriba, nerviosa | **E · Tres velocidades** (con *stems*) |
| s05 método | 3:54 | 109,7 s | presente | Viaje (0–21 s): el motivo se va de Lima; regresión: notas al azar (`puntos` 29,2 s) que se ordenan en un ostinato con la `recta` (47,2 s) | **F · Aprender a medir** (con *stems*) |
| s06 el guano | 5:44 | 35,5 s | tensión → suspenso | Mar y sacos; ostinato grave; termina en un acorde que **no resuelve** sobre la `pregunta` (32,1 s) | **G · La deuda** |
| s07 cierre | 6:20 | 17,2 s | protagonista | Tema del canal: entra ~3 s antes del negro y se queda ~5 s sobre la tarjeta | **H · Tema** (opcional, ver §4) |

Se mantienen: el silencio de s01 (único del video, justo después del dato más fuerte), el ducking
de −12 a −16 dB y los niveles actuales. Al importar, cada pista se normaliza a la sonoridad de la
sintetizada que reemplaza (−13,6 a −17,6 LUFS) para que los `nivel` de `escenas.json` sigan valiendo.

## 3. Los prompts para Suno

Cómo generarlos: modo **Custom**, **Instrumental activado**, el estilo en *Style of Music*, lo
prohibido en *Exclude Styles* (si tu versión lo tiene; si no, pégalo al final del estilo como
«no …»). Modelo: el más nuevo de tu plan. **Dos variantes por pista** y me pasas las dos (yo elijo
contra la imagen y te digo cuál y por qué).

**Exclusiones comunes (pegar en todas):**

```
epic, trailer, cinematic drums, braams, choir, vocals, EDM, drop, hybrid percussion, synth pads, quena, pan flute, inspirational corporate
```

### A · Tajadas (s00) — pedir 1:00 a 1:30

```
Dark minimal documentary underscore, D minor, 70 BPM. A low muted piano pulse, one soft thud every bar like coins being counted. Sparse felt piano notes falling downward. A deep cello and double bass drone that slowly grows. Cold, restrained, investigative. No melody climax. Ends on a single low sustained chord that decays into silence.
```

### B · Días extra (s01 final) — pedir 1:30

Esta define **el motivo**. Si una variante tiene una frase de cuatro notas que se recuerda, es esa.

```
Intimate solo felt piano, D minor, 62 BPM, very slow and tender. A simple four-note motif repeated with small variations, lots of space and silence between phrases. A soft solo cello joins in the second half. Grief without melodrama, like someone working late at night knowing time is short. Room reverb, close microphone, soft pedal noise.
```

### C · Inagotable (s02) — **Cover** de la B elegida (para que el motivo sea el mismo)

En Suno: sobre la variante elegida de B → *Create → Cover* (o *Remix → Cover*) con este estilo:

```
Flowing arpeggiated felt piano and soft marimba ripples, D minor turning to F major, 84 BPM. Steady, tireless forward motion like a swimmer's strokes. Light and determined, not happy. Same melody, now moving. Gentle, no drums.
```

### D · Un país nuevo (s03) — pedir 1:00 a 1:30

```
1970s Latin American instrumental, warm strummed nylon guitar and charango, light bombo legüero, hopeful rising chord progression in G major, 96 BPM, like a promise of change on a city wall. Slightly hollow underneath, a hint of doubt. Builds gently, then stops abruptly on an unresolved suspended chord.
```

### E · Tres velocidades (s04) — pedir 1:30 a 2:00 · **bajar los stems**

```
Three simultaneous layers at three different speeds. Top: fast nervous pizzicato strings and tremolo, restless. Middle: a slow cello melody that changes chords only every few bars. Bottom: a deep, almost motionless organ and double bass drone. D minor, 66 BPM. Classroom calm, thoughtful, minimalist, layered, documentary.
```

### F · Aprender a medir (s05) — pedir 2:00 a 2:30 · **bajar los stems**

```
Minimalist process music, D minor, 92 BPM. Begins with scattered, random-sounding felt piano notes, like noise. Gradually the notes lock into a steady repeating ostinato pattern with soft marimba and clarinet, as if order emerges from data. Calm, curious, precise, a sense of a journey north. Gentle pulse, no drums, no big climax.
```

### G · La deuda (s06) — pedir 1:00

```
Dark tense documentary underscore, D minor, 76 BPM. Low string ostinato like a ship's slow rocking on the sea, a heavy muted piano note repeating. Tension rises slowly, something wrong is being uncovered. Ends on an unresolved dissonant chord, no resolution.
```

### H · Tema del canal (s07) — **solo si decides cambiar el tema** (ver §4)

```
Andean instrumental theme, solo quena melody over bombo legüero and strummed charango, A minor, 80 BPM. Melancholic and dignified, high plateau wind, a short memorable phrase. Two bars of drum and strum, the quena phrase, and a final held chord that rings out.
```

## 4. Lo que necesito de vuelta (y decisiones tuyas)

1. **Plan de Suno.** Para un canal monetizado, las pistas tienen que salir de un plan de pago
   (Pro o Premier): lo hecho en el plan gratuito no se puede usar comercialmente, y subir de plan
   después no lo arregla, según los términos de Suno que conozco. Confírmalo en tu cuenta antes de
   generar; lo anoto en `fuentes.md`.
2. **Formato:** WAV si tu plan lo da (si no, MP3). Para E y F, además, los *stems*.
3. **Por cada pista:** el archivo, el enlace de la canción en Suno y la fecha. Nombres:
   `A1-tajadas.wav`, `A2-tajadas.wav`, `B1-dias-extra.wav`…
4. **El tema del canal (H) es de la serie, no del episodio.** Si se cambia, se cambia para los ~200
   videos. Sugiero dejar el sintetizado en el 0·1 y probar H aparte, en `laboratorio/`.

Con eso: corto y fundo cada pista a sus beats, normalizo, actualizo `escenas.json` (`musica`,
`estado_musica`), regenero la escaleta y te paso un audio de prueba del episodio (solo sonido, con la
voz provisional) para la prueba de §13: escucharlo sin mirar.

## 5. Ambientes y efectos reales (Freesound)

El CLAUDE.md (§6) pide ambientes reales; los sintetizados son provisionales. Lo que hay que buscar,
solo con licencia **CC0** o **CC BY** (atribución en `fuentes.md`; nada de *NonCommercial*):

| Uso | Escenas | Búsqueda en Freesound | Reemplaza |
|---|---|---|---|
| Cuarto de noche, Nueva York | s01, s02, s04, s06, s07 | `room tone night apartment radiator` | `ambiente/cuarto` |
| Ciudad a lo lejos | s03, s05 | `distant city traffic ambience` | `ambiente/ciudad` |
| Piscina techada | s02 | `indoor swimming pool ambience` | `ambiente/agua` |
| Mar con aves (islas) | s06 | `sea waves rocks seabirds colony` | `ambiente/mar` |
| Máquina de escribir | s00, s02, s05 | `typewriter typing` · `typewriter carriage return bell` | `sfx/tecla-*` |
| Sello de goma | s03, s06 | `rubber stamp` | `sfx/sello` |
| Tiza en pizarra | s04, s05 | `chalk writing blackboard` | `sfx/lapiz` (en el aula) |
| Afiche que se despega | s03 | `paper poster peel tear` | `sfx/afiche` |
| Hojas, pruebas de imprenta | s01, s06, s07 | `paper page turn` · `book close` | `sfx/hoja` |
| Monedas sobre la mesa | s00 | `coins drop table` | `sfx/monedas` |
| Sacos que caen | s06 | `sack drop` | `sfx/saco` |

**Estado de la conexión:** la clave `FREESOUND_API_KEY` está en el entorno de la nube, pero
Freesound responde **403** a todas las peticiones desde el contenedor (también a su portada): bloquea
esas IP, no es la clave. `scripts/freesound.py` hace la búsqueda con el filtro de licencias y deja
los créditos listos para `fuentes.md`; córrelo en tu laptop (ver el encabezado del script).
