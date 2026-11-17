# Auditoría de dirección visual — episodio 001 (17 de noviembre de 2026)

Hecha con el criterio de estructura visual (Block, *The Visual Story*; Shaw, *Design for Motion*) sobre
cuadros de todo el episodio (6 por segundo, a 480 × 270), después del afinado de las láminas (inventario,
sección H). No se renderizó video ni se escuchó el audio: la relación con la voz sale de la escaleta.

## Veredicto

- **¿Se entiende? A medias.** El arco se sigue, pero los dos goznes del episodio llegaban chicos y apurados:
  la pregunta de la serie en s03 («¿o repetía lo de siempre?») y el mecanismo del guano en s06. Y en s06 se
  decían «Lima, 1980» y «Félix Denegri Luna» sin escribirlos (§2.1).
- **¿Se siente? A medias.** La muerte funciona; el pico se debilita porque las escenas de respiro (s02, s03)
  gastan antes saturación, rojo y actividad.

**En una frase:** la intensidad visual está repartida al revés en los goznes (capa de secuencia y jerarquía,
no de acabado).

## Mediciones

| Escena | Intensidad declarada | Actividad (mediana) | Píxeles muy saturados | Rojo saturado (media) |
|---|---|---|---|---|
| s00 | 4 | 0,69 | 2,1 % | 0,49 % |
| s01 | 3 | 1,21 | 0,4 % | 0,07 % |
| s02 | 1 | **4,32** | **20,3 %** | 0,01 % |
| s03 | 3 | 1,59 | 11,6 % | **7,11 %** |
| s04 | 3 | 1,60 | 9,3 % | 0 % |
| s05 | 2 | 1,22 | 3,8 % | 0,12 % |
| s06 | 5 | 2,65 | 6,1 % | 2,92 % |
| s07 | 1 | 0,40 | 1,8 % | 0 % |

Quietud antes del golpe (actividad media 1,5 s antes → 1,5 s después): fecha de la muerte 0,03 → 0,19 (la
pausa funciona); caída de monedas 0,62 → 1,60 (funciona); despegue de s03 1,55 → 1,67 (la revelación no se
marca); «cuánto pesa» en s05 1,01 → 1,06 (tampoco).

## Hojas de revisión

| # | Momento | Observación | Cambio propuesto | Estado |
|---|---|---|---|---|
| 1 | s03, 2:22 | La pregunta de la serie es una esquina que se despega, ~2,5 s antes del corte | Despegar el afiche entero, que asome uno viejo igual de prometedor (ilustrativo), quietud ~2 s antes del corte | **Hecho** |
| 2 | s06, 4:47–5:15 | El grabado del guano quedaba 0,74 s a pantalla completa; 7 s de libro cerrado sin texto; el monto se inflaba antes de que llegara su vale | Reparto nuevo de los beats y fichas del libro (abajo) | **Hecho** |
| 3 | s02 | La escena de intensidad 1 es la más activa y saturada del video | Calmar el agua (amplitud de reflejos y cáusticas), una sola variable | **Hecho** (B: velocidad; C: reflejos) |
| 4 | s03 | El rojo se gasta en el muro (7,1 % durante 30 s) antes del rojo de la culpa en s06 (2,9 %) | Apagar primero los recortes rojos del fondo del muro; el afiche aprobado lo decide Gerson | **Hecho** |
| 5 | s01, 1:07–1:20 | La línea de tiempo no se lee en miniatura (luminancia 25 contra fondo 25) | Escalar la línea y sus rótulos, aclararla | **Hecho** (escala 1,3) |
| 6 | s04, s05, s06 | Pizarra casi vacía ~10 s con «Pease» y «Braudel» diminutos; «cuánto pesa» sin cambio visible; libro abierto con renglones ilegibles (§2.9) | Fichas grandes de los nombres; escalón de la pendiente más grande; texto legible en el libro | Pendiente |

Lo que funciona y no hay que romper: la muerte (quietud real y 4,8 s de negro con la flor), las caídas del
gancho, la pregunta final (se lee en color, grises y miniatura), la pizarra que acumula en s04, la línea
horizontal como tiempo en todo el video y la lámpara común.

## Hoja 2 aplicada: el mecanismo del guano (s06)

Sin tocar la voz ni la música (anclada a `pregunta`, que no cambia). Tiempos locales de la escena:

| Eslabón | Antes | Después |
|---|---|---|
| Libro cerrado | 0,3–7,2, sin texto | 0,3–6,4, con «LIMA · 1980» (ficha destacada, como «Nueva York · 2012» en s01) |
| Libro abierto, se hojea | 7,2–13,6 | 6,4–10,8, con «FÉLIX DENEGRI LUNA · BIBLIOTECA EN LIMA» |
| Grabado de las islas a pantalla completa | 16,1–16,9 (**0,74 s**) | 13,8–17,6 (**3,8 s**); los sacos suben desde 14,4 y «Ahí estaba el guano» (16,0) cae con la carga a la vista |
| Barco → Estado | 16,9–19,5 | 17,6–20,5 (la cámara sale cuando termina «el guano»; el Estado se dibuja con «el Estado») |
| Pila de vales | 20,2–24,7, paso 0,75 s | 21,2–24,5, paso 0,55 s |
| Sello 1850 | 21,8 | 22,5, en la pausa después de «… en mil ochocientos cincuenta» |
| El monto se infla | 23,7 (antes de que llegara su vale, a 24,7) | 24,6, con su vale ya en la pila y sobre «se había inflado» |
| Pregunta | 28,6 | 28,6 |

Cambios de código: `fichas_libro` (con `destacada`) y `pila_paso` en el esquema de `MecanismoDeuda`, con
valores por defecto que dejan igual al 000. Fuentes de las fichas: `fuentes.md`, filas de s06 (prólogo,
pp. 17 y 19).

**Por comprobar:** verlo a velocidad real con la voz, y la prueba con otra persona: «¿de dónde salía la
plata y adónde iba?».

## Hoja 1 aplicada: la pregunta de la serie (s03)

**Afirmación:** lo nuevo tapa algo viejo que prometía lo mismo. Sin tocar la voz; la música de s03 se
detiene en `despegue` (así estaba anclada), que ahora es el instante en que el afiche cae: el golpe llega
con el corte de la música y lo que revela queda en silencio.

| Tramo (tiempos de la escena) | Antes | Después | Actividad |
|---|---|---|---|
| «Era la manera de responder una pregunta» (29,8) | muro entero | la cámara se arrima al último afiche, ×1,3 (beat `acerca`, 29,9–32,5) | 12,1 |
| «¿El país estaba cambiando de verdad?» (31,7–34,4) | muro quieto | quieta sobre «UN PAÍS NUEVO» | 1,8 |
| Pausa (34,6) | — | la esquina empieza a despegarse (beat `esquina`) | 1,9 |
| «¿O repetía lo de siempre?» (35,7) | se dobla una esquina | el afiche se cae entero, acelerando (`despegue`, 35,55) | **5,3** |
| «…lo de siempre» y la cola | ~1 s y corte | debajo, el mismo «UN PAÍS NUEVO» en un afiche viejo: papel tostado, tinta lavada, rojo apagado; rótulo «Ilustrativo · la misma promesa, en un afiche anterior»; quieto ~2,7 s (cola de 1 a 2,5 s) | 1,9 |

El afiche viejo es una figura, no un afiche histórico (lo dice el rótulo). Prop nueva `afiche_viejo` en
`TiempoLargo`; sin ella, solo se dobla la esquina, como en el 000. El episodio pasa a durar 5:39.

**Por comprobar:** la prueba con otra persona, «¿qué pregunta quedó abierta cuando aparece la pizarra?».

## Hoja 4 aplicada: el rojo del muro (s03)

Los tres recortes rojos del fondo del muro pasan a ocre apagado (prop `restos_sin_rojo` en `TiempoLargo`;
sin ella, como en el 000). Medido sobre los cuadros de s03:

| | Antes | Después |
|---|---|---|
| Rojo saturado con el muro vacío (10 s) | 1,52 % | 0 % |
| Rojo saturado medio de la escena | 8,12 % | 7,61 % |

Lo que queda (~8 % desde que se pega) sale casi entero del panfleto aprobado «Nacionalizaciones», cuyo
papel es rojo; el volante no suma (tapa parte del panfleto). Sigue por encima del rojo de la pregunta de
s06 (2,9 %).

Decisión de Gerson: bajarlo en la escena, sin tocar la lámina. Prop `afiches_saturacion` en `TiempoLargo`
(saturación por afiche, por defecto 1); en el 001, «Nacionalizaciones» queda a 0,55.

| | Solo recortes | Recortes y panfleto a 0,55 |
|---|---|---|
| Rojo saturado medio de la escena | 7,61 % | **1,12 %** |
| Máximo (cámara sobre el volante, 24 s) | 14,7 % | 3,2 % |

El valor del panfleto no cambia (en grises se ve igual) y su texto se sigue leyendo. Ahora el único rojo
fuerte del muro es el título del volante, la crítica, y s03 queda por debajo del rojo de la pregunta de s06.

## Hoja 3, versión B: la cámara nada más despacio (s02)

Una sola variable: la velocidad de la cámara sobre el agua (prop `velocidad_agua` en `Presentacion`,
por defecto 620 px/s como en el 000) pasa a **280 px/s** en el 001. Con ella corren los reflejos y las
cáusticas; el frenado con `frenar` se conserva. El azul del agua no se toca (excepción declarada).

| Medida, tramo de la piscina (9,5–17,4 s de la escena) | A (620 px/s) | B (280 px/s) |
|---|---|---|
| Actividad a escala de masas (cuadro reducido a 120 px y suavizado) | 0,72 | **0,55** (−24 %) |
| Actividad a escala fina (cuadro a 480 px) | 4,36 | 4,12 (−5 %) |
| Mediana de la escena entera | 4,27 | 3,85 |

Lectura: el desplazamiento grande se calma, pero lo que sigue «hirviendo» es la textura de los reflejos
(líneas finas y claras sobre todo el agua): cualquier corrimiento de una línea fina da casi la misma
diferencia, sea rápido o lento. s02 sigue por encima de s03 a escala fina (3,85 contra 1,9).

### Versión C: reflejos al 45 % (sobre B)

Segunda variable, con la velocidad de B fija: la capa `Reflejos` de la lámina a opacidad **0,45** (prop
`reflejos_agua` en `Presentacion`, que pasa a `Piscina`; por defecto 1, y la piscina dibujada del 000 no
tiene esa capa).

| Medida, tramo de la piscina | A | B | C |
|---|---|---|---|
| Actividad fina | 4,36 | 4,12 | **3,38** |
| Actividad de masas | 0,72 | 0,55 | 0,54 |
| Mediana de la escena entera | 4,11 | 3,71 | **3,21** |

En total, de A a C: −22 % de actividad fina y −25 % de masas. El agua sigue siendo agua (las ondas se ven,
más suaves). Lo que queda moviéndose son las cáusticas, el vaivén de las corcheras y el agua que se ve a
través de las letras del nombre. s02 sigue por encima de s03 (1,9): bajar más pediría tocar las cáusticas,
una tercera variable que no se probó.

## Hoja 5 aplicada: la línea de tiempo de s01

Una variable: el tamaño de la línea (prop `linea_zoom` en `PruebasDeImprenta`, por defecto 1). Se agranda
todo alrededor de su centro (rótulos, grosor, marcas, puntos de los eventos); abierta, el camino entero
sigue ocupando los mismos 1300 px de pantalla, así que crece lo que se lee, no el recorrido.

- **1,4 se descartó:** abierta, «FALLECE · 2 ENE 2013» tocaba «RÍO DE JANEIRO» y quedaba a 15 px del borde.
- **1,3 queda:** los meses pasan de 26 a 34 px de alto, los rótulos de los eventos crecen igual, y entre
  «2 ENE 2013» y «RÍO DE JANEIRO» queda aire; el rótulo de la izquierda entra con ~36 px de margen.

Corrección a la hoja: la medida de luminancia que la motivó (línea 25 contra fondo 25) promediaba una franja
casi toda de fondo; la línea encendida sí se separa. El problema era el tamaño. Y en una miniatura de 128 px
ningún texto de este cuerpo se lee (ni antes ni ahora): lo que sí se lee ahí son las masas, el punto rojo
del comienzo, el libro y el halo de mayo. Donde se gana es a tamaño de celular.

## Guion de prueba con otra persona

Mostrar el video una vez, sin contexto. Preguntar: «¿Qué encontró Quiroz?», «¿Qué pregunta quedó abierta
cuando aparece la pizarra?», «¿De dónde salía la plata y adónde iba?», «¿Qué te llamó más la atención?».
No anticipar ni corregir.
