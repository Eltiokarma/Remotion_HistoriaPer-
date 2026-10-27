import type { Paleta } from '../types';

type Props = {
  paleta: Paleta;
  /** 0–1: cuánto se han dibujado las correcciones en rojo. */
  correcciones: number;
  /** 0–1: cuánto se ha cerrado la tapa de la carpeta. */
  cierre?: number;
  width: number;
};

// Renglones de texto simulados de la página de arriba: [y, ancho].
const RENGLONES: [number, number][] = [
  [92, 250], [118, 270], [144, 230], [170, 262], [196, 180],
  [240, 268], [266, 244], [292, 270], [318, 210],
  [362, 255], [388, 272], [414, 236], [440, 150],
];

// Correcciones a mano, en el orden en que se dibujan (pathLength=1 para animarlas parejo).
const TRAZOS = [
  'M66 118 L300 121',                                 // tacha un renglón
  'M188 166 C 214 150, 266 154, 270 170 C 274 186, 200 190, 186 176 C 180 168, 196 160, 210 160', // encierra una palabra
  'M318 140 l10 -10 M318 140 l-6 -8',                 // marca al margen
  'M120 262 L250 268',                                 // otra tachadura
  'M330 290 C 350 300, 350 330, 330 340',              // llave al margen
  'M92 444 l8 -12 l8 12',                              // signo de inserción
  'M60 470 C 120 462, 220 476, 318 466',               // subraya el final
];

/** Una pila de páginas del manuscrito, con correcciones en rojo que se dibujan a mano. */
export const PilaDePaginas: React.FC<Props> = ({ paleta, correcciones, cierre = 0, width }) => {
  const n = TRAZOS.length;
  return (
    <svg viewBox="0 0 400 540" width={width} style={{ overflow: 'visible' }}>
      {/* hojas de abajo, cada una un poco corrida: se lee "muchas páginas" */}
      {[5, 4, 3, 2, 1].map((k) => (
        <rect key={k} x={20 + k * 5} y={20 - k * 5} width={340} height={480} fill={paleta.papel}
          opacity={0.35 + (5 - k) * 0.1} stroke={paleta.fondo} strokeOpacity={0.25} />
      ))}
      <rect x={20} y={20} width={340} height={480} fill={paleta.papel} />
      {RENGLONES.map(([y, w], i) => (
        <rect key={i} x={60} y={y - 7} width={w} height={6} rx={2} fill={paleta.fondo} opacity={0.55} />
      ))}
      {TRAZOS.map((d, i) => {
        const k = Math.max(0, Math.min(1, correcciones * n - i));
        return (
          <path key={i} d={d} pathLength={1} fill="none" stroke={paleta.rojo} strokeWidth={4.5}
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - k}
            opacity={k > 0 ? 1 : 0} />
        );
      })}
      {/* tapa de la carpeta: gira desde la bisagra izquierda */}
      {cierre > 0 ? (
        <g transform={`translate(14 0) scale(${cierre} 1)`}>
          <rect x={0} y={12} width={356} height={496} fill={paleta.ocre} />
          <rect x={0} y={12} width={356} height={496} fill={paleta.fondo} opacity={0.35 * (1 - cierre)} />
          <rect x={40} y={60} width={276} height={2} fill={paleta.fondo} opacity={0.4} />
        </g>
      ) : null}
    </svg>
  );
};
