import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { beat, mix, tramo } from '../../direction/anim';
import { PilaDePaginas } from '../../components/PilaDePaginas';
import { fuente } from '../../fonts';
import { texto, type EscenaProps } from './comun';

export const S06Cierre: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const t = useCurrentFrame() / fps;
  const b = escena.beats;
  const cierre = tramo(t, beat(b, 'cerrar', 1), 1.5, 'pesado');
  const negro = tramo(t, beat(b, 'negro', 4.5), 0.9, 'solemne');
  const tarjeta = tramo(t, beat(b, 'tarjeta', 5.4), 1.2, 'solemne');
  return (
    <AbsoluteFill style={{ backgroundColor: paleta.fondo }}>
      {/* La misma pila del inicio, ya corregida entera, se cierra: el libro está terminado. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: mix(1, 0, negro) }}>
        <PilaDePaginas paleta={paleta} width={470} correcciones={1} cierre={cierre} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: tarjeta }}>
        <div style={{ fontFamily: fuente.mono, fontSize: 30, letterSpacing: '0.4em', color: paleta.ocre, marginBottom: 26 }}>
          {texto(escena, 'proximo').toUpperCase()}
        </div>
        <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 70, color: paleta.papel, transform: `translateY(${(1 - tarjeta) * 18}px)` }}>
          {texto(escena, 'titulo')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
