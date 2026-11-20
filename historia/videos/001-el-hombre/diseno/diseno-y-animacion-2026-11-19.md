# Diseño y animación — episodio 001, guion versión 3 (19 de noviembre de 2026)

Pasada del skill **diseño y animación** sobre la relación entre la voz, la imagen y el tiempo del 0·1, hecha junto con la versión 3 del [guion](../guion.md). Su objetivo es uno: que cada cosa que se ve llegue con la palabra que la nombra y dure lo que hace falta para leerla o entenderla.

**De dónde sale.** Gerson recordaba una revisión del 0·1 con este skill. No está escrita en ninguna rama ni en ningún mensaje de commit (búsqueda en todas las ramas remotas el 19/11). Lo más cercano es la [auditoría de dirección visual del 17/11](https://github.com/Eltiokarma/Remotion_HistoriaPer-/blob/video01/luz-lampara-s05/historia/videos/001-el-hombre/diseno/auditoria-direccion-visual-2026-11-17.md) de la rama `video01/luz-lampara-s05`, que usa otro criterio (estructura visual, Block y Shaw) y se hizo sin escuchar la voz. Por eso el skill se reaplicó aquí, encima de esa auditoría y de la escaleta medida del render de 5:39.

**Qué se toma del skill y qué no.** El skill es de interfaces; en el canal mandan `historia/CLAUDE.md` §4 y la tabla de choques de `canal-historia/movimiento.md`. Se toman las ocho leyes (sobre todo «todo declara su oficio», «fidelidad» y «el final se entiende solo»), los seis oficios del movimiento, «anima el cambio que hay que inferir; congela lo que hay que comparar», el movimiento explicativo por pasos con una pausa estable después de cada uno, el presupuesto de sorpresa y la ficha de movimiento. No se toman los tokens en milisegundos ni las curvas `cubic-bezier`: en el canal, la duración la manda la voz y cada movimiento declara uno de los cinco pesos de `src/direction/easings.ts`. Tampoco aplican interrupción, teclado ni movimiento reducido: el espectador no toca el cuadro.

## Ficha de tarea

```
Promesa: el render del 17/11, con la voz nueva y cada beat sobre su palabra.
Persona y condiciones: espectador peruano de YouTube, sin contexto, muchas veces en celular; ve el video una vez.
Resultado observable: al terminar puede decir quién era Quiroz, qué es la larga duración, qué hace una regresión
  y qué encontró en su tesis (la deuda inflada a costa del Estado, no lujos).
Orden de atención: 1.º la cifra del gancho · 2.º el hombre y su muerte · 3.º la pregunta de su generación ·
  4.º las capas de Braudel · 5.º el giro del guano y la pregunta · 6.º el método · 7.º la promesa del próximo.
Estados: cada escena termina con su imagen completa y quieta (el tablero que acumula, CLAUDE.md §8).
Duda que resuelve este trabajo: dónde la imagen se adelanta, se atrasa o se apura respecto de la voz, y cómo
  queda cada beat anclado a una palabra cuando se regenere la narración.
```

## Hallazgos

Un hallazgo por línea: prioridad · qué pasa · ley o regla que incumple · arreglo. Los tiempos son del render del 17/11 (escaleta de la rama `video01/luz-lampara-s05`). Todos los arreglos ya están en la versión 3 del guion, salvo el 10, el 12 y el 13, que esperan la decisión de Gerson o un cambio de lámina.

1. **Alta · s06 (el guano).** La voz va a 3,54 palabras por segundo (170 por minuto), la más rápida del episodio, con 13 cambios de imagen en 34 s: el pico de intensidad llega apurado. Incumple «una sola cosa que mirar» (oficio Atención) y el párrafo audiovisual (§8: planteo, prueba, sentido, respiro). **Arreglo:** el texto pide el ritmo medio del episodio (3,2 palabras/s) y pausas que dejan asentar cada eslabón: 1 s para entrar al grabado, 1,2 s para leer la versión de los lujos y 1,5 s para el sello. La escena pasa de 30 a unos 41 s de voz.
2. **Alta · s06.** «Ahí estaba el guano. Y una deuda… Y encontró…» encadena tres «y»: la imagen arma un mecanismo (barco, Estado, vales), pero la voz no dice contra qué choca el hallazgo, y la pregunta final queda sin peso. Incumple «el final se entiende solo» y «anima el cambio que hay que inferir». **Arreglo:** la voz cuenta la versión de entonces (que **toda** la riqueza se derrochó en lujos) y el «pero» de la fuente; la imagen la muestra como flecha punteada y el corrector tacha solo `TODO` (fichas `lujos` y `tacha`). Quiroz no negó el derroche: negó que lo explicara todo.
3. **Media · s05, la regresión.** «Y dice cuánto pesa» no decía qué pesaba. La auditoría midió la quietud antes y después de la pendiente: 1,01 → 1,06, es decir, el paso no se marca. Incumple la fidelidad («cada cifra dice qué mide»). **Arreglo:** «Cada punto junta dos cifras, y la inclinación de la línea dice cuánto sube una por cada paso que da la otra», con las mismas palabras de los rótulos `un paso` y `cuánto sube`, y una pausa estable de 2 s con la recta terminada.
4. **Media · s05, la lámina de la regresión.** La lámina escribe «Cada punto, una observación.», «Las distancias a la recta son los residuos.», «La recta resume una tendencia.» y «Un ajuste no prueba causalidad.». La voz decía «dato», no nombraba las distancias y hablaba de documentos mientras entraba la causalidad. Son dos vocabularios para una sola cosa, y «Un ajuste no prueba causalidad.» se iba a los 1,6 s, cuando necesita al menos 2,5 s (0,3 s por palabra más 1 s, CLAUDE.md §3). **Arreglo:** la voz presenta «una observación, un dato» y dice «lo más cerca posible de todos»; el beat `causalidad` pasa al inicio de «Aprende a trabajar…» y la pausa siguiente sube a 1 s (unos 4 s de lectura).
5. **Media · s04, la palabra del episodio.** «A esa historia lenta la llamó larga duración» llegaba justo después de la capa del fondo, y unos segundos más tarde se encendía la capa del medio como la de Quiroz: la imagen ataba la palabra solo a la geografía y contradecía el realce. Incumple la fidelidad. **Arreglo:** «A lo que cambia tan despacio que dura siglos lo llamó larga duración», y al volver (`subir`) quedan a la vista las dos capas lentas.
6. **Media · s02.** 76 % de voz y una sola pausa de párrafo; el acercamiento a Lima (2,5 s) se cortaba con la piscina, y la ficha de Cueto se escribía cuando el agua recién llegaba. **Arreglo:** 1 s después de «Lima» y 1,2 s de piscina sin voz antes de Cueto.
7. **Media · s06.** La cámara entraba al grabado 0,8 s después de «siglo diecinueve», cuando la voz ya decía «el guano». **Arreglo:** pausa de 1 s escrita después de «siglo diecinueve»; el zoom ocurre ahí.
8. **Baja · s05.** El título «Pensar el pasado con números, no solo con discursos.» repite palabra por palabra la frase de la voz. Lo pidió Gerson el 19/11 y la guía lo permite como título de sección (§2.4): se mantiene y se declara.
9. **Baja · s00.** La voz decía «Desde 1820… de todo lo que produce» y el contador se detiene en 2000. **Arreglo:** «Durante casi dos siglos… lo que producía»: la voz redondea y la pantalla da los años exactos. La frase de los soles pasa a «Comparado con el gasto del Estado, ese costo equivalía a tres o cuatro de cada diez soles» (acta del Escribano, n.º 1): es una equivalencia, no una parte del presupuesto, como ya decía la nota de pantalla.
10. **Baja · s05, el largo.** Con unos 98 s de voz y 29 cambios de imagen, la escena del viaje es la más larga y la que más ideas junta: viaje, método, oficio, carrera, ideas políticas y cifras. Ya va en tres párrafos con respiros. **Propuesta, `DEFINIR`:** partirla en dos escenas (el viaje y el método; la carrera y las ideas), cada una con su `cambio`. Así la música F tendría un corte natural y el semáforo dejaría de marcar 6,1 datos por minuto.
11. **Baja · s03.** «un pequeño partido trotskista que lo criticaba con dureza»: el «lo» podía leerse como Quiroz. **Arreglo:** «que criticaba con dureza al gobierno militar».
12. **Media · s05, la serie.** Los puntos de la nube didáctica «viajan a su serie real». Por identidad (el mismo objeto en dos estados), la imagen dice que las cifras de la corrupción salieron de una regresión, y en el libro no hay ninguna (`fuentes.md`; acta del Escribano, n.º 10). Incumple la fidelidad. **Propuesta, `DEFINIR`** (la serie fue la opción B del director el 31/10): que la nube se vaya entera y la serie entre aparte, con sus propios puntos, rotulada `LO QUE MIDIÓ DESPUÉS: EL COSTO DE LA CORRUPCIÓN · COSTOS SUMADOS POR DÉCADA`.
13. **Baja · s02 y s05, rótulos de las láminas.** `1970s` y `1990s–2000s` usan el plural inglés, y `1956 — 2013` usa raya para un intervalo (acta, n.º 11 y 21). **Propuesta:** `AÑOS SETENTA`, `AÑOS NOVENTA Y DOS MIL` y `1956–2013`.

Lo que funciona y no se toca (coincide con la auditoría): la muerte (cruz, frase entera, fecha, silencio y recién después la línea), las caídas del gancho, el afiche que cae en s03, la pizarra que acumula en s04 y la lámpara común.

## Presupuesto de tiempo por escena

Estimado con la velocidad real de «Joder Jolines» en cada escena del render del 17/11 (palabras por segundo de habla, medidas en `narracion_tiempos.json`), más las pausas escritas en el guion. Para s06 se pide el ritmo medio del episodio (3,19) en lugar de los 3,54 que tuvo. En s01 la estimación sale corta porque la cruz parte la toma: ahí vale la medida real, porque el texto casi no cambió.

| Orden | Guion | escenas.json | Palabras | Habla (s) | Pausas escritas (s) | Voz estimada (s) | Voz en el render del 17/11 (s) | Voz / escena | Frase más larga |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ESC 0 | s00 | 72 | 26,1 | 6,1 | 32,7 | 31,8 | 77 % | 25 |
| 2 | ESC 1 | s01 | 86 | 25,5 | 12,6 | ≈ 45 (medida) | 45,4 | 53 % | 18 |
| 3 | ESC 2 | s02 | 60 | 19,3 | 5,3 | 25,1 | 24,3 | 74 % | 24 |
| 4 | ESC 3 | s03 | 91 | 29,1 | 6,9 | 36,9 | 37,1 | 74 % | 21 |
| 5 | ESC 4 | s04 | 117 | 35,7 | 12,1 | 49,1 | 51,5 | 71 % | 21 |
| 6 | ESC 5 | s06 | 125 | 39,2 | 6,6 | 46,3 | 30,4 | 79 % | 21 |
| 7 | ESC 6 | s05 | 253 | 78,7 | 18,6 | 98,4 | 89,0 | 79 % | 23 |
| 8 | ESC 7 | s07 | 5 | 2,6 | 2,5 | 5,6 | 5,7 | 16 % | 3 |

Total con las colas actuales: unos **6:03** (el render del 17/11 duraba 5:39). Todas las escenas quedan dentro del semáforo de voz (≤ 80 %) y de frase (≤ 25 palabras); ninguna pasa los 25 s de voz seguida sin una pausa de párrafo. La meta del episodio (~70 % de voz) se cumple en s02, s03 y s04; s00 (el gancho), s06 (el pico) y s05 quedan entre 77 y 79 %. Las correcciones del Escribano (acta en el guion) sumaron unos 10 s, casi todos en s06 y s05.

## Anclas de los beats

Cada beat que cae en una frase nueva o cambiada se ancla a una palabra. Los segundos son estimados desde el comienzo de la escena; después de regenerar la voz, `beats_a_la_voz.py --rehacer` los mueve con su frase y estos números sirven para comprobarlos. En s01 no cambian.

| Escena | Beat → palabra ancla (segundo estimado) |
|---|---|
| s00 | `anio` «Durante» (0,3) · `rojo` «tres y el cuatro» (5,4) · `soles` «gasto del Estado» (12,8) · `caen` «tres o» (14,6) · `cuatro` «o cuatro» (15,0) · `sueltos` «casos sueltos» (20,3) · `sistema` «sistémica» (21,5) · `colonia` «colonia» (23,3) · `calculo` «Todo eso» (25,3) · `libro` «no llegó» (28,8) |
| s02 | `nombre` «Alfonso» (0,9) · `lugar` «Lima» (2,9) · `piscina` «nadador» (6,6) · `ficha` «Marcos» (11,9) · `frenar` «en la piscina» (16,1) · `renglon` «archivos» (19,3) · `palabra` «inagotable» (23,2) |
| s03 | `sello` «Universidad» (3,2) · `primeros` «primeros» (5,1) · `afiches` «El Perú vivía» (7,8) · `afiche1` «Reforma» (10,8) · `afiche2` «Nacionalizaciones» (11,6) · `afiche3` «Un discurso» (12,0) · `volante` «nunca apoyó» (16,0) · `leer` «militó» (17,4) · `vuelve` «Para un estudiante» (23,4) · `acerca` «responder una» (28,8) · `esquina` en la pausa antes de «¿O repetía» (≈ 32,3) · `despegue` «¿O repetía» (33,3) |
| s04 | `clase` «Franklin» (2,7) · `braudel` «Fernand» (5,2) · `capas` «Braudel decía» (7,8) · `capa1` «Arriba» (11,9) · `capa2` «Más abajo» (17,9) · `capa3` «al fondo» (22,2) · `bajar` «Casi no se mueve» (26,0) · `palabra` «larga duración» (32,2) · `subir` «Según Cueto» (34,9) · `realce` «las estructuras» (37,8) · `remate` «Hay cosas» (40,4) |
| s06 | `hoja_entra` «Su primer» (0,3) · `ficha_lugar` «en Lima» (1,9) · `hojea` y `ficha_nombre` «Félix» (4,5) · `hoja_pagina` «siglo diecinueve» (10,1) · `hoja_zoom` en la pausa siguiente · `sacos` «el guano» (12,5) · `zarpa` «vendía a Europa» (16,2) · `lujos` «derrochado en lujos» (22,3) · `flecha` «el Estado decidió» (26,8) · `vales` «una deuda vieja» (29,6) · `consolidacion` en la pausa después de «propio país» (≈ 32) · `tacha` «Pero en su tesis» (33,7) · `hallazgo` «inflaron» (40,0) · `pregunta` «¿Adónde» (45,0) |
| s05 | `paris` «París» (6,5) · `paris_notas` «algunos de los profesores» (9,3) · `duda` en la pausa siguiente · `sale` «se va» (13,1) · `llega` y `abre` en la pausa de 1,8 s · `ficha` «Herbert» (19,1) · `puntos` «historia cuantitativa» (22,4) · `discursos` «discursos» (25,6) · `regresion` «regresión» (28,9) · `caen` «imagina» (29,3) · `observacion` «observación» (31,5) · `recta` «la línea» (36,4) · `residuos` «más cerca» (37,9) · `tendencia` «tendencia» (40,7) · `pendiente` «la inclinación» (44,7) · `causalidad` «Aprende a trabajar» (51,8) · `serie` «Años después» (56,1) · `balanza` «Kenneth» (64,4) · `profundidad` (67,2) · `claridad` (68,1) · `estante` y `temas` «la máxima» (72,5) · `brujula` «Sus ideas» (76,4) · `izquierda` «joven trotskista» (78,4) · `giro` «postura liberal» (80,0) · `tiza` «ni sus propias cifras» (86,4) · `frase` «provisionales» (88,1) |

`VectorCraft.tsx` calcula hoy los beats de la lámina de la regresión a partir de otros (`observacion` = `caen` + 3 s, `residuos` = `recta` + 1,8 s, `tendencia` = `recta` + 5 s, `causalidad` = `pendiente` + 2,4 s) cuando `escenas.json` no los trae. Con la voz nueva conviene escribirlos en `escenas.json`, anclados a las palabras de esta tabla: la lámina dejaría de depender de una suma fija y caería sobre la palabra.

## Fichas de movimiento

Solo las animaciones nuevas o cambiadas. Las que siguen igual que en el render del 17/11 no se repiten.

**`zarpa` — el barco se va (s06)**
```
Oficio: Orientación (de dónde sale la riqueza y hacia dónde va) · Disparador: «vendía a Europa»
Estado inicial → final: barco cargado junto a las islas → barco hacia el borde izquierdo, con su estela · No se pierde: las islas y los sacos, que quedan
Propiedades: traslado del barco, peso `pesado` (un barco cargado arranca despacio), unos 3 s · cámara quieta
Si se quita, se pierde: que el guano se vendía afuera; la plata que después va al Estado no tendría de dónde salir.
```

**`lujos` — la versión de entonces (s06)**
```
Oficio: Explicación (lo que el espectador tiene que comparar con el hallazgo) · Disparador: «derrochado en lujos»
Estado inicial → final: mar vacío → flecha punteada desde el barco hasta un rótulo,
  `LA VERSIÓN DE ENTONCES: TODO SE DERROCHÓ EN LUJOS` (48 caracteres: necesita 2,8 s a 17 c/s; tiene unos 4,5 s antes de la flecha del Estado)
Propiedades: la flecha se dibuja de origen a destino con peso `natural`; el rótulo aparece entero cuando la flecha llega (una sola entrada por contenedor)
Fidelidad: punteada porque es una versión, no un hecho; sin cifras ni figuras de élite inventadas (DIRECCION_DE_VIDEO §2.9 y §3)
Si se quita, se pierde: el contraste que hace del hallazgo un hallazgo, y lo que el corrector tacha.
```

**`tacha` — el corrector tacha la versión (s06)**
```
Oficio: Atención y Explicación · Disparador: «Pero»
Estado inicial → final: rótulo de los lujos → la palabra `TODO` tachada en rojo de corrector; la flecha punteada se apaga y el resto del rótulo queda
Propiedades: un trazo rojo que cruza el rótulo, peso `tenso` (acelera y golpea); un efecto de lápiz, sin música nueva
Qué no se pierde: el rótulo sigue legible debajo del tachón (se corrige, no se borra)
Rojo: es el del corrector, permitido por la gramática de la serie (CLAUDE.md §1.3). El sello 1850 cae antes, con su pausa de 1,5 s, para que los dos rojos no se pisen.
Si se quita, se pierde: el «pero» de la voz no tendría su imagen, y el final no se entendería solo.
```

**Los pasos de la regresión (s05)** — movimiento explicativo, no de interfaz: cada paso deja su rastro y le sigue una pausa con todo quieto.
```
Paso 1 · «imagina» → caen los puntos (peso `ligero`, en cascada de 2 a 6 cuadros) · «observación»: entra la frase · «A simple vista, solo ruido»: nada se mueve 0,8 s
Paso 2 · «la línea» → se traza la recta (`solemne`) · «más cerca»: las distancias se estiran desde cada punto y quedan dibujadas (son el rastro del paso)
Paso 3 · «tendencia» → entra la frase de la tendencia; la recta no se mueve
Paso 4 · «Cada punto junta dos cifras» y «la inclinación» → el escalón de la pendiente con `un paso` y `cuánto sube` (`pesado`), y 2 s de quietud con la imagen terminada
Si se quita la animación, se pierde: el orden en que se arma el método (ruido, recta, distancias, inclinación); la imagen final, sola, sigue diciendo lo que es una regresión (ley 5).
```

**`subir` — volver de la palabra (s04)**
```
Oficio: Orientación · Disparador: «Según Cueto»
Estado final: la cámara encuadra las dos capas lentas (economía y sociedad, la tierra) y no solo el fondo; la capa de arriba queda en el borde, todavía nerviosa
Peso: `pesado` (la cámara sube con masa, como bajó)
Si se quita, se pierde: que «larga duración» nombra lo que dura siglos, y que la capa del medio, la de Quiroz, también es lenta.
```

**Pausas sin voz de s02:** no son movimiento nuevo. Le dan tiempo a lo que ya se movía: el acercamiento a Lima termina (1 s) y la piscina se ve sola (1,2 s) antes de la ficha de Cueto.

**Presupuesto de sorpresa:** un momento memorable por episodio, y ya existe: el monto que se infla bajo la pregunta. El tachón no compite con él porque es gramática de la serie, no un efecto nuevo.

## Verificación

| Punto | Estado |
|---|---|
| Cada animación nueva tiene oficio y su ficha no termina con la última línea vacía | Sí (fichas arriba) |
| Cada imagen nueva llega con su palabra (± 0,5 s) | Sí en el plan: anclas por palabra. Se comprueba con la voz regenerada |
| Ningún rótulo nuevo pasa de 17 caracteres por segundo | Sí: el de los lujos (48 caracteres, necesita 2,8 s) tiene unos 4,5 s antes de la flecha del Estado; la causalidad, unos 4 s para 31 |
| Ningún valor intermedio se presenta como dato | Sí: el monto que se infla sigue rotulado `EJEMPLO ILUSTRATIVO` y la nube de la regresión, «puntos simulados» |
| El rojo solo para la culpa y el corrector | Sí: el tachón es del corrector; la pregunta, de la culpa |
| Una sola cosa nueva a la vez | Sí en el plan: el sello y el tachón quedan a 1,5 s; `regresion` y `caen` comparten frase a propósito (el rótulo y la nube son el mismo objeto) |
| Voz ≤ 80 % por escena, frases ≤ 25 palabras | Sí (tabla de tiempos) |

**No verificado:** la voz regenerada (no se generó: espera el visto bueno del texto); el render; los tiempos reales de los beats; si `MecanismoDeuda` puede dibujar `zarpa`, `lujos` y `tacha` sin una pieza nueva de VectorCraft; la prueba con otra persona.

**Hipótesis y cómo se comprueba:** con el giro de los lujos, quien ve el video por primera vez puede responder «¿de dónde salía la plata y adónde iba?» (la pregunta de la auditoría). Se comprueba mostrando el video a alguien que no lo conozca, sin anticipar ni corregir, antes y después del cambio.

**Conflictos con el canal:** los tokens en milisegundos, las curvas `cubic-bezier` y las reglas de interacción del skill no se aplican (tabla de choques de `canal-historia/movimiento.md`). El skill pide que el texto sea el canal base; en el canal manda la voz y el texto ancla (DIRECCION_DE_VIDEO §2.1). Ninguno de los dos choques cambió una decisión de este documento.

## Actualización: voz versión 5 (19 de noviembre de 2026, más tarde)

Gerson escuchó la voz v4 y pidió: susurros y emociones menos exagerados, que el audio no salte, y oraciones de 10 palabras o más. Lo que cambió para la imagen:

- **Los saltos medidos en la v4** eran de volumen: «Cada año» (susurrado) y «El libro salió en mayo» (en voz baja) quedaban 7 dB por debajo de sus vecinas, y la primera frase de s04, 4 dB más baja por un ajuste a mano de la voz anterior. En la v5, las frases de cada escena quedan a 1,5 dB o menos entre sí (en s02, «inagotable» queda a 3 dB). Las pausas de la voz son casi silencio digital (unos −80 dB); bajo la música y los ambientes del video no se oyen como cortes, pero en la escucha de la voz sola sí: conviene juzgarla con su mezcla.
- **La escena del viaje se partió en dos** (hallazgo 10): `s05`, con el viaje, el método y la balanza (69 s de voz), y `s08`, *Las cuentas abiertas*, con el estante, la brújula y la pizarra (29 s). Las dos usan `AprenderAMedir`; `s08` necesita poder empezar en el estante.
- **Anclas que cambiaron con el texto:** s00, el contador frena antes de «Cada año, en promedio»; s03, los tres afiches caen dentro de una sola oración («con su reforma agraria, sus nacionalizaciones y un discurso…»), `acerca` pasa a «le hacía una pregunta», `esquina` cae en la pausa de la coma y `despegue` en «o repetía»; s06, `pregunta` en «¿Y adónde». Los segundos reales de cada frase están en `narracion_tiempos.json`; la tabla de anclas de arriba sirve para saber en qué palabra cae cada beat, no para sus segundos.

| Orden | Escena | Voz real (s) | Empieza en el episodio (con las colas actuales) |
|---|---|---|---|
| 1 | s00 | 28,1 | 0:00 |
| 2 | s01 | 43,9 | 0:29 |
| 3 | s02 | 25,0 | 1:16 |
| 4 | s03 | 36,0 | 1:42 |
| 5 | s04 | 51,3 | 2:20 |
| 6 | s06 | 44,7 | 3:12 |
| 7 | s05 | 69,2 | 4:01 |
| 8 | s08 (nueva) | 28,6 | 5:11 |
| 9 | s07 | 7,6 | 5:40 |

Total: 5:34 de voz y unos 5:48 con las colas.
