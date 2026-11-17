/**
 * La lámpara del estudio: una sola luz para los objetos del episodio 001 (balanza, estante, brújula),
 * arriba a la izquierda y cálida. Los une como herramientas de la misma mesa de trabajo en lugar de
 * tres objetos flotando cada uno en su vacío (veredicto «se ve muy plano», tanda 1).
 *
 * Las láminas afinadas en VectorCraft (2026-11-17) ya traen dibujado el modelado con esta luz y sus
 * capas «Sombra — …» desplazadas `sombra`. Si se mueve la lámpara, hay que volver a exportarlas.
 */
export const LAMPARA = {
  /** Centro del charco de luz sobre la pared, en % del cuadro (para `Luz`). */
  x: 34,
  y: 20,
  radio: 88,
  intensidad: 0.26,
  /** Sombra proyectada sobre el plano de atrás (px de la lámina de 1920 × 1080). Ya está en las capas «Sombra — …». */
  sombra: { dx: 26, dy: 38 },
  /** Lo que está casi apoyado (la aguja sobre la esfera, la punta del lápiz en el papel): la escena desplaza su sombra
   * después de girarla o de levantarla. */
  sombraCercana: { dx: 5, dy: 8 },
  /** Lo que está acostado sobre la mesa y se ve desde arriba (las monedas, en px de pantalla). */
  apoyado: { dx: 8, dy: 12, desenfoque: 6, opacidad: 0.55 },
} as const;
