# Informe · Laboratorio 16 · Animatic de la escena 3 del 0·3

20 de noviembre de 2026. Render técnico correcto y revisión visual del agente; **sin aprobación de Gerson**.

## Qué se probó

Si el storyboard versión 2 funciona sobre la voz real de la escena 3 («El expediente de Novoa», 94,9 s), y cuánto aportan sus dos decisiones de ritmo: el momento reservado de la cifra (A frente a B) y los respiros de montaje (B frente a C). Cámara quieta en las tres. Ver el [README](README.md).

## Medido

| Versión | Cuadros | Duración (ffprobe) | Render | Archivo |
|---|---:|---:|---:|---:|
| A | 2848 | 94,96 s | 128,5 s | 12,0 MB |
| B | 2848 | 94,96 s | 123,1 s | 12,1 MB |
| C | 3073 | 102,44 s | 134,9 s | 13,0 MB |

Máquina: contenedor de la sesión en la nube (Intel Xeon 2,3 GHz, 4 hilos, 16,9 GB), concurrencia 4, escala 0,5 (960 × 540), 30 fps, H.264 `veryfast`. Registros en `resultados/render-*.json`. Sonoridad de C: −16,3 LUFS integrados. En C, `silencedetect` (−45 dB, ≥ 0,9 s) encuentra los respiros de 1 s después de cada párrafo, donde los pide el storyboard.

## Observado

- La versión B se distingue de A en los cuadros: en «Días después» la mesa queda vacía y el vale aparece solo; en A la cifra entra encima de los folios de Elías y de la respuesta y compite con ellos (hoja de cuadros en `resultados/hoja.jpg`).
- Primera pasada con cuatro defectos, corregidos antes del render: el rótulo de versión tapaba el tintero; la ficha de la abolición se salía por la derecha; «500 personas esclavizadas» iba en rojo, que el canal reserva al corrector y a la culpa; los renglones de la carpeta se montaban sobre la escritura del papel.
- Queda justo: «500 personas esclavizadas» roza el borde derecho de la hoja de la carpeta.
- En C, los respiros son silencio digital y las pausas de la toma traen el aire de la sala: el fondo se corta al entrar al respiro. En el episodio, los respiros se rellenan con el aire de la toma (como hace `scripts/narracion.py`).

## Decisión de Gerson y versión D (20 de noviembre de 2026)

Gerson eligió la versión C con la entrada del vale de A («la cifra se sentía distinta»). Es la versión D: mesa vacía en «Días después», el vale entra deslizándose solo y sin halo, y los respiros de C. Además pidió dos reglas, aplicadas en D y en el storyboard: sombra negra en todo texto sobre el fondo y una etiqueta de dueño o responsable encima de cada documento.

Medido: D, 3073 cuadros, 102,44 s (ffprobe), render de 295,4 s en el mismo contenedor y con la misma configuración. Más del doble que C (134,9 s); la causa probable es la sombra de los textos (`filter: drop-shadow`, que se calcula en cada cuadro), pero no se midió aparte. Si pesa en la laptop, la alternativa es `text-shadow`, que es más barata.

## Auditoría estética de la versión D (skill estructura-visual-motion, 20 de noviembre de 2026)

Gerson: «se ve bien, se entiende, funciona, pero algo no cuadra estéticamente». Veredicto: **se entiende, sí; se siente, a medias.** El problema dominante es de acabado (capa de material), no de historia ni de ritmo.

Pruebas aplicadas (medido u observado sobre `animatic-s03-D.mp4`): hoja de contactos a 1/3 fps; miniatura; escala de grises; mapa de saturación; actividad cuadro a cuadro a 4 fps; tramos de cambio a 5 fps (29–31 s, 53–57 s, 59–61 s, 66–68 s). Pendiente: la prueba con otra persona («¿qué ocurrió?, ¿cuándo lo entendiste?»).

| # | Observación | Medida o evidencia | Cambio (versión) |
|---|---|---|---|
| 1 | La mesa domina el color | saturación media: madera 195, vale 71 (HSV, 0–255); la madera ocupa ~70 % del cuadro | Mesa desaturada y bordes más oscuros (E1) |
| 2 | Cada persona aparece dos veces (ficha arriba y etiqueta del papel) | 3.3 y 3.5: cuatro cajas y tres medallones en la mitad superior | Una sola presentación: la etiqueta del papel lleva nombre y cargo (E2) |
| 3 | Composición chica, frontal y quieta; el vale cambia tres veces de lugar | papeles ≈ 1/3 del ancho; 8 % de cuadros con movimiento; tramos quietos de hasta 22 s | Papeles más grandes, asimetría, vale fijo (E3) |
| 4 | Papeles «fantasma» y objetos que se esfuman | 29,8 s y 67,8 s: folio semitransparente deslizándose; la carpeta se disuelve y deja la mesa vacía 0,4 s | Opacos, entran y salen con trayecto (E4) |
| 5 | Los papeles flotan | sombra única grande y difusa (12/16/12 px) igual en todos; nunca se solapan | Sombra de contacto + sombra suave chica; el folio de Elías bajo el vale en 3.5 (E4) |
| 6 | Texto pegado | negro digital nítido sobre papel dibujado | Texto como tinta (multiply, sepia oscuro) (E5) |
| 7 | Las etiquetas parecen interfaz | en miniatura, cajas negras como barras de censura | Alternativa: tira de cartón (E6), frente a la caja negra pedida |
| 8 | Tres folios idénticos (Elías, Echenique, Novoa) | misma imagen, solo los distingue la etiqueta | Pendiente: papeles distintos por función (pedir a ChatGPT) |
| 9 | Todas las entradas iguales (de lado, mismo peso) | observado | Pendiente para la versión final |

Lo que funciona y no se toca: contraste de valor papel/madera (205 frente a 90 en grises), la cifra sola sobre la mesa vacía, los medallones y la etiqueta de dueño.

Al armar E3 aparecieron choques nuevos (etiqueta de Echenique fuera del cuadro, etiquetas de lo recibido y del vale encimadas, fichas sobre la carpeta) y se corrigieron solo en las capas E2 y E3, sin tocar A a D.

### Render de E1–E6 (medido)

| Versión | Duración | Render | Archivo |
|---|---:|---:|---:|
| E1 | 102,43 s | 358,1 s | 13,2 MB |
| E2 | 102,43 s | 365,0 s | 13,3 MB |
| E3 | 102,43 s | 411,3 s | 12,5 MB |
| E4 | 102,43 s | 600,3 s | 12,5 MB |
| E5 | 102,43 s | 717,5 s | 12,5 MB |
| E6 | 102,43 s | 737,8 s | 12,5 MB |

Mismo contenedor y configuración. El costo sube con la física (sombras dobles con `drop-shadow`) y con la tinta (`mix-blend-mode`); en la laptop hay que medirlo antes de elegir. Hoja comparativa: `resultados/versiones-D-E6.jpg`.

Observado en E4 (29–31 s, 57–60 s, 67–68 s): ya no hay papeles semitransparentes ni objetos que se esfuman. Queda un choque nuevo en E3–E6: en 3.5, al volver el folio de Elías junto al vale, su etiqueta queda debajo de la del vale (67,8 s). Se corrige en la versión que se elija.

## Notas de Gerson sobre E6 (21 de noviembre de 2026)

Eligió E6 e hizo tres observaciones. Las tres quedaron corregidas.

1. **Etiquetas pisadas en 3.5, hacia el segundo 81.** Cuando el folio de Elías volvía junto al vale, su etiqueta quedaba bajo la del vale y el medallón de Novoa la tapaba. Ahora el folio vuelve más abajo (150, 420, ancho 450) y su etiqueta se acorta a «Elías · lo que pedía», porque Elías ya fue presentado. Al revisar los cuadros aparecieron dos choques más y también se corrigieron: en 3.6, la ficha de Torrico rozaba la etiqueta de la parte de Novoa (ese folio baja a y 380), y en 3.7 la ficha «Echenique · fuera de plazo» tocaba el medallón de Torrico (la de Torrico pasa a x 850).
2. **Una «s» repetida unos 2 s, hacia el segundo 66.** El error estaba en `voz/s03.mp3`, no en el render. Después del corte de la frase 11, `narracion.py` rellena la pausa con el tramo más quieto de la toma, pero esa toma («por novecientos cuarenta y ocho mil quinientos pesos en vales») no tenía silencio: el tramo más quieto era la «s» final, y se oyó en bucle. Ahora el aire sale del tramo más quieto de *todas* las tomas de la escena, y si aun así supera −52 dBFS, se baja. Se regeneró s03 desde las tomas guardadas, sin pedir audio nuevo a ElevenLabs. Los tiempos de las frases se movieron 0,08 s como máximo, y las otras cinco escenas no tenían el problema.
3. **«180 000», ¿aparte o parte?** El folio decía «probablemente ≈ 180 000 pesos en vales» y se podía leer como una suma más. Ahora dice «probablemente recibió ≈ 180 000 de los 948 500, en vales», y su etiqueta es «Novoa · su parte». El storyboard (3.6) quedó igual.

## Versión F: presentación de personajes y papeles propios (21 de noviembre de 2026)

Gerson pidió: «cuando se presente a un personaje en pantalla, su medallón con el nombre salga en primer plano, lo demás de fondo se difumine, solo 1.5 - 2 segundos de presentación, luego el medallón va a la posición que le corresponde, junto con su documento».

- **Cuándo.** Arranca 0,1 s antes de que la voz diga el nombre. Los tiempos se midieron con Scribe sobre `voz/s03.mp3`: «Ignacia» en 7,14 s, «Domingo» en 29,46, «José» en 45,92 y «Juan» en 73,92 (tiempo de voz).
- **Cómo.**
  - De 0 a 0,35 s entran el medallón de 280 px al centro y una tira con el nombre completo y la función. Al mismo tiempo, la mesa se desenfoca (hasta 9 px) y se oscurece un 35 %.
  - De 1,3 a 1,8 s el medallón viaja en arco, con peso «pesado», hasta el medallón de la etiqueta de su papel, y la tira del nombre se apaga.
  - Cuando el medallón llega, la tira de la etiqueta se despliega desde él.
  - Los papeles de Elías y de Echenique entran durante ese viaje, no antes. Novoa ya tiene su carpeta en la mesa. Torrico no tiene papel, así que su medallón va a su ficha.
- **Una vez por persona.** Novoa vuelve en el vale y en su parte con la etiqueta normal, sin otra presentación.
- **Papeles propios.** Los tres de ChatGPT (`obj-13`, `obj-14` y `obj-15`, ver `fuentes.md`). El recibo es una tira angosta, así que su parte va a 272 px de ancho, con el texto en dos renglones y el folio más abajo, para que su etiqueta no pise la del vale.
- **Arreglo de paso.** Al crear F, el vale tomaba la posición de la versión B porque el código solo reconocía D y E. Ya está corregido.
- **Sello del papel sellado.** La hoja del reclamo de Novoa lleva arriba un sello reconstruido: el grabado de ChatGPT (`obj-16`) con las leyendas en curva escritas por Remotion, «REPÚBLICA PERUANA» y «BIENIO DE 1852 Y 1853». Va en tinta, con mezcla `multiply`, y la escritura de la hoja pasa por encima. El oficio de Echenique conserva su sello genérico: [VERIFICAR] si el gobierno respondía en papel sellado.
- **Costo.** El desenfoque cubre todo el cuadro, pero solo en los 7,2 s que suman las cuatro presentaciones.

## Desconocido

Si la diferencia entre A, B y C se **siente** como se busca: es la pregunta para Gerson. No se probó en la laptop ni a 1080p.

## Para qué sirve

Decidir el tratamiento de la cifra y de los respiros antes de animar las demás escenas, y dejar armado el esqueleto (línea de tiempo anclada a la voz, papeles de la galería, fichas) que se puede reusar en las escenas 0, 4 y 5, que pasan sobre la misma mesa.
