# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s01 | PruebasDeImprenta | 0:00.0 | 52 s | 69 % | 10 s | 116 | 9.5 | 17 | 6 | 3 (3.7/min) | 11 (13.5/min) | 🟢 |
| s02 | Presentacion | 0:51.6 | 33 s | 73 % | 9 s | 113 | 10.0 | 23 | 3 | 5 (9.4/min) | 6 (11.3/min) | 🟡 9.4 datos/min |
| s03 | TiempoLargo | 1:24.7 | 48 s | 75 % | 11 s | 111 | 7.9 | 19 | 4 | 4 (5.1/min) | 8 (10.3/min) | 🟢 |
| s04 | TiempoLargo | 2:12.5 | 67 s | 71 % | 9 s | 105 | 8.8 | 21 | 8 | 2 (1.8/min) | 9 (8.2/min) | 🟢 |
| s05 | AprenderAMedir | 3:19.1 | 97 s | 77 % | 11 s | 119 | 10.6 | 18 | 9 | 8 (5.0/min) | 19 (11.9/min) | 🟢 |
| s06 | MecanismoDeuda | 4:56.1 | 29 s | 78 % | 10 s | 130 | 11.8 | 24 | 3 | 4 (8.8/min) | 5 (11.0/min) | 🟡 8.8 datos/min |
| s07 | Cierre | 5:24.9 | 12 s | 28 % | 3 s | 48 | 5.0 | 5 | 0 | 1 (9.7/min) | 3 (29.0/min) | 🟡 9.7 datos/min |

Total: 5:37.1. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s01 · gancho — `PruebasDeImprenta` · 0:00.0–0:51.6 (51.6 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: los meses entre una y otro se recorren con la cámara, del punto oscuro a la luz
- **Intensidad:** 3 · **Música:** ausente → entra al final
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 69 % del tiempo · tramo más largo sin pausa de párrafo: 10.3 s · 95 palabras · 116 por minuto · 10 frases de 9.5 palabras en promedio (la más larga: 17) · 6 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (3):** Nueva York · Alfonsito · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | ambiente cuarto (0.6) |
| 0:00.3 | Nueva York. |  |  |
| 0:00.4 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:01.7 | Un historiador peruano revisa, con minuciosidad, las pruebas de imprenta. |  |  |
| 0:03.4 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:07.4 | Es la traducción al español de su último libro. |  |  |
| 0:12.1 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:17.0 | En los agradecimientos escribe una línea que casi nadie lee. |  |  |
| 0:17.0 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:17.0 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:21.1 | Les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:23.5 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:28.4 | Unas líneas más abajo celebra la reciente llegada a este mundo de nuestro precioso Alfonsito: su hijo. |  |  |
| 0:28.4 |  | **abajo** — la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase) |  |
| 0:28.4 |  | _cámara: baja por la página hasta la línea de Alfonsito; el foco pasa de una frase a la otra_ («unas líneas más abajo» celebra la llegada de su hijo) |  |
| 0:37.2 | Murió en enero de dos mil trece. |  |  |
| 0:37.2 |  | **muerte** — corte seco a la línea de tiempo: aparece el primer evento |  |
| 0:39.6 |  | **recorre** — la cámara empieza a recorrer la línea (arranca y frena despacio) |  |
| 0:39.6 |  | _cámara: recorre la línea de tiempo hacia la derecha, de enero a mayo (arranca y frena despacio)_ (entre la muerte y el libro hay meses: el espectador los atraviesa, no los salta) |  |
| 0:42.1 | El libro salió en mayo. |  |  |
| 0:43.3 |  | **mayo** — llega al último evento: se enciende |  |
| 0:45.4 | Este video es sobre ese hombre, y sobre lo que encontró. |  |  |
| 0:45.4 |  | **final** — la cámara se abre y se ve el camino entero (aquí entra la música) |  |
| 0:45.4 |  |  | música s01-entrada.mp3 (nivel 0.3) |
| 0:45.4 |  | _cámara: se abre hasta ver el camino entero_ («ese hombre» y «lo que encontró» son las dos puntas de la línea) |  |
| 0:47.0 |  | **hombre** — pulso en el primer evento |  |
| 0:48.4 |  | **encontro** — el último evento brilla más |  |

## s02 · personaje — `Presentacion` · 0:51.6–1:24.7 (33.1 s)

- **Cambio:** de un nombre en una página a un nadador terco que llevó su disciplina a los archivos
- **Intención:** página → piscina → página: el agua llega con «nadador» y se vuelve a secar en renglones con «archivos»; Cueto, que va a cerrar el arco, se presenta con su ficha
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 9.4 datos/min
- **Métricas:** voz el 73 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 60 palabras · 113 por minuto · 6 frases de 10.0 palabras en promedio (la más larga: 23) · 3 pausa(s) de párrafo (≥ 1 s) · 6 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:51.6 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 0:51.6 |  |  | ambiente cuarto (0.5) |
| 0:51.9 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 0:52.2 |  | **nombre** — entra el nombre, letra por letra |  |
| 0:54.6 | Nació en Lima, en mil novecientos cincuenta y seis. |  |  |
| 0:59.5 | De chico fue nadador de competencia: representó al Perú en las categorías infantil y juvenil. |  |  |
| 1:00.2 |  | **piscina** — (piscina) el agua cubre la página: aparece la piscina (sin este beat, la piscina está desde el comienzo) |  |
| 1:00.2 |  |  | se va el ambiente cuarto |
| 1:00.2 |  |  | ambiente agua (0.8) |
| 1:07.1 |  | **ficha** — (con ficha) se escribe la ficha |  |
| 1:07.2 | Marcos Cueto, historiador y amigo suyo desde los quince años, cuenta que esa disciplina de la piscina la llevó después a los archivos. |  |  |
| 1:12.2 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:15.2 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:15.2 |  |  | se va el ambiente agua |
| 1:15.2 |  |  | ambiente cuarto (0.5) |
| 1:16.9 | Y lo resume en una sola palabra: |  |  |
| 1:20.1 | inagotable. |  |  |
| 1:20.2 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |

## s03 · su generación — `TiempoLargo` · 1:24.7–2:12.5 (47.9 s)

- **Cambio:** de un estudiante que entra a la universidad a uno que se hace la pregunta de su generación: ¿el país cambia o se repite?
- **Intención:** los afiches gritan cambio; con «¿o repetía lo de siempre?», el afiche nuevo se despega y debajo asoma uno viejo, igual de prometedor; la pregunta queda en el aire
- **Intensidad:** 3 · **Música:** presente → en suspenso
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 75 % del tiempo · tramo más largo sin pausa de párrafo: 10.8 s · 87 palabras · 111 por minuto · 11 frases de 7.9 palabras en promedio (la más larga: 19) · 4 pausa(s) de párrafo (≥ 1 s) · 8 cambios de imagen
- **Nombres y cifras que se dicen (4):** Universidad Católica · Perú · Velasco · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:24.7 |  |  | música s03-epoca.mp3 (nivel 0.24) |
| 1:24.7 |  |  | ambiente ciudad (0.6) |
| 1:25.0 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:29.0 |  | **sello** — cae el sello sobre la lista |  |
| 1:30.4 |  | **primeros** — se marcan los primeros puestos |  |
| 1:34.2 |  | **afiches** — aparece el muro |  |
| 1:34.2 | El Perú vive el gobierno militar de Velasco. |  |  |
| 1:37.4 | Reforma agraria. |  |  |
| 1:37.4 |  | **afiche1** — se pega el primer afiche |  |
| 1:39.2 | Nacionalizaciones. |  |  |
| 1:39.2 |  | **afiche2** — se pega el segundo |  |
| 1:41.1 | Un discurso que promete enterrar el pasado oligárquico. |  |  |
| 1:41.1 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:46.5 | Quiroz no apoyó al régimen. |  |  |
| 1:49.3 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 1:51.6 |  | **volante** — entra el volante |  |
| 1:55.5 | Para un estudiante de esa época, la historia no era un curso más. |  |  |
| 2:00.4 | Era la manera de responder una pregunta. |  |  |
| 2:04.0 | ¿El país estaba cambiando de verdad? |  |  |
| 2:06.8 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 2:06.8 | ¿O repetía lo de siempre? |  |  |

## s04 · larga duración — `TiempoLargo` · 2:12.5–3:19.1 (66.6 s)

- **Cambio:** de la pregunta en el aire a una forma de responderla: la historia tiene capas que se mueven a distinta velocidad
- **Intención:** una capa por frase; la cámara baja hasta la que casi no se mueve y ahí aparece la palabra del episodio; al volver, se enciende la capa que Quiroz va a estudiar
- **Intensidad:** 3 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 71 % del tiempo · tramo más largo sin pausa de párrafo: 8.7 s · 115 palabras · 105 por minuto · 13 frases de 8.8 palabras en promedio (la más larga: 21) · 8 pausa(s) de párrafo (≥ 1 s) · 9 cambios de imagen
- **Nombres y cifras que se dicen (2):** Franklin Pease · Fernand Braudel

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:12.5 |  |  | música s04-capas.mp3 (nivel 0.24) |
| 2:12.5 |  |  | ambiente cuarto (0.5) |
| 2:12.8 | Casi con seguridad fue en un curso de Franklin Pease donde leyó por primera vez a Fernand Braudel, un historiador francés. |  |  |
| 2:18.0 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:22.1 |  | **capas** — el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío) |  |
| 2:22.1 | Braudel decía que la historia no corre a una sola velocidad. |  |  |
| 2:27.1 | Arriba están los acontecimientos: los gobiernos, las guerras, las noticias. |  |  |
| 2:27.1 |  | **capa1** — (capas de a una) se llena la capa de arriba |  |
| 2:33.4 | Cambian rápido, como las olas. |  |  |
| 2:37.3 | Más abajo, la economía y la sociedad. |  |  |
| 2:37.3 |  | **capa2** — (capas de a una) se llena la del medio |  |
| 2:41.1 | Cambian despacio. |  |  |
| 2:43.8 | Y al fondo, la relación del hombre con su medio: la tierra, el clima. |  |  |
| 2:43.8 |  | **capa3** — (capas de a una) se llena la de abajo |  |
| 2:50.0 | Casi no se mueve. |  |  |
| 2:51.5 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:51.5 |  | _cámara: baja hasta la capa que casi no se mueve, y se queda_ («Y al fondo… casi no se mueve»: el espectador baja a la larga duración) |  |
| 2:53.3 | A esa historia lenta la llamó larga duración. |  |  |
| 2:55.5 |  | **palabra** — (con palabra) la palabra del episodio, a pantalla completa |  |
| 2:59.0 | Quiroz se quedó con eso. |  |  |
| 2:59.0 |  | **subir** — (opcional) la cámara vuelve a ver las tres capas; se va la palabra |  |
| 2:59.0 |  | _cámara: vuelve a ver las tres capas_ («Quiroz se quedó con eso»: de la idea de Braudel a lo que él va a estudiar, la capa del medio) |  |
| 3:00.9 | Aprendió a apreciar lo que persiste: las estructuras de la economía. |  |  |
| 3:03.6 |  | **realce** — (con realce) se enciende una capa |  |
| 3:06.8 | Hay cosas que no cambian aunque cambien los gobiernos. |  |  |
| 3:12.1 | Esa mirada larga es la de esta serie. |  |  |

## s05 · método — `AprenderAMedir` · 3:19.1–4:56.1 (97.0 s)

- **Cambio:** de un historiador de discursos a uno que mide, y que cambió de ideas
- **Intención:** el viaje a Nueva York; la regresión explicada en tres tiempos (ruido, la recta que busca, cuánto pesa); la claridad en una balanza; la carrera se lee en el estante, no se narra
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🟢
- **Métricas:** voz el 77 % del tiempo · tramo más largo sin pausa de párrafo: 11.3 s · 190 palabras · 119 por minuto · 18 frases de 10.6 palabras en promedio (la más larga: 18) · 9 pausa(s) de párrafo (≥ 1 s) · 19 cambios de imagen
- **Nombres y cifras que se dicen (8):** París · Nueva York · Universidad de Columbia · Herbert Klein · Perú · Kenneth Maxwell · Cueto · ochenta

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:19.1 |  |  | música s05-medir.mp3 (nivel 0.3) |
| 3:19.1 |  |  | ambiente ciudad (0.55) |
| 3:19.3 |  | **mapa** — aparece el mapa |  |
| 3:19.4 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:23.2 | Buena parte de los historiadores peruanos miraba a París. |  |  |
| 3:23.5 |  | **paris** — sale la ruta hacia la tentación |  |
| 3:26.3 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 3:27.8 | Él se va a Nueva York, a la Universidad de Columbia. |  |  |
| 3:27.8 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 3:27.8 |  | _cámara: retrocede apenas y se lanza a Lima; sigue la ruta hacia el norte, con aire delante, y frena en Nueva York_ («Él se va a Nueva York, a la Universidad de Columbia»: el espectador hace el viaje) |  |
| 3:31.5 |  | **llega** — la ruta llega: sello y campana |  |
| 3:32.1 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 3:32.1 |  | _cámara: se abre hasta ver la ruta entera (y París, que quedó atrás); se pasa un poco y se asienta_ (llegó: el viaje queda como mapa antes de la beca) |  |
| 3:33.7 |  | **ficha** — se escribe la ficha |  |
| 3:33.7 | Allí, el historiador Herbert Klein se fija en él y le ofrece una beca. |  |  |
| 3:39.0 | Y aprende historia cuantitativa: pensar el pasado con números, no solo con discursos. |  |  |
| 3:40.2 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 3:44.2 |  | **discursos** — los bloques de discurso se apagan |  |
| 3:46.4 | Una de sus herramientas se llama regresión. |  |  |
| 3:49.5 | Imagina muchos puntos desordenados: cada uno, un dato. |  |  |
| 3:49.5 |  | **caen** — (con explicar_regresion) caen los puntos (el papel ya estaba) |  |
| 3:54.7 | A simple vista, solo ruido. |  |  |
| 3:58.0 | La regresión busca la línea que mejor pasa entre todos. |  |  |
| 3:58.3 |  | **recta** — se traza la recta de regresión |  |
| 4:02.6 | Si hay una tendencia escondida, la muestra. |  |  |
| 4:06.0 | Y dice cuánto pesa. |  |  |
| 4:07.1 |  | **pendiente** — (con explicar_regresion) se marca la pendiente: cuánto pesa |  |
| 4:09.5 | Con lo que aprendió ahí, años después, le va a sacar la cuenta al Perú. |  |  |
| 4:16.7 | De otro profesor, Kenneth Maxwell, aprende que un buen historiador combina la profundidad con la claridad. |  |  |
| 4:16.8 |  | **balanza** — aparece la balanza |  |
| 4:21.6 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 4:22.9 |  | **claridad** — cae la segunda (se equilibra) |  |
| 4:25.6 | Con los años se vuelve, en palabras de Cueto, la máxima autoridad en la historia financiera del Perú. |  |  |
| 4:25.6 |  | **estante** — aparece la repisa |  |
| 4:28.7 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 4:33.7 | Y sus ideas también se mueven. |  |  |
| 4:33.7 |  | **brujula** — aparece la brújula |  |
| 4:36.1 | De aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades. |  |  |
| 4:36.3 |  | **giro** — la aguja gira despacio de una época a la otra |  |
| 4:45.5 | Cambió de ideas. |  |  |
| 4:47.2 | Y eso importa para lo que viene: la cuenta que sacó no es la de un partido. |  |  |

## s06 · puente — `MecanismoDeuda` · 4:56.1–5:24.9 (28.7 s)

- **Cambio:** del hombre que aprendió a medir a su primer caso: una deuda pagada con la plata del guano, y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio
- **Intensidad:** 4 · **Música:** presente (tensión) → en suspenso
- **Semáforo para enseñar:** 🟡 8.8 datos/min
- **Métricas:** voz el 78 % del tiempo · tramo más largo sin pausa de párrafo: 9.9 s · 59 palabras · 130 por minuto · 5 frases de 11.8 palabras en promedio (la más larga: 24) · 3 pausa(s) de párrafo (≥ 1 s) · 5 cambios de imagen
- **Nombres y cifras que se dicen (4):** Félix Denegri Luna · Lima · Estado · 1850

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 4:56.1 |  |  | música s06-puente.mp3 (nivel 0.38) |
| 4:56.1 |  |  | ambiente mar (0.7) |
| 4:56.3 |  | **islas** — el grabado de las islas |  |
| 4:56.4 | Pero su primer caso lo había encontrado antes de irse. |  |  |
| 5:01.0 | Félix Denegri Luna, un estudioso de la historia, dueño de una gran biblioteca en Lima, le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 5:12.3 |  | **sacos** — empiezan a subir sacos al barco |  |
| 5:12.3 | Ahí estaba el guano. |  |  |
| 5:14.2 | Y una deuda que el Estado decidió pagar con esa plata, en mil ochocientos cincuenta. |  |  |
| 5:15.2 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 5:15.2 |  |  | se va el ambiente mar |
| 5:15.2 |  |  | ambiente cuarto (0.5) |
| 5:16.5 |  | **vales** — se apilan los vales de la deuda |  |
| 5:19.1 |  | **consolidacion** — cae el sello sobre la pila |  |
| 5:21.4 | ¿Adónde fue a parar esa plata? |  |  |

## s07 · cierre — `Cierre` · 5:24.9–5:37.1 (12.2 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** la pregunta queda en un silencio de 2 s mientras las pruebas de imprenta del comienzo se cierran; después, el tema del canal entra solo, con el negro
- **Intensidad:** 1 · **Música:** silencio → protagonista (el tema del canal, solo, sobre el negro)
- **Semáforo para enseñar:** 🟡 9.7 datos/min
- **Métricas:** voz el 28 % del tiempo · tramo más largo sin pausa de párrafo: 3.4 s · 5 palabras · 48 por minuto · 1 frases de 5.0 palabras en promedio (la más larga: 5) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:24.9 |  |  | ambiente cuarto (0.5) |
| 5:25.2 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 5:25.2 |  |  | **silencio deliberado** |
| 5:27.2 |  | **negro** — fundido a negro |  |
| 5:27.2 |  |  | música s07-tema.mp3 (nivel 0.55) |
| 5:27.2 |  |  | se va el ambiente cuarto |
| 5:27.2 |  |  | vuelve el sonido |
| 5:27.7 | Próximo episodio: La deuda defraudada. |  |  |
| 5:27.7 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |

