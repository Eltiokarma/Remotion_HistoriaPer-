import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Grados que se inclina la cruz (negativo: baja el platillo izquierdo). */
  angulo: number;
  izquierda: string;
  derecha: string;
  /** 0–1: caída de cada palabra sobre su platillo. */
  cae: [number, number];
};

const CX = 960, CY = 330, BRAZO = 430;

/** Balanza de dos platillos, de bronce, con una palabra en cada uno. */
export const Balanza: React.FC<Props> = ({ paleta, id, angulo, izquierda, derecha, cae }) => {
  const bronce = mezclar(paleta.ocre, paleta.fondo, 0.15);
  const a = (angulo * Math.PI) / 180;
  const extremo = (lado: -1 | 1) => ({ x: CX + lado * BRAZO * Math.cos(a), y: CY + lado * BRAZO * Math.sin(a) });
  const plato = (lado: -1 | 1, palabra: string, k: number) => {
    const e = extremo(lado);
    const py = e.y + 250;
    return (
      <g>
        <line x1={e.x} y1={e.y} x2={e.x - 120} y2={py} stroke={bronce} strokeWidth={1.6} />
        <line x1={e.x} y1={e.y} x2={e.x + 120} y2={py} stroke={bronce} strokeWidth={1.6} />
        <line x1={e.x} y1={e.y} x2={e.x} y2={py - 6} stroke={bronce} strokeWidth={1.2} opacity={0.7} />
        <path d={`M${e.x - 150} ${py} Q ${e.x} ${py + 60}, ${e.x + 150} ${py} Z`} fill={`url(#${id}-bronce)`} stroke={mezclar(bronce, '#000000', 0.4)} strokeWidth={1.5} />
        <ellipse cx={e.x} cy={py} rx={150} ry={10} fill={mezclar(bronce, '#ffffff', 0.25)} opacity={0.6} />
        {k > 0 ? (
          <text x={e.x} y={py - 14 - (1 - k) * 420} textAnchor="middle" fill={paleta.papel} fontFamily={fuente.titulo} fontWeight={700} fontSize={46} letterSpacing={4}
            opacity={Math.min(1, k * 3)}>{palabra}</text>
        ) : null}
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={`${id}-bronce`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(bronce, '#ffffff', 0.3)} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.45)} />
        </linearGradient>
        <linearGradient id={`${id}-columna`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mezclar(bronce, '#000000', 0.4)} />
          <stop offset="0.4" stopColor={mezclar(bronce, '#ffffff', 0.25)} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.5)} />
        </linearGradient>
      </defs>
      {/* base y columna */}
      <path d={`M${CX - 170} 950 L${CX + 170} 950 L${CX + 120} 905 L${CX - 120} 905 Z`} fill={`url(#${id}-columna)`} />
      <rect x={CX - 14} y={CY} width={28} height={580} fill={`url(#${id}-columna)`} />
      <circle cx={CX} cy={CY - 46} r={14} fill={`url(#${id}-columna)`} />
      {/* fiel: la aguja que dice si está equilibrada */}
      <line x1={CX} y1={CY} x2={CX + Math.sin(-a) * -110} y2={CY - Math.cos(a) * 110} stroke={paleta.rojo} strokeWidth={4} strokeLinecap="round" />
      <path d={`M${CX - 30} ${CY - 120} A 40 40 0 0 1 ${CX + 30} ${CY - 120}`} fill="none" stroke={alfa(paleta.papel, 0.5)} strokeWidth={1.5} />
      {/* la cruz */}
      <g transform={`rotate(${angulo} ${CX} ${CY})`}>
        <rect x={CX - BRAZO} y={CY - 8} width={BRAZO * 2} height={16} rx={8} fill={`url(#${id}-bronce)`} stroke={mezclar(bronce, '#000000', 0.4)} />
        {[-1, 1].map((l) => <circle key={l} cx={CX + l * BRAZO} cy={CY} r={11} fill={`url(#${id}-columna)`} />)}
      </g>
      <circle cx={CX} cy={CY} r={22} fill={`url(#${id}-columna)`} stroke={mezclar(bronce, '#000000', 0.4)} />
      {plato(-1, izquierda, cae[0])}
      {plato(1, derecha, cae[1])}
    </svg>
  );
};
