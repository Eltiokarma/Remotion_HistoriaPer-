import { Easing } from 'remotion';

/** Cada animación declara su peso; nunca un easing global. */
export const peso = {
  solemne: Easing.bezier(0.65, 0, 0.35, 1), // títulos, revelaciones, fechas clave
  pesado: Easing.bezier(0.7, 0, 0.2, 1), // mapas, bloques grandes
  natural: Easing.bezier(0.33, 0, 0.2, 1), // movimiento general
  ligero: Easing.bezier(0.2, 0.6, 0.3, 1), // partículas, detalles, acentos
  tenso: Easing.bezier(0.8, 0, 0.9, 0.4), // aceleración hacia un corte brusco
} as const;

export type Peso = keyof typeof peso;
