import type { Paleta } from '../../esquema';
import { fuente } from '../../estilo/fuentes';
import { FiltroDesgaste } from './svg';

type Props = {
  paleta: Paleta;
  id: string;
  /** Texto grande del centro. */
  centro: string;
  /** Texto chico bajo el centro (normalmente un año). */
  fecha?: string;
  /** Texto que da la vuelta al anillo. */
  arco?: string;
  size?: number;
  color?: string;
};

/** Sello de goma redondo, con la tinta gastada como uno de verdad. */
export const Sello: React.FC<Props> = ({ paleta, id, centro, fecha, arco, size = 320, color }) => {
  const tinta = color ?? paleta.rojo;
  return (
    <svg viewBox="-160 -160 320 320" width={size} height={size} style={{ overflow: 'visible', mixBlendMode: 'multiply' }}>
      <defs>
        <FiltroDesgaste id={`${id}-gastado`} semilla={5} desgaste={0.38} />
        <path id={`${id}-arco`} d="M -116 0 A 116 116 0 1 1 116 0 A 116 116 0 1 1 -116 0" />
      </defs>
      <g filter={`url(#${id}-gastado)`} opacity={0.88}>
        <circle r={150} fill="none" stroke={tinta} strokeWidth={8} />
        <circle r={137} fill="none" stroke={tinta} strokeWidth={2.2} />
        <circle r={94} fill="none" stroke={tinta} strokeWidth={2.6} />
        {arco ? (
          <text fill={tinta} fontFamily={fuente.imprenta} fontSize={27} letterSpacing={5}>
            <textPath href={`#${id}-arco`} startOffset="0">{arco}</textPath>
          </text>
        ) : null}
        <text y={fecha ? 8 : 20} textAnchor="middle" fill={tinta} fontFamily={fuente.titulo} fontWeight={800} fontSize={60} letterSpacing={2}>{centro}</text>
        {fecha ? (
          <>
            <line x1={-56} x2={56} y1={24} y2={24} stroke={tinta} strokeWidth={2} />
            <text y={64} textAnchor="middle" fill={tinta} fontFamily={fuente.mono} fontWeight={600} fontSize={38} letterSpacing={4}>{fecha}</text>
          </>
        ) : null}
      </g>
    </svg>
  );
};
