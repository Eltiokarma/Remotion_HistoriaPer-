import type { Paleta } from '../../esquema';
import { fuente } from '../../estilo/fuentes';
import { Ornamento } from './Ornamento';

type Props = {
  paleta: Paleta;
  etiqueta: string;
  /** Número grande (año, capítulo…). */
  destacado: string;
  titulo: string;
  /** 0–1: aparición; cada línea entra un poco después que la anterior. */
  k: number;
};

/** Tarjeta de cierre ("Próximo…"): versalitas, filete, un número grande y el título. */
export const Tarjeta: React.FC<Props> = ({ paleta, etiqueta, destacado, titulo, k }) => {
  const paso = (i: number) => Math.max(0, Math.min(1, (k - i * 0.15) / 0.55));
  const linea = (i: number): React.CSSProperties => ({ opacity: paso(i), transform: `translateY(${(1 - paso(i)) * 16}px)` });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ ...linea(0), fontFamily: fuente.imprenta, fontSize: 34, letterSpacing: '0.5em', marginRight: '-0.5em', color: paleta.ocre }}>{etiqueta.toUpperCase()}</div>
      <div style={linea(0)}><Ornamento color={paleta.ocre} ancho={380} k={paso(0)} opacidad={0.8} /></div>
      <div style={{ ...linea(1), fontFamily: fuente.titulo, fontWeight: 700, fontSize: 170, lineHeight: 1, color: paleta.papel }}>{destacado}</div>
      <div style={{ ...linea(2), fontFamily: fuente.imprentaItalica, fontSize: 58, color: paleta.papel, opacity: 0.9 * paso(2) }}>{titulo}</div>
    </div>
  );
};
