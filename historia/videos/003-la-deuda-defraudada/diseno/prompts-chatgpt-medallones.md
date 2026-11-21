# Prompts para ChatGPT · medallones de personas (todos en el mismo formato)

20 de noviembre de 2026. Pedido de Gerson: todos los rostros con el mismo formato, en el estilo de grabado de la galería. Las personas con retrato de época se redibujan **a partir de su retrato** (dominio público, Wikimedia Commons; ver `fuentes.md`); quien no tiene retrato va en silueta. Nunca una cara inventada.

## Cómo pedirlos

- Un chat por persona. Adjuntar **dos imágenes**: su retrato (`fuente-<persona>.jpg`) y `referencia-estilo.png` (una figura de la galería, solo para el trazo).
- Pegar el bloque común y, debajo, la línea de la persona.
- Hacer primero uno, revisarlo, y usar ese resultado aprobado como tercera imagen adjunta en los demás («mismo formato que este medallón»), para que los cuatro salgan iguales.
- Guardar como `medallon-<persona>.png` (`medallon-elias.png`, `medallon-echenique.png`, `medallon-torrico.png`, `medallon-novoa.png`).

## Bloque común

```text
Convierte el retrato adjunto en un MEDALLÓN de busto, en el estilo de la otra imagen adjunta (solo su técnica: contorno de tinta fino, lápiz y acuarela con grano de papel, sombreado en trazos de grabado). No copies a la persona de la imagen de estilo.

Fidelidad: es una persona real del siglo XIX y este es su retrato de época. Conserva con exactitud sus rasgos: forma de la cara, frente, entradas o peinado, cejas, ojos, nariz, bigote y barba tal como están en el retrato, su edad aparente y la ropa visible en el cuello y los hombros (cuello alto, corbata, uniforme, charreteras o banda, según el retrato). No lo embellezcas, no lo rejuvenezcas, no cambies su expresión ni agregues nada que no esté en el retrato. Misma orientación de la cabeza que en el retrato.

Formato, igual para todos: PNG cuadrado 1024 × 1024 con fondo transparente verdadero fuera del círculo. Un círculo de papel crudo con un filete doble y fino de tinta sepia en el borde. Dentro, el busto: la parte de arriba de la cabeza a un 12 % del borde superior del círculo, la barbilla cerca del centro, y los hombros cortados por el borde inferior del círculo. Paleta reducida y cálida: sepia, crudo, marrón tinta y un solo acento de color apagado si el retrato lo tiene (una banda, un cuello). Fondo interior del círculo liso y claro, sin paisaje ni objetos. Sin texto, sin nombre, sin marco rectangular.
```

## Línea de cada persona

| Persona | Adjuntar | Línea para pegar debajo del bloque común |
|---|---|---|
| Domingo Elías | `fuente-elias.jpg` | `Persona: Domingo Elías (1805–1867), comerciante y capitalista limeño. Conserva su levita negra, el cuello blanco alto y la banda bicolor roja y blanca tal como se ve en el retrato.` |
| José Rufino Echenique | `fuente-echenique.jpg` | `Persona: José Rufino Echenique (1808–1887), presidente del Perú entre 1851 y 1855. Conserva el uniforme militar con el cuello bordado y las charreteras tal como se ven en el retrato.` |
| Juan Crisóstomo Torrico | `fuente-torrico.jpg` | `Persona: Juan Crisóstomo Torrico (1808–1875), militar, ministro de Guerra entre 1851 y 1854. Conserva el pelo rizado, el bigote y la perilla, y el uniforme con condecoraciones tal como se ven en la fotografía.` |

## Novoa (sin retrato conocido): silueta en el mismo formato

Adjuntar `referencia-estilo.png` y el primer medallón aprobado. No lleva retrato de origen.

```text
Mismo formato exacto que el medallón adjunto: PNG cuadrado 1024 × 1024, fondo transparente fuera del círculo, círculo de papel crudo con filete doble y fino de tinta sepia, mismo tamaño y posición del busto (arriba de la cabeza a un 12 % del borde superior, hombros cortados por el borde inferior). Técnica de la imagen de estilo adjunta, sin copiar a su persona.

Dentro: la SILUETA de busto de una mujer limeña de mediados del siglo XIX, de perfil mirando a la derecha, como una mancha sólida de tinta sepia oscura, sin rasgos interiores (no se ven ojos, boca ni detalles de la cara). Se reconoce por la forma: cabello con raya al medio recogido en un moño bajo en la nuca con un peinecillo pequeño, cuello alto de vestido y un chal sobre los hombros con flecos insinuados en el borde. Proporciones naturales y sobrias, sin caricatura. Sin texto ni nombre.
```

La silueta es a propósito: no se conoce la cara de Ignacia Novoa de Arredondo, y el medallón no debe aparentar un parecido que no tenemos.

## Al recibirlos

Guardarlos en `public/videos/003-la-deuda-defraudada/imagenes/retratos/`, registrar en `fuentes.md` que son redibujos con ChatGPT a partir de los retratos de Commons (y la fecha), y reemplazar en el animatic los recortes actuales.
