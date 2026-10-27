import { fuente } from '../fonts';

type Props = {
  texto: string;
  /** Segundos transcurridos desde que empieza a escribir. */
  t: number;
  color: string;
  size: number;
  /** Caracteres por segundo: ritmo de una máquina real, no de un efecto. */
  cps?: number;
  style?: React.CSSProperties;
};

/** Texto que aparece letra por letra, con cursor que parpadea mientras escribe. */
export const MaquinaDeEscribir: React.FC<Props> = ({ texto, t, color, size, cps = 11, style }) => {
  if (t < 0) return null;
  const n = Math.min(texto.length, Math.floor(t * cps));
  const escribiendo = n < texto.length;
  // El cursor parpadea y desaparece un segundo después de terminar.
  const cursor = (escribiendo || t * cps - texto.length < cps) && Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{ fontFamily: fuente.maquina, fontSize: size, color, letterSpacing: '0.12em', whiteSpace: 'pre', ...style }}>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0 }}>▌</span>
    </div>
  );
};
