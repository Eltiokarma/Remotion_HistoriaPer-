import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Rótulo del frontón. */
  rotulo: string;
  /** Etiqueta de las siluetas que se encienden en las ventanas. */
  etiqueta?: string;
  /** 0–1: se dibuja la fachada (de abajo hacia arriba). */
  dibujo?: number;
  /** 0–1: se encienden las ventanas con siluetas, una tras otra. */
  siluetas?: number;
  /** Ancho del dibujo en px (alto proporcional). */
  width?: number;
};

const W = 760, H = 560;
const COLUMNAS = 6;

/** Una silueta de funcionario: busto con sombrero de copa, en una ventana iluminada. */
const Silueta: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`} fill={color}>
    <rect x={-9} y={-44} width={18} height={14} rx={1} />
    <rect x={-14} y={-31} width={28} height={3} />
    <circle cx={0} cy={-20} r={9} />
    <path d="M-20 12 C -20 -4, -12 -10, 0 -10 C 12 -10, 20 -4, 20 12 Z" />
  </g>
);

/**
 * Fachada neoclásica en grabado (un edificio público genérico, no uno real): escalinata,
 * columnas con estrías, frontón con rótulo y ventanas que se encienden con siluetas.
 */
export const EdificioEstado: React.FC<Props> = ({ paleta, id, rotulo, etiqueta, dibujo = 1, siluetas = 0, width = 760 }) => {
  const tinta = mezclar(paleta.fondo, paleta.rojo, 0.06);
  const papel = paleta.papel;
  const orden = useMemo(() => {
    const r = azar(1850);
    return Array.from({ length: COLUMNAS }, (_, i) => i).sort(() => r.n() - 0.5);
  }, []);
  const ancho = (W - 160) / COLUMNAS;
  const yBase = H - 70, yCornisa = 210, yFronton = 120;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} style={{ overflow: 'visible' }}>
      <defs>
        <pattern id={`${id}-sombra`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={tinta} strokeWidth={0.9} />
        </pattern>
        <clipPath id={`${id}-dibujo`}><rect x={-20} y={H + 20 - (H + 40) * clamp(dibujo)} width={W + 40} height={H + 40} /></clipPath>
        <radialGradient id={`${id}-luz`}>
          <stop offset="0" stopColor={mezclar(paleta.ocre, '#ffffff', 0.35)} />
          <stop offset="1" stopColor={paleta.ocre} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}-dibujo)`}>
        {/* escalinata */}
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={40 - k * 14} y={yBase + k * 16} width={W - 80 + k * 28} height={16} fill={papel} stroke={tinta} strokeWidth={1.4} />
        ))}
        {/* muro del fondo, en sombra */}
        <rect x={80} y={yCornisa} width={W - 160} height={yBase - yCornisa} fill={`url(#${id}-sombra)`} stroke={tinta} strokeWidth={1.4} />
        {/* ventanas entre columnas (oscuras; se encienden con siluetas) */}
        {Array.from({ length: COLUMNAS }, (_, i) => {
          const cx = 80 + ancho * (i + 0.5);
          const on = clamp(siluetas * COLUMNAS - orden.indexOf(i));
          return (
            <g key={i}>
              <path d={`M${cx - 24} ${yBase - 40} L${cx - 24} ${yCornisa + 90} Q ${cx} ${yCornisa + 62}, ${cx + 24} ${yCornisa + 90} L${cx + 24} ${yBase - 40} Z`}
                fill={on > 0 ? `url(#${id}-luz)` : mezclar(tinta, paleta.papel, 0.35)} opacity={on > 0 ? 0.35 + 0.65 * on : 0.7} />
              {on > 0 ? <g opacity={on}><Silueta x={cx} y={yBase - 52} color={tinta} /></g> : null}
              {on > 0.5 && etiqueta ? (
                <text x={cx} y={yBase - 6} textAnchor="middle" fill={paleta.rojo} fontFamily={fuente.mono} fontSize={13} letterSpacing={1} opacity={(on - 0.5) * 2}>{etiqueta}</text>
              ) : null}
            </g>
          );
        })}
        {/* columnas con estrías, basa y capitel */}
        {Array.from({ length: COLUMNAS + 1 }, (_, i) => {
          const x = 80 + ancho * i;
          return (
            <g key={i}>
              <rect x={x - 17} y={yCornisa + 26} width={34} height={yBase - yCornisa - 36} fill={papel} stroke={tinta} strokeWidth={1.4} />
              {[-9, -3, 3, 9].map((d) => <line key={d} x1={x + d} x2={x + d} y1={yCornisa + 32} y2={yBase - 14} stroke={tinta} strokeWidth={0.8} opacity={0.7} />)}
              <rect x={x - 12} y={yCornisa + 26} width={24} height={yBase - yCornisa - 36} fill={`url(#${id}-sombra)`} opacity={0.35} transform={`translate(10 0)`} />
              <rect x={x - 24} y={yCornisa + 12} width={48} height={14} fill={papel} stroke={tinta} strokeWidth={1.4} />
              <rect x={x - 22} y={yBase - 12} width={44} height={12} fill={papel} stroke={tinta} strokeWidth={1.4} />
            </g>
          );
        })}
        {/* cornisa y frontón */}
        <rect x={50} y={yCornisa - 14} width={W - 100} height={26} fill={papel} stroke={tinta} strokeWidth={1.6} />
        {Array.from({ length: 34 }, (_, i) => <rect key={i} x={58 + i * 19} y={yCornisa + 4} width={9} height={7} fill={tinta} opacity={0.75} />)}
        <path d={`M40 ${yCornisa - 14} L${W / 2} ${yFronton - 40} L${W - 40} ${yCornisa - 14} Z`} fill={papel} stroke={tinta} strokeWidth={1.8} />
        <path d={`M76 ${yCornisa - 22} L${W / 2} ${yFronton - 24} L${W - 76} ${yCornisa - 22} Z`} fill={`url(#${id}-sombra)`} opacity={0.35} stroke={tinta} strokeWidth={0.8} />
        <rect x={W / 2 - 150} y={yCornisa - 66} width={300} height={44} fill={papel} stroke={tinta} strokeWidth={1.4} />
        <text x={W / 2} y={yCornisa - 33} textAnchor="middle" fill={tinta} fontFamily={fuente.imprenta} fontSize={32} letterSpacing={10}>{rotulo}</text>
      </g>
      <line x1={0} x2={W} y1={H - 6} y2={H - 6} stroke={alfa(tinta, 0.5)} strokeWidth={1} />
    </svg>
  );
};
