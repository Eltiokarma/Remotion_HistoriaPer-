import { interpolate } from 'remotion';
import { peso, type Peso } from './easings';

/**
 * Interpola de 0 a 1 entre dos segundos de la escena, siempre con clamp.
 * `t` es el tiempo actual de la escena en segundos.
 */
export const tramo = (t: number, desde: number, dur: number, p: Peso = 'natural'): number =>
  interpolate(t, [desde, desde + dur], [0, 1], {
    easing: peso[p],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Mezcla lineal entre dos valores. */
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Un beat de la escena, o el valor por defecto si el JSON no lo trae. */
export const beat = (beats: Record<string, number>, nombre: string, porDefecto: number): number =>
  typeof beats[nombre] === 'number' ? beats[nombre] : porDefecto;
