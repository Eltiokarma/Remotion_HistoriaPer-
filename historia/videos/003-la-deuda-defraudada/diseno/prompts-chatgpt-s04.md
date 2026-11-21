# Prompts para ChatGPT · escena 4

21 de noviembre de 2026. Las imágenes que faltan según `plan-animatic-s04.md`. Las referencias van en el zip `referencias-s04.zip`:

- `fuente-castilla.jpg`: recorte del óleo de 1845, Commons `File:Castilla1.jpg`, dominio público.
- `fuente-mendiburu.jpg`: recorte de la fotografía del Estudio Courret de hacia 1879, Commons `File:Manuel_de_Mendiburu_Bonet.jpg`, dominio público en EE. UU.
- `formato-medallon.png`: el medallón de Echenique ya aprobado, para copiar el formato.

## 1 y 2. Medallones de Castilla y Mendiburu

Un chat por persona. Adjuntar su `fuente-…jpg` y `formato-medallon.png`. Guardar como `medallon-castilla.png` y `medallon-mendiburu.png`.

```text
Convierte el retrato adjunto en un MEDALLÓN de busto con EXACTAMENTE el mismo formato y la misma técnica que el otro medallón adjunto (círculo de papel crudo, filete doble y fino de tinta sepia, contorno de tinta fino, lápiz y acuarela con grano de papel, sombreado en trazos de grabado). No copies a la persona del medallón de formato: solo su formato y su técnica.

Fidelidad: es una persona real del siglo XIX y este es su retrato de época. Conserva con exactitud sus rasgos: forma de la cara, frente, entradas o peinado, cejas, ojos, nariz, bigote, su edad aparente y la ropa visible en el cuello y los hombros, tal como están en el retrato. No lo embellezcas, no lo rejuvenezcas, no cambies su expresión ni agregues nada que no esté en el retrato. Misma orientación de la cabeza que en el retrato.

Formato: PNG cuadrado 1024 × 1024 con fondo transparente verdadero fuera del círculo. El busto en la misma posición y escala que en el medallón de formato: la parte de arriba de la cabeza a un 12 % del borde superior del círculo, la barbilla cerca del centro y los hombros cortados por el borde inferior. Paleta reducida y cálida: sepia, crudo, marrón tinta y un solo acento de color apagado si el retrato lo tiene. Fondo interior liso y claro, sin paisaje ni objetos. Sin texto, sin nombre, sin marco rectangular.
```

Pegar debajo la línea de la persona:

- **Castilla:** `Persona: Ramón Castilla (1797–1867), presidente del Perú. El retrato es un óleo de 1845: conserva el pelo oscuro peinado hacia atrás, el bigote, el cuello alto bordado en dorado del uniforme y la banda bicolor roja y blanca sobre el pecho. El acento de color es la banda.`
- **Mendiburu:** `Persona: Manuel de Mendiburu (1805–1885), militar, diplomático e historiador peruano. El retrato es una fotografía en blanco y negro de hacia 1879: conserva la calvicie, el pelo corto y canoso a los lados, el rostro afeitado y la expresión seria, y la casaca militar oscura con cuello alto, botones y charreteras. Sin acento de color: todo en sepia.`

## 3. Informe de la junta

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG con canal alfa); si no es posible, blanco liso #FFFFFF. Formato vertical 1086 × 1448; el cuaderno ocupa casi todo el cuadro.

Un informe oficial de mediados del siglo XIX: un cuaderno grueso de pliegos de papel cosidos por el lomo izquierdo con un cordón de hilo, con una tapa de papel más grueso color gris azulado apagado, vista de frente y plana. Los cantos de las hojas asoman por la derecha y por abajo, un poco desparejos, para que se note el volumen. En la tapa, arriba, un recuadro rectangular vacío dibujado con doble filete de tinta, como para un título; el resto de la tapa, liso y con algo de desgaste en las esquinas. Sin texto legible, sin sellos, sin escudo.
```

## 4. Hoja de ley impresa

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG con canal alfa); si no es posible, blanco liso #FFFFFF. Formato vertical 1086 × 1448; la hoja ocupa casi todo el cuadro.

Una hoja impresa oficial de mediados del siglo XIX, vista de frente y plana, de papel crudo algo amarillento con los bordes apenas gastados. Arriba, una franja ancha VACÍA enmarcada por un filete doble fino, donde iría el título. Debajo, dos columnas de texto de imprenta muy pequeño y totalmente ilegible, gris oscuro y parejo, que ocupan solo la mitad superior de la hoja. La mitad inferior queda en blanco, con un filete horizontal corto al centro. Sin escudo, sin sellos, sin texto legible. Debe distinguirse de una página de periódico: es una sola hoja con dos columnas y mucho papel libre.
```

## Al recibirlas

- Los medallones van en `imagenes/retratos/`; el informe y la ley, en la galería, como `obj-17-informe-junta.png` y `obj-18-hoja-ley.png`.
- Registrar en `fuentes.md` que los medallones son redibujos de los retratos de Commons y que el de Mendiburu muestra a un hombre de unos 74 años en hechos de 1852–1853.
