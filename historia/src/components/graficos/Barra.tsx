import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Cuánto está llena (0–1). */
  llenado: number;
  /** Dónde va la marca del dato (0–1), p. ej. 0.5 para "la mitad". */
  marca?: number;
  etiqueta?: string;
  /** Aparición de la etiqueta (0–1). */
  etiquetaK?: number;
  ancho?: number;
};

/**
 * Barra de proporción como un instrumento de medida: marco doble, regla de décimas, relleno
 * de tinta rayada y una marca en el valor que importa.
 */
export const Barra: React.FC<Props> = ({ paleta, id, llenado, marca, etiqueta, etiquetaK = 1, ancho = 1040 }) => {
  const alto = 46;
  return (
    <div style={{ width: ancho, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={ancho} height={alto + 44} style={{ overflow: 'visible' }}>
        <defs>
          <pattern id={`${id}-rayado`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={7} stroke={mezclar(paleta.rojo, '#000000', 0.35)} strokeWidth={2} />
          </pattern>
        </defs>
        {/* regla de décimas */}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={(ancho * i) / 10} x2={(ancho * i) / 10} y1={i % 5 === 0 ? 4 : 12} y2={22} stroke={paleta.papel} strokeWidth={i % 5 === 0 ? 1.6 : 1} opacity={0.55} />
        ))}
        <g transform="translate(0 28)">
          <rect x={0} y={0} width={ancho * llenado} height={alto} fill={paleta.rojo} />
          <rect x={0} y={0} width={ancho * llenado} height={alto} fill={`url(#${id}-rayado)`} opacity={0.5} />
          {llenado > 0 ? <rect x={ancho * llenado - 3} y={0} width={3} height={alto} fill={mezclar(paleta.rojo, paleta.papel, 0.5)} /> : null}
          <rect x={0} y={0} width={ancho} height={alto} fill="none" stroke={paleta.papel} strokeWidth={2} />
          <rect x={-6} y={-6} width={ancho + 12} height={alto + 12} fill="none" stroke={paleta.papel} strokeWidth={0.8} opacity={0.6} />
          {marca !== undefined ? (
            <g transform={`translate(${ancho * marca} 0)`}>
              <line y1={-20} y2={alto + 20} stroke={paleta.papel} strokeWidth={1.6} />
              <polygon points={`-9,-30 9,-30 0,-18`} fill={paleta.ocre} />
            </g>
          ) : null}
        </g>
      </svg>
      {etiqueta ? (
        <div style={{ marginTop: 30, fontFamily: fuente.imprentaItalica, fontSize: 44, color: paleta.ocre, opacity: etiquetaK, transform: `translateY(${(1 - etiquetaK) * 10}px)` }}>
          {etiqueta}
        </div>
      ) : null}
    </div>
  );
};
