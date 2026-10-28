import { useMemo } from 'react';
import { clamp, tramo } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';

type Props = {
  paleta: Paleta;
  id: string;
  /** Segundos desde que empiezan a caer los puntos. */
  t: number;
  /** Segundos (desde el mismo origen) en que se traza la recta. */
  tRecta: number;
  /** 0–1: los bloques de discurso de la izquierda se apagan. */
  apagaDiscursos?: number;
  /** 0–1: aparición general. */
  aparece?: number;
};

const G = { x0: 800, x1: 1760, y0: 190, y1: 880 };
const N = 46;

/**
 * Historia cuantitativa en un cuadro: papel milimetrado, una nube de puntos que cae uno a uno,
 * la recta de regresión que la atraviesa (con sus residuos) y, al lado, bloques de discurso que
 * se apagan. Sin ejes rotulados: es la idea del método, no un dato.
 */
export const Dispersion: React.FC<Props> = ({ paleta, id, t, tRecta, apagaDiscursos = 0, aparece = 1 }) => {
  const tinta = paleta.fondo;
  const puntos = useMemo(() => {
    const r = azar(1983);
    return Array.from({ length: N }, (_, i) => {
      const u = r.rango(0.05, 0.95);
      const ruido = (r.n() + r.n() + r.n() - 1.5) * 0.22;
      return { u, v: clamp(0.18 + 0.62 * u + ruido, 0.04, 0.96), orden: i };
    });
  }, []);
  const X = (u: number) => G.x0 + u * (G.x1 - G.x0);
  const Y = (v: number) => G.y1 - v * (G.y1 - G.y0);
  // recta de mínimos cuadrados de verdad, calculada con los puntos
  const mu = puntos.reduce((a, p) => a + p.u, 0) / N, mv = puntos.reduce((a, p) => a + p.v, 0) / N;
  const pend = puntos.reduce((a, p) => a + (p.u - mu) * (p.v - mv), 0) / puntos.reduce((a, p) => a + (p.u - mu) ** 2, 0);
  const recta = (u: number) => mv + pend * (u - mu);
  const kRecta = clamp((t - tRecta) / 1.3);
  const kResiduos = clamp((t - tRecta - 1.2) / 1.2);

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <pattern id={`${id}-mm`} width={10} height={10} patternUnits="userSpaceOnUse">
          <path d="M10 0 L0 0 L0 10" fill="none" stroke={paleta.verde} strokeWidth={0.5} opacity={0.35} />
        </pattern>
        <pattern id={`${id}-cm`} width={50} height={50} patternUnits="userSpaceOnUse">
          <path d="M50 0 L0 0 L0 50" fill="none" stroke={paleta.verde} strokeWidth={1.1} opacity={0.45} />
        </pattern>
      </defs>
      {/* los discursos: bloques de texto gris que pierden peso */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} opacity={(1 - apagaDiscursos * (0.55 + i * 0.08)) * clamp(t / 0.6 - i * 0.15)}>
          <rect x={150 + (i % 2) * 24} y={200 + i * 112} width={500} height={92} rx={4} fill={mezclar(paleta.papel, tinta, 0.06)} stroke={alfa(tinta, 0.25)} />
          {Array.from({ length: 4 }, (_, k) => (
            <rect key={k} x={172 + (i % 2) * 24} y={220 + i * 112 + k * 17} width={k === 3 ? 260 : 456} height={7} rx={3} fill={alfa(tinta, 0.4)} />
          ))}
        </g>
      ))}
      {/* papel milimetrado y ejes */}
      <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} fill={`url(#${id}-mm)`} />
      <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} fill={`url(#${id}-cm)`} />
      <line x1={G.x0} x2={G.x0} y1={G.y0 - 20} y2={G.y1} stroke={tinta} strokeWidth={2} />
      <line x1={G.x0} x2={G.x1 + 20} y1={G.y1} y2={G.y1} stroke={tinta} strokeWidth={2} />
      <path d={`M${G.x0 - 7} ${G.y0 - 8} L${G.x0} ${G.y0 - 24} L${G.x0 + 7} ${G.y0 - 8}`} fill="none" stroke={tinta} strokeWidth={2} />
      <path d={`M${G.x1 + 4} ${G.y1 - 7} L${G.x1 + 20} ${G.y1} L${G.x1 + 4} ${G.y1 + 7}`} fill="none" stroke={tinta} strokeWidth={2} />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} stroke={tinta} strokeWidth={1.4}>
          <line x1={G.x0 + (i + 1) * 96} x2={G.x0 + (i + 1) * 96} y1={G.y1} y2={G.y1 + 10} />
          <line x1={G.x0 - 10} x2={G.x0} y1={G.y1 - (i + 1) * 69} y2={G.y1 - (i + 1) * 69} />
        </g>
      ))}
      {/* residuos: lo que la recta no explica */}
      {puntos.map((p, i) => (
        <line key={`r${i}`} x1={X(p.u)} x2={X(p.u)} y1={Y(p.v)} y2={Y(p.v) + (Y(recta(p.u)) - Y(p.v)) * kResiduos} stroke={paleta.rojo} strokeWidth={1.2} opacity={0.5} />
      ))}
      {/* la nube de puntos, uno a uno */}
      {puntos.map((p, i) => {
        const k = tramo(t, (i / N) * 3, 0.25, 'ligero'); // un golpe de pluma: rápido y frena
        if (k <= 0) return null;
        return <circle key={i} cx={X(p.u)} cy={Y(p.v)} r={7 * (1 + 0.6 * (1 - k))} fill={tinta} opacity={0.85 * k} />;
      })}
      {/* la recta de regresión */}
      <line x1={X(0)} y1={Y(recta(0))} x2={X(0) + (X(1) - X(0)) * kRecta} y2={Y(recta(0)) + (Y(recta(1)) - Y(recta(0))) * kRecta}
        stroke={paleta.rojo} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};
