# Fuentes — 000-quiroz

Libro base: Alfonso W. Quiroz, *Historia de la corrupción en el Perú* (Lima: IEP / IDL, 2013).
Las fichas de lectura, con las citas textuales y sus páginas, están en
[`bibliografia/quiroz-2013.md`](../../bibliografia/quiroz-2013.md).

**Cotejado con el libro: pp. 1–82** (créditos, índice, prólogo, prefacio, agradecimientos,
introducción y capítulo 1 hasta «Purgatorio minero»), **pp. 121–128** (ciclos coloniales),
**pp. 164–190** (el guano y la consolidación) y **pp. 535–554** (el Apéndice entero). Lo que todavía no tiene fuente segura, o lo que en
pantalla todavía no coincide con el libro, dice `[VERIFICAR]` y hace fallar
`npm run validar -- 000-quiroz --final`.

---

## Correcciones para el guion

El guion se está reescribiendo; esto es lo que el libro corrige. Lo que estaba en pantalla va
marcado 🖥 y **ya está corregido** en `escenas.json` (C1, C5, C6, C21, C26, C28); C5, C21 y C28
también en la voz provisional de s04 y s08, para que voz y pantalla digan lo mismo. `guion.md` sigue como lo
escribió Gerson: el resto se aplica al reescribirlo.

### Cambian un hecho o le ponen al libro palabras que no dice

| # | Esc. | El guion dice | El libro dice | Propuesta |
|---|---|---|---|---|
| C1 | s01 🖥 | Cita en pantalla: «…a mis médicos, por alargar estos días para poder completar la tarea.» | «A mis médicos del hospital Memorial Sloan-Kettering les agradezco inmensamente el alargar estos días para poder completar la tarea.» (p. 35) | Poner el texto exacto en `s01.props.cita.texto` (puede empezar en «…les agradezco inmensamente el alargar estos días para poder completar la tarea.»). El subrayado «alargar estos días» sigue igual. |
| C2 | s01 | «En un hospital, un historiador peruano corrige pruebas de imprenta.» · «En los agradecimientos escribe una línea…» | Cueto: «Hasta hace poco estuvo revisando con minuciosidad las pruebas de la versión en español» (pp. 24–25). El libro no dice dónde las revisaba ni cuándo se escribió la línea del hospital: los agradecimientos se revisaron para esta edición (p. 33), pero esa línea pudo venir de la inglesa de 2008. **Resuelto con la edición de 2008** (ver «Fuentes fuera del libro»): sus agradecimientos no tienen la línea del hospital; se escribió para la edición en castellano. | «Nueva York. Un historiador peruano revisa, con minucia, las pruebas de imprenta…». Y «En los agradecimientos escribe una línea…» **puede quedar**: la escribió para esta edición. Dónde revisaba las pruebas sigue sin fuente. |
| C3 | s01 | «su último libro, el que más trabajo le costó» | «Su último y exitoso libro» (p. 23). Lo de «el que más trabajo le costó» no está. | Quitarlo, o decir «su último libro». |
| C4 | s01 | «menciona a su hijo, recién llegado al mundo» | «La reciente llegada a este mundo de nuestro precioso Alfonsito ha colocado todo esto en su debida perspectiva vital.» (p. 35). Dedicatoria: «A don Alfonso Martín y a sus ilustres abuelos». No dice «hijo». La línea tampoco está en la edición de 2008: Alfonsito llegó entre 2008 y 2013. **Fuera del libro, sí:** el perfil de *El Comercio* (2019), hecho con su viuda, habla de «sus hijos Daniela y Alfonso». | **Aplicada** en `guion.md` y en la voz provisional de s01: «Unas líneas más abajo celebra "la reciente llegada a este mundo de nuestro precioso Alfonsito": su hijo.» Las palabras del libro, y «su hijo» con la fuente de *El Comercio*. |
| C5 | s04 🖥 | «No era derroche. Era un mecanismo.» | Quiroz quería «confirmar si era verdad que **toda** la riqueza […] había sido derrochada en artículos de lujo» y encontró **además** la deuda inflada y funcionarios cómplices (pp. 17–18). No niega el derroche. | «No era solo derroche. Era un mecanismo.» (también en `s04.props.frase`). |
| C6 | s07 🖥 | «en 1729 la Real Academia ya definía el cohecho, el prevaricato y la corruptela» | Nota 13 (p. 43): Diccionario de autoridades, **1729** (pp. 623 y 401) **y 1737** (p. 373). Por el orden alfabético de los tomos, *cohecho* y *corruptela* serían de 1729 y *prevaricato* de 1737 (deducción nuestra). La n. 39 (p. 76) confirma *corruptela* en 1729 y copia la entrada: «Por alusión vale mala costumbre, o abuso, introducido contra la ley que no debe alterarse.» | «Entre 1729 y 1737, el diccionario de la Real Academia ya definía…». En pantalla, `s07.props.diccionario.anio` → `1729 · 1737`. Se pueden sumar las glosas del libro: *corruptela* (abuso ilegal), *cohecho* (soborno), *prevaricato* (perversión de la justicia). |
| C7 | s07 | «que la corrupción es cultural, que está en la sangre» | El argumento cultural que discute es religioso y de valores: «las regiones católicas meridionales, en comparación con el norte protestante» (p. 44). Nada de sangre. | «que es cultural: que los países católicos del sur son más corruptos que los protestantes del norte». Y su respuesta, que el guion no da: cambiar la cultura «es ciertamente más difícil y controversial que dedicarse a efectuar reformas institucionales urgentes», y esa explicación no da cuenta de «los intereses y factores institucionales» (p. 44). |
| C8 | s07 | «Él pensaba lo contrario: no es aceite. Es grava en el engranaje.» | **Resuelta: es de Quiroz.** «En lugar de "aceitar" la burocracia, la corrupción actúa, en realidad, como "grava" en la maquinaria de las instituciones del sector público.» (pp. 536–537) | Queda como está. Si se quiere citar, el libro dice «la maquinaria»; el engranaje es la misma imagen. |

### Precisión: el sentido está, la forma exagera

| # | Esc. | El guion dice | El libro dice | Propuesta |
|---|---|---|---|---|
| C9 | s02 | «Nació en Lima en 1956.» | 1956 sí (p. 15). Lima no está en el libro, pero sí en la reseña de Carlos Contreras: «Nació y se educó en Lima» (*Economía*, 2013). | **Resuelta.** Queda como está. |
| C29 | s01 | «No le queda mucho tiempo, y lo sabe. […] Murió en enero de 2013. El libro salió en mayo.» | Contreras (*Economía*, 2013): «*Historia de la corrupción en el Perú* ha sido un libro deliberadamente póstumo. Enfermo de cáncer y acosado por amenazas judiciales de personajes nombrados en la versión en inglés de este libro […] el autor prefirió que la versión castellana apareciese solo después de su muerte, la que ocurrió en los primeros días del año 2013.» | **No usar en la voz.** Busqué una segunda fuente y no apareció; la más detallada cuenta otra cosa. El perfil de *El Comercio* (2019), hecho con su viuda y con Felipe Portocarrero, dice que dividió su tiempo entre su familia y «la tarea de terminar la versión en español» y que murió «en pleno esfuerzo», meses antes de la presentación. Eso es una carrera contra el tiempo, que es lo que el guion ya cuenta. Lo único que respalda en parte lo de las amenazas: Jorge Peschiera, funcionario nombrado en la edición inglesa, publicó en el Wilson Center que el libro hacía afirmaciones «false and defamatory» sobre él. No hay rastro de una demanda. |
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
| C21 | s08 🖥 | «estimados provisionales» · nota en pantalla `Estimados provisionales — Quiroz, Apéndice` | «Estos cálculos son estimados preliminares, obviamente sujetos a revisión y a errores de subestimación o sobrestimación» (p. 57). **No era un error:** el Apéndice también dice «el presente es un cálculo provisional sujeto a revisiones» (p. 535). | Las dos palabras son de Quiroz. Queda «preliminares», que ya está aplicado. |
| C22 | s10 | «a más de tres mil quinientos metros de altura» | «a unos 3.600 metros sobre el nivel del mar» (p. 59) | «a unos tres mil seiscientos metros» (la ficha `~3600 M.S.N.M.` ya está bien). |
| C23 | s10 | «la mina de mercurio de la que dependía la plata de todo el virreinato» | «la única fuente americana importante del metal líquido, un insumo fundamental en el proceso de amalgamación para refinar la plata» (p. 59) | «la única mina importante de mercurio de América. Sin mercurio no se podía refinar la plata.» |
| C24 | s10 | «Intentó limpiarla. Y perdió.» | **Resuelta.** Sus esfuerzos «lo enfrentaron violentamente a poderosos intereses creados» (pp. 59–60); «el calvario que vivió Ulloa» (p. 63); «amargas disputas» en 1758-1764 (p. 72); en junio de 1763 «reiteraba sus pedidos previos de que se le relevara y se le permitiera retornar a España» (n. 1). | Queda. Si se quiere un detalle concreto en vez de la palabra: «En 1763 pedía que lo relevaran.» |
| C25 | s11 | «un mes después de la muerte de su amigo» | Murió en enero de 2013 (nota de los editores); el prólogo se firma en febrero (p. 29). No hay día. | «semanas después» o solo «en febrero de 2013». Y algo que el guion no dice: Cueto alcanzó a decírselo en vida («tuve el privilegio de confesarle», p. 29). |
| C26 | s03 🖥 | Capa de gobiernos: `BELAUNDE` | El libro escribe «Belaúnde» (índice, cap. 6, p. 384); en mayúsculas también va la tilde. | `BELAÚNDE` en `s03.props.gobiernos`. |
| C27 | s08 | «Clasificó cada época como de corrupción moderada, alta o muy alta.» | **Resuelta: el guion está bien.** La escala del libro es «muy alta», «alta» y «moderada», y «no se detectaron evidencias de periodos de corrupción baja o muy baja» (p. 554). La p. 539 («alta, media o baja») describe el método en general. | Queda como está. |
| C28 | s08 🖥 | «la corrupción podría explicar cerca de la mitad del crecimiento que el Perú no tuvo» · en pantalla `≈ ½ del crecimiento que no tuvimos` | Es la frase de Cueto (p. 24: «alrededor de la mitad de la falta de crecimiento»). Quiroz lo dice de otra forma y explica la cuenta: para crecer de forma sostenida hacen falta entre 5 y 8 % del PBI al año; la corrupción se llevaba entre 3 y 4 %; así, «el Perú perdió o distribuyó mal el equivalente de aproximadamente el 40 a 50 por ciento de sus posibilidades de desarrollo» (p. 554). | **Aplicada.** La voz provisional dice ahora la cuenta («Para crecer de verdad, un país necesita que su producción suba entre cinco y ocho por ciento al año. La corrupción se llevaba entre tres y cuatro por ciento. Según su cuenta, el Perú perdió, o usó mal, cerca de la mitad de sus posibilidades de desarrollo.») y la pantalla la dibuja: dos barras en la misma escala y `40–50 % de sus posibilidades de desarrollo`. El país «fantasma» salió. |

---

## Datos en pantalla o en la voz

✔ = cotejado con la página indicada · C# = ver la corrección de arriba.

| Escena | Dato | Fuente | Estado |
|---|---|---|---|
| s01 | Revisa las pruebas de la traducción al español | Prólogo, pp. 24–25; nota de los editores; Agradecimientos, p. 33 («traducción del texto, revisada por el autor») | ✔ · C2 |
| s01 | Ficha `NUEVA YORK · MEMORIAL SLOAN-KETTERING` | Agradecimientos, p. 35 (el hospital está en Nueva York) | ✔ |
| s01 | Frase en pantalla de los médicos | Agradecimientos, p. 35 | ✔ texto exacto en pantalla (C1) |
| s01 | Las líneas del hospital y de Alfonsito se escribieron para la edición de 2013 | Búsqueda en el texto completo de *Corrupt Circles* (2008): sus agradecimientos tienen las líneas del Professional Staff Congress-CUNY, de Mónica Ricketts y de su padre, y no tienen «Sloan», «Kettering» ni «Alfonsito» | ✔ (C2, C4). Es una prueba por ausencia en un texto escaneado: muy probable, no absoluta |
| s01 | La edición en castellano fue deliberadamente póstuma | Contreras, *Economía*, 2013 | Una sola fuente, y otra (*El Comercio*, 2019) lo cuenta distinto: **no va** (C29) |
| s01 | Murió el 2 de enero de 2013; un sarcoma diagnosticado en 2009, con metástasis un año después | Reseña de Carla López Medina en *Histórica* (PUCP) XXXVII.1; *El Comercio*, 2019 | ✔ (el guion dice «enero de 2013»: está bien) |
| s01 | Alfonsito | Agradecimientos, p. 35; dedicatoria | ✔ · C4 |
| s01 | Murió en enero de 2013; el libro salió en mayo (sellos `ENERO 2013` / `MAYO 2013`) | Nota de los editores; créditos («Primera edición: Lima, mayo de 2013») | ✔ |
| s02 | Alfonso W. Quiroz Norris, 1956 — 2013 | Prólogo, p. 15 (título) | ✔ |
| s02 | Nació en Lima | Contreras, *Economía*, 2013, p. 212 | ✔ (C9) |
| s02 | Nadador de competencia, categorías infantil y juvenil; la disciplina pasó a sus investigaciones | Prólogo, p. 15 | ✔ |
| s02 | «Inagotable» | Prólogo, p. 15: «encarnó como nadie un adjetivo: inagotable» | ✔ |
| s03 | PUCP 1974, entre los primeros puestos (sello `PUCP · 1974`, rótulo `ADMISIÓN · 1974`) | Prólogo, p. 15 | ✔ |
| s03 | Velasco: reforma agraria, nacionalizaciones, fin del «pasado oligárquico» | Prólogo, p. 16 | ✔ |
| s03 | Militancia trotskista contra el régimen | Prólogo, p. 16 | ✔ |
| s03 | Franklin Pease, Fernand Braudel | Prólogo, p. 16 | ✔ · C11 |
| s03 | Afiches `REFORMA AGRARIA`, `NACIONALIZACIÓN`, `UN PAÍS NUEVO` | — | Tipografía genérica de época, no son afiches reales (así lo pide el guion) |
| s03 | Gobernantes de la capa rápida (Virreinato, San Martín, Castilla, Piérola, Leguía, Benavides, Odría, Prado, Belaúnde, Velasco, Morales Bermúdez, García, Fujimori) | No salen del libro. Cotejados con el anexo de presidentes del Perú de Wikipedia en español: todos gobernaron el Perú y la grafía con tildes coincide. San Martín fue *Protector*, no presidente; «Prado» puede ser Mariano Ignacio o Manuel; «Morales Bermúdez», Remigio o Francisco | ✔ (fuente general; basta para una capa que pasa rápido y no se narra) — o se pueden reemplazar por las autoridades que el propio libro reevalúa (p. 55: Amat, Gamarra, Gutiérrez de la Fuente, Echenique, Piérola, Cáceres, Leguía, Prado, Odría, Velasco, García, Fujimori; la lista trae además a Torrico, que el libro muestra como ministro, y a Haya de la Torre, que no gobernó). |
| s04 | Félix Denegri Luna le sugiere el siglo XIX | Prólogo, p. 17 | ✔ · C12 |
| s04 | Consolidación: pago en 1850 de la deuda interna que venía de la colonia; la promesa de una clase empresarial; la versión del derroche; deuda exagerada y funcionarios cómplices | Prólogo, pp. 17–18; cap. 2, p. 169 (la consolidación pagada con los recursos del guano; créditos «de fines de la época colonial») | ✔ · C5 |
| s04 | Qué era la deuda interna: lo que el Estado debía por expropiaciones y préstamos forzosos desde la independencia, más créditos de fines de la colonia | Cap. 2, p. 169 | ✔ (no está en el video; es el concepto que falta presentar) |
| s04 | El guano: cómo se supo (carta de un diplomático, 1841); el primer contrato, 90.000 pesos por nueve años; las consignaciones | Cap. 2, pp. 164–168 | ✔ (no está en el video) |
| s04 | Tesis de bachiller, 1980 («La consolidación de la deuda interna peruana, 1850-1858») | Prólogo, p. 17 | ✔ |
| s04 | *La deuda defraudada: consolidación de 1850 y dominio económico en el Perú*, 1987, Instituto Nacional de Cultura | Prólogo, p. 17 | ✔ |
| s04 | Vale de `1000` a `3000` | — | Ilustración, no un dato: en pantalla dice «ejemplo ilustrativo». Ahora hay datos reales para reemplazarla (ver la fila siguiente) |
| s04 | El mecanismo: reclamos casi sin valor comprados «a muy bajo precio» y reconocidos «a un valor muchas veces mayor», con comisiones a funcionarios; la deuda consolidada pasa de 5 a 24 millones de pesos entre 1851 y 1852 | Cap. 2, p. 170 | ✔ |
| s04 | Caso Novoa: reclamo de 500.000–600.000 pesos, aprobado en 948.500 pesos en vales con Torrico de por medio; ella recibe unos 180.000 | Cap. 2, p. 171 | ✔ (no está en el video; sirve para el tablero del mecanismo) |
| s04 | Adónde fueron los 24 millones: ~16 % a funcionarios, más del 30 % en comisiones ilegales, ~50 % convertido en deuda externa | Cap. 2, p. 172 | ✔ (no está en el video) |
| s04 | El final: la Junta de Examen Fiscal encontró 12,2 millones en 141 expedientes irregulares; Echenique, Torrico y Mendiburu huyeron; la ley del 11 de marzo de 1857, «de tabla rasa», absolvió a los beneficiados | Cap. 2, pp. 182–185 y n. 147 | ✔ (no está en el video) |
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
| s08 | Estimación década por década desde la colonia (la regla marca 1680–1990: una marca por década con estimado) | Cuadros 1.2 (desde 1680), A.3 y A.5 | ✔ |
| s08 | 30–40 % del gasto del Estado; 3–4 % de la producción cada año (1820–2000) | Apéndice, conclusión, p. 554: «alrededor de entre 30 y 40 por ciento de los gastos del presupuesto, y de entre 3 y 4 por ciento del PBI en el largo plazo (años de 1820 a 2000)» | ✔ |
| s08 | Moderada, alta o muy alta; ninguna baja | Apéndice, p. 554 | ✔ (C27) |
| s08 | Niveles por década en el gráfico (`s08.props.niveles`): el costo de la corrupción como % del PBI, promedio por década, 1820–1999; bordes de los niveles en 1, 2 y 4 % | Cuadros A.4 (p. 548) y A.6 (p. 550); la escala, p. 554 | ✔. Reemplaza al marcador por épocas, que contradecía el libro. Simplificación declarada en el eje del gráfico: Quiroz clasifica mirando el gasto y el PBI juntos; con el gasto, la década de 1920 (72 %) sería «muy alta», y con el PBI (3,8 %) queda en «alta» |
| s08 | ≈ la mitad del crecimiento que no tuvo | Prólogo, p. 24; Apéndice, p. 554 («40 a 50 por ciento de sus posibilidades de desarrollo») | ✔ · C28 |
| s08 | Estimados sujetos a revisión | Introducción, p. 57; Apéndice, p. 535 | ✔ · C21 |
| s08 | La cuenta: para crecer hace falta que el PBI suba 5–8 % al año; la corrupción se llevaba 3–4 %; 40–50 % de las posibilidades de desarrollo | Apéndice, p. 554 | ✔ (C28) |
| s09 | *Corrupt Circles*, 2008 | Prólogo, p. 23 | ✔ |
| s09 | Premios: Abraham J. Briloff Prize in Ethics y President's Excellence Award for Scholarship del Baruch College, 2009 | Prólogo, pp. 24–25 | ✔ |
| s09 | Usado en el mundo; contra el fatalismo; «hace obras» | Prólogo, pp. 24–25 | ✔ |
| s10 | Contado desde los que denunciaron; siete capítulos, siete ciclos | Introducción, p. 55 | ✔ |
| s10 | Antonio de Ulloa, nombrado en 1757, toma el mando el 4 de noviembre de 1758; gobierna hasta 1764; ~3600 m; mina de mercurio de Santa Bárbara | Cap. 1, p. 59, n. 1 y p. 72 | ✔ · C22, C23 |
| s10 | «Y perdió.» | Cap. 1, pp. 59–60, 63, 72 y n. 1; y del ciclo entero: «A pesar de serios intentos por efectuar reformas, la corrupción profundamente arraigada venció» (p. 126) | ✔ (C24) |
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
| (no se usa todavía) *Los Pulpos de Leguía*, Chambón, 1907 | Título, autor y año: créditos del libro («Imagen de carátula»). «Chambón» firmaba caricaturas en *Fray K. Bezón* (1907–1908); su nombre real no aparece en ninguna fuente. Es la imagen de la carátula de esta edición: usarla de fondo en s10 se puede leer como copiar la carátula, que el guion pide evitar | **La obra: dominio público muy probable.** En el Perú, una obra con seudónimo queda protegida 70 años desde su divulgación (D. Leg. 822, art. 53): para 1907, hasta 1977. La excepción sería que el autor hubiera revelado su identidad antes de esa fecha, y no hay rastro de eso. En EE. UU., lo publicado antes de 1931 es dominio público. **La copia digital** es otra cosa: la de *Fray K. Bezón* es del proyecto EAP1601 (British Library y PUCP), y el modelo de licencia del EAP es no comercial. Para un canal monetizado hay que pedir permiso a Colecciones Especiales de la PUCP o hacer una reproducción propia del original |

## Fuentes fuera del libro

Consultadas el 27/10/2026.

| Fuente | Qué aporta |
|---|---|
| Carlos Contreras Carranza, reseña de *Historia de la corrupción en el Perú*, *Economía* (PUCP), vol. XXXVI, n.° 72, 2013, pp. 212–214 ([PDF](https://revistas.pucp.edu.pe/index.php/economia/article/download/7707/7953)) | Nació y se educó en Lima; murió «en los primeros días del año 2013», enfermo de cáncer; la edición en castellano fue «deliberadamente póstuma» por amenazas judiciales (C9, C29) |
| Quiroz, *Corrupt Circles* (2008), copia escaneada en [Internet Archive](https://archive.org/details/corruptcircleshi0000quir), buscada en su texto completo con el «buscar dentro» de Open Library: [esta búsqueda la encuentra](https://openlibrary.org/search/inside?q=%22Monica+Ricketts%22+%22Professional+Staff+Congress%22) («…continuous academic support; and the Professional Staff Congress- CUNY for research awards…», «…Monica Ricketts contributed immensely to bringing this project…», «My father, Alfonso Quiroz Muñoz, continued to inspire…»); [con «Sloan» no aparece](https://openlibrary.org/search/inside?q=%22Sloan%22+%22Professional+Staff+Congress%22), ni con «Kettering» ni con «Alfonsito» | Las líneas del hospital y de Alfonsito no estaban en 2008 (C2, C4) |
| Decreto Legislativo 822, Ley sobre el Derecho de Autor (Perú), arts. 52, 53 y 57 ([WIPO Lex](https://www.wipo.int/wipolex/es/text/129301)) | Art. 53: «En las obras anónimas y seudónimas, el plazo de duración será de setenta años a partir del año de su divulgación, salvo que antes de cumplido dicho lapso el autor revele su identidad». Art. 57: al vencer, la obra pasa al dominio público |
| [Commons: Hirtle chart](https://commons.wikimedia.org/wiki/Commons:Hirtle_chart/es) y [BYU Copyright Licensing Office](https://copyright.byu.edu/public-domain) | En EE. UU., al 1 de enero de 2026, lo publicado antes de 1931 es dominio público |
| PUCP, [«Caricaturas en los periódicos satíricos peruanos (siglos XIX-XX)»](https://artsandculture.google.com/story/CQVh1sAKCCY6iA), Google Arts & Culture | «Chambón» firma caricaturas en *Fray K. Bezón* (1907-09-07 y 1908-01-04); las imágenes vienen del proyecto EAP1601 |
| British Library, [EAP1601: Digitisation of Peruvian satirical newspapers, 1821-1918](https://eap.bl.uk/node/5001); [guía del EAP sobre permisos y derechos](https://eap.bl.uk/sites/default/files/2025-08/EAP%20Guide_for_Applicants%20R21%20Appendix3%20AccessPermissionCopyright.pdf) | El modelo del EAP licencia las copias para uso no comercial (CC BY-NC) y deriva los pedidos comerciales a los dueños de los originales. No pude abrir las páginas del EAP: esto sale de los resúmenes del buscador |
| Wikipedia, [Anexo: Presidentes del Perú](https://es.wikipedia.org/wiki/Anexo:Presidentes_del_Per%C3%BA) | Grafía y periodos de los gobernantes de la capa rápida de s03 |
| «Alfonso Quiroz: el hombre que estudió la corrupción del Perú», *El Comercio*, 2019, [reproducido por el IEP](https://iep.org.pe/noticias/alfonso-quiroz-el-hombre-que-estudio-la-corrupcion-del-peru/) (17/01/2019); testimonios de Mónica Ricketts y Felipe Portocarrero | Murió el 2 de enero de 2013, a los 56 años, «en pleno esfuerzo» por terminar la versión en español; el sarcoma de 2009; «sus hijos Daniela y Alfonso». Además, nadaba cada mañana («200 metros estilo mariposa»), de adulto también (C4, C29) |
| Carla López Medina, reseña de *Historia de la corrupción en el Perú*, *Histórica* (PUCP) XXXVII.1, p. 158 ([PDF](https://revistas.pucp.edu.pe/index.php/historica/article/download/7648/7898)) | La versión en español «alcanzó a ser revisada por el autor antes de su prematuro deceso, el 2 de enero de 2013» |
| Wilson Center, [página del libro *Corrupt Circles*](https://www.wilsoncenter.org/book/corrupt-circles-history-unbound-graft-peru) | Declaración de Jorge Peschiera contra el libro («false and defamatory») y la respuesta de Quiroz, que reconoce dos errores (C29) |
| Entrevista de Pedro Escribano a Marcos Cueto, *La República*, [reproducida por el IEP](https://iep.org.pe/noticias/la-corrupcion-ha-impedido-el-desarrollo-del-peru/) (14/05/2013); reseñas en [*Apuntes*](https://revistas.up.edu.pe/index.php/apuntes/article/download/699/710/710) (Universidad del Pacífico) y en el [*Anuario Colombiano de Historia Social y de la Cultura*](http://www.scielo.org.co/pdf/achsc/v41n2/v41n2a14.pdf) 41.2 (2014) | Revisadas para C29: llaman póstumo al libro, pero ninguna dice que lo fuera por decisión suya ni menciona amenazas |

## Decisiones que rompen una regla del canal

- **Amarillo del cartel (s09).** El guion pide un cartel de obra amarillo y negro; la paleta del
  video no tiene amarillo. Se usa el ocre de la paleta llevado a amarillo (`CartelObra`), solo ahí.
  Si se prefiere no salir de la paleta, poner `"color_cartel"` en `s09.props`.
