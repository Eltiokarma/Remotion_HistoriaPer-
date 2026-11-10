# Animación y continuidad — sección 5

Borrador para Claude; actualizado el 10 de noviembre de 2026. Las viñetas son estados internos de escenas largas. Los tiempos permanecen sin fijar hasta trabajar con la locución.

## Montaje del encuadre

Cada escena ocupa 1120 × 630 dentro de una lámina de 2520 × 2140. secuencia.json indica el rectángulo en coordenadas globales del documento, la lámina y las capas principales. Recortar el encuadre e incluir las capas auxiliares visibles que lo cruzan; las notas de voz y cámara quedan fuera del video. Escalar a 1920 × 1080 con factor 12/7.

## Escenas y pasos internos

### Regreso al conjunto · viñetas 1–4

1. Recuperar Chincha detallada y el Estado, sin repetir la extracción.
2. Mantener visible la finalidad declarada del crédito público.
3. Contraponer fichas de grupos excluidos y títulos acumulados; la ilustración no cuenta personas ni porcentajes.
4. Recorrer una vez guano, Estado, reclamo, vale e investigación y sostener el conjunto.

### Cambio de época y contraste · viñetas 5–8

1. Rotular muchos años después y recuperar libro, fichero y pruebas.
2. Desplegar tres familias de fuentes y dirigir el foco por turnos.
3. Volver solo a las dos cantidades de Novoa y su grado de certeza.
4. Abrir hacia el apéndice sin convertir montos de vales en costos de corrupción.

### Cautelas y siguiente episodio · viñetas 9–12

1. Sostener aproximado, provisional y sujeto a revisión.
2. Contrastar huellas sin inventar una fuente estadística completa.
3. Abrir la pregunta del episodio 003 sin resolverla en este cierre.
4. Iluminar 003 en el índice; mantener los resultados generales para 004.

## Personajes y contacto

Las categorías de excluidos se muestran con fichas, sin repetir el rostro de Novoa. Chincha recupera las capas detalladas y el mar azul de la sección 1; el cambio de época del historiador se conserva.

Los SVG de bustos y manos son referencias estáticas de encuadre, con su recorte registrado en ../personajes-1850/bustos/poses.json. Usar los rigs de 900 × 1200 para articular: torso, cabeza y miembros mantienen el mismo origen; las piezas no se ajustan por separado a sus límites. La variante marrón sustituye cinco piezas del comerciante. Las figuras con nombre siguen siendo representaciones de función, identificadas por rótulos.

La atención mantiene ojos abiertos, cejas de atención y boca en reposo. Para señalar, la referencia usa -35 grados CSS en el brazo cercano y -50 en su antebrazo, con la mano 36; el antebrazo hereda el brazo. Comenzar en reposo, preparar el gesto, llegar al papel y sostener. Cambiar una variante de ojos, cejas, boca y mano por vez. No asignar movimientos de boca a la voz narrativa.

En acercamientos, el antebrazo y la mano giran juntos -90 grados CSS una sola vez. Los puntos de contacto de secuencia.json son referencias de esta lámina, no trayectorias resueltas. Preparar ambos extremos, conservar el contacto mientras cambia el papel de dueño y soltar después de que lo reciba el otro. Verificar estados intermedios, codo, muñeca, oclusión y borde del documento a tamaño final.

## Cámara, luz y lectura

Mantener quieta la cámara durante el gesto y sostener el personaje cuando el foco recorre los campos. Dar lectura a rótulos, cifras, unidades y cautelas. Conservar degradados, textura de papel, sombras, luz y señales del video al integrar los recursos. La pestaña roja sigue al reclamo; el vale conserva su marco propio. Cada transición conserva un objeto conocido y deja entender el resultado del paso anterior.

En Remotion, los cambios dependen de useCurrentFrame. tramo recibe segundos; convertir frame/fps antes de llamarlo y mantener la jerarquía de pivotes del kit. Revisar el montaje y las poses con fotogramas estáticos antes de decidir un render de video. Esta entrega no integra código ni valida una animación.
