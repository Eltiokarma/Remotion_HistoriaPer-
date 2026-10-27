import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

export type Nivel = 'baja' | 'moderada' | 'alta' | 'muy alta';

type Props = {
  paleta: Paleta;
  id: string;
  /** Un valor por década: el año en que empieza y el costo (en la unidad del eje). */
  serie: { desde: number; valor: number }[];
  /**
   * Bordes de los niveles: por debajo del primero es «baja»; hasta el segundo, «moderada»;
   * por debajo del tercero, «alta»; desde el tercero, «muy alta».
   */
  umbrales: [number, number, number];
  /** Rótulo del eje (qué se mide y de dónde sale). */
  eje: string;
  /** Sufijo de las marcas del eje (p. ej. " %"). */
  unidad?: string;
  /** 0–1: aparición de las bandas. */
  aparece: number;
  /** 0–1: se traza la línea, de izquierda a derecha. */
  linea: number;
  /** 0–1: la banda vacía parpadea (un solo parpadeo). */
  parpadeo?: number;
  /** 0–1: aparece la marca del punto más bajo. */
  minimo?: number;
};

const NIVELES: Nivel[] = ['baja', 'moderada', 'alta', 'muy alta'];
const G = { x0: 330, x1: 1640, y0: 150, y1: 810 };

const coma = (n: number) => n.toFixed(1).replace('.', ',');

/**
 * Niveles de corrupción por década, con números: bandas de fondo en escala real (la de abajo,
 * «baja», rayada y vacía) y una línea escalonada, un escalón por década. El punto más bajo
 * puede marcarse para que se vea que llega al borde y no lo cruza.
 */
export const GraficoNiveles: React.FC<Props> = ({ paleta, id, serie, umbrales, eje, unidad = ' %', aparece, linea, parpadeo = 0, minimo = 0 }) => {
  const desde = serie[0].desde;
  const hasta = serie[serie.length - 1].desde + 10;
  const tope = Math.ceil(Math.max(...serie.map((s) => s.valor)) + 0.5);
  const X = (a: number) => G.x0 + ((a - desde) / (hasta - desde)) * (G.x1 - G.x0);
  const Y = (v: number) => G.y1 - (v / tope) * (G.y1 - G.y0);
  const bordes = [0, ...umbrales, tope];
  let d = '';
  serie.forEach((s, i) => {
    d += `${i === 0 ? 'M' : 'L'}${X(s.desde)} ${Y(s.valor)} L${X(s.desde + 10)} ${Y(s.valor)} `;
  });
  const parp = parpadeo > 0 && parpadeo < 1 ? Math.sin(parpadeo * Math.PI) : 0;
  const bajo = serie.reduce((m, s) => (s.valor < m.valor ? s : m), serie[0]);
  const anios: number[] = [];
  for (let a = Math.ceil(desde / 20) * 20; a <= hasta; a += 20) anios.push(a);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <pattern id={`${id}-vacia`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={alfa(paleta.papel, 0.18)} strokeWidth={1.2} />
        </pattern>
        <clipPath id={`${id}-traza`}><rect x={G.x0 - 10} y={0} width={(G.x1 - G.x0 + 20) * linea} height={1080} /></clipPath>
      </defs>
      {NIVELES.map((n, i) => {
        const yA = Y(bordes[i + 1]), yB = Y(bordes[i]);
        return (
          <g key={n}>
            <rect x={G.x0} y={yA} width={G.x1 - G.x0} height={yB - yA - 3}
              fill={i === 0 ? `url(#${id}-vacia)` : mezclar(paleta.fondo, paleta.rojo, 0.1 + i * 0.12)} />
            {i === 0 ? <rect x={G.x0} y={yA} width={G.x1 - G.x0} height={yB - yA - 3} fill={alfa(paleta.papel, 0.22 * parp)} stroke={alfa(paleta.papel, 0.35)} strokeDasharray="6 6" /> : null}
            <text x={G.x0 - 24} y={(yA + yB) / 2 + 9} textAnchor="end" fill={i === 0 ? alfa(paleta.papel, 0.6 + 0.4 * parp) : alfa(paleta.papel, 0.85)}
              fontFamily={fuente.mono} fontSize={26} letterSpacing={3}>{n.toUpperCase()}</text>
          </g>
        );
      })}
      {/* los bordes de cada nivel, con su número: la escala es la de Quiroz, no una impresión */}
      {umbrales.map((u) => (
        <g key={u}>
          <line x1={G.x0} x2={G.x1 + 10} y1={Y(u)} y2={Y(u)} stroke={alfa(paleta.papel, 0.3)} strokeDasharray="3 5" />
          <text x={G.x1 + 20} y={Y(u) + 8} fill={alfa(paleta.papel, 0.7)} fontFamily={fuente.mono} fontSize={22}>{`${u}${unidad}`}</text>
        </g>
      ))}
      {anios.map((a) => (
        <g key={a}>
          <line x1={X(a)} x2={X(a)} y1={G.y1} y2={G.y1 + 12} stroke={alfa(paleta.papel, 0.6)} />
          <text x={X(a)} y={G.y1 + 46} textAnchor="middle" fill={alfa(paleta.papel, 0.7)} fontFamily={fuente.mono} fontSize={24}>{a}</text>
        </g>
      ))}
      <text x={(G.x0 + G.x1) / 2} y={G.y1 + 96} textAnchor="middle" fill={alfa(paleta.papel, 0.55)} fontFamily={fuente.mono} fontSize={21} letterSpacing={3}>{eje}</text>
      <g clipPath={`url(#${id}-traza)`}>
        <path d={d} fill="none" stroke={paleta.papel} strokeWidth={5} strokeLinejoin="round" />
        {serie.map((s) => <circle key={s.desde} cx={X(s.desde + 5)} cy={Y(s.valor)} r={6} fill={paleta.rojo} stroke={paleta.papel} strokeWidth={2} />)}
      </g>
      {minimo > 0 ? (
        <g opacity={minimo}>
          {/* solo el número: la década ya la dice el eje, y así cabe dentro de su escalón */}
          <line x1={X(bajo.desde + 5)} x2={X(bajo.desde + 5)} y1={Y(bajo.valor) - 14} y2={Y(bajo.valor) - 44} stroke={paleta.rojo} strokeWidth={2} />
          <text x={X(bajo.desde + 5)} y={Y(bajo.valor) - 54} textAnchor="middle" fill={paleta.papel} fontFamily={fuente.mono} fontWeight={600} fontSize={24}>
            {`${coma(bajo.valor)}${unidad}`}
          </text>
        </g>
      ) : null}
    </svg>
  );
};
