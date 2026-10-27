import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

export type Nivel = 'baja' | 'moderada' | 'alta' | 'muy alta';

type Props = {
  paleta: Paleta;
  id: string;
  desde: number;
  hasta: number;
  periodos: { desde: number; hasta: number; nivel: Nivel }[];
  /** 0–1: aparición de las bandas. */
  aparece: number;
  /** 0–1: se traza la línea, de izquierda a derecha. */
  linea: number;
  /** 0–1: la banda vacía parpadea (un solo parpadeo). */
  parpadeo?: number;
};

const NIVELES: Nivel[] = ['baja', 'moderada', 'alta', 'muy alta'];
const G = { x0: 300, x1: 1740, y0: 200, y1: 840 };

/**
 * Niveles de corrupción por época: cuatro bandas de fondo (baja abajo) y una línea escalonada
 * que nunca baja a la primera. La banda vacía queda rayada y puede parpadear.
 */
export const GraficoNiveles: React.FC<Props> = ({ paleta, id, desde, hasta, periodos, aparece, linea, parpadeo = 0 }) => {
  const X = (a: number) => G.x0 + ((a - desde) / (hasta - desde)) * (G.x1 - G.x0);
  const alto = (G.y1 - G.y0) / NIVELES.length;
  const Yb = (i: number) => G.y1 - (i + 1) * alto; // borde de arriba de la banda i
  const yNivel = (n: Nivel) => Yb(NIVELES.indexOf(n)) + alto / 2;
  let d = '';
  periodos.forEach((p, i) => {
    const y = yNivel(p.nivel);
    d += `${i === 0 ? 'M' : 'L'}${X(p.desde)} ${y} L${X(p.hasta)} ${y} `;
  });
  const parp = parpadeo > 0 && parpadeo < 1 ? Math.sin(parpadeo * Math.PI) : 0;
  const decadas: number[] = [];
  for (let a = Math.ceil(desde / 20) * 20; a <= hasta; a += 20) decadas.push(a);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <pattern id={`${id}-vacia`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={alfa(paleta.papel, 0.18)} strokeWidth={1.2} />
        </pattern>
        <clipPath id={`${id}-traza`}><rect x={G.x0 - 10} y={0} width={(G.x1 - G.x0 + 20) * linea} height={1080} /></clipPath>
      </defs>
      {NIVELES.map((n, i) => (
        <g key={n}>
          <rect x={G.x0} y={Yb(i)} width={G.x1 - G.x0} height={alto - 4}
            fill={i === 0 ? `url(#${id}-vacia)` : mezclar(paleta.fondo, paleta.rojo, 0.1 + i * 0.12)} />
          {i === 0 ? <rect x={G.x0} y={Yb(i)} width={G.x1 - G.x0} height={alto - 4} fill={alfa(paleta.papel, 0.22 * parp)} stroke={alfa(paleta.papel, 0.35)} strokeDasharray="6 6" /> : null}
          <text x={G.x0 - 24} y={Yb(i) + alto / 2 + 10} textAnchor="end" fill={i === 0 ? alfa(paleta.papel, 0.6 + 0.4 * parp) : alfa(paleta.papel, 0.85)}
            fontFamily={fuente.mono} fontSize={26} letterSpacing={3}>{n.toUpperCase()}</text>
        </g>
      ))}
      {decadas.map((a) => (
        <g key={a}>
          <line x1={X(a)} x2={X(a)} y1={G.y1} y2={G.y1 + 12} stroke={alfa(paleta.papel, 0.6)} />
          <text x={X(a)} y={G.y1 + 48} textAnchor="middle" fill={alfa(paleta.papel, 0.7)} fontFamily={fuente.mono} fontSize={24}>{a}</text>
        </g>
      ))}
      {periodos.map((p, i) => <line key={i} x1={X(p.desde)} x2={X(p.desde)} y1={G.y0} y2={G.y1} stroke={alfa(paleta.papel, 0.12)} strokeDasharray="2 6" />)}
      <g clipPath={`url(#${id}-traza)`}>
        <path d={d} fill="none" stroke={paleta.papel} strokeWidth={6} strokeLinejoin="round" />
        {periodos.map((p, i) => <circle key={i} cx={X(p.desde)} cy={yNivel(p.nivel)} r={7} fill={paleta.rojo} stroke={paleta.papel} strokeWidth={2} />)}
      </g>
    </svg>
  );
};
