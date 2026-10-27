---
name: direccion-historia
description: Dirección de los videos de Historia del Altiplano (historia/): cómo se escribe el guion, cómo se dice, cómo se ve y cómo suena, para que cada video golpee y no suene a video genérico hecho por IA. Úsalo antes de escribir o revisar un guion.md, al llenar escenas.json (intensidad, cambio, intencion, beats, audio), al diseñar una escena en Remotion, al preparar la grabación de voz y como pase final antes de renderizar.
---

# Dirección — Historia del Altiplano

Este archivo es el criterio del artista. No describe el código (eso está en `historia/README.md`):
dice **qué buscamos y cómo se decide** cuando hay dudas. Cada regla tiene un porqué y una prueba
que se puede hacer sin opinar.

Lo que buscamos, en una línea: **que alguien sienta algo por una persona real del pasado, y que se
quede con un dato que lo incomode.** Si el video informa pero no se siente, falló. Si se siente pero
el dato no aguanta una fuente, falló peor.

---

## 0. El orden de lo que importa

Walter Murch ordena así lo que pesa en un corte: emoción, historia, ritmo, recorrido del ojo, plano
de pantalla, espacio 3D. Si hay que sacrificar algo, se sacrifica de abajo hacia arriba; la emoción
se protege a toda costa, porque al final la gente recuerda cómo se sintió.

Para nosotros eso se traduce en:

1. **Verdad** — el dato tiene fuente en `fuentes.md`. Esto no se negocia nunca, ni por ritmo ni
   por emoción. (Es lo único que ponemos por encima de Murch.)
2. **Emoción** — ¿qué siente el espectador en esta escena? Una palabra: inquietud, ternura, rabia,
   asombro, vergüenza.
3. **Historia** — ¿qué cambió entre el inicio y el final de la escena?
4. **Ritmo** — ¿respira? ¿hay un momento quieto antes del golpe?
5. **Imagen** — ¿se lee de un vistazo? ¿el ojo sabe dónde mirar?
6. **Adorno** — texturas, partículas, brillo. Lo primero que se corta.

Cuando dos decisiones chocan, gana la que está más arriba en la lista.

---

## 1. Quién habla (la voz de la serie)

No somos un canal de "datos curiosos" ni un locutor de documental de cable. Somos **una persona
peruana que leyó el libro, revisó las notas al pie y te lo cuenta en la sobremesa**, con calma y con
bronca contenida.

- **Tiene postura.** Decimos "Quiroz encontró algo peor", no "existen diversas interpretaciones".
  La neutralidad tibia es la primera marca de un guion genérico.
- **Muestra su duda.** Cuando la fuente estima, decimos que estima: "explicaría", "según Quiroz",
  "cerca de la mitad". Mostrar dónde termina lo que sabemos da más autoridad, no menos.
- **Habla peruano sin disfrazarse.** "Plata", "la Católica", "sacarle la cuenta", "roba pero hace
  obra": sí, porque así lo diría quien narra. Jerga forzada o chistes para "conectar": no.
- **Respeta a los muertos y desconfía de los poderosos.** Las personas no son villanos de caricatura;
  los mecanismos sí se nombran con su nombre (deuda inflada, coima, cuenta en Londres).
- **Nunca le habla al espectador desde arriba.** Nada de "como todos sabemos" ni "seguramente no
  sabías que". Le hablamos a alguien inteligente que todavía no conoce esta historia.

---

## 2. El guion

### 2.1 Cada escena gira

Robert McKee: una escena que termina con el mismo valor con el que empezó es un "no-evento"; casi
siempre existe solo para dar información, y un escritor disciplinado la corta y pone esa
información en otro lado.

En `escenas.json` esto ya tiene un campo: **`cambio`**. Se llena siempre como **"de X a Y"**, y X e
Y tienen que tener cargas distintas (algo que mejora o empeora, se revela o se pierde).

| Bien | Mal |
|---|---|
| "de 'la élite despilfarró el guano' a 'el Estado ayudó a saquearse a sí mismo'" | "se explica el guano" |
| "de un desconocido a alguien que pelea contra el tiempo por un libro" | "presentación del personaje" |

**Prueba:** si no puedes escribir el `cambio` de una escena en una línea, la escena todavía no
existe; es un párrafo de enciclopedia.

### 2.2 Entre escenas: "pero" o "por eso", nunca "y entonces"

Trey Parker y Matt Stone (South Park): si entre los momentos de tu historia cabe "y entonces", la
historia es aburrida; entre cada momento tiene que caber "pero" o "por eso".

**Prueba:** escribe el conector entre cada par de escenas del guion. Ejemplo con el 000:

```
s01 Un historiador se muere terminando un libro.
    → ¿PERO quién era?
s02 Un nadador terco que entró a la Católica en contra del gobierno militar.
    → POR ESO su primera investigación fue contra la versión oficial:
s03 La deuda del guano no se despilfarró: se infló a propósito.
    → POR ESO se hizo una pregunta más grande:
s04 ¿Se puede estudiar la corrupción en el Perú? Sí, y explicaría la mitad de lo que no crecimos.
    → POR ESO esta serie:
s05 Siete épocas, capítulo por capítulo.
    → PERO él no llegó a verlo:
s06 Nosotros sí podemos leerlo.
```

Si un conector solo puede ser "y además", esa escena se fusiona con otra o se va.

### 2.3 El gancho (los primeros 10–15 segundos)

- **Abre con una persona en un momento concreto**, no con contexto. "Nueva York, fines de 2012. Un
  historiador peruano se está muriendo." Fecha, lugar, persona, problema. Nada de "La corrupción
  es un problema que ha afectado al Perú desde…".
- **Abre un bucle que no cierras todavía.** En s01, "un libro" (¿cuál?, ¿sobre qué?) se cierra
  recién en s04. Los guías de retención coinciden en algo que nosotros ya aplicamos: cada respuesta
  debe abrir una pregunta más grande, y la respuesta grande se reparte por partes.
- **Prohibido en el gancho:** "¿Sabías que…?", "En este video vamos a ver…", "Hola, bienvenidos",
  el logo, la suscripción, cualquier frase que podría abrir cualquier otro video.
- **Prueba:** si tapas el título del video, ¿los primeros 10 s te dejan con una pregunta concreta
  en la cabeza? Escríbela en el guion como comentario (`<!-- bucle: ¿qué libro? -->`).

### 2.4 Anécdota y reflexión, alternadas

Ira Glass (This American Life): una historia tiene dos bloques — la **anécdota** (una cosa pasa,
luego otra; eso solo ya genera suspenso) y el **momento de reflexión** (para qué te conté esto).
Hacen falta los dos, y en una buena historia se va y se vuelve entre ellos.

En nuestros videos: dos o tres frases de hechos, una frase que dice lo que significan. Nunca dos
reflexiones seguidas: eso ya es un sermón. La reflexión más fuerte del video va **una sola vez** y
se prepara con silencio (ver 4.3).

### 2.5 Concreto le gana a abstracto, siempre

| Abstracto (genérico) | Concreto (nuestro) |
|---|---|
| "recursos naturales" | "el guano" |
| "documentos históricos" | "cartas de diplomáticos, juicios, archivos secretos" |
| "las élites de la época" | "los consolidados" / un nombre propio |
| "una gran suma de dinero" | "de 4,8 a 23,2 millones de pesos" [con fuente] |
| "a lo largo de la historia" | "del virreinato al año 2000" |

Un número, un nombre, un objeto, un lugar o una fecha por frase, como mínimo. Si una frase no tiene
ninguno, sospecha de ella.

### 2.6 Escribir para el oído

- **Una idea por frase.** Si la frase necesita una coma para respirar dos veces, son dos frases.
- **Frases de largo distinto.** Tres frases del mismo largo seguidas suenan a máquina. Mete una de
  tres palabras: "Y en contra de él."
- **Los números se dicen redondos** ("cerca de la mitad", "casi cinco veces") y se muestran exactos
  en pantalla. La voz da la sensación; la pantalla da la cifra.
- **Ritmo de referencia:** ~150 palabras por minuto. Una escena de 20 s aguanta ~50 palabras;
  si tiene 70, sobra algo.
- **Prueba obligatoria:** léelo en voz alta antes de grabar. Donde te trabas, reescribe. Donde te
  aburres, corta.

### 2.7 Lista negra: lo que suena a IA

Ninguna palabra sola delata a una máquina; delata el **patrón**: conectores de manual, frases del
mismo largo, adjetivos de elogio vacíos, cierres que repiten el inicio. Esta lista se revisa con
`grep` antes de grabar (ver sección 7).

**Frases y conectores prohibidos en la voz:**
"en resumen", "en conclusión", "cabe destacar", "cabe mencionar", "es importante (tener en cuenta /
señalar)", "vale la pena señalar", "sin duda", "ciertamente", "dicho esto", "por otro lado",
"en el contexto actual", "a lo largo de la historia", "desde tiempos inmemoriales", "en un mundo
donde", "sumérgete / sumerjámonos", "acompáñanos en este viaje", "un viaje fascinante",
"descubre", "¿alguna vez te has preguntado…?", "no es solo X, es Y" (más de una vez por video).

**Palabras sospechosas** (usar solo si no hay otra más exacta):
fascinante, crucial, esencial, vital, profundo, increíble, impactante, clave, complejo, rico,
vibrante, transformador, innovador, desafíos, panorama, paisaje (en sentido figurado), legado,
tapiz, entramado, sombras (del pasado), oscuro (secreto).

**Patrones de estructura que delatan:**
- Tríadas automáticas: "audaz, visionario e implacable". Una sola palabra exacta vale más.
- Preguntas retóricas en cadena. Una pregunta por video que importe; la nuestra es la de s04.
- Cierre-moraleja que repite lo ya dicho ("Y así, la historia de Quiroz nos enseña que…").
- Adjetivos que le dicen al espectador qué sentir ("una conclusión **que incomoda**", "un dato
  **escalofriante**"). Si el dato incomoda, el espectador se va a incomodar solo. Muéstralo, no lo
  anuncies.
- Generalidades sin sujeto: "muchos historiadores creen". ¿Quiénes? Si no lo sabemos, no va.

### 2.8 Rigor que se nota

- Todo dato de voz o pantalla vive en `fuentes.md` con su estado. Mientras diga `[VERIFICAR]`, el
  video es prototipo.
- **Nunca inventar una cita.** Si ponemos algo entre comillas en pantalla, es textual y tiene
  página. Si es paráfrasis, va sin comillas.
- Atribuir cuando la afirmación es de un autor: "según Quiroz", "Quiroz calculó". Esto además
  humaniza: la serie es una conversación con un historiador, no una verdad sin dueño.
- Evitar el presentismo cómodo: juzgamos mecanismos (inflar una deuda, comprar un juez) con las
  reglas de su época cuando importa decirlo.

---

## 3. La voz (narración)

La voz la graba Gerson. La TTS provisional es solo para medir tiempos; **no se publica nunca** un
video con ella. Una voz sintética con cadencia de metrónomo y sin respiración es justamente la
señal que la gente (y YouTube) asocia con contenido en serie.

- **Contar, no leer.** Ensayar con la animación corriendo (Studio) antes de grabar. Un narrador de
  documental bueno adapta el ritmo a la imagen sin dejar de sonar natural.
- **Calma, no drama.** El documental pide claridad y calma; el énfasis exagerado le resta peso al
  dato. Si la frase es fuerte, se dice más bajo, no más alto.
- **Una palabra de énfasis por frase**, como máximo. Marcarla en el guion de grabación en
  **negritas**.
- **Pausas escritas:** `/` pausa corta (respiración), `//` pausa larga (≥1 s, antes de un dato o
  un giro). En `voz_provisional.txt` se traducen a `[PAUSA n]`.
- **Respiraciones se quedan.** No limpiar la voz hasta dejarla sin aire; eso es lo que la hace humana.
- **Grabar por escena** (`s01.wav`, `s02.wav`…), varias tomas, y elegir la que suene a que te
  importa. Después cuadrar los beats con la palabra justa y poner `"beats_ajustados": true`.

---

## 4. La imagen

### 4.1 Una idea visual por escena

El campo **`intencion`** de cada escena es su metáfora visual, en una línea. Si una escena tiene
dos ideas visuales, se divide o se elige una.

Ejemplos del 000 que funcionan porque **la imagen dice algo que la voz no dice**:
- s02: "el carril de piscina se vuelve renglón contable" — la misma disciplina, otro terreno.
- s05: "cada época ocupa el ancho de sus años" — el largo de un período también es un dato.

**Prueba:** quita la voz. ¿La imagen sola sigue contando algo? Si solo ilustra lo que se dice
(dicen "libro", aparece un libro), es decoración.

### 4.2 Reglas de pantalla

- **El texto en pantalla no repite la voz palabra por palabra.** Muestra lo que la voz no puede
  dar: la fecha exacta, la cifra exacta, el nombre completo, la cita textual.
- **Tiempo de lectura:** máximo 17 caracteres por segundo (el estándar de Netflix para subtítulos
  en español de adultos), máximo 42 caracteres por línea y 2 líneas. Un rótulo de 34 caracteres
  necesita al menos 2 s quieto en pantalla.
- **Algo cambia cada 6–20 segundos**: información, emoción, estado visual o lo que está en juego.
  Pero el cambio tiene motivo; no se mueve la cámara para "mantener la atención".
- **El ojo sabe dónde mirar:** un solo elemento entra a la vez; lo demás espera o se atenúa.
- **Paleta con significado:** `papel` y `ocre` son el archivo y el tiempo; **`rojo` es solo para
  la culpa** (la deuda inflada, la flecha hacia el Estado, la mitad que no tuvimos). Si el rojo
  aparece en todo, ya no significa nada.
- **Todo animado, sin fotos de stock ni metraje genérico.** Si se usa un documento o grabado de
  época, tiene que ser de dominio público y estar en la tabla de assets de `fuentes.md`.

### 4.3 Movimiento con peso

Cada animación declara su peso (`src/direction/easings.ts`); nunca un easing global.

| Peso | Para qué | Sensación |
|---|---|---|
| `solemne` | títulos, revelaciones, fechas clave | algo importante llega |
| `pesado` | mapas, bloques grandes | el mundo se mueve |
| `natural` | movimiento general | nadie lo nota, y está bien |
| `ligero` | partículas, detalles, acentos | aire |
| `tenso` | aceleración hacia un corte brusco | algo se va a romper |

- **Quietud antes del golpe.** Antes de la revelación de una escena, 0,5–1,5 s donde nada se mueve.
  El espectador necesita ese hueco para sentir que viene algo.
- **Lo importante entra lento y sale rápido.** Lo que importa se queda; lo que estorba desaparece.

---

## 5. El sonido

El silencio también es sonido. Después de un paisaje sonoro denso, el silencio repentino pone al
espectador en alerta y puede provocar una respuesta emocional; pero quitar el ambiente sin motivo
aplana el espacio y hace que los cortes se sientan bruscos. Por eso el silencio es **una
herramienta escasa**: una vez por video, antes del dato más fuerte (en el 000, entre `apagar` y
`barra` de s04).

- **Estados de la música** (campo `estado_musica`): ausente → presente → tensión → silencio →
  golpe → protagonista → se apaga. La música es protagonista **solo** cuando la voz calla o casi
  calla.
- **`duck_db` entre −12 y −18**: la voz siempre se entiende a la primera.
- **Cortes J/L** entre escenas (el sonido de la siguiente entra antes que su imagen): conectan sin
  avisar. Ya están en el motor; no hay que hacer nada.
- **Los efectos son acentos, no alfombra.** Un efecto por beat como máximo, y solo si el beat es
  una acción (sello, hoja, pluma, golpe).
- Todo el audio es propio (`scripts/generar_audio.py`). Música de librería que suena en mil videos
  es otra forma de sonar genérico.

---

## 6. La curva del video

Cada escena tiene **`intensidad`** de 1 a 5. La curva del video completo **no puede ser plana**
ni subir en línea recta: tiene que bajar para poder volver a subir.

El 000: `3 · 2 · 3 · 4 · 5 · 2` — gancho, respiro con el personaje, primer hallazgo, la pregunta,
la serie (máximo), cierre en voz baja.

Reglas:
- La escena de mayor intensidad no es la primera ni la última.
- Después de un 4 o 5 viene un respiro (≤3) o el final.
- El cierre baja. Un video que termina gritando no deja eco; uno que termina en voz baja, sí.
- **El final regresa al inicio** cambiado (s06 vuelve a la pila de páginas de s01, ahora cerrada).
  El círculo da sensación de obra terminada, no de clip cortado.

---

## 7. Pase final: ¿suena a nosotros o a cualquiera?

Antes de grabar la voz y antes de renderizar, recorrer esta lista. **Si fallan tres o más, se
reescribe**, no se maquilla.

**Guion**
- [ ] Los primeros 10 s tienen persona + lugar + fecha + problema, y dejan una pregunta concreta.
- [ ] Cada escena tiene `cambio` "de X a Y" con cargas distintas.
- [ ] Entre cada par de escenas cabe "pero" o "por eso".
- [ ] Cada frase tiene al menos un nombre, número, objeto, lugar o fecha.
- [ ] Ninguna frase de la lista negra (2.7). Comprobar con:
      `grep -inE "en resumen|en conclusión|cabe (destacar|mencionar)|es importante|vale la pena|sin duda|ciertamente|dicho esto|por otro lado|fascinante|crucial|esencial|sumérg|viaje|a lo largo de la historia|en un mundo donde|¿alguna vez|legado|tapiz|entramado" historia/videos/*/guion.md`
- [ ] Ningún adjetivo le dice al espectador qué sentir.
- [ ] Una sola reflexión grande, preparada con silencio.
- [ ] Leído en voz alta sin trabarse.

**Verdad**
- [ ] Cero `[VERIFICAR]` en `fuentes.md` (si no, es prototipo y se dice en el título del archivo).
- [ ] Toda cita entre comillas es textual y tiene página.
- [ ] Las estimaciones suenan a estimación.

**Imagen y sonido**
- [ ] Cada escena tiene `intencion` y la imagen dice algo que la voz no dice.
- [ ] Ningún rótulo pasa de 17 caracteres por segundo.
- [ ] El rojo solo aparece donde hay culpa.
- [ ] Hay un momento quieto antes de cada revelación.
- [ ] La curva de `intensidad` sube, baja y vuelve a subir; el cierre baja.
- [ ] Un solo silencio total en el video, antes del dato más fuerte.
- [ ] La voz es la de Gerson, con sus respiraciones.

**La prueba de fuego:** si cambias "Perú" por otro país y "Quiroz" por otro nombre, ¿el guion
sigue funcionando igual? Si sí, es genérico. Un guion nuestro solo puede ser sobre esta persona.

---

## 8. Revisión aplicada al 000 (para calibrar el criterio)

Lo que ya funciona y no se toca:
- **s01** abre con muerte, libro y "los días extra": persona, fecha, lugar, problema, bucle abierto.
- **s02** "Y en contra de él." — frase corta que rompe el ritmo y le da postura al personaje.
- **s03** "Quiroz encontró algo peor" — un "pero" limpio contra la versión oficial.
- **s05** termina con la pregunta de la serie y un peruanismo exacto ("hace obra").
- **s06** cierra en voz baja y vuelve al libro del inicio.

Lo que se puede afilar (propuestas, decidir con la voz grabada):
- **s04 · "una conclusión que incomoda"** — anuncia la emoción en vez de provocarla (2.7). Probar:
  "Su respuesta fue un libro. // Y una cifra: la corrupción explicaría cerca de la mitad del
  desarrollo que este país nunca tuvo." El silencio y la barra a medias ya hacen el trabajo.
- **s04 · "una pregunta que nadie había tomado en serio"** — es una afirmación fuerte sin fuente
  (2.8). O se respalda en `fuentes.md`, o se cambia por algo comprobable ("una pregunta que los
  historiadores solían esquivar", con fuente) o por algo de él ("una pregunta que él mismo dudaba
  que se pudiera responder", si su prólogo lo dice).
- **s01 · "No pide más tiempo para vivir: pide más tiempo para terminar un libro"** — es la
  estructura "no es X, es Y". Aquí se gana el lugar porque es el corazón del gancho; por eso **no
  se puede volver a usar** en el resto del video.
- **s05 · "Con sus fuentes y con sus cifras"** — bien como promesa, pero es la única frase del
  video sin nada concreto. Si cabe, nombrar una fuente que vendrá ("cartas de virreyes, juicios
  de residencia, cuentas en Londres").
- **Bucles:** el 000 abre "¿qué libro?" (s01) y lo cierra en s04. Falta un bucle hacia el
  capítulo siguiente que no sea solo la tarjeta "Próximo": la pregunta de s05 ya lo es; que la
  tarjeta de s06 la recoja con un dato del capítulo 1750 en vez de solo el título.

---

## 9. Cuándo romper estas reglas

Cuando el video sea mejor rompiéndolas, y puedas decir por qué en una línea. Esa línea se escribe
en la `intencion` de la escena. Una regla rota a propósito es estilo; una regla rota por descuido
es el video genérico que queremos evitar.

Las fuentes de este criterio y lo que dice cada una están en
[referencias.md](referencias.md).
