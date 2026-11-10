# Animación y continuidad — sección 4

Borrador para Claude; actualizado el 10 de noviembre de 2026. Las viñetas son estados internos de escenas largas. Los tiempos permanecen sin fijar hasta trabajar con la locución.

## Montaje del encuadre

Cada escena ocupa 1120 × 630 dentro de una lámina de 2520 × 2140. secuencia.json indica el rectángulo en coordenadas globales del documento, la lámina y las capas principales. Recortar el encuadre e incluir las capas auxiliares visibles que lo cruzan; las notas de voz y cámara quedan fuera del video. Escalar a 1920 × 1080 con factor 12/7.

## Escenas y pasos internos

### Escala general y circulación · viñetas 1–3

1. Salir expresamente del caso Novoa y mostrar la deuda reconocida.
2. Mostrar un vale genérico y su traspaso; los dos estados conservan el mismo papel.
3. Conservar vale y bono externo juntos durante el canje, anterior a la investigación de 1855.

### De las cartas a la junta · viñetas 4–8

1. Recuperar a Elías y presentar por separado las fechas de sus dos cartas.
2. Volver a su gestión anterior y mantener presentes sus intereses.
3. El Estado permanece mientras avanza la cronología hasta 1855.
4. La junta abre otro conjunto de expedientes; revisar antecedentes, aprobación y emisión.

### Hallazgos y suspensión · viñetas 9–12

1. Presentar 141 expedientes con la calificación irregulares o ilegales antes de 12,2 millones de pesos.
2. Contar aparte los cuatro expedientes robados, sin asignarles otro monto.
3. Distinguir servicio y conversión en la suspensión del 29 de diciembre de 1856.
4. Leer las posiciones de tenedores e investigadores como argumentos resumidos.

### Restauración y fuentes · viñetas 13–16

1. Seguir las peticiones hacia las autoridades sin inventar pagos o culpables individuales.
2. Revelar la fecha del 11 de marzo de 1857 antes de reanudar el título.
3. Conservar a la vista el examen de origen al explicar la rehabilitación financiera.
4. Cambiar expresamente de época para pasar de los informes al historiador.

## Personajes y contacto

Elías mantiene la misma variante que en Novoa. El tenedor posterior no se identifica con un participante del caso. Los acercamientos conservan mangas y manos del kit.

Los SVG de bustos y manos son referencias estáticas de encuadre, con su recorte registrado en ../personajes-1850/bustos/poses.json. Usar los rigs de 900 × 1200 para articular: torso, cabeza y miembros mantienen el mismo origen; las piezas no se ajustan por separado a sus límites. La variante marrón sustituye cinco piezas del comerciante. Las figuras con nombre siguen siendo representaciones de función, identificadas por rótulos.

La atención mantiene ojos abiertos, cejas de atención y boca en reposo. Para señalar, la referencia usa -35 grados CSS en el brazo cercano y -50 en su antebrazo, con la mano 36; el antebrazo hereda el brazo. Comenzar en reposo, preparar el gesto, llegar al papel y sostener. Cambiar una variante de ojos, cejas, boca y mano por vez. No asignar movimientos de boca a la voz narrativa.

En acercamientos, el antebrazo y la mano giran juntos -90 grados CSS una sola vez. Los puntos de contacto de secuencia.json son referencias de esta lámina, no trayectorias resueltas. Preparar ambos extremos, conservar el contacto mientras cambia el papel de dueño y soltar después de que lo reciba el otro. Verificar estados intermedios, codo, muñeca, oclusión y borde del documento a tamaño final.

## Cámara, luz y lectura

Mantener quieta la cámara durante el gesto y sostener el personaje cuando el foco recorre los campos. Dar lectura a rótulos, cifras, unidades y cautelas. Conservar degradados, textura de papel, sombras, luz y señales del video al integrar los recursos. La pestaña roja sigue al reclamo; el vale conserva su marco propio. Cada transición conserva un objeto conocido y deja entender el resultado del paso anterior.

En Remotion, los cambios dependen de useCurrentFrame. tramo recibe segundos; convertir frame/fps antes de llamarlo y mantener la jerarquía de pivotes del kit. Revisar el montaje y las poses con fotogramas estáticos antes de decidir un render de video. Esta entrega no integra código ni valida una animación.

## Versión de continuidad completa

Usar el [desarrollo de la escena 4](../escenas-largas/escena-04/secuencia.json) y la [dirección común](../escenas-largas/ANIMACION.md). Esta sección es una de las cinco escenas largas; los grupos anteriores son recorridos internos. La continuidad nueva aporta los estados dibujados y sus enlaces. Las fuentes y recursos de este original se conservan.
