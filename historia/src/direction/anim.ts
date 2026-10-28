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

/**
 * Anticipación (Disney): antes de ir de 0 a 1, un pequeño movimiento contrario. Devuelve 0 hasta
 * `desde - prep`, baja hasta `-retroceso` justo en `desde` y de ahí va a 1 con el peso pedido.
 * Sirve para lo que arranca con decisión: una ruta que sale, una cámara que se lanza, algo que salta.
 */
export const anticipa = (t: number, desde: number, dur: number, p: Peso = 'natural', retroceso = 0.06, prep = 0.35): number => {
  if (t < desde - prep) return 0;
  if (t < desde) return -retroceso * tramo(t, desde - prep, prep, 'natural');
  return mix(-retroceso, 1, tramo(t, desde, dur, p));
};

/**
 * Asentamiento (follow through): lo que llega no se clava, se pasa un poco y vuelve. Una oscilación
 * amortiguada que empieza en `desde`; se suma a la posición, el ángulo o la escala final.
 */
export const asienta = (t: number, desde: number, amplitud = 1, frecuencia = 7, amortiguacion = 2.2): number =>
  t < desde ? 0 : amplitud * Math.exp(-(t - desde) * amortiguacion) * Math.sin((t - desde) * frecuencia);
