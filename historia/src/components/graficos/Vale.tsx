import { useMemo } from 'react';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { PatronPapel } from '../atmosfera/Papel';
import { bordePapel, trazoManuscrito } from './svg';

type Props = {
  paleta: Paleta;
  id: string;
  /** Palabra grande del encabezado. */
  titulo?: string;
  /** Envejecimiento del papel (0 = nuevo, 1 = muy viejo): los vales de la colonia, amarillos. */
  edad?: number;
  /** Contenido de la casilla del monto (normalmente un <Odometro>). */
  monto?: React.ReactNode;
  width?: number;
  semilla?: number;
};

const W = 900, H = 480;

/** Roseta de guilloché: la curva de los billetes y bonos, difícil de falsificar. */
const roseta = (cx: number, cy: number, r: number, k: number, a: number, fase = 0): string => {
  let d = '';
  for (let i = 0; i <= 360; i += 2) {
    const th = (i * Math.PI) / 180;
    const rr = r + a * Math.sin(k * th + fase);
    d += `${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(th)).toFixed(1)} ${(cy + rr * Math.sin(th)).toFixed(1)} `;
  }
  return d + 'Z';
};

/** Cenefa ondulada a lo largo del borde. */
const cenefa = (m: number, amp: number, n: number, fase: number): string => {
  const pts: string[] = [];
  const per = 2 * (W - 2 * m) + 2 * (H - 2 * m);
  for (let s = 0; s <= per; s += 4) {
    let x: number, y: number, nx: number, ny: number;
    if (s < W - 2 * m) { x = m + s; y = m; nx = 0; ny = -1; } else if (s < W - 2 * m + H - 2 * m) { x = W - m; y = m + s - (W - 2 * m); nx = 1; ny = 0; } else if (s < 2 * (W - 2 * m) + H - 2 * m) { x = W - m - (s - (W - 2 * m) - (H - 2 * m)); y = H - m; nx = 0; ny = 1; } else { x = m; y = H - m - (s - 2 * (W - 2 * m) - (H - 2 * m)); nx = -1; ny = 0; }
    const o = amp * Math.sin((s / per) * n * 2 * Math.PI + fase);
    pts.push(`${(x + nx * o).toFixed(1)} ${(y + ny * o).toFixed(1)}`);
  }
  return 'M' + pts.join(' L') + ' Z';
};

/**
 * Vale de deuda del siglo XIX, genérico: papel de seguridad con guilloché, roseta, casilla del
 * monto y firmas ilegibles. No reproduce ningún documento real.
 */
export const Vale: React.FC<Props> = ({ paleta, id, titulo = 'VALE', edad = 0.3, monto, width = 900, semilla = 1 }) => {
  const papel = mezclar(paleta.papel, mezclar(paleta.ocre, '#7a5a20', 0.4), 0.15 + 0.35 * edad);
  const tinta = mezclar(paleta.verde, paleta.fondo, 0.35);
  const g = useMemo(() => ({
    borde: bordePapel(semilla, 0, 0, W, H, 1.6),
    firma1: trazoManuscrito(semilla + 5, 560, 420, 220, 16, 0.5),
    firma2: trazoManuscrito(semilla + 9, 120, 420, 200, 16, 0.5),
    lineas: [0, 1, 2].map((k) => trazoManuscrito(semilla + 20 + k, 300, 236 + k * 40, 330, 10)),
  }), [semilla]);
  const k = width / W;
  return (
    <div style={{ position: 'relative', width, height: H * k }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={width} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs><PatronPapel id={`${id}-papel`} escala={500} /></defs>
        <path d={g.borde} fill={papel} />
        <path d={g.borde} fill={`url(#${id}-papel)`} style={{ mixBlendMode: 'multiply' }} />
        {/* guilloché: dos cenefas cruzadas y un marco */}
        <g fill="none" stroke={tinta} strokeWidth={0.7} opacity={0.55}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={cenefa(26, 7, 90, i * 0.8)} />)}
          <rect x={44} y={44} width={W - 88} height={H - 88} strokeWidth={1.4} />
          <rect x={50} y={50} width={W - 100} height={H - 100} strokeWidth={0.6} />
        </g>
        {/* roseta con el sello de la tesorería (sin texto) */}
        <g fill="none" stroke={tinta} strokeWidth={0.7} opacity={0.7}>
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={roseta(170, 210, 58 + i * 5, 14, 9, i * 0.5)} />)}
          <circle cx={170} cy={210} r={40} strokeWidth={1.4} />
        </g>
        <text x={W / 2 + 60} y={150} textAnchor="middle" fill={tinta} fontFamily={fuente.imprenta} fontSize={64} letterSpacing={22}>{titulo}</text>
        <line x1={W / 2 - 120} x2={W / 2 + 240} y1={172} y2={172} stroke={tinta} strokeWidth={1} opacity={0.6} />
        {/* texto a mano (ilegible) y firmas */}
        <g fill="none" stroke={mezclar(tinta, '#000000', 0.3)} strokeWidth={1.3} opacity={0.75}>
          {g.lineas.map((d, i) => <path key={i} d={d} />)}
          <path d={g.firma1} strokeWidth={1.6} />
          <path d={g.firma2} strokeWidth={1.6} />
        </g>
        <line x1={560} x2={800} y1={432} y2={432} stroke={tinta} strokeWidth={0.8} opacity={0.6} />
        <line x1={110} x2={330} y1={432} y2={432} stroke={tinta} strokeWidth={0.8} opacity={0.6} />
        {/* casilla del monto */}
        <rect x={650} y={210} width={190} height={110} fill={alfa(papel, 0.6)} stroke={tinta} strokeWidth={1.6} />
        <rect x={656} y={216} width={178} height={98} fill="none" stroke={tinta} strokeWidth={0.6} />
      </svg>
      <div style={{ position: 'absolute', left: 650 * k, top: 210 * k, width: 190 * k, height: 110 * k, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {monto}
      </div>
    </div>
  );
};
