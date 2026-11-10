# Aprendizajes de producción: gráficos y vistas previas

Registro del 9 de noviembre de 2026, a partir de la revisión del episodio 001.

## Qué falló

- Se confundió terminar una tanda con integrar el conjunto de ilustraciones aprobadas. Se incorporaron los cuatro gráficos de la tanda 6 y una adaptación previa de la pizarra; muchas versiones aprobadas de otras tandas quedaron fuera del video.
- Se sustituyeron bloques completos de escenas para introducir las láminas. Esto simplificó o eliminó efectos de la animación original. Mejorar el dibujo no autoriza a perder dirección, ritmo o acciones secundarias.
- La revisión técnica y los cuadros estáticos no detectaron suficientemente esas pérdidas. Que el archivo se reproduzca y el código pase las comprobaciones no demuestra continuidad audiovisual.
- Se entregó un archivo de aproximadamente 823 MB para 6:37 de video. Se usó 1080p y CRF 20 sin presupuesto de tamaño; las texturas y el grano aumentan el caudal necesario. La expectativa del director era una vista previa de unos 50 MB.
- No se distinguió con suficiente claridad entre duración completa, integración completa y versión final. La voz seguía siendo provisional.

## 1. Inventario antes de integrar

Cada episodio debe tener en su carpeta de diseño un inventario por elemento:

| Escena y momento | Elemento original | Archivo y versión aprobada | Piezas animables | Efectos que conservar | Estado | Evidencia |
|---|---|---|---|---|---|---|
| Identificador y beat | Qué se reemplaza | Ruta exacta, no solo nombre de tanda | Capas con nombre | Entrada, movimiento, cámara, foco, salida, sonido | Dibujado / aprobado / integrado / revisado | Referencia a escena y comparación |

Son estados distintos. Un SVG exportado no está integrado; un SVG importado no está revisado. Registrar también las variantes descartadas para no recuperar accidentalmente una versión anterior. No anunciar «todas las mejoras» sin comprobar cada fila del alcance acordado. Los pendientes se enumeran, no se ocultan detrás de un porcentaje sin inventario.

## 2. Cambiar el dibujo conservando la dirección

Antes de modificar una escena, documentar su comportamiento original: beats ligados a la voz, curvas y pausas, pivotes, recorrido de cámara, iluminación, acciones secundarias, transiciones y sonidos asociados.

Sustituir la representación visual dentro del comportamiento existente. Por ejemplo, una brújula nueva debe conservar el giro de la aguja, sus detenciones, asentamiento y paso a tiza si forman parte de la escena. Una balanza conserva pivote, inclinación y reacción de sus platos. En un viaje se revisan también ruta, contador, marcas del recorrido y llegada.

Si el nuevo dibujo exige cambiar la dirección, describir la diferencia y su motivo expresamente. No reemplazar una escena entera por una lámina con entradas genéricas para facilitar la importación. Revisar los sonidos: conservar su pista no basta si desapareció la acción que la justificaba.

## 3. Preparar vectores para animarlos

- Separar piezas por función y darles identificadores estables: `aguja`, `cuerpo`, `plato-izquierdo`, `ruta`, `destino`.
- Definir pivotes, encuadre, escala y máscaras al integrar.
- No depender de posiciones numéricas de objetos en el SVG: reordenar una ilustración puede romper su animación sin producir un error de compilación.
- Mantener los valores históricos en la fuente de datos del episodio. Si el texto está convertido a contornos, documentar su correspondencia y comprobarlo al reexportar.
- Conservar los originales editables y la versión exportada aprobada. Mantener la paleta, textura y lenguaje visual del video.

## 4. Comparar movimiento, no solo capturas

Antes de dar por cerrada una tanda, comparar el antes y el después del mismo tramo, con el mismo audio y los mismos tiempos, incluyendo su entrada y su salida.

Comprobar:
- presencia de cada gráfico aprobado y ausencia de variantes descartadas;
- legibilidad durante su tiempo real en pantalla;
- movimiento, anticipación, asentamiento y pausas;
- foco de luz y cámara, sin recortes involuntarios;
- transiciones y sincronía entre voz, acción y efectos sonoros;
- continuidad con las escenas vecinas.

Las capturas sirven para composición; no prueban movimiento. Las comprobaciones de tipos y reglas complementan esta revisión. Si el render no está autorizado, registrar la comparación como pendiente; no producir clips automáticamente.

## 5. Vista previa liviana y entrega final

Para próximas revisiones de este episodio, usar como referencia una vista previa completa de unos **50 MB**, salvo otra indicación del director. Registrar antes de exportar duración, resolución, audio, tamaño objetivo y alcance visual.

El tamaño necesita un presupuesto de caudal total: `bytes objetivo × 8 / segundos`. Para 397 segundos y 50 MB decimales, el total ronda 1,0 Mb/s; de ahí se descuentan audio y margen del contenedor. Es una estimación, no una garantía. Elegir resolución y compresión dentro de ese presupuesto y comprobar luego el peso real y la legibilidad. CRF por sí solo no limita el tamaño.

Una vista previa puede reducir resolución y detalle de textura para evaluar el montaje, dejando explícita esa diferencia. La entrega final requiere su propio encargo y las comprobaciones finales del proyecto. Una voz provisional se identifica siempre como provisional y no se publica como narración final.

Antes de un render largo, comprobar también espacio temporal y espacio de salida. Un render completo no sustituye la revisión de cada tanda.

## 6. Cierre de una entrega

- [ ] Inventario del alcance completo, con versiones aprobadas identificadas.
- [ ] Cada elemento anunciado como integrado aparece en la escena correspondiente.
- [ ] Comparación audiovisual realizada; efectos conservados o cambios de dirección documentados.
- [ ] Datos, textos, fuentes y licencias comprobados.
- [ ] Diferencias pendientes enumeradas con claridad.
- [ ] Entrega identificada como previa o final; voz provisional indicada cuando corresponda.
- [ ] Tamaño real verificado contra el objetivo.
- [ ] El resumen de entrega describe lo que realmente se incorporó.

## Aplicación al episodio 001

La [nota de integración de la tanda 6](videos/001-el-hombre/diseno/tanda06-integracion.md) delimita lo incorporado. Las demás ilustraciones aprobadas requieren inventario y comprobación individual: entre ellas, balanza, brújula, biblioteca, vales, islas guaneras, edificio del Estado, libros, panfletos, piscina, universidad y carpeta. Esta relación orienta la auditoría; no constituye un inventario exhaustivo verificado.

La auditoría debe identificar los efectos perdidos y priorizar su recuperación, además de incorporar dibujos pendientes. No se da por corregido el video mediante este documento.

**Estado al registrar estos aprendizajes:** el director pidió reflexionar y documentar, sin generar otro video. Esta actualización es documental; no autoriza un nuevo render.
