/**
 * Dónde está la voz de cada escena. Sin dependencias de Remotion: lo usan el Studio y los
 * scripts (npm run validar).
 */

/** Segundos que la escena sigue después de la voz si el JSON no trae `cola_s`. */
export const COLA_S = 0.8;

/** Frames de una escena sin voz: lo estimado para la narración más la cola. */
export const framesSinVoz = (e: { duracion_s: number; cola_s?: number }, fps: number): number =>
  Math.round((e.duracion_s + (e.cola_s ?? COLA_S)) * fps);

/** Dónde se busca la voz de una escena (relativo a public/), en orden: la real (wav o mp3) y luego la provisional. */
export const candidatosVoz = (videoId: string, escenaId: string): [ruta: string, provisional: boolean][] => [
  [`videos/${videoId}/voz/${escenaId}.wav`, false],
  [`videos/${videoId}/voz/${escenaId}.mp3`, false],
  [`videos/${videoId}/voz-provisional/${escenaId}.mp3`, true],
];
