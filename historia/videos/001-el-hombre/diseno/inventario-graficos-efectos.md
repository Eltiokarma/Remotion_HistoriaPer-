# Inventario de gráficos y efectos — episodio 001

Auditoría documental del 9 de noviembre de 2026. No se ha generado ningún video ni modificado escenas.

## Alcance y evidencia

Comparación del código anterior a la integración (`e402552`) con la entrega (`5221520`), lectura de las escenas activadas en `escenas.json`, revisión de las exportaciones SVG/JSON y de las vistas PNG existentes. La documentación posterior está en `c731b08`.

Los nombres de archivo de este inventario corresponden a las exportaciones locales de la conversación. No se debe asumir que están en GitHub: en `public/videos/001-el-hombre/vectorcraft/` solo están los cuatro diseños de la tanda 6; la pizarra está además como referencia en `diseno/`. Antes de integrar los pendientes, preservar y versionar sus originales y exportaciones.

“Aprobado” identifica la última versión aceptada para continuar en la conversación; no significa aprobación de su animación. Los efectos listados como perdidos están desactivados o sustituidos según el código. La revisión audiovisual completa sigue pendiente; no se atribuyen recortes o defectos visuales no comprobados como hechos.

**Recuento: 20 diseños vigentes identificados: 15 pendientes de integración, 1 adaptación parcial y 4 incorporados con revisión pendiente.** Se cuentan diseños, no apariciones: un libro puede aparecer en más de una escena. Se excluyen variantes reemplazadas.

## A. Diseños pendientes

Los nombres siguientes tienen exportaciones SVG, PNG y originales VectorCraft locales. Cada fila requiere separar las piezas animables; no pegar la lámina completa encima del montaje.

| ID | Escena / beat | Versión vigente | Qué usa hoy / qué falta | Movimiento que debe conservar |
|---|---|---|---|---|
| G01 | s00, libro; apariciones compatibles en s01 | `tanda03-libro` | Portada procedural en Gancho; falta el libro aprobado. No confundir con el libro de título distinto de s06. | Entrada, estampado, iluminación final; continuidad de portada entre apariciones. |
| G02 | s00, monedas | `tanda03-monedas` | Monedas dibujadas dentro de Gancho. | Caída y selección de monedas, lectura de 3–4 de diez y sonido; preservar unidad presupuesto, distinta del PBI. |
| G03 | s01, correcciones / página | `tanda03-pruebas` | PilaDePaginas original. | Correcciones progresivas, lámpara, zoom hacia la página, lectura y subrayado. |
| G04 | s01, muerte / fecha / línea | `tanda05-tiempo-v2` | Continúan cruz y línea originales. Falta flor y formulación «Fallece». | Pausa respetuosa, fecha, recorrido de meses, cámara y llegada al libro. No sustituir toda la secuencia por una imagen quieta. |
| G05 | s02, piscina / frenar / renglón | `tanda04-piscina` | Piscina procedural original. | Movimiento del agua, frenado y transformación de carriles en renglones. |
| G06 | s03, sello / primeros | `tanda05-ingreso-v2` | Sello PUCP genérico. Falta emblema ilustrado aceptado. | Entrada y asentamiento, lista de ingreso y paso al muro. Conservar aviso de interpretación, no presentarlo como logo oficial exacto. |
| G07 | s03, afiches / leer / vuelve / despegue | `panfletos-contenido-v2` | Afiche original; falta contenido interior ilustrado aprobado. | Pegado individual, acercamiento al texto, regreso y despegue que revela el afiche antiguo. Mantener aparte la cita documentada del volante. |
| G08 | s05, antes de caen | `tanda04-fichero` | El fichero original estaba dentro de Dispersion, ahora desactivado. | Fichas que se levantan y datos que viajan a la nube. Aquí faltan dibujo y función narrativa. |
| G09 | s05, balanza / profundidad / claridad | `balanza-video01` | Balanza original; sus movimientos siguen activos. | Caída de palabras, inclinación, equilibrio y vaivén, impactos de metal. |
| G10 | s05, estante / temas | `biblioteca-video01` | Estante original. | Libros que caen por turnos, deformación de contacto, asentamiento, ficha institucional. |
| G11 | s05, brújula / izquierda / giro / tiza | `brujula-video01` | Brújula original; sus movimientos siguen activos. | Aguja independiente, topes, rebote, notas por época y transición a tiza. |
| G12 | s06, hoja_página / hoja_zoom / sacos | `islas-guaneras-v3` | GrabadoGuanero original. | Ilustración dentro del libro, entrada de cámara al grabado, carga y continuidad del barco hacia el Estado. |
| G13 | s06, flecha | `edificio-estado-video01` | EdificioEstado original. | Dibujo progresivo, continuidad del barco, flecha y monedas, paneo posterior. |
| G14 | s06, vales / consolidación | `vale-video01` | Vale original. | Apilado escalonado y sello; importes desde los datos. La lámina tiene campos ilustrativos: no dejarlos como sustituto de cantidades animadas. |
| G15 | s07, cerrar | `tanda05-carpeta-v2` | Carpeta original con cierre en 3D. | Tapa independiente, cierre, continuidad de papeles, transición a negro y tarjeta. |

Evidencia de componentes: [Gancho](../../../src/escenas/Gancho/Escena.tsx), [PruebasDeImprenta](../../../src/escenas/PruebasDeImprenta/Escena.tsx), [Presentacion](../../../src/escenas/Presentacion/Escena.tsx), [TiempoLargo](../../../src/escenas/TiempoLargo/Escena.tsx), [AprenderAMedir](../../../src/escenas/AprenderAMedir/Escena.tsx), [MecanismoDeuda](../../../src/escenas/MecanismoDeuda/Escena.tsx), [Cierre](../../../src/escenas/Cierre/Escena.tsx).

## B. Adaptación parcial e incorporaciones

| ID | Diseño | Estado comprobado | Pendiente |
|---|---|---|---|
| G16 | `larga-duracion-pizarra` — s04 | Adaptación parcial mediante CapasTiza: acento de capa media, rótulo en dos líneas y nota. El SVG no es el dibujo renderizado. | Comparar composición aprobada y resultado; conservar ondas, estratos, nombres, escritura y foco de cada capa, que siguen activos. |
| G17 | `tanda06-lima` — s02 | SVG/JSON conectado a Presentacion. | Recuperar o decidir explícitamente el zoom y la relación con piscina/página, según E01–E02. |
| G18 | `tanda06-viaje` — s05 | SVG/JSON conectado. | Recuperar recorrido, anticipación, llegada y sincronía sonora. |
| G19 | `tanda06-regresion` — s05 | SVG/JSON conectado. | Recuperar archivo → datos, recta que busca y explicación de pendiente. Mantener rótulo de ejemplo simulado. |
| G20 | `tanda06-costo` — s05 | SVG/JSON conectado; PR 6 agrupó cifras con sus puntos. | Recuperar tabla → gráfico, revisar sincronía del trazo y procedencia de valores. |

No contar `guano-video01` ni `islas-guaneras-detalle-v2` como dos pendientes nuevos: son antecedentes del mismo motivo, cuya versión vigente es v3. Tampoco integrar `tanda04-afiches`, las tres primeras versiones de tanda05 o `larga-duracion-video01`: fueron reemplazadas por las revisiones indicadas arriba.

## C. Efectos perdidos o simplificados, confirmados por código

Los segundos son beats locales del plan de escena, no tiempos absolutos del MP4. La resolución de audio puede ajustar tiempos; para comprobar luego, usar los beats resueltos.

| ID | Lugar | Antes | Ahora | Recuperación necesaria |
|---|---|---|---|---|
| E01 | s02, lugar (3 s) | MapaLugar se acercaba a Lima durante 2,4 s y convivía con la página. | Lámina completa con aparición por opacidad y relieve escalonado; sin ese zoom. | Reutilizar la cámara y encuadre previstos sobre el nuevo mapa. |
| E02 | s02, piscina (8,6 s) / renglón (23,6 s) | Mapa ligado a la opacidad de los renglones: se iba con el agua y regresaba con la página. | Mapa nuevo termina antes de piscina y no vuelve; original desactivado por vectorcraft. | Restituir continuidad o documentar una decisión de montaje distinta. |
| E03 | s05, sale / abre | Cámara hasta 2,1×, anticipación, mirada adelantada y apertura con resorte. | Zoom hasta 1,3×, centro acotado y apertura suavizada sin resorte. | Recuperar el carácter del recorrido, adaptándolo al área útil del mapa. |
| E04 | s05, París / duda | Ruta dudaba y se borraba; notas entraban escalonadas junto a París. | Ruta se atenúa; notas entran juntas en un panel fijo. | Recuperar gesto de duda y secuencia de notas, o registrar cambio intencional. |
| E05 | s05, viaje / llega | Paralelos con pulsos, destino anunciado con faro, llegada con resorte y contador de kilómetros. | No se representan esos comportamientos en VectorCraft. | Reincorporar acciones secundarias que explican el recorrido. |
| E06 | s05, ficha | Ficha institucional escrita progresivamente. | Texto exportado por contornos con aparición por grupo. | Conservar lectura y sincronía de escritura; no asumir que la animación de tecla sigue existiendo. |
| E07 | s05, discursos / caen | Bloques de discurso se apagaban, entraba fichero, fichas se elevaban y enviaban puntos. | Lámina de regresión con puntos que aparecen por opacidad. | Recuperar la procedencia documental y la transformación, además del fichero nuevo. |
| E08 | s05, recta | Recta calculada buscaba su pendiente, giraba y se asentaba; residuos se extendían hacia ella. | Recta fija se revela; residuos aparecen posteriormente por opacidad. | Recuperar la explicación del ajuste, conservando la etiqueta de simulación. |
| E09 | s05, pendiente | Se dibujaba el escalón horizontal y vertical de la pendiente. | No existe ese triángulo en el nuevo SVG; el beat muestra residuos/texto. | Reconstruir la relación entre voz y «cuánto pesa». |
| E10 | s05, serie | Puntos viajaban en arco de la nube a posiciones de la serie. | Fundido de 0,6 s hacia otra lámina. | Recuperar un enlace didáctico claro. Al hacerlo, no sugerir que datos simulados son mediciones históricas. |
| E11 | s05, serie | Tabla A.4/A.6: cada fila se iluminaba, subrayaba y conectaba a su punto. | La tabla y los hilos desaparecen al desactivar Dispersion. | Volver a mostrar cómo se lee una cifra y de dónde sale. |
| E12 | s05, serie | Puntos con pulso de foco; banda se extendía; línea unía puntos ya encendidos. | Puntos/etiquetas por opacidad, banda por fundido y línea por máscara con easing distinto. | Recuperar foco y coordinar línea, punto, valor y sonido. |

Evidencia: [condicionales que desactivan los bloques originales](../../../src/escenas/AprenderAMedir/Escena.tsx), [Dispersion original aún disponible](../../../src/components/graficos/Dispersion.tsx), [nuevo adaptador VectorCraft](../../../src/components/graficos/VectorCraft.tsx), [condicional del mapa de Lima](../../../src/escenas/Presentacion/Escena.tsx).

El código original de muchas animaciones sigue en el repositorio: está desactivado, no borrado. No hace falta reconstruir todo desde cero. En balanza, estante, brújula, piscina, afiches y mecanismo del guano no se encontró una eliminación de animaciones en el diff de esta integración: el pendiente allí es sustituir el dibujo sin perder lo que existe.

## D. Otros problemas detectados

1. **Sonidos sin la acción original.** Los tics de paralelos y las teclas de la ficha siguen programados fuera de los bloques desactivados. El cálculo de cruces usa la ruta original, no la nueva. La presencia de audio está confirmada; su efecto perceptivo debe revisarse al escuchar el tramo.
2. **Dos progresiones diferentes en costo.** La línea se revela con una máscara de easing solemne; los puntos se escalonan por década. El arreglo del PR 6 sincronizó etiquetas con puntos, pero no garantiza que la punta de la línea llegue a cada punto al mismo tiempo.
3. **Datos duplicados.** VectorCraft recibe archivo, tiempo y beats, pero no los valores de serie ni las coordenadas de ciudades como datos de dibujo. Cambiar escenas.json puede dejar desactualizados los contornos del SVG.
4. **Dependencia del orden del SVG.** Se seleccionan piezas por índices (por ejemplo recta 41, rutas 31–39). Funciona para la exportación actual; editar el dibujo puede cambiar lo que se anima sin aviso. Preparar nombres estables y validar correspondencias antes de integrar.
5. **Archivo aprobado no equivale a pieza lista para animar.** Muchas exportaciones incluyen fondo, títulos y composición completa. Hay que separar dibujo, rótulos y fondo para reutilizar la escena. El barco, aguja, platos, tapas y páginas requieren independencia.
6. **Instrucciones de respeto desactualizadas.** La guía de dirección todavía prescribe una cruz sobre negro, mientras la revisión del director pide flor y «Fallece». Actualizar esa pauta al implementar la revisión. No se encontró «Muere» ni «Fallece» en los TXT/JSON consultados del episodio; no afirmar que basta cambiar una palabra de escenas.json ni dar por verificada la narración.
7. **Legibilidad pendiente.** Los panfletos tienen contenido, pero su lectura depende del tamaño y del acercamiento en escena. La aprobación del PNG no prueba que puedan leerse en la futura previa de 50 MB.
8. **Recorte del mapa por comprobar.** El nuevo viaje usa máscara y centro limitados. Revisar París, Lima, destino y rótulos durante el acercamiento; es un riesgo identificado, no un recorte confirmado por esta auditoría.
9. **No todas las portadas son intercambiables.** El libro del gancho y el de la deuda son obras distintas. Reutilizar material y técnica, no sobreescribir título/año con la portada aprobada de otro libro.
10. **Persistencia incompleta.** Los originales de las tandas anteriores están disponibles localmente pero no en la carpeta de recursos del repo. Preservarlos junto con un manifiesto de versiones antes de otra integración; los ZIP de tandas antiguas pueden contener versiones superadas.

## E. Orden propuesto para retomar

1. Preservar las versiones vigentes y separar sus piezas. Confirmar correspondencia de cada fila con el destino; no importar fondos completos por defecto.
2. Recuperar primero la explicación documental y los efectos de viaje de s05, porque afectan comprensión y sincronía.
3. Integrar en tandas de tres: balanza/brújula/biblioteca; universidad/panfletos/piscina; islas/Estado/vales; libro/pruebas/monedas. Fichero se trabaja junto a la recuperación de método; flor/línea y carpeta en la continuidad de apertura/cierre.
4. Cerrar la adaptación de pizarra por comparación con la referencia, preservando sus movimientos.
5. Cuando se autorice renderizar, comparar tramos antes/después y después preparar una previa completa de unos 50 MB. Hasta entonces, la revisión audiovisual permanece pendiente.

Este inventario no marca las correcciones como hechas. Se han identificado los pendientes y su evidencia, sin alterar gráficos, audio, animaciones ni producir otro video.

## F. Integración del 10 de noviembre de 2026

Los 16 diseños pendientes o parciales (G01–G16) ya están integrados. **La revisión visual del director sigue
pendiente**: lo que sigue es lo comprobado en cuadros sueltos y en la vista previa completa, no una aprobación.

**Cómo se hizo.** `scripts/vectorcraft-piezas.mjs` separa cada SVG aprobado en capas y piezas, con la caja de
cada pieza medida en Chromium (`public/videos/001-el-hombre/vectorcraft/<diseño>.json`). Cada componente
recibe la lámina por `escenas.json` (`props.laminas`) y dibuja sus piezas **dentro de las mismas
transformaciones animadas** que ya tenía. Sin lámina, el componente dibuja como antes (el 000 no cambia).
Los componentes buscan las capas por nombre: si se reexporta un diseño, hay que conservar los nombres de capa
y volver a correr el script.

| ID | Escena | Qué se conserva del movimiento | Decisiones y diferencias con la lámina |
|---|---|---|---|
| G01 | s00 | El libro baja, se estampa por partes (autor y filetes → título y ornamentos → año) y la luz baja al final | Solo en s00. El libro de s06 (*La deuda defraudada*) sigue siendo la portada dibujada: no se reutiliza esta tapa para otro título |
| G02 | s00 | Entran las diez, caen tres, la cuarta queda en duda con su contorno punteado, sonido | Entran doradas; **las que caen pasan a cobre al caer** y la dudosa, a la rayada. El color llega con el gesto |
| G03 | s01 | Las correcciones se hacen una tras otra (llave, tachón, círculo, visto bueno, flecha, «precisar») y la cámara entra a la página | El lápiz rojo de la lámina reemplaza a la pluma y hace los trazos |
| G04 | s01 | Pausa sobre negro, fecha, recorrido de meses y llegada al libro | **La cruz se reemplaza por la flor de recuerdo** (crece despacio) y «Fallece Alfonso Quiroz.»; en la línea, `FALLECE · 2 ENE 2013`. La línea de tiempo animada se conserva; la lámina no la reemplaza |
| G05 | s02 | Página → piscina → página; el agua corre con la cámara y se calma al frenar; los renglones quedan | Pileta enmarcada (el marco no viaja): lo que corre es el agua (reflejos y cáusticas). Las corcheras se mecen |
| G06 | s03 | El emblema cae y se asienta donde caía el sello; corchete de los primeros puestos | Lleva el aviso «Interpretación vectorial del escudo tradicional». Casi sin giro (es un escudo, no un timbrazo) |
| G07 | s03 | Cada panfleto se pega con su resorte; cámara al volante y regreso; el último se despega | Mismo alto que los afiches dibujados, centrados en su lugar (son más angostos). Su pie dice «no es un afiche histórico» |
| G08 | s05 | Antes de `caen`: el fichero entra, las fichas se levantan una tras otra y **cada punto sale de su boca en arco** | Recupera la procedencia documental (E07). Se va antes de que se escriba la recta |
| G09 | s05 | La cruz se inclina con su peso, la aguja del fiel la sigue, las tarjetas caen sobre los platillos | Las palabras son las de la lámina (PROFUNDIDAD, CLARIDAD); si cambian en el guion, hay que reexportar |
| G10 | s05 | Libros que caen por turnos, se estiran y se aplastan contra la repisa | Cuatro libros sueltos (sin los lomos sin título). Sin el encabezado de la lámina: chocaría con la ficha BARUCH COLLEGE |
| G11 | s05 | Aguja de tope a tope con rebote, notas por época, paso a tiza | La lámina se escala al radio de la escena. Los rótulos de los polos crecen hacia afuera (antes pisaban el bisel) |
| G12 | s06 | Libro, cámara al grabado, sacos que suben uno por uno, la cámara sigue a la fragata hasta el Estado | Mar, aves en vuelo y fragata animados. La fragata del Estado es la misma de la lámina |
| G13 | s06 | Se dibuja de abajo hacia arriba; las ventanas se encienden con siluetas | Cuatro ventanas (antes, seis vanos) |
| G14 | s06 | Apilado en arco, sello 1850 con golpe, monto que se infla | Sin el sello rojo de la lámina (lo estampa la escena). El contador entra en la casilla en lugar de «por examinar» |
| G15 | s07 | Golpe, negro y tarjeta | **Cerrar es guardar**: los papeles bajan dentro de la carpeta detrás de la tapa y se ata el cordón (la lámina es de frente; ya no hay tapa en 3D) |
| G16 | s04 | Franjas, escritura de izquierda a derecha, foco por capa, bajar, palabra, realce y remate | Las tres ondas y los estratos son los de la lámina. Rótulos, tempos y nombres siguen escritos desde los datos |

**Avisos de la lámina que no salen en pantalla:** el del vale («no reproduce un vale histórico»), el de la
fachada («no representa una sede histórica concreta») y el del fichero son texto claro pensado para fondo
oscuro; sobre papel no se leen. Si hacen falta, hay que decidir dónde ponerlos.

**Efectos de la sección C.** E07 se recuperó con el fichero. Los demás, en la tanda siguiente (abajo).

## G. Efectos recuperados (10 de noviembre de 2026)

| ID | Cómo quedó | Componente |
|---|---|---|
| E01 | La cámara se acerca a Lima (×1,5, 2,4 s, `solemne`) sin moverla: el mapa crece a su alrededor | `LugarLamina` |
| E02 | La pizarra se retira y el mapa queda como recuadro de la página; el agua lo cubre con su frente y vuelve con el papel | `LugarLamina` + `frenteSecado` |
| E03 | Cámara de la muestra original: se echa atrás, se lanza, mira 7 % por delante, frena y se abre con resorte; hasta ×1,9 y acotada al área útil del mapa | `ViajeLamina` |
| E04 | La ruta a París se escribe tramo a tramo, duda y se borra desde la punta; las notas entran renglón por renglón junto a la ciudad | `ViajeLamina` |
| E05 | Paralelos 0°, 15° y 30° que se encienden al cruzarlos (latitud con la Mercator calibrada de la lámina: ecuador en y = 820,2), faro del destino, llegada con resorte y contador de km | `ViajeLamina`; tics recalculados sobre la ruta de la lámina (D1) |
| E06 | «Columbia University / Beca · H. S. Klein» se escribe de izquierda a derecha al ritmo de las teclas | `ViajeLamina` |
| E08 | La recta entra torcida, gira hasta la que mejor pasa y se asienta; después los residuos se estiran desde cada punto, con su explicación | `VectorCraft` (regresión) |
| E09 | «Y dice cuánto pesa»: el escalón de la pendiente sobre la recta, «un paso» y «cuánto sube» | `VectorCraft` (regresión) |
| E10 | Los puntos simulados se retiran primero; solo los ejes del ejemplo viajan hasta los de la serie real. No se sugiere que el ejemplo sea una medición | `VectorCraft` (`haciaSerie`) |
| E11 | Columna con los cuadros A.4 y A.6: cada fila se enciende, se subraya y un hilo la une a su punto (el gráfico se achica a 86 % para dejarle lugar) | `VectorCraft` (`tabla`) |
| E12 | La línea llega a cada punto cuando ese punto se enciende; cada punto late; la banda 3–4 % se extiende de izquierda a derecha | `VectorCraft` (costo) |

La guía de dirección (`DIRECCION_DE_VIDEO.md`) todavía dice «pequeña cruz»: es texto del director y no se tocó.
