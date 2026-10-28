import { Audio, interpolate, Sequence } from 'remotion';
import { sfx } from '../../estilo/recursos';

type Props = {
  /** Nombre del efecto en public/compartido/audio/sfx (sin .mp3). */
  nombre: string;
  /** Segundo de la escena en que suena (normalmente un beat). */
  en: number;
  fps: number;
  volumen?: number;
  /** Cuántos segundos suena como máximo (se corta con un fundido corto). Sirve para sonidos en bucle. */
  dura?: number;
  /** Repite el archivo mientras dure (para un motor, un engranaje, la estática). */
  bucle?: boolean;
};

const FADE = 6; // frames: nada se corta en seco

/** Un efecto de sonido que suena en un segundo exacto de la escena. */
export const Sfx: React.FC<Props> = ({ nombre, en, fps, volumen = 0.7, dura, bucle = false }) => {
  if (en < 0 || !Number.isFinite(en)) return null; // antes de la escena o en un paso que no ocurre
  const frames = dura === undefined ? undefined : Math.max(FADE * 2, Math.round(dura * fps));
  return (
    <Sequence from={Math.round(en * fps)} durationInFrames={frames} layout="none" name={`sfx ${nombre}`}>
      <Audio src={sfx(nombre)} loop={bucle}
        volume={frames === undefined ? volumen : (f) => volumen * interpolate(f, [0, FADE, frames - FADE, frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    </Sequence>
  );
};
