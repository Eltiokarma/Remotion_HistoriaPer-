import { clamp } from '../../direction/anim';

/** Color de la tiza blanca. */
export const TIZA = '#ecebe2';

/**
 * El filtro de la tiza: bordes que tiemblan y un grano que deja huecos, como la tiza sobre la
 * pizarra. Se pone una vez dentro del <svg> y se usa con `filter="url(#id)"`.
 */
export const FiltroTiza: React.FC<{ id: string; semilla?: number }> = ({ id, semilla = 7 }) => (
  <filter id={id} x="-5%" y="-30%" width="110%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} seed={semilla} result="ruido" />
    <feDisplacementMap in="SourceGraphic" in2="ruido" scale={2.6} xChannelSelector="R" yChannelSelector="G" result="borde" />
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={semilla + 3} result="grano" />
    <feColorMatrix in="grano" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -0.55" result="mascara" />
    <feComposite in="borde" in2="mascara" operator="in" />
  </filter>
);

type Props = {
  id: string;
  texto: string;
  x: number;
  y: number;
  /** 0–1: cuánto está escrito (de izquierda a derecha, como se escribe). */
  k: number;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle';
  /** Ancho aproximado de una letra, en «size» (para saber hasta dónde se escribió). */
  ancho?: number;
  /** 0–1: el brillo del foco (el profe señala esto). */
  brillo?: number;
  opacidad?: number;
  fontFamily: string;
  italic?: boolean;
};

/** Una línea escrita con tiza, que se escribe de izquierda a derecha. */
export const TextoTiza: React.FC<Props> = ({ id, texto, x, y, k, size = 44, color = TIZA, anchor = 'start', ancho = 0.5, brillo = 0, opacidad = 1, fontFamily, italic = false }) => {
  if (k <= 0) return null;
  const largo = texto.length * size * ancho;
  const x0 = anchor === 'middle' ? x - largo / 2 : x;
  return (
    <g opacity={opacidad}>
      <defs>
        <clipPath id={`${id}-escrito`}><rect x={x0 - size} y={y - size * 1.4} width={(largo + size * 2) * clamp(k)} height={size * 2} /></clipPath>
        <FiltroTiza id={`${id}-tiza`} />
      </defs>
      <g clipPath={`url(#${id}-escrito)`}>
        {brillo > 0 ? (
          <text x={x} y={y} textAnchor={anchor} fill={color} fontFamily={fontFamily} fontStyle={italic ? 'italic' : 'normal'} fontSize={size}
            opacity={0.5 * clamp(brillo)} style={{ filter: `blur(${6 + 6 * brillo}px)` }}>{texto}</text>
        ) : null}
        <text x={x} y={y} textAnchor={anchor} fill={color} fontFamily={fontFamily} fontStyle={italic ? 'italic' : 'normal'} fontSize={size}
          filter={`url(#${id}-tiza)`}>{texto}</text>
      </g>
    </g>
  );
};
