# Animación y continuidad — sección 2

Borrador para Claude; actualizado el 10 de noviembre de 2026. Las viñetas son estados internos de escenas largas. Los tiempos permanecen sin fijar hasta trabajar con la locución.

## Montaje del encuadre

Cada escena ocupa 1120 × 630 dentro de una lámina de 2520 × 2140. secuencia.json indica el rectángulo en coordenadas globales del documento, la lámina y las capas principales. Recortar el encuadre e incluir las capas auxiliares visibles que lo cruzan; las notas de voz y cámara quedan fuera del video. Escalar a 1920 × 1080 con factor 12/7.

## Escenas y pasos internos

### Del reclamo al vale · viñetas 1–6

1. Retomar la carpeta y aislar el reclamo con pestaña roja.
2. Desplegar los dos orígenes y la ley de 1850; volver al mismo papel.
3. Revisar origen, acreedor y monto por turnos; el personaje señala con la cámara quieta.
4. Incorporar el reconocimiento y después el vale como otro documento.
5. Desplazar el vale hacia el acreedor y sostener su condición de deuda, sin entrega de efectivo.

### Retroceso e intermediación · viñetas 7–12

1. Rotular el regreso al momento anterior al reconocimiento.
2. En el acercamiento, preparar manos y papel; establecer el contacto antes del traspaso.
3. Recuperar comprador e intermediario en la misma mesa.
4. Marcar el favorecimiento ilegal después de explicar la compraventa.
5. Comparar precio y valor reconocido, abrir el circuito y retirar el ejemplo al entrar Novoa.

## Personajes y contacto

Se retiran cinco detalles de mano redundantes en planos que ya muestran los dos brazos del personaje. Los acercamientos 05 y 08 conservan manos y contacto de referencia con los bordes del papel.

Los SVG de bustos y manos son referencias estáticas de encuadre, con su recorte registrado en ../personajes-1850/bustos/poses.json. Usar los rigs de 900 × 1200 para articular: torso, cabeza y miembros mantienen el mismo origen; las piezas no se ajustan por separado a sus límites. La variante marrón sustituye cinco piezas del comerciante. Las figuras con nombre siguen siendo representaciones de función, identificadas por rótulos.

La atención mantiene ojos abiertos, cejas de atención y boca en reposo. Para señalar, la referencia usa -35 grados CSS en el brazo cercano y -50 en su antebrazo, con la mano 36; el antebrazo hereda el brazo. Comenzar en reposo, preparar el gesto, llegar al papel y sostener. Cambiar una variante de ojos, cejas, boca y mano por vez. No asignar movimientos de boca a la voz narrativa.

En acercamientos, el antebrazo y la mano giran juntos -90 grados CSS una sola vez. Los puntos de contacto de secuencia.json son referencias de esta lámina, no trayectorias resueltas. Preparar ambos extremos, conservar el contacto mientras cambia el papel de dueño y soltar después de que lo reciba el otro. Verificar estados intermedios, codo, muñeca, oclusión y borde del documento a tamaño final.

## Cámara, luz y lectura

Mantener quieta la cámara durante el gesto y sostener el personaje cuando el foco recorre los campos. Dar lectura a rótulos, cifras, unidades y cautelas. Conservar degradados, textura de papel, sombras, luz y señales del video al integrar los recursos. La pestaña roja sigue al reclamo; el vale conserva su marco propio. Cada transición conserva un objeto conocido y deja entender el resultado del paso anterior.

En Remotion, los cambios dependen de useCurrentFrame. tramo recibe segundos; convertir frame/fps antes de llamarlo y mantener la jerarquía de pivotes del kit. Revisar el montaje y las poses con fotogramas estáticos antes de decidir un render de video. Esta entrega no integra código ni valida una animación.

## Versión de continuidad completa

Usar el [desarrollo de la escena 2](../escenas-largas/escena-02/secuencia.json) y la [dirección común](../escenas-largas/ANIMACION.md). Esta sección es una de las cinco escenas largas; los grupos anteriores son recorridos internos. La continuidad nueva aporta los estados dibujados y sus enlaces. Las fuentes y recursos de este original se conservan.
