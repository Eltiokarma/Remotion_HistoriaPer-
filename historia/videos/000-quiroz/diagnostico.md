# Diagnóstico — 000-quiroz (fase 2)

**Pregunta:** ¿por qué el video fluye pero no se queda? ¿Dónde se separan guion, imagen e
intención, si lo que queremos es **educar** (que el espectador entienda y recuerde) y no solo
exponer y sorprender?

**Cómo se hizo:** con la escaleta (`escaleta.md`, generada con `npm run escaleta -- 000-quiroz`),
que pone lado a lado lo que dice la voz, lo que cambia en pantalla y lo que suena, segundo a
segundo; con mediciones del render (cuánto se mueve la imagen) y de la voz provisional (cuánto
habla, cuánto pausa). Los minutos (`2:57`) son del video completo.

---

## En una frase

El video **no tiene párrafos**. La voz ocupa el 86 % del tiempo y habla de corrido entre 40 y 80
segundos seguidos; las ideas llegan en frases de inventario; las imágenes se reemplazan antes de
que el espectador termine de unir lo que oyó con lo que vio; y en nueve minutos caben cuatro
videos (una biografía, un caso, un método con sus hallazgos y el mapa de una serie). No falta
información: falta estructura y falta tiempo.

---

## 1. Lo que dicen las mediciones

| Escena | Voz (% del tiempo) | Voz seguida máx. | Frase más larga | Pausas de párrafo | Nombres y cifras por minuto | Imagen quieta |
|---|---|---|---|---|---|---|
| s01 Los días extra | 81 % | 30 s | 26 palabras | 2 | 3 | 26 % |
| s02 Inagotable | 79 % | 26 s | 21 | 0 | 11 | 1 % |
| s03 Una generación | 92 % | **56 s** | 31 | **0** | 6 | 53 % |
| s04 La deuda defraudada | 90 % | **65 s** | 30 | **0** | 5 | 23 % |
| s05 Aprender a medir | 91 % | **62 s** | 35 | **0** | **13** | 65 % |
| s06 La pregunta | 88 % | 40 s | 29 | 0 | 9 | 52 % |
| s07 Las objeciones | 88 % | **80 s** | 30 | 1 | 4 | 74 % |
| s08 La cuenta | 88 % | 38 s | 27 | 1 | 9 | 92 % |
| s09 Corrupt Circles | 81 % | 24 s | 17 | 0 | 5 | 85 % |
| s10 Los que denunciaron | 79 % | 27 s | **47** | 1 | **13** | 68 % |
| s11 Cierre | 69 % | 18 s | 24 | 1 | 12 | 89 % |

Cómo leerla:

- **La velocidad no es el problema.** 125–142 palabras por minuto es un ritmo normal de
  narrador. El problema es que esas palabras **no paran**: de s03 a s05 son tres minutos de voz
  y las únicas pausas de más de un segundo son los cambios de escena.
- **La única pausa que funciona demuestra la regla.** «No encontró ninguna de corrupción baja.
  [silencio] Ni una, en casi dos siglos» (s08, 7:05) es el momento mejor construido del video, y es el
  único donde la voz calla, la imagen se queda quieta y la frase siguiente remata.
- **La imagen no se mueve demasiado** (está quieta el 58 % del video). Lo que pasa es que
  **cambia** demasiado: en cinco escenas hay un cambio de imagen cada 4 segundos y casi siempre
  reemplaza al anterior en vez de sumarse.

---

## 2. Las fallas que se repiten

### F1. Sin párrafos

Un párrafo es una idea completa: se plantea, se prueba con algo concreto, se dice qué significa
y **se deja asentar**. En el guion actual las ideas se encadenan sin ese último paso. El
espectador no tiene dónde cerrar una idea antes de que empiece la siguiente: oye «oraciones largas
medio conectadas».

### F2. Frases de inventario

Frases que cargan cuatro a siete datos con comas:

- s10 (8:06): «Empieza con Antonio de Ulloa, un marino y científico español que en 1758 llegó a
  gobernar Huancavelica, a más de tres mil quinientos metros de altura, a cargo de la mina de
  mercurio de la que dependía la plata de todo el virreinato.» — **47 palabras, siete datos, una
  sola respiración**. Y es el gancho del próximo episodio.
- s05 (4:06): de trotskista a liberal + igualdad de oportunidades + el Estado como botín: tres
  ideas políticas en 35 palabras.
- s07 (5:19): «juicios, investigaciones del Congreso, denuncias y, sobre todo, cartas de diplomáticos
  extranjeros…»: cuatro tipos de fuente en una frase, sin ejemplo de ninguna.

### F3. Imágenes que reemplazan en vez de acumular

- **s04, el mecanismo** (2:11–3:17) pasa por siete cuadros distintos: islas, barco→Estado, pila de
  vales, promesa/lujos, un vale, Estado→bolsillos, la frase, el libro. **El mecanismo nunca se ve
  completo.** Justo la escena cuyo mensaje es «era un mecanismo» no muestra la máquina entera.
- **s05** son seis cuadros de ~10 s (mapa, puntos, balanza, repisa, aula, brújula), cada uno
  borra el anterior.
- **s08** muestra tres hallazgos (gasto, producción, niveles) y el fantasma del país, pero nunca
  los tres juntos.
- Contraejemplo que funciona: el **tablero de tarjetas de s07** (las cuatro quedan a la vista, ya
  volteadas, mientras se responde la siguiente). Ese es el modelo.

### F4. Imagen y palabra fuera de tiempo

Lo que se ve tiene que llegar con su palabra (medio segundo antes o después). Si llega mucho
antes, el espectador mira algo que todavía no entiende; si no llega, la palabra se pierde.

| Minuto | Se ve | Se oye | Problema |
|---|---|---|---|
| 0:44–0:51 | la piscina | «Se llamaba Alfonso Quiroz… Nació en Lima…» | la piscina llega 7 s antes de «nadador»: ¿por qué agua? |
| 1:52–1:57 | las tres capas | «En las aulas lo marcan profesores como Franklin Pease…» | el diagrama de Braudel aparece antes de nombrar a Braudel y 10 s antes de su idea |
| 2:11–2:17 | islas guaneras | «Un coleccionista de libros, Félix Denegri Luna…» | la imagen habla de guano; la voz, de un coleccionista |
| 7:45 | la red de nodos girando | «Contra quienes creen que la corrupción es inevitable en los países pobres» | una idea central (la corrupción no es destino) sin imagen propia |
| 0:28 | una marca al margen | «menciona a su hijo, recién llegado al mundo» | el detalle más humano del gancho, sin imagen |
| 1:00 | — | «Marcos Cueto» | no se fija quién es, y el cierre (s11) depende de él |
| 4:33 | estática | «Fujimori y Montesinos» | ni ficha ni fecha: el dato pasa |

### F5. Conceptos que se usan sin presentarlos

Para entender, el espectador necesita saber qué es algo **antes** de que se use (en didáctica se
llama pre-entrenamiento). Hoy se usan de pasada: *deuda interna*, *consolidación*, *vale*,
*historia cuantitativa* y *regresión*, *larga duración* / *estructuras*, *% del gasto del Estado*
frente a *% de lo que produce el país* (dos porcentajes de bases distintas dichos uno tras otro:
30–40 % y 3–4 %; es fácil confundirlos), *el crecimiento que no tuvimos*, *ciclos*, y la idea de
la corrupción como *aceite* de la burocracia.

### F6. Conclusiones que no aterrizan

- «No era derroche. Era un mecanismo.» (3:04) — dos segundos después la voz ya está en la tesis de
  1980 y el libro de 1987. La conclusión más importante del primer caso no tiene tiempo de pesar.
- «Esa idea, que hay cosas que no cambian aunque cambien los gobiernos, va a ser el centro de toda
  su obra.» (2:02) — es **la tesis de toda la serie** y dura 9 segundos; la escena termina ahí.
- «Siete capítulos. Siete ciclos.» (8:37) — *ciclo* es un concepto de Quiroz que no se explica.

### F7. Cuatro videos en uno

| Bloque | Escenas | Qué quiere el espectador saber |
|---|---|---|
| Quién era | s01–s03, s05 | por qué este hombre podía hacer esta pregunta |
| Un caso | s04 | cómo funciona la corrupción, con un ejemplo de verdad |
| Un método y sus hallazgos | s06–s08 | se puede medir; cuánto cuesta; nunca baja |
| La serie | s09–s11 | qué viene, quién lo cuenta |

Cada bloque, hecho con calma, es un video. Metidos en nueve minutos, ninguno tiene espacio para
enseñar.

### F8. Casi no hay señales de estructura

Solo s07 dice cómo está ordenado lo que viene («tres razones, y una excusa… la primera… la
segunda…»), y funciona. Pero incluso ahí se rompe la cuenta: después de las cuatro llega una
quinta idea (la corrupción como *aceite*, 6:13) que no estaba anunciada. No hay ningún «entonces»
que recapitule al final de una sección.

---

## 3. Escena por escena

**s01 Los días extra** — *Debería quedar:* un hombre que corrige su libro contra el tiempo; y una
pregunta: ¿qué encontró? *Hoy:* 30 s de voz seguida con diez datos (traducción, último libro, el
que más le costó, no le queda tiempo, agradecimientos, médicos, alargar los días, la tarea, el
hijo, las fechas). Los cortes secos a ENERO / MAYO funcionan. La pregunta del video («…y sobre lo
que encontró») llega a los 37 s; el CLAUDE.md la pide en los primeros 15. *Haría:* dos párrafos
(el hombre y su libro / las dos fechas) con un silencio entre ellos, y la pregunta dicha antes.

**s02 Inagotable** — *Debería quedar:* la disciplina del nadador es la del archivo. *Hoy:* la
transformación piscina→renglón llega bien con «archivos»; pero la piscina aparece 7 s antes de
«nadador», y Marcos Cueto pasa sin ficha (y el cierre depende de él). *Haría:* nombre y años
sobre papel; la piscina recién con «nadador»; ficha `MARCOS CUETO · PRÓLOGO`.

**s03 Una generación** — *Debería quedar:* la pregunta de una generación (¿el país cambia o
repite?) y la respuesta de Braudel (hay capas que no cambian). **Es la tesis de la serie.** *Hoy:*
56 s sin pausa, frases de 19 palabras en promedio. La pregunta generacional se ilustra con una
esquina de afiche que se despega (sutil). El volante trotskista no dice nada legible. Las capas
aparecen antes de nombrar a Braudel; su idea dura 9 s. *Haría:* partirla en dos: (a) contexto y
pregunta, que termina con la pregunta en el aire; (b) Braudel con calma: una capa por frase, cada
una con su ejemplo, el término «larga duración» repetido igual, y un silencio largo al final.

**s04 La deuda defraudada** — *Debería quedar:* el mecanismo, paso a paso, y que «no era
derroche» es una conclusión probada. *Hoy:* la mejor sincronía del video (el vale se infla con
«inflado», el caudal con «a costa del Estado», las siluetas con «funcionarios»), pero el mecanismo
entero se dice en **una** frase de 12 s y se dibuja en siete cuadros que no se juntan. Además, **el
guion afirma el mecanismo pero no lo explica**: el espectador ve un número que sube, no aprende
cómo se inflaba una deuda (quién tenía los vales, quién los reconocía, cómo crecía su valor). Eso
hay que sacarlo del libro. *Haría:* un tablero que se arma pieza por pieza y al final muestra el
circuito completo; una pausa después de cada paso; la conclusión con silencio; y la tesis y el
libro recién después, como otro párrafo.

**s05 Aprender a medir** — *Debería quedar:* que aprendió a medir (eso legitima las cifras de
s08), que la claridad importa tanto como la profundidad, y que cambió de ideas (no es una fuente
partidaria). *Hoy:* 13 nombres y cifras por minuto: es un currículum leído. Baruch, CUNY, «cientos
de estudiantes», la casa Grace y el crédito colonial son textura que diluye. *Haría:* tres párrafos
(método, claridad, ideas). En el del método, explicar qué muestra una regresión (una tendencia
entre el ruido), porque es la preparación que necesita la escena de las cifras. La carrera puede
ir en una ficha en pantalla, sin narrarla.

**s06 La pregunta** — *Debería quedar:* en el año 2000, la pregunta encuentra sus pruebas. *Hoy:*
la estructura es buena (pregunta → pruebas locales → mundo → «pregunta / pruebas»), pero son 40 s
seguidos y el dato «Fujimori y Montesinos» no tiene ficha. *Haría:* un silencio después del título
tipeado (que la pregunta se lea sola); ficha `2000 · CAE EL RÉGIMEN`; otro silencio después de
«pruebas como nunca antes».

**s07 Las objeciones** — *Debería quedar:* las tres objeciones caen, la excusa no explica, y la
corrupción traba (no aceita). *Hoy:* el mejor tablero del video, pero 80 s de voz seguida, cada
respuesta es una lista, la refutación de la excusa cultural es una frase sin argumento («eso no
explicaba nada») y la teoría del aceite llega sin anunciarse. *Haría:* una pausa de 2 s después de
cada tarjeta volteada (con la respuesta a la vista); un ejemplo concreto por respuesta; la
excusa cultural con el porqué de Quiroz (p. 44); el *aceite* dentro de la cuarta tarjeta, como lo
ordena el libro (§7, punto 4), y el engranaje como remate.

**s08 La cuenta** — *Debería quedar:* tres hallazgos, uno por uno, y que son estimados. *Hoy:*
cinco afirmaciones numéricas en 50 s; las dos cifras de bases distintas, juntas; «el crecimiento
que no tuvimos» sin explicar; el silencio de «Ni una» funciona muy bien. *Haría:* una cifra por
párrafo, traducida a algo que se imagina («de cada cien que gastaba el Estado…»), con su gráfico
quieto durante la pausa; y un tablero final con los tres hallazgos juntos. (Los niveles por época
siguen siendo un marcador: ver `fuentes.md`).

**s09 Corrupt Circles** — *Debería quedar:* la crítica que el libro deja: la corrupción no es
destino de los países pobres; «roba pero hace obra» es una trampa. *Hoy:* «Ganó premios, se
empezó a usar en todo el mundo» es genérico (¿qué premios?); la crítica al fatalismo no tiene
imagen ni desarrollo; la red de nodos es decorativa. El cartel funciona. *Haría:* un párrafo para
el fatalismo (con el argumento del libro) y otro para el cartel.

**s10 Los que denunciaron** — *Debería quedar:* la serie se cuenta desde los que denunciaron; el
primero intentó limpiar y perdió. *Hoy:* la frase de 47 palabras; el mercurio se vuelve plata en
pantalla pero la voz no dice por qué importa el mercurio; cuatro nombres sin contexto (memorizar
sin entender); *ciclos* sin explicar. El corte a negro funciona. *Haría:* Ulloa en tres frases
cortas; una frase que explique el mercurio (para el próximo episodio es clave); los
denunciantes junto al capítulo de su época, en el índice, en vez de una lista suelta.

**s11 Cierre** — funciona: vuelve el objeto del inicio, una confesión, una promesa («vamos a
leerlo»). Es el único lugar donde el silencio y la música trabajan como el CLAUDE.md pide.

---

## 4. Propuesta: el contenido de este video en tres episodios

No se agrega información nueva: se le da a cada idea el tiempo de un párrafo. Duraciones
estimadas a 130 palabras por minuto con la voz en el 70 % del tiempo (hoy, 86 %).

### 0·1 — «El hombre que le sacó la cuenta al Perú» (~8 min)

1. **Gancho** (s01): el hombre que corrige contra el tiempo · las dos fechas · *la pregunta*: ¿qué
   encontró, para que valiera la pena?
2. **El nadador** (s02): la disciplina, Marcos Cueto con ficha, «inagotable».
3. **Una generación** (s03a): Velasco, los afiches, ¿cambia o se repite? (queda en el aire).
4. **Braudel** (s03b): las tres capas, una por una; *larga duración*; «hay cosas que no cambian
   aunque cambien los gobiernos» + silencio. Esto es lo que la serie va a probar.
5. **Aprender a medir** (s05 recortada): método (qué es una regresión), claridad, ideas.
6. **Cierre/puente**: su primer caso estaba en el siglo XIX → próximo: *La deuda defraudada*.

### 0·2 — «La deuda defraudada» (~7–8 min)

1. **El guano** y la plata que entra al Estado.
2. **Qué es una deuda interna** y qué fue la consolidación (presentar los términos).
3. **Dos versiones**: lo que se prometía (empresarios) y lo que se creyó (derroche), las dos a la vista.
4. **El mecanismo**, paso a paso en un solo tablero que se arma: **[DEL LIBRO, cap. 2, pp.
   169–181: cómo se inflaba el valor de los vales, quiénes los tenían, quién los reconocía]**.
5. **«No era solo derroche. Era un mecanismo.»** + silencio (`fuentes.md`, C5).
6. **La tesis y el libro** (1980, 1987) · puente a la pregunta del año 2000.

### 0·3 — «¿Se puede medir la corrupción?» (~10 min)

1. **La pregunta del 2000** (s06) y las pruebas.
2. **Las objeciones** (s07): una tarjeta por párrafo, con ejemplo y pausa; la cuarta, «es
   cultural, es útil», con el argumento de Quiroz (p. 44) y el *aceite* adentro (§7, punto 4).
3. **No es cultura: son reglas** (p. 45) y el engranaje que se traba.
4. **La cuenta** (s08): una cifra por párrafo; tablero final con las tres; «estimados preliminares».
5. **Contra el fatalismo** (s09): no es destino · «roba, pero hace obra».
6. **La serie** (s10–s11): los que denunciaron, en el índice; Ulloa y el mercurio; próximo episodio.

Esto deja la serie con un **arco de presentación** de tres episodios antes del capítulo 1 (1750–1820).
Otra opción es un solo video de ~13 min con los mismos párrafos, cortando la textura biográfica;
la recomiendo menos, porque F7 (cuatro videos en uno) seguiría ahí.

---

## 5. El párrafo audiovisual: cómo reescribir

Cada párrafo, cuatro tiempos:

1. **Planteo**: una afirmación o una pregunta. Aparece la imagen ancla.
2. **Prueba**: un dato o un ejemplo concreto. La imagen **suma** algo, no se reemplaza.
3. **Sentido**: qué significa. La imagen se queda quieta.
4. **Respiro**: 1,5–3 s sin voz, con la imagen terminada a la vista. La música sostiene.

Reglas de escritura para el oído: una idea por frase; frases de menos de 20–25 palabras; el término
clave se repite igual (no sinónimos); señales («primero», «entonces»); al final de cada sección,
una recapitulación de una frase.

**Ejemplo 1 — Braudel (s03).** Mismo contenido del guion, otra forma (las marcas entre corchetes
son de dirección):

> En las aulas lo marcan profesores como Franklin Pease. Y por ellos llega a Fernand Braudel.
> [PAUSA 1]
> Braudel era un historiador francés. Decía que la historia se mueve en capas, a distintas
> velocidades. [IMAGEN: aparece la primera capa]
> Arriba, lo que cambia rápido: los gobiernos. [segunda capa]
> Más abajo, lo que cambia lento: la economía. [tercera capa]
> Y al fondo, lo que casi no se mueve: las estructuras. [PAUSA 2 · la cámara baja]
> Hay cosas que no cambian aunque cambien los gobiernos. [PAUSA 1,5]
> Esa idea va a ser el centro de toda su obra. Y de esta serie. [PAUSA 2]

**Ejemplo 2 — las cifras (s08).** Las cifras son las del guion; «imagina que el Estado gasta cien»
es solo una forma de decirlas:

> Primera cifra. Imagina que el Estado gasta cien. [IMAGEN: las cien unidades]
> Según sus estimados, entre treinta y cuarenta se iban en corrupción. [caen las unidades rojas]
> En promedio, entre 1820 y el año 2000. [PAUSA 2]
> Segunda cifra, y es otra medida: no lo que gasta el Estado, sino todo lo que produce el país.
> Ahí, la corrupción se llevaba entre el tres y el cuatro por ciento. Cada año. [la franja cae, una
> vez por año] [PAUSA 2]

---

## 6. Metas para la próxima versión del guion

Están en `src/direction/ritmo.ts` (`ENSENAR`) y la escaleta las marca con un semáforo:

- ningún tramo de voz de más de **25 s** sin una pausa de párrafo (≥ 1 s; mejor 1,5–3 s);
- la voz en **≤ 80 %** del tiempo de cada escena (meta del episodio: ~70 %);
- frases de **≤ 25 palabras**;
- **≤ 6 nombres y cifras nuevos por minuto**;

y dos que todavía se revisan a mano en la escaleta:

- cada imagen nueva llega a **±0,5 s** de su palabra;
- cada sección termina con una frase de «entonces» y una imagen que junta lo dicho.

Hoy 8 de 11 escenas están en rojo; 3 en amarillo; ninguna en verde.

---

## 7. Lo que respondió el libro (pp. 1–59)

Leídas las primeras 59 páginas (prólogo, prefacio, agradecimientos, introducción). Las citas, con
página, están en `bibliografia/quiroz-2013.md`; los errores del guion, en `fuentes.md` (C1–C26).

### Las preguntas de la primera versión de este diagnóstico

| Pregunta | Respuesta | Pág. |
|---|---|---|
| La frase de los agradecimientos y el hospital | «A mis médicos del hospital Memorial Sloan-Kettering les agradezco inmensamente el alargar estos días para poder completar la tarea.» La cita en pantalla de s01 no es esa (C1). | 35 |
| El argumento contra la explicación cultural | El culturalismo que discute dice que el sur católico es más corrupto que el norte protestante. Responde que el «cambio cultural» es más difícil que las reformas institucionales urgentes y que esa explicación no da cuenta de los intereses y las instituciones (C7). | 44 |
| De dónde viene el *aceite* | De la ciencia política de los años sesenta (Leff, Bayley, Nye) y de la Guerra Fría, que veía la corrupción latinoamericana como «un mal menor». Para Quiroz, esas ideas «han quedado bastante superadas». | 40–41, 44 |
| Qué es un *ciclo* | Ver abajo, punto 5. | 48 |
| Los premios de *Corrupt Circles* | Abraham J. Briloff Prize in Ethics y President's Excellence Award for Scholarship del Baruch College, 2009. | 24–25 |
| A qué capítulo pertenece cada denunciante | No lo dice la introducción: solo da el orden (Ulloa; luego Domingo Elías, Francisco García Calderón Landa, Manuel González Prada, Jorge Basadre, Héctor Vargas Haya, Mario Vargas Llosa). | 55 |
| Cómo se infló la deuda en la consolidación | No está en estas páginas: cap. 2, pp. 169–181, y cuadro A.2 (p. 542). | — |
| Los niveles por época del gráfico de s08 | No están en el A.7 (que da porcentajes) sino en los cuadros 1.2, A.4 y A.6 (pp. 125, 548, 550). | — |

### Lo que el libro agrega para enseñar

Esto no estaba en el guion y le da a cada episodio de la propuesta (§4) lo que le faltaba: un
concepto, un ejemplo o un argumento.

1. **Qué es la corrupción.** El video nunca la define. Quiroz sí (p. 38): «el mal uso del poder
   político-burocrático por parte de camarillas de funcionarios, coludidos con mezquinos intereses
   privados». Y aclara que no es solo «el tosco saqueo de los fondos públicos»: también sobornos,
   mala asignación del gasto, fraude electoral, financiamiento ilegal de partidos. Es el concepto
   que hay que presentar antes de usarlo (F5). Va al comienzo de 0·3.
2. **De dónde salió la pregunta.** El guion salta de la tesis de 1980 al ensayo de 2000. El
   prefacio cuenta el camino (p. 31): después del guano siguió encontrando escándalos y notó que la
   corrupción «no era algo esporádico sino, más bien, un elemento sistémico»; en 1995 leyó a los
   economistas que medían su impacto en el crecimiento y se le ocurrió unir «el desarrollo frustrado
   del pasado y los niveles históricos de corrupción». Es el puente entre 0·1 y 0·3.
3. **Una rima que estructura la serie.** El ensayo de 2000 fue un capítulo del **libro de homenaje
   a Félix Denegri Luna** (p. 23), el mismo que le había dicho que mirara el siglo XIX (p. 17).
   Denegri abre su primer caso y le da lugar a la pregunta veinte años después.
4. **Las objeciones, ordenadas como en el libro.** Son siete (pp. 40–45), y el *aceite* no es una
   quinta idea: pertenece a la familia cultural («los sistemas políticos premodernos realmente
   necesitan la corrupción como un lubricante», p. 43). Si la tarjeta 04 es **«ES CULTURAL, ES
   ÚTIL»**, el aceite entra anunciado y F8 desaparece. Además, cada respuesta trae un ejemplo
   concreto: *pesquisas* y *juicios de residencia* (01), los estimados (02), las tres palabras del
   diccionario con su glosa (03), el sur católico frente al norte protestante (04).
5. **Qué es un ciclo, y cómo encaja con Braudel.** El libro distingue dos ciclos (p. 48): el de la
   **corrupción sistémica**, «más orgánica», ligada a las instituciones, los auges exportadores y
   las redes; y el de la **corrupción percibida**, «más volátil», que sube y baja con los
   escándalos y los medios. Son las capas de s03: los escándalos van arriba, rápidos; la corrupción
   sistémica, abajo, lenta. **El mismo diagrama de las tres capas puede explicar los ciclos** al
   final de la serie de presentación, y «Siete capítulos. Siete ciclos.» deja de ser una palabra
   sin explicar (F6).
6. **No es cultura: son reglas.** La respuesta de fondo (p. 45): la corrupción se vuelve sistémica
   cuando las reglas que protegen la propiedad, abaratan los tratos, frenan el *rent seeking* y
   ponen pesos y contrapesos «son inexistentes, están distorsionadas o se muestran inestables». Y
   es a la vez causa y consecuencia de instituciones débiles (pp. 45–46): un diagrama de dos
   flechas.
7. **El historiador no es juez** (p. 43): «La falta de sentencias condenatorias no implica que no
   haya habido corrupción». La prueba histórica es de probabilidad, no de certeza. Hace falta
   decirlo una vez en la serie: explica por qué se puede hablar de casos sin condena, y protege al
   canal.
8. **El argumento contra «roba, pero hace obra»** (s09 lo pedía): los contratistas que pagan
   sobornos trasladan ese costo «a los costos generales de los proyectos públicos» (p. 47). La obra
   misma sale más cara: **el soborno lo paga la obra**. Es una imagen para el cartel: el precio de
   la obra con el soborno adentro.
9. **Contra el fatalismo, con ejemplos.** Francia vendía los cargos públicos hasta 1789; Inglaterra
   tuvo su «vieja corrupción» y la redujo con reformas entre 1780 y mediados del siglo XIX (pp.
   49–51). Ningún país nace limpio. Y el tono que Quiroz eligió: no «pesimista o acusador», sino
   rastrear las reformas olvidadas para «resaltar la posibilidad y la promesa de una reforma» (p.
   57). Eso es lo que el canal quiere enseñar.
10. **Por qué le importa a quien mira.** Cueto (p. 29): sus estudios ayudan a pensar «por qué
    existe un patrón a mirar el corto plazo y embriagarnos por algunos de los escándalos que
    compiten por nuestra atención en lugar de mirar al desarrollo en el largo plazo». Es la
    corrupción percibida contra la sistémica, dicha para el público.
11. **Las cinco preguntas de Quiroz** (p. 32) pueden ser la promesa de la serie: ¿cómo afectó la
    corrupción al país?, ¿cuánto costó?, ¿frena el desarrollo?, ¿por qué algunos países la
    controlaron y otros no?, ¿por qué no se había estudiado?
12. **El cierre ya está en Cueto.** «Vamos a leerlo» es casi su frase: «Únicamente nos queda leer y
    estudiar sus publicaciones» (p. 29). Y la confesión fue en vida: «tuve el privilegio de
    confesarle que siempre había querido ser como él».

### Cómo cambia la propuesta (§4)

- **0·1** gana la rima de Denegri y el camino de la pregunta (punto 2) como puente final, en vez
  de saltar a 2000.
- **0·2** sigue esperando el cap. 2 (pp. 169–181) para el tablero del mecanismo. Sin eso, el
  episodio afirma pero no enseña.
- **0·3** empieza por la definición (1), ordena las objeciones como el libro (4), cierra el método
  con «no es cultura: son reglas» (6) y «el historiador no es juez» (7), y el bloque de la serie
  explica los ciclos con las capas (5).

### Lo que todavía falta del libro

| Para | Páginas |
|---|---|
| El mecanismo de la consolidación (0·2) | cap. 2, pp. 169–181; cuadro A.2, p. 542 |
| Las cifras y los niveles por época (s08) | Apéndice, pp. 535–554; cuadros 1.2 (p. 125), A.4 (p. 548), A.6 (p. 550), A.7 (p. 551) |
| Cómo terminó Ulloa («Y perdió.») | cap. 1, pp. 59–81 |
| Si «grava en el engranaje» es de Quiroz | Apéndice, pp. 536–537 |
| Si la línea del hospital ya estaba en 2008 | *Corrupt Circles*, *Acknowledgments* |
| Lugar de nacimiento | otra fuente |

---

## 8. Lo que funciona y no hay que perder

- El tablero de tarjetas de s07 (acumula, no reemplaza).
- El silencio de «Ni una, en casi dos siglos» (s08).
- Los cortes secos de s01 (ENERO / MAYO) y el corte a negro de «Y perdió» (s10).
- La sincronía vale / caudal / funcionarios de s04.
- El cartel de s09 y la palabra que queda.
- La vuelta al objeto del inicio y el tema del canal al final (s11).
