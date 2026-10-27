# Escaleta — 000-quiroz · El hombre que le sacó la cuenta al Perú

Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.

Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).

## Resumen por escena

| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s01 | PruebasDeImprenta | 0:00.0 | 44 s | 81 % | 30 s | 140 | 10.7 | 26 | 2 | 2 (2.9/min) | 10 (14.6/min) | 🔴 voz seguida 30 s · frase de 26 palabras · voz 81 % |
| s02 | Presentacion | 0:43.6 | 29 s | 79 % | 26 s | 133 | 9.7 | 21 | 0 | 5 (11.5/min) | 4 (9.2/min) | 🟡 voz seguida 26 s · 11.5 datos/min |
| s03 | TiempoLargo | 1:12.7 | 58 s | 92 % | 56 s | 141 | 19.0 | 31 | 0 | 6 (6.4/min) | 11 (11.7/min) | 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 % |
| s04 | MecanismoDeuda | 2:10.7 | 67 s | 90 % | 65 s | 136 | 14.8 | 30 | 0 | 6 (5.5/min) | 17 (15.6/min) | 🔴 voz seguida 65 s · frase de 30 palabras · voz 90 % |
| s05 | AprenderAMedir | 3:18.0 | 63 s | 91 % | 62 s | 142 | 16.2 | 35 | 0 | 13 (12.6/min) | 16 (15.5/min) | 🔴 voz seguida 62 s · frase de 35 palabras · 12.6 datos/min · voz 91 % |
| s06 | LaPregunta | 4:21.4 | 42 s | 88 % | 40 s | 141 | 15.7 | 29 | 0 | 6 (9.0/min) | 7 (10.5/min) | 🔴 voz seguida 40 s · frase de 29 palabras · 9.0 datos/min · voz 88 % |
| s07 | Objeciones | 5:03.4 | 86 s | 88 % | 80 s | 129 | 11.9 | 30 | 1 | 5 (3.6/min) | 18 (13.0/min) | 🔴 voz seguida 80 s · frase de 30 palabras · voz 88 % |
| s08 | LaCuenta | 6:29.3 | 80 s | 85 % | 38 s | 133 | 12.4 | 27 | 3 | 9 (6.9/min) | 13 (10.0/min) | 🔴 voz seguida 38 s · frase de 27 palabras · 6.9 datos/min · voz 85 % |
| s09 | CirculosCorruptos | 7:49.2 | 27 s | 81 % | 24 s | 136 | 11.0 | 17 | 0 | 2 (4.9/min) | 7 (17.3/min) | 🟡 voz 81 % |
| s10 | Denunciantes | 8:16.1 | 49 s | 79 % | 27 s | 125 | 9.3 | 47 | 1 | 10 (13.4/min) | 12 (16.1/min) | 🔴 voz seguida 27 s · frase de 47 palabras · 13.4 datos/min |
| s11 | Cierre | 9:05.5 | 31 s | 69 % | 18 s | 130 | 10.8 | 24 | 1 | 5 (12.0/min) | 5 (12.0/min) | 🟡 12.0 datos/min |

Total: 9:36.5. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ 25 s, frases ≤ 25 palabras, ≤ 6 nombres y cifras por minuto, voz ≤ 80 % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).


## s01 · gancho — `PruebasDeImprenta` · 0:00.0–0:43.6 (43.6 s)

- **Cambio:** de un desconocido a un hombre que corrige su libro contra el tiempo
- **Intención:** abrir con la muerte y el libro sin decir quién es: el rojo del corrector contra la página ya limpia
- **Intensidad:** 3 · **Música:** ausente → entra al final
- **Semáforo para enseñar:** 🔴 voz seguida 30 s · frase de 26 palabras · voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 30.4 s · 96 palabras · 140 por minuto · 9 frases de 10.7 palabras en promedio (la más larga: 26) · 2 pausa(s) de párrafo (≥ 1 s) · 10 cambios de imagen
- **Nombres y cifras que se dicen (2):** Nueva York · 2013

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:00.0 |  |  | ambiente hospital (0.7) |
| 0:00.3 | Nueva York. |  |  |
| 0:00.4 |  | **ficha** — empieza a escribirse la ficha |  |
| 0:01.7 | En un hospital, un historiador peruano corrige pruebas de imprenta. |  |  |
| 0:04.6 |  | **correcciones** — el corrector empieza a marcar las pruebas (9 s) |  |
| 0:06.4 | Es la traducción al español de su último libro, el que más trabajo le costó. |  |  |
| 0:12.0 | No le queda mucho tiempo, y lo sabe. |  |  |
| 0:15.4 | En los agradecimientos escribe una línea que casi nadie lee: les da las gracias a sus médicos por alargar estos días, para poder completar la tarea. |  |  |
| 0:15.4 |  | **cita** — se entra a la página: aparece la frase compuesta |  |
| 0:15.4 |  | _cámara: entra a la hoja y se acerca despacio a la frase (1 → 1,08)_ (la voz dice «agradecimientos»: vamos a leer lo que él escribió) |  |
| 0:21.9 |  | **subrayado** — se subraya en rojo la parte elegida |  |
| 0:25.8 |  | **abajo** — la cámara baja unas líneas por la página |  |
| 0:25.8 |  | _cámara: baja unas líneas por la página_ («unas líneas más abajo» menciona a su hijo) |  |
| 0:25.8 | Unas líneas más abajo menciona a su hijo, recién llegado al mundo. |  |  |
| 0:31.7 |  | **corte1** — corte seco a negro |  |
| 0:31.7 | Murió en enero de dos mil trece. |  |  |
| 0:32.3 |  | **sello1** — cae el primer sello |  |
| 0:34.6 | El libro salió en mayo. |  |  |
| 0:34.6 |  | **corte2** — corte seco a la página impresa |  |
| 0:35.8 |  | **sello2** — cae el segundo sello |  |
| 0:37.4 |  | **final** — la página se aleja despacio (aquí entra la música) |  |
| 0:37.4 |  |  | música s01-entrada.mp3 (nivel 0.3) |
| 0:37.4 |  | _cámara: se aleja de la página impresa_ («este video es sobre ese hombre»: el plano se abre para empezar) |  |
| 0:37.5 | Este video es sobre ese hombre, y sobre lo que encontró. |  |  |

## s02 · personaje — `Presentacion` · 0:43.6–1:12.7 (29.1 s)

- **Cambio:** de un historiador cualquiera a un nadador terco que se metió a los archivos
- **Intención:** el carril de piscina se vuelve renglón contable: la misma disciplina, otro terreno
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🟡 voz seguida 26 s · 11.5 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 25.8 s · 58 palabras · 133 por minuto · 6 frases de 9.7 palabras en promedio (la más larga: 21) · 0 pausa(s) de párrafo (≥ 1 s) · 4 cambios de imagen
- **Nombres y cifras que se dicen (5):** Alfonso Quiroz Norris · Lima · Perú · Marcos Cueto · 1956

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 0:43.6 |  |  | música s02-nadador.mp3 (nivel 0.26) |
| 0:43.6 |  |  | ambiente agua (0.8) |
| 0:43.9 | Se llamaba Alfonso Quiroz Norris. |  |  |
| 0:44.6 |  | **nombre** — entra el nombre, letra por letra |  |
| 0:46.6 | Nació en Lima en mil novecientos cincuenta y seis. |  |  |
| 0:50.1 | De chico fue nadador de competencia y representó al Perú en categorías infantil y juvenil. |  |  |
| 0:56.2 | Su amigo de toda la vida, el historiador Marcos Cueto, dice que esa misma disciplina la llevó después a los archivos. |  |  |
| 1:01.2 |  | **frenar** — (piscina) el carril empieza a frenar |  |
| 1:04.2 |  | **renglon** — (piscina) el agua se vuelve papel |  |
| 1:04.2 |  |  | se va el ambiente agua |
| 1:04.2 |  |  | ambiente cuarto (0.5) |
| 1:05.5 | Y lo resume en una sola palabra: |  |  |
| 1:08.6 |  | **palabra** — (con palabra) todo se retira y queda la palabra sola |  |
| 1:08.7 | inagotable. |  |  |

## s03 · formación — `TiempoLargo` · 1:12.7–2:10.7 (58.0 s)

- **Cambio:** de un estudiante en tiempos de cambio a alguien que sospecha que lo de fondo no cambia
- **Intención:** los afiches gritan cambio; debajo, la capa que casi no se mueve
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 56 s · frase de 31 palabras · 6.4 datos/min · voz 92 %
- **Métricas:** voz el 92 % del tiempo · tramo más largo sin pausa de párrafo: 56.1 s · 133 palabras · 141 por minuto · 7 frases de 19.0 palabras en promedio (la más larga: 31) · 0 pausa(s) de párrafo (≥ 1 s) · 11 cambios de imagen
- **Nombres y cifras que se dicen (6):** Universidad Católica · Perú · Velasco · Franklin Pease · Fernand Braudel · 1974

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 1:12.7 |  |  | música s03-generacion.mp3 (nivel 0.23) |
| 1:12.7 |  |  | ambiente ciudad (0.6) |
| 1:13.0 | En mil novecientos setenta y cuatro entra a la Universidad Católica, entre los primeros puestos del examen de admisión. |  |  |
| 1:14.7 |  | **sello** — cae el sello sobre la lista |  |
| 1:18.5 |  | **primeros** — se marcan los primeros puestos |  |
| 1:21.8 | El Perú vive el gobierno militar de Velasco: reforma agraria, nacionalizaciones, un discurso que promete enterrar el pasado oligárquico. |  |  |
| 1:22.9 |  | **afiches** — aparece el muro |  |
| 1:25.0 |  | **afiche1** — se pega el primer afiche |  |
| 1:26.3 |  | **afiche2** — se pega el segundo |  |
| 1:29.4 |  | **afiche3** — (con 3 titulares) se pega el tercero |  |
| 1:32.3 | Para un estudiante de esa época, la historia no era un curso más: era la manera de saber si el país de verdad estaba cambiando, o si repetía lo de siempre. |  |  |
| 1:41.6 |  | **despegue** — una esquina se despega: debajo hay afiches viejos |  |
| 1:43.7 | Quiroz no apoyó al régimen. |  |  |
| 1:46.4 |  | **volante** — entra el volante |  |
| 1:46.5 | Militó un tiempo en un pequeño partido trotskista que lo criticaba con dureza. |  |  |
| 1:51.8 | En las aulas lo marcan profesores como Franklin Pease, y por ellos llega a Fernand Brodel, el historiador francés de las estructuras que duran siglos. |  |  |
| 1:52.0 |  | **capas** — el muro se apaga y se dibujan las capas |  |
| 1:52.0 |  |  | se va el ambiente ciudad |
| 1:52.0 |  |  | ambiente cuarto (0.5) |
| 1:57.1 |  | **braudel** — (con ficha) aparece la ficha |  |
| 2:02.0 | Esa idea, que hay cosas que no cambian aunque cambien los gobiernos, va a ser el centro de toda su obra. |  |  |
| 2:04.0 |  | **bajar** — la cámara baja hasta la capa que casi no se mueve (2.4 s) |  |
| 2:04.0 |  | _cámara: baja hasta la capa de las estructuras_ («hay cosas que no cambian aunque cambien los gobiernos») |  |

## s04 · primer hallazgo — `MecanismoDeuda` · 2:10.7–3:18.0 (67.3 s)

- **Cambio:** de 'la élite despilfarró el guano' a 'la deuda se infló desde adentro del Estado'
- **Intención:** yuxtaposición: la riqueza de las islas contra el papel que la vació; el mecanismo, paso a paso
- **Intensidad:** 4 · **Música:** presente (tensión)
- **Semáforo para enseñar:** 🔴 voz seguida 65 s · frase de 30 palabras · voz 90 %
- **Métricas:** voz el 90 % del tiempo · tramo más largo sin pausa de párrafo: 65.0 s · 148 palabras · 136 por minuto · 10 frases de 14.8 palabras en promedio (la más larga: 30) · 0 pausa(s) de párrafo (≥ 1 s) · 17 cambios de imagen
- **Nombres y cifras que se dicen (6):** Félix Denegri Luna · Estado · La · 1850 · 1980 · siete

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 2:10.7 |  |  | música s04-mecanismo.mp3 (nivel 0.4) |
| 2:10.7 |  |  | ambiente mar (0.8) |
| 2:10.9 |  | **islas** — el grabado de las islas |  |
| 2:11.0 | Un coleccionista de libros, Félix Denegri Luna, le sugiere mirar con más cuidado el siglo diecinueve. |  |  |
| 2:18.0 | Ahí encuentra su primer caso. |  |  |
| 2:20.3 |  | **sacos** — empiezan a subir sacos al barco |  |
| 2:20.5 | En mil ochocientos cincuenta, con la plata del guano entrando a las arcas, el Estado decide pagar su deuda interna: deudas que venían arrastrándose, algunas desde la época colonial. |  |  |
| 2:25.1 |  | **flecha** — barco y Estado: sale la flecha de dinero |  |
| 2:25.1 |  |  | se va el ambiente mar |
| 2:25.1 |  |  | ambiente cuarto (0.5) |
| 2:27.8 |  | **vales** — se apilan los vales de la deuda |  |
| 2:33.4 | A eso se le llamó la consolidación. |  |  |
| 2:34.8 |  | **consolidacion** — cae el sello sobre la pila |  |
| 2:36.1 | La promesa era que esos pagos crearían una clase de empresarios que invertiría en el país. |  |  |
| 2:36.2 |  | **promesa** — se dibuja en punteado lo que se prometía (una fábrica) |  |
| 2:42.6 | La versión aceptada decía que la élite simplemente había despilfarrado esa riqueza en lujos. |  |  |
| 2:42.7 |  | **lujos** — lo prometido se borra y se dibuja lo que se decía (lujos) |  |
| 2:49.5 | Quiroz revisó los expedientes y encontró otra cosa: el valor de la deuda se había inflado para enriquecerse a costa del Estado, y dentro del propio Estado había funcionarios cómplices. |  |  |
| 2:50.9 |  | **expedientes** — primer plano de un vale |  |
| 2:50.9 |  | _cámara: se acerca a un vale_ («revisó los expedientes»: la cámara mira de cerca, como él) |  |
| 2:54.5 |  | **inflado** — el monto sube (2.4 s) mientras la pluma marca |  |
| 2:57.5 |  | **caudal** — el Estado y el caudal hacia pocos bolsillos |  |
| 3:00.2 |  | **funcionarios** — se encienden las ventanas con funcionarios |  |
| 3:02.0 | No era solo derroche. |  |  |
| 3:02.2 |  | **frase** — primera línea a pantalla completa |  |
| 3:02.9 |  | **tachar** — se tacha la primera línea |  |
| 3:04.3 |  | **mecanismo** — aparece la segunda línea |  |
| 3:04.4 | Era un mecanismo. |  |  |
| 3:06.4 |  | **tesis** — portada de la tesis, a máquina |  |
| 3:06.5 | Lo presentó como tesis en mil novecientos ochenta, y siete años después lo publicó con un título que lo dice todo: La deuda defraudada. |  |  |
| 3:10.2 |  | **libro** — la tesis se vuelve libro |  |
| 3:14.9 |  | **titulo** — se estampa el título en la tapa |  |

## s05 · método — `AprenderAMedir` · 3:18.0–4:21.4 (63.4 s)

- **Cambio:** de un historiador de discursos a uno que mide
- **Intención:** la flecha duda en París y se va a Nueva York: el método antes que la moda
- **Intensidad:** 2 · **Música:** presente
- **Semáforo para enseñar:** 🔴 voz seguida 62 s · frase de 35 palabras · 12.6 datos/min · voz 91 %
- **Métricas:** voz el 91 % del tiempo · tramo más largo sin pausa de párrafo: 61.5 s · 146 palabras · 142 por minuto · 9 frases de 16.2 palabras en promedio (la más larga: 35) · 0 pausa(s) de párrafo (≥ 1 s) · 16 cambios de imagen
- **Nombres y cifras que se dicen (13):** París · Universidad de Columbia · Nueva York · Herbert Klein · Kenneth Maxwell · Perú · Grace · Baruch College · City University · New York · Estado · ochenta · cientos

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 3:18.0 |  |  | música s05-medir.mp3 (nivel 0.3) |
| 3:18.0 |  |  | ambiente ciudad (0.55) |
| 3:18.2 |  | **mapa** — aparece el mapa |  |
| 3:18.3 | A comienzos de los ochenta hace algo poco común. |  |  |
| 3:22.0 | Casi todos los historiadores peruanos soñaban con París. |  |  |
| 3:25.0 |  | **paris** — sale la ruta hacia la tentación |  |
| 3:25.9 | Él postula a la Universidad de Columbia, en Nueva York. |  |  |
| 3:26.4 |  | **duda** — la ruta se detiene, duda y se borra |  |
| 3:27.9 |  | **nuevayork** — sale la ruta hacia el destino |  |
| 3:30.1 | El historiador Hérbert Kláin lo acepta y le da una beca. |  |  |
| 3:30.1 |  | **ficha** — la cámara se acerca y se escribe la ficha |  |
| 3:30.1 |  | _cámara: se acerca a Nueva York_ (llega a Columbia: el viaje termina ahí) |  |
| 3:34.3 |  | **puntos** — papel milimetrado: caen los puntos (3 s) |  |
| 3:34.3 | Allí aprende historia cuantitativa: usar estadística, regresiones y computadoras para pensar el pasado con números, no solo con discursos. |  |  |
| 3:38.0 |  | **recta** — se traza la recta de regresión |  |
| 3:43.0 |  | **discursos** — los bloques de discurso se apagan |  |
| 3:44.2 | Y de otro profesor, Kénet Máxuel, aprende que la profundidad no sirve de nada sin claridad. |  |  |
| 3:44.3 |  | **balanza** — aparece la balanza |  |
| 3:47.5 |  | **profundidad** — cae la primera palabra (se inclina) |  |
| 3:49.7 |  | **claridad** — cae la segunda (se equilibra) |  |
| 3:50.8 | Se convierte en la mayor autoridad en historia financiera del Perú: bancos, crédito colonial, la casa Greis. |  |  |
| 3:50.8 |  | **estante** — aparece la repisa |  |
| 3:55.4 |  | **temas** — bajan los temas, uno cada 0.5 s |  |
| 3:58.6 | Termina como profesor en el Báruj Cólech y en la Síti Iunivérsiti de Niu Iork, donde forma a cientos de estudiantes. |  |  |
| 3:58.6 |  | **aulas** — el aula se va llenando |  |
| 4:06.5 | Sus ideas también se mueven: de aquel joven trotskista pasa a una postura liberal, convencido de que el país necesitaba igualdad de oportunidades y un Estado que dejara de ser el botín de unos pocos. |  |  |
| 4:06.5 |  | **brujula** — aparece la brújula |  |
| 4:09.4 |  | **giro** — la aguja gira despacio de una época a la otra |  |

## s06 · la pregunta — `LaPregunta` · 4:21.4–5:03.4 (42.0 s)

- **Cambio:** de una duda académica a una pregunta con pruebas
- **Intención:** la estática sugiere los videos sin mostrarlos; el mundo entero se pone a mirar
- **Intensidad:** 3 · **Música:** presente (tensión)
- **Semáforo para enseñar:** 🔴 voz seguida 40 s · frase de 29 palabras · 9.0 datos/min · voz 88 %
- **Métricas:** voz el 88 % del tiempo · tramo más largo sin pausa de párrafo: 39.7 s · 94 palabras · 141 por minuto · 6 frases de 15.7 palabras en promedio (la más larga: 29) · 0 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (6):** Historia de · Perú · Fujimori y Montesinos · Banco Mundial · Naciones Unidas · 2000

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 4:21.4 |  |  | música s06-pregunta.mp3 (nivel 0.32) |
| 4:21.4 |  |  | ambiente cuarto (0.5) |
| 4:21.7 | En el año dos mil publica un ensayo cuyo título suena a duda: Historia de la corrupción en el Perú: ¿es factible su estudio? |  |  |
| 4:23.6 |  | **titulo** — empieza a escribirse el título (11 letras por segundo) |  |
| 4:30.4 | Ese mismo año cae el régimen de Fujimori y Montesinos. |  |  |
| 4:30.4 |  | **tv** — corte al televisor que se enciende |  |
| 4:35.5 | Los vladivideos ponen frente a todo el país lo que siempre se había sospechado, y de pronto hay pruebas como nunca antes. |  |  |
| 4:43.8 | En el mundo, el tema también explota: el presidente del Banco Mundial llama a la corrupción un cáncer, y las Naciones Unidas empiezan a tratarla como un crimen transnacional. |  |  |
| 4:43.8 |  | **globo** — aparece el globo |  |
| 4:47.8 |  | **ficha1** — primera ficha |  |
| 4:51.0 |  | **ficha2** — segunda ficha |  |
| 4:56.3 | Quiroz tenía la pregunta. |  |  |
| 4:57.7 |  | **pregunta** — primera palabra a pantalla completa |  |
| 4:59.1 | Ahora tenía también las pruebas. |  |  |
| 5:00.7 |  | **pruebas** — segunda palabra |  |

## s07 · las objeciones — `Objeciones` · 5:03.4–6:29.3 (85.9 s)

- **Cambio:** de 'la corrupción no se puede estudiar' a 'se puede, y traba todo'
- **Intención:** cada objeción se da vuelta; el remate es físico: el engranaje se traba
- **Intensidad:** 5 · **Música:** protagonista → golpe → silencio
- **Semáforo para enseñar:** 🔴 voz seguida 80 s · frase de 30 palabras · voz 88 %
- **Métricas:** voz el 88 % del tiempo · tramo más largo sin pausa de párrafo: 79.9 s · 179 palabras · 129 por minuto · 15 frases de 11.9 palabras en promedio (la más larga: 30) · 1 pausa(s) de párrafo (≥ 1 s) · 18 cambios de imagen
- **Nombres y cifras que se dicen (5):** Congreso · Real Academia · Quiroz · 1729 · tres

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 5:03.4 |  |  | música s07-objeciones.mp3 (nivel 0.75) |
| 5:03.4 |  |  | ambiente cuarto (0.5) |
| 5:03.7 | Pero había un problema. |  |  |
| 5:06.7 |  | **tarjetas** — se reparten las cuatro tarjetas |  |
| 5:06.8 | Muchos académicos decían que la corrupción no se podía estudiar. |  |  |
| 5:11.4 | Daban tres razones, y una excusa. |  |  |
| 5:13.5 |  | **excusa** — la cuarta se aparta (es una excusa, no una razón) |  |
| 5:14.6 |  | **t1** — la tarjeta 1 pasa al centro |  |
| 5:14.6 | La primera: es secreta, nadie firma un recibo por una coima. |  |  |
| 5:19.9 | Quiroz respondió que los archivos están llenos de rastros: juicios, investigaciones del Congreso, denuncias y, sobre todo, cartas de diplomáticos extranjeros que les contaban a sus gobiernos lo que veían. |  |  |
| 5:20.3 |  | **r1** — se da vuelta: legajos |  |
| 5:28.4 |  | **sellos** — caen los sellos de embajada |  |
| 5:33.9 | La segunda: solo se pueden medir percepciones, lo que la gente cree. |  |  |
| 5:33.9 |  | **t2** — la tarjeta 2 pasa al centro |  |
| 5:39.1 | Él respondió que las percepciones se manipulan, y que con cuentas fiscales y estimados bien hechos se puede aproximar el costo real. |  |  |
| 5:39.2 |  | **r2** — se da vuelta: medidor contra libro de cuentas |  |
| 5:47.7 | La tercera: lo que hoy llamamos corrupción, antes era normal. |  |  |
| 5:47.7 |  | **t3** — la tarjeta 3 pasa al centro |  |
| 5:52.8 | Él respondió con un diccionario: en mil setecientos veintinueve la Real Academia ya definía el cohecho, el prevaricato y la corruptela. |  |  |
| 5:53.0 |  | **r3** — se da vuelta: diccionario |  |
| 5:59.6 |  | **entradas** — se subrayan las entradas, una tras otra |  |
| 6:03.1 | Sabían que estaba mal. |  |  |
| 6:05.3 | Y la excusa: que la corrupción es cultural, que está en la sangre. |  |  |
| 6:05.3 |  | **t4** — la tarjeta 4 pasa al centro |  |
| 6:10.4 | Para Quiroz eso no explicaba nada. |  |  |
| 6:12.2 |  | **r4** — se tacha |  |
| 6:13.3 |  | **engranaje** — corte al engranaje que gira |  |
| 6:13.4 | Durante décadas incluso se dijo que la corrupción era útil, un aceite que hacía funcionar a la burocracia. |  |  |
| 6:17.3 |  | **aceite** — cae una gota de aceite |  |
| 6:20.6 | Él pensaba lo contrario: no es aceite. |  |  |
| 6:21.6 |  | **corte** — corte seco: sin aceite |  |
| 6:24.7 | Es grava en el engranaje. |  |  |
| 6:24.8 |  | **grava** — cae la grava |  |
| 6:25.8 |  | **traba** — el engranaje se traba (el golpe fuerte) |  |
| 6:25.8 |  |  | **silencio deliberado** |
| 6:28.0 |  | **fin** — termina el silencio que sigue al golpe |  |
| 6:28.0 |  |  | vuelve el sonido |

## s08 · la cuenta — `LaCuenta` · 6:29.3–7:49.2 (79.9 s)

- **Cambio:** de una sospecha a una cifra: entre un tercio y dos quintos del gasto, siempre
- **Intención:** la banda de corrupción baja se queda vacía: el dato más fuerte es una ausencia
- **Intensidad:** 5 · **Música:** presente → silencio
- **Semáforo para enseñar:** 🔴 voz seguida 38 s · frase de 27 palabras · 6.9 datos/min · voz 85 %
- **Métricas:** voz el 85 % del tiempo · tramo más largo sin pausa de párrafo: 38.4 s · 173 palabras · 133 por minuto · 14 frases de 12.4 palabras en promedio (la más larga: 27) · 3 pausa(s) de párrafo (≥ 1 s) · 13 cambios de imagen
- **Nombres y cifras que se dicen (9):** Estado · Perú · 2000 · 1820 · treinta · cuarenta por ciento · tres y cuatro por ciento · dos · mitad

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 6:29.3 |  |  | música s08-cuenta.mp3 (nivel 0.32) |
| 6:29.3 |  |  | ambiente cuarto (0.45) |
| 6:29.6 | Con todo eso armó algo que nadie había hecho: una estimación del costo de la corrupción, década por década, desde la colonia hasta el año dos mil. |  |  |
| 6:36.3 |  | **decadas** — la regla de décadas se va marcando (4 s) |  |
| 6:41.3 | Sus números dicen esto. |  |  |
| 6:43.0 |  | **barra** — aparecen las cien unidades |  |
| 6:43.3 | Entre mil ochocientos veinte y dos mil, la corrupción se habría llevado, en promedio, entre el treinta y el cuarenta por ciento del gasto del Estado. |  |  |
| 6:49.7 |  | **rojo** — se tiñe el mínimo; un segundo después, el rango |  |
| 6:52.4 |  | **cae** — las unidades rojas se desprenden |  |
| 6:54.1 |  | **pib** — aparece la producción y pierde una franja cada año |  |
| 6:54.5 | Entre tres y cuatro por ciento de todo lo que producía el país, cada año. |  |  |
| 6:59.3 |  | **niveles** — gráfico de niveles: se traza la línea (5 s) |  |
| 6:59.6 | Clasificó cada época como de corrupción moderada, alta o muy alta. |  |  |
| 7:05.5 | No encontró ninguna de corrupción baja. |  |  |
| 7:07.6 |  | **baja** — la banda vacía parpadea; se marca el punto más bajo |  |
| 7:07.6 |  |  | **silencio deliberado** |
| 7:09.4 |  | **ni** — la banda vacía se queda |  |
| 7:09.4 |  |  | vuelve el sonido |
| 7:09.5 | Ni una, en casi dos siglos. |  |  |
| 7:12.5 | Y su conclusión más fuerte. |  |  |
| 7:14.7 |  | **crecer** — crece la barra de lo que hace falta para crecer |  |
| 7:14.8 | Para crecer de verdad, un país necesita que su producción suba entre cinco y ocho por ciento al año. |  |  |
| 7:22.1 |  | **corrupcion** — crece, en la misma escala, la barra roja de la corrupción |  |
| 7:22.1 | La corrupción se llevaba entre tres y cuatro por ciento. |  |  |
| 7:27.1 | Según su cuenta, el Perú perdió, o usó mal, cerca de la mitad de sus posibilidades de desarrollo. |  |  |
| 7:30.4 |  | **mitad** — aparece la conclusión |  |
| 7:36.2 | Él mismo advierte que son estimados preliminares, sujetos a revisión. |  |  |
| 7:36.3 |  | **nota** — aparece la nota al pie |  |
| 7:41.5 | Pero el punto no está en el decimal. |  |  |
| 7:44.6 | Está en que el patrón nunca se rompe. |  |  |
| 7:44.6 |  | **patron** — vuelve la línea de niveles entera: el patrón |  |

## s09 · el libro — `CirculosCorruptos` · 7:49.2–8:16.1 (26.9 s)

- **Cambio:** de un libro premiado a una frase que todos repetimos: 'roba, pero hace obra'
- **Intención:** el cartel de obra pública dice lo que el libro desarma: se tacha el PERO y queda la verdad
- **Intensidad:** 4 · **Música:** presente
- **Semáforo para enseñar:** 🟡 voz 81 %
- **Métricas:** voz el 81 % del tiempo · tramo más largo sin pausa de párrafo: 23.9 s · 55 palabras · 136 por minuto · 5 frases de 11.0 palabras en promedio (la más larga: 17) · 0 pausa(s) de párrafo (≥ 1 s) · 7 cambios de imagen
- **Nombres y cifras que se dicen (2):** Corrupt Circles · 2008

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 7:49.2 |  |  | música s09-circulos.mp3 (nivel 0.25) |
| 7:49.2 |  |  | ambiente ciudad (0.55) |
| 7:49.4 |  | **circulos** — los anillos empiezan a cerrarse (4 s) |  |
| 7:49.5 | El resultado fue Córrupt Sérkels, publicado en inglés en dos mil ocho. |  |  |
| 7:51.0 |  | **titulo** — aparece el título (y el año) |  |
| 7:54.5 |  | **red** — la red crece hacia afuera (6 s) |  |
| 7:54.6 | Ganó premios, se empezó a usar en todo el mundo, y dejó una crítica que todavía incomoda. |  |  |
| 8:01.5 | Contra quienes creen que la corrupción es inevitable en los países pobres. |  |  |
| 8:06.5 |  | **cartel** — se planta el cartel |  |
| 8:06.6 | Y contra esa frase que todos hemos escuchado alguna vez: |  |  |
| 8:11.4 |  | **frase** — se colocan las letras (1.4 s) |  |
| 8:11.4 | roba, pero hace obra. |  |  |
| 8:12.9 |  | **tachar** — se tacha una palabra |  |
| 8:14.3 |  | **roba** — todo se apaga menos la palabra que queda |  |

## s10 · la serie — `Denunciantes` · 8:16.1–9:05.5 (49.4 s)

- **Cambio:** de una lista de ladrones a una historia contada por los que denunciaron
- **Intención:** el que intentó limpiar y perdió abre la serie; el corte a negro es su derrota
- **Intensidad:** 3 · **Música:** presente → corte → protagonista
- **Semáforo para enseñar:** 🔴 voz seguida 27 s · frase de 47 palabras · 13.4 datos/min
- **Métricas:** voz el 79 % del tiempo · tramo más largo sin pausa de párrafo: 27.5 s · 93 palabras · 125 por minuto · 10 frases de 9.3 palabras en promedio (la más larga: 47) · 1 pausa(s) de párrafo (≥ 1 s) · 12 cambios de imagen
- **Nombres y cifras que se dicen (10):** Antonio de Ulloa · Huancavelica · Domingo Elías · Manuel González Prada · Jorge Basadre · Héctor Vargas Haya · 1758 · 2000 · tres mil · siete

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 8:16.1 |  |  | música s10-serie.mp3 (nivel 0.55) |
| 8:16.1 |  |  | ambiente viento (0.8) |
| 8:16.3 |  | **lista** — aparece la lista |  |
| 8:16.4 | Pero el libro no es una lista de ladrones. |  |  |
| 8:19.5 | Está contado desde los que denunciaron. |  |  |
| 8:21.0 |  | **tacha** — la lista se tacha |  |
| 8:21.9 |  | **cordillera** — la lista se va y se dibuja la cordillera (3 s) |  |
| 8:22.3 | Empieza con Antonio de Ulloa, un marino y científico español que en mil setecientos cincuenta y ocho llegó a gobernar Huancavelica, a más de tres mil quinientos metros de altura, a cargo de la mina de mercurio de la que dependía la plata de todo el virreinato. |  |  |
| 8:30.3 |  | **huanca** — el punto rojo baja al lugar; se escribe la ficha |  |
| 8:32.0 |  | **altura** — línea y escala de altura |  |
| 8:36.1 |  | **mercurio** — cae la gota de mercurio |  |
| 8:38.3 |  | **plata** — la gota se vuelve barra de plata |  |
| 8:40.7 |  | **limpiar** — un brillo barre la barra |  |
| 8:40.8 | Intentó limpiarla. |  |  |
| 8:43.1 | Y perdió. |  |  |
| 8:43.9 |  | **perdio** — corte a negro de 10 cuadros |  |
| 8:43.9 |  |  | se va el ambiente viento |
| 8:45.2 | Después vienen otros: Domingo Elías, Manuel González Prada, Jorge Basadre, Héctor Vargas Haya. |  |  |
| 8:46.9 |  | **otros** — primer nombre |  |
| 8:46.9 |  |  | ambiente cuarto (0.45) |
| 8:53.2 | Siete capítulos. |  |  |
| 8:53.2 |  | **capitulos** — el índice: se enciende un capítulo cada 0.62 s |  |
| 8:55.2 | Siete ciclos. |  |  |
| 8:56.8 | Del virreinato al año dos mil. |  |  |
| 8:59.5 |  | **serie** — todo encendido |  |
| 8:59.5 | Eso es esta serie. |  |  |

## s11 · cierre — `Cierre` · 9:05.5–9:36.5 (31.0 s)

- **Cambio:** de la muerte del autor a la promesa de leerlo
- **Intención:** vuelve la pila del inicio, ahora limpia: el libro terminado; recién aquí suena el tema del canal
- **Intensidad:** 2 · **Música:** ausente → tema del canal
- **Semáforo para enseñar:** 🟡 12.0 datos/min
- **Métricas:** voz el 69 % del tiempo · tramo más largo sin pausa de párrafo: 18.3 s · 54 palabras · 130 por minuto · 5 frases de 10.8 palabras en promedio (la más larga: 24) · 1 pausa(s) de párrafo (≥ 1 s) · 5 cambios de imagen
- **Nombres y cifras que se dicen (5):** Marcos Cueto · Río de Janeiro · Huancavelica · 2013 · 1758

| t | Voz | Imagen | Sonido |
|---|---|---|---|
| 9:05.5 |  |  | ambiente cuarto (0.5) |
| 9:05.8 | Marcos Cueto terminó el prólogo en Río de Janeiro, en febrero de dos mil trece, un mes después de la muerte de su amigo. |  |  |
| 9:06.1 |  | **limpiar** — (con limpiar) las correcciones rojas se desvanecen (4 s) |  |
| 9:07.9 |  | **ficha** — (con ficha) empieza a escribirse la ficha |  |
| 9:14.3 | Lo cerró con una confesión: que siempre había querido ser como él. |  |  |
| 9:19.7 | Nosotros vamos a hacer algo más modesto. |  |  |
| 9:19.9 |  | **cerrar** — la tapa empieza a cerrarse (1.6 s) |  |
| 9:22.9 | Vamos a leerlo. |  |  |
| 9:24.4 |  | **negro** — fundido a negro |  |
| 9:24.4 |  |  | música s11-tema.mp3 (nivel 0.55) |
| 9:24.4 |  |  | se va el ambiente cuarto |
| 9:25.4 |  | **tarjeta** — aparece la tarjeta (con la nota final) |  |
| 9:25.5 | Próximo episodio: Huancavelica, mil setecientos cincuenta y ocho. |  |  |

