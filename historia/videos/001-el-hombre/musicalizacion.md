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

Escritos con las reglas de Gerson ([`docs/REGLAS_SUNO.md`](../../../docs/REGLAS_SUNO.md)): STYLE en
prosa (≤ 1000 caracteres, negativos al final) y LYRICS con `[Instrumental]`, secciones
`- Instrumental`, acordes, BPM e instrumentos entre corchetes. Modo **Custom**, modelo v5 o v5.5.
Dos variantes por pista. Suno no recibe una duración: si sale corta, *Extend*; si sale larga, la
recorto yo.

**Hilo armónico del episodio.** Todo gira en torno a **re** (el centro del motivo de Quiroz:
re–fa–mi–la; la tercera menor es el duelo, el paso que cae es el cansancio, la cuarta que sube es la
tarea que sigue). Lo que cambia es el **modo**, y cada modo es una decisión de la escena: frigio
para la culpa (s00, s06), eólico para el duelo (s01), dórico para la decisión (s02, s05), mixolidio
de sol para la promesa (s03). La quena y la pentatónica andina se guardan para el tema (H).

### A · Tajadas (s00 · se usan ~35 s)

**STYLE**
```
Dark minimalist documentary underscore in D Phrygian, 70 BPM, cold and investigative. A muted felt piano pulse taps one low note per bar like coins being counted, while sparse felt piano notes fall downward through the Phrygian scale, the flat second adding quiet menace. A deep cello and double bass drone on D and A grows slowly underneath, swelling as the harmony darkens over a pedal. Close, dry mix with a long dark reverb tail and a wide low end, no percussion beyond the piano thud. Emotional arc: restrained, then heavier, then everything drains away and a single low chord decays into total silence. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no epic trailer drums, no braams, no synth pads, no EDM drops
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 70]
[Muted felt piano pulse on low D, one hit per bar]
[Dm]
[Verse 1 - Instrumental]
[Felt piano enters, single notes falling D C Bb A G F Eb D]
[Dmadd9] [Bbmaj7] [Gm9] [A7b9]
[Pre-Chorus - Instrumental]
[Cello and double bass drone enters on D and A]
[Gm9] [A7b9]
[Chorus - Instrumental]
[Drone swells, piano pulse heavier]
[Ebmaj7#11/D] [Bbmaj7] [Gm9] [A7b9]
[Break - Instrumental]
[Piano pulse stops]
[Drone alone]
[Outro - Instrumental]
[BPM 70 → 60]
[Single low Dmadd9 chord, let ring]
[Long decay into silence]
[End]
```

**Teoría.** Frigio por su segunda menor (mi bemol): amenaza fría sin dramatismo. La escala que baja
nota a nota es la tajada que cae cada año. `A7b9` es una dominante alterada: tensión que pide
resolver y no lo hace del todo (los «tres o cuatro» soles). `Ebmaj7#11/D` es el acorde napolitano
sobre el pedal de re: crece sin moverse, como «viene desde la colonia». El final en `Dmadd9`, sin
cadencia, deja el libro en silencio (s01 entra sin música).

### B · Días extra (s01, desde el beat `final` · se usan ~10 s; define el motivo)

**STYLE**
```
Intimate solo felt piano elegy in D Aeolian, 62 BPM, very slow and tender, recorded close with soft pedal noise and the quiet mechanics of the instrument. A simple four-note motif, D F E A, repeats with small variations and long silences between phrases. Warm extended chords with ninths and elevenths, voiced low and open. A solo cello enters in the second half with a long singing line under the piano, and the music briefly lifts into the relative major before returning to minor. Small room reverb, natural dynamics, nothing quantized. Emotional arc: grief without melodrama, someone working late at night knowing time is short, a moment of warmth, then the motif alone again, unresolved. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no synth pads, no string orchestra
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 62]
[Solo felt piano, motif D F E A]
[Dm9]
[Verse 1 - Instrumental]
[Motif repeats, softer, small variation]
[Dm9] [Bbmaj9] [Fmaj7/A] [Gm11]
[Verse 2 - Instrumental]
[Solo cello enters, long low line]
[Dm9] [Bbmaj9] [Gm11] [Asus4]
[Pre-Chorus - Instrumental]
[Gm11] [Asus4] [A7]
[Chorus - Instrumental]
[Lift to the relative major, cello carries the melody, piano answers]
[Fmaj9] [Cadd9/E] [Bbmaj7#11] [Fmaj7/A]
[Break - Instrumental]
[Two bars of near silence, one piano note]
[Outro - Instrumental]
[BPM 62 → 56]
[Cello drops out]
[Solo felt piano, motif D F E A]
[Gm11] [Asus4]
[End on Asus4, unresolved]
[End]
```

**Teoría.** Eólico: el menor natural, sin la sensible, suena a duelo sin tragedia. `Bbmaj9` (VI) da
calidez; `Gm11` (iv) da peso. El puente al relativo mayor (fa) es el hijo que nace unas líneas más
abajo. Termina en `Asus4`, la dominante sin tercera: no resuelve, como el libro que no llegó a ver.

### C · Inagotable (s02 · se usan ~33 s) — hacerla como **Cover** de la B elegida

En Suno: sobre la variante elegida de B → *Cover*, con este STYLE y LYRICS (así el motivo es el mismo).

**STYLE**
```
Flowing arpeggiated felt piano with soft wooden marimba ripples in D Dorian, 84 BPM, steady tireless forward motion like a swimmer's strokes, each bar a breath and a pull. The same four-note motif, D F E A, now moving inside rolling sixteenth-note arpeggios. The raised sixth of Dorian keeps it determined and bright without being happy. Light, airy mix with gentle room reverb and a soft shimmer from the marimba; no drums, the pulse lives in the arpeggio. Emotional arc: the water carries the motif forward and gains momentum, then it brakes, the arpeggios slow down and stop, and the motif settles into single plain piano notes, evenly spaced and orderly like lines in a ledger. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 84]
[Felt piano sixteenth-note arpeggios]
[Dm9] [G13]
[Verse 1 - Instrumental]
[Motif D F E A inside the arpeggios]
[Dm9] [G13] [Fmaj7] [C/E]
[Pre-Chorus - Instrumental]
[Marimba ripples enter]
[Bbmaj7] [C6] [Dm9]
[Chorus - Instrumental]
[Piano and marimba interlock, full forward motion]
[Dm9] [G13] [Fmaj9] [Cadd9/E]
[Break - Instrumental]
[BPM 84 → 72]
[Arpeggios slow down and stop]
[Marimba drops out]
[Outro - Instrumental]
[BPM 72]
[Single plain piano notes, motif D F E A, evenly spaced]
[Dm9]
[End]
```

**Teoría.** Dórico: menor con la sexta mayor (si natural). `G13`, el IV mayor con séptima, es su
acorde característico: decisión, no alegría. Las semicorcheas son las brazadas. El freno
(`BPM 84 → 72`) cae en el beat `frenar` (20,6 s), y las notas sueltas y parejas son los renglones
del libro de contabilidad.

### D · Un país nuevo (s03 · se usan ~48 s)

**STYLE**
```
Warm 1970s Latin American folk instrumental in G Mixolydian, 96 BPM, hopeful and communal like a promise of change painted on a city wall. Strummed nylon-string guitar and bright charango drive the rhythm, a soft bombo leguero marks the downbeats, and a melodic acoustic guitar line rises with each section. The flat seventh of Mixolydian gives an earthy, open, marching optimism. Slightly hollow underneath: a low bowed bass sustains a note that never quite fits, a hint of doubt. Natural, roomy analog mix with a little tape warmth. Emotional arc: builds gently as each new voice joins, reaches a full strum, then stops abruptly and leaves a suspended chord hanging, followed by a darker borrowed chord that answers nothing. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no electric guitar, no drum kit, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 96]
[Nylon guitar alone]
[G] [F/G] [C/G] [G]
[Verse 1 - Instrumental]
[Charango strum enters]
[G] [F] [C] [G]
[Verse 2 - Instrumental]
[Bombo leguero enters on the downbeats]
[G] [F] [Em7] [Dsus4]
[Pre-Chorus - Instrumental]
[Low bowed bass enters, holding C# under the strum]
[Am7] [C] [Dsus4] [D7]
[Chorus - Instrumental]
[Full strum, melodic guitar line rises]
[G] [F] [C] [G] [F] [C] [Dsus4]
[Break - Instrumental]
[Everything stops abruptly]
[Dsus4 left ringing]
[Outro - Instrumental]
[BPM 96 → 80]
[Ebmaj7#11, bowed bass alone, fading]
[End]
```

**Teoría.** Mixolidio de sol: mayor con la séptima menor (el `F`, bVII). Es la armonía de la canción
popular de los setenta: optimismo colectivo, de plaza. El do sostenido del bajo está a un tritono
de sol: la duda que nadie dice. El corte en `Dsus4` (dominante sin tercera) cae en el `despegue`
(42,1 s): «¿o repetía lo de siempre?». `Ebmaj7#11` (bVI prestado del menor) es el afiche viejo
que asoma debajo.

### E · Tres velocidades (s04 · se usan ~67 s) — **bajar los stems**

**STYLE**
```
Layered minimalist chamber piece in D minor built on three simultaneous speeds, 66 BPM, thoughtful classroom calm. Top layer: fast, nervous pizzicato strings and tremolo in quartal voicings, restless sixteenth notes that never settle. Middle layer: a slow solo cello melody in D Dorian that changes chord only every four bars. Bottom layer: a deep, almost motionless organ and double bass pedal on an open fifth, D and A. Each layer is clearly separated in the mix: top bright and wide, middle warm and centered, bottom dark and felt more than heard. Emotional arc: the layers enter one at a time from top to bottom, then the top and middle fall away leaving only the deep pedal, and finally the nervous top layer returns over the still ground. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no percussion, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 66]
[Pizzicato strings alone, fast sixteenth notes, quartal voicings D G C]
[Verse 1 - Instrumental]
[Solo cello enters, slow melody]
[Dm9] [Bbmaj7]
[Verse 2 - Instrumental]
[Organ and double bass pedal enters, open fifth D A]
[Gm11] [Dm9]
[Pre-Chorus - Instrumental]
[All three layers together]
[Dm9] [Bbmaj7] [Gm11] [Asus4]
[Chorus - Instrumental]
[Cello melody at its fullest, pizzicato restless above]
[Dm9] [Bbmaj7] [Gm11] [Dm9]
[Break - Instrumental]
[Pizzicato and cello stop]
[Deep pedal D A alone]
[Outro - Instrumental]
[Pizzicato returns, nervous, over the still pedal]
[Dm9]
[End]
```

**Teoría.** Es la idea de Braudel hecha armonía: tres **ritmos armónicos** distintos sonando a la
vez. Arriba, voicings por cuartas (re–sol–do), sin tercera: no «aterrizan», son los gobiernos que
pasan. Al medio, el cello dórico cambia de acorde cada cuatro compases: la economía y la sociedad.
Al fondo, una quinta pedal re–la, sin tercera ni modo: la tierra, que casi no se mueve. El orden de
entrada es el de la escena (`capa1`, `capa2`, `capa3`); el *break* es la palabra en pantalla. Con
los stems, cada capa entra en su beat exacto.

### F · Aprender a medir (s05 · se usan ~110 s) — **bajar los stems**

**STYLE**
```
Minimalist process music in D Dorian, 92 BPM, calm, curious and precise, with a sense of a journey north. It opens with a quiet felt piano playing the four-note motif D F E A over a Lydian-tinted chord that feels like open air and distance. Then pointillistic, random-sounding piano and marimba notes scatter like data with no pattern. Gradually they lock into a steady interlocking ostinato, piano and marimba in hocket, while a soft clarinet holds long tones above, as if order emerges from noise and a line is found through the points. Later the harmony lifts a whole step, a quiet change of mind. Clean, transparent chamber mix, close marimba, warm clarinet, gentle room. Emotional arc: departure, scatter, discovery of the pattern, balance, a calm modulation, then a soft sustained ending. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 72]
[Felt piano alone, motif D F E A]
[Dm9] [Bbmaj7#11]
[Verse 1 - Instrumental]
[BPM 72 → 92]
[Scattered random piano and marimba notes, no pattern]
[Dmadd9]
[Pre-Chorus - Instrumental]
[Notes slowly align into a repeating ostinato]
[Dm9] [Fmaj7#11]
[Chorus - Instrumental]
[Piano and marimba ostinato in hocket, steady]
[Clarinet enters, long tones]
[Dm9] [Fmaj7#11] [Cadd9] [Gm11]
[Bridge - Instrumental]
[Ostinato thins, clarinet and piano in balance]
[Bbmaj9] [Fmaj7/A] [Gm11] [Asus4]
[Chorus - Instrumental]
[Key change up a whole step to E Dorian]
[Em9] [Gmaj7#11] [Dadd9] [Am11]
[Outro - Instrumental]
[BPM 92 → 84]
[Marimba drops out, clarinet holds]
[Em9, let ring]
[End]
```

**Teoría.** El viaje sobre `Bbmaj7#11`: la cuarta aumentada del lidio suena a aire y distancia
(Lima → Nueva York). Las notas al azar son los puntos de la regresión («solo ruido»). El hoqueto
(piano y marimba completándose nota a nota) que se ordena es la recta que encuentra la tendencia;
el clarinete largo es «cuánto pesa». El puente equilibrado es la balanza profundidad/claridad. La
modulación un tono arriba, a mi dórico, es la brújula: mismo modo, otro lugar; cambió de ideas sin
dejar de ser él.

### G · La deuda (s06 · se usan ~36 s)

**STYLE**
```
Dark, tense documentary underscore in D Phrygian, 76 BPM in a rocking 6/8 feel like a cargo ship heaving on a cold sea. Low strings play a swaying ostinato, a heavy muted piano repeats a low D like a weight being dropped, and soft low horns swell beneath. The flat second of Phrygian keeps a constant sense of something wrong. Tension rises slowly as layers stack and the harmony darkens toward an altered dominant. Deep but restrained mix, dark reverb, rumbling low end. Emotional arc: uneasy, then accumulating, then the motion stops and leaves a single dissonant minor chord with a major seventh hanging, a question with no answer. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no epic trailer drums, no braams, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 76]
[6/8 feel]
[Low strings swaying ostinato]
[Dm] [Eb/D]
[Verse 1 - Instrumental]
[Muted piano repeating low D]
[Dm] [Eb/D] [Dm] [Eb/D]
[Pre-Chorus - Instrumental]
[Low horns swell]
[Bbmaj7#11] [Gm9] [A7b9b13]
[Chorus - Instrumental]
[All layers, ostinato heavier]
[Dm] [Eb/D] [Bbmaj7#11] [A7b9b13]
[Break - Instrumental]
[Motion stops]
[Outro - Instrumental]
[Single sustained DmMaj9 chord, unresolved]
[End]
```

**Teoría.** Frigio otra vez, como en el gancho: la culpa suena igual en los dos extremos del
episodio. El mi bemol sobre el pedal de re es la deuda que pesa encima de lo que hay. El 6/8 es el
vaivén del barco con los sacos. `A7b9b13`, dominante con dos alteraciones, es la deuda inflada.
Termina en `DmMaj9` (menor con séptima mayor), el acorde del cine negro: queda la pregunta
—«¿adónde fue a parar esa plata?»— sin respuesta, hasta el próximo episodio.

### H · Tema del canal (s07) — **solo si decides cambiar el tema** (ver §4)

**STYLE**
```
Andean yaravi-inspired instrumental theme in A Aeolian with a minor pentatonic melody, 80 BPM, melancholic and dignified, with the thin cold air of the high plateau. A solo quena carries a short memorable phrase over a slow bombo leguero and strummed charango, with a nylon guitar playing the bass line. The melody leans on the relative major and returns home to minor, as Andean songs do. Wide, open, natural mix with a hint of wind and a long hall reverb on the quena. Emotional arc: two bars of drum and strum, the quena phrase stated once, repeated with a small ornament, then a final held chord that rings out. no vocals, no singing, no humming, no voice, no choir, no autotune, no pan flute, no synth, no electric instruments, no drum kit
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 80]
[Bombo leguero and charango strum, two bars]
[Am] [Am]
[Verse 1 - Instrumental]
[Solo quena enters, pentatonic phrase]
[Am] [C] [G] [Am]
[Chorus - Instrumental]
[Quena repeats the phrase with an ornament, nylon guitar bass line]
[C] [G] [Am] [Em7] [Am]
[Outro - Instrumental]
[BPM 80 → 72]
[Final Am9 chord held, let ring]
[End]
```

**Teoría.** Pentatónica menor, la base de la melodía andina, con la ida al relativo mayor (do) y la
vuelta a la menor: la cadencia andina más reconocible. El yaraví es el canto lento y triste de los
Andes; se describe, no se cita a nadie. `Am9` al final, abierto, para que la tristeza se asiente
sobre la tarjeta (`DIRECCION_DE_VIDEO.md` §2.15).

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
