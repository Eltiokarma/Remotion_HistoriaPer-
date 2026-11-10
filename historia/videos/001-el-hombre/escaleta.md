# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s00 | Gancho | 0:00.0 | 35 s | 70 % | 11 s | 119 | 11.2 | 25 | 4 | 7 (12.5/min) | 10 (17.8/min) | 🟡 12.5 datos/min |
| s01 | PruebasDeImprenta | 0:34.9 | 52 s | 62 % | 10 s | 105 | 8.7 | 16 | 6 | 2 (2.4/min) | 13 (15.7/min) | 🟢 |
| s02 | Presentacion | 1:27.1 | 33 s | 73 % | 9 s | 113 | 10.0 | 23 | 3 | 5 (9.4/min) | 7 (13.1/min) | 🟡 9.4 datos/min |
| s03 | TiempoLargo | 2:00.2 | 48 s | 75 % | 11 s | 111 | 7.9 | 19 | 4 | 4 (5.1/min) | 10 (12.8/min) | 🟢 |
| s04 | TiempoLargo | 2:48.0 | 67 s | 71 % | 9 s | 105 | 8.8 | 21 | 8 | 2 (1.8/min) | 11 (10.1/min) | 🟢 |
| s05 | AprenderAMedir | 3:54.6 | 110 s | 78 % | 15 s | 115 | 10.0 | 18 | 9 | 9 (5.0/min) | 29 (16.0/min) | 🟢 |
| s06 | MecanismoDeuda | 5:44.4 | 36 s | 79 % | 10 s | 134 | 12.7 | 24 | 4 | 4 (7.1/min) | 11 (19.4/min) | 🟡 7.1 datos/min |
| s07 | Cierre | 6:19.9 | 17 s | 20 % | 3 s | 48 | 5.0 | 5 | 0 | 1 (9.7/min) | 3 (29.0/min) | 🟡 9.7 datos/min |

Total: 6:37.1. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s00 · gancho — `Gancho` · 0:00.0–0:34.9 (34.9 s)

- **Cambio:** de no saber nada a cargar una cifra que duele (3–4 % de todo lo que produce el país, cada año, desde 1820) y una pregunta: ¿quién lo calculó?
- **Intención:** primero el golpe, después el hombre (DIRECCION_DE_VIDEO §2.5): cinco cuadros, uno por frase, que acumulan; termina en el libro que no llegó a ver en español, y la escena siguiente abre con sus pruebas de imprenta. Yuxtaposición: la cifra fría contra el libro solo en la penumbra
- **Intensidad:** 4 · **Música:** presente (pulso) → se apaga sobre el libro
- **Semáforo para enseñar:** 🟡 12.5 datos/min
- **Métricas:** voz el 70 % del tiempo · tramo más largo sin pausa de párrafo: 10.9 s · 67 palabras · 119 por minuto · 6 frases de 11.2 palabras en promedio (la más larga: 25) · 4 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (7):** Perú · Estado · 1820 · tres · cuatro por ciento · diez · tres y cuatro

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | música s00-gancho.mp3 (nivel 0.32) |
| 0:00.3 | Desde mil ochocientos veinte, la corrupción le costó al Perú, en promedio, entre el tres y el cuatro por ciento de todo lo que produce. |  |  |
| 0:00.3 |  | **anio** — aparece la barra de la producción y empieza a correr el año |  |
| 0:05.8 |  | **rojo** — se tiñe la tajada (min seguro, hasta max rayado); desde aquí cae una tajada por año y se apila |  |
| 0:10.1 | Cada año. |  |  |
| 0:12.7 | Del presupuesto del Estado, de cada diez soles, se fueron entre tres y cuatro. |  |  |
| 0:12.7 |  | **soles** — aparecen las monedas, una tras otra |  |
| 0:17.1 |  | **caen** — caen las monedas seguras |  |
| 0:17.6 |  | **cuatro** — la moneda de la duda se inclina y queda a medias, punteada |  |
| 0:19.8 | No son casos sueltos: es el sistema, y viene desde la colonia. |  |  |
| 0:19.8 |  | **sueltos** — la regla de siglos; puntos rojos sueltos que parpadean |  |
| 0:21.8 |  | **sistema** — los puntos se unen en una franja continua (de lo medido); entra la cita |  |
| 0:23.0 |  | **colonia** — la franja se alarga hacia atrás, hasta el comienzo de la regla |  |
| 0:25.9 | Lo calculó un historiador limeño. |  |  |
| 0:25.9 |  | **calculo** — la ficha con las cifras se escribe a máquina |  |
| 0:29.4 | Y no llegó a ver su libro en español. |  |  |
| 0:29.4 |  | **libro** — la ficha se va y queda el libro; la luz baja |  |

## s01 · gancho — `PruebasDeImprenta` · 0:34.9–1:27.1 (52.2 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: los meses entre una y otro se recorren con la cámara, del punto oscuro a la luz; la muerte no es un dato más: cruz sobre negro, la frase entera, la fecha, y recién después el punto rojo
- **Intensidad:** 3 · **Música:** ausente → entra al final
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 62 % del tiempo · tramo más largo sin pausa de párrafo: 10.0 s · 87 palabras · 105 por minuto · 10 frases de 8.7 palabras en promedio (la más larga: 16) · 6 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (2):** Nueva York · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:34.9 |  |  | ambiente cuarto (0.6) |
| 0:35.2 | Nueva York. |  |  |
| 0:35.3 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:36.6 | Nuestro historiador revisa, con minuciosidad, las pruebas de imprenta. |  |  |
| 0:38.3 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:42.2 | Es la traducción al español de su último libro. |  |  |
| 0:46.6 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:51.6 | En los agradecimientos escribe una línea que casi nadie lee. |  |  |
| 0:51.9 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:51.9 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:55.7 | Les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:58.2 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 1:03.1 | Unas líneas más abajo celebra el nacimiento de su hijo. |  |  |
| 1:03.6 |  | **abajo** — la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase) |  |
| 1:03.6 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» celebra el nacimiento de su hijo) |  |
| 1:08.8 | Murió en enero de dos mil trece. |  |  |
| 1:08.9 |  | **muerte** — corte seco a la línea de tiempo: aparece el primer evento (con `cruz`: la cruz sobre negro) |  |
| 1:11.3 |  | **fecha** — (con cruz) aparece la fecha, cuando la voz ya terminó la frase |  |
| 1:11.3 |  |  | **silencio deliberado** |
| 1:13.8 |  | **linea** — (con cruz) aparece la línea con su punto rojo (2–3 s después de la fecha) |  |
| 1:13.8 |  |  | vuelve el sonido |
| 1:14.4 |  | **recorre** — la cámara empieza a recorrer la línea (arranca y frena despacio) |  |
| 1:14.4 |  | _cámara: recorre la línea de tiempo hacia la derecha, de enero a mayo (arranca y frena despacio)_ (entre la muerte y el libro hay meses: el espectador los atraviesa; antes, la cruz y la fecha con su tiempo (DIRECCION_DE_VIDEO §2.8)) |  |
| 1:17.5 | El libro salió en mayo. |  |  |
| 1:18.0 |  | **mayo** — llega al último evento: se enciende |  |
| 1:19.4 |  | **final** — la cámara se abre y se ve el camino entero (aquí entra la música) |  |
| 1:19.4 |  |  | música s01-entrada.mp3 (nivel 0.3) |
| 1:19.4 |  | _cámara: se abre hasta ver el camino entero_ («ese hombre» y «lo que encontró» son las dos puntas de la línea) |  |
| 1:20.8 | Estos videos son sobre ese hombre, y sobre lo que encontró. |  |  |
| 1:22.4 |  | **hombre** — pulso en el primer evento |  |
| 1:24.0 |  | **encontro** — el último evento brilla más |  |

## s02 · personaje — `Presentacion` · 1:27.1–2:00.2 (33.1 s)

- **Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos
- **Intención:** página → piscina → página: el agua llega con «nadador» y se vuelve a secar en renglones con «archivos»; Cueto, que va a cerrar el arco, se presenta con su ficha
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 9.4 datos/min
- **Métricas:** voz el 73 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 60 palabras · 113 por minuto · 6 frases de 10.0 palabras en promedio (la más larga: 23) · 3 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:27.1 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 1:27.1 |  |  | ambiente cuarto (0.5) |
| 1:27.4 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 1:27.7 |  | **nombre** — entra el nombre, letra por letra |  |
| 1:30.1 | Nació en Lima, en mil novecientos cincuenta y seis. |  |  |
| 1:30.1 |  | **lugar** — (con lugar) aparece el país y la cámara se acerca a la ciudad (2,5 s); su ficha |  |
| 1:35.0 | De chico fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. |  |  |
| 1:35.7 |  | **piscina** — (piscina) el agua cubre la página: aparece la piscina (sin este beat, la piscina está desde el comienzo) |  |
| 1:35.7 |  |  | se va el ambiente cuarto |
| 1:35.7 |  |  | ambiente agua (0.8) |
| 1:42.6 |  | **ficha** — (con ficha) se escribe la ficha |  |
| 1:42.6 | Marcos Cueto, historiador y amigo suyo desde los quince años, cuenta que esa disciplina de la piscina la llevó después a los archivos. |  |  |
| 1:47.7 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:50.7 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:50.7 |  |  | se va el ambiente agua |
| 1:50.7 |  |  | ambiente cuarto (0.5) |
| 1:52.4 | Y lo resume en una sola palabra: |  |  |
| 1:55.6 | inagotable. |  |  |
| 1:55.7 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |

## s03 · su generación — `TiempoLargo` · 2:00.2–2:48.0 (47.9 s)

- **Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación: ¿el país cambia o se repite?
- **Intención:** los afiches gritan cambio; con «¿o repetía lo de siempre?», el afiche nuevo se despega y debajo asoma uno viejo, igual de prometedor; la pregunta queda en el aire
- **Intensidad:** 3 · **Música:** presente → en suspenso
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 75 % del tiempo · tramo más largo sin pausa de párrafo: 10.8 s · 87 palabras · 111 por minuto · 11 frases de 7.9 palabras en promedio (la más larga: 19) · 4 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (4):** Universidad Católica · Perú · Velasco · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:00.2 |  |  | música s03-epoca.mp3 (nivel 0.24) |
| 2:00.2 |  |  | ambiente ciudad (0.6) |
| 2:00.5 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 2:04.5 |  | **sello** — cae el sello sobre la lista |  |
| 2:05.9 |  | **primeros** — se marcan los primeros puestos |  |
| 2:09.7 |  | **afiches** — aparece el muro |  |
| 2:09.7 | El Perú vive el gobierno militar de Velasco. |  |  |
| 2:12.9 | Reforma agraria. |  |  |
| 2:12.9 |  | **afiche1** — se pega el primer afiche |  |
| 2:14.7 | Nacionalizaciones. |  |  |
| 2:14.7 |  | **afiche2** — se pega el segundo |  |
| 2:16.6 | Un discurso que promete enterrar el pasado oligárquico. |  |  |
| 2:16.6 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 2:22.0 | Quiroz no apoyó al régimen. |  |  |
| 2:22.2 |  | **volante** — entra el volante |  |
| 2:24.8 |  | **leer** — (opcional) la cámara se acerca al volante para leerlo |  |
| 2:24.8 |  | _cámara: se acerca al volante hasta poder leerlo_ («Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza»: el volante dice eso, con la cita de Cueto; se lee) |  |
| 2:24.8 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 2:31.0 | Para un estudiante de esa época, la historia no era un curso más. |  |  |
| 2:31.0 |  | **vuelve** — (con leer) la cámara vuelve a ver el muro entero |  |
| 2:31.0 |  | _cámara: vuelve a ver el muro entero_ («Para un estudiante de esa época…»: de él a su generación) |  |
| 2:35.9 | Era la manera de responder una pregunta. |  |  |
| 2:39.5 | ¿El país estaba cambiando de verdad? |  |  |
| 2:42.3 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 2:42.3 | ¿O repetía lo de siempre? |  |  |

## s04 · larga duración — `TiempoLargo` · 2:48.0–3:54.6 (66.6 s)

- **Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad
- **Intención:** la clase: Braudel en la pizarra; las capas se dibujan con tiza y brilla solo la que se nombra; la palabra del episodio; la nota y el remate escritos con peso
- **Intensidad:** 3 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 71 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 115 palabras · 105 por minuto · 13 frases de 8.8 palabras en promedio (la más larga: 21) · 8 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (2):** Franklin Pease · Fernand Braudel

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:48.0 |  |  | música s04-capas.mp3 (nivel 0.24) |
| 2:48.0 |  |  | ambiente cuarto (0.5) |
| 2:48.3 | Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. |  |  |
| 2:50.2 |  | **clase** — (pizarra, con encabezado) se escribe el encabezado de la clase |  |
| 2:53.5 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:57.6 |  | **capas** — el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío) |  |
| 2:57.6 | Braudel decía que la historia no corre a una sola velocidad. |  |  |
| 3:02.6 | Arriba están los acontecimientos: los gobiernos, las guerras, las noticias. |  |  |
| 3:02.6 |  | **capa1** — (capas de a una) se llena la capa de arriba |  |
| 3:08.9 | Cambian rápido, como las olas. |  |  |
| 3:12.8 | Más abajo, la economía y la sociedad. |  |  |
| 3:12.8 |  | **capa2** — (capas de a una) se llena la del medio |  |
| 3:16.6 | Cambian despacio. |  |  |
| 3:19.3 | Y al fondo, la relación del hombre con su medio: la tierra, el clima. |  |  |
| 3:19.3 |  | **capa3** — (capas de a una) se llena la de abajo |  |
| 3:25.5 | Casi no se mueve. |  |  |
| 3:27.0 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 3:28.8 | A esa historia lenta la llamó larga duración. |  |  |
| 3:31.0 |  | **palabra** — (con palabra) la palabra del episodio, a pantalla completa |  |
| 3:34.5 | Quiroz se quedó con eso. |  |  |
| 3:34.5 |  | **subir** — (opcional) la cámara vuelve a ver las tres capas; se va la palabra |  |
| 3:36.4 | Aprendió a apreciar lo que persiste: las estructuras de la economía. |  |  |
| 3:39.1 |  | **realce** — (con realce) se enciende una capa (en la pizarra, se escribe la nota) |  |
| 3:42.3 | Hay cosas que no cambian aunque cambien los gobiernos. |  |  |
| 3:42.4 |  | **remate** — (con remate) se escribe la frase que cierra el bloque |  |
| 3:47.6 | Esa mirada larga es la de esta serie. |  |  |

## s05 · método — `AprenderAMedir` · 3:54.6–5:44.4 (109.7 s)

- **Cambio:** de un historiador de discursos a uno que mide, y que cambió de ideas
- **Intención:** el viaje a Nueva York; la regresión explicada en tres tiempos (ruido, la recta que busca, cuánto pesa); la claridad en una balanza; la carrera se lee en el estante, no se narra
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 78 % del tiempo · tramo más largo sin pausa de párrafo: 15.4 s · 209 palabras · 115 por minuto · 21 frases de 10.0 palabras en promedio (la más larga: 18) · 9 pausa(s) de párrafo (≥ 1 s) · 29 cambios de imagen
- **Nombres y cifras que se dicen (9):** París · Braudel · Nueva York · Universidad de Columbia · Herbert Klein · Perú · Kenneth Maxwell · Cueto · ochenta

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:54.6 |  |  | música s05-medir.mp3 (nivel 0.3) |
| 3:54.6 |  |  | ambiente ciudad (0.55) |
| 3:54.8 |  | **mapa** — aparece el mapa |  |
| 3:54.9 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:58.6 | Buena parte de los historiadores peruanos miraba a París. |  |  |
| 3:59.0 |  | **paris** — sale la ruta hacia la tentación |  |
| 4:03.0 | Era la ciudad de Braudel, el de la larga duración. |  |  |
| 4:07.4 |  | **paris_notas** — (con tentacion_notas) se escriben los renglones junto a la tentación |  |
| 4:07.4 | Ahí se habían formado sus propios profesores. |  |  |
| 4:10.5 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 4:11.7 | Él se va a Nueva York, a la Universidad de Columbia. |  |  |
| 4:11.7 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 4:11.7 |  | _cámara: La cámara sigue la ruta vectorial de Lima a Nueva York con un acercamiento del 30 %._ (El viaje ocurre con la narración; la ruta se dibuja hasta llegar.) |  |
| 4:15.3 |  | **llega** — la ruta llega: sello y campana |  |
| 4:15.9 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 4:15.9 |  | _cámara: Se abre hasta ver las dos rutas completas._ (Comparar el destino elegido con la alternativa de París.) |  |
| 4:17.5 | Allí, el historiador Herbert Klein se fija en él y le ofrece una beca. |  |  |
| 4:17.5 |  | **ficha** — se escribe la ficha |  |
| 4:22.7 | Y aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. |  |  |
| 4:23.9 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 4:27.9 |  | **discursos** — los bloques de discurso se apagan |  |
| 4:30.2 | Una de sus herramientas se llama regresión. |  |  |
| 4:32.1 |  | **regresion** — (con rotulo_grafico) aparece el rótulo del gráfico |  |
| 4:33.2 | Imagina muchos puntos desordenados: cada uno, un dato. |  |  |
| 4:33.2 |  | **caen** — (con explicar_regresion) caen los puntos (el papel ya estaba) |  |
| 4:36.3 |  | **observacion** — (beat propio) |  |
| 4:38.3 | A simple vista, solo ruido. |  |  |
| 4:41.6 | La regresión busca la línea que mejor pasa entre todos. |  |  |
| 4:41.9 |  | **recta** — se traza la recta de regresión |  |
| 4:43.7 |  | **residuos** — (beat propio) |  |
| 4:46.2 | Si hay una tendencia, ayuda a verla. |  |  |
| 4:47.1 |  | **tendencia** — (beat propio) |  |
| 4:49.7 | Y dice cuánto pesa. |  |  |
| 4:50.8 |  | **pendiente** — (con explicar_regresion) se marca la pendiente: cuánto pesa |  |
| 4:53.2 | Aprendió a trabajar con cifras y a contrastarlas con documentos. |  |  |
| 4:53.2 |  | **causalidad** — (beat propio) |  |
| 4:57.9 | Años después, llevaría esa disciplina al estudio de la corrupción en el Perú. |  |  |
| 4:58.0 |  | **serie** — (con serie) la nube se va, los puntos viajan a la serie real y se encienden de a uno; después, la banda |  |
| 5:05.4 | De otro profesor, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. |  |  |
| 5:05.5 |  | **balanza** — aparece la balanza |  |
| 5:10.3 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 5:11.6 |  | **claridad** — cae la segunda (se equilibra) |  |
| 5:14.3 | Con los años se vuelve, en palabras de Cueto, la máxima autoridad en la historia financiera del Perú. |  |  |
| 5:14.3 |  | **estante** — aparece la repisa |  |
| 5:17.4 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 5:22.5 | Y sus ideas también se mueven. |  |  |
| 5:22.5 |  | **brujula** — aparece la brújula |  |
| 5:24.9 | De aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades. |  |  |
| 5:24.9 |  | **izquierda** — (izquierda-derecha) la aguja va al primer tope; se escriben sus notas |  |
| 5:26.7 |  | **giro** — la aguja gira despacio de una época a la otra (izquierda-derecha: va al otro tope) |  |
| 5:34.3 | Cambió de ideas. |  |  |
| 5:34.3 |  | **tiza** — (con brujula_frase) la brújula y su fondo pasan a la pizarra; los rótulos se borran |  |
| 5:35.9 | Sus cálculos eran provisionales: él mismo los dejó abiertos a revisión. |  |  |
| 5:38.3 |  | **frase** — (con brujula_frase) se escribe la frase con tiza |  |

## s06 · puente — `MecanismoDeuda` · 5:44.4–6:19.9 (35.5 s)

- **Cambio:** del hombre que aprendió a medir a su primer caso: una deuda pagada con la plata del guano, y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio
- **Intensidad:** 5 · **Música:** presente (tensión) → en suspenso
- **Semáforo para enseñar:** 🟡 7.1 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 9.8 s · 76 palabras · 134 por minuto · 6 frases de 12.7 palabras en promedio (la más larga: 24) · 4 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (4):** Félix Denegri Luna · Lima · Estado · 1850

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:44.4 |  |  | música s06-puente.mp3 (nivel 0.38) |
| 5:44.4 |  |  | ambiente mar (0.7) |
| 5:44.6 |  | **islas** — el grabado de las islas |  |
| 5:44.7 | Pero su primer caso lo había encontrado antes de irse. |  |  |
| 5:44.7 |  | **hoja_entra** — (con hojear) entra el libro, cerrado |  |
| 5:49.4 | Félix Denegri Luna, un estudioso de la historia, dueño de una gran biblioteca en Lima, le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 5:49.4 |  | **hojea** — (con hojear) se abre y se hojea |  |
| 5:57.8 |  | **hoja_pagina** — (con hojear) cae la última hoja: la página con el grabado |  |
| 5:58.3 |  | **hoja_zoom** — (con hojear) la cámara entra al grabado hasta llenar la pantalla |  |
| 5:58.3 |  | _cámara: entra a la ilustración de la página hasta llenar la pantalla_ («el siglo diecinueve»: del libro al grabado de las islas, sin bucle (DIRECCION_DE_VIDEO §2.12)) |  |
| 6:00.6 |  | **sacos** — empiezan a subir sacos al barco |  |
| 6:00.6 | Ahí estaba el guano. |  |  |
| 6:02.3 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 6:02.3 |  |  | se va el ambiente mar |
| 6:02.3 |  |  | ambiente cuarto (0.5) |
| 6:02.3 |  | _cámara: sigue al barco: se acerca y lo lleva a la izquierda mientras aparece el Estado a la derecha_ («Y una deuda que el Estado decidió pagar con esa plata»: del guano al Estado sin corte (revisión del director: el salto era brusco)) |  |
| 6:02.5 | Y una deuda que el Estado decidió pagar con esa plata, en mil ochocientos cincuenta. |  |  |
| 6:05.4 |  | **vales** — se apilan los vales de la deuda |  |
| 6:05.4 |  | _cámara: paneo a la izquierda siguiendo la flecha de la plata, del Estado a los vales_ («una deuda que el Estado decidió pagar con esa plata»: la plata va a los vales; paneo antes que corte (§2.11)) |  |
| 6:07.3 |  | **consolidacion** — cae el sello sobre la pila |  |
| 6:09.3 | Y encontró que se había inflado el valor de la deuda para enriquecerse a costa del Estado. |  |  |
| 6:09.3 |  | **hallazgo** — (opcional) sobre la pila de vales, el monto del vale de arriba se infla (ejemplo ilustrativo) |  |
| 6:16.4 | ¿Adónde fue a parar esa plata? |  |  |
| 6:16.4 |  | **pregunta** — (con pregunta) la pregunta se escribe fuerte |  |

## s07 · cierre — `Cierre` · 6:19.9–6:37.1 (17.2 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** las pruebas de imprenta del comienzo se cierran; el tema entra unos segundos antes y se queda después, para que la tristeza se asiente (DIRECCION_DE_VIDEO §2.15)
- **Intensidad:** 1 · **Música:** protagonista (el tema del canal entra antes del negro y se queda ~5 s más sobre la tarjeta)
- **Semáforo para enseñar:** 🟡 9.7 datos/min
- **Métricas:** voz el 20 % del tiempo · tramo más largo sin pausa de párrafo: 3.4 s · 5 palabras · 48 por minuto · 1 frases de 5.0 palabras en promedio (la más larga: 5) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 6:19.9 |  |  | música s07-tema.mp3 (nivel 0.55) |
| 6:19.9 |  |  | ambiente cuarto (0.5) |
| 6:20.2 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 6:22.2 |  | **negro** — fundido a negro |  |
| 6:22.2 |  |  | se va el ambiente cuarto |
| 6:22.7 | Próximo episodio: La deuda defraudada. |  |  |
| 6:22.7 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |
| 6:22.7 |  | _cámara: se acerca muy despacio a la tarjeta del próximo episodio (5 % en 13 s)_ (la música se queda sobre el final (revisión del director): el plano respira mientras se asienta la tristeza, sin congelarse) |  |

