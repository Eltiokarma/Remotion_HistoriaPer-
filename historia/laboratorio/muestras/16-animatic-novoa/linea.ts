import storyboard from '../../../videos/002-la-deuda-defraudada/storyboard.json';
import tiempos from '../../../videos/002-la-deuda-defraudada/narracion_tiempos.json';

/**
 * Línea de tiempo del animatic: la voz manda.
 *
 * Todo lo visual se ancla al «tiempo de voz» (el segundo dentro de voz/s03.mp3). En la versión C se
 * agregan respiros de montaje al final de cada plano: el video se alarga, la voz se corta en esos
 * puntos y, mientras dura el respiro, el tiempo de voz se queda quieto (la imagen se sostiene).
 */
export type Version = 'A' | 'B' | 'C';
export const FPS = 30;

export const FRASES = tiempos.s03.frases;
export const DURACION_VOZ = tiempos.s03.duracion;
const PLANOS = storyboard.escenas.find((e) => e.s === 's03')!.planos;

export type Tramo = { id: string; voz0: number; voz1: number; video0: number; respiro: number };

export const tramos = (v: Version): Tramo[] => {
  let video = 0;
  return PLANOS.map((p, k) => {
    const voz0 = k === 0 ? 0 : FRASES[p.frases[0]].desde;
    const voz1 = k + 1 < PLANOS.length ? FRASES[PLANOS[k + 1].frases[0]].desde : DURACION_VOZ;
    const respiro = v === 'C' ? (p as { respiro?: number }).respiro ?? 0 : 0;
    const t: Tramo = { id: p.id, voz0, voz1, video0: video, respiro };
    video += voz1 - voz0 + respiro;
    return t;
  });
};

export const duracion = (v: Version) => tramos(v).reduce((s, t) => s + (t.voz1 - t.voz0) + t.respiro, 0);

/** Segundo de video → segundo de voz (quieto durante los respiros) y plano en curso. */
export const aVoz = (v: Version, t: number): { voz: number; plano: string } => {
  const ts = tramos(v);
  for (const tr of ts) {
    const largo = tr.voz1 - tr.voz0;
    if (t < tr.video0 + largo + tr.respiro || tr === ts[ts.length - 1]) {
      return { voz: tr.voz0 + Math.min(Math.max(0, t - tr.video0), largo), plano: tr.id };
    }
  }
  return { voz: DURACION_VOZ, plano: ts[ts.length - 1].id };
};

/** Segundo de voz → segundo de video (para colocar efectos de sonido). */
export const aVideo = (v: Version, voz: number): number => {
  const tr = tramos(v).find((x) => voz < x.voz1) ?? tramos(v)[tramos(v).length - 1];
  return tr.video0 + (voz - tr.voz0);
};

/** Inicio y fin de cada frase en tiempo de voz. */
export const F = (i: number) => FRASES[i].desde;
export const Ffin = (i: number) => FRASES[i].hasta;
