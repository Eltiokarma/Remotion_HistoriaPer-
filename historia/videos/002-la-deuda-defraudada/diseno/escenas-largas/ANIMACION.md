# Continuidad para Claude — episodio 002

Borrador visual del 10 de noviembre de 2026. Esta carpeta desarrolla **cinco escenas largas**, los 24 momentos del storyboard y 97 estados en 32 láminas. Las hojas y los estados no establecen cortes automáticos. La [secuencia principal](secuencia.json) agrupa exactamente cinco escenas; cada una contiene su recorrido interno.

## Entrada, acción, pausa y salida

Leer las acciones y las pausas antes de fijar tiempos. La voz es referencia del borrador anterior; ajustarla al guion aprobado y a la locución. Todos los tiempos quedan en null, excepto la propuesta de dos segundos de silencio después de 948.500 en 3D. Cuando haya una cifra nueva, sostener el cuadro para leer también unidad, fecha y grado de certeza.

Las láminas miden 2520 × 2140; los encuadres, 1120 × 630, escalables por 12/7 a 1920 × 1080. Las mesas están en columna, separadas 80. Cada secuencia de escena indica el rectángulo local, el global y los ids de los grupos colocados. El inventario lleva al documento de origen y su encuadre. Los SVG de referencia son vectoriales, con letras contorneadas; los nativos conservan capas y texto editable.

Los pies con fuente pueden permanecer en pantalla. Las instrucciones incrustadas como «pausa de 2s», «sin inventar» o notas de producción se trasladan a la escaleta; no volcar toda la lámina en el video. No convertir una hoja completa en una imagen con fundido. Recuperar sus componentes del editable y los recursos anteriores.

## Cuerpos, cámara y contacto

El [kit](../personajes-1850/README.md) conserva las 135 piezas alineadas a 900 × 1200. Montar con sus padres y pivotes; cada antebrazo hereda el brazo, cada mano su muñeca. Las rotaciones de [poses-continuidad/poses.json](../personajes-1850/poses-continuidad/poses.json) son locales CSS, positivas en sentido horario. Un busto recortado es referencia; no sustituye el rig. Aplicar el espejo una sola vez al contenedor general. Mantener el torso detrás de la mesa y la mano delante del borde y del documento cuando lo sujeta.

Preparación: brazo cercano −17,5° y antebrazo −25°, mano relajada. Señalamiento: brazo −35° y antebrazo −50°, con la mano 36. Los estados quietos dejan descansar el gesto. Mantener ojos, cejas y boca elegidos por familia; una sola variante visible de cada una. No sincronizar la boca de las figuras históricas con el narrador.

[traspasos.vectorcraft](recursos/gestos/traspasos.vectorcraft) contiene seis mesas: tres para el reclamo y tres para el vale. El mismo papel pasa de [200,130,340,380] a [390,105,340,380] y después a [570,130,340,380]. Primero sostiene la mano izquierda; en el centro ambas agarran; al final la derecha sostiene y la izquierda se retira. Los contactos y grupos están en el inventario. La cámara queda quieta durante la recepción. No soltar antes del segundo agarre ni deslizar el papel por dedos inmóviles. Mantener su pestaña roja o marco doble. Estas poses son referencias estáticas; resolver y comprobar la trayectoria intermedia.

[carga.vectorcraft](recursos/gestos/carga.vectorcraft) muestra el saco apoyado, el agarre con el apoyo todavía visible y la salida con un paso. El apoyo abierto es una reconstrucción editorial. La pose de paso añade las rotaciones de piernas y la traslación de raíz sobre el estado final de sostener_carga, sin cambiar los brazos que conservan el saco. El suelo del rig está en y=1090 y el del encuadre en y=530,5. No trasladar el cuerpo rígido: comprobar apoyo, rodillas, peso del saco y sombra.

Durante un gesto, mantener la cámara quieta; durante el recorrido del foco, sostener la pose. Los cuerpos y las manos conservan el rostro corregido: un contorno continuo, una nariz interior y una oreja junto al cabello. No importar otra vez la cabeza de perfil anterior.

## Enlaces entre escenas

1. El folio con pestaña roja y la carpeta enlazan 1D.2 con 2A. Reencuadrar conservando su identidad y dirección.
2. Al terminar 2F, retirar el ejemplo genérico antes de abrir el expediente identificado de Novoa en 3A. No convertir el ejemplo en un caso real.
3. El último estado de 3F es el mismo total de 1851 que abre 4A.1. Sostener ese cuadro y añadir 1852; no volver de un cuadro completo a otro vacío. Las cifras generales no siguen un pago individual de Novoa.
4. Los informes al final de 4E.3 dan paso a la recapitulación explícita de 5A. Después se recuperan en 5B.1 con el cambio de época rotulado. Es continuidad editorial: no afirma que un folio de Novoa llegara físicamente a Quiroz.
5. El índice final enfoca 003, fuentes, decisiones y límites. 004 conserva los resultados generales.

## Distinciones históricas que deben seguir visibles

- Reclamo, reconocimiento, vale y efectivo son cosas distintas. El reconocimiento no dibuja un pago inmediato. Comprar una deuda por sí solo no demuestra fraude; el ejemplo identifica favorecimiento indebido y acuerdo ilegal.
- La comisión pactada entre Novoa y Elías se describe como legítima en el libro. No tratar toda intermediación como soborno.
- Novoa reclama por hacienda, quinientas personas esclavizadas y 32 años de ganancias que afirma haber perdido. La imagen describe su solicitud; no valida ese criterio ni lo confunde con la abolición de 1854. No inventar las fechas de los 32 años.
- 500.000–600.000 es la aprobación que Elías buscó conseguir. Echenique le comunica que el reclamo no cumplió el plazo; la nota dibujada es un resumen, sin diálogo ni resolución auténtica reproducidos. Torrico se rotula ministro de Guerra; el modelo civil no afirma un uniforme documentado.
- 948.500 son pesos en vales aprobados. Probablemente alrededor de 180.000, también pesos en vales, es la estimación de lo recibido por Novoa. La cautela y la unidad entran junto al monto. No restar para inventar un robo o repartir la diferencia.
- La serie de cinco a veinticuatro millones sigue Q, p.170, 1851–1852. No sumarla a las series de otros autores. La conversión se presenta antes de la investigación de 1855. El vale circulante es genérico.
- Los 141 expedientes conservan «irregulares o ilegales»; 12,2 millones se vinculan a ese conjunto. Los cuatro robados son expedientes contados aparte, sin monto adicional conocido. No identificar automáticamente Novoa como uno de los 141.
- Distinguir suspensión del servicio y freno a la conversión el 29 de diciembre de 1856. La restauración del 11 de marzo de 1857 no demuestra regularidad del origen ni una absolución penal general. No se cotejaron las normas originales de forma independiente aquí.
- La mesa del historiador y las pruebas de imprenta son composiciones editoriales, sin afirmar un escritorio, manuscrito o reunión auténticos. Las cautelas del apéndice siguen legibles.

## Efectos y comprobación posterior

Conservar degradados de pizarra y papel, mar azul, textura, sombras, luz, foco y pausas. Animar sus intensidades y posiciones sobre las capas; no sustituirlos por PNG enteras ni borrar efectos al cambiar de dibujo. El brillo que guía la lectura no representa cantidades, porcentajes o pruebas históricas. Coordinar mar, viento y roce de objetos con las acciones; dejar sin música las lecturas sensibles señaladas.

En Remotion, movimiento dependiente de useCurrentFrame; convertir frame/fps antes de funciones que reciban segundos. Antes de solicitar otro video, inspeccionar fotogramas de inicio, preparación, contacto, agarre compartido, liberación y pausa, a tamaño final, y cotejar inventario y efectos. Esta entrega valida dibujos estáticos y archivos; la integración y la animación no están implementadas ni comprobadas. No generar un video por el solo hecho de recibir estos recursos.

## Revisión 2 de la escena 1

Revisión 2 solicitada por Gerson tras revisar las siete láminas. Se modifican apertura, extracción y llenado, posturas y agarre, recepción a bordo, construcción de cuentas, ejemplos de deuda y acercamiento al folio. El contexto fiscal se traslada de 1A a 1D. Se mantienen siete láminas y 21 estados; la voz es una referencia revisada, pendiente de locución final.

Las nuevas posturas tienen cuerpo y brazos dibujados para el gesto, con cabeza canónica. Usar sus grupos y resolver los pivotes y trayectorias al integrar; no aplicarles automáticamente las rotaciones de las poses anteriores. El saco conserva su identidad, se sostiene por ambos lados y se apoya antes de retirar las manos. El barco mantiene sus velas, cuerdas y casco detallados. Conservar textura, gradientes, sombras, pausas y foco. Los campos del reclamo y Por revisar quedan dentro del cuadro. La revisión sigue siendo estática; no se generó video.

## Revisión 2 de la escena 2

Revisión 2 solicitada por Gerson. Las seis láminas conservan 19 estados: folio de enlace y ejemplos actualizados, cotejo con soportes, definición positiva del vale, pago contrario al reclamo, funciones estables, ejemplo de revisión eludida y entrada a Novoa con su comisión legítima diferenciada. Voz de referencia y duraciones pendientes de la locución final.

La entrada recoge exactamente el folio de salida de la escena 1. El recuerdo de ejemplos es breve. El foco une campo y soporte en tres cotejos; el reconocimiento se revela al terminar el tercero. Definir el vale antes de comparar título y efectivo. En el retroceso, rotular antes del reconocimiento. El papel se mueve a la derecha y el pago a la izquierda; el sobre no representa importe ni instrumento documentado. Sujetar el papel hasta que el receptor cierre el agarre. Comprador, intermediario y funcionario conservan las posiciones y modelos de revision.json; sus bustos son referencias, y la actuación utiliza los rigs alineados con sus pivotes. El abuso se destaca en la comprobación eludida del ejemplo didáctico. No convertir toda comisión en soborno o una diferencia de valor en prueba de fraude. Retirar el ejemplo al abrir Novoa; conservar visible que su acuerdo de comisión con Elías se describe como legítimo. La ilustración, la cronología y el movimiento real requieren su comprobación en Remotion. No se generó video.
