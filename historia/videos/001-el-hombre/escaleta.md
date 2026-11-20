# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, los tiempos de la voz (`narracion_tiempos.json` o, si no hay, los de la provisional) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s00 | Gancho | 0:00.0 | 29 s | 80 % | 10 s | 171 | 16.0 | 17 | 3 | 7 (14.9/min) | 10 (21.3/min) | 🟡 14.9 datos/min |
| s01 | PruebasDeImprenta | 0:29.4 | 46 s | 65 % | 8 s | 138 | 14.4 | 25 | 6 | 4 (5.5/min) | 13 (17.8/min) | 🟢 |
| s02 | Presentacion | 1:15.8 | 26 s | 81 % | 12 s | 156 | 13.0 | 24 | 2 | 7 (16.8/min) | 7 (16.8/min) | 🟡 16.8 datos/min · voz 81 % |
| s03 | TiempoLargo | 1:41.9 | 38 s | 83 % | 16 s | 162 | 16.2 | 23 | 2 | 5 (8.3/min) | 12 (20.0/min) | 🟡 8.3 datos/min · voz 83 % |
| s04 | TiempoLargo | 2:20.4 | 52 s | 79 % | 10 s | 156 | 14.8 | 21 | 7 | 4 (4.7/min) | 11 (12.9/min) | 🟢 |
| s06 | MecanismoDeuda | 3:12.7 | 48 s | 78 % | 11 s | 179 | 16.6 | 21 | 4 | 10 (13.4/min) | 16 (21.5/min) | 🟡 13.4 datos/min |
| s05 | AprenderAMedir | 4:00.9 | 70 s | 81 % | 19 s | 157 | 16.5 | 23 | 6 | 10 (8.7/min) | 22 (19.1/min) | 🟡 8.7 datos/min · voz 81 % |
| s08 | AprenderAMedir | 5:11.1 | 30 s | 81 % | 8 s | 159 | 19.0 | 23 | 3 | 1 (2.1/min) | 7 (14.7/min) | 🟡 voz 81 % |
| s07 | Cierre | 5:40.8 | 19 s | 24 % | 4 s | 95 | 12.0 | 12 | 0 | 4 (31.6/min) | 3 (23.7/min) | 🟡 31.6 datos/min |

Total: 5:59.4. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s00 · gancho — `Gancho` · 0:00.0–0:29.4 (29.4 s)

- **Cambio:** de no saber nada a cargar una cifra que duele (3–4 % de todo lo que produce el país, cada año, desde 1820) y una pregunta: ¿quién lo calculó?
- **Intención:** primero el golpe, después el hombre (DIRECCION_DE_VIDEO §2.5): cinco cuadros, uno por frase, que acumulan; termina en el libro que no llegó a ver en español, y la escena siguiente abre con sus pruebas de imprenta. Yuxtaposición: la cifra fría contra el libro solo en la penumbra
- **Intensidad:** 4 · **Música:** presente (pulso) → se apaga sobre el libro
- **Semáforo para enseñar:** 🟡 14.9 datos/min
- **Métricas:** voz el 80 % del tiempo · tramo más largo sin pausa de párrafo: 10.4 s · 80 palabras · 171 por minuto · 5 frases de 16.0 palabras en promedio (la más larga: 17) · 3 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (7):** Perú · Estado · dos · tres · cuatro por ciento · cuatro · diez

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | música s00-tajadas.mp3 (nivel 0.39) |
| 0:00.3 | Durante casi dos siglos, la corrupción le costó al Perú una parte de todo lo que producía. |  |  |
| 0:00.3 |  | **anio** — aparece la barra de la producción y empieza a correr el año |  |
| 0:06.2 | Cada año, en promedio, ese costo fue de entre el tres y el cuatro por ciento. |  |  |
| 0:09.4 |  | **rojo** — se tiñe la tajada (min seguro, hasta max rayado); desde aquí cae una tajada por año y se apila |  |
| 0:11.7 | Comparado con el gasto del Estado, ese costo equivalía a tres o cuatro de cada diez soles. |  |  |
| 0:11.7 |  | **soles** — aparecen las monedas, una tras otra |  |
| 0:14.7 |  | **caen** — caen las monedas seguras |  |
| 0:15.1 |  | **cuatro** — la moneda de la duda se inclina y queda a medias, punteada |  |
| 0:18.0 | No era una suma de casos sueltos: era sistémica, y venía desde la colonia. |  |  |
| 0:18.8 |  | **sueltos** — la regla de siglos; puntos rojos sueltos que parpadean |  |
| 0:20.2 |  | **sistema** — los puntos se unen en una franja continua (de lo medido); entra la cita |  |
| 0:22.0 |  | **colonia** — la franja se alarga hacia atrás, hasta el comienzo de la regla |  |
| 0:23.6 | Todo eso lo calculó un historiador limeño, que no llegó a ver su libro en español. |  |  |
| 0:23.6 |  | **calculo** — la ficha con las cifras se escribe a máquina |  |
| 0:26.2 |  | **libro** — la ficha se va y queda el libro; la luz baja |  |

## s01 · gancho — `PruebasDeImprenta` · 0:29.4–1:15.8 (46.5 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: los meses entre una y otro se recorren con la cámara, del punto oscuro a la luz; la muerte no es un dato más: cruz sobre negro, la frase entera, la fecha, y recién después el punto rojo
- **Intensidad:** 3 · **Música:** ausente → entra al final y sigue sin corte en s02 (pista B de Suno)
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 65 % del tiempo · tramo más largo sin pausa de párrafo: 8.0 s · 101 palabras · 138 por minuto · 7 frases de 14.4 palabras en promedio (la más larga: 25) · 6 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (4):** Nueva York · dos mil · cincuenta y seis · cuatro

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:29.4 |  |  | música s01-el-hombre.mp3 (nivel 0.39) |
| 0:29.4 |  |  | ambiente cuarto (0.6) |
| 0:29.6 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:29.7 | En Nueva York, nuestro historiador revisa con minuciosidad las pruebas de imprenta de la traducción al español de su último libro. |  |  |
| 0:31.7 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:37.6 | Tiene cáncer, no le queda mucho tiempo, y lo sabe. |  |  |
| 0:42.3 | En los agradecimientos escribe una línea fácil de pasar por alto: les agradece a sus médicos por alargar estos días para poder completar la tarea. |  |  |
| 0:42.5 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:42.5 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:47.8 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:51.3 | Unas líneas más abajo celebra el nacimiento de su hijo. |  |  |
| 0:51.3 |  | **abajo** — la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase) |  |
| 0:51.3 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» celebra el nacimiento de su hijo) |  |
| 0:55.6 | Murió en enero de dos mil trece, a los cincuenta y seis años. |  |  |
| 0:55.6 |  | **muerte** — corte seco a la línea de tiempo: aparece el primer evento (con `cruz`: la cruz sobre negro) |  |
| 0:59.1 |  | **fecha** — (con cruz) aparece la fecha, cuando la voz ya terminó la frase |  |
| 0:59.1 |  |  | **silencio deliberado** |
| 1:01.9 |  | **linea** — (con cruz) aparece la línea con su punto rojo (2–3 s después de la fecha) |  |
| 1:01.9 |  |  | vuelve el sonido |
| 1:02.6 |  | **recorre** — la cámara empieza a recorrer la línea (arranca y frena despacio) |  |
| 1:02.6 |  | _cámara: recorre la línea de tiempo hacia la derecha, de enero a mayo (arranca y frena despacio)_ (entre la muerte y el libro hay meses: el espectador los atraviesa; antes, la cruz y la fecha con su tiempo (DIRECCION_DE_VIDEO §2.8)) |  |
| 1:05.7 | El libro salió en mayo, cuatro meses después de su muerte. |  |  |
| 1:06.6 |  | **mayo** — llega al último evento: se enciende |  |
| 1:09.3 |  | **final** — la cámara se abre y se ve el camino entero (aquí entra la música) |  |
| 1:09.3 |  | _cámara: se abre hasta ver el camino entero_ («ese hombre» y «lo que encontró» son las dos puntas de la línea) |  |
| 1:10.0 | Estos videos tratan de ese hombre y de lo que encontró. |  |  |
| 1:11.2 |  | **hombre** — pulso en el primer evento |  |
| 1:12.2 |  | **encontro** — el último evento brilla más |  |

## s02 · personaje — `Presentacion` · 1:15.8–1:41.9 (26.1 s)

- **Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos
- **Intención:** página → piscina → página: el agua llega con «nadador» y se vuelve a secar en renglones con «archivos»; Cueto, que va a cerrar el arco, se presenta con su ficha
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 16.8 datos/min · voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 12.1 s · 65 palabras · 156 por minuto · 5 frases de 13.0 palabras en promedio (la más larga: 24) · 2 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (7):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · Quiroz · mil · cincuenta y seis

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:15.8 |  |  | música s02-el-hombre.mp3 (nivel 0.39) |
| 1:15.8 |  |  | ambiente cuarto (0.5) |
| 1:16.1 | Se llamaba Alfonso Quiroz Norris y nació en Lima, en mil novecientos cincuenta y seis. |  |  |
| 1:16.7 |  | **nombre** — entra el nombre, letra por letra |  |
| 1:19.0 |  | **lugar** — (con lugar) aparece el país y la cámara se acerca a la ciudad (2,5 s); su ficha |  |
| 1:22.5 | Fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. |  |  |
| 1:22.6 |  | **piscina** — (piscina) el agua cubre la página: aparece la piscina (sin este beat, la piscina está desde el comienzo) |  |
| 1:22.6 |  |  | se va el ambiente cuarto |
| 1:22.6 |  |  | ambiente agua (0.8) |
| 1:28.4 | Marcos Cueto, su amigo desde los quince años, cuenta que Quiroz aprendió disciplina en la piscina y que después la llevó a los archivos. |  |  |
| 1:28.4 |  | **ficha** — (con ficha) se escribe la ficha |  |
| 1:32.9 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:35.1 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:35.1 |  |  | se va el ambiente agua |
| 1:35.1 |  |  | ambiente cuarto (0.5) |
| 1:36.2 | Y en el prólogo del libro lo describe con una sola palabra: |  |  |
| 1:39.7 | inagotable. |  |  |
| 1:39.7 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |

## s03 · su generación — `TiempoLargo` · 1:41.9–2:20.4 (38.5 s)

- **Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación: ¿el país cambia o se repite?
- **Intención:** los afiches gritan cambio; con «¿o repetía lo de siempre?», el afiche nuevo se despega y debajo asoma uno viejo, igual de prometedor; la pregunta queda en el aire
- **Intensidad:** 3 · **Música:** presente → en suspenso
- **Semáforo para enseñar:** 🟡 8.3 datos/min · voz 83 %
- **Métricas:** voz el 83 % del tiempo · tramo más largo sin pausa de párrafo: 15.7 s · 97 palabras · 162 por minuto · 6 frases de 16.2 palabras en promedio (la más larga: 23) · 2 pausa(s) de párrafo (≥ 1 s) · 12 cambios de imagen
- **Nombres y cifras que se dicen (5):** Universidad Católica · Perú · Velasco · mil · setenta y cuatro

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:41.9 |  |  | música s03-pais-nuevo.mp3 (nivel 0.42) |
| 1:41.9 |  |  | ambiente ciudad (0.6) |
| 1:42.2 | En mil novecientos setenta y cuatro entró a la Universidad Católica, en uno de los primeros puestos del examen de admisión. |  |  |
| 1:44.7 |  | **sello** — cae el sello sobre la lista |  |
| 1:46.9 |  | **primeros** — se marcan los primeros puestos |  |
| 1:49.5 | El Perú vivía el gobierno militar de Velasco, con su reforma agraria, sus nacionalizaciones y un discurso que prometía enterrar el pasado oligárquico. |  |  |
| 1:49.5 |  | **afiches** — aparece el muro |  |
| 1:52.3 |  | **afiche1** — se pega el primer afiche |  |
| 1:53.6 |  | **afiche2** — se pega el segundo |  |
| 1:55.0 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:58.8 | Quiroz nunca apoyó al régimen: militó un tiempo en un pequeño partido trotskista que criticaba con dureza al gobierno militar. |  |  |
| 1:59.4 |  | **volante** — entra el volante |  |
| 2:01.1 |  | **leer** — (opcional) la cámara se acerca al volante para leerlo |  |
| 2:01.1 |  | _cámara: se acerca al volante hasta poder leerlo_ («Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza»: el volante dice eso, con la cita de Cueto; se lee) |  |
| 2:06.8 | Para un estudiante de esa época, estudiar historia era una forma de entender el presente. |  |  |
| 2:06.8 |  | **vuelve** — (con leer) la cámara vuelve a ver el muro entero |  |
| 2:06.8 |  | _cámara: vuelve a ver el muro entero_ («Para un estudiante de esa época…»: de él a su generación) |  |
| 2:11.8 | Y el presente le hacía una pregunta: ¿el país estaba cambiando de verdad, |  |  |
| 2:12.7 |  | **acerca** — (opcional) la cámara se acerca despacio al último afiche |  |
| 2:12.7 |  | _cámara: se acerca despacio al último afiche («UN PAÍS NUEVO») y se queda quieta_ («Era la manera de responder una pregunta»: la cámara va al afiche que la pregunta pone a prueba y llega antes de «¿El país estaba cambiando de verdad?», que transcurre quieta; quieta también para el golpe y lo que revela) |  |
| 2:15.3 |  | **esquina** — (con afiche_viejo) la esquina del último afiche empieza a despegarse, antes de caer |  |
| 2:16.3 | o repetía lo de siempre? |  |  |
| 2:16.3 |  | **despegue** — una esquina se despega: debajo hay afiches viejos (con afiche_viejo: el afiche se cae y queda el viejo) |  |

## s04 · larga duración — `TiempoLargo` · 2:20.4–3:12.7 (52.3 s)

- **Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad
- **Intención:** la clase: Braudel en la pizarra; las capas se dibujan con tiza y brilla solo la que se nombra; la palabra del episodio; la nota y el remate escritos con peso
- **Intensidad:** 3 · **Música:** ausente → las capas entran con su frase (arriba, al medio, al fondo) → solo el fondo en la palabra → vuelven todas
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 10.4 s · 133 palabras · 156 por minuto · 9 frases de 14.8 palabras en promedio (la más larga: 21) · 7 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (4):** Franklin Pease · Fernand Braudel · Según Cueto · Perú

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:20.4 |  |  | música s04-tres-velocidades.mp3 (nivel 0.31) |
| 2:20.4 |  |  | ambiente cuarto (0.5) |
| 2:20.7 | Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. |  |  |
| 2:22.2 |  | **clase** — (pizarra, con encabezado) se escribe el encabezado de la clase |  |
| 2:25.4 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:28.7 | Braudel decía que la historia no corre a una sola velocidad. |  |  |
| 2:28.7 |  | **capas** — el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío) |  |
| 2:32.5 | Arriba están los acontecimientos, como los gobiernos, las guerras y las noticias, que cambian rápido, como las olas. |  |  |
| 2:32.5 |  | **capa1** — (capas de a una) se llena la capa de arriba |  |
| 2:40.1 | Más abajo están la economía y la sociedad, que cambian más despacio. |  |  |
| 2:40.1 |  | **capa2** — (capas de a una) se llena la del medio |  |
| 2:44.9 | Y al fondo está la relación del hombre con la tierra y el clima, que casi no se mueve. |  |  |
| 2:44.9 |  | **capa3** — (capas de a una) se llena la de abajo |  |
| 2:49.9 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:51.2 | A lo que cambia tan despacio que dura siglos lo llamó larga duración. |  |  |
| 2:54.5 |  | **palabra** — (con palabra) la palabra del episodio, a pantalla completa |  |
| 2:57.3 | Según Cueto, ahí aprendió a apreciar lo que persiste: las estructuras de la economía. |  |  |
| 2:57.3 |  | **subir** — (opcional) la cámara vuelve a ver las tres capas; se va la palabra |  |
| 3:00.5 |  | **realce** — (con realce) se enciende una capa (en la pizarra, se escribe la nota) |  |
| 3:03.0 | Hay cosas en el Perú que no cambian aunque cambien los gobiernos. |  |  |
| 3:03.0 |  | **remate** — (con remate) se escribe la frase que cierra el bloque |  |
| 3:07.7 | Esa mirada larga, que busca lo que persiste, es la de esta serie. |  |  |

## s06 · puente — `MecanismoDeuda` · 3:12.7–4:00.9 (48.2 s)

- **Cambio:** de «toda la riqueza del guano se derrochó en lujos» a «no todo: la deuda se infló a costa del Estado», y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio; la versión de entonces queda escrita en una tarjeta punteada y el corrector tacha solo TODO con «Pero en su tesis…» (guion v3)
- **Intensidad:** 5 · **Música:** presente (tensión) → el acorde sin resolver queda solo después de la pregunta
- **Semáforo para enseñar:** 🟡 13.4 datos/min
- **Métricas:** voz el 78 % del tiempo · tramo más largo sin pausa de párrafo: 10.9 s · 133 palabras · 179 por minuto · 8 frases de 16.6 palabras en promedio (la más larga: 21) · 4 pausa(s) de párrafo (≥ 1 s) · 16 cambios de imagen
- **Nombres y cifras que se dicen (10):** París · Braudel · Quiroz · Nueva York · Universidad de Columbia · Herbert Klein · Perú · Columbia · Kenneth Maxwell · dos

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:12.7 |  |  | ambiente mar (0.7) |
| 3:12.9 |  | **islas** — el grabado de las islas |  |
| 3:13.0 | Su primer caso lo encontró en Lima, cuando terminaba la universidad. |  |  |
| 3:13.0 |  | **hoja_entra** — (con hojear) entra el libro, cerrado |  |
| 3:14.2 |  | **ficha_lugar** — (con fichas_libro) se escribe la ficha del lugar y la fecha |  |
| 3:17.1 | Félix Denegri Luna tenía una gran biblioteca, y fue él quien le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 3:17.1 |  | **hojea** — (con hojear) se abre y se hojea |  |
| 3:17.9 |  | **ficha_nombre** — (con fichas_libro) se escribe la ficha del nombre |  |
| 3:22.6 |  | **hoja_pagina** — (con hojear) cae la última hoja: la página con el grabado |  |
| 3:23.0 |  | **hoja_zoom** — (con hojear) la cámara entra al grabado hasta llenar la pantalla |  |
| 3:23.0 |  | _cámara: entra a la ilustración de la página hasta llenar la pantalla_ («el siglo diecinueve»: del libro al grabado de las islas, sin bucle (DIRECCION_DE_VIDEO §2.12)) |  |
| 3:24.0 | Ahí estaba el guano, el abono que el Perú sacaba de sus islas y vendía a Europa. |  |  |
| 3:25.3 |  | **sacos** — empiezan a subir sacos al barco |  |
| 3:26.7 |  | **musica** — (beat propio) |  |
| 3:26.7 |  |  | música s06-la-deuda.mp3 (nivel 0.4) |
| 3:28.8 | Cuando Quiroz estudiaba, los libros de historia aseguraban que toda esa riqueza se había derrochado en lujos de las élites. |  |  |
| 3:31.8 |  | **version** — (con version) entra la tarjeta punteada con la versión de entonces |  |
| 3:36.1 | En mil ochocientos cincuenta, el Estado decidió pagar con la plata del guano una deuda vieja con acreedores del propio país. |  |  |
| 3:37.6 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 3:37.6 |  |  | se va el ambiente mar |
| 3:37.6 |  |  | ambiente cuarto (0.5) |
| 3:37.6 |  | _cámara: sigue al barco: se acerca y lo lleva a la izquierda mientras aparece el Estado a la derecha_ («Y una deuda que el Estado decidió pagar con esa plata»: del guano al Estado sin corte (revisión del director: el salto era brusco)) |  |
| 3:39.9 |  | **vales** — se apilan los vales de la deuda |  |
| 3:39.9 |  | _cámara: paneo a la izquierda siguiendo la flecha de la plata, del Estado a los vales_ («una deuda que el Estado decidió pagar con esa plata»: la plata va a los vales; paneo antes que corte (§2.11)) |  |
| 3:42.7 |  | **consolidacion** — cae el sello sobre la pila |  |
| 3:44.0 | Pero en su tesis de mil novecientos ochenta, Quiroz mostró que no todo se fue en lujos. |  |  |
| 3:44.0 |  | **tacha** — (con version) el corrector tacha en rojo la palabra `tachar` |  |
| 3:48.8 | Algunos inflaron el valor de esa deuda para enriquecerse a costa del Estado. |  |  |
| 3:48.8 |  | **hallazgo** — (opcional) sobre la pila de vales, el monto del vale de arriba se infla (ejemplo ilustrativo) |  |
| 3:53.8 |  | **pregunta** — (con pregunta) la pregunta se escribe fuerte |  |
| 3:53.9 | ¿Y adónde fue a parar la plata que el Estado pagó por esa deuda? |  |  |

## s05 · método — `AprenderAMedir` · 4:00.9–5:11.1 (70.3 s)

- **Cambio:** de un historiador de documentos a uno que mide, y que sabe que la cifra sola no basta
- **Intención:** el viaje a Nueva York; la regresión explicada por pasos, cada uno con su palabra y su quietud (ruido, la recta que pasa más cerca, la inclinación); la balanza de Maxwell termina equilibrada y quieta
- **Intensidad:** 2 · **Música:** presente (Suno F: piano; el clarinete entra con «la inclinación»); sigue en s08 sin corte
- **Semáforo para enseñar:** 🟡 8.7 datos/min · voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 19.2 s · 181 palabras · 157 por minuto · 11 frases de 16.5 palabras en promedio (la más larga: 23) · 6 pausa(s) de párrafo (≥ 1 s) · 22 cambios de imagen
- **Nombres y cifras que se dicen (10):** Lima · Félix Denegri Luna · Perú · Europa · Cuando Quiroz · Estado · Quiroz · mil · cincuenta · ochenta

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 4:00.9 |  |  | música s05-aprender-a-medir.mp3 (nivel 0.29) |
| 4:00.9 |  |  | ambiente ciudad (0.55) |
| 4:01.1 |  | **mapa** — aparece el mapa |  |
| 4:01.2 | Poco después toma un camino que pocos peruanos habían tomado. |  |  |
| 4:05.7 | Buena parte de los historiadores peruanos miraba a París, la ciudad de Braudel, donde se habían formado algunos de los profesores de Quiroz. |  |  |
| 4:08.1 |  | **paris** — sale la ruta hacia la tentación |  |
| 4:11.1 |  | **paris_notas** — (con tentacion_notas) se escriben los renglones junto a la tentación |  |
| 4:12.7 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 4:13.4 | Él, en cambio, se va a Nueva York, a la Universidad de Columbia. |  |  |
| 4:14.6 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 4:14.6 |  | _cámara: La cámara sigue la ruta vectorial de Lima a Nueva York con un acercamiento del 30 %._ (El viaje ocurre con la narración; la ruta se dibuja hasta llegar.) |  |
| 4:17.2 |  | **llega** — la ruta llega: sello y campana |  |
| 4:17.8 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 4:17.8 |  | _cámara: Se abre hasta ver las dos rutas completas._ (Comparar el destino elegido con la alternativa de París.) |  |
| 4:18.8 | Allí, el historiador Herbert Klein le ofrece una beca de maestría y doctorado. |  |  |
| 4:20.0 |  | **ficha** — se escribe la ficha |  |
| 4:23.4 | Y Quiroz aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. |  |  |
| 4:24.3 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 4:28.3 |  | **discursos** — los bloques de discurso se apagan |  |
| 4:29.7 | Una de sus herramientas se llama regresión: imagina muchos puntos desordenados, cada uno una observación, que a simple vista parecen solo ruido. |  |  |
| 4:31.1 |  | **regresion** — (con rotulo_grafico) aparece el rótulo del gráfico |  |
| 4:32.2 |  | **caen** — (con explicar_regresion) caen los puntos (el papel ya estaba) |  |
| 4:35.1 |  | **observacion** — (beat propio) |  |
| 4:39.0 | La regresión busca la línea que pasa lo más cerca posible de todos, y si hay una tendencia, la deja ver. |  |  |
| 4:40.1 |  | **recta** — se traza la recta de regresión |  |
| 4:41.2 |  | **residuos** — (beat propio) |  |
| 4:43.3 |  | **tendencia** — (beat propio) |  |
| 4:45.4 | Cada punto junta dos cifras, y la inclinación de la línea dice cuánto sube una por cada paso que da la otra. |  |  |
| 4:47.4 |  | **pendiente** — (con explicar_regresion) se marca la pendiente: cuánto pesa |  |
| 4:53.5 | Aprende a trabajar con cifras y a contrastarlas con documentos. |  |  |
| 4:53.5 |  | **causalidad** — (beat propio) |  |
| 4:57.5 | Años después, llevará esa disciplina al estudio de la corrupción en el Perú. |  |  |
| 4:57.6 |  | **serie** — (con serie) la nube se va, los puntos viajan a la serie real y se encienden de a uno; después, la banda |  |
| 5:03.2 | De otro de sus profesores en Columbia, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. |  |  |
| 5:05.1 |  | **balanza** — aparece la balanza |  |
| 5:08.2 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 5:09.3 |  | **claridad** — cae la segunda (se equilibra) |  |

## s08 · carrera — `AprenderAMedir` · 5:11.1–5:40.8 (29.7 s)

- **Cambio:** del alumno que aprende a medir a la autoridad que no da por cerradas sus propias cifras, y que vuelve a la tesis de la deuda
- **Intención:** la carrera se lee en el estante, no se narra; la brújula gira de una época a otra y pasa a la pizarra; con «aquella tesis» entra el tema del canal (partida de s05 en la versión 3 del guion: el viaje juntaba seis ideas en 96 s)
- **Intensidad:** 2 · **Música:** presente (Suno F, continuación de s05) → el tema del canal entra con «aquella tesis»
- **Semáforo para enseñar:** 🟡 voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 8.2 s · 76 palabras · 159 por minuto · 4 frases de 19.0 palabras en promedio (la más larga: 23) · 3 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:11.1 |  | **estante** — aparece la repisa |  |
| 5:11.1 |  |  | música s08-aprender-a-medir.mp3 (nivel 0.29) |
| 5:11.1 |  |  | ambiente ciudad (0.55) |
| 5:11.4 | Con los años, según Cueto, llega a ser la máxima autoridad en la historia financiera del Perú. |  |  |
| 5:14.3 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 5:18.1 | Sus ideas políticas también cambian: del joven trotskista pasa a una postura liberal, que pide igualdad de oportunidades para todos en la economía. |  |  |
| 5:18.1 |  | **brujula** — aparece la brújula |  |
| 5:20.6 |  | **izquierda** — (izquierda-derecha) la aguja va al primer tope; se escriben sus notas |  |
| 5:22.2 |  | **giro** — la aguja gira despacio de una época a la otra (izquierda-derecha: va al otro tope) |  |
| 5:27.3 | Y no da por cerradas ni sus propias cifras: llama provisionales a sus cálculos. |  |  |
| 5:27.3 |  | **tiza** — (con brujula_frase) la brújula y su fondo pasan a la pizarra; los rótulos se borran |  |
| 5:30.1 |  | **frase** — (con brujula_frase) se escribe la frase con tiza |  |
| 5:33.8 | Pero no se olvidó de aquella tesis sobre la deuda, que en mil novecientos ochenta y siete se convertiría en un libro. |  |  |

## s07 · cierre — `Cierre` · 5:40.8–5:59.4 (18.6 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** las pruebas de imprenta del comienzo se cierran; el tema entra unos segundos antes y se queda después, para que la tristeza se asiente (DIRECCION_DE_VIDEO §2.15)
- **Intensidad:** 1 · **Música:** protagonista (el tema del canal entra antes del negro y se queda ~5 s más sobre la tarjeta)
- **Semáforo para enseñar:** 🟡 31.6 datos/min
- **Métricas:** voz el 24 % del tiempo · tramo más largo sin pausa de párrafo: 4.5 s · 12 palabras · 95 por minuto · 1 frases de 12.0 palabras en promedio (la más larga: 12) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (4):** Cueto · Perú · mil · ochenta y siete

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:40.8 |  |  | música s07-tema.mp3 (nivel 0.55) |
| 5:40.8 |  |  | ambiente cuarto (0.5) |
| 5:41.1 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 5:43.1 |  | **negro** — fundido a negro |  |
| 5:43.1 |  |  | se va el ambiente cuarto |
| 5:43.6 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |
| 5:43.6 |  | _cámara: se acerca muy despacio a la tarjeta del próximo episodio (5 % en 13 s)_ (la música se queda sobre el final (revisión del director): el plano respira mientras se asienta la tristeza, sin congelarse) |  |
| 5:43.6 | El próximo episodio sigue esa plata, y se llama La deuda defraudada. |  |  |

