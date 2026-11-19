# Prompts para ChatGPT · fondos y figuras que pide el storyboard versión 2

19 de noviembre de 2026. Lo que falta después de recibir el lote de las escenas 1 y 2 (`public/videos/002-la-deuda-defraudada/imagenes/chatgpt/`, fuera de git). El orden es el de prioridad: lo primero sostiene más tiempo de pantalla.

Cada prompt es autosuficiente. Conviene abrir un chat por imagen y **adjuntar como referencia de estilo `fondo-limpio-chincha.png`** (para los fondos) o **`intermediario-explica-tramite.png`** (para figuras), porque el lote recibido ya fija el trazo.

## Lo que no hay que generar

- **Caras de personas reales.** Castilla, Echenique, Elías, Torrico, Mendiburu y Vivanco van con ficha a máquina y, si existe, con su retrato de época en dominio público (Wikimedia Commons, Biblioteca Nacional del Perú), con la licencia anotada en `fuentes.md`. Una cara generada se vería «fiel» sin serlo: es un retrato inventado. Novoa no tiene retrato conocido: va solo con ficha.
- Objetos, papeles, mapa, pila de vales, sellos y rótulos: son SVG o se rotulan en Remotion.

## Estilo común de los fondos (ya incluido en cada prompt)

Ilustración dibujada a mano con contorno de tinta fino; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados (crudo, ocre, terracota, verde azulado, marrón); luz suave desde arriba a la izquierda. Formato horizontal 16:9, al menos 1920 × 1080. Sin personas, sin texto, sin marco, sin firmas.

## 1. Mesa del expediente, vista desde arriba · escenas 0, 3, 4 y 5 · prioridad alta

Es el espacio constante del caso: sobre ella se ponen la carpeta de Novoa, los folios, las fichas y la pila de vales. Tiene que quedar **vacía y tranquila**, con el centro despejado.

```text
Ilustración dibujada a mano con contorno de tinta fino; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave y cálida que entra desde arriba a la izquierda. Formato horizontal 16:9, 1920 × 1080 o más. Sin personas, sin texto, sin marco.

Vista cenital, exactamente desde arriba, de la superficie de un escritorio de madera oscura de un despacho de Lima hacia 1850: tablas con veta visible, algo gastadas, un borde de cuero verde oscuro apenas visible en el margen inferior. La superficie ocupa todo el cuadro. Solo en las esquinas, cortados por el borde: arriba a la derecha un tintero de vidrio con una pluma, abajo a la izquierda el canto de un libro cerrado. El centro (dos tercios del cuadro) queda completamente vacío y de tono parejo, para poner papeles encima. Sombra suave de la luz de una ventana, sin manchas fuertes.
```

## 2. Las islas con barcos en el horizonte · plano 4.8 · prioridad alta

El mismo lugar de la escena 1, cuando la voz dice que barcos ingleses y franceses rondaban las islas. Adjuntar `fondo-limpio-chincha.png` y pedir **la misma composición**.

```text
Usa la imagen adjunta como base y conserva exactamente su composición, su luz, su paleta y su trazo de grabado coloreado: la explanada de guano sobre la roca, el borde rocoso y el mar a la derecha. Formato 16:9, mismo tamaño que la referencia. Sin personas, sin texto, sin marco.

Cambio único: en el horizonte, sobre el mar, dos o tres veleros grandes de mediados del siglo XIX, de tres palos, lejos y pequeños (cada uno ocupa menos del 6 % del ancho), con las velas en parte recogidas, como fondeados o navegando despacio. Sin banderas legibles ni escudos. El cielo un poco más cubierto y el mar un tono más gris que en la referencia, sin tormenta.
```

## 3. Estantería del archivo · planos 4.1 y 4.6 · prioridad media

Donde la carpeta de Novoa vuelve a su estante y donde la junta abre los expedientes. Frontal, para que la pila de vales y las fichas se pongan delante.

```text
Ilustración dibujada a mano con contorno de tinta fino; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Formato horizontal 16:9, 1920 × 1080 o más. Sin personas, sin texto legible, sin marco.

Vista frontal, a la altura de los ojos, de una estantería de madera de un archivo de gobierno de Lima hacia 1850, que ocupa todo el fondo: cuatro baldas largas con legajos de papel atados con cinta, carpetas de cuero gastado y cajas de cartón, de alturas desiguales, sin rótulos legibles. La balda del medio tiene cuatro huecos vacíos separados entre sí, donde faltan legajos. El tercio inferior del cuadro es el canto de una mesa de madera, vacía. Luz que baja hacia los bordes.
```

## 4. Mesa del historiador · planos 5.2 y 5.3 · prioridad media

Otra época: tiene que distinguirse de un vistazo de la mesa de 1850 (rótulo «Muchos años después» en el montaje). No es el escritorio real de Quiroz.

```text
Ilustración dibujada a mano con contorno de tinta fino; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos pero algo más fríos y grises que un grabado del siglo XIX; luz de una lámpara de escritorio desde arriba a la derecha. Formato horizontal 16:9, 1920 × 1080 o más. Sin personas, sin texto legible, sin marco, sin computadoras.

Vista cenital, desde arriba, de un escritorio de trabajo de un historiador de fines del siglo XX: madera clara, el pie redondo de una lámpara de escritorio y su círculo de luz en la esquina superior derecha, una pila de fotocopias atadas con un clip en la esquina inferior izquierda, un lápiz y una goma. El centro (dos tercios del cuadro) queda vacío, para poner encima los papeles del caso.
```

## 5. Trabajadores al fondo · plano 1.3, frase «jornaleros libres, pero también presos, personas esclavizadas y trabajadores chinos» · decide Gerson

Las dos figuras recibidas son hombres de la costa con el mismo origen aparente. La voz nombra varias formas de trabajo; si la imagen solo muestra una, contradice a la voz sin decirlo. La propuesta es un grupo pequeño al fondo, sin rótulos ni señales de condición jurídica, para que la diversidad se vea sin afirmar quién era qué. **Es un tema delicado: generarla solo si Gerson lo aprueba.**

```text
Ilustración dibujada a mano con contorno de tinta fino; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. PNG con fondo transparente, formato horizontal 1920 × 640. Sin suelo, sin sombra proyectada, sin texto, sin marco.

Un grupo de cuatro trabajadores pequeños y lejanos, vistos de cuerpo entero y de perfil, trabajando en fila sobre un terreno que no se dibuja: uno cava con una pala, dos cargan sacos al hombro, uno empuja una carretilla de madera. Son hombres de la costa peruana hacia 1850, de orígenes distintos: un hombre afroperuano, un hombre chino con coleta y sombrero de paja cónico, un hombre andino con chullo y un hombre mestizo; ropa de trabajo sencilla y gastada de esa época. Rostros serenos, concentrados en el esfuerzo, sin rasgos exagerados. Sin cadenas, látigos, capataces ni gestos de sufrimiento teatral.
```

## 6. Trabajador 1A · hunde la pala · opcional

El gesto anterior al que llegó (1B, vierte). Solo si el plano 1.3 necesita ver la pala entrar en el guano; con 1B y el chorro de granos en SVG ya se entiende. El prompt está en [prompts-chatgpt-escenas-01-02.md](prompts-chatgpt-escenas-01-02.md).

## Al recibirlas

Guardarlas en `public/videos/002-la-deuda-defraudada/imagenes/chatgpt/` con el número de esta lista en el nombre, registrar fecha y prompt en `fuentes.md` y correr `python3 storyboard.py` para verlas en su plano.
