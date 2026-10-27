/**
 * Reglas de ritmo del canal (CLAUDE.md §3, §5 y §6), como funciones puras.
 * Las aplica `npm run validar`; no dependen de Remotion.
 */

/** Tres escenas seguidas cuyas duraciones no se separan más de esto se sienten iguales. */
export const TOLERANCIA_DURACION = 0.1;
/** La curva de intensidad no puede ser plana: desviación estándar mínima. */
export const DESVIACION_MINIMA = 1;
/** Silencio deliberado: entre 1.5 y 3 s. */
export const SILENCIO_S: [number, number] = [1.5, 3];
/** Ducking de la música bajo la voz, en dB. */
export const DUCKING_DB: [number, number] = [-18, -12];
/** Estados que debe recorrer la música en un video (al menos tres). */
export const ESTADOS_MUSICA = ['ausente', 'presente', 'protagonista'] as const;

/** Índices i tales que las escenas i, i+1 e i+2 duran casi lo mismo. */
export const triosParejos = (duraciones: number[], tolerancia = TOLERANCIA_DURACION): number[] => {
  const trios: number[] = [];
  for (let i = 0; i + 2 < duraciones.length; i++) {
    const tres = duraciones.slice(i, i + 3);
    if (Math.max(...tres) / Math.min(...tres) <= 1 + tolerancia) trios.push(i);
  }
  return trios;
};

export const desviacion = (valores: number[]): number => {
  const media = valores.reduce((a, v) => a + v, 0) / valores.length;
  return Math.sqrt(valores.reduce((a, v) => a + (v - media) ** 2, 0) / valores.length);
};

/** La curva en una línea: ▁▂▄▆█ para intensidades 1–5. */
export const curva = (intensidades: number[]): string => intensidades.map((v) => '▁▂▄▆█'[Math.max(0, Math.min(4, v - 1))]).join('');

/** Estados de música mencionados en las notas `estado_musica` (p. ej. "presente → silencio"). */
export const estadosMusica = (notas: (string | undefined)[]): Set<string> => {
  const vistos = new Set<string>();
  for (const n of notas) for (const e of ESTADOS_MUSICA) if (n?.toLowerCase().includes(e)) vistos.add(e);
  return vistos;
};
