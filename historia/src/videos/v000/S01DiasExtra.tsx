import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { beat, tramo } from '../../direction/anim';
import { MaquinaDeEscribir } from '../../components/MaquinaDeEscribir';
import { PilaDePaginas } from '../../components/PilaDePaginas';
import { fuente } from '../../fonts';
import { texto, type EscenaProps } from './comun';

/** Momentos en que cae cada hoja: cada vez más espaciados, hasta la que se queda. */
const caidas = (inicio: number, ultima: number): number[] => {
  const out: number[] = [];
  let t = inicio, gap = 0.3;
  while (t < ultima - 0.2) { out.push(t); t += gap; gap *= 1.32; }
  return out;
};

const Hoja: React.FC<{ dia: number; color: string; tinta: string; rot?: number; y?: number; op?: number }> = ({ dia, color, tinta, rot = 0, y = 0, op = 1 }) => (
  <div style={{
    position: 'absolute', inset: 0, background: color, opacity: op,
    transform: `translateY(${y}px) rotate(${rot}deg)`, transformOrigin: '0% 0%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 0 rgba(0,0,0,0.25)',
  }}>
    <div style={{ fontFamily: fuente.mono, fontSize: 30, letterSpacing: '0.3em', color: tinta, opacity: 0.6 }}>DÍA</div>
    <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 190, lineHeight: 1, color: tinta }}>{dia}</div>
  </div>
);

export const S01DiasExtra: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const b = escena.beats;
  const ultima = beat(b, 'ultima_hoja', 11);
  const tiempos = caidas(1.2, ultima);
  const cayendo = tiempos.findIndex((tc) => t >= tc && t < tc + 0.9);
  const caidas_hechas = tiempos.filter((tc) => t >= tc + 0.9).length;
  const debajo = caidas_hechas + (cayendo >= 0 ? 1 : 0); // hoja que queda a la vista

  // La última hoja intenta caer, se levanta de una esquina y vuelve: se queda pegada.
  const tiron = t >= ultima ? spring({ frame: frame - ultima * fps, fps, config: { damping: 7, mass: 0.7, stiffness: 120 } }) : 0;
  const rotUltima = t >= ultima ? -9 * Math.sin(Math.min(1, (t - ultima) / 0.25) * Math.PI / 2) * (1 - tiron) : 0;

  const aparece = tramo(t, 0, 0.8, 'natural');
  return (
    <AbsoluteFill style={{ backgroundColor: paleta.fondo }}>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 130 }}>
        <MaquinaDeEscribir texto={texto(escena, 'fecha')} t={t - beat(b, 'fecha', 0.4)} color={paleta.papel} size={46} />
      </AbsoluteFill>

      {/* Calendario: la cuenta de los días extra */}
      <div style={{ position: 'absolute', left: 330, top: 360, width: 380, height: 420, opacity: aparece }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: -26, height: 26, background: paleta.rojo }} />
        <Hoja dia={debajo + 1} color={paleta.papel} tinta={paleta.fondo} rot={caidas_hechas === tiempos.length ? rotUltima : 0} />
        {cayendo >= 0 ? (() => {
          const k = tramo(t, tiempos[cayendo], 0.9, 'tenso');
          return <Hoja dia={cayendo + 1} color={paleta.papel} tinta={paleta.fondo} rot={-28 * k} y={760 * k} op={1 - Math.max(0, (k - 0.7) / 0.3)} />;
        })() : null}
      </div>

      {/* El manuscrito: se corrige mientras el tiempo se acaba */}
      <div style={{ position: 'absolute', left: 1120, top: 300, opacity: aparece }}>
        <PilaDePaginas paleta={paleta} width={470} correcciones={tramo(t, beat(b, 'correcciones', 5.5), 5, 'natural')} />
      </div>
    </AbsoluteFill>
  );
};
