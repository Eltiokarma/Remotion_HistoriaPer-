# Animar la sección 1 en Remotion

Entrega para Claude. El storyboard desarrolla estados de escenas largas y conserva el verde con degradado, papel cálido y ocre del video. La revisión está pendiente de Gerson; no sustituye la voz ni la dirección ya aprobadas.

## Archivos de trabajo

- El nativo [storyboard-02-seccion01-detallado.vectorcraft](storyboard-02-seccion01-detallado.vectorcraft) tiene una capa nombrada por encuadre. De allí se pueden extraer objetos editables; las láminas PNG y PDF son referencias de composición.
- [secuencia.json](secuencia.json) contiene voz propuesta, tres momentos internos, continuidad, sonido y base de cada viñeta. Los segundos son nulos para ajustarlos a la locución.
- [chincha-gran-bretana.vectorcraft](recursos/chincha-gran-bretana/chincha-gran-bretana.vectorcraft) es el original independiente del esquema principal.
- [animacion.json](recursos/chincha-gran-bretana/animacion.json) enumera dieciocho SVG con orden, bounds, pivote y anclas conceptuales.
- [reclamo-editorial.svg](recursos/reclamo-editorial.svg) aísla el papel con pestaña de las viñetas 15–16. Es una plantilla editorial con texto explicativo, no un documento histórico.

## Superponer las capas de Chincha

Todas las SVG de la carpeta capas conservan viewBox 0 0 1920 1080 y fondo transparente, excepto el fondo intencional de 00_fondo. Cada archivo se coloca a x=0, y=0, ancho=1920 y alto=1080. Se dibujan de 00 a 17. No recortar cada SVG a su contenido: se perdería la alineación común.

Usar Img de Remotion y las rutas delVideo de estilo/recursos.ts después de copiar los recursos seleccionados a public/videos/002-la-deuda-defraudada. Los nombres de carpeta de destino los decide la integración y se registran; este trabajo no modifica public ni las escenas.

El pivote del manifiesto está expresado respecto del lienzo completo. Si un wrapper del tamaño del lienzo gira o escala, su transformOrigin usa ese punto en px. Los bounds de roca, aves y barco pueden corresponder al viewport vectorial: no son una medición de la parte pintada.

Un Img por SVG evita colisiones de identificadores. Si se insertan los contenidos inline en un único SVG, prefijar todos los id y sus referencias url(#…), href y xlink:href por archivo; los degradados pueden usar nombres repetidos. Los textos de las SVG están trazados y no dependen de fuentes remotas.

## Construir el recorrido

1. Fijar fondo y contexto. Mostrar roca, mar y aves con un único foco en el origen.
2. Descubrir muelle, sacos y barco. El barco permanece en Chincha. Las figuras del trabajo son poses quietas.
3. Recuperar el saco testigo y revelar la flecha comercial. Su curva está en animacion.json; la punta forma parte de la capa 13. Puede entrar por opacidad o máscara; si se redibuja el trazo, conservar la punta y el peso del original.
4. Al decir Gran Bretaña, entrar mapa y nombre juntos. Acercar después a almacén, sacos y campos para explicar el abono.
5. Abrir al esquema completo y sostenerlo quieto antes de pasar al libro de cuentas.

La flecha no es un recorrido náutico. No llevar el barco por ella ni añadir Cabo de Hornos, puertos, fechas de tránsito o tonelajes. El saco testigo asegura continuidad del producto; no equivale a una unidad de ingresos o deuda.

## Ritmo y efectos del canal

El frame determina toda la animación. Convertir useCurrentFrame() a segundos con fps antes de usar tramo(t, desde, dur, peso), que en este repo recibe segundos. Los beats finales vienen de escenas.json y la voz de Gerson. Usar pesos de direction/easings.ts; spring solo para objetos físicos con configuración explícita.

La cámara se mueve para situar, seguir la carga, abrir una relación o acercar al papel. Si se mueve la cámara, mantener quietas las piezas; si una pieza entra, fijar la cámara. Señalar con brillo un elemento por vez. Conservar degradado, sombra, grano y los efectos pertinentes del video: no reemplazar una escena por una PNG plana.

Los textos, mapas y datos no se estiran. El edificio no rebota ni se deforma. Los sacos pueden asentarse con mesura desde la base, sin que GUANO se comprima. No animar personajes ni usar bucles visibles de olas, velas o aves. Mar, cuerda, papel y herramienta son sonidos puntuales subordinados a la voz, con entrada y salida suaves.

Los cinco bloques de secuencia.json son unidades de explicación; las viñetas no fijan cortes ni duraciones idénticas. El contexto se recupera al volver a acreedores, y el mismo folio con pestaña roja enlaza las secciones 1 y 2. El foco debe sostener por sustentar y por revisar antes de explicar el reconocimiento.

## Comprobaciones al integrar

Las dieciocho capas se exportaron con el MCP de VectorCraft. Tienen el mismo lienzo y ningún elemento image rasterizado. Se recompusieron en otro documento de VectorCraft: la comparación estática coincide visualmente y difiere en 3195 de 2073600 píxeles (0.1541 %); 2007 difieren más de 3/255. No es igualdad de píxeles ni una prueba de movimiento.

Antes de cualquier render autorizado, comprobar en Studio la entrada, el foco, el acercamiento al destino y la salida al libro. Comparar la composición completa con chincha-gran-bretana.png y conservar las dieciocho capas. Comprobar también el mismo papel al entrar en la sección 2 y que el futuro vale no se haya anticipado. No se hizo una integración ni se generó un video en esta revisión.
