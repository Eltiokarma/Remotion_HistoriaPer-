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
| s01 días extra | 0:35 | 52,2 s | ausente → entra al final | Sin música. Silencio deliberado entre `fecha` y `linea` (36,5–39,0 s). El motivo entra solo en `final` (44,5 s) y sigue sin corte en s02 | **B · El hombre** (cruza a s02) |
| s02 inagotable | 1:27 | 33,0 s | presente | El motivo en arpegios que corren (la piscina, 8,6 s); se frena con `frenar` (20,6 s) y queda en renglón | **B · El hombre** (sigue) |
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
Dos variantes por pista.

**Cortadas a la medida de cada escena.** Cada pista dura lo que su escena: el tempo y el número de
compases de cada sección se eligieron para que los cambios caigan en los beats de la voz (±1 s,
con la voz provisional). La tabla de cada pista dice qué pasa en pantalla en cada sección. Suno no
siempre respeta un largo exacto: si alarga, corto en el compás; si cambia un poco el tempo, estiro
unos por ciento sin cambiar el tono. Cuando llegue la voz real, se recalcula y se ajusta igual.

**Hilo armónico del episodio.** Todo gira en torno a **re** (el centro del motivo de Quiroz:
re–fa–mi–la; la tercera menor es el duelo, el paso que cae es el cansancio, la cuarta que sube es la
tarea que sigue). Lo que cambia es el **modo**, y cada modo es una decisión de la escena: frigio
para la culpa (s00, s06), eólico que se vuelve dórico para el duelo que se vuelve decisión (s01–s02,
s05), mixolidio de sol para la promesa (s03). La quena y la pentatónica andina se guardan para el
tema (H).

### A · Tajadas — s00, 35 s (75 BPM, 11 compases de 3,2 s)

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 4 | 0,0 s | la producción pierde su tajada cada año |
| Verse 1 | 3 | 12,8 s | «de cada diez soles»: caen las monedas |
| Chorus | 1 | 22,4 s | «el sistema… desde la colonia» |
| Break | 1 | 25,6 s | «Lo calculó un historiador» |
| Outro | 2 | 28,8 s | el libro solo, la luz baja |

**STYLE**
```
Short dark minimalist documentary cue in D Phrygian, about 35 seconds long, 75 BPM, eleven bars, one pass with no repeats. Cold and investigative. A muted felt piano pulse taps one low note per bar like a year being counted, then sparse felt piano notes fall downward through the Phrygian scale like coins dropping, the flat second adding quiet menace. A deep cello and double bass drone swells for a single bar over a pedal, then everything stops except one lonely piano note. Close, dry mix with a long dark reverb tail and a wide low end, no percussion beyond the piano thud. Emotional arc: restrained, heavier, a sudden bare moment, then one low chord decays into total silence. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no epic trailer drums, no braams, no synth pads, no EDM drops
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 75]
[4 bars]
[Muted felt piano pulse on low D, one hit per bar]
[Dm] [Dm] [Dm] [Dm]
[Verse 1 - Instrumental]
[3 bars]
[Felt piano single notes falling D C Bb A G F Eb D]
[Dmadd9] [Bbmaj7] [A7b9]
[Chorus - Instrumental]
[1 bar]
[Cello and double bass drone enters and swells]
[Ebmaj7#11/D]
[Break - Instrumental]
[1 bar]
[Drone and pulse stop]
[One single high piano note alone]
[Outro - Instrumental]
[2 bars]
[BPM 75 → 66]
[Single low Dmadd9 chord, let ring]
[Decay into silence]
[End]
```

**Teoría.** Frigio por su segunda menor (mi bemol): amenaza fría sin dramatismo. El pulso de un
golpe por compás es un año que pasa; la escala que baja nota a nota son las monedas. `A7b9`, una
dominante alterada, es la duda del rango («tres o cuatro»). `Ebmaj7#11/D` es el acorde napolitano
sobre el pedal de re: entra con «el sistema» y crece sin moverse, como «desde la colonia». La nota
sola es «lo calculó». El final en `Dmadd9`, sin cadencia, deja el libro en silencio (s01 entra sin
música).

### B · El hombre — final de s01 y s02 enteras, 39 s (62 → 80 → 54 BPM, 11 compases)

Una sola pista que cruza el corte de s01 a s02: el motivo nace desnudo sobre «Estos videos son
sobre ese hombre» y se vuelve agua cuando aparece la piscina. Reemplaza las pistas B y C del primer
borrador.

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 2 a 62 BPM | 0,0 s (s01 · `final`) | «Estos videos son sobre ese hombre» |
| Verse 1 | 2 a 62 BPM | 7,7 s (s02 empieza) | el nombre, Lima, 1956 |
| Chorus | 4 a 80 BPM | 15,5 s (s02 · `piscina`) | el agua cubre la página, los carriles avanzan; la ficha de Cueto |
| Break | 1 a 80 BPM | 27,5 s (s02 · `frenar`) | los carriles se frenan |
| Outro | 1 a 60 + 1 a 54 BPM | 30,5 s (s02 · `renglon`) | los renglones; «inagotable» |

**STYLE**
```
Short intimate felt piano cue in D, about 39 seconds long, eleven bars, one pass with no repeats. It begins as a slow tender elegy in D Aeolian at 62 BPM: a simple four-note motif, D F E A, alone with long silences, recorded close with soft pedal noise. Then the same motif starts to move: the tempo lifts to 80 BPM, the mode brightens to D Dorian, and the piano breaks into rolling sixteenth-note arpeggios with soft wooden marimba ripples, steady and tireless like a swimmer's strokes. Then it brakes, the arpeggios slow down and stop, and the motif settles into single plain piano notes, evenly spaced like lines in a ledger, ending on a held chord. Small room reverb, natural dynamics, nothing quantized. Emotional arc: grief, then determination, then stillness. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no synth pads, no string orchestra
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 62]
[2 bars]
[Solo felt piano, motif D F E A, lots of space]
[Dm9] [Bbmaj9]
[Verse 1 - Instrumental]
[2 bars]
[Motif repeats with soft low chords]
[Gm11] [Asus4]
[Chorus - Instrumental]
[BPM 62 → 80]
[4 bars]
[Felt piano sixteenth-note arpeggios, motif inside]
[Marimba ripples enter on bar 2]
[Dm9] [G13] [Fmaj9] [Cadd9/E]
[Break - Instrumental]
[1 bar]
[BPM 80 → 60]
[Arpeggios slow down and stop, marimba drops out]
[Dm9]
[Outro - Instrumental]
[2 bars]
[BPM 60 → 54]
[Single plain piano notes, motif D F E A, evenly spaced]
[Gm11] [Dm9]
[Hold Dm9, let ring]
[End]
```

**Teoría.** Empieza en eólico (menor natural, sin sensible): duelo sin tragedia; `Asus4`, la
dominante sin tercera, queda colgada en el corte entre escenas. Con la piscina pasa a dórico: el
si natural y `G13` (el IV mayor con séptima, el acorde característico del modo) suenan a decisión,
no a alegría. Las semicorcheas son las brazadas; el freno cae con los carriles; las notas sueltas y
parejas son los renglones del libro de contabilidad. Vuelve a `Dm9` en «inagotable»: el mismo
hombre, ahora en los archivos.

### D · Un país nuevo — s03, 47,5 s (101 BPM, 20 compases de 2,4 s)

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 4 | 0,0 s | el sello `PUCP · 1974` (4,3 s) |
| Verse 1 | 5 | 9,5 s | los afiches entran de a uno |
| Verse 2 | 4 | 21,4 s | el volante: «trotskista» |
| Chorus | 5 | 30,9 s | «la historia… era la manera de responder una pregunta» |
| Break | 1 | 42,8 s | el afiche se despega: «¿o repetía lo de siempre?» |
| Outro | 1 | 45,1 s | la pregunta queda en el aire |

**STYLE**
```
Short warm 1970s Latin American folk instrumental cue in G Mixolydian, about 47 seconds long, 101 BPM, twenty bars, one pass with no repeats. Hopeful and communal like a promise of change painted on a city wall. Nylon-string guitar opens alone, bright strummed charango joins, a soft bombo leguero marks the downbeats, and a melodic acoustic guitar line rises with each section. The flat seventh of Mixolydian gives an earthy, open, marching optimism. Slightly hollow underneath: a low bowed bass holds a note that never quite fits, a hint of doubt. Natural, roomy analog mix with a little tape warmth. Emotional arc: builds gently as each voice joins, reaches a full strum, then stops dead on a suspended chord and leaves only a darker borrowed chord on the bass, fading, answering nothing. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no electric guitar, no drum kit, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 101]
[4 bars]
[Nylon guitar alone]
[One soft bombo leguero hit on bar 2]
[G] [F/G] [C/G] [G]
[Verse 1 - Instrumental]
[5 bars]
[Charango strum enters, bombo leguero on the downbeats]
[G] [F] [C] [G] [F]
[Verse 2 - Instrumental]
[4 bars]
[Low bowed bass enters, holding C# under the strum]
[Em7] [Am7] [C] [Dsus4]
[Chorus - Instrumental]
[5 bars]
[Full strum, melodic guitar line rises]
[G] [F] [C] [G] [D7]
[Break - Instrumental]
[1 bar]
[Everything stops abruptly]
[Dsus4 left ringing]
[Outro - Instrumental]
[1 bar]
[BPM 101 → 84]
[Ebmaj7#11, bowed bass alone, fading]
[End]
```

**Teoría.** Mixolidio de sol: mayor con la séptima menor (el `F`, bVII), la armonía de la canción
popular de los setenta: optimismo colectivo, de plaza. El do sostenido del bajo, que entra con el
volante, está a un tritono de sol: la duda que el estudiante ya tiene. El coro termina en `D7`,
que promete resolver; el *break* lo niega con `Dsus4` (la dominante sin tercera) justo en el
despegue del afiche. `Ebmaj7#11`, prestado del menor, es el afiche viejo que asoma debajo.

### E · Tres velocidades — s04, 66 s (67 BPM, 18 compases de 3,6 s) — **bajar los stems**

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 4 | 0,0 s | el aula, Braudel en la pizarra |
| Verse 1 | 3 | 14,3 s | «Arriba están los acontecimientos» (`capa1`) |
| Verse 2 | 2 | 25,1 s | «Más abajo, la economía» (`capa2`) |
| Pre-Chorus | 2 | 32,2 s | «Y al fondo… la tierra» (`capa3`) |
| Break | 2 | 39,4 s | la cámara baja; la palabra: *la larga duración* |
| Chorus | 2 | 46,6 s | «las estructuras de la economía»: se enciende la capa del medio |
| Outro | 3 | 53,7 s | «Hay cosas que no cambian…»; las tres capas, la de arriba nerviosa |

**STYLE**
```
Short layered minimalist chamber cue in D minor, about 66 seconds long, 67 BPM, eighteen bars, one pass with no repeats, built on three simultaneous speeds. It opens almost empty, a single soft sustained violin harmonic, thoughtful classroom calm. Then the layers enter one at a time. Top: fast, nervous pizzicato strings in quartal voicings, restless sixteenth notes that never settle. Middle: a slow solo cello melody in D Dorian that changes chord only every two bars. Bottom: a deep, almost motionless organ and double bass pedal on an open fifth, D and A. Each layer clearly separated: top bright and wide, middle warm and centered, bottom dark and felt more than heard. Then top and middle fall away leaving only the pedal, the cello returns warmer, and finally the nervous top layer comes back over the still ground. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no percussion, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 67]
[4 bars]
[Single soft sustained violin harmonic on A, near silence]
[Verse 1 - Instrumental]
[3 bars]
[Pizzicato strings enter alone, fast sixteenth notes, quartal voicings D G C]
[Verse 2 - Instrumental]
[2 bars]
[Solo cello enters, slow melody under the pizzicato]
[Dm9] [Bbmaj7]
[Pre-Chorus - Instrumental]
[2 bars]
[Organ and double bass pedal enters, open fifth D A]
[Gm11] [Asus4]
[Break - Instrumental]
[2 bars]
[Pizzicato and cello stop]
[Deep pedal D A alone]
[Chorus - Instrumental]
[2 bars]
[Solo cello returns, warmer and brighter, over the pedal]
[Dm9] [G13]
[Outro - Instrumental]
[3 bars]
[Pizzicato returns, nervous, over cello and pedal]
[Dm9] [Bbmaj7] [Dm9]
[Let ring]
[End]
```

**Teoría.** Es la idea de Braudel hecha armonía: tres **ritmos armónicos** distintos sonando a la
vez. Arriba, voicings por cuartas (re–sol–do), sin tercera: no «aterrizan», son los gobiernos que
pasan. Al medio, el cello dórico cambia de acorde cada dos compases: la economía y la sociedad. Al
fondo, una quinta pedal re–la, sin tercera ni modo: la tierra, que casi no se mueve. Las capas
entran en el orden de la escena. En el *break* solo queda el fondo, mientras la palabra está en
pantalla. `G13` en el coro es el brillo de la capa del medio cuando Quiroz la elige.

### E por capas — regeneración (2026-11-10)

La primera E (`V01_mus-F_ver01_1`, rotulada F por error) no trae las tres velocidades: sus stems
dicen que las cuerdas suenan sostenidas de principio a fin (la parte golpeada queda ~20 dB por
debajo: casi no hay pizzicato), y teclado y sintetizador entran juntos en el segundo 28. Para que
la música enseñe la larga duración, se genera **una pista por capa**, cada una sola, y aquí se
montan en sus beats (`capa1` 14,6 s, `capa2` 24,8 s, `capa3` 31,3 s; en la palabra queda solo el
fondo; al final vuelven todas). No chocan: el fondo es una quinta re–la quieta, la de arriba gira
sobre re–sol–do por cuartas y el cello canta en re dórico encima. Cada una: ~66 s, 67 BPM,
18 compases. Si una sale con otro instrumento colado, sus stems lo limpian.

#### E1 · Arriba (los acontecimientos)

**STYLE**
```
Solo pizzicato string ensemble playing a fast, nervous ostinato in D, about 66 seconds long, 67 BPM with restless sixteenth notes, eighteen bars, one pass with no repeats. Quartal voicings on D, G and C, stacked fourths with no third, so the harmony never lands: it flickers like news and governments passing. Bright, close, dry, slightly wide in the stereo field, light and quick, never loud. The figure keeps changing small details but the speed never settles. Only this one layer: plucked strings and nothing else. Emotional arc: constant restless motion from start to end. no vocals, no singing, no humming, no voice, no choir, no autotune, no piano, no cello melody, no organ, no bass, no drums, no percussion, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 67]
[2 bars]
[Pizzicato strings alone, sixteenth notes, quartal D G C]
[Verse 1 - Instrumental]
[8 bars]
[Same restless ostinato, small variations]
[Dsus4] [Csus2] [Dsus4] [Gsus2]
[Verse 2 - Instrumental]
[6 bars]
[Ostinato a little brighter, higher register]
[Dsus4] [Csus2] [Gsus2]
[Outro - Instrumental]
[2 bars]
[Ostinato continues and stops on the last beat]
[End]
```

#### E2 · Al medio (la economía y la sociedad)

**STYLE**
```
Solo cello melody in D Dorian, about 66 seconds long, 67 BPM, eighteen bars, one pass with no repeats. A slow, singing line with long notes, each phrase lasting two bars, the implied harmony changing only every two bars. Warm, centered, close microphone, natural room, expressive but calm, like a thoughtful teacher explaining something that changes slowly. The raised sixth of Dorian gives it a quiet light. Only this one instrument: one cello and nothing else. Emotional arc: patient, steady, a gentle rise in the middle, then settling. no vocals, no singing, no humming, no voice, no choir, no autotune, no piano, no pizzicato, no organ, no drums, no percussion, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 67]
[2 bars]
[Solo cello, long low note on D]
[Verse 1 - Instrumental]
[8 bars]
[Slow singing melody, two bars per phrase]
[Dm9] [Bbmaj7] [Gm11] [Dm9]
[Verse 2 - Instrumental]
[6 bars]
[Melody rises gently, brighter]
[G13] [Fmaj7] [Asus4]
[Outro - Instrumental]
[2 bars]
[Long final note on D, let ring]
[End]
```

#### E3 · Al fondo (la tierra)

**STYLE**
```
Deep, almost motionless drone in D, about 66 seconds long, 67 BPM, eighteen bars, one pass with no repeats. A soft pipe organ and a bowed double bass hold an open fifth, D and A, very low, with only slow swells in volume and no melody at all. Dark, wide and felt more than heard, like the ground and the climate under everything. Only this one layer: low organ and double bass, nothing else. Emotional arc: still from start to end, breathing slowly. no vocals, no singing, no humming, no voice, no choir, no autotune, no piano, no melody, no strings melody, no drums, no percussion, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 67]
[2 bars]
[Low organ and double bass enter softly, open fifth D A]
[Verse 1 - Instrumental]
[8 bars]
[Held drone, slow swell]
[D5]
[Verse 2 - Instrumental]
[6 bars]
[Held drone, slow swell, slightly darker]
[D5]
[Outro - Instrumental]
[2 bars]
[Drone fades slowly]
[End]
```

**Teoría.** Es lo mismo de antes (tres ritmos armónicos a la vez), pero repartido para que cada capa
entre en su frase. Arriba, acordes suspendidos por cuartas, sin tercera: no aterrizan. Al medio, el
cello dórico cambia cada dos compases; su `G13` es la luz de la capa que Quiroz elige
(«las estructuras de la economía»). Al fondo, la quinta re–la, sin tercera ni modo: la tierra.

### F · Aprender a medir — s05, 109 s (73 → 99 → 76 BPM, 41 compases) — **bajar los stems**

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 5 a 73 BPM | 0,0 s | el mapa; París, la ciudad de Braudel, se apaga |
| Verse 1 | 4 a 73 BPM | 16,4 s | el viaje Lima → Nueva York; la ficha de Columbia |
| Verse 2 | 3 a 99 BPM | 29,6 s | «Imagina muchos puntos desordenados» |
| Pre-Chorus | 4 | 36,9 s | «La regresión busca la línea…» |
| Chorus | 4 | 46,6 s | la recta se traza entre los puntos |
| Chorus | 6 | 56,3 s | «Y dice cuánto pesa»: la pendiente |
| Bridge | 7 | 70,8 s | la balanza `PROFUNDIDAD` / `CLARIDAD`; el estante |
| Chorus | 5 | 87,8 s | la brújula gira: cambió de ideas |
| Outro | 3 a 76 BPM | 99,9 s | «Sus cálculos eran provisionales» |

**STYLE**
```
Minimalist process music cue in D Dorian, about 110 seconds long, forty-one bars, one pass with no repeats. It opens at 73 BPM with a quiet felt piano playing the four-note motif D F E A, then lifts onto a Lydian-tinted chord that feels like open air and a journey north. At 99 BPM, pointillistic, random-sounding piano and marimba notes scatter like data with no pattern, then slowly lock into a steady interlocking ostinato, piano and marimba in hocket, as if a line is found through the points. A soft clarinet enters with long tones. A calm, balanced bridge thins the texture, then the harmony lifts a whole step, a quiet change of mind, and the cue slows to 76 BPM and ends on a held chord. Clean, transparent chamber mix, close marimba, warm clarinet, gentle room. Emotional arc: departure, scatter, discovery, balance, change, rest. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no drums, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 73]
[5 bars]
[Felt piano alone, motif D F E A]
[Dm9] [Dm9] [Bbmaj9] [Gm11] [Gm11]
[Verse 1 - Instrumental]
[4 bars]
[Piano opens up, sense of travel]
[Bbmaj7#11] [Bbmaj7#11] [Fmaj7/A] [Dm9]
[Verse 2 - Instrumental]
[BPM 73 → 99]
[3 bars]
[Scattered random piano and marimba notes, no pattern]
[Dmadd9]
[Pre-Chorus - Instrumental]
[4 bars]
[Notes slowly align into a repeating ostinato]
[Dm9] [Fmaj7#11] [Dm9] [Fmaj7#11]
[Chorus - Instrumental]
[4 bars]
[Piano and marimba ostinato in hocket, steady]
[Dm9] [Fmaj7#11] [Cadd9] [Gm11]
[Chorus - Instrumental]
[6 bars]
[Clarinet enters, long tones over the ostinato]
[Dm9] [Fmaj7#11] [Cadd9] [Gm11] [Bbmaj9] [Asus4]
[Bridge - Instrumental]
[7 bars]
[Ostinato thins, clarinet and piano in balance]
[Bbmaj9] [Fmaj7/A] [Gm11] [Dm9] [Bbmaj9] [Gm11] [Asus4]
[Chorus - Instrumental]
[5 bars]
[Key change up a whole step to E Dorian, ostinato returns]
[Em9] [Gmaj7#11] [Dadd9] [Am11] [Em9]
[Outro - Instrumental]
[BPM 99 → 76]
[3 bars]
[Marimba drops out, clarinet holds]
[Em9, let ring]
[End]
```

**Teoría.** `Bbmaj7#11`: la cuarta aumentada del lidio suena a aire y distancia (Lima → Nueva York).
Las notas al azar son los puntos de la regresión («solo ruido»). El hoqueto (piano y marimba que se
completan nota a nota) que se ordena es la recta que encuentra la tendencia; el clarinete, que
entra con la pendiente, es «cuánto pesa». El puente equilibrado es la balanza. La modulación un
tono arriba, a mi dórico, cae con la brújula: mismo modo, otro lugar; cambió de ideas sin dejar de
ser él.

### G · La deuda — s06, 36 s (74 BPM, 11 compases de 3,2 s)

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 5 | 0,0 s | el libro de Denegri se hojea hasta `SIGLO XIX` |
| Verse 1 | 1 | 16,2 s | «Ahí estaba el guano»: los sacos suben al barco |
| Pre-Chorus | 1 | 19,5 s | la flecha de dinero al Estado; los vales |
| Chorus | 3 | 22,7 s | el sello `1850`; «se había inflado el valor de la deuda» |
| Outro | 1 | 32,4 s | «¿Adónde fue a parar esa plata?» |

**STYLE**
```
Short dark, tense documentary cue in D Phrygian, about 36 seconds long, 74 BPM in a rocking 12/8 feel, eleven bars, one pass with no repeats. It opens quiet and low, soft sustained strings like turning old pages. Then a swaying low string ostinato starts like a cargo ship heaving on a cold sea, a heavy muted piano repeats a low D like a weight being dropped, and soft low horns swell beneath. The flat second of Phrygian keeps a constant sense of something wrong. Tension rises fast as the harmony darkens toward an altered dominant. Deep but restrained mix, dark reverb, rumbling low end. Emotional arc: quiet, uneasy, accumulating, then the motion stops dead and leaves a single dissonant minor chord with a major seventh hanging, a question with no answer. no vocals, no singing, no humming, no voice, no choir, no autotune, no quena, no pan flute, no epic trailer drums, no braams, no synth pads
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 74]
[12/8 feel]
[5 bars]
[Soft sustained low strings, very quiet]
[Dm] [Dm] [Eb/D] [Dm] [Eb/D]
[Verse 1 - Instrumental]
[1 bar]
[Swaying low string ostinato starts, muted piano repeating low D]
[Dm]
[Pre-Chorus - Instrumental]
[1 bar]
[Low horns swell]
[Bbmaj7#11]
[Chorus - Instrumental]
[3 bars]
[Heavy low hit on the first beat, all layers, ostinato heavier]
[Eb/D] [Gm9] [A7b9b13]
[Outro - Instrumental]
[1 bar]
[Motion stops]
[Single sustained DmMaj9 chord, unresolved, let ring]
[End]
```

**Teoría.** Frigio otra vez, como en el gancho: la culpa suena igual al principio y al final del
episodio. El mi bemol sobre el pedal de re es la deuda que pesa encima de lo que hay. El 12/8 es el
vaivén del barco con los sacos. El golpe del primer tiempo del coro cae con el sello `1850`.
`A7b9b13`, dominante con dos alteraciones, es la deuda inflada. Termina en `DmMaj9` (menor con
séptima mayor), el acorde del cine negro: la pregunta queda sin respuesta hasta el próximo episodio.

### H · Tema del canal — s07, 18 s (80 BPM, 6 compases de 3 s) — **solo si decides cambiar el tema** (ver §4)

| Sección | Compases | Cae en | En pantalla |
|---|---|---|---|
| Intro | 1 | 0,0 s | las pruebas de imprenta se cierran; negro (2,3 s) |
| Verse 1 | 3 | 3,0 s | la tarjeta `PRÓXIMO · 1850 · LA DEUDA DEFRAUDADA` |
| Outro | 2 | 12,0 s | la tarjeta se queda; la tristeza se asienta |

**STYLE**
```
Short Andean yaravi-inspired instrumental theme in A Aeolian with a minor pentatonic melody, about 18 seconds long, 80 BPM, six bars, one pass with no repeats. Melancholic and dignified, with the thin cold air of the high plateau. One bar of slow bombo leguero and strummed charango, then a solo quena carries a short memorable phrase, with a nylon guitar playing the bass line. The melody leans on the relative major and returns home to minor, as Andean songs do. Wide, open, natural mix with a hint of wind and a long hall reverb on the quena. Emotional arc: a quiet call, the phrase stated once, then a final held chord that rings out. no vocals, no singing, no humming, no voice, no choir, no autotune, no pan flute, no synth, no electric instruments, no drum kit
```

**LYRICS**
```
[Instrumental]
[Intro - Instrumental]
[BPM 80]
[1 bar]
[Bombo leguero and charango strum]
[Am]
[Verse 1 - Instrumental]
[3 bars]
[Solo quena enters, pentatonic phrase, nylon guitar bass line]
[Am] [C] [G]
[Outro - Instrumental]
[2 bars]
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
   `A1-tajadas.wav`, `A2-tajadas.wav`, `B1-el-hombre.wav`…
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

## 6. Estado del montaje (2026-11-10)

| Escena | Pista | Cómo se montó |
|---|---|---|
| s00 | A · `V01_mus01_ver03` | entera; entra fuerte con la tajada (≈6,5 s) y se apaga sobre el libro |
| s01 → s02 | B · `V01_mus02_ver02` | partida en dos archivos; empalme al cuadro en 7,328 s de la pista (simulado: 0 muestras de desfase) |
| s03 | D · `V01_mus03_ver01_5` | entera; se detiene en 42 s, con el despegue del afiche |
| s04 | E1, E2, E3 (una por capa) | arriba entra en `capa1`, al medio en `capa2`, el fondo en `capa3`; en `bajar` quedan solo el fondo hasta `subir` (vuelve el cello) y `remate` (vuelve la de arriba). Los 14 s del aula, sin música |
| s05 | F · `V01_mus-E_ver01_1` (stems) | piano, cuerdas y sintetizador enteros; el clarinete entra en `pendiente` («cuánto pesa») |
| s06 | G · `V01_mus-G_ver01_3` | corrida 2,5 s: el golpe se apaga con «…a costa del Estado» y el acorde final cae en la pregunta |
| s07 | tema sintetizado | sin cambio (H es decisión de la serie) |

Los `nivel` de `escenas.json` igualan la sonoridad efectiva de cada pista a la de la sintetizada
que reemplaza. El montaje de s04 y s06 se rehace con `python scripts/montar_musica.py 001-el-hombre s04`
(y `s06`), que lee `videos/001-el-hombre/montaje_musica/<escena>.json`. Con la voz real se corren
los tiempos de cada capa a los beats nuevos y se vuelve a correr.
