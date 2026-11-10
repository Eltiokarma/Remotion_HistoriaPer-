// Tipos mínimos del motor de buril (vendor/burin.js, MIT, lemo-opuscar). Solo lo que usa la muestra.
export const INK: string;
export type Transform = ((p: [number, number]) => [number, number]) & { scale: number };
export function xf(x?: number, y?: number, s?: number, rot?: number, flip?: boolean): Transform;
export class Ink {
  constructor(o?: { color?: string; minW?: number; chunk?: number });
  group(name: string): Ink;
  schedule(group: string | string[], t0: number, t1: number, o?: { conc?: number; minDur?: number }): Ink;
  build(): Ink;
  draw(ctx: CanvasRenderingContext2D, t?: number, o?: { color?: string; wScale?: number }): [number, number, number][];
  span(group: string): [number, number];
  count(group?: string): number;
}
export function engraveShape(d: string, o?: {
  at?: Transform; light?: [number, number]; spacing?: number; wMax?: number; outlineW?: number;
  style?: 'hatch' | 'contour'; angle?: number; ink?: Ink; g?: string; base?: number; seed?: number;
}): { ink: Ink };
