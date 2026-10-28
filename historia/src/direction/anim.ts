import { interpolate } from 'remotion';
import { peso, type Peso } from './easings';

/**
 * De 0 a 1 entre dos segundos de la escena, siempre con clamp. `t` = segundos de la escena. Un tramo
 * que empieza en `Infinity` (un paso que en esta escena no ocurre) se queda en 0.
 */
export const tramo = (t: number, desde: number, dur: number, p: Peso = 'natural'): number =>
  !Number.isFinite(desde) || !Number.isFinite(dur)
    ? (desde === -Infinity ? 1 : 0)
    : interpolate(t, [desde, desde + Math.max(dur, 1e-3)], [0, 1], {
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

/** Escala en x e y. Se aplica con `transform: scale(sx, sy)` y un `transformOrigin` en el punto de contacto. */
export type Escala = { sx: number; sy: number };

/**
 * Comprimir y estirar al tocar (Disney, con mesura): en el contacto el objeto se aplasta un poco y
 * se ensancha lo mismo (el área no cambia), rebota apenas estirado y vuelve en un cuarto de segundo.
 * Tiene que ser indetectable: se nota que falta, no que está. `fuerza` es la fracción de aplastamiento
 * según el material: 0,025 una pila de papel, 0,035 lámina y madera, 0,05 cartón y libros, 0,12 un
 * líquido (con `amortiguacion` baja, tiembla más). Piedra y metal macizo: nada. Solo objetos físicos:
 * nunca texto que se lee ni datos.
 */
export const impacto = (t: number, desde: number, fuerza = 0.05, amortiguacion = 9): Escala => {
  const d = t - desde;
  if (d < 0 || d > 1.2) return { sx: 1, sy: 1 };
  // llega al aplastamiento máximo en dos cuadros y vuelve con un rebote apenas estirado
  const s = d < 0.06 ? fuerza * (d / 0.06) : fuerza * Math.exp(-(d - 0.06) * amortiguacion) * Math.cos((d - 0.06) * 20);
  const sy = 1 - s;
  return { sx: 1 / sy, sy };
};

/**
 * Estirar con la velocidad: lo que cae rápido se alarga apenas en la dirección del movimiento
 * (y se afina lo mismo). `velocidad` en px/s; a 2000 px/s se estira el máximo.
 */
export const estiraCon = (velocidad: number, maximo = 0.06): Escala => {
  const s = clamp(Math.abs(velocidad) / 2000) * maximo;
  return { sx: 1 / (1 + s), sy: 1 + s };
};

/** Componer dos escalas. */
export const por = (a: Escala, b: Escala): Escala => ({ sx: a.sx * b.sx, sy: a.sy * b.sy });

/** `scale(…)` listo para un estilo o un atributo transform de SVG. */
export const escala = (e: Escala, base = 1): string => `scale(${(base * e.sx).toFixed(4)}, ${(base * e.sy).toFixed(4)})`;

/**
 * Arcos: lo que viaja de un lugar a otro no va en línea recta. Desvío perpendicular (en px) para
 * el avance `k` (0–1): cero en los extremos, `alto` en el medio.
 */
export const arqueo = (k: number, alto: number): number => alto * 4 * clamp(k) * (1 - clamp(k));

/** Velocidad de una función del tiempo (unidades por segundo), por diferencia centrada. */
export const velocidad = (f: (t: number) => number, t: number, fps: number): number => (f(t + 1 / fps) - f(t - 1 / fps)) * (fps / 2);
