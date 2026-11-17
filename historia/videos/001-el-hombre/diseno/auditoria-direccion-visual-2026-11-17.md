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
| 1 | s03, 2:22 | La pregunta de la serie es una esquina que se despega, ~2,5 s antes del corte | Despegar el afiche entero, que asome uno viejo igual de prometedor (ilustrativo), quietud ~2 s antes del corte | Pendiente |
| 2 | s06, 4:47–5:15 | El grabado del guano quedaba 0,74 s a pantalla completa; 7 s de libro cerrado sin texto; el monto se inflaba antes de que llegara su vale | Reparto nuevo de los beats y fichas del libro (abajo) | **Hecho** |
| 3 | s02 | La escena de intensidad 1 es la más activa y saturada del video | Calmar el agua (amplitud de reflejos y cáusticas), una sola variable | Pendiente |
| 4 | s03 | El rojo se gasta en el muro (7,1 % durante 30 s) antes del rojo de la culpa en s06 (2,9 %) | Apagar primero los recortes rojos del fondo del muro; el afiche aprobado lo decide Gerson | Pendiente |
| 5 | s01, 1:07–1:20 | La línea de tiempo no se lee en miniatura (luminancia 25 contra fondo 25) | Escalar la línea y sus rótulos, aclararla | Pendiente |
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

## Guion de prueba con otra persona

Mostrar el video una vez, sin contexto. Preguntar: «¿Qué encontró Quiroz?», «¿Qué pregunta quedó abierta
cuando aparece la pizarra?», «¿De dónde salía la plata y adónde iba?», «¿Qué te llamó más la atención?».
No anticipar ni corregir.
