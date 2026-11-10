# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, los tiempos de la voz (`narracion_tiempos.json` o, si no hay, los de la provisional) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s00 | Gancho | 0:00.0 | 33 s | 73 % | 11 s | 126 | 11.2 | 25 | 4 | 7 (13.2/min) | 10 (18.9/min) | 🟡 13.2 datos/min |
| s01 | PruebasDeImprenta | 0:33.0 | 48 s | 54 % | 8 s | 115 | 8.7 | 16 | 7 | 2 (2.6/min) | 13 (17.2/min) | 🟢 |
| s02 | Presentacion | 1:21.0 | 25 s | 76 % | 11 s | 148 | 10.0 | 23 | 1 | 5 (12.3/min) | 7 (17.3/min) | 🟡 12.3 datos/min |
| s03 | TiempoLargo | 1:46.3 | 38 s | 73 % | 9 s | 141 | 7.9 | 19 | 4 | 4 (6.5/min) | 10 (16.2/min) | 🟡 6.5 datos/min |
| s04 | TiempoLargo | 2:24.5 | 53 s | 67 % | 10 s | 134 | 8.8 | 21 | 8 | 2 (2.3/min) | 11 (12.8/min) | 🟢 |
| s05 | AprenderAMedir | 3:17.1 | 90 s | 72 % | 16 s | 141 | 10.0 | 18 | 9 | 9 (6.1/min) | 29 (19.5/min) | 🟡 6.1 datos/min |
| s06 | MecanismoDeuda | 4:47.2 | 32 s | 71 % | 7 s | 149 | 12.7 | 24 | 4 | 4 (7.8/min) | 11 (21.5/min) | 🟡 7.8 datos/min |
| s07 | Cierre | 5:19.4 | 17 s | 16 % | 3 s | 53 | 5.0 | 5 | 0 | 1 (10.6/min) | 3 (31.9/min) | 🟡 10.6 datos/min |

Total: 5:36.0. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s00 · gancho — `Gancho` · 0:00.0–0:33.0 (33.0 s)

- **Cambio:** de no saber nada a cargar una cifra que duele (3–4 % de todo lo que produce el país, cada año, desde 1820) y una pregunta: ¿quién lo calculó?
- **Intención:** primero el golpe, después el hombre (DIRECCION_DE_VIDEO §2.5): cinco cuadros, uno por frase, que acumulan; termina en el libro que no llegó a ver en español, y la escena siguiente abre con sus pruebas de imprenta. Yuxtaposición: la cifra fría contra el libro solo en la penumbra
- **Intensidad:** 4 · **Música:** presente (pulso) → se apaga sobre el libro
- **Semáforo para enseñar:** 🟡 13.2 datos/min
- **Métricas:** voz el 73 % del tiempo · tramo más largo sin pausa de párrafo: 10.5 s · 67 palabras · 126 por minuto · 6 frases de 11.2 palabras en promedio (la más larga: 25) · 4 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (7):** Perú · Estado · 1820 · tres · cuatro por ciento · diez · tres y cuatro

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | música s00-tajadas.mp3 (nivel 0.39) |
| 0:00.3 | Desde mil ochocientos veinte, la corrupción le costó al Perú, en promedio, entre el tres y el cuatro por ciento de todo lo que produce. |  |  |
| 0:00.3 |  | **anio** — aparece la barra de la producción y empieza a correr el año |  |
| 0:06.8 |  | **rojo** — se tiñe la tajada (min seguro, hasta max rayado); desde aquí cae una tajada por año y se apila |  |
| 0:12.3 | Cada año. |  |  |
| 0:14.4 | Del presupuesto del Estado, de cada diez soles, se fueron entre tres y cuatro. |  |  |
| 0:14.4 |  | **soles** — aparecen las monedas, una tras otra |  |
| 0:18.6 |  | **caen** — caen las monedas seguras |  |
| 0:19.0 |  | **cuatro** — la moneda de la duda se inclina y queda a medias, punteada |  |
| 0:21.2 | No son casos sueltos: es el sistema, y viene desde la colonia. |  |  |
| 0:21.2 |  | **sueltos** — la regla de siglos; puntos rojos sueltos que parpadean |  |
| 0:23.3 |  | **sistema** — los puntos se unen en una franja continua (de lo medido); entra la cita |  |
| 0:24.5 |  | **colonia** — la franja se alarga hacia atrás, hasta el comienzo de la regla |  |
| 0:27.5 | Lo calculó un historiador limeño. |  |  |
| 0:27.5 |  | **calculo** — la ficha con las cifras se escribe a máquina |  |
| 0:29.8 | Y no llegó a ver su libro en español. |  |  |
| 0:29.8 |  | **libro** — la ficha se va y queda el libro; la luz baja |  |

## s01 · gancho — `PruebasDeImprenta` · 0:33.0–1:21.0 (47.9 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: los meses entre una y otro se recorren con la cámara, del punto oscuro a la luz; la muerte no es un dato más: cruz sobre negro, la frase entera, la fecha, y recién después el punto rojo
- **Intensidad:** 3 · **Música:** ausente → entra al final y sigue sin corte en s02 (pista B de Suno)
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 54 % del tiempo · tramo más largo sin pausa de párrafo: 8.3 s · 87 palabras · 115 por minuto · 10 frases de 8.7 palabras en promedio (la más larga: 16) · 7 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (2):** Nueva York · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:33.0 |  |  | ambiente cuarto (0.6) |
| 0:33.3 | Nueva York. |  |  |
| 0:33.4 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:35.0 | Nuestro historiador revisa, con minuciosidad, las pruebas de imprenta. |  |  |
| 0:36.1 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:39.1 | Es la traducción al español de su último libro. |  |  |
| 0:42.7 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:46.9 | En los agradecimientos escribe una línea que casi nadie lee. |  |  |
| 0:47.2 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:47.2 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:50.4 | Les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:52.4 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:56.9 | Unas líneas más abajo celebra el nacimiento de su hijo. |  |  |
| 0:57.2 |  | **abajo** — la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase) |  |
| 0:57.2 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» celebra el nacimiento de su hijo) |  |
| 1:01.6 | Murió en enero de dos mil trece. |  |  |
| 1:01.6 |  | **muerte** — corte seco a la línea de tiempo: aparece el primer evento (con `cruz`: la cruz sobre negro) |  |
| 1:03.5 |  | **fecha** — (con cruz) aparece la fecha, cuando la voz ya terminó la frase |  |
| 1:03.5 |  |  | **silencio deliberado** |
| 1:06.4 |  | **linea** — (con cruz) aparece la línea con su punto rojo (2–3 s después de la fecha) |  |
| 1:06.4 |  |  | vuelve el sonido |
| 1:07.1 |  | **recorre** — la cámara empieza a recorrer la línea (arranca y frena despacio) |  |
| 1:07.1 |  | _cámara: recorre la línea de tiempo hacia la derecha, de enero a mayo (arranca y frena despacio)_ (entre la muerte y el libro hay meses: el espectador los atraviesa; antes, la cruz y la fecha con su tiempo (DIRECCION_DE_VIDEO §2.8)) |  |
| 1:10.7 | El libro salió en mayo. |  |  |
| 1:10.9 |  | **mayo** — llega al último evento: se enciende |  |
| 1:12.0 |  | **final** — la cámara se abre y se ve el camino entero (aquí entra la música) |  |
| 1:12.0 |  |  | música s01-el-hombre.mp3 (nivel 0.39) |
| 1:12.0 |  | _cámara: se abre hasta ver el camino entero_ («ese hombre» y «lo que encontró» son las dos puntas de la línea) |  |
| 1:13.9 | Estos videos son sobre ese hombre, y sobre lo que encontró. |  |  |
| 1:15.6 |  | **hombre** — pulso en el primer evento |  |
| 1:17.4 |  | **encontro** — el último evento brilla más |  |

## s02 · personaje — `Presentacion` · 1:21.0–1:46.3 (25.4 s)

- **Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos
- **Intención:** página → piscina → página: el agua llega con «nadador» y se vuelve a secar en renglones con «archivos»; Cueto, que va a cerrar el arco, se presenta con su ficha
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 12.3 datos/min
- **Métricas:** voz el 76 % del tiempo · tramo más largo sin pausa de párrafo: 11.4 s · 60 palabras · 148 por minuto · 6 frases de 10.0 palabras en promedio (la más larga: 23) · 1 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:21.0 |  |  | música s02-el-hombre.mp3 (nivel 0.39) |
| 1:21.0 |  |  | ambiente cuarto (0.5) |
| 1:21.5 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 1:21.8 |  | **nombre** — entra el nombre, letra por letra |  |
| 1:24.6 | Nació en Lima, en mil novecientos cincuenta y seis. |  |  |
| 1:24.6 |  | **lugar** — (con lugar) aparece el país y la cámara se acerca a la ciudad (2,5 s); su ficha |  |
| 1:28.1 | De chico fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. |  |  |
| 1:28.6 |  | **piscina** — (piscina) el agua cubre la página: aparece la piscina (sin este beat, la piscina está desde el comienzo) |  |
| 1:28.6 |  |  | se va el ambiente cuarto |
| 1:28.6 |  |  | ambiente agua (0.8) |
| 1:34.2 |  | **ficha** — (con ficha) se escribe la ficha |  |
| 1:34.3 | Marcos Cueto, historiador y amigo suyo desde los quince años, cuenta que esa disciplina de la piscina la llevó después a los archivos. |  |  |
| 1:38.5 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:40.9 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:40.9 |  |  | se va el ambiente agua |
| 1:40.9 |  |  | ambiente cuarto (0.5) |
| 1:42.0 | Y lo resume en una sola palabra: |  |  |
| 1:44.3 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |
| 1:44.3 | inagotable. |  |  |

## s03 · su generación — `TiempoLargo` · 1:46.3–2:24.5 (38.1 s)

- **Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación: ¿el país cambia o se repite?
- **Intención:** los afiches gritan cambio; con «¿o repetía lo de siempre?», el afiche nuevo se despega y debajo asoma uno viejo, igual de prometedor; la pregunta queda en el aire
- **Intensidad:** 3 · **Música:** presente → en suspenso
- **Semáforo para enseñar:** 🟡 6.5 datos/min
- **Métricas:** voz el 73 % del tiempo · tramo más largo sin pausa de párrafo: 9.5 s · 87 palabras · 141 por minuto · 11 frases de 7.9 palabras en promedio (la más larga: 19) · 4 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (4):** Universidad Católica · Perú · Velasco · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:46.3 |  |  | música s03-pais-nuevo.mp3 (nivel 0.42) |
| 1:46.3 |  |  | ambiente ciudad (0.6) |
| 1:46.6 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:49.7 |  | **sello** — cae el sello sobre la lista |  |
| 1:50.7 |  | **primeros** — se marcan los primeros puestos |  |
| 1:53.9 |  | **afiches** — aparece el muro |  |
| 1:53.9 | El Perú vive el gobierno militar de Velasco. |  |  |
| 1:57.3 | Reforma agraria. |  |  |
| 1:57.3 |  | **afiche1** — se pega el primer afiche |  |
| 1:58.6 | Nacionalizaciones. |  |  |
| 1:58.6 |  | **afiche2** — se pega el segundo |  |
| 2:00.6 | Un discurso que promete enterrar el pasado oligárquico. |  |  |
| 2:00.6 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 2:04.8 | Quiroz no apoyó al régimen. |  |  |
| 2:04.9 |  | **volante** — entra el volante |  |
| 2:07.0 |  | **leer** — (opcional) la cámara se acerca al volante para leerlo |  |
| 2:07.0 |  | _cámara: se acerca al volante hasta poder leerlo_ («Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza»: el volante dice eso, con la cita de Cueto; se lee) |  |
| 2:07.0 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 2:12.3 | Para un estudiante de esa época, la historia no era un curso más. |  |  |
| 2:12.4 |  | **vuelve** — (con leer) la cámara vuelve a ver el muro entero |  |
| 2:12.4 |  | _cámara: vuelve a ver el muro entero_ («Para un estudiante de esa época…»: de él a su generación) |  |
| 2:16.1 | Era la manera de responder una pregunta. |  |  |
| 2:18.1 | ¿El país estaba cambiando de verdad? |  |  |
| 2:21.9 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 2:22.0 | ¿O repetía lo de siempre? |  |  |

## s04 · larga duración — `TiempoLargo` · 2:24.5–3:17.1 (52.6 s)

- **Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad
- **Intención:** la clase: Braudel en la pizarra; las capas se dibujan con tiza y brilla solo la que se nombra; la palabra del episodio; la nota y el remate escritos con peso
- **Intensidad:** 3 · **Música:** ausente → las capas entran con su frase (arriba, al medio, al fondo) → solo el fondo en la palabra → vuelven todas
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 67 % del tiempo · tramo más largo sin pausa de párrafo: 9.9 s · 115 palabras · 134 por minuto · 13 frases de 8.8 palabras en promedio (la más larga: 21) · 8 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (2):** Franklin Pease · Fernand Braudel

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:24.5 |  |  | música s04-tres-velocidades.mp3 (nivel 0.31) |
| 2:24.5 |  |  | ambiente cuarto (0.5) |
| 2:24.8 | Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. |  |  |
| 2:26.4 |  | **clase** — (pizarra, con encabezado) se escribe el encabezado de la clase |  |
| 2:29.1 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:32.8 |  | **capas** — el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío) |  |
| 2:32.8 | Braudel decía que la historia no corre a una sola velocidad. |  |  |
| 2:36.2 | Arriba están los acontecimientos: los gobiernos, las guerras, las noticias. |  |  |
| 2:36.2 |  | **capa1** — (capas de a una) se llena la capa de arriba |  |
| 2:41.1 | Cambian rápido, como las olas. |  |  |
| 2:44.2 |  | **capa2** — (capas de a una) se llena la del medio |  |
| 2:44.2 | Más abajo, la economía y la sociedad. |  |  |
| 2:46.9 | Cambian despacio. |  |  |
| 2:49.2 |  | **capa3** — (capas de a una) se llena la de abajo |  |
| 2:49.2 | Y al fondo, la relación del hombre con su medio: la tierra, el clima. |  |  |
| 2:54.9 | Casi no se mueve. |  |  |
| 2:55.9 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:57.8 | A esa historia lenta la llamó larga duración. |  |  |
| 2:59.6 |  | **palabra** — (con palabra) la palabra del episodio, a pantalla completa |  |
| 3:02.9 |  | **subir** — (opcional) la cámara vuelve a ver las tres capas; se va la palabra |  |
| 3:02.9 | Quiroz se quedó con eso. |  |  |
| 3:04.6 | Aprendió a apreciar lo que persiste: las estructuras de la economía. |  |  |
| 3:06.8 |  | **realce** — (con realce) se enciende una capa (en la pizarra, se escribe la nota) |  |
| 3:09.8 |  | **remate** — (con remate) se escribe la frase que cierra el bloque |  |
| 3:09.8 | Hay cosas que no cambian aunque cambien los gobiernos. |  |  |
| 3:14.2 | Esa mirada larga es la de esta serie. |  |  |

## s05 · método — `AprenderAMedir` · 3:17.1–4:47.2 (90.1 s)

- **Cambio:** de un historiador de discursos a uno que mide, y que cambió de ideas
- **Intención:** el viaje a Nueva York; la regresión explicada en tres tiempos (ruido, la recta que busca, cuánto pesa); la claridad en una balanza; la carrera se lee en el estante, no se narra
- **Intensidad:** 2 · **Música:** presente (Suno F: piano; el clarinete entra con «cuánto pesa»)
- **Semáforo para enseñar:** 🟡 6.1 datos/min
- **Métricas:** voz el 72 % del tiempo · tramo más largo sin pausa de párrafo: 15.9 s · 209 palabras · 141 por minuto · 21 frases de 10.0 palabras en promedio (la más larga: 18) · 9 pausa(s) de párrafo (≥ 1 s) · 29 cambios de imagen
- **Nombres y cifras que se dicen (9):** París · Braudel · Nueva York · Universidad de Columbia · Herbert Klein · Perú · Kenneth Maxwell · Cueto · ochenta

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:17.1 |  |  | música s05-aprender-a-medir.mp3 (nivel 0.29) |
| 3:17.1 |  |  | ambiente ciudad (0.55) |
| 3:17.3 |  | **mapa** — aparece el mapa |  |
| 3:17.4 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:20.6 | Buena parte de los historiadores peruanos miraba a París. |  |  |
| 3:20.9 |  | **paris** — sale la ruta hacia la tentación |  |
| 3:24.1 | Era la ciudad de Braudel, el de la larga duración. |  |  |
| 3:27.6 |  | **paris_notas** — (con tentacion_notas) se escriben los renglones junto a la tentación |  |
| 3:27.6 | Ahí se habían formado sus propios profesores. |  |  |
| 3:29.9 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 3:30.8 | Él se va a Nueva York, a la Universidad de Columbia. |  |  |
| 3:30.8 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 3:30.8 |  | _cámara: La cámara sigue la ruta vectorial de Lima a Nueva York con un acercamiento del 30 %._ (El viaje ocurre con la narración; la ruta se dibuja hasta llegar.) |  |
| 3:33.4 |  | **llega** — la ruta llega: sello y campana |  |
| 3:34.0 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 3:34.0 |  | _cámara: Se abre hasta ver las dos rutas completas._ (Comparar el destino elegido con la alternativa de París.) |  |
| 3:35.5 |  | **ficha** — se escribe la ficha |  |
| 3:35.5 | Allí, el historiador Herbert Klein se fija en él y le ofrece una beca. |  |  |
| 3:40.2 | Y aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. |  |  |
| 3:41.1 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 3:44.1 |  | **discursos** — los bloques de discurso se apagan |  |
| 3:46.3 | Una de sus herramientas se llama regresión. |  |  |
| 3:47.7 |  | **regresion** — (con rotulo_grafico) aparece el rótulo del gráfico |  |
| 3:49.2 |  | **caen** — (con explicar_regresion) caen los puntos (el papel ya estaba) |  |
| 3:49.2 | Imagina muchos puntos desordenados: cada uno, un dato. |  |  |
| 3:51.5 |  | **observacion** — (beat propio) |  |
| 3:53.4 | A simple vista, solo ruido. |  |  |
| 3:56.1 | La regresión busca la línea que mejor pasa entre todos. |  |  |
| 3:56.2 |  | **recta** — se traza la recta de regresión |  |
| 3:57.6 |  | **residuos** — (beat propio) |  |
| 3:59.8 | Si hay una tendencia, ayuda a verla. |  |  |
| 4:00.3 |  | **tendencia** — (beat propio) |  |
| 4:02.5 | Y dice cuánto pesa. |  |  |
| 4:03.4 |  | **pendiente** — (con explicar_regresion) se marca la pendiente: cuánto pesa |  |
| 4:05.8 |  | **causalidad** — (beat propio) |  |
| 4:05.8 | Aprendió a trabajar con cifras y a contrastarlas con documentos. |  |  |
| 4:09.6 |  | **serie** — (con serie) la nube se va, los puntos viajan a la serie real y se encienden de a uno; después, la banda |  |
| 4:09.7 | Años después, llevaría esa disciplina al estudio de la corrupción en el Perú. |  |  |
| 4:15.6 | De otro profesor, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. |  |  |
| 4:15.6 |  | **balanza** — aparece la balanza |  |
| 4:19.7 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 4:20.8 |  | **claridad** — cae la segunda (se equilibra) |  |
| 4:23.4 |  | **estante** — aparece la repisa |  |
| 4:23.4 | Con los años se vuelve, en palabras de Cueto, la máxima autoridad en la historia financiera del Perú. |  |  |
| 4:25.9 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 4:30.3 |  | **brujula** — aparece la brújula |  |
| 4:30.4 | Y sus ideas también se mueven. |  |  |
| 4:32.6 |  | **izquierda** — (izquierda-derecha) la aguja va al primer tope; se escriben sus notas |  |
| 4:32.7 | De aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades. |  |  |
| 4:34.1 |  | **giro** — la aguja gira despacio de una época a la otra (izquierda-derecha: va al otro tope) |  |
| 4:40.6 |  | **tiza** — (con brujula_frase) la brújula y su fondo pasan a la pizarra; los rótulos se borran |  |
| 4:40.6 | Cambió de ideas. |  |  |
| 4:42.4 | Sus cálculos eran provisionales: él mismo los dejó abiertos a revisión. |  |  |
| 4:44.0 |  | **frase** — (con brujula_frase) se escribe la frase con tiza |  |

## s06 · puente — `MecanismoDeuda` · 4:47.2–5:19.4 (32.2 s)

- **Cambio:** del hombre que aprendió a medir a su primer caso: una deuda pagada con la plata del guano, y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio
- **Intensidad:** 5 · **Música:** presente (tensión) → se corta con «…a costa del Estado» → acorde sin resolver en la pregunta
- **Semáforo para enseñar:** 🟡 7.8 datos/min
- **Métricas:** voz el 71 % del tiempo · tramo más largo sin pausa de párrafo: 7.3 s · 76 palabras · 149 por minuto · 6 frases de 12.7 palabras en promedio (la más larga: 24) · 4 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (4):** Félix Denegri Luna · Lima · Estado · 1850

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 4:47.2 |  |  | música s06-la-deuda.mp3 (nivel 0.4) |
| 4:47.2 |  |  | ambiente mar (0.7) |
| 4:47.4 |  | **islas** — el grabado de las islas |  |
| 4:47.5 | Pero su primer caso lo había encontrado antes de irse. |  |  |
| 4:47.5 |  | **hoja_entra** — (con hojear) entra el libro, cerrado |  |
| 4:51.7 | Félix Denegri Luna, un estudioso de la historia, dueño de una gran biblioteca en Lima, le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 4:51.7 |  | **hojea** — (con hojear) se abre y se hojea |  |
| 4:58.0 |  | **hoja_pagina** — (con hojear) cae la última hoja: la página con el grabado |  |
| 4:58.4 |  | **hoja_zoom** — (con hojear) la cámara entra al grabado hasta llenar la pantalla |  |
| 4:58.4 |  | _cámara: entra a la ilustración de la página hasta llenar la pantalla_ («el siglo diecinueve»: del libro al grabado de las islas, sin bucle (DIRECCION_DE_VIDEO §2.12)) |  |
| 5:00.8 |  | **sacos** — empiezan a subir sacos al barco |  |
| 5:00.8 | Ahí estaba el guano. |  |  |
| 5:02.2 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 5:02.2 |  |  | se va el ambiente mar |
| 5:02.2 |  |  | ambiente cuarto (0.5) |
| 5:02.2 |  | _cámara: sigue al barco: se acerca y lo lleva a la izquierda mientras aparece el Estado a la derecha_ («Y una deuda que el Estado decidió pagar con esa plata»: del guano al Estado sin corte (revisión del director: el salto era brusco)) |  |
| 5:02.6 | Y una deuda que el Estado decidió pagar con esa plata, en mil ochocientos cincuenta. |  |  |
| 5:05.2 |  | **vales** — se apilan los vales de la deuda |  |
| 5:05.2 |  | _cámara: paneo a la izquierda siguiendo la flecha de la plata, del Estado a los vales_ («una deuda que el Estado decidió pagar con esa plata»: la plata va a los vales; paneo antes que corte (§2.11)) |  |
| 5:06.8 |  | **consolidacion** — cae el sello sobre la pila |  |
| 5:08.7 | Y encontró que se había inflado el valor de la deuda para enriquecerse a costa del Estado. |  |  |
| 5:08.7 |  | **hallazgo** — (opcional) sobre la pila de vales, el monto del vale de arriba se infla (ejemplo ilustrativo) |  |
| 5:15.1 | ¿Adónde fue a parar esa plata? |  |  |
| 5:15.1 |  | **pregunta** — (con pregunta) la pregunta se escribe fuerte |  |

## s07 · cierre — `Cierre` · 5:19.4–5:36.0 (16.7 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** las pruebas de imprenta del comienzo se cierran; el tema entra unos segundos antes y se queda después, para que la tristeza se asiente (DIRECCION_DE_VIDEO §2.15)
- **Intensidad:** 1 · **Música:** protagonista (el tema del canal entra antes del negro y se queda ~5 s más sobre la tarjeta)
- **Semáforo para enseñar:** 🟡 10.6 datos/min
- **Métricas:** voz el 16 % del tiempo · tramo más largo sin pausa de párrafo: 2.6 s · 5 palabras · 53 por minuto · 1 frases de 5.0 palabras en promedio (la más larga: 5) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:19.4 |  |  | música s07-tema.mp3 (nivel 0.55) |
| 5:19.4 |  |  | ambiente cuarto (0.5) |
| 5:19.7 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 5:21.7 |  | **negro** — fundido a negro |  |
| 5:21.7 |  |  | se va el ambiente cuarto |
| 5:22.2 | Próximo episodio: La deuda defraudada. |  |  |
| 5:22.2 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |
| 5:22.2 |  | _cámara: se acerca muy despacio a la tarjeta del próximo episodio (5 % en 13 s)_ (la música se queda sobre el final (revisión del director): el plano respira mientras se asienta la tristeza, sin congelarse) |  |

