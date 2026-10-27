import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { staticFile } from 'remotion';
import type { Escena, EscenaResuelta } from '../types';

const COLA_S = 0.8;

/**
 * Duración de cada escena: si hay voz (la real en public/voz/... o, si falta, la provisional),
 * la escena dura lo que dura la voz más una cola; si no hay ninguna, `duracion_s` del JSON.
 * Así el video se cuadra a la narración y no al revés.
 */
export async function resolverEscenas(escenas: Escena[], fps: number): Promise<EscenaResuelta[]> {
  return Promise.all(
    escenas.map(async (e) => {
      // Primero la voz real; si todavía no está grabada, la provisional (TTS).
      for (const [src, provisional] of [[e.voz, false], [e.voz_provisional, true]] as const) {
        if (!src) continue;
        try {
          const d = await getAudioDurationInSeconds(staticFile(src));
          const frames = Math.ceil((d + (e.cola_s ?? COLA_S)) * fps);
          // Mientras los beats no se ajusten a mano a la voz, se escalan en proporción
          // para que ningún momento clave quede fuera de la escena.
          const k = frames / fps / e.duracion_s;
          const beats = e.beats_ajustados
            ? e.beats
            : Object.fromEntries(Object.entries(e.beats).map(([n, v]) => [n, v * k]));
          return { ...e, beats, frames, vozSrc: src, vozProvisional: provisional };
        } catch {
          // no existe: se prueba la siguiente
        }
      }
      return { ...e, frames: Math.round(e.duracion_s * fps), vozSrc: null, vozProvisional: false };
    }),
  );
}
