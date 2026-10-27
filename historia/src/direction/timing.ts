import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { staticFile } from 'remotion';
import type { Escena, EscenaResuelta } from '../esquema';
import { candidatosVoz, COLA_S, framesSinVoz } from './voz';

/**
 * Duración de cada escena: lo que dura su voz (o, si no hay, `duracion_s`) más `cola_s`.
 * Así el video se cuadra a la narración y no al revés. Mientras los beats no se ajusten a
 * mano (beats_ajustados), se estiran en la proporción voz real / `duracion_s`; la cola no
 * los mueve.
 */
export async function resolverEscenas(videoId: string, escenas: Escena[], fps: number): Promise<EscenaResuelta[]> {
  return Promise.all(
    escenas.map(async (e) => {
      for (const [src, provisional] of candidatosVoz(videoId, e.id)) {
        try {
          const d = await getAudioDurationInSeconds(staticFile(src));
          const frames = Math.ceil((d + (e.cola_s ?? COLA_S)) * fps);
          const k = d / e.duracion_s;
          const beats = e.beats_ajustados
            ? e.beats
            : Object.fromEntries(Object.entries(e.beats).map(([n, v]) => [n, v * k]));
          return { ...e, beats, frames, vozSrc: src, vozProvisional: provisional };
        } catch {
          // ese archivo no existe: se prueba el siguiente
        }
      }
      return { ...e, frames: framesSinVoz(e, fps), vozSrc: null, vozProvisional: false };
    }),
  );
}
