import { useMemo } from 'react';
import { arqueo, clamp, mix, tramo } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

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
  /** Segundos (desde el mismo origen) en que empiezan a caer los puntos (por defecto, enseguida). */
  tCaen?: number;
  /**
   * Para explicar el método: la recta aparece horizontal, por el centro de la nube, y «busca»
   * (gira, se pasa y se asienta) hasta la de mínimos cuadrados. Sin esto, se traza ya inclinada.
   */
  busca?: boolean;
  /** Segundos en que se dibuja el triángulo de la pendiente («cuánto pesa»). */
  tPendiente?: number;
  /** Los residuos (lo que la recta no explica), en rojo. */
  residuos?: boolean;
  /**
   * Del método al dato: en `t = desde`, la nube y la recta se van, algunos puntos viajan a su lugar
   * y se vuelven una serie real (uno por etiqueta), que se enciende de izquierda a derecha con su
   * valor. Sin recta: lo que se dibuja es lo que el autor midió, no un ajuste nuestro.
   */
  serie?: { desde: number; etiquetas: string[]; valores: number[]; maximo: number; unidad: string; banda?: [number, number]; textoBanda?: string; fuente?: string };
};

const G = { x0: 800, x1: 1760, y0: 190, y1: 880 };
const N = 46;

/**
 * Historia cuantitativa en un cuadro: papel milimetrado, una nube de puntos que cae uno a uno,
 * la recta de regresión que la atraviesa (con sus residuos) y, al lado, bloques de discurso que
 * se apagan. Sin ejes rotulados: es la idea del método, no un dato.
 */
export const Dispersion: React.FC<Props> = ({ paleta, id, t, tRecta, apagaDiscursos = 0, aparece = 1, tCaen = 0, busca = false, tPendiente, residuos = true, serie }) => {
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
  // buscando: la pendiente va de 0 a la verdadera con un resorte (se pasa y vuelve)
  const dt = t - tRecta - 0.5;
  const giro = !busca ? 1 : dt <= 0 ? 0 : 1 - Math.exp(-dt * 2.6) * Math.cos(dt * 5.2);
  const pendAhora = pend * giro;
  const recta = (u: number) => mv + pendAhora * (u - mu);
  const kRecta = clamp((t - tRecta) / (busca ? 0.6 : 1.3));
  const kResiduos = residuos ? clamp((t - tRecta - 1.2) / 1.2) : 0;
  // el triángulo de la pendiente: un paso a la derecha y lo que sube
  const kTri = tPendiente === undefined ? 0 : clamp((t - tPendiente) / 0.9);
  const uA = 0.42, uB = 0.72;
  // la serie real: se va la idea (0,6 s), viajan los puntos (1,2 s) y se encienden de a uno
  const sale = serie ? tramo(t, serie.desde, 0.6, 'natural') : 0;
  const nS = serie?.valores.length ?? 0;
  const viaje = serie ? tramo(t, serie.desde + 0.2, 1.2, 'pesado') : 0;
  const tLuz = serie ? serie.desde + 1.3 : Infinity;
  const pasoLuz = nS > 0 ? Math.min(0.3, 3.4 / nS) : 0;
  const xS = (j: number) => G.x0 + 50 + (j * (G.x1 - G.x0 - 100)) / Math.max(1, nS - 1);
  const yS = (v: number) => G.y1 - (v / (serie?.maximo ?? 1)) * (G.y1 - G.y0);
  const porU = useMemo(() => [...puntos].sort((a, b) => a.u - b.u), [puntos]);
  const viajeros = new Map<number, number>();
  for (let j = 0; j < nS; j++) viajeros.set(porU[Math.round((j * (N - 1)) / Math.max(1, nS - 1))].orden, j);
  const kBanda = serie?.banda ? tramo(t, tLuz + nS * pasoLuz + 0.2, 0.8, 'natural') : 0;

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
        <g key={i} stroke={tinta} strokeWidth={1.4} opacity={1 - sale}>
          <line x1={G.x0 + (i + 1) * 96} x2={G.x0 + (i + 1) * 96} y1={G.y1} y2={G.y1 + 10} />
          <line x1={G.x0 - 10} x2={G.x0} y1={G.y1 - (i + 1) * 69} y2={G.y1 - (i + 1) * 69} />
        </g>
      ))}
      {/* residuos: lo que la recta no explica */}
      {puntos.map((p, i) => (
        <line key={`r${i}`} x1={X(p.u)} x2={X(p.u)} y1={Y(p.v)} y2={Y(p.v) + (Y(recta(p.u)) - Y(p.v)) * kResiduos} stroke={paleta.rojo} strokeWidth={1.2} opacity={0.5 * (1 - sale)} />
      ))}
      {/* la nube de puntos, uno a uno */}
      {puntos.map((p, i) => {
        const k = tramo(t, tCaen + (i / N) * 3, 0.25, 'ligero'); // un golpe de pluma: rápido y frena
        if (k <= 0) return null;
        const j = viajeros.get(p.orden);
        if (serie && j !== undefined && viaje > 0) return null; // ahora es un punto de la serie
        return <circle key={i} cx={X(p.u)} cy={Y(p.v)} r={7 * (1 + 0.6 * (1 - k))} fill={tinta} opacity={0.85 * k * (j === undefined ? 1 - sale : 1)} />;
      })}
      {/* la recta de regresión */}
      <line x1={X(0)} y1={Y(recta(0))} x2={X(0) + (X(1) - X(0)) * kRecta} y2={Y(recta(0)) + (Y(recta(1)) - Y(recta(0))) * kRecta}
        stroke={paleta.rojo} strokeWidth={5} strokeLinecap="round" opacity={1 - sale} />
      {/* cuánto pesa: el escalón de la pendiente, debajo de la recta */}
      {kTri > 0 ? (
        <g opacity={kTri * (1 - sale)}>
          <path d={`M${X(uA)} ${Y(recta(uA))} L${X(uA) + (X(uB) - X(uA)) * clamp(kTri * 2)} ${Y(recta(uA))}`} stroke={tinta} strokeWidth={2.5} strokeDasharray="8 7" />
          <path d={`M${X(uB)} ${Y(recta(uA))} L${X(uB)} ${Y(recta(uA)) + (Y(recta(uB)) - Y(recta(uA))) * clamp(kTri * 2 - 1)}`} stroke={paleta.rojo} strokeWidth={4} />
          <path d={`M${X(uB) - 9} ${Y(recta(uB)) + 14} L${X(uB)} ${Y(recta(uB))} L${X(uB) + 9} ${Y(recta(uB)) + 14}`} fill="none" stroke={paleta.rojo} strokeWidth={3}
            opacity={clamp(kTri * 2 - 1)} />
        </g>
      ) : null}
      {/* la serie: lo que midió, década por década */}
      {serie && viaje > 0 ? (
        <g>
          {/* el eje de valores, con su unidad */}
          <g opacity={viaje}>
            {Array.from({ length: Math.floor(serie.maximo) + 1 }, (_, v) => (
              <g key={v}>
                <line x1={G.x0 - 10} x2={G.x0} y1={yS(v)} y2={yS(v)} stroke={tinta} strokeWidth={1.4} />
                <text x={G.x0 - 18} y={yS(v) + 7} textAnchor="end" fontFamily={fuente.mono} fontSize={20} fill={alfa(tinta, 0.7)}>{v}</text>
              </g>
            ))}
            <text x={G.x0 - 18} y={G.y0 - 30} textAnchor="end" fontFamily={fuente.mono} fontSize={18} letterSpacing="0.12em" fill={alfa(tinta, 0.7)}>{serie.unidad}</text>
          </g>
          {serie.banda ? (
            <g opacity={kBanda}>
              <rect x={G.x0} y={yS(serie.banda[1])} width={(G.x1 - G.x0) * kBanda} height={yS(serie.banda[0]) - yS(serie.banda[1])} fill={alfa(paleta.ocre, 0.28)} />
              <line x1={G.x0} x2={G.x0 + (G.x1 - G.x0) * kBanda} y1={yS(serie.banda[1])} y2={yS(serie.banda[1])} stroke={paleta.ocre} strokeWidth={2} strokeDasharray="10 8" />
              <line x1={G.x0} x2={G.x0 + (G.x1 - G.x0) * kBanda} y1={yS(serie.banda[0])} y2={yS(serie.banda[0])} stroke={paleta.ocre} strokeWidth={2} strokeDasharray="10 8" />
              {serie.textoBanda ? (
                <text x={G.x1 - 12} y={yS(serie.banda[0]) + 34} textAnchor="end" fontFamily={fuente.mono} fontSize={20} letterSpacing="0.1em"
                  fill={mezclar(paleta.ocre, tinta, 0.55)}>{serie.textoBanda}</text>
              ) : null}
            </g>
          ) : null}
          {/* la línea que une lo encendido */}
          <polyline fill="none" stroke={alfa(tinta, 0.45)} strokeWidth={2} strokeLinejoin="round"
            points={serie.valores.map((v, j) => (t >= tLuz + j * pasoLuz ? `${xS(j)},${yS(v)}` : '')).filter(Boolean).join(' ')} />
          {serie.valores.map((v, j) => {
            // el punto viaja desde su lugar en la nube, en arco
            const p = porU[Math.round((j * (N - 1)) / Math.max(1, nS - 1))];
            const kj = tramo(t, serie.desde + 0.2 + j * 0.02, 1.2, 'pesado');
            const x = mix(X(p.u), xS(j), kj), y = mix(Y(p.v), yS(v), kj) - arqueo(kj, 60);
            const luz = tramo(t, tLuz + j * pasoLuz, 0.25, 'ligero');
            const brillo = luz > 0 ? Math.max(0, 1 - (t - tLuz - j * pasoLuz) / 0.7) : 0;
            return (
              <g key={`s${j}`}>
                {brillo > 0 ? <circle cx={x} cy={y} r={10 + 18 * brillo} fill={paleta.rojo} opacity={0.35 * brillo} /> : null}
                <circle cx={x} cy={y} r={6 + 2.5 * luz} fill={luz > 0 ? mezclar(tinta, paleta.rojo, 0.7 * brillo) : alfa(tinta, 0.35)} />
                <text x={x} y={y - 18} textAnchor="middle" fontFamily={fuente.mono} fontSize={19} fill={tinta} opacity={luz}>{v.toFixed(1).replace('.', ',')}</text>
                <text x={xS(j)} y={G.y1 + 32} textAnchor="middle" fontFamily={fuente.mono} fontSize={17} fill={alfa(tinta, 0.75)} opacity={luz}>{serie.etiquetas[j]}</text>
                <line x1={xS(j)} x2={xS(j)} y1={G.y1} y2={G.y1 + 8} stroke={tinta} strokeWidth={1.4} opacity={viaje} />
              </g>
            );
          })}
          {serie.fuente ? (
            <text x={G.x1} y={G.y1 + 74} textAnchor="end" fontFamily={fuente.mono} fontSize={16} letterSpacing="0.14em" fill={alfa(tinta, 0.6)} opacity={kBanda || viaje}>
              {serie.fuente}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};
