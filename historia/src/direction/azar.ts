/**
 * Azar con semilla: el mismo número de semilla da siempre el mismo resultado.
 * En Remotion cada cuadro se dibuja por separado, así que nada puede usar Math.random().
 */
export const azar = (semilla: number) => {
  let s = semilla >>> 0;
  const sig = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    /** número entre 0 y 1 */
    n: sig,
    /** número entre a y b */
    rango: (a: number, b: number) => a + (b - a) * sig(),
    /** un elemento de la lista */
    elegir: <T,>(xs: readonly T[]): T => xs[Math.floor(sig() * xs.length)],
  };
};

/** Semilla a partir de un texto (para que cada elemento tenga "su" azar). */
export const semillaDe = (texto: string): number => {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return h >>> 0;
};
