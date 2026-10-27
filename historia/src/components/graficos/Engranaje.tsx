import { useMemo } from 'react';
import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';

type Props = {
  paleta: Paleta;
  id: string;
  x: number;
  y: number;
  radio: number;
  dientes: number;
  /** Grados. */
  angulo: number;
  rayos?: number;
};

/** Contorno de una rueda dentada: dientes trapezoidales de profundidad fija. */
const contorno = (r: number, n: number, prof: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, paso = (2 * Math.PI) / n;
    const q = [[0, r - prof], [0.12, r - prof], [0.24, r], [0.5, r], [0.62, r - prof], [1, r - prof]] as const;
    for (const [u, rr] of q) {
      const a = a0 + u * paso;
      pts.push(`${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`);
    }
  }
  return 'M' + pts.join(' L') + ' Z';
};

/** Rueda dentada de bronce, grabada: dientes, llanta, rayos calados, cubo y rayado de sombra. */
export const Engranaje: React.FC<Props> = ({ paleta, id, x, y, radio: R, dientes, angulo, rayos = 6 }) => {
  const prof = Math.max(14, R * 0.09);
  const d = useMemo(() => contorno(R, dientes, prof), [R, dientes, prof]);
  const bronce = mezclar(paleta.ocre, paleta.fondo, 0.12);
  const huecos = Array.from({ length: rayos }, (_, i) => {
    const a = (i / rayos) * 2 * Math.PI, b = ((i + 1) / rayos) * 2 * Math.PI, m = 0.16;
    const r1 = R * 0.3, r2 = R - prof - R * 0.12;
    const p = (rr: number, aa: number) => `${(Math.cos(aa) * rr).toFixed(1)} ${(Math.sin(aa) * rr).toFixed(1)}`;
    return `M${p(r1, a + m)} L${p(r2, a + m * 0.55)} A ${r2} ${r2} 0 0 1 ${p(r2, b - m * 0.55)} L${p(r1, b - m)} A ${r1} ${r1} 0 0 0 ${p(r1, a + m)} Z`;
  }).join(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
      <defs>
        <radialGradient id={`${id}-metal`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={mezclar(bronce, '#ffffff', 0.28)} />
          <stop offset="0.6" stopColor={bronce} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.5)} />
        </radialGradient>
        <pattern id={`${id}-rayado`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={5} stroke={mezclar(bronce, '#000000', 0.6)} strokeWidth={1} />
        </pattern>
        <mask id={`${id}-calado`}>
          <rect x={-R - 10} y={-R - 10} width={2 * R + 20} height={2 * R + 20} fill="#fff" />
          <path d={huecos} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${id}-calado)`}>
        <path d={d} fill={`url(#${id}-metal)`} stroke={mezclar(bronce, '#000000', 0.55)} strokeWidth={2} />
        {/* sombra rayada abajo a la derecha; se contrarrota para que la luz no gire con la rueda */}
        <g transform={`rotate(${-angulo})`}>
          <path d={`M${-R} 0 A ${R} ${R} 0 0 0 ${R} 0 Z`} fill={`url(#${id}-rayado)`} opacity={0.45} transform="rotate(-30)" />
        </g>
        <circle r={R - prof - 4} fill="none" stroke={mezclar(bronce, '#000000', 0.45)} strokeWidth={2} />
        <circle r={R - prof - R * 0.12} fill="none" stroke={mezclar(bronce, '#000000', 0.45)} strokeWidth={1.5} />
      </g>
      <path d={huecos} fill="none" stroke={mezclar(bronce, '#000000', 0.55)} strokeWidth={1.5} />
      {/* cubo con su chaveta */}
      <circle r={R * 0.2} fill={`url(#${id}-metal)`} stroke={mezclar(bronce, '#000000', 0.55)} strokeWidth={2} />
      <circle r={R * 0.08} fill={mezclar(paleta.fondo, '#000000', 0.5)} />
      <rect x={-R * 0.025} y={-R * 0.12} width={R * 0.05} height={R * 0.05} fill={mezclar(paleta.fondo, '#000000', 0.5)} />
    </g>
  );
};
