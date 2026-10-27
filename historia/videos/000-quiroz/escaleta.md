# Escaleta — 000-quiroz · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s01 | PruebasDeImprenta | 0:00.0 | 45 s | 82 % | 32 s | 142 | 11.2 | 26 | 2 | 3 (4.2/min) | 10 (14.0/min) | 🔴 voz seguida 32 s · frase de 26 palabras · voz 82 % |
| s02 | Presentacion | 0:45.3 | 29 s | 79 % | 26 s | 133 | 9.7 | 21 | 0 | 5 (11.5/min) | 4 (9.2/min) | 🟡 voz seguida 26 s · 11.5 datos/min |
| s03 | TiempoLargo | 1:14.5 | 58 s | 92 % | 56 s | 141 | 19.0 | 31 | 0 | 6 (6.4/min) | 11 (11.7/min) | 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 % |
| s04 | MecanismoDeuda | 2:12.4 | 67 s | 90 % | 65 s | 136 | 14.8 | 30 | 0 | 6 (5.5/min) | 17 (15.6/min) | 🔴 voz seguida 65 s · frase de 30 palabras · voz 90 % |
| s05 | AprenderAMedir | 3:19.7 | 63 s | 91 % | 62 s | 142 | 16.2 | 35 | 0 | 13 (12.6/min) | 16 (15.5/min) | 🔴 voz seguida 62 s · frase de 35 palabras · 12.6 datos/min · voz 91 % |
| s06 | LaPregunta | 4:23.1 | 42 s | 88 % | 40 s | 141 | 15.7 | 29 | 0 | 6 (9.0/min) | 7 (10.5/min) | 🔴 voz seguida 40 s · frase de 29 palabras · 9.0 datos/min · voz 88 % |
| s07 | Objeciones | 5:05.1 | 86 s | 88 % | 80 s | 129 | 11.9 | 30 | 1 | 5 (3.6/min) | 18 (13.0/min) | 🔴 voz seguida 80 s · frase de 30 palabras · voz 88 % |
| s08 | LaCuenta | 6:31.1 | 80 s | 85 % | 38 s | 133 | 12.4 | 27 | 3 | 9 (6.9/min) | 13 (10.0/min) | 🔴 voz seguida 38 s · frase de 27 palabras · 6.9 datos/min · voz 85 % |
| s09 | CirculosCorruptos | 7:51.0 | 27 s | 81 % | 24 s | 136 | 11.0 | 17 | 0 | 2 (4.9/min) | 7 (17.3/min) | 🟡 voz 81 % |
| s10 | Denunciantes | 8:17.9 | 49 s | 79 % | 27 s | 125 | 9.3 | 47 | 1 | 10 (13.4/min) | 12 (16.1/min) | 🔴 voz seguida 27 s · frase de 47 palabras · 13.4 datos/min |
| s11 | Cierre | 9:07.2 | 31 s | 69 % | 18 s | 130 | 10.8 | 24 | 1 | 5 (12.0/min) | 5 (12.0/min) | 🟡 12.0 datos/min |

Total: 9:38.2. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s01 · gancho — `PruebasDeImprenta` · 0:00.0–0:45.3 (45.3 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: el rojo del corrector contra la página ya limpia
- **Intensidad:** 3 · **Música:** ausente → entra al final
- **Semáforo para enseñar:** 🔴 voz seguida 32 s · frase de 26 palabras · voz 82 %
- **Métricas:** voz el 82 % del tiempo · tramo más largo sin pausa de párrafo: 32.1 s · 101 palabras · 142 por minuto · 9 frases de 11.2 palabras en promedio (la más larga: 26) · 2 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (3):** Nueva York · Alfonsito · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | ambiente hospital (0.7) |
| 0:00.3 | Nueva York. |  |  |
| 0:00.4 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:01.6 | En un hospital, un historiador peruano corrige pruebas de imprenta. |  |  |
| 0:04.7 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:06.5 | Es la traducción al español de su último libro, el que más trabajo le costó. |  |  |
| 0:11.9 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:15.2 | En los agradecimientos escribe una línea que casi nadie lee: les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:15.2 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:15.2 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:21.7 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:25.6 | Unas líneas más abajo celebra la reciente llegada a este mundo de nuestro precioso Alfonsito: su hijo. |  |  |
| 0:25.6 |  | **abajo** — la cámara baja unas líneas por la página |  |
| 0:25.6 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» celebra la llegada de su hijo) |  |
| 0:33.4 | Murió en enero de dos mil trece. |  |  |
| 0:33.4 |  | **corte1** — corte seco a negro |  |
| 0:34.0 |  | **sello1** — cae el primer sello |  |
| 0:36.3 | El libro salió en mayo. |  |  |
| 0:36.3 |  | **corte2** — corte seco a la página impresa |  |
| 0:37.6 |  | **sello2** — cae el segundo sello |  |
| 0:39.2 |  | **final** — la página se aleja despacio (aquí entra la música) |  |
| 0:39.2 |  |  | música s01-entrada.mp3 (nivel 0.3) |
| 0:39.2 |  | _cámara: se aleja de la página impresa_ («este video es sobre ese hombre»: el plano se abre para empezar) |  |
| 0:39.2 | Este video es sobre ese hombre, y sobre lo que encontró. |  |  |

## s02 · personaje — `Presentacion` · 0:45.3–1:14.5 (29.1 s)

- **Cambio:** de un historiador cualquiera a un nadador terco que se metió a los archivos
- **Intención:** el carril de piscina se vuelve renglón contable: la misma disciplina, otro terreno
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🟡 voz seguida 26 s · 11.5 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 25.8 s · 58 palabras · 133 por minuto · 6 frases de 9.7 palabras en promedio (la más larga: 21) · 0 pausa(s) de párrafo (≥ 1 s) · 4 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:45.3 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 0:45.3 |  |  | ambiente agua (0.8) |
| 0:45.6 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 0:46.3 |  | **nombre** — entra el nombre, letra por letra |  |
| 0:48.3 | Nació en Lima en mil novecientos cincuenta y seis. |  |  |
| 0:51.9 | De chico fue nadador de competencia y representó al Perú en categorías infantil y juvenil. |  |  |
| 0:58.0 | Su amigo de toda la vida, el historiador Marcos Cueto, dice que esa misma disciplina la llevó después a los archivos. |  |  |
| 1:03.0 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:06.0 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:06.0 |  |  | se va el ambiente agua |
| 1:06.0 |  |  | ambiente cuarto (0.5) |
| 1:07.3 | Y lo resume en una sola palabra: |  |  |
| 1:10.4 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |
| 1:10.5 | inagotable. |  |  |

## s03 · formación — `TiempoLargo` · 1:14.5–2:12.4 (58.0 s)

- **Cambio:** de un estudiante en tiempos de cambio a alguien que sospecha que lo de fondo no cambia
- **Intención:** los afiches gritan cambio; debajo, la capa que casi no se mueve
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 %
- **Métricas:** voz el 92 % del tiempo · tramo más largo sin pausa de párrafo: 56.1 s · 133 palabras · 141 por minuto · 7 frases de 19.0 palabras en promedio (la más larga: 31) · 0 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (6):** Universidad Católica · Perú · Velasco · Franklin Pease · Fernand Braudel · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:14.5 |  |  | música s03-generacion.mp3 (nivel 0.23) |
| 1:14.5 |  |  | ambiente ciudad (0.6) |
| 1:14.8 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:16.5 |  | **sello** — cae el sello sobre la lista |  |
| 1:20.3 |  | **primeros** — se marcan los primeros puestos |  |
| 1:23.6 | El Perú vive el gobierno militar de Velasco: reforma agraria, nacionalizaciones, un discurso que promete enterrar el pasado oligárquico. |  |  |
| 1:24.7 |  | **afiches** — aparece el muro |  |
| 1:26.8 |  | **afiche1** — se pega el primer afiche |  |
| 1:28.1 |  | **afiche2** — se pega el segundo |  |
| 1:31.2 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:34.1 | Para un estudiante de esa época, la historia no era un curso más: era la manera de saber si el país de verdad estaba cambiando, o si repetía lo de siempre. |  |  |
| 1:43.3 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 1:45.4 | Quiroz no apoyó al régimen. |  |  |
| 1:48.1 |  | **volante** — entra el volante |  |
| 1:48.3 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 1:53.5 | En las aulas lo marcan profesores como Franklin Pease, y por ellos llega a Fernand Brodel, el historiador francés de las estructuras que duran siglos. |  |  |
| 1:53.7 |  | **capas** — el muro se apaga y se dibujan las capas |  |
| 1:53.7 |  |  | se va el ambiente ciudad |
| 1:53.7 |  |  | ambiente cuarto (0.5) |
| 1:58.8 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:03.7 | Esa idea, que hay cosas que no cambian aunque cambien los gobiernos, va a ser el centro de toda su obra. |  |  |
| 2:05.7 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:05.7 |  | _cámara: baja hasta la capa de las estructuras_ («hay cosas que no cambian aunque cambien los gobiernos») |  |

## s04 · primer hallazgo — `MecanismoDeuda` · 2:12.4–3:19.7 (67.3 s)

- **Cambio:** de 'la élite despilfarró el guano' a 'la deuda se infló desde adentro del Estado'
- **Intención:** yuxtaposición: la riqueza de las islas contra el papel que la vació; el mecanismo, paso a paso
- **Intensidad:** 4 · **Música:** presente (tensión)
- **Semáforo para enseñar:** 🔴 voz seguida 65 s · frase de 30 palabras · voz 90 %
- **Métricas:** voz el 90 % del tiempo · tramo más largo sin pausa de párrafo: 65.0 s · 148 palabras · 136 por minuto · 10 frases de 14.8 palabras en promedio (la más larga: 30) · 0 pausa(s) de párrafo (≥ 1 s) · 17 cambios de imagen
- **Nombres y cifras que se dicen (6):** Félix Denegri Luna · Estado · La · 1850 · 1980 · siete

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:12.4 |  |  | música s04-mecanismo.mp3 (nivel 0.4) |
| 2:12.4 |  |  | ambiente mar (0.8) |
| 2:12.6 |  | **islas** — el grabado de las islas |  |
| 2:12.7 | Un coleccionista de libros, Félix Denegri Luna, le sugiere mirar con más cuidado el siglo diecinueve. |  |  |
| 2:19.7 | Ahí encuentra su primer caso. |  |  |
| 2:22.1 |  | **sacos** — empiezan a subir sacos al barco |  |
| 2:22.2 | En mil ochocientos cincuenta, con la plata del guano entrando a las arcas, el Estado decide pagar su deuda interna: deudas que venían arrastrándose, algunas desde la época colonial. |  |  |
| 2:26.8 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 2:26.8 |  |  | se va el ambiente mar |
| 2:26.8 |  |  | ambiente cuarto (0.5) |
| 2:29.5 |  | **vales** — se apilan los vales de la deuda |  |
| 2:35.1 | A eso se le llamó la consolidación. |  |  |
| 2:36.5 |  | **consolidacion** — cae el sello sobre la pila |  |
| 2:37.8 | La promesa era que esos pagos crearían una clase de empresarios que invertiría en el país. |  |  |
| 2:38.0 |  | **promesa** — se dibuja en punteado lo que se prometía (una fábrica) |  |
| 2:44.4 | La versión aceptada decía que la élite simplemente había despilfarrado esa riqueza en lujos. |  |  |
| 2:44.5 |  | **lujos** — lo prometido se borra y se dibuja lo que se decía (lujos) |  |
| 2:51.3 | Quiroz revisó los expedientes y encontró otra cosa: el valor de la deuda se había inflado para enriquecerse a costa del Estado, y dentro del propio Estado había funcionarios cómplices. |  |  |
| 2:52.6 |  | **expedientes** — primer plano de un vale |  |
| 2:52.6 |  | _cámara: se acerca a un vale_ («revisó los expedientes»: la cámara mira de cerca, como él) |  |
| 2:56.2 |  | **inflado** — el monto sube (2.4 s) mientras la pluma marca |  |
| 2:59.3 |  | **caudal** — el Estado y el caudal hacia pocos bolsillos |  |
| 3:02.0 |  | **funcionarios** — se encienden las ventanas con funcionarios |  |
| 3:03.8 | No era solo derroche. |  |  |
| 3:04.0 |  | **frase** — primera línea a pantalla completa |  |
| 3:04.7 |  | **tachar** — se tacha la primera línea |  |
| 3:06.1 |  | **mecanismo** — aparece la segunda línea |  |
| 3:06.1 | Era un mecanismo. |  |  |
| 3:08.2 |  | **tesis** — portada de la tesis, a máquina |  |
| 3:08.2 | Lo presentó como tesis en mil novecientos ochenta, y siete años después lo publicó con un título que lo dice todo: La deuda defraudada. |  |  |
| 3:11.9 |  | **libro** — la tesis se vuelve libro |  |
| 3:16.6 |  | **titulo** — se estampa el título en la tapa |  |

## s05 · método — `AprenderAMedir` · 3:19.7–4:23.1 (63.4 s)

- **Cambio:** de un historiador de discursos a uno que mide
- **Intención:** la flecha duda en París y se va a Nueva York: el método antes que la moda
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 62 s · frase de 35 palabras · 12.6 datos/min · voz 91 %
- **Métricas:** voz el 91 % del tiempo · tramo más largo sin pausa de párrafo: 61.5 s · 146 palabras · 142 por minuto · 9 frases de 16.2 palabras en promedio (la más larga: 35) · 0 pausa(s) de párrafo (≥ 1 s) · 16 cambios de imagen
- **Nombres y cifras que se dicen (13):** París · Universidad de Columbia · Nueva York · Herbert Klein · Kenneth Maxwell · Perú · Grace · Baruch College · City University · New York · Estado · ochenta · cientos

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:19.7 |  |  | música s05-medir.mp3 (nivel 0.3) |
| 3:19.7 |  |  | ambiente ciudad (0.55) |
| 3:19.9 |  | **mapa** — aparece el mapa |  |
| 3:20.0 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:23.8 | Casi todos los historiadores peruanos soñaban con París. |  |  |
| 3:26.8 |  | **paris** — sale la ruta hacia la tentación |  |
| 3:27.6 | Él postula a la Universidad de Columbia, en Nueva York. |  |  |
| 3:28.2 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 3:29.7 |  | **nuevayork** — sale la ruta hacia el destino |  |
| 3:31.8 | El historiador Hérbert Kláin lo acepta y le da una beca. |  |  |
| 3:31.9 |  | **ficha** — la cámara se acerca y se escribe la ficha |  |
| 3:31.9 |  | _cámara: se acerca a Nueva York_ (llega a Columbia: el viaje termina ahí) |  |
| 3:36.1 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 3:36.1 | Allí aprende historia cuantitativa: usar estadística, regresiones y computadoras para pensar el pasado con números, no solo con discursos. |  |  |
| 3:39.8 |  | **recta** — se traza la recta de regresión |  |
| 3:44.8 |  | **discursos** — los bloques de discurso se apagan |  |
| 3:46.0 | Y de otro profesor, Kénet Máxuel, aprende que la profundidad no sirve de nada sin claridad. |  |  |
| 3:46.1 |  | **balanza** — aparece la balanza |  |
| 3:49.3 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 3:51.5 |  | **claridad** — cae la segunda (se equilibra) |  |
| 3:52.6 | Se convierte en la mayor autoridad en historia financiera del Perú: bancos, crédito colonial, la casa Greis. |  |  |
| 3:52.6 |  | **estante** — aparece la repisa |  |
| 3:57.2 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 4:00.4 | Termina como profesor en el Báruj Cólech y en la Síti Iunivérsiti de Niu Iork, donde forma a cientos de estudiantes. |  |  |
| 4:00.4 |  | **aulas** — el aula se va llenando |  |
| 4:08.2 | Sus ideas también se mueven: de aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades y un Estado que dejara de ser el botín de unos pocos. |  |  |
| 4:08.3 |  | **brujula** — aparece la brújula |  |
| 4:11.2 |  | **giro** — la aguja gira despacio de una época a la otra |  |

## s06 · la pregunta — `LaPregunta` · 4:23.1–5:05.1 (42.0 s)

- **Cambio:** de una duda académica a una pregunta con pruebas
- **Intención:** la estática sugiere los videos sin mostrarlos; el mundo entero se pone a mirar
- **Intensidad:** 3 · **Música:** presente (tensión)
- **Semáforo para enseñar:** 🔴 voz seguida 40 s · frase de 29 palabras · 9.0 datos/min · voz 88 %
- **Métricas:** voz el 88 % del tiempo · tramo más largo sin pausa de párrafo: 39.7 s · 94 palabras · 141 por minuto · 6 frases de 15.7 palabras en promedio (la más larga: 29) · 0 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (6):** Historia de · Perú · Fujimori y Montesinos · Banco Mundial · Naciones Unidas · 2000

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 4:23.1 |  |  | música s06-pregunta.mp3 (nivel 0.32) |
| 4:23.1 |  |  | ambiente cuarto (0.5) |
| 4:23.4 | En el año dos mil publica un ensayo cuyo título suena a duda: Historia de la corrupción en el Perú: ¿es factible su estudio? |  |  |
| 4:25.3 |  | **titulo** — empieza a escribirse el título (11 letras por segundo) |  |
| 4:32.1 | Ese mismo año cae el régimen de Fujimori y Montesinos. |  |  |
| 4:32.1 |  | **tv** — corte al televisor que se enciende |  |
| 4:37.2 | Los vladivideos ponen frente a todo el país lo que siempre se había sospechado, y de pronto hay pruebas como nunca antes. |  |  |
| 4:45.5 | En el mundo, el tema también explota: el presidente del Banco Mundial llama a la corrupción un cáncer, y las Naciones Unidas empiezan a tratarla como un crimen transnacional. |  |  |
| 4:45.6 |  | **globo** — aparece el globo |  |
| 4:49.6 |  | **ficha1** — primera ficha |  |
| 4:52.8 |  | **ficha2** — segunda ficha |  |
| 4:58.1 | Quiroz tenía la pregunta. |  |  |
| 4:59.5 |  | **pregunta** — primera palabra a pantalla completa |  |
| 5:00.8 | Ahora tenía también las pruebas. |  |  |
| 5:02.5 |  | **pruebas** — segunda palabra |  |

## s07 · las objeciones — `Objeciones` · 5:05.1–6:31.1 (85.9 s)

- **Cambio:** de 'la corrupción no se puede estudiar' a 'se puede, y traba todo'
- **Intención:** cada objeción se da vuelta; el remate es físico: el engranaje se traba
- **Intensidad:** 5 · **Música:** protagonista → golpe → silencio
- **Semáforo para enseñar:** 🔴 voz seguida 80 s · frase de 30 palabras · voz 88 %
- **Métricas:** voz el 88 % del tiempo · tramo más largo sin pausa de párrafo: 79.9 s · 179 palabras · 129 por minuto · 15 frases de 11.9 palabras en promedio (la más larga: 30) · 1 pausa(s) de párrafo (≥ 1 s) · 18 cambios de imagen
- **Nombres y cifras que se dicen (5):** Congreso · Real Academia · Quiroz · 1729 · tres

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:05.1 |  |  | música s07-objeciones.mp3 (nivel 0.75) |
| 5:05.1 |  |  | ambiente cuarto (0.5) |
| 5:05.4 | Pero había un problema. |  |  |
| 5:08.5 |  | **tarjetas** — se reparten las cuatro tarjetas |  |
| 5:08.5 | Muchos académicos decían que la corrupción no se podía estudiar. |  |  |
| 5:13.1 | Daban tres razones, y una excusa. |  |  |
| 5:15.3 |  | **excusa** — la cuarta se aparta (es una excusa, no una razón) |  |
| 5:16.4 |  | **t1** — la tarjeta 1 pasa al centro |  |
| 5:16.4 | La primera: es secreta, nadie firma un recibo por una coima. |  |  |
| 5:21.7 | Quiroz respondió que los archivos están llenos de rastros: juicios, investigaciones del Congreso, denuncias y, sobre todo, cartas de diplomáticos extranjeros que les contaban a sus gobiernos lo que veían. |  |  |
| 5:22.1 |  | **r1** — se da vuelta: legajos |  |
| 5:30.2 |  | **sellos** — caen los sellos de embajada |  |
| 5:35.6 | La segunda: solo se pueden medir percepciones, lo que la gente cree. |  |  |
| 5:35.7 |  | **t2** — la tarjeta 2 pasa al centro |  |
| 5:40.9 | Él respondió que las percepciones se manipulan, y que con cuentas fiscales y estimados bien hechos se puede aproximar el costo real. |  |  |
| 5:41.0 |  | **r2** — se da vuelta: medidor contra libro de cuentas |  |
| 5:49.5 | La tercera: lo que hoy llamamos corrupción, antes era normal. |  |  |
| 5:49.5 |  | **t3** — la tarjeta 3 pasa al centro |  |
| 5:54.5 | Él respondió con un diccionario: en mil setecientos veintinueve la Real Academia ya definía el cohecho, el prevaricato y la corruptela. |  |  |
| 5:54.8 |  | **r3** — se da vuelta: diccionario |  |
| 6:01.4 |  | **entradas** — se subrayan las entradas, una tras otra |  |
| 6:04.8 | Sabían que estaba mal. |  |  |
| 6:07.1 | Y la excusa: que la corrupción es cultural, que está en la sangre. |  |  |
| 6:07.1 |  | **t4** — la tarjeta 4 pasa al centro |  |
| 6:12.2 | Para Quiroz eso no explicaba nada. |  |  |
| 6:14.0 |  | **r4** — se tacha |  |
| 6:15.1 |  | **engranaje** — corte al engranaje que gira |  |
| 6:15.1 | Durante décadas incluso se dijo que la corrupción era útil, un aceite que hacía funcionar a la burocracia. |  |  |
| 6:19.1 |  | **aceite** — cae una gota de aceite |  |
| 6:22.3 | Él pensaba lo contrario: no es aceite. |  |  |
| 6:23.4 |  | **corte** — corte seco: sin aceite |  |
| 6:26.5 | Es grava en el engranaje. |  |  |
| 6:26.6 |  | **grava** — cae la grava |  |
| 6:27.6 |  | **traba** — el engranaje se traba (el golpe fuerte) |  |
| 6:27.6 |  |  | **silencio deliberado** |
| 6:29.8 |  | **fin** — termina el silencio que sigue al golpe |  |
| 6:29.8 |  |  | vuelve el sonido |

## s08 · la cuenta — `LaCuenta` · 6:31.1–7:51.0 (79.9 s)

- **Cambio:** de una sospecha a una cifra: entre un tercio y dos quintos del gasto, siempre
- **Intención:** la banda de corrupción baja se queda vacía: el dato más fuerte es una ausencia
- **Intensidad:** 5 · **Música:** presente → silencio
- **Semáforo para enseñar:** 🔴 voz seguida 38 s · frase de 27 palabras · 6.9 datos/min · voz 85 %
- **Métricas:** voz el 85 % del tiempo · tramo más largo sin pausa de párrafo: 38.4 s · 173 palabras · 133 por minuto · 14 frases de 12.4 palabras en promedio (la más larga: 27) · 3 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (9):** Estado · Perú · 2000 · 1820 · treinta · cuarenta por ciento · tres y cuatro por ciento · dos · mitad

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 6:31.1 |  |  | música s08-cuenta.mp3 (nivel 0.32) |
| 6:31.1 |  |  | ambiente cuarto (0.45) |
| 6:31.4 | Con todo eso armó algo que nadie había hecho: una estimación del costo de la corrupción, década por década, desde la colonia hasta el año dos mil. |  |  |
| 6:38.0 |  | **decadas** — la regla de décadas se va marcando (4 s) |  |
| 6:43.0 | Sus números dicen esto. |  |  |
| 6:44.7 |  | **barra** — aparecen las cien unidades |  |
| 6:45.1 | Entre mil ochocientos veinte y dos mil, la corrupción se habría llevado, en promedio, entre el treinta y el cuarenta por ciento del gasto del Estado. |  |  |
| 6:51.4 |  | **rojo** — se tiñe el mínimo; un segundo después, el rango |  |
| 6:54.1 |  | **cae** — las unidades rojas se desprenden |  |
| 6:55.8 |  | **pib** — aparece la producción y pierde una franja cada año |  |
| 6:56.2 | Entre tres y cuatro por ciento de todo lo que producía el país, cada año. |  |  |
| 7:01.0 |  | **niveles** — gráfico de niveles: se traza la línea (5 s) |  |
| 7:01.3 | Clasificó cada época como de corrupción moderada, alta o muy alta. |  |  |
| 7:07.2 | No encontró ninguna de corrupción baja. |  |  |
| 7:09.3 |  | **baja** — la banda vacía parpadea; se marca el punto más bajo |  |
| 7:09.3 |  |  | **silencio deliberado** |
| 7:11.1 |  | **ni** — la banda vacía se queda |  |
| 7:11.1 |  |  | vuelve el sonido |
| 7:11.2 | Ni una, en casi dos siglos. |  |  |
| 7:14.2 | Y su conclusión más fuerte. |  |  |
| 7:16.4 |  | **crecer** — crece la barra de lo que hace falta para crecer |  |
| 7:16.5 | Para crecer de verdad, un país necesita que su producción suba entre cinco y ocho por ciento al año. |  |  |
| 7:23.8 |  | **corrupcion** — crece, en la misma escala, la barra roja de la corrupción |  |
| 7:23.9 | La corrupción se llevaba entre tres y cuatro por ciento. |  |  |
| 7:28.8 | Según su cuenta, el Perú perdió, o usó mal, cerca de la mitad de sus posibilidades de desarrollo. |  |  |
| 7:32.1 |  | **mitad** — aparece la conclusión |  |
| 7:37.9 | Él mismo advierte que son estimados preliminares, sujetos a revisión. |  |  |
| 7:38.0 |  | **nota** — aparece la nota al pie |  |
| 7:43.2 | Pero el punto no está en el decimal. |  |  |
| 7:46.3 | Está en que el patrón nunca se rompe. |  |  |
| 7:46.3 |  | **patron** — vuelve la línea de niveles entera: el patrón |  |

## s09 · el libro — `CirculosCorruptos` · 7:51.0–8:17.9 (26.9 s)

- **Cambio:** de un libro premiado a una frase que todos repetimos: 'roba, pero hace obra'
- **Intención:** el cartel de obra pública dice lo que el libro desarma: se tacha el PERO y queda la verdad
- **Intensidad:** 4 · **Música:** presente
- **Semáforo para enseñar:** 🟡 voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 23.9 s · 55 palabras · 136 por minuto · 5 frases de 11.0 palabras en promedio (la más larga: 17) · 0 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (2):** Corrupt Circles · 2008

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 7:51.0 |  |  | música s09-circulos.mp3 (nivel 0.25) |
| 7:51.0 |  |  | ambiente ciudad (0.55) |
| 7:51.2 |  | **circulos** — los anillos empiezan a cerrarse (4 s) |  |
| 7:51.3 | El resultado fue Córrupt Sérkels, publicado en inglés en dos mil ocho. |  |  |
| 7:52.8 |  | **titulo** — aparece el título (y el año) |  |
| 7:56.3 |  | **red** — la red crece hacia afuera (6 s) |  |
| 7:56.3 | Ganó premios, se empezó a usar en todo el mundo, y dejó una crítica que todavía incomoda. |  |  |
| 8:03.3 | Contra quienes creen que la corrupción es inevitable en los países pobres. |  |  |
| 8:08.3 |  | **cartel** — se planta el cartel |  |
| 8:08.4 | Y contra esa frase que todos hemos escuchado alguna vez: |  |  |
| 8:13.1 |  | **frase** — se colocan las letras (1.4 s) |  |
| 8:13.2 | roba, pero hace obra. |  |  |
| 8:14.6 |  | **tachar** — se tacha una palabra |  |
| 8:16.0 |  | **roba** — todo se apaga menos la palabra que queda |  |

## s10 · la serie — `Denunciantes` · 8:17.9–9:07.2 (49.4 s)

- **Cambio:** de una lista de ladrones a una historia contada por los que denunciaron
- **Intención:** el que intentó limpiar y perdió abre la serie; el corte a negro es su derrota
- **Intensidad:** 3 · **Música:** presente → corte → protagonista
- **Semáforo para enseñar:** 🔴 voz seguida 27 s · frase de 47 palabras · 13.4 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 27.5 s · 93 palabras · 125 por minuto · 10 frases de 9.3 palabras en promedio (la más larga: 47) · 1 pausa(s) de párrafo (≥ 1 s) · 12 cambios de imagen
- **Nombres y cifras que se dicen (10):** Antonio de Ulloa · Huancavelica · Domingo Elías · Manuel González Prada · Jorge Basadre · Héctor Vargas Haya · 1758 · 2000 · tres mil · siete

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 8:17.9 |  |  | música s10-serie.mp3 (nivel 0.55) |
| 8:17.9 |  |  | ambiente viento (0.8) |
| 8:18.1 |  | **lista** — aparece la lista |  |
| 8:18.2 | Pero el libro no es una lista de ladrones. |  |  |
| 8:21.3 | Está contado desde los que denunciaron. |  |  |
| 8:22.8 |  | **tacha** — la lista se tacha |  |
| 8:23.7 |  | **cordillera** — la lista se va y se dibuja la cordillera (3 s) |  |
| 8:24.0 | Empieza con Antonio de Ulloa, un marino y científico español que en mil setecientos cincuenta y ocho llegó a gobernar Huancavelica, a más de tres mil quinientos metros de altura, a cargo de la mina de mercurio de la que dependía la plata de todo el virreinato. |  |  |
| 8:32.1 |  | **huanca** — el punto rojo baja al lugar; se escribe la ficha |  |
| 8:33.8 |  | **altura** — línea y escala de altura |  |
| 8:37.9 |  | **mercurio** — cae la gota de mercurio |  |
| 8:40.1 |  | **plata** — la gota se vuelve barra de plata |  |
| 8:42.5 |  | **limpiar** — un brillo barre la barra |  |
| 8:42.5 | Intentó limpiarla. |  |  |
| 8:44.9 | Y perdió. |  |  |
| 8:45.7 |  | **perdio** — corte a negro de 10 cuadros |  |
| 8:45.7 |  |  | se va el ambiente viento |
| 8:46.9 | Después vienen otros: Domingo Elías, Manuel González Prada, Jorge Basadre, Héctor Vargas Haya. |  |  |
| 8:48.7 |  | **otros** — primer nombre |  |
| 8:48.7 |  |  | ambiente cuarto (0.45) |
| 8:55.0 | Siete capítulos. |  |  |
| 8:55.0 |  | **capitulos** — el índice: se enciende un capítulo cada 0.62 s |  |
| 8:56.9 | Siete ciclos. |  |  |
| 8:58.6 | Del virreinato al año dos mil. |  |  |
| 9:01.2 |  | **serie** — todo encendido |  |
| 9:01.2 | Eso es esta serie. |  |  |

## s11 · cierre — `Cierre` · 9:07.2–9:38.2 (31.0 s)

- **Cambio:** de la muerte del autor a la promesa de leerlo
- **Intención:** vuelve la pila del inicio, ahora limpia: el libro terminado; recién aquí suena el tema del canal
- **Intensidad:** 2 · **Música:** ausente → tema del canal
- **Semáforo para enseñar:** 🟡 12.0 datos/min
- **Métricas:** voz el 69 % del tiempo · tramo más largo sin pausa de párrafo: 18.3 s · 54 palabras · 130 por minuto · 5 frases de 10.8 palabras en promedio (la más larga: 24) · 1 pausa(s) de párrafo (≥ 1 s) · 5 cambios de imagen
- **Nombres y cifras que se dicen (5):** Marcos Cueto · Río de Janeiro · Huancavelica · 2013 · 1758

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 9:07.2 |  |  | ambiente cuarto (0.5) |
| 9:07.5 | Marcos Cueto terminó el prólogo en Río de Janeiro, en febrero de dos mil trece, un mes después de la muerte de su amigo. |  |  |
| 9:07.8 |  | **limpiar** — (con limpiar) las correcciones rojas se desvanecen (4 s) |  |
| 9:09.6 |  | **ficha** — (con ficha) empieza a escribirse la ficha |  |
| 9:16.0 | Lo cerró con una confesión: que siempre había querido ser como él. |  |  |
| 9:21.4 | Nosotros vamos a hacer algo más modesto. |  |  |
| 9:21.6 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 9:24.6 | Vamos a leerlo. |  |  |
| 9:26.1 |  | **negro** — fundido a negro |  |
| 9:26.1 |  |  | música s11-tema.mp3 (nivel 0.55) |
| 9:26.1 |  |  | se va el ambiente cuarto |
| 9:27.1 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |
| 9:27.3 | Próximo episodio: Huancavelica, mil setecientos cincuenta y ocho. |  |  |

