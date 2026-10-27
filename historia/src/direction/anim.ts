import { interpolate } from 'remotion';
import { peso, type Peso } from './easings';

/** De 0 a 1 entre dos segundos de la escena, siempre con clamp. `t` = segundos de la escena. */
export const tramo = (t: number, desde: number, dur: number, p: Peso = 'natural'): number =>
  interpolate(t, [desde, desde + Math.max(dur, 1e-3)], [0, 1], {
    easing: peso[p],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Mezcla lineal entre dos valores. */
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Limita un valor entre a y b. */
export const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));

/** Un beat de la escena, o el valor por defecto si el JSON no lo trae. */
export const beat = (beats: Record<string, number>, nombre: string, porDefecto: number): number =>
  typeof beats[nombre] === 'number' ? beats[nombre] : porDefecto;
