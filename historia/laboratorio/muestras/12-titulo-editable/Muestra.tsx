import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';

/**
 * Muestra 12 · El título, escrito para que Gerson lo ajuste en el Studio sin tocar código.
 *
 * Remotion Studio (desde 4.0.475) edita visualmente y escribe el cambio en este archivo: mover un
 * elemento en el lienzo, arrastrar sus claves en la línea de tiempo, cambiar una curva. Para que pueda,
 * todo va en línea (skill remotion-interactivity): cada línea del título es un `Interactive.Div` con
 * nombre, y sus claves son `interpolate(frame, …)` con números y curvas escritos ahí mismo.
 *
 * Las curvas son los pesos del canal escritos con sus números (src/direction/easings.ts):
 *   natural 0.33,0,0.2,1 · solemne 0.65,0,0.35,1 · ligero 0.2,0.6,0.3,1 · pesado 0.7,0,0.2,1
 * `npm run reglas` deja pasar un Easing.bezier en línea solo si es uno de los cinco pesos.
 *
 * El texto es el título del episodio 0·1 (videos/001-el-hombre/escenas.json). En el laboratorio va en
 * línea a propósito: el Studio solo edita texto escrito en el JSX.
 */
export const TituloEditable: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Papel color="#ede4d3" envejecido={0.55} />
      <Interactive.Div
        name="El hombre que"
        style={{
          position: 'absolute',
          left: 236,
          top: 352,
          fontFamily: '"HA Libro", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 78,
          color: '#1c1b19',
          opacity: interpolate(frame, [24, 40], [0, 1], { easing: Easing.bezier(0.2, 0.6, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: interpolate(frame, [24, 40], ['0px 18px', '0px 0px'], { easing: Easing.bezier(0.2, 0.6, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        El hombre que
      </Interactive.Div>
      <Interactive.Div
        name="le sacó la cuenta"
        style={{
          position: 'absolute',
          left: 230,
          top: 452,
          fontFamily: '"HA Titulo", Georgia, serif',
          fontWeight: 700,
          fontSize: 172,
          lineHeight: 1,
          color: '#1c1b19',
          opacity: interpolate(frame, [42, 70], [0, 1], { easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: interpolate(frame, [42, 70], ['0px 34px', '0px 0px'], { easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        le sacó la cuenta
      </Interactive.Div>
      <Interactive.Div
        name="al Perú."
        style={{
          position: 'absolute',
          left: 234,
          top: 662,
          fontFamily: '"HA Titulo", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 128,
          lineHeight: 1,
          color: '#1c1b19',
          opacity: interpolate(frame, [72, 88], [0, 1], { easing: Easing.bezier(0.33, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: interpolate(frame, [72, 88], ['0px 18px', '0px 0px'], { easing: Easing.bezier(0.33, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        al Perú.
      </Interactive.Div>
      <Interactive.Div
        name="Subrayado del corrector"
        style={{
          position: 'absolute',
          left: 812,
          top: 640,
          width: 700,
          height: 9,
          borderRadius: 5,
          backgroundColor: '#b3261e',
          transformOrigin: '0% 50%',
          scale: interpolate(frame, [99, 110], ['0 1', '1 1'], { easing: Easing.bezier(0.2, 0.6, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  );
};
