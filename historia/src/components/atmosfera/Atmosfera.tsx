import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { textura } from '../../estilo/recursos';

type Props = {
  /** Opacidad del grano de película (0 = sin grano). */
  grano?: number;
  /** Oscurecimiento de los bordes (0 = sin viñeta). */
  vineta?: number;
};

/**
 * Capa de película sobre todo el video: grano que cambia 12 veces por segundo (como el
 * celuloide, no en cada cuadro) y viñeta. Unifica el aspecto de todas las escenas.
 */
export const Atmosfera: React.FC<Props> = ({ grano = 0.1, vineta = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cuadro = Math.floor((frame * 12) / fps);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {vineta > 0 ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vineta}) 100%)` }} />
      ) : null}
      {grano > 0 ? (
        <AbsoluteFill style={{
          backgroundImage: `url(${textura.grano(cuadro)})`,
          backgroundSize: '256px 256px',
          // desplazar el mosaico cada vez evita que se note la repetición
          backgroundPosition: `${(cuadro * 97) % 256}px ${(cuadro * 61) % 256}px`,
          mixBlendMode: 'overlay',
          opacity: grano * 2.2,
        }} />
      ) : null}
    </AbsoluteFill>
  );
};
