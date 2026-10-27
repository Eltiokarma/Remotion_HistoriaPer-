import { azar, semillaDe } from '../../direction/azar';
import { fuente } from '../../estilo/fuentes';

type Props = {
  texto: string;
  /** Segundos transcurridos desde que empieza a escribir. */
  t: number;
  color: string;
  size: number;
  /** Caracteres por segundo: ritmo de una máquina real. */
  cps?: number;
  style?: React.CSSProperties;
};

/**
 * Texto que aparece letra por letra como en una máquina de escribir de verdad: cada tipo
 * golpea un poco desalineado y con más o menos tinta, y entra con un pequeño impacto.
 */
export const MaquinaDeEscribir: React.FC<Props> = ({ texto, t, color, size, cps = 11, style }) => {
  if (t < 0) return null;
  const r = azar(semillaDe(texto));
  const tipos = texto.split('').map(() => ({ dy: r.rango(-1.4, 1.4), rot: r.rango(-1.6, 1.6), tinta: r.rango(0.78, 1) }));
  const escritas = t * cps;
  const n = Math.min(texto.length, Math.floor(escritas));
  const cursor = (n < texto.length || escritas - texto.length < cps) && Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{ fontFamily: fuente.maquina, fontSize: size, color, letterSpacing: '0.12em', whiteSpace: 'pre', display: 'flex', ...style }}>
      {texto.split('').map((ch, i) => {
        if (i >= n) return null;
        const golpe = Math.min(1, (escritas - i) / 1.5); // ~0.13 s de impacto
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: tipos[i].tinta * (0.55 + 0.45 * golpe),
            transform: `translateY(${tipos[i].dy}px) rotate(${tipos[i].rot}deg) scale(${1.12 - 0.12 * golpe})`,
          }}>{ch}</span>
        );
      })}
      <span style={{ opacity: cursor ? 0.9 : 0 }}>▌</span>
    </div>
  );
};
