import type { Paleta } from '../../src/esquema';

/** Todas las muestras se comparan en el mismo formato: 5 s exactos, 1920 × 1080, 30 fps. */
export const FPS = 30;
export const DURACION = 150;
export const ANCHO = 1920;
export const ALTO = 1080;

/** Paleta del video 001 (videos/001-el-hombre/escenas.json): la del canal hoy. */
export const PALETA: Paleta = {
  fondo: '#1c1b19',
  papel: '#ede4d3',
  ocre: '#c2a878',
  rojo: '#b3261e',
  verde: '#5e6b4e',
};
