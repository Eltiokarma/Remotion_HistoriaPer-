# Imágenes que hay que generar en ChatGPT · Escena 3

Personajes PNG para «El expediente de Novoa». Las medidas se refieren a la [hoja de montaje](revision/hoja-montaje.png) y a la [composición del plazo](revision/composicion-plazo-3c.png) (cuadro 1920 × 1080). Pendiente de aprobación de Gerson antes de generar.

## Decisión previa de Gerson

Echenique y Torrico tienen retratos de época. Hay dos caminos:

1. **Figuras ilustradas** con los prompts de abajo, que no pretenden parecido: el nombre lo da la placa.
2. **Retratos de archivo** en dominio público, con su licencia anotada en `fuentes.md`. Se tratan como fotografía o grabado, no como personaje animable.

Novoa y Elías no tienen retrato conocido en las fuentes del episodio: van como figuras ilustradas en los dos casos. Hasta que Gerson decida, conviene generar solo Novoa y Elías.

## Condiciones comunes

- **Estilo:** el mismo del [trabajador 1A](../prompts-chatgpt-escenas-01-02.md). Cada prompt lo repite para poder pegarlo en un chat nuevo.
- **Archivo:** PNG con canal alfa, **medio cuerpo**, de la cabeza a la cintura, al menos 1536 px de alto. Sin fondo, sombra, texto ni marco.
- **Encuadre:** la cabeza queda en y ≈ 420 y la cintura en y ≈ 1060. Ancho con los brazos: ≈ 430 px. La mesa del despacho (y ≈ 850–870) tapa la parte baja del cuerpo.
- **Lados fijos:**
  - en 3B, Novoa a la izquierda y Elías a la derecha;
  - en 3C, Echenique a la izquierda y Elías sigue a la derecha;
  - en 3E, Novoa a la derecha.
- **Rigor:** son figuras ilustrativas, no retratos.
  - Sin bocas abiertas ni gestos de diálogo: no se afirma una reunión ni una conversación (REVISION 3C).
  - Sin gestos de complicidad ni caricatura del corrupto.
  - La comisión de Elías es legítima según Q, p. 171.
- **Manos sin objeto:** los folios son SVG y se ponen después.

## Lista

| Imagen | Momento | Lado y mirada | Contacto |
|---|---|---|---|
| novoa-A · atenta | 3B · 1–3 | izquierda, mira a la derecha | manos apoyadas tras la mesa |
| novoa-B · lee el resultado | 3E · 2 | derecha, mira a la izquierda | C · mano en la mesa (1405, 870) |
| elias-A · reposo | 3B · 1, 3C | derecha, mira a la izquierda | manos bajas |
| elias-B · señala | 3B · 2–3 | derecha, mira a la izquierda | A · índice en (1197, 560) |
| echenique · atento | 3C, 3F | izquierda, mira a la derecha | manos bajas |
| torrico · atento | 3D · 1, 3F | derecha, mira a la izquierda | manos bajas |

En 3F las cuatro figuras se reutilizan reducidas junto a sus placas; no hace falta otra imagen.

## Prompts

### novoa-A · atenta

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior, nada más recortado.

Personaje: mujer limeña propietaria hacia 1850, de unos 50 años, cabello oscuro con algunas canas recogido en un moño bajo con raya al medio, vestido de corpiño ajustado verde azulado oscuro con botones pequeños y cuello blanco estrecho, chal de lana color ocre claro cruzado sobre un hombro. Expresión seria y atenta, boca cerrada.

Pose: de frente a tres cuartos, mirando a la derecha. Los dos antebrazos bajos y relajados, las manos juntas a la altura de la cintura, como apoyadas en el borde de una mesa que no se ve.

No dibujes la mesa ni papeles. Sin gesto de hablar ni de reclamar; sin dramatismo.
```

### novoa-B · lee el resultado

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior, nada más recortado.

Personaje: mujer limeña propietaria hacia 1850, de unos 50 años, cabello oscuro con algunas canas recogido en un moño bajo con raya al medio, vestido de corpiño ajustado verde azulado oscuro con botones pequeños y cuello blanco estrecho, chal de lana color ocre claro cruzado sobre un hombro. Expresión reflexiva y contenida, boca cerrada, la mirada baja hacia la izquierda, como leyendo un papel que está sobre una mesa.

Pose: de frente a tres cuartos, mirando a la izquierda. La mano más cercana a la izquierda descansa abierta, con la palma hacia abajo, a la altura de la cintura y algo adelantada; la otra mano queda baja junto al cuerpo.

No dibujes la mesa ni el papel. Sin alegría ni decepción exageradas.
```

### elias-A · reposo

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior, nada más recortado.

Personaje: comerciante y hacendado limeño hacia 1852, hombre de unos 45 años, cabello castaño oscuro peinado hacia atrás, patillas cortas, rostro afeitado, levita marrón oscuro, chaleco color ante con botones, camisa blanca de cuello alto y corbatín negro. Expresión atenta y segura, boca cerrada.

Pose: de frente a tres cuartos, mirando a la izquierda. Los brazos bajos y relajados, las manos a la altura de la cintura.

No dibujes papeles ni mesa. Sin guiños, sonrisas maliciosas ni caricatura.
```

### elias-B · señala

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior; el brazo extendido entra completo en la imagen.

Personaje: comerciante y hacendado limeño hacia 1852, hombre de unos 45 años, cabello castaño oscuro peinado hacia atrás, patillas cortas, rostro afeitado, levita marrón oscuro, chaleco color ante con botones, camisa blanca de cuello alto y corbatín negro. Expresión explicativa y serena, boca cerrada.

Pose: de frente a tres cuartos, mirando a la izquierda. El brazo más cercano a la izquierda se extiende horizontal hacia la izquierda a la altura del pecho, con el dedo índice señalando un documento que no se ve; la otra mano queda baja junto al cuerpo.

No dibujes el documento ni la mesa. Sin gesto amenazante ni de complicidad.
```

### echenique · atento (solo si Gerson elige figuras ilustradas)

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior, nada más recortado.

Personaje: figura ilustrativa de un presidente peruano hacia 1852, no un retrato: hombre de unos 45 años, cabello oscuro peinado de lado, levita negra de civil, chaleco gris, camisa blanca de cuello alto y corbatín negro. Sin banda presidencial, condecoraciones ni uniforme. Expresión seria y neutra, boca cerrada.

Pose: de frente a tres cuartos, mirando a la derecha. Los brazos bajos y relajados, las manos a la altura de la cintura.

No dibujes papeles ni mesa. Sin gesto de hablar, ordenar ni negar.
```

### torrico · atento (solo si Gerson elige figuras ilustradas)

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Figura de medio cuerpo, de la cabeza a la cintura, aislada, sin sombra proyectada, sin texto ni marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF sin textura. Formato vertical 1024 × 1536, el corte de la cintura en el borde inferior, nada más recortado.

Personaje: figura ilustrativa de un ministro de Guerra peruano hacia 1852, no un retrato: hombre de unos 45 años, cabello oscuro corto, patillas, levita civil verde muy oscuro, chaleco gris claro, camisa blanca de cuello alto y corbatín negro. Sin uniforme, charreteras ni condecoraciones. Expresión neutra, boca cerrada.

Pose: de frente a tres cuartos, mirando a la izquierda. Los brazos bajos y relajados, las manos a la altura de la cintura.

No dibujes papeles ni mesa. Sin gestos de complicidad, sonrisas maliciosas ni caricatura del corrupto.
```

## Lo que no hay que generar

- Folios, rótulos, conectores, hacienda, tintero ni fondo del despacho: ya están en SVG.
- Carpeta NOVOA, pizarra y vale: se reutilizan de la escena 2.
- Dinero, firmas, sellos auténticos ni escenas de reunión.
