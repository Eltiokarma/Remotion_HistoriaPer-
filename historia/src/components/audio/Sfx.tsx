import { Audio, Sequence } from 'remotion';
import { sfx } from '../../estilo/recursos';

type Props = {
  /** Nombre del efecto en public/compartido/audio/sfx (sin .mp3). */
  nombre: string;
  /** Segundo de la escena en que suena (normalmente un beat). */
  en: number;
  fps: number;
  volumen?: number;
};

/** Un efecto de sonido que suena en un segundo exacto de la escena. */
export const Sfx: React.FC<Props> = ({ nombre, en, fps, volumen = 0.7 }) => {
  if (en < 0) return null;
  return (
    <Sequence from={Math.round(en * fps)} layout="none" name={`sfx ${nombre}`}>
      <Audio src={sfx(nombre)} volume={volumen} />
    </Sequence>
  );
};
