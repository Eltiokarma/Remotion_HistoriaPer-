# VIDEO 0·1 — El hombre que le sacó la cuenta al Perú

**Serie:** Historia de la corrupción en el Perú (basada en Alfonso W. Quiroz, IEP/IDL, 2013) · episodio 1 de 4 del arco de presentación
**Formato:** 100 % Remotion, sin metraje ni fotos · 1920×1080 · 30 fps
**Pregunta central:** ¿Qué encontró, para que valiera la pena? Este episodio responde quién era y cómo aprendió a buscar; lo que encontró llega en 0·2, 0·3 y 0·4.
**Palabra del episodio:** *la larga duración* (en francés, *la longue durée*: Braudel, 1958)
**Duración estimada:** unos 6 min, medida con la velocidad real de la voz «Joder Jolines» en el render del 17/11 (tabla al final de cada escena y en [diseno/diseno-y-animacion-2026-11-19.md](diseno/diseno-y-animacion-2026-11-19.md)). El render de 5:39 tenía el texto anterior.
**Plan de los cuatro episodios:** `videos/000-quiroz/diagnostico.md`, §4

**Versión 3 (19 de noviembre de 2026), propuesta para revisión de Gerson.** Junta tres cosas que estaban separadas:

1. El **orden cronológico** que pidió Gerson el 11/11 (el guano y la tesis de 1980 antes del viaje a Nueva York), escrito en la rama `claude/upbeat-newton-r0iwgt` y nunca fusionado. Gerson lo confirmó para esta versión.
2. La **auditoría de dirección visual** del 17/11 y las notas del render del 19/11 (rama `video01/luz-lampara-s05`): se conservan sus fichas, títulos y repartos de tiempo.
3. Dos pasadas nuevas: el **Escribidor Escribano** sobre la voz (acta al final) y el skill **diseño y animación** sobre la relación entre voz, imagen y tiempo, que no se encontró escrito en ninguna rama y se reaplicó: [diseno/diseno-y-animacion-2026-11-19.md](diseno/diseno-y-animacion-2026-11-19.md).

Las marcas entre corchetes son de dirección: `[PAUSA 1s]` va a la voz; `[PAUSA 2s: …]` dice además qué pasa en la imagen mientras la voz calla. En **Imagen**, cada línea empieza con la palabra de la voz que la dispara (el ancla del beat) y, entre paréntesis, el nombre del beat en `escenas.json`. Las cifras de la voz van en letras, como las lee ElevenLabs; en pantalla, en cifras. Lo que está en pantalla no se lee en voz alta: nombres completos, fechas exactas y cifras exactas van en las fichas.

Encadenamiento (prueba de «pero» y «por eso», `direccion-historia` §2.2):

```
ESC 0  La corrupción le costó al Perú entre el 3 y el 4 % de lo que producía, cada año, y quien lo calculó no vio su libro.
       → ¿PERO quién era?
ESC 1  Un historiador corrige su libro contra el tiempo y muere antes de verlo publicado.
       → POR ESO, ¿quién era ese hombre?
ESC 2  Un nadador inagotable que llevó su disciplina a los archivos.
       → PERO entra a la universidad en un país que promete cambiarlo todo:
ESC 3  ¿El país cambia de verdad o repite lo de siempre?
       → POR ESO busca una manera de mirar que distinga lo que cambia de lo que persiste:
ESC 4  La historia corre a varias velocidades; lo que persiste son las estructuras de la economía.
       → PERO una mirada necesita un caso:
ESC 5  Los libros decían que toda la riqueza del guano se derrochó en lujos; él mostró que además la deuda se infló a costa del Estado.
       → DESPUÉS (orden, no causa: el libro no dice que se fue por el guano; decisión de Gerson, 11/11):
ESC 6  En Nueva York aprende a medir, y cambia de ideas; pero no olvida la tesis.
       → POR ESO, el próximo episodio: La deuda defraudada.
```

El único «después» es una excepción declarada: la fuente respalda el orden, no la causa.

Curva de intensidad: 4 · 3 · 1 · 3 · 3 · **5** · 2 · 1 (el pico en el guano; el respiro en el viaje; el cierre baja).

---

## ESC 0 — El gancho · `s00`

Primero el golpe, después el hombre (DIRECCION_DE_VIDEO §2.5). Solo datos confirmados, con la cautela del autor («en promedio»; «estimados preliminares» en pantalla).

**Cambio:** de no saber nada a cargar una cifra que duele y una pregunta: ¿quién lo calculó?

**VO:**
Durante casi dos siglos, la corrupción le costó al Perú, en promedio, entre el tres y el cuatro por ciento de todo lo que producía. [PAUSA 0,4s] Cada año. [PAUSA 1s]

Comparado con el gasto del Estado, ese costo equivalía a tres o cuatro de cada diez soles. [PAUSA 1,2s]

No era una suma de casos sueltos: era sistémica, y venía desde la colonia. [PAUSA 1,2s]

Todo eso lo calculó un historiador limeño. [PAUSA 0,8s] Y no llegó a ver su libro en español. [PAUSA 1,5s]

**Imagen:**
- «Durante casi dos siglos» (`anio`): el contador de años corre de 1820 a 2000 (la voz redondea; la pantalla da los años exactos); la barra de lo que produce el país, en cien partes. El contador frena en 2000 antes de «Cada año».
- «tres y el cuatro» (`rojo`): la tajada se tiñe (3 % rojo lleno, el cuarto rayado) y desde ahí cae una tajada por año y se apila abajo.
- «gasto del Estado» (`soles`): diez monedas genéricas. «tres» (`caen`): caen tres. «o cuatro» (`cuatro`): la cuarta se inclina y queda a medias, punteada. `30–40 % DEL GASTO` y la nota `COSTO ESTIMADO: LO QUE NO LLEGÓ A SU FIN PÚBLICO (DESVÍOS E INVERSIÓN PERDIDA)`: la voz dice «equivalía» porque es una comparación, no una parte del presupuesto.
- «casos sueltos» (`sueltos`): la regla de 1680 a 2000 con puntos rojos sueltos que parpadean. «sistémica» (`sistema`): se unen en una franja continua y entra su frase textual, «un fenómeno sistémico, no un acontecimiento anecdótico o periódico» (epílogo, p. 531): la voz y la cita dicen la misma palabra. «colonia» (`colonia`): la franja se alarga hacia atrás.
- «Todo eso lo calculó» (`calculo`): la ficha a máquina con las cifras y `ESTIMADOS PRELIMINARES`.
- «su libro» (`libro`): la ficha se va y queda el libro; la luz baja. Corte a las pruebas de imprenta.

**Sonido:** sin cambios (pista A de Suno; un pulso por tajada; acorde que se apaga sobre el libro).

**Fuente:** apéndice, p. 554 y epílogo, p. 532 (entre 3 y 4 % del PBI y entre 30 y 40 % de los gastos del presupuesto, promedio 1820–2000); p. 535 (el costo son «los fondos que no llegaron a su objetivo público o de desarrollo»); «estimados preliminares», p. 57; la cita, epílogo, p. 531; la colonia, cap. 1 y cuadro 1.2; murió el 2 de enero de 2013 y el libro salió en mayo.

---

## ESC 1 — Los días extra · `s01`

**Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo.

**VO:**
Nueva York. [PAUSA 0,6s] Nuestro historiador revisa con minuciosidad las pruebas de imprenta de la traducción al español de su último libro. [PAUSA 1s]

No le queda mucho tiempo, y lo sabe. [PAUSA 1,5s]

En los agradecimientos escribe una línea fácil de pasar por alto: les agradece a sus médicos por alargar estos días para poder completar la tarea. [PAUSA 1s]

Unas líneas más abajo celebra el nacimiento de su hijo. [PAUSA 1,5s]

Murió en enero de dos mil trece. [PAUSA 6s: una cruz sobre negro; la fecha; 2,5 s de silencio; recién después el punto rojo y la cámara recorre los meses] El libro salió en mayo. [PAUSA 1s]

Estos videos tratan de ese hombre y de lo que encontró.

**Imagen:** sin cambios respecto del render del 17/11 (la escena funciona, según la auditoría). Anclas: «Nueva York» (`ficha`, `NUEVA YORK · 2012`); «pruebas de imprenta» (`correcciones`); «agradecimientos» (`cita`); «alargar estos días» (`subrayado`); «Unas líneas más abajo» (`abajo`); «Murió» (`muerte`); `fecha`, `linea` y `recorre` en la pausa de 6 s; «mayo» (`mayo`); `final` en la pausa; «ese hombre» (`hombre`); «lo que encontró» (`encontro`).

**Sonido:** el cello (E2) entra 1 s antes de la imagen y suena bajo las pruebas y la página; silencio desde la muerte hasta `final`, donde entra B (notas del 19/11).

**Fuente:** prólogo, pp. 24–25; agradecimientos, pp. 33–35 (la línea de los médicos, textual en pantalla); *Histórica* XXXVII.1 y *El Comercio*, 2019 (2 de enero de 2013; «su hijo»); créditos (mayo de 2013).

---

## ESC 2 — Inagotable · `s02`

**Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos.

**VO:**
Se llamaba Alfonso Quiroz Norris y nació en Lima, en mil novecientos cincuenta y seis. [PAUSA 1s: el mapa termina de acercarse a Lima]

Fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. [PAUSA 1,2s: la piscina, sin voz]

Marcos Cueto, su amigo desde los quince años, cuenta que Quiroz aprendió disciplina en la piscina y que después la llevó a los archivos. [PAUSA 0,6s] Y lo describe con una sola palabra: [PAUSA 0,5s] inagotable. [PAUSA 2s]

**Imagen:**
- «Alfonso Quiroz Norris» (`nombre`): el nombre, letra por letra, y `1956 — 2013`.
- «Lima» (`lugar`): el país y la cámara que se acerca a la ciudad (2,5 s); ficha `LIMA · 1956` con `≈ 1,4 MILLONES DE HABITANTES (ESTIMADO)`. La pausa de 1 s nueva deja terminar el acercamiento antes de la piscina.
- «nadador» (`piscina`): el agua cubre la página (velocidad 280 px/s y reflejos al 45 %, de la auditoría).
- «Marcos Cueto» (`ficha`): `MARCOS CUETO · PRÓLOGO`. Llega en la voz y no antes: con la pausa de 1,2 s, la piscina tiene su momento solo.
- «los archivos» (`frenar` en «la piscina», `renglon` en «archivos»): los carriles se frenan y se vuelven renglones.
- «inagotable» (`palabra`): la palabra, en cursiva y entre comillas, bajo la ficha de Cueto, como cita suya.

**Fuente:** prólogo, p. 15 (natación, categorías, «encarnó como nadie un adjetivo: inagotable», «amigo desde poco antes que cumpliéramos 16 años»); Contreras, *Economía*, 2013 (Lima, C9); CVR, tomo IV, p. 400 (población).

---

## ESC 3 — La pregunta de una generación · `s03`

**Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación.

**VO:**
En mil novecientos setenta y cuatro entró a la Universidad Católica, en uno de los primeros puestos del examen de admisión. [PAUSA 0,6s]

El Perú vivía el gobierno militar de Velasco. [PAUSA 0,4s] Reforma agraria. Nacionalizaciones. Un discurso que prometía enterrar el pasado oligárquico. [PAUSA 1s]

Quiroz nunca apoyó al régimen: militó un tiempo en un pequeño partido trotskista que criticaba con dureza al gobierno militar. [PAUSA 1s]

Para un estudiante de esa época, estudiar historia era una forma de entender el presente y de responder una pregunta: [PAUSA 0,6s] ¿el país estaba cambiando de verdad? [PAUSA 0,8s] ¿O repetía lo de siempre? [PAUSA 2,5s: la pregunta queda en el aire]

**Imagen:** la del render del 17/11, con los afiches ya calmados (auditoría, hojas 1 y 4).
- «Universidad Católica» (`sello`, `primeros`): `PUCP · 1974` cae sobre la lista y se marcan los primeros puestos.
- «Velasco» (`afiches`): el muro y la ficha `GOBIERNO MILITAR DE VELASCO · 1968–1975`. «Reforma agraria» (`afiche1`), «Nacionalizaciones» (`afiche2`), «Un discurso» (`afiche3`): un afiche por palabra.
- «nunca apoyó» (`volante`); «militó» (`leer`): la cámara se acerca hasta leer el volante con la cita de Cueto.
- «Para un estudiante» (`vuelve`): la cámara vuelve al muro entero. «responder una pregunta» (`acerca`): se arrima al último afiche, `UN PAÍS NUEVO`, y se queda quieta durante «¿el país estaba cambiando de verdad?».
- En la pausa de 0,8 s (`esquina`), la esquina empieza a despegarse. «¿O repetía» (`despegue`): el afiche cae entero y queda el viejo, igual de prometedor, rotulado como ilustración. Quieto en la pausa de 2,5 s.

**Fuente:** prólogo, pp. 15–16 (PUCP 1974, «en uno de los primeros lugares del exigente examen de admisión»; «nunca apoyó al gobierno militar»; el partido trotskista «que criticaba duramente al régimen castrense»; la pregunta: «conocer realmente los elementos de cambio y continuidad en la historia del Perú», para «comprender no solo el pasado sino iluminar el presente»). Velasco, como en `fuentes.md`.

---

## ESC 4 — Larga duración · `s04`

**Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad.

**VO:**
Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. [PAUSA 1s]

Braudel decía que la historia no corre a una sola velocidad. [PAUSA 0,6s]

Arriba están los acontecimientos: los gobiernos, las guerras, las noticias. Cambian rápido, como las olas. [PAUSA 1s]

Más abajo, la economía y la sociedad. Cambian despacio. [PAUSA 1s]

Y al fondo, la relación del hombre con la tierra y el clima. Casi no se mueve. [PAUSA 1,5s: la cámara baja]

A lo que cambia tan despacio que dura siglos lo llamó larga duración. [PAUSA 2s]

Según Cueto, ahí aprendió a apreciar lo que persiste: las estructuras de la economía. [PAUSA 1s] Hay cosas que no cambian aunque cambien los gobiernos. [PAUSA 1,5s] Esa mirada larga es la de esta serie. [PAUSA 2,5s]

**Imagen:** la pizarra del render del 17/11, con los nombres grandes (auditoría, hoja 6).
- «Franklin Pease» (`clase`): `Etnohistoria Andina · F. Pease`, grande al centro. «Fernand Braudel» (`braudel`): su ficha, `F. BRAUDEL · LA LARGA DURACIÓN`. Los dos viajan a su esquina con «Braudel decía» (`capas`).
- «Arriba» (`capa1`), «Más abajo» (`capa2`), «al fondo» (`capa3`): cada capa se dibuja con su frase y brilla solo la que se nombra.
- «Casi no se mueve» (`bajar`): la cámara baja hasta el fondo y se queda.
- «larga duración» (`palabra`): la palabra del episodio a pantalla completa, quieta durante la pausa de 2 s, con «la longue durée» y la referencia de 1958 debajo. Al volver (`subir`), quedan a la vista **las dos capas lentas**: la palabra nombra lo que dura siglos, no solo el fondo.
- «las estructuras de la economía» (`realce`): se enciende la capa del medio y se escribe la nota. «Hay cosas» (`remate`): la frase se escribe con tiza. Pausa final con las tres capas, la de arriba todavía nerviosa.

**Fuente:** prólogo, p. 16 (el curso de Etnohistoria Andina de Pease; «casi con seguridad»; «aprendió a apreciar la persistencia de las estructuras económicas»); Braudel, *El Mediterráneo…*, prefacio (las tres velocidades), y «Histoire et sciences sociales: la longue durée», *Annales*, 1958 (el nombre).

---

## ESC 5 — El primer caso · `s06` en escenas.json

Va antes del viaje (orden cronológico, Gerson, 11/11). El libro respalda el orden (Denegri → tesis de 1980 → beca de Columbia, 1981 → *La deuda defraudada*, 1987), no la causa: nunca se dice que se fue «por» el guano.

**Cambio:** de «toda la riqueza del guano se derrochó en lujos» a «no todo: la deuda se infló a costa del Estado», y una pregunta abierta.

**VO:**
Su primer caso lo encontró en Lima, cuando terminaba la universidad. [PAUSA 0,6s] Félix Denegri Luna tenía una gran biblioteca, y fue él quien le sugirió mirar con más cuidado el siglo diecinueve. [PAUSA 1s: la cámara entra al grabado]

Ahí estaba el guano, el abono que el Perú sacaba de sus islas y vendía a Europa. [PAUSA 0,6s] Cuando Quiroz estudiaba, los libros de historia aseguraban que toda esa riqueza se había derrochado en lujos de las élites. [PAUSA 1,2s: se lee la versión de entonces]

En mil ochocientos cincuenta, el Estado decidió pagar con la plata del guano una deuda vieja con acreedores del propio país. [PAUSA 1,5s: cae el sello y se asienta]

Pero en su tesis de mil novecientos ochenta, Quiroz mostró que no todo se fue en lujos. [PAUSA 0,5s] Algunos inflaron el valor de esa deuda para enriquecerse a costa del Estado. [PAUSA 1,2s: el monto sube, quieto después] ¿Adónde fue a parar esa plata?

**Imagen:** el reparto de la auditoría (hoja 2), con tres eslabones nuevos (`zarpa`, `lujos` y `tacha`) para las frases nuevas.
- «en Lima» (`hoja_entra`, `ficha_lugar`): el libro cerrado y la ficha destacada `LIMA · 1980`.
- «Félix Denegri Luna» (`hojea`, `ficha_nombre`): el libro se abre y se hojea; `FÉLIX DENEGRI LUNA · BIBLIOTECA EN LIMA`.
- «siglo diecinueve» (`hoja_pagina`, `hoja_zoom`): cae la página con el grabado y la cámara entra hasta llenar la pantalla durante la pausa de 1 s.
- «el guano» (`sacos`): los sacos suben al barco. «vendía a Europa» (`zarpa`, nuevo): el barco se aleja hacia el borde izquierdo con su estela.
- «derrochado en lujos» (`lujos`, nuevo): sobre el mar, una flecha punteada hacia un rótulo, `LA VERSIÓN DE ENTONCES: TODO SE DERROCHÓ EN LUJOS`. Punteada porque es una versión, no un hecho.
- «el Estado decidió pagar» (`flecha`): del barco sale la flecha de dinero; la cámara sigue al barco y aparece el edificio del Estado. «una deuda vieja» (`vales`): paneo siguiendo la flecha hasta los vales que se apilan.
- En la pausa de 1,5 s (`consolidacion`): cae el sello rojo `1850` y se asienta antes del «Pero», para que los dos rojos seguidos no se pisen.
- «Pero» (`tacha`, nuevo): el corrector tacha en rojo solo la palabra `TODO`: Quiroz no negó el derroche, negó que explicara todo (C5 del 000). Es el rojo del corrector, y no compite con el de la culpa, que llega después.
- «inflaron» (`hallazgo`): el monto del vale de arriba sube, rotulado `EJEMPLO ILUSTRATIVO`, con su vale ya en la pila.
- «¿Adónde» (`pregunta`): la pregunta escrita fuerte, en rojo; el acorde de G suena solo después.

**Sonido:** G de Suno; el golpe se apaga con «…a costa del Estado» y el acorde final, +8 dB, entra 0,5 s después de la pregunta. Hay que volver a calzarlo con `montar_musica.py` (anclado a `pregunta`).

**Fuente:** prólogo, p. 17 (Denegri, «dueño de una magnífica biblioteca en Lima», «le sugirió ver el siglo XIX con más cuidado»; tesis de bachiller de 1980); pp. 17–18 (el pago de 1850, el guano «utilizado como fertilizante» en Europa, la versión de que la riqueza «había sido derrochada en artículos de lujo por parte de las élites, como la historiografía de entonces aseguraba», y «Sin embargo, encontró que se había exagerado el valor de la deuda con el fin de enriquecerse a costa del Estado»); cap. 2, p. 169 (la consolidación, pagada con el guano); p. 19 (Columbia, 1981).

---

## ESC 6 — Aprender a medir · `s05` en escenas.json

**Cambio:** de un historiador de documentos a uno que mide y que cambia de ideas, sin soltar la tesis.

**VO:**
Poco después toma un camino que pocos peruanos habían tomado. [PAUSA 0,5s] Buena parte de los historiadores peruanos miraba a París, la ciudad de Braudel, donde se habían formado algunos de los profesores de Quiroz. [PAUSA 0,9s] Él, en cambio, se va a Nueva York, a la Universidad de Columbia. [PAUSA 1,8s: el viaje]

Allí, el historiador Herbert Klein le ofrece una beca. [PAUSA 0,4s] Y Quiroz aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. [PAUSA 1s]

Una de sus herramientas se llama regresión: imagina muchos puntos desordenados, cada uno una observación, un dato. [PAUSA 0,4s] A simple vista, solo ruido. [PAUSA 0,8s] La regresión busca la línea que pasa lo más cerca posible de todos, y si hay una tendencia, la deja ver. [PAUSA 0,8s] Cada punto junta dos cifras, y la inclinación de la línea dice cuánto sube una por cada paso que da la otra. [PAUSA 2s: la recta terminada, quieta]

Aprende a trabajar con cifras y a contrastarlas con documentos. [PAUSA 1s: se lee «Un ajuste no prueba causalidad.»] Años después, llevará esa disciplina al estudio de la corrupción en el Perú. [PAUSA 2s]

De otro de sus profesores en Columbia, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. [PAUSA 1,5s]

Con los años, según Cueto, llega a ser la máxima autoridad en la historia financiera del Perú. [PAUSA 1s]

Sus ideas políticas también cambian: del joven trotskista pasa a una postura liberal, que pide igualdad de oportunidades para todos en la economía. [PAUSA 1s] Y no da por cerradas ni sus propias cifras: llama provisionales a sus cálculos. [PAUSA 2s]

Pero no se olvidó de aquella tesis sobre la deuda, que en mil novecientos ochenta y siete se convertiría en un libro. [PAUSA 1,5s]

**Imagen:** la escena del render del 17/11 (`AprenderAMedir`), con tres párrafos separados por respiros: el viaje, el método y la carrera.
- «Poco después» (`mapa`): el mapa con `A COMIENZOS DE LOS OCHENTA` (notas del 19/11). «París» (`paris`): sale la ruta. «algunos de los profesores» (`paris_notas`): `SUS PROFESORES EN LA PUCP` · `HERACLIO BONILLA` · `ALBERTO FLORES GALINDO`. En la pausa de 0,9 s (`duda`): la ruta duda y se borra.
- «se va» (`sale`): la cámara se lanza y sigue la ruta; en la pausa de 1,8 s (`llega`, `abre`): sello, campana y `NUEVA YORK · 1981`; la cámara se abre hasta ver las dos rutas.
- «Herbert Klein» (`ficha`): `COLUMBIA UNIVERSITY · BECA · H. S. KLEIN`.
- «historia cuantitativa» (`puntos`): el papel milimetrado y el título «Pensar el pasado con números, no solo con discursos.» (notas del 19/11). «discursos» (`discursos`): los bloques de discurso se apagan.
- «regresión» (`regresion`): `REGRESIÓN · ESQUEMA DIDÁCTICO`. «imagina» (`caen`): caen los puntos. «observación» (`observacion`): se escribe «Cada punto, una observación.» (la voz presenta la palabra de la lámina junto con la de todos los días).
- «A simple vista, solo ruido»: nada se mueve hasta la recta. Es el estado que hay que ver antes del cambio.
- «la línea» (`recta`): se traza la recta. «lo más cerca posible» (`residuos`): las distancias se estiran desde cada punto hasta la recta y entra «Las distancias a la recta son los residuos.». «tendencia» (`tendencia`): «La recta resume una tendencia.».
- «la inclinación» (`pendiente`): el escalón grande de la pendiente, con `un paso` y `cuánto sube`, las mismas palabras de la voz. Quieto los 2 s de la pausa; el clarinete entra aquí.
- «Aprende a trabajar» (`causalidad`), al empezar la frase para que haya tiempo de leerla: «Un ajuste no prueba causalidad.». La voz y la lámina dicen las dos mitades del mismo método: la cifra sola no basta.
- «Años después» (`serie`): la nube se va y los puntos viajan a su serie real, `LO QUE MIDIÓ: EL COSTO DE LA CORRUPCIÓN`, con `ESTIMADOS PRELIMINARES`.
- «Kenneth Maxwell» (`balanza`), «profundidad» (`profundidad`), «claridad» (`claridad`): la balanza con su título, que se equilibra en la pausa.
- «la máxima autoridad» (`estante`, `temas`): los lomos de sus libros y `BARUCH COLLEGE · CUNY · NUEVA YORK`.
- «Sus ideas políticas» (`brujula`); «joven trotskista» (`izquierda`); «postura liberal» (`giro`): la aguja gira de `1970s` a `1990s–2000s`; las notas de cada polo aparecen con su palabra.
- «ni sus propias cifras» (`tiza`): la brújula pasa a la pizarra. «provisionales» (`frase`): «Sus cálculos: provisionales, abiertos a revisión.» con tiza.
- «aquella tesis»: el tema del canal entra aquí (~6,7 s antes del cierre) y sigue en s07 sin corte.

**Fuente:** prólogo, pp. 18–23 (París, «la meca de los estudios de doctorado»; «uno de los primeros peruanos en abrir una senda de estudios doctorales en historia en Estados Unidos»; la beca de Klein; la historia cuantitativa y las «regresiones múltiples»; «el historiador no repite lo que dicen los discursos»; Maxwell, «combinar la profundidad con la claridad»; «la máxima autoridad en la historia financiera peruana»; las «posturas auténticamente liberales» que pedían «dar mayor autonomía al mercado, asegurar una igualdad de oportunidades a todos los actores económicos»); p. 17 (*La deuda defraudada*, 1987); introducción, p. 57, y apéndice, p. 535 (los cálculos «sujetos a revisión», «provisional»); los profesores formados en París, como en `fuentes.md`.

---

## ESC 7 — Cierre · `s07`

**VO:**
[PAUSA 2,5s] Próximo episodio: *La deuda defraudada*.

**Imagen:** las pruebas de imprenta del comienzo se cierran (sin limpiarse: eso queda para el 0·4); fundido a negro; tarjeta con «La deuda defraudada» grande y «(1850)» chico debajo.

**Sonido:** el tema del canal, que ya venía desde «aquella tesis», sube con el archivador y se queda unos 5 s sobre la tarjeta.

---

## Decisiones de escritura

Lo que cambió respecto de la versión 2 (en `main`) y de la reordenada del 11/11, y por qué. Todo lo que cambia el eje o el orden espera el visto bueno de Gerson (Escribidor §5).

1. **Orden cronológico** (Gerson, 11/11, confirmado el 19/11). El primer caso va antes del viaje. Se conservan las frases que Gerson redactó para ese orden: «En su tesis de 1980 mostró…» y «Pero no se olvidó de aquella tesis…».
2. **El primer caso gira con un «pero» que está en la fuente.** La versión anterior encadenaba «Ahí estaba el guano. Y una deuda… Y encontró…»: tres «y entonces». El prólogo da el giro completo, con su «sin embargo»: él quería comprobar si era verdad que **toda** la riqueza del guano se había derrochado en lujos, como aseguraba la historiografía de entonces, y encontró la deuda inflada. Quiroz no niega el derroche (C5 del 000): por eso la voz dice «toda» y «no todo», y el corrector tacha solo `TODO`. Ese contraste es el que hace que la pregunta final duela, y le da al corrector algo que tachar.
3. **La regla del mínimo de 10 palabras no se aplica a la voz**, como en el 0·2: es texto para el oído y la guía del canal pide alternar largos. Se quedaron solo los remates y los fragmentos con función: «Nueva York.», «Cada año.», «Reforma agraria. Nacionalizaciones.» (un afiche por palabra), los tres pares de las capas de Braudel (la elipsis paralela es la señal de estructura de la clase), «A simple vista, solo ruido.» (el estado que hay que ver antes de la recta), «Casi no se mueve.» (dispara la cámara) e «inagotable». Las demás oraciones cortas se integraron con su enlace: dos puntos en «nunca apoyó al régimen: militó…», en «escribe una línea…: les agradece…» y en «se llama regresión: imagina…».
4. **«Cuánto pesa» pasa a «cuánto sube una por cada paso que da la otra».** «Cuánto pesa» no decía qué pesaba; la nueva frase (que antes dice que cada punto junta dos cifras) dice lo que muestra la pendiente con las mismas palabras de sus rótulos (`un paso`, `cuánto sube`). El beat sigue llamándose `pendiente` y el clarinete sigue entrando ahí.
5. **La voz presenta los términos de la lámina de la regresión.** La lámina dice «observación», «residuos» y «tendencia»; la voz decía «dato» y no nombraba las distancias. Ahora dice «una observación, un dato» y «lo más cerca posible de todos»: cada frase escrita llega con su palabra hablada, sin que la voz lea la lámina.
6. **Cifras en letras en la voz**, como en `narracion.json` y en el 0·2; en pantalla, en cifras.
7. **El texto de la voz para ElevenLabs** está en [narracion_v3_propuesta.json](narracion_v3_propuesta.json), con las etiquetas de emoción de la toma actual donde la frase no cambió. No se generó voz: se hace cuando Gerson apruebe el texto.

## Lo que este guion obliga a cambiar fuera de él

Pendiente de aprobación de Gerson. El detalle, con la ficha de cada movimiento, está en [diseno/diseno-y-animacion-2026-11-19.md](diseno/diseno-y-animacion-2026-11-19.md).

- **escenas.json:** pasar `s06` antes de `s05` (o renumerar), y tres beats nuevos en `MecanismoDeuda`: `zarpa`, `lujos` y `tacha` (con su rótulo). En `s04`, que `subir` deje a la vista las dos capas lentas.
- **Voz:** regenerar con `scripts/narracion.py` las escenas cuyo texto cambió (todas menos s07) y correr `beats_a_la_voz.py --rehacer`. Los beats cuyas frases cambiaron se vuelven a anclar a mano con la tabla de anclas del documento de diseño.
- **Música:** `montar_musica.py` para s00 a s06; el tema del canal pasa a entrar con «aquella tesis», al final de la escena del viaje.
- **fuentes.md:** las filas de las frases nuevas (el abono que se vendía a Europa; «toda» la riqueza derrochada en lujos, pp. 17–18; la deuda «con acreedores del propio país», p. 169; la equivalencia con el gasto, pp. 532, 535 y 554; «cuando terminaba la universidad», como deducción de la tesis de bachiller de 1980).

## Revisión del Escribano (19 de noviembre de 2026)

Otra pasada, hecha por un agente que no escribió el texto, con el orden del Escribidor Escribano (escalas 1 a 5; sin el mínimo de 10 palabras, por ser texto para el oído). Primera acta: **2 altas, 11 medias y 9 bajas; no dio fe.**

- **Altas, corregidas.** (1) «De cada diez soles que gastaba el Estado, entre tres y cuatro no llegaban a donde debían» convertía una equivalencia en una parte del gasto. Quiroz da un costo «equivalente a» entre 30 y 40 % de los gastos, que suma desvíos y costos indirectos y en 1820–1829 llega a 135 % del gasto (cuadro A.4). Ahora: «Comparado con el gasto del Estado, ese costo equivalía a tres o cuatro de cada diez soles.» (2) Sin «toda», el «pero» y el tachón hacían creer que Quiroz refutó el derroche, el error que C5 ya había corregido en el 000. Él quería comprobar si **toda** la riqueza se había derrochado (pp. 17–18). Ahora la voz dice «toda» y «no todo se fue en lujos», y el corrector tacha solo `TODO`.
- **Medias, corregidas.** El antecedente dudoso, en seis lugares: «su época», el sujeto de «mostró» (ahora «Quiroz»), «Buena parte de ellos», «la otra» en la regresión (ahora «Cada punto junta dos cifras…»), «esa disciplina» y «la llevó» en s02. También: «sus propios ciudadanos» (ahora «acreedores del propio país», porque en 1850 muchos títulos ya estaban en manos de especuladores, p. 169); «el abono de las islas que el Perú vendía», que se oía como si vendiera las islas; y los tiempos de s03, que ahora van en pasado.
- **Medias, no aplicadas, en el documento de diseño (hallazgos 12 y 13).** La serie real que sale de los puntos de la regresión (por identidad, dice que las cifras salieron de una regresión) y los rótulos `1970s` → `1990s–2000s`. Son decisiones de lámina y de director.
- **Media, decisión de Gerson.** «Pero no se olvidó de aquella tesis…» llega después de hechos de 1993 y de 2008 y no corrige ninguna expectativa. Propuesta del Escribano: «Y antes de todo eso, en mil novecientos ochenta y siete, aquella tesis sobre la deuda ya se había convertido en un libro.» Se conserva la frase de Gerson hasta que él decida.
- **Bajas.** Corregidas: «Todo eso lo calculó…», «la relación del hombre con la tierra y el clima», «A lo que cambia tan despacio que dura siglos…», «una línea fácil de pasar por alto» (sin la coma que el original no tiene), «Estos videos tratan de ese hombre…» y «Y no da por cerradas ni sus propias cifras». Se conservan: «cuando terminaba la universidad» (es una deducción de la tesis de bachiller de 1980; falta anotarla así en `fuentes.md`) y la cautela de los estimados solo en pantalla (decisión declarada).
- **Vicio que más se repitió:** el antecedente dudoso. En la voz no se puede mirar atrás: se repite el nombre.

**De memoria, por confirmar:** que Braudel (1958) separa la coyuntura de la larga duración; el orden de la línea del hospital y la de su hijo en la p. 35 («Unas líneas más abajo»); y que Cueto ata el hallazgo de la deuda inflada a la tesis de 1980 y no al libro de 1987 (la frase la redactó Gerson el 11/11).

Falta una segunda acta sobre esta versión corregida, el lector en frío y el visto bueno de Gerson.
