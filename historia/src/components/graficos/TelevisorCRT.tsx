import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Cuadro actual (la estática cambia en cada cuadro). */
  frame: number;
  fps: number;
  /** Texto del indicador de grabación. */
  rec?: string;
  /** Fecha en la esquina, como en una cinta de video. */
  fecha?: string;
  /** 0–1: el aparato se enciende (punto de luz que se abre). */
  encendido?: number;
  width?: number;
};

const W = 1100, H = 860;
const P = { x: 120, y: 90, w: 700, h: 540 }; // pantalla

/**
 * Televisor de tubo de fines de los noventa: carcasa de plástico, pantalla curva con estática
 * (nunca imágenes reales), líneas de barrido, una franja que sube, REC parpadeando y la fecha.
 */
export const TelevisorCRT: React.FC<Props> = ({ paleta, id, frame, fps, rec = 'REC', fecha, encendido = 1, width = 1100 }) => {
  const t = frame / fps;
  const plastico = mezclar(paleta.fondo, '#3a3833', 0.6);
  const franja = ((t * 0.35) % 1.3) - 0.15; // la franja que sube por la pantalla
  const on = Math.max(0, Math.min(1, encendido));
  const curva = `M${P.x + 30} ${P.y} Q ${P.x + P.w / 2} ${P.y - 16}, ${P.x + P.w - 30} ${P.y} Q ${P.x + P.w + 14} ${P.y + P.h / 2}, ${P.x + P.w - 30} ${P.y + P.h} Q ${P.x + P.w / 2} ${P.y + P.h + 16}, ${P.x + 30} ${P.y + P.h} Q ${P.x - 14} ${P.y + P.h / 2}, ${P.x + 30} ${P.y} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} style={{ overflow: 'visible' }}>
      <defs>
        <filter id={`${id}-estatica`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95 0.6" numOctaves={1} seed={frame % 97} result="r" />
          <feColorMatrix in="r" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g"><feFuncR type="linear" slope={2.6} intercept={-0.75} /><feFuncG type="linear" slope={2.6} intercept={-0.75} /><feFuncB type="linear" slope={2.6} intercept={-0.75} /></feComponentTransfer>
        </filter>
        <pattern id={`${id}-barrido`} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={4} height={2} fill="#000" opacity={0.35} />
        </pattern>
        <radialGradient id={`${id}-vineta`} cx="50%" cy="50%" r="65%">
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.75} />
        </radialGradient>
        <linearGradient id={`${id}-franja`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.18} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-plastico`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(plastico, '#ffffff', 0.12)} />
          <stop offset="1" stopColor={mezclar(plastico, '#000000', 0.35)} />
        </linearGradient>
        <linearGradient id={`${id}-reflejo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.16} />
          <stop offset="0.4" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-pantalla`}><path d={curva} /></clipPath>
        <filter id={`${id}-sombra`}><feGaussianBlur stdDeviation={18} /></filter>
      </defs>
      {/* sombra y carcasa */}
      <rect x={40} y={60} width={W - 60} height={H - 40} rx={50} fill="#000" opacity={0.6} filter={`url(#${id}-sombra)`} />
      <rect x={20} y={20} width={W - 40} height={H - 80} rx={46} fill={`url(#${id}-plastico)`} />
      <rect x={P.x - 40} y={P.y - 40} width={P.w + 80} height={P.h + 80} rx={36} fill={mezclar(plastico, '#000000', 0.45)} />
      {/* pantalla */}
      <path d={curva} fill="#0b0b0b" />
      <g clipPath={`url(#${id}-pantalla)`} opacity={on}>
        <rect x={P.x - 20} y={P.y - 20} width={P.w + 40} height={P.h + 40} filter={`url(#${id}-estatica)`} opacity={0.82} />
        <rect x={P.x - 20} y={P.y - 20 + franja * P.h} width={P.w + 40} height={110} fill={`url(#${id}-franja)`} />
        <rect x={P.x - 20} y={P.y - 20} width={P.w + 40} height={P.h + 40} fill={`url(#${id}-barrido)`} />
        <rect x={P.x - 20} y={P.y - 20} width={P.w + 40} height={P.h + 40} fill={`url(#${id}-vineta)`} />
        {Math.floor(t * 1.6) % 2 === 0 ? <circle cx={P.x + 66} cy={P.y + 62} r={14} fill={paleta.rojo} /> : null}
        <text x={P.x + 92} y={P.y + 74} fill="#f2f2f2" fontFamily={fuente.mono} fontWeight={600} fontSize={36} letterSpacing={3}>{rec}</text>
        {fecha ? <text x={P.x + P.w - 50} y={P.y + P.h - 44} textAnchor="end" fill="#f2f2f2" fontFamily={fuente.mono} fontWeight={600} fontSize={40} letterSpacing={4}>{fecha}</text> : null}
      </g>
      {/* el punto de luz del encendido */}
      {on < 1 ? <ellipse cx={P.x + P.w / 2} cy={P.y + P.h / 2} rx={P.w * 0.5 * on + 4} ry={P.h * 0.5 * on ** 3 + 2} fill="#fff" opacity={1 - on * 0.6} /> : null}
      <path d={curva} fill={`url(#${id}-reflejo)`} />
      {/* panel de controles */}
      <rect x={P.x + P.w + 70} y={P.y + 10} width={140} height={P.h - 20} rx={14} fill={mezclar(plastico, '#000000', 0.25)} />
      {[0, 1].map((i) => (
        <g key={i}>
          <circle cx={P.x + P.w + 140} cy={P.y + 90 + i * 120} r={36} fill={mezclar(plastico, '#000000', 0.5)} />
          <circle cx={P.x + P.w + 140} cy={P.y + 90 + i * 120} r={28} fill={mezclar(plastico, '#ffffff', 0.08)} />
          <line x1={P.x + P.w + 140} y1={P.y + 90 + i * 120} x2={P.x + P.w + 140 + 20 * Math.cos(i * 2 + 1)} y2={P.y + 90 + i * 120 - 20 * Math.sin(i * 2 + 1)} stroke="#111" strokeWidth={4} />
        </g>
      ))}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={P.x + P.w + 95} y={P.y + 330 + i * 22} width={90} height={8} rx={4} fill="#000" opacity={0.45} />)}
      <circle cx={P.x + P.w + 110} cy={P.y + P.h - 40} r={6} fill={paleta.rojo} opacity={0.9} />
      <text x={P.x + P.w + 128} y={P.y + P.h - 33} fill={alfa('#ffffff', 0.4)} fontFamily={fuente.mono} fontSize={16}>POWER</text>
      {/* patas */}
      <rect x={140} y={H - 66} width={90} height={30} rx={6} fill={mezclar(plastico, '#000000', 0.4)} />
      <rect x={W - 230} y={H - 66} width={90} height={30} rx={6} fill={mezclar(plastico, '#000000', 0.4)} />
    </svg>
  );
};
