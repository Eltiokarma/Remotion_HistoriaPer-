# Fuentes — 000-quiroz

Libro base: Alfonso W. Quiroz, *Historia de la corrupción en el Perú* (Lima: IEP / IDL, 2013).
Las fichas de lectura, con las citas textuales y sus páginas, están en
[`bibliografia/quiroz-2013.md`](../../bibliografia/quiroz-2013.md).

**Cotejado con el libro: pp. 1–82** (créditos, índice, prólogo, prefacio, agradecimientos,
introducción y capítulo 1 hasta «Purgatorio minero»), **pp. 170–182** (la consolidación) y
**pp. 536–546** (Apéndice). Lo que todavía no tiene fuente segura, o lo que en
pantalla todavía no coincide con el libro, dice `[VERIFICAR]` y hace fallar
`npm run validar -- 000-quiroz --final`.

---

## Correcciones para el guion

El guion se está reescribiendo; esto es lo que el libro corrige. Lo que estaba en pantalla va
marcado 🖥 y **ya está corregido** en `escenas.json` (C1, C5, C6, C21, C26); C5 y C21 también en la
voz provisional de s04 y s08, para que voz y pantalla digan lo mismo. `guion.md` sigue como lo
escribió Gerson: el resto se aplica al reescribirlo.

### Cambian un hecho o le ponen al libro palabras que no dice

| # | Esc. | El guion dice | El libro dice | Propuesta |
|---|---|---|---|---|
| C1 | s01 🖥 | Cita en pantalla: «…a mis médicos, por alargar estos días para poder completar la tarea.» | «A mis médicos del hospital Memorial Sloan-Kettering les agradezco inmensamente el alargar estos días para poder completar la tarea.» (p. 35) | Poner el texto exacto en `s01.props.cita.texto` (puede empezar en «…les agradezco inmensamente el alargar estos días para poder completar la tarea.»). El subrayado «alargar estos días» sigue igual. |
| C2 | s01 | «En un hospital, un historiador peruano corrige pruebas de imprenta.» · «En los agradecimientos escribe una línea…» | Cueto: «Hasta hace poco estuvo revisando con minuciosidad las pruebas de la versión en español» (pp. 24–25). El libro no dice dónde las revisaba ni cuándo se escribió la línea del hospital: los agradecimientos se revisaron para esta edición (p. 33), pero esa línea pudo venir de la inglesa de 2008. | «Nueva York. Un historiador peruano revisa, con minucia, las pruebas de imprenta…» · «En los agradecimientos hay una línea que casi nadie lee». Si los *Acknowledgments* de 2008 no la tienen, se puede volver a «escribe». |
| C3 | s01 | «su último libro, el que más trabajo le costó» | «Su último y exitoso libro» (p. 23). Lo de «el que más trabajo le costó» no está. | Quitarlo, o decir «su último libro». |
| C4 | s01 | «menciona a su hijo, recién llegado al mundo» | «La reciente llegada a este mundo de nuestro precioso Alfonsito ha colocado todo esto en su debida perspectiva vital.» (p. 35). Dedicatoria: «A don Alfonso Martín y a sus ilustres abuelos». No dice «hijo». | Usar sus palabras: «…celebra "la reciente llegada a este mundo de nuestro precioso Alfonsito"». |
| C5 | s04 🖥 | «No era derroche. Era un mecanismo.» | Quiroz quería «confirmar si era verdad que **toda** la riqueza […] había sido derrochada en artículos de lujo» y encontró **además** la deuda inflada y funcionarios cómplices (pp. 17–18). No niega el derroche. | «No era solo derroche. Era un mecanismo.» (también en `s04.props.frase`). |
| C6 | s07 🖥 | «en 1729 la Real Academia ya definía el cohecho, el prevaricato y la corruptela» | Nota 13 (p. 43): Diccionario de autoridades, **1729** (pp. 623 y 401) **y 1737** (p. 373). Por el orden alfabético de los tomos, *cohecho* y *corruptela* serían de 1729 y *prevaricato* de 1737 (deducción nuestra). La n. 39 (p. 76) confirma *corruptela* en 1729 y copia la entrada: «Por alusión vale mala costumbre, o abuso, introducido contra la ley que no debe alterarse.» | «Entre 1729 y 1737, el diccionario de la Real Academia ya definía…». En pantalla, `s07.props.diccionario.anio` → `1729 · 1737`. Se pueden sumar las glosas del libro: *corruptela* (abuso ilegal), *cohecho* (soborno), *prevaricato* (perversión de la justicia). |
| C7 | s07 | «que la corrupción es cultural, que está en la sangre» | El argumento cultural que discute es religioso y de valores: «las regiones católicas meridionales, en comparación con el norte protestante» (p. 44). Nada de sangre. | «que es cultural: que los países católicos del sur son más corruptos que los protestantes del norte». Y su respuesta, que el guion no da: cambiar la cultura «es ciertamente más difícil y controversial que dedicarse a efectuar reformas institucionales urgentes», y esa explicación no da cuenta de «los intereses y factores institucionales» (p. 44). |
| C8 | s07 | «Él pensaba lo contrario: no es aceite. Es grava en el engranaje.» | **Resuelta: es de Quiroz.** «En lugar de "aceitar" la burocracia, la corrupción actúa, en realidad, como "grava" en la maquinaria de las instituciones del sector público.» (pp. 536–537) | Queda como está. Si se quiere citar, el libro dice «la maquinaria»; el engranaje es la misma imagen. |

### Precisión: el sentido está, la forma exagera

| # | Esc. | El guion dice | El libro dice | Propuesta |
|---|---|---|---|---|
| C9 | s02 | «Nació en Lima en 1956.» | 1956 sí (p. 15). Lima no está en estas páginas (sí «colegio Markham de Lima»). | Confirmar en otra fuente o decir «Nació en 1956». |
| C10 | s02 | «Su amigo de toda la vida» | «fue mi amigo desde poco antes que cumpliéramos 16 años» (p. 15) | «Su amigo desde los quince años» (más concreto, y es verdad). |
| C11 | s03 | «En las aulas lo marcan profesores como Franklin Pease, y por ellos llega a Fernand Braudel» | En el curso de Pease «**casi con seguridad** Alfonso leyó por primera vez al historiador francés Fernand Braudel, aprendió a apreciar la persistencia de las estructuras económicas» (p. 16) | Mantener la cautela de Cueto: «Probablemente en un curso de Franklin Pease lee por primera vez a Fernand Braudel». |
| C12 | s04 | «Un coleccionista de libros, Félix Denegri Luna» | «el estudioso de la historia, y dueño de una magnífica biblioteca en Lima, Félix Denegri Luna» (p. 17) | «Un estudioso de la historia, dueño de una gran biblioteca». |
| C13 | s05 | «Casi todos los historiadores peruanos soñaban con París.» | «buena parte de los intelectuales e historiadores peruanos consideraban a París la meca de los estudios de doctorado» (p. 18) | «Buena parte de los historiadores peruanos miraba a París.» |
| C14 | s05 | «Herbert Klein lo acepta y le da una beca» | Klein, «quien le ofreció una beca para proseguir estudios de maestría y doctorado» (p. 18) | «Herbert Klein se fija en él y le ofrece una beca». |
| C15 | s05 | «la profundidad no sirve de nada sin claridad» | «combinar la profundidad con la claridad en la mejor narrativa posible» (p. 19) | «que un buen historiador combina la profundidad con la claridad». La balanza sigue sirviendo. |
| C16 | s05 | «un Estado que dejara de ser el botín de unos pocos» | Posturas liberales que buscaban «dar mayor autonomía al mercado, asegurar una igualdad de oportunidades a todos los actores económicos, así como reformular el papel del Estado» (pp. 22–23) | Decirlo con esas tres ideas, o con una: «igualdad de oportunidades». |
| C17 | s05 | «Termina como profesor en el Baruch College y en la City University of New York» | Baruch College, profesor principal en 1994, y el Graduate Center de CUNY, «una institución mayor a la que la anterior estaba vinculada» (p. 21) | Basta «profesor en Nueva York» (la ficha `BARUCH COLLEGE · CUNY` lo precisa). |
| C18 | s06 | Tras «hay pruebas como nunca antes»: «En el mundo, el tema también explota: el presidente del Banco Mundial llama a la corrupción un cáncer…» | El «cáncer» es de **1996**; la estrategia del Banco, de 1997; la resolución de la ONU, de 2000 (p. 25). | Que el orden lo diga: «En el mundo, el tema venía creciendo: en 1996, el presidente del Banco Mundial…; en 2000, la ONU…». |
| C19 | s07 | «y, sobre todo, cartas de diplomáticos extranjeros» | «Las fuentes diplomáticas ayudan a contrastar y verificar la información», pero no todos esos informantes fueron imparciales y sus informes «deben ser cuidadosamente considerados» (pp. 41–42). Cueto sí destaca ese archivo como novedad de su método (p. 23). | «y, para contrastar, las cartas de diplomáticos extranjeros». |
| C20 | s07 | «Daban tres razones, y una excusa.» | El libro discute siete posturas (pp. 40–45); el «aceite» es parte de la familia cultural y relativista (p. 43: «lubricante»). | La simplificación sirve para enseñar, pero el aceite tiene que entrar **dentro** de la cuarta tarjeta, no después como idea suelta (ver diagnóstico §7). |
| C21 | s08 🖥 | «estimados provisionales» · nota en pantalla `Estimados provisionales — Quiroz, Apéndice` | «Estos cálculos son estimados preliminares, obviamente sujetos a revisión y a errores de subestimación o sobrestimación» (p. 57) | Usar su palabra: «preliminares» (también en `s08.props.nota`). |
| C22 | s10 | «a más de tres mil quinientos metros de altura» | «a unos 3.600 metros sobre el nivel del mar» (p. 59) | «a unos tres mil seiscientos metros» (la ficha `~3600 M.S.N.M.` ya está bien). |
| C23 | s10 | «la mina de mercurio de la que dependía la plata de todo el virreinato» | «la única fuente americana importante del metal líquido, un insumo fundamental en el proceso de amalgamación para refinar la plata» (p. 59) | «la única mina importante de mercurio de América. Sin mercurio no se podía refinar la plata.» |
| C24 | s10 | «Intentó limpiarla. Y perdió.» | **Resuelta.** Sus esfuerzos «lo enfrentaron violentamente a poderosos intereses creados» (pp. 59–60); «el calvario que vivió Ulloa» (p. 63); «amargas disputas» en 1758-1764 (p. 72); en junio de 1763 «reiteraba sus pedidos previos de que se le relevara y se le permitiera retornar a España» (n. 1). | Queda. Si se quiere un detalle concreto en vez de la palabra: «En 1763 pedía que lo relevaran.» |
| C25 | s11 | «un mes después de la muerte de su amigo» | Murió en enero de 2013 (nota de los editores); el prólogo se firma en febrero (p. 29). No hay día. | «semanas después» o solo «en febrero de 2013». Y algo que el guion no dice: Cueto alcanzó a decírselo en vida («tuve el privilegio de confesarle», p. 29). |
| C26 | s03 🖥 | Capa de gobiernos: `BELAUNDE` | El libro escribe «Belaúnde» (índice, cap. 6, p. 384); en mayúsculas también va la tilde. | `BELAÚNDE` en `s03.props.gobiernos`. |
| C27 | s08 | «Clasificó cada época como de corrupción moderada, alta o muy alta.» | El Apéndice dice: «Podemos, así, clasificar décadas y gobiernos como periodos de corrupción alta, media o baja» (p. 539). Los nombres que usa en los cuadros A.4 y A.6 no están leídos. | Cotejar los cuadros A.4 (p. 548) y A.6 (p. 550). Si la escala es alta / media / baja, la frase y las bandas del gráfico cambian de nombre; «ninguna baja» puede seguir valiendo. |

---

## Datos en pantalla o en la voz

✔ = cotejado con la página indicada · C# = ver la corrección de arriba.

| Escena | Dato | Fuente | Estado |
|---|---|---|---|
| s01 | Revisa las pruebas de la traducción al español | Prólogo, pp. 24–25; nota de los editores; Agradecimientos, p. 33 («traducción del texto, revisada por el autor») | ✔ · C2 |
| s01 | Ficha `NUEVA YORK · MEMORIAL SLOAN-KETTERING` | Agradecimientos, p. 35 (el hospital está en Nueva York) | ✔ |
| s01 | Frase en pantalla de los médicos | Agradecimientos, p. 35 | ✔ texto exacto en pantalla (C1) |
| s01 | Si las líneas del hospital y de Alfonsito se escribieron para esta edición o ya estaban en 2008 | *Corrupt Circles* (2008), *Acknowledgments* | [VERIFICAR] (C2, C4) |
| s01 | Alfonsito | Agradecimientos, p. 35; dedicatoria | ✔ · C4 |
| s01 | Murió en enero de 2013; el libro salió en mayo (sellos `ENERO 2013` / `MAYO 2013`) | Nota de los editores; créditos («Primera edición: Lima, mayo de 2013») | ✔ |
| s02 | Alfonso W. Quiroz Norris, 1956 — 2013 | Prólogo, p. 15 (título) | ✔ |
| s02 | Nació en Lima | — | [VERIFICAR] (C9) |
| s02 | Nadador de competencia, categorías infantil y juvenil; la disciplina pasó a sus investigaciones | Prólogo, p. 15 | ✔ |
| s02 | «Inagotable» | Prólogo, p. 15: «encarnó como nadie un adjetivo: inagotable» | ✔ |
| s03 | PUCP 1974, entre los primeros puestos (sello `PUCP · 1974`, rótulo `ADMISIÓN · 1974`) | Prólogo, p. 15 | ✔ |
| s03 | Velasco: reforma agraria, nacionalizaciones, fin del «pasado oligárquico» | Prólogo, p. 16 | ✔ |
| s03 | Militancia trotskista contra el régimen | Prólogo, p. 16 | ✔ |
| s03 | Franklin Pease, Fernand Braudel | Prólogo, p. 16 | ✔ · C11 |
| s03 | Afiches `REFORMA AGRARIA`, `NACIONALIZACIÓN`, `UN PAÍS NUEVO` | — | Tipografía genérica de época, no son afiches reales (así lo pide el guion) |
| s03 | Gobernantes de la capa rápida (Virreinato, San Martín, Castilla, Piérola, Leguía, Benavides, Odría, Prado, Belaúnde, Velasco, Morales Bermúdez, García, Fujimori) | Conocimiento general; no salen del libro | [VERIFICAR] la lista (la tilde de Belaúnde ya está, C26) — o reemplazarlos por las autoridades que el propio libro reevalúa (p. 55: Amat, Gamarra, Gutiérrez de la Fuente, Echenique, Piérola, Cáceres, Leguía, Prado, Odría, Velasco, García, Fujimori; la lista trae además a Torrico, que el libro muestra como ministro, y a Haya de la Torre, que no gobernó). |
| s04 | Félix Denegri Luna le sugiere el siglo XIX | Prólogo, p. 17 | ✔ · C12 |
| s04 | Consolidación: pago en 1850 de la deuda interna que venía de la colonia; la promesa de una clase empresarial; la versión del derroche; deuda exagerada y funcionarios cómplices | Prólogo, pp. 17–18 | ✔ · C5 |
| s04 | Tesis de bachiller, 1980 («La consolidación de la deuda interna peruana, 1850-1858») | Prólogo, p. 17 | ✔ |
| s04 | *La deuda defraudada: consolidación de 1850 y dominio económico en el Perú*, 1987, Instituto Nacional de Cultura | Prólogo, p. 17 | ✔ |
| s04 | Vale de `1000` a `3000` | — | Ilustración, no un dato: en pantalla dice «ejemplo ilustrativo». Ahora hay datos reales para reemplazarla (ver la fila siguiente) |
| s04 | El mecanismo: reclamos casi sin valor comprados «a muy bajo precio» y reconocidos «a un valor muchas veces mayor», con comisiones a funcionarios; la deuda consolidada pasa de 5 a 24 millones de pesos entre 1851 y 1852 | Cap. 2, p. 170 | ✔ |
| s04 | Caso Novoa: reclamo de 500.000–600.000 pesos, aprobado en 948.500 pesos en vales con Torrico de por medio; ella recibe unos 180.000 | Cap. 2, p. 171 | ✔ (no está en el video; sirve para el tablero del mecanismo) |
| s04 | Adónde fueron los 24 millones: ~16 % a funcionarios, más del 30 % en comisiones ilegales, ~50 % convertido en deuda externa | Cap. 2, p. 172 | ✔ (no está en el video) |
| s05 | París como meca; Columbia; beca de Herbert S. Klein; historia cuantitativa y regresiones múltiples | Prólogo, p. 18 | ✔ · C13, C14 |
| s05 | Kenneth Maxwell: profundidad y claridad | Prólogo, p. 19 | ✔ · C15 |
| s05 | Bancos, crédito colonial, casa Grace; «la máxima autoridad en la historia financiera peruana» | Prólogo, pp. 19–20 | ✔ |
| s05 | Baruch College y CUNY; «cientos de estudiantes» | Prólogo, p. 21 | ✔ · C17 |
| s05 | Postura liberal; igualdad de oportunidades | Prólogo, pp. 22–23 | ✔ · C16 |
| s06 | Ensayo de 2000 «Historia de la corrupción en el Perú: ¿es factible su estudio?» (título exacto; capítulo del homenaje a Félix Denegri Luna) | Prólogo, p. 23; Introducción, n. 43, p. 54 | ✔ |
| s06 | Cae el régimen de Fujimori y Montesinos, noviembre de 2000; las fuentes que deja | Prefacio, p. 32 | ✔ |
| s06 | Vladivideos | Conocimiento general (el libro, en pp. 1–59, no los nombra) | sin cambio |
| s06 | Fichas `BANCO MUNDIAL · 1996 · «CÁNCER»` y `ONU · 2000` | Prólogo, p. 25 | ✔ · C18 |
| s07 | Objeción 1, clandestina; las fuentes (juicios, investigaciones parlamentarias, diplomáticos) | Introducción, pp. 41–42 | ✔ · C19 |
| s07 | Sellos `FOREIGN OFFICE`, `QUAI D'ORSAY`, `STATE DEPT.` | Prólogo, p. 23; Agradecimientos, pp. 33–34 (National Archives del Reino Unido en Kew, Archives du Ministère des Affaires Étrangères, U. S. National Archives) | ✔ como metonimia de esos archivos. Falta Madrid (Ministerio de Asuntos Exteriores), si se quiere |
| s07 | Objeción 2, percepciones; «estimados bien fundados» | Introducción, p. 42 | ✔ |
| s07 | Objeción 3, relativismo; el diccionario (`1729 · 1737`) | Introducción, p. 43 y n. 13 | ✔ (C6) |
| s07 | Objeción 4, cultura | Introducción, p. 44 | ✔ · C7 |
| s07 | El «aceite» | Introducción, pp. 40–41 y 43 | ✔ · C20 |
| s07 | «grava en el engranaje» | Apéndice, pp. 536–537 | ✔ (C8) |
| s08 | Estimación década por década desde la colonia | Índice de cuadros: 1.1, 1.2, A.3, A.5 | ✔ (que existe; las cifras, abajo) |
| s08 | 30–40 % del gasto del Estado; 3–4 % de la producción cada año (1820–2000) | Apéndice, cuadro A.7, p. 551 (ojo: el cuadro va de 1810 a 2000) | [VERIFICAR] el promedio 1820–2000 (pp. 547–554). Lo leído va en esa línea: década de 1850, ≈ 48 % del gasto y 4 % del PBI (p. 543); década de 1990, 34 % y 3,1 % (p. 540) |
| s08 | Ninguna época de corrupción baja; niveles por período en el gráfico | Cuadros 1.2 (p. 125), A.4 (p. 548) y A.6 (p. 550) — no el A.7 | [VERIFICAR] — son un marcador: copiar la clasificación real en `escenas.json → s08.props.periodos` (y sus nombres, C27) |
| s08 | ≈ la mitad del crecimiento que no tuvo | Prólogo, p. 24 («alrededor de la mitad de la falta de crecimiento»); cálculo en el Apéndice | ✔ por el prólogo |
| s08 | Estimados sujetos a revisión | Introducción, p. 57 | ✔ · C21 |
| s08 | Silueta «fantasma» del país, 1,45 veces más grande | — | Ilustración de «la mitad del crecimiento», no una medida |
| s09 | *Corrupt Circles*, 2008 | Prólogo, p. 23 | ✔ |
| s09 | Premios: Abraham J. Briloff Prize in Ethics y President's Excellence Award for Scholarship del Baruch College, 2009 | Prólogo, pp. 24–25 | ✔ |
| s09 | Usado en el mundo; contra el fatalismo; «hace obras» | Prólogo, pp. 24–25 | ✔ |
| s10 | Contado desde los que denunciaron; siete capítulos, siete ciclos | Introducción, p. 55 | ✔ |
| s10 | Antonio de Ulloa, nombrado en 1757, toma el mando el 4 de noviembre de 1758; gobierna hasta 1764; ~3600 m; mina de mercurio de Santa Bárbara | Cap. 1, p. 59, n. 1 y p. 72 | ✔ · C22, C23 |
| s10 | «Y perdió.» | Cap. 1, pp. 59–60, 63, 72 y n. 1 | ✔ (C24) |
| s10 | Domingo Elías, Manuel González Prada, Jorge Basadre, Héctor Vargas Haya | Introducción, p. 55 (el libro nombra además a Francisco García Calderón Landa y Mario Vargas Llosa) | ✔. Elías es el denunciante del cap. 2 (cartas de agosto de 1853, pp. 171–172), pero también cobraba comisiones de la consolidación (pp. 170–171) y fue indemnizado por 370 esclavos (p. 182): no es un héroe limpio, y el episodio de la consolidación tiene que decirlo |
| s10 | Los siete capítulos, títulos y años | Índice | ✔ — coinciden los siete |
| s11 | Prólogo firmado en Río de Janeiro, febrero de 2013; «siempre había querido ser como él» | Prólogo, p. 29 | ✔ · C25 |

---

## Assets

No hay fotos, metraje, carátulas originales ni imágenes de los vladivideos (el televisor solo muestra estática).

| Asset | Origen | Licencia |
|---|---|---|
| Mapa, globo y silueta del Perú | Natural Earth vía `world-atlas` (tierras 1:50 M y 1:110 M, países 1:50 M) | Dominio público |
| EB Garamond (texto de libro) | Google Fonts | SIL OFL 1.1 (`public/compartido/fuentes/licencias/`) |
| Oswald (afiches y cartel) | Google Fonts | SIL OFL 1.1 |
| Special Elite | Google Fonts | Apache 2.0 |
| Playfair Display, IBM Plex Mono, IM Fell English, Pinyon Script | Google Fonts | SIL OFL 1.1 |
| Texturas de papel, grano y cáusticas | `scripts/generar_texturas.py` | Material propio |
| Grabados, libro contable, vales, edificio, engranajes, televisor, carteles, portadas… | Dibujados en código (SVG), diseño propio | Material propio |
| Música, tema del canal, ambientes y efectos | Sintetizados con `scripts/generar_audio.py`, sin muestras de terceros | Material propio |
| Voz **provisional** (`public/videos/000-quiroz/voz-provisional/`) | TTS Piper, voz `es_MX-claude-high` | Apache 2.0 — **solo para el prototipo**: se reemplaza por la voz de Gerson antes de publicar |
| (no se usa todavía) *Los Pulpos de Leguía*, Chambon, 1907 | Título, autor y año: créditos del libro («Imagen de carátula»). Es la imagen de la carátula de esta edición: usarla de fondo en s10 se puede leer como copiar la carátula, que el guion pide evitar | [VERIFICAR] dominio público antes de usarla |

## Decisiones que rompen una regla del canal

- **Amarillo del cartel (s09).** El guion pide un cartel de obra amarillo y negro; la paleta del
  video no tiene amarillo. Se usa el ocre de la paleta llevado a amarillo (`CartelObra`), solo ahí.
  Si se prefiere no salir de la paleta, poner `"color_cartel"` en `s09.props`.
