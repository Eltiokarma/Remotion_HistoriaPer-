import { fuente } from '../../estilo/fuentes';
import { alfa } from '../../estilo/color';

type Props = {
  texto: string;
  /** Segundos desde que empieza a escribirse. */
  t: number;
  color: string;
  /** Cuadrito del inicio (normalmente el rojo de la paleta). */
  acento: string;
  size?: number;
  /** Caracteres por segundo. */
  cps?: number;
  /** 0–1: se desvanece. */
  salida?: number;
  style?: React.CSSProperties;
};

/**
 * Ficha de archivo en monoespaciada: lugar, fecha, institución. Se escribe letra por letra con
 * un cursor de bloque y debajo se tiende un filete fino. Es un dato, no la narración.
 */
export const Ficha: React.FC<Props> = ({ texto, t, color, acento, size = 28, cps = 18, salida = 0, style }) => {
  if (t < 0 || salida >= 1) return null;
  const n = Math.min(texto.length, Math.floor(t * cps));
  const fin = texto.length / cps;
  const cursor = t < fin + 0.9 && Math.floor(t * 2.4) % 2 === 0;
  const filete = Math.min(1, t / Math.max(0.3, fin));
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: size * 0.4, opacity: 1 - salida, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.6, fontFamily: fuente.mono, fontSize: size, letterSpacing: '0.14em', color, whiteSpace: 'pre' }}>
        <div style={{ width: size * 0.42, height: size * 0.42, background: acento, opacity: Math.min(1, t * 4) }} />
        <span>
          {texto.slice(0, n)}
          <span style={{ opacity: cursor ? 0.85 : 0, background: color, color: 'transparent', marginLeft: 2 }}>▌</span>
        </span>
      </div>
      <div style={{ height: 1, width: `${filete * 100}%`, background: alfa(color, 0.45), marginLeft: size }} />
    </div>
  );
};
