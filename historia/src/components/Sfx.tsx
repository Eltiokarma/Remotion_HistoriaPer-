import { Audio, Sequence, staticFile } from 'remotion';

type Props = { src: string; en: number; fps: number; volumen?: number };

/** Un efecto de sonido que suena en un segundo exacto de la escena (sincronizado con un beat). */
export const Sfx: React.FC<Props> = ({ src, en, fps, volumen = 0.7 }) => {
  if (en < 0) return null;
  return (
    <Sequence from={Math.round(en * fps)} layout="none" name={src.split('/').pop()}>
      <Audio src={staticFile(src)} volume={volumen} />
    </Sequence>
  );
};
