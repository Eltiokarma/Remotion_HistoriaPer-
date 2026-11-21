import storyboard from '../../../videos/002-la-deuda-defraudada/storyboard.json';
import tiempos from '../../../videos/002-la-deuda-defraudada/narracion_tiempos.json';

/**
 * Línea de tiempo del animatic de la escena 4, en dos partes (plan-animatic-s04.md): la voz manda.
 * Como en la muestra 16, lo visual se ancla al «tiempo de voz» (segundo dentro de voz/s04.mp3) y al final
 * de cada plano se agrega su respiro de montaje: la voz se corta y el tiempo de voz se queda quieto.
 */
export type Parte = 'A' | 'B';
export const FPS = 30;
export const FRASES = tiempos.s04.frases;
export const DURACION_VOZ = tiempos.s04.duracion;
const PLANOS = storyboard.escenas.find((e) => e.s === 's04')!.planos;
const DE: Record<Parte, string[]> = { A: ['4.1', '4.2', '4.3a', '4.3b', '4.3c'], B: ['4.4', '4.5', '4.6', '4.7', '4.8', '4.9'] };

export type Tramo = { id: string; voz0: number; voz1: number; video0: number; respiro: number };

export const tramos = (parte: Parte): Tramo[] => {
  let video = 0;
  return PLANOS.flatMap((p, k) => {
    if (!DE[parte].includes(p.id)) return [];
    const voz0 = k === 0 ? 0 : FRASES[p.frases[0]].desde - (DE[parte][0] === p.id ? 0.4 : 0);
    const voz1 = k + 1 < PLANOS.length ? FRASES[PLANOS[k + 1].frases[0]].desde : DURACION_VOZ;
    const respiro = (p as { respiro?: number }).respiro ?? 0;
    const t: Tramo = { id: p.id, voz0, voz1, video0: video, respiro };
    video += voz1 - voz0 + respiro;
    return [t];
  });
};

export const duracion = (parte: Parte) => tramos(parte).reduce((s, t) => s + (t.voz1 - t.voz0) + t.respiro, 0);

export const aVoz = (parte: Parte, t: number): { voz: number; plano: string } => {
  const ts = tramos(parte);
  for (const tr of ts) {
    const largo = tr.voz1 - tr.voz0;
    if (t < tr.video0 + largo + tr.respiro || tr === ts[ts.length - 1]) {
      return { voz: tr.voz0 + Math.min(Math.max(0, t - tr.video0), largo), plano: tr.id };
    }
  }
  return { voz: DURACION_VOZ, plano: ts[ts.length - 1].id };
};

export const aVideo = (parte: Parte, voz: number): number => {
  const ts = tramos(parte);
  const tr = ts.find((x) => voz < x.voz1) ?? ts[ts.length - 1];
  return tr.video0 + (voz - tr.voz0);
};

export const F = (i: number) => FRASES[i].desde;
export const Ffin = (i: number) => FRASES[i].hasta;
