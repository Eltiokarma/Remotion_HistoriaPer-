import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';

type Props = {
  /** Dónde está la punta, en coordenadas del <svg> que la contiene. */
  x: number;
  y: number;
  paleta: Paleta;
  id: string;
  /** 0 = apoyada en el papel, 1 = levantada (la sombra se aleja). */
  alzada?: number;
  escala?: number;
  angulo?: number;
  opacidad?: number;
};

/** Pluma estilográfica que escribe: la punta va donde está el trazo que se dibuja. */
export const Pluma: React.FC<Props> = ({ x, y, paleta, id, alzada = 0, escala = 1, angulo = -36, opacidad = 1 }) => {
  if (opacidad <= 0) return null;
  const lift = alzada * 16;
  const cuerpo = mezclar(paleta.fondo, paleta.papel, 0.08);
  const brillo = mezclar(paleta.fondo, paleta.papel, 0.45);
  const silueta = (fill: string) => (
    <>
      <path d="M0 0 L36 -8 Q42 0 36 8 Z" fill={fill} />
      <rect x={35} y={-9.5} width={38} height={19} rx={6} fill={fill} />
      <rect x={72} y={-12} width={190} height={24} rx={11} fill={fill} />
    </>
  );
  return (
    <g opacity={opacidad}>
      <defs>
        <linearGradient id={`${id}-pl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mezclar(paleta.ocre, paleta.papel, 0.5)} />
          <stop offset="1" stopColor={paleta.ocre} />
        </linearGradient>
        <linearGradient id={`${id}-cu`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={brillo} />
          <stop offset="0.35" stopColor={cuerpo} />
          <stop offset="1" stopColor={paleta.fondo} />
        </linearGradient>
        <filter id={`${id}-so`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation={3 + alzada * 5} />
        </filter>
      </defs>
      {/* sombra sobre el papel: se separa cuando la pluma se levanta */}
      <g transform={`translate(${x + 8 + lift * 1.6} ${y + 10 + lift * 1.2}) rotate(${angulo}) scale(${escala})`}
        filter={`url(#${id}-so)`} opacity={0.32 - alzada * 0.12}>
        {silueta('#000')}
      </g>
      <g transform={`translate(${x + lift * 0.5} ${y - lift}) rotate(${angulo}) scale(${escala})`}>
        {/* plumilla de metal con su ranura */}
        <path d="M0 0 L36 -8 Q42 0 36 8 Z" fill={`url(#${id}-pl)`} />
        <line x1={2} y1={0} x2={25} y2={0} stroke={paleta.fondo} strokeWidth={1} />
        <circle cx={25} cy={0} r={1.8} fill={paleta.fondo} />
        {/* sección y cuerpo */}
        <rect x={35} y={-9.5} width={38} height={19} rx={6} fill={`url(#${id}-cu)`} />
        <rect x={72} y={-12} width={6} height={24} fill={paleta.ocre} />
        <rect x={78} y={-12} width={184} height={24} rx={11} fill={`url(#${id}-cu)`} />
        <rect x={232} y={-12} width={5} height={24} fill={paleta.ocre} opacity={0.9} />
        <rect x={84} y={-9} width={140} height={3} rx={1.5} fill={paleta.papel} opacity={0.18} />
      </g>
    </g>
  );
};
