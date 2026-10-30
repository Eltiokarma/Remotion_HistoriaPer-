# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s00 | Marcador | 0:00.0 | 4 s | 0 % | 0 s | 0 | — | 0 | 0 | 0 (0.0/min) | 0 (0.0/min) | 🟢 |
| s01 | PruebasDeImprenta | 0:04.0 | 52 s | 62 % | 10 s | 107 | 8.8 | 16 | 6 | 2 (2.4/min) | 13 (15.8/min) | 🟢 |
| s02 | Presentacion | 0:55.9 | 33 s | 73 % | 9 s | 113 | 10.0 | 23 | 3 | 5 (9.4/min) | 7 (13.1/min) | 🟡 9.4 datos/min |
| s03 | TiempoLargo | 1:28.9 | 48 s | 75 % | 11 s | 111 | 7.9 | 19 | 4 | 4 (5.1/min) | 8 (10.3/min) | 🟢 |
| s04 | TiempoLargo | 2:16.8 | 67 s | 71 % | 9 s | 105 | 8.8 | 21 | 8 | 2 (1.8/min) | 10 (9.2/min) | 🟢 |
| s05 | AprenderAMedir | 3:23.4 | 97 s | 77 % | 11 s | 119 | 10.6 | 18 | 9 | 8 (5.0/min) | 23 (14.4/min) | 🟢 |
| s06 | MecanismoDeuda | 5:00.4 | 29 s | 78 % | 10 s | 130 | 11.8 | 24 | 3 | 4 (8.8/min) | 10 (22.1/min) | 🟡 8.8 datos/min |
| s07 | Cierre | 5:29.1 | 17 s | 20 % | 3 s | 48 | 5.0 | 5 | 0 | 1 (9.7/min) | 3 (29.0/min) | 🟡 9.7 datos/min |

Total: 5:46.4. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s00 · gancho — `Marcador` · 0:00.0–0:04.0 (4.0 s)

- **Cambio:** (por definir) del golpe —lo que encontró y lo que le costó al Perú— a la historia del hombre
- **Intención:** marcador visible: el director decide el gancho (DIRECCION_DE_VIDEO §2.5); la propuesta está en revision_quiroz_ep01.md
- **Intensidad:** 2 · **Música:** ausente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 0 % del tiempo · tramo más largo sin pausa de párrafo: 0.0 s · 0 palabras · 0 por minuto · 0 frases de — palabras en promedio (la más larga: 0) · 0 pausa(s) de párrafo (≥ 1 s) · 0 cambios de imagen

| t | Voz | Imagen | Sonido |
|---|---|---|---|

## s01 · gancho — `PruebasDeImprenta` · 0:04.0–0:55.9 (51.9 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: los meses entre una y otro se recorren con la cámara, del punto oscuro a la luz; la muerte no es un dato más: cruz sobre negro, la frase entera, la fecha, y recién después el punto rojo
- **Intensidad:** 3 · **Música:** ausente → entra al final
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 62 % del tiempo · tramo más largo sin pausa de párrafo: 10.1 s · 88 palabras · 107 por minuto · 10 frases de 8.8 palabras en promedio (la más larga: 16) · 6 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (2):** Nueva York · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:04.0 |  |  | ambiente cuarto (0.6) |
| 0:04.3 | Nueva York. |  |  |
| 0:04.4 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:05.7 | Un historiador peruano revisa, con minuciosidad, las pruebas de imprenta. |  |  |
| 0:07.4 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:11.4 | Es la traducción al español de su último libro. |  |  |
| 0:15.9 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:20.8 | En los agradecimientos escribe una línea que casi nadie lee. |  |  |
| 0:21.0 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:21.0 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:24.9 | Les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:27.3 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:32.1 | Unas líneas más abajo celebra el nacimiento de su hijo. |  |  |
| 0:32.6 |  | **abajo** — la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase) |  |
| 0:32.6 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» celebra el nacimiento de su hijo) |  |
| 0:37.9 | Murió en enero de dos mil trece. |  |  |
| 0:37.9 |  | **muerte** — corte seco a la línea de tiempo: aparece el primer evento (con `cruz`: la cruz sobre negro) |  |
| 0:40.3 |  | **fecha** — (con cruz) aparece la fecha, cuando la voz ya terminó la frase |  |
| 0:40.3 |  |  | **silencio deliberado** |
| 0:42.8 |  | **linea** — (con cruz) aparece la línea con su punto rojo (2–3 s después de la fecha) |  |
| 0:42.8 |  |  | vuelve el sonido |
| 0:43.4 |  | **recorre** — la cámara empieza a recorrer la línea (arranca y frena despacio) |  |
| 0:43.4 |  | _cámara: recorre la línea de tiempo hacia la derecha, de enero a mayo (arranca y frena despacio)_ (entre la muerte y el libro hay meses: el espectador los atraviesa; antes, la cruz y la fecha con su tiempo (DIRECCION_DE_VIDEO §2.8)) |  |
| 0:46.6 | El libro salió en mayo. |  |  |
| 0:47.0 |  | **mayo** — llega al último evento: se enciende |  |
| 0:48.4 |  | **final** — la cámara se abre y se ve el camino entero (aquí entra la música) |  |
| 0:48.4 |  |  | música s01-entrada.mp3 (nivel 0.3) |
| 0:48.4 |  | _cámara: se abre hasta ver el camino entero_ («ese hombre» y «lo que encontró» son las dos puntas de la línea) |  |
| 0:49.9 | Este video es sobre ese hombre, y sobre lo que encontró. |  |  |
| 0:51.3 |  | **hombre** — pulso en el primer evento |  |
| 0:52.7 |  | **encontro** — el último evento brilla más |  |

## s02 · personaje — `Presentacion` · 0:55.9–1:28.9 (33.1 s)

- **Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos
- **Intención:** página → piscina → página: el agua llega con «nadador» y se vuelve a secar en renglones con «archivos»; Cueto, que va a cerrar el arco, se presenta con su ficha
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 9.4 datos/min
- **Métricas:** voz el 73 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 60 palabras · 113 por minuto · 6 frases de 10.0 palabras en promedio (la más larga: 23) · 3 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:55.9 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 0:55.9 |  |  | ambiente cuarto (0.5) |
| 0:56.2 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 0:56.5 |  | **nombre** — entra el nombre, letra por letra |  |
| 0:58.9 | Nació en Lima, en mil novecientos cincuenta y seis. |  |  |
| 0:58.9 |  | **lugar** — (con lugar) aparece el país y la cámara se acerca a la ciudad (2,5 s); su ficha |  |
| 1:03.7 | De chico fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. |  |  |
| 1:04.5 |  | **piscina** — (piscina) el agua cubre la página: aparece la piscina (sin este beat, la piscina está desde el comienzo) |  |
| 1:04.5 |  |  | se va el ambiente cuarto |
| 1:04.5 |  |  | ambiente agua (0.8) |
| 1:11.4 |  | **ficha** — (con ficha) se escribe la ficha |  |
| 1:11.4 | Marcos Cueto, historiador y amigo suyo desde los quince años, cuenta que esa disciplina de la piscina la llevó después a los archivos. |  |  |
| 1:16.5 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:19.5 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:19.5 |  |  | se va el ambiente agua |
| 1:19.5 |  |  | ambiente cuarto (0.5) |
| 1:21.2 | Y lo resume en una sola palabra: |  |  |
| 1:24.4 | inagotable. |  |  |
| 1:24.4 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |

## s03 · su generación — `TiempoLargo` · 1:28.9–2:16.8 (47.9 s)

- **Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación: ¿el país cambia o se repite?
- **Intención:** los afiches gritan cambio; con «¿o repetía lo de siempre?», el afiche nuevo se despega y debajo asoma uno viejo, igual de prometedor; la pregunta queda en el aire
- **Intensidad:** 3 · **Música:** presente → en suspenso
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 75 % del tiempo · tramo más largo sin pausa de párrafo: 10.8 s · 87 palabras · 111 por minuto · 11 frases de 7.9 palabras en promedio (la más larga: 19) · 4 pausa(s) de párrafo (≥ 1 s) · 8 cambios de imagen
- **Nombres y cifras que se dicen (4):** Universidad Católica · Perú · Velasco · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:28.9 |  |  | música s03-epoca.mp3 (nivel 0.24) |
| 1:28.9 |  |  | ambiente ciudad (0.6) |
| 1:29.2 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:33.2 |  | **sello** — cae el sello sobre la lista |  |
| 1:34.6 |  | **primeros** — se marcan los primeros puestos |  |
| 1:38.4 |  | **afiches** — aparece el muro |  |
| 1:38.4 | El Perú vive el gobierno militar de Velasco. |  |  |
| 1:41.7 | Reforma agraria. |  |  |
| 1:41.7 |  | **afiche1** — se pega el primer afiche |  |
| 1:43.5 | Nacionalizaciones. |  |  |
| 1:43.5 |  | **afiche2** — se pega el segundo |  |
| 1:45.3 | Un discurso que promete enterrar el pasado oligárquico. |  |  |
| 1:45.3 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:50.7 | Quiroz no apoyó al régimen. |  |  |
| 1:53.6 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 1:55.8 |  | **volante** — entra el volante |  |
| 1:59.7 | Para un estudiante de esa época, la historia no era un curso más. |  |  |
| 2:04.6 | Era la manera de responder una pregunta. |  |  |
| 2:08.3 | ¿El país estaba cambiando de verdad? |  |  |
| 2:11.1 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 2:11.1 | ¿O repetía lo de siempre? |  |  |

## s04 · larga duración — `TiempoLargo` · 2:16.8–3:23.4 (66.6 s)

- **Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad
- **Intención:** la clase: Braudel en la pizarra; las capas se dibujan con tiza y brilla solo la que se nombra; la palabra del episodio; la nota y el remate escritos con peso
- **Intensidad:** 3 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 71 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 115 palabras · 105 por minuto · 13 frases de 8.8 palabras en promedio (la más larga: 21) · 8 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (2):** Franklin Pease · Fernand Braudel

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:16.8 |  |  | música s04-capas.mp3 (nivel 0.24) |
| 2:16.8 |  |  | ambiente cuarto (0.5) |
| 2:17.1 | Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. |  |  |
| 2:22.3 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:26.4 |  | **capas** — el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío) |  |
| 2:26.4 | Braudel decía que la historia no corre a una sola velocidad. |  |  |
| 2:31.3 | Arriba están los acontecimientos: los gobiernos, las guerras, las noticias. |  |  |
| 2:31.4 |  | **capa1** — (capas de a una) se llena la capa de arriba |  |
| 2:37.6 | Cambian rápido, como las olas. |  |  |
| 2:41.5 | Más abajo, la economía y la sociedad. |  |  |
| 2:41.6 |  | **capa2** — (capas de a una) se llena la del medio |  |
| 2:45.4 | Cambian despacio. |  |  |
| 2:48.1 | Y al fondo, la relación del hombre con su medio: la tierra, el clima. |  |  |
| 2:48.1 |  | **capa3** — (capas de a una) se llena la de abajo |  |
| 2:54.2 | Casi no se mueve. |  |  |
| 2:55.7 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:57.6 | A esa historia lenta la llamó larga duración. |  |  |
| 2:59.7 |  | **palabra** — (con palabra) la palabra del episodio, a pantalla completa |  |
| 3:03.3 | Quiroz se quedó con eso. |  |  |
| 3:03.3 |  | **subir** — (opcional) la cámara vuelve a ver las tres capas; se va la palabra |  |
| 3:05.2 | Aprendió a apreciar lo que persiste: las estructuras de la economía. |  |  |
| 3:07.8 |  | **realce** — (con realce) se enciende una capa (en la pizarra, se escribe la nota) |  |
| 3:11.1 | Hay cosas que no cambian aunque cambien los gobiernos. |  |  |
| 3:11.1 |  | **remate** — (con remate) se escribe la frase que cierra el bloque |  |
| 3:16.4 | Esa mirada larga es la de esta serie. |  |  |

## s05 · método — `AprenderAMedir` · 3:23.4–5:00.4 (97.0 s)

- **Cambio:** de un historiador de discursos a uno que mide, y que cambió de ideas
- **Intención:** el viaje a Nueva York; la regresión explicada en tres tiempos (ruido, la recta que busca, cuánto pesa); la claridad en una balanza; la carrera se lee en el estante, no se narra
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 77 % del tiempo · tramo más largo sin pausa de párrafo: 11.3 s · 190 palabras · 119 por minuto · 18 frases de 10.6 palabras en promedio (la más larga: 18) · 9 pausa(s) de párrafo (≥ 1 s) · 23 cambios de imagen
- **Nombres y cifras que se dicen (8):** París · Nueva York · Universidad de Columbia · Herbert Klein · Perú · Kenneth Maxwell · Cueto · ochenta

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:23.4 |  |  | música s05-medir.mp3 (nivel 0.3) |
| 3:23.4 |  |  | ambiente ciudad (0.55) |
| 3:23.6 |  | **mapa** — aparece el mapa |  |
| 3:23.7 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:27.4 | Buena parte de los historiadores peruanos miraba a París. |  |  |
| 3:27.8 |  | **paris** — sale la ruta hacia la tentación |  |
| 3:30.6 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 3:32.1 | Él se va a Nueva York, a la Universidad de Columbia. |  |  |
| 3:32.1 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 3:32.1 |  | _cámara: retrocede apenas y se lanza a Lima; sigue la ruta hacia el norte, con aire delante, y frena en Nueva York_ («Él se va a Nueva York, a la Universidad de Columbia»: el espectador hace el viaje) |  |
| 3:35.7 |  | **llega** — la ruta llega: sello y campana |  |
| 3:36.3 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 3:36.3 |  | _cámara: se abre hasta ver la ruta entera (y París, que quedó atrás); se pasa un poco y se asienta_ (llegó: el viaje queda como mapa antes de la beca) |  |
| 3:37.9 |  | **ficha** — se escribe la ficha |  |
| 3:37.9 | Allí, el historiador Herbert Klein se fija en él y le ofrece una beca. |  |  |
| 3:43.2 | Y aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. |  |  |
| 3:44.4 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 3:48.4 |  | **discursos** — los bloques de discurso se apagan |  |
| 3:50.6 | Una de sus herramientas se llama regresión. |  |  |
| 3:52.6 |  | **regresion** — (con rotulo_grafico) aparece el rótulo del gráfico |  |
| 3:53.7 | Imagina muchos puntos desordenados: cada uno, un dato. |  |  |
| 3:53.7 |  | **caen** — (con explicar_regresion) caen los puntos (el papel ya estaba) |  |
| 3:58.9 | A simple vista, solo ruido. |  |  |
| 4:02.3 | La regresión busca la línea que mejor pasa entre todos. |  |  |
| 4:02.5 |  | **recta** — se traza la recta de regresión |  |
| 4:06.8 | Si hay una tendencia escondida, la muestra. |  |  |
| 4:10.3 | Y dice cuánto pesa. |  |  |
| 4:11.3 |  | **pendiente** — (con explicar_regresion) se marca la pendiente: cuánto pesa |  |
| 4:13.7 | Con lo que aprendió ahí, años después, le va a sacar la cuenta al Perú. |  |  |
| 4:20.9 | De otro profesor, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. |  |  |
| 4:21.0 |  | **balanza** — aparece la balanza |  |
| 4:25.8 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 4:27.1 |  | **claridad** — cae la segunda (se equilibra) |  |
| 4:29.8 | Con los años se vuelve, en palabras de Cueto, la máxima autoridad en la historia financiera del Perú. |  |  |
| 4:29.8 |  | **estante** — aparece la repisa |  |
| 4:32.9 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 4:37.9 | Y sus ideas también se mueven. |  |  |
| 4:37.9 |  | **brujula** — aparece la brújula |  |
| 4:40.3 |  | **izquierda** — (izquierda-derecha) la aguja va al primer tope; se escriben sus notas |  |
| 4:40.3 | De aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades. |  |  |
| 4:42.1 |  | **giro** — la aguja gira despacio de una época a la otra (izquierda-derecha: va al otro tope) |  |
| 4:49.8 | Cambió de ideas. |  |  |
| 4:49.8 |  | **tiza** — (con brujula_frase) la brújula y su fondo pasan a la pizarra; los rótulos se borran |  |
| 4:51.5 | Y eso importa para lo que viene: la cuenta que sacó no es la de un partido. |  |  |
| 4:53.8 |  | **frase** — (con brujula_frase) se escribe la frase con tiza |  |

## s06 · puente — `MecanismoDeuda` · 5:00.4–5:29.1 (28.7 s)

- **Cambio:** del hombre que aprendió a medir a su primer caso: una deuda pagada con la plata del guano, y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio
- **Intensidad:** 5 · **Música:** presente (tensión) → en suspenso
- **Semáforo para enseñar:** 🟡 8.8 datos/min
- **Métricas:** voz el 78 % del tiempo · tramo más largo sin pausa de párrafo: 9.9 s · 59 palabras · 130 por minuto · 5 frases de 11.8 palabras en promedio (la más larga: 24) · 3 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (4):** Félix Denegri Luna · Lima · Estado · 1850

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:00.4 |  |  | música s06-puente.mp3 (nivel 0.38) |
| 5:00.4 |  |  | ambiente mar (0.7) |
| 5:00.6 |  | **islas** — el grabado de las islas |  |
| 5:00.7 | Pero su primer caso lo había encontrado antes de irse. |  |  |
| 5:00.7 |  | **hoja_entra** — (con hojear) entra el libro, cerrado |  |
| 5:05.3 | Félix Denegri Luna, un estudioso de la historia, dueño de una gran biblioteca en Lima, le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 5:05.3 |  | **hojea** — (con hojear) se abre y se hojea |  |
| 5:13.7 |  | **hoja_pagina** — (con hojear) cae la última hoja: la página con el grabado |  |
| 5:14.2 |  | **hoja_zoom** — (con hojear) la cámara entra al grabado hasta llenar la pantalla |  |
| 5:14.2 |  | _cámara: entra a la ilustración de la página hasta llenar la pantalla_ («el siglo diecinueve»: del libro al grabado de las islas, sin bucle (DIRECCION_DE_VIDEO §2.12)) |  |
| 5:16.6 |  | **sacos** — empiezan a subir sacos al barco |  |
| 5:16.6 | Ahí estaba el guano. |  |  |
| 5:18.3 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 5:18.3 |  |  | se va el ambiente mar |
| 5:18.3 |  |  | ambiente cuarto (0.5) |
| 5:18.5 | Y una deuda que el Estado decidió pagar con esa plata, en mil ochocientos cincuenta. |  |  |
| 5:21.4 |  | **vales** — se apilan los vales de la deuda |  |
| 5:21.4 |  | _cámara: paneo a la izquierda siguiendo la flecha de la plata, del Estado a los vales_ («una deuda que el Estado decidió pagar con esa plata»: la plata va a los vales; paneo antes que corte (§2.11)) |  |
| 5:23.3 |  | **consolidacion** — cae el sello sobre la pila |  |
| 5:25.7 | ¿Adónde fue a parar esa plata? |  |  |
| 5:25.7 |  | **pregunta** — (con pregunta) la pregunta se escribe fuerte |  |

## s07 · cierre — `Cierre` · 5:29.1–5:46.4 (17.2 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** las pruebas de imprenta del comienzo se cierran; el tema entra unos segundos antes y se queda después, para que la tristeza se asiente (DIRECCION_DE_VIDEO §2.15)
- **Intensidad:** 1 · **Música:** protagonista (el tema del canal entra antes del negro y se queda ~5 s más sobre la tarjeta)
- **Semáforo para enseñar:** 🟡 9.7 datos/min
- **Métricas:** voz el 20 % del tiempo · tramo más largo sin pausa de párrafo: 3.4 s · 5 palabras · 48 por minuto · 1 frases de 5.0 palabras en promedio (la más larga: 5) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:29.1 |  |  | música s07-tema.mp3 (nivel 0.55) |
| 5:29.1 |  |  | ambiente cuarto (0.5) |
| 5:29.4 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 5:31.4 |  | **negro** — fundido a negro |  |
| 5:31.4 |  |  | se va el ambiente cuarto |
| 5:31.9 | Próximo episodio: La deuda defraudada. |  |  |
| 5:31.9 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |

