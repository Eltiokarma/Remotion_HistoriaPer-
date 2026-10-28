# Escaleta — 001-el-hombre · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s01 | PruebasDeImprenta | 0:00.0 | 52 s | 69 % | 10 s | 116 | 9.5 | 17 | 6 | 3 (3.7/min) | 11 (13.5/min) | 🟢 |
| s02 | Presentacion | 0:51.6 | 29 s | 79 % | 26 s | 133 | 9.7 | 21 | 0 | 5 (11.5/min) | 4 (9.2/min) | 🟡 voz seguida 26 s · 11.5 datos/min |
| s03 | TiempoLargo | 1:20.8 | 58 s | 92 % | 56 s | 141 | 19.0 | 31 | 0 | 6 (6.4/min) | 11 (11.7/min) | 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 % |
| s04 | AprenderAMedir | 2:18.7 | 66 s | 88 % | 50 s | 135 | 16.2 | 35 | 2 | 13 (12.1/min) | 18 (16.7/min) | 🔴 voz seguida 50 s · frase de 35 palabras · 12.1 datos/min · voz 88 % |
| s05 | MecanismoDeuda | 3:24.9 | 26 s | 75 % | 7 s | 127 | 10.2 | 16 | 3 | 3 (7.5/min) | 5 (12.4/min) | 🟡 7.5 datos/min |
| s06 | Cierre | 3:50.6 | 12 s | 28 % | 3 s | 48 | 5.0 | 5 | 0 | 1 (9.7/min) | 3 (29.0/min) | 🟡 9.7 datos/min |

Total: 4:02.8. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


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

## s02 · personaje — `Presentacion` · 0:51.6–1:20.8 (29.1 s)

- **Cambio:** de un historiador cualquiera a un nadador terco que se metió a los archivos
- **Intención:** el carril de piscina se vuelve renglón contable: la misma disciplina, otro terreno
- **Intensidad:** 1 · **Música:** presente
- **Semáforo para enseñar:** 🟡 voz seguida 26 s · 11.5 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 25.8 s · 58 palabras · 133 por minuto · 6 frases de 9.7 palabras en promedio (la más larga: 21) · 0 pausa(s) de párrafo (≥ 1 s) · 4 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:51.6 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 0:51.6 |  |  | ambiente agua (0.8) |
| 0:51.9 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 0:52.6 |  | **nombre** — entra el nombre, letra por letra |  |
| 0:54.6 | Nació en Lima en mil novecientos cincuenta y seis. |  |  |
| 0:58.1 | De chico fue nadador de competencia y representó al Perú en categorías infantil y juvenil. |  |  |
| 1:04.2 | Su amigo de toda la vida, el historiador Marcos Cueto, dice que esa misma disciplina la llevó después a los archivos. |  |  |
| 1:09.2 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:12.2 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:12.2 |  |  | se va el ambiente agua |
| 1:12.2 |  |  | ambiente cuarto (0.5) |
| 1:13.6 | Y lo resume en una sola palabra: |  |  |
| 1:16.6 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |
| 1:16.7 | inagotable. |  |  |

## s03 · formación — `TiempoLargo` · 1:20.8–2:18.7 (58.0 s)

- **Cambio:** de un estudiante en tiempos de cambio a alguien que sospecha que lo de fondo no cambia
- **Intención:** los afiches gritan cambio; debajo, la capa que casi no se mueve
- **Intensidad:** 3 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 %
- **Métricas:** voz el 92 % del tiempo · tramo más largo sin pausa de párrafo: 56.1 s · 133 palabras · 141 por minuto · 7 frases de 19.0 palabras en promedio (la más larga: 31) · 0 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (6):** Universidad Católica · Perú · Velasco · Franklin Pease · Fernand Braudel · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:20.8 |  |  | música s03-generacion.mp3 (nivel 0.23) |
| 1:20.8 |  |  | ambiente ciudad (0.6) |
| 1:21.1 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:22.8 |  | **sello** — cae el sello sobre la lista |  |
| 1:26.6 |  | **primeros** — se marcan los primeros puestos |  |
| 1:29.9 | El Perú vive el gobierno militar de Velasco: reforma agraria, nacionalizaciones, un discurso que promete enterrar el pasado oligárquico. |  |  |
| 1:31.0 |  | **afiches** — aparece el muro |  |
| 1:33.1 |  | **afiche1** — se pega el primer afiche |  |
| 1:34.4 |  | **afiche2** — se pega el segundo |  |
| 1:37.5 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:40.3 | Para un estudiante de esa época, la historia no era un curso más: era la manera de saber si el país de verdad estaba cambiando, o si repetía lo de siempre. |  |  |
| 1:49.6 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 1:51.7 | Quiroz no apoyó al régimen. |  |  |
| 1:54.4 |  | **volante** — entra el volante |  |
| 1:54.5 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 1:59.8 | En las aulas lo marcan profesores como Franklin Pease, y por ellos llega a Fernand Brodel, el historiador francés de las estructuras que duran siglos. |  |  |
| 1:60.0 |  | **capas** — el muro se apaga y se dibujan las capas |  |
| 1:60.0 |  |  | se va el ambiente ciudad |
| 1:60.0 |  |  | ambiente cuarto (0.5) |
| 2:05.1 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:10.0 | Esa idea, que hay cosas que no cambian aunque cambien los gobiernos, va a ser el centro de toda su obra. |  |  |
| 2:12.0 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:12.0 |  | _cámara: baja hasta la capa de las estructuras_ («hay cosas que no cambian aunque cambien los gobiernos») |  |

## s04 · método — `AprenderAMedir` · 2:18.7–3:24.9 (66.2 s)

- **Cambio:** de un historiador de discursos a uno que mide
- **Intención:** la ruta duda en París y se va a Nueva York; la cámara hace el viaje con él: el método antes que la moda
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 50 s · frase de 35 palabras · 12.1 datos/min · voz 88 %
- **Métricas:** voz el 88 % del tiempo · tramo más largo sin pausa de párrafo: 49.7 s · 146 palabras · 135 por minuto · 9 frases de 16.2 palabras en promedio (la más larga: 35) · 2 pausa(s) de párrafo (≥ 1 s) · 18 cambios de imagen
- **Nombres y cifras que se dicen (13):** París · Universidad de Columbia · Nueva York · Herbert Klein · Kenneth Maxwell · Perú · Grace · Baruch College · City University · New York · Estado · ochenta · cientos

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:18.7 |  |  | música s04-medir.mp3 (nivel 0.3) |
| 2:18.7 |  |  | ambiente ciudad (0.55) |
| 2:18.9 |  | **mapa** — aparece el mapa |  |
| 2:19.0 | A comienzos de los ochenta hace algo poco común. |  |  |
| 2:22.8 | Casi todos los historiadores peruanos soñaban con París. |  |  |
| 2:25.1 |  | **paris** — sale la ruta hacia la tentación |  |
| 2:26.4 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 2:27.5 | Él postula a la Universidad de Columbia, en Nueva York. |  |  |
| 2:27.6 |  | **sale** — la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos) |  |
| 2:27.6 |  | _cámara: retrocede apenas y se lanza a Lima; sigue la ruta hacia el norte, con aire delante, y frena en Nueva York_ («Él postula a la Universidad de Columbia, en Nueva York»: el espectador hace el viaje) |  |
| 2:31.1 |  | **llega** — la ruta llega: sello y campana |  |
| 2:31.8 |  | **abre** — la cámara se abre hasta ver la ruta entera, y se asienta |  |
| 2:31.8 |  | _cámara: se abre hasta ver la ruta entera (y París, que quedó atrás); se pasa un poco y se asienta_ (llegó: el viaje queda como mapa antes de la beca) |  |
| 2:33.6 |  | **ficha** — se escribe la ficha |  |
| 2:33.6 | El historiador Hérbert Kláin lo acepta y le da una beca. |  |  |
| 2:37.8 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 2:37.9 | Allí aprende historia cuantitativa: usar estadística, regresiones y computadoras para pensar el pasado con números, no solo con discursos. |  |  |
| 2:41.6 |  | **recta** — se traza la recta de regresión |  |
| 2:46.7 |  | **discursos** — los bloques de discurso se apagan |  |
| 2:47.9 | Y de otro profesor, Kénet Máxuel, aprende que la profundidad no sirve de nada sin claridad. |  |  |
| 2:48.0 |  | **balanza** — aparece la balanza |  |
| 2:51.2 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 2:53.3 |  | **claridad** — cae la segunda (se equilibra) |  |
| 2:54.4 |  | **estante** — aparece la repisa |  |
| 2:54.5 | Se convierte en la mayor autoridad en historia financiera del Perú: bancos, crédito colonial, la casa Greis. |  |  |
| 2:59.0 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 3:02.2 | Termina como profesor en el Báruj Cólech y en la Síti Iunivérsiti de Niu Iork, donde forma a cientos de estudiantes. |  |  |
| 3:02.2 |  | **aulas** — el aula se va llenando |  |
| 3:10.0 | Sus ideas también se mueven: de aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades y un Estado que dejara de ser el botín de unos pocos. |  |  |
| 3:10.1 |  | **brujula** — aparece la brújula |  |
| 3:12.9 |  | **giro** — la aguja gira despacio de una época a la otra |  |

## s05 · puente — `MecanismoDeuda` · 3:24.9–3:50.6 (25.7 s)

- **Cambio:** del hombre que aprendió a medir a su primer caso: una deuda pagada con la plata del guano, y una pregunta abierta
- **Intención:** cerrar el retrato volviendo atrás: lo que aprendió en Nueva York lo va a usar en lo que ya había encontrado antes de irse; la pregunta queda en el aire para el próximo episodio
- **Intensidad:** 4 · **Música:** presente (tensión) → en suspenso
- **Semáforo para enseñar:** 🟡 7.5 datos/min
- **Métricas:** voz el 75 % del tiempo · tramo más largo sin pausa de párrafo: 7.4 s · 51 palabras · 127 por minuto · 5 frases de 10.2 palabras en promedio (la más larga: 16) · 3 pausa(s) de párrafo (≥ 1 s) · 5 cambios de imagen
- **Nombres y cifras que se dicen (3):** Félix Denegri Luna · Estado · 1850

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:24.9 |  |  | música s05-puente.mp3 (nivel 0.38) |
| 3:24.9 |  |  | ambiente mar (0.7) |
| 3:25.1 |  | **islas** — el grabado de las islas |  |
| 3:25.2 | Pero su primer caso lo había encontrado antes de irse. |  |  |
| 3:29.8 | Un coleccionista de libros, Félix Denegri Luna, le sugirió mirar con más cuidado el siglo diecinueve. |  |  |
| 3:38.0 |  | **sacos** — empiezan a subir sacos al barco |  |
| 3:38.1 | Ahí estaba el guano. |  |  |
| 3:39.9 | Y una deuda que el Estado decidió pagar con esa plata, en mil ochocientos cincuenta. |  |  |
| 3:40.9 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 3:40.9 |  |  | se va el ambiente mar |
| 3:40.9 |  |  | ambiente cuarto (0.5) |
| 3:42.3 |  | **vales** — se apilan los vales de la deuda |  |
| 3:44.8 |  | **consolidacion** — cae el sello sobre la pila |  |
| 3:47.1 | ¿Adónde fue a parar esa plata? |  |  |

## s06 · cierre — `Cierre` · 3:50.6–4:02.8 (12.2 s)

- **Cambio:** del caso abierto a la promesa del próximo episodio
- **Intención:** la pregunta queda en un silencio de 2 s mientras las pruebas de imprenta del comienzo se cierran; después, el tema del canal entra solo, con el negro
- **Intensidad:** 1 · **Música:** silencio → protagonista (el tema del canal, solo, sobre el negro)
- **Semáforo para enseñar:** 🟡 9.7 datos/min
- **Métricas:** voz el 28 % del tiempo · tramo más largo sin pausa de párrafo: 3.4 s · 5 palabras · 48 por minuto · 1 frases de 5.0 palabras en promedio (la más larga: 5) · 0 pausa(s) de párrafo (≥ 1 s) · 3 cambios de imagen
- **Nombres y cifras que se dicen (1):** La

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:50.6 |  |  | ambiente cuarto (0.5) |
| 3:50.9 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 3:50.9 |  |  | **silencio deliberado** |
| 3:52.9 |  | **negro** — fundido a negro |  |
| 3:52.9 |  |  | música s06-tema.mp3 (nivel 0.55) |
| 3:52.9 |  |  | se va el ambiente cuarto |
| 3:52.9 |  |  | vuelve el sonido |
| 3:53.4 | Próximo episodio: La deuda defraudada. |  |  |
| 3:53.4 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |

