import { useMemo } from 'react';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';

type Props = {
  paleta: Paleta;
  /** Segundos de la escena (mueve el mar, las aves y el barco). */
  t: number;
  /** 0–1: cuánto guano se ha acumulado sobre las islas. */
  guano: number;
  id?: string;
  /** Segundos desde que empiezan a subir sacos al barco (el barco queda anclado junto a la última isla). */
  carga?: number;
};

const X0 = 150, X1 = 1770, Y0 = 100, Y1 = 940, HORIZONTE = 585;

type Isla = { x: number; w: number; h: number; monte: number; semilla: number };
const ISLAS: Isla[] = [
  { x: 300, w: 470, h: 120, monte: 150, semilla: 1 },
  { x: 860, w: 310, h: 86, monte: 104, semilla: 2 },
  { x: 1240, w: 300, h: 70, monte: 86, semilla: 3 },
];

/** Contorno rocoso de una isla (cima irregular, base en el horizonte). */
const contornoIsla = (is: Isla): string => {
  const r = azar(is.semilla * 101);
  const pts: string[] = [`M${is.x} ${HORIZONTE}`];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const perfil = Math.sin(Math.PI * u) ** 0.7; // más alta al centro, acantilados a los lados
    const y = HORIZONTE - is.h * perfil * (0.82 + 0.18 * r.n()) - (u > 0.1 && u < 0.9 ? r.rango(-5, 5) : 0);
    pts.push(`L${(is.x + is.w * u).toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ') + ' Z';
};

/** Montículo de guano: irregular, con una cima corrida y lomas (no una cúpula perfecta). */
const monticulo = (is: Isla): string => {
  const r = azar(is.semilla * 31);
  const y0 = HORIZONTE - is.h * 0.55, x0 = is.x + is.w * 0.14, ancho = is.w * 0.72;
  const cima = r.rango(0.38, 0.6);
  const pts: string[] = [`M${x0} ${y0}`];
  for (let i = 1; i < 24; i++) {
    const u = i / 24;
    const forma = u < cima ? Math.sin((u / cima) * Math.PI / 2) : Math.cos(((u - cima) / (1 - cima)) * Math.PI / 2);
    const lomas = 1 + 0.08 * Math.sin(u * 19 + is.semilla) + 0.05 * Math.sin(u * 41 + is.semilla * 2);
    pts.push(`L${(x0 + ancho * u).toFixed(1)} ${(y0 - is.monte * forma ** 0.8 * lomas).toFixed(1)}`);
  }
  return pts.join(' ') + ` L${x0 + ancho} ${y0}`;
};

/** Fila de olas: una línea de buril ondulada; más abajo (más cerca) olas más grandes. */
const ola = (y: number, t: number, fila: number): string => {
  const cerca = (y - HORIZONTE) / (Y1 - HORIZONTE);
  const amp = 0.6 + cerca * 5.5;
  const largo = 30 + cerca * 110;
  const fase = t * (0.6 + cerca * 0.9) + fila * 1.7;
  let d = '';
  for (let x = X0; x <= X1; x += 8) {
    const yy = y + Math.sin((x / largo) * 2 * Math.PI + fase) * amp + Math.sin((x / (largo * 2.7)) * 2 * Math.PI - fase * 0.6) * amp * 0.5;
    d += `${x === X0 ? 'M' : 'L'}${x} ${yy.toFixed(1)} `;
  }
  return d;
};

/** Fragata de tres palos, como las que cargaban guano para Europa. */
export const Barco: React.FC<{ x: number; y: number; tinta: string; papel: string; id: string; escala?: number }> = ({ x, y, tinta, papel, id, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    {/* casco */}
    <path d="M-92 0 L96 0 L80 16 L-78 16 Z" fill={tinta} />
    <path d="M-92 0 L-104 -6 L-90 -2 Z" fill={tinta} />
    {/* palos */}
    {[-50, 0, 46].map((mx, i) => <line key={i} x1={mx} y1={0} x2={mx} y2={-118 + i * 8} stroke={tinta} strokeWidth={2.4} />)}
    <line x1={-104} y1={-6} x2={-50} y2={-96} stroke={tinta} strokeWidth={1.2} />
    {/* velas cuadradas con sombra rayada */}
    {[-50, 0, 46].map((mx, i) => (
      <g key={i}>
        {[0, 1, 2].map((k) => {
          const top = -112 + i * 8 + k * 34, ancho = 52 - k * -6 - i * 4;
          const d = `M${mx - ancho / 2} ${top} Q${mx} ${top + 6} ${mx + ancho / 2} ${top} L${mx + ancho / 2 + 2} ${top + 28} Q${mx} ${top + 34} ${mx - ancho / 2 - 2} ${top + 28} Z`;
          return (
            <g key={k}>
              <path d={d} fill={papel} stroke={tinta} strokeWidth={1.4} />
              <path d={d} fill={`url(#${id}-rayado)`} opacity={0.7} />
            </g>
          );
        })}
      </g>
    ))}
    {/* foque y gallardete */}
    <path d="M-50 -92 L-100 -8 L-58 -10 Z" fill={papel} stroke={tinta} strokeWidth={1.2} />
    <path d="M0 -118 l16 4 l-16 4 Z" fill={tinta} />
  </g>
);

/**
 * Grabado del siglo XIX (tinta sobre papel): cielo y mar en líneas de buril, islas con
 * sombreado cruzado, montículos de guano punteados, aves y una fragata. El mar se mueve.
 */
export const GrabadoGuanero: React.FC<Props> = ({ paleta, t, guano, id = 'grabado', carga }) => {
  const tinta = mezclar(paleta.fondo, paleta.rojo, 0.08);
  const filasMar = useMemo(() => {
    const out: number[] = [];
    for (let y = HORIZONTE + 6; y < Y1 - 4; y += 5 + (y - HORIZONTE) * 0.055) out.push(y);
    return out;
  }, []);
  const islas = useMemo(() => ISLAS.map((is) => ({ ...is, d: contornoIsla(is) })), []);
  const puntos = useMemo(() => ISLAS.map((is) => {
    const r = azar(is.semilla * 7);
    return Array.from({ length: 70 }, () => ({ u: r.rango(0.45, 0.95), v: r.n(), s: r.rango(0.8, 1.8) }));
  }), []);
  const aves = useMemo(() => {
    const r = azar(77);
    return Array.from({ length: 28 }, () => ({ fx: r.rango(0.05, 0.12), fy: r.rango(0.07, 0.15), ax: r.rango(120, 420), ay: r.rango(30, 110), fase: r.rango(0, 6.28), aleteo: r.rango(7, 10), tam: r.rango(0.7, 1.3) }));
  }, []);
  // navega despacio hacia la izquierda; si se está cargando, queda anclado junto a la última isla
  const barcoX = carga === undefined ? 1590 - t * 9 : 1650;
  // sacos: suben por una plancha desde la orilla de la isla hasta la cubierta, uno tras otro
  const plancha = { x1: 1500, y1: HORIZONTE - 4, x2: 1600, y2: HORIZONTE - 44 };
  const sacos = carga === undefined || carga < 0 ? [] : Array.from({ length: 6 }, (_, k) => ((carga / 1.3 + k / 6) % 1))
    .filter((_, k) => carga > k * 0.22);

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id={`${id}-rayado`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1={0} y1={0} x2={0} y2={5} stroke={tinta} strokeWidth={1.1} />
        </pattern>
        <pattern id={`${id}-cruzado`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
          <line x1={0} y1={0} x2={0} y2={5} stroke={tinta} strokeWidth={1} />
        </pattern>
        <clipPath id={`${id}-placa`}><rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} /></clipPath>
        {/* nubes: donde hay nube no hay líneas de cielo */}
        <mask id={`${id}-nubes`}>
          <rect x={0} y={0} width={1920} height={1080} fill="#fff" />
          <g filter={`url(#${id}-difuso)`} fill="#000">
            <ellipse cx={520} cy={300} rx={260} ry={46} />
            <ellipse cx={640} cy={268} rx={150} ry={40} />
            <ellipse cx={1320} cy={230} rx={300} ry={50} />
            <ellipse cx={1180} cy={205} rx={120} ry={34} />
            <ellipse cx={980} cy={430} rx={200} ry={26} />
          </g>
        </mask>
        <filter id={`${id}-difuso`}><feGaussianBlur stdDeviation={14} /></filter>
      </defs>

      <g clipPath={`url(#${id}-placa)`}>
        {/* cielo: líneas más juntas arriba, se abren hacia el horizonte */}
        <g mask={`url(#${id}-nubes)`} stroke={tinta}>
          {Array.from({ length: 64 }, (_, i) => {
            const y = Y0 + 6 + i * 7.3;
            if (y > HORIZONTE - 4) return null;
            const k = (y - Y0) / (HORIZONTE - Y0);
            return <line key={i} x1={X0} x2={X1} y1={y} y2={y} strokeWidth={1.1 - k * 0.6} opacity={0.62 - k * 0.42} />;
          })}
        </g>
        {/* mar */}
        <g fill="none" stroke={tinta}>
          {filasMar.map((y, i) => <path key={i} d={ola(y, t, i)} strokeWidth={0.8 + ((y - HORIZONTE) / (Y1 - HORIZONTE)) * 0.9} opacity={0.6} />)}
        </g>
        <line x1={X0} x2={X1} y1={HORIZONTE} y2={HORIZONTE} stroke={tinta} strokeWidth={1.4} />

        <Barco x={barcoX} y={HORIZONTE - 14} tinta={tinta} papel={paleta.papel} id={id} escala={0.78} />
        {carga !== undefined && carga >= 0 ? (
          <g>
            <line x1={plancha.x1} y1={plancha.y1} x2={plancha.x2} y2={plancha.y2} stroke={tinta} strokeWidth={2.2} />
            <line x1={plancha.x1} y1={plancha.y1 + 5} x2={plancha.x2} y2={plancha.y2 + 5} stroke={tinta} strokeWidth={1} />
            {sacos.map((u, k) => {
              // los suben a pulso: cada paso es un pequeño salto (acción secundaria, casi no se ve)
              const x = plancha.x1 + (plancha.x2 - plancha.x1) * u, y = plancha.y1 + (plancha.y2 - plancha.y1) * u - 9 - Math.abs(Math.sin(u * Math.PI * 7)) * 1.6;
              return (
                <g key={k} transform={`translate(${x} ${y}) rotate(-22)`} opacity={Math.min(1, (1 - u) * 6)}>
                  <path d="M-9 -7 Q -10 8, -7 9 L 7 9 Q 10 8, 9 -7 Q 0 -10, -9 -7 Z" fill={paleta.papel} stroke={tinta} strokeWidth={1.2} />
                  <path d="M-3 -9 l 3 -4 l 3 4" fill="none" stroke={tinta} strokeWidth={1} />
                  <rect x={1} y={-6} width={7} height={14} fill={`url(#${id}-rayado)`} />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* islas */}
        {islas.map((is, i) => (
          <g key={i}>
            <clipPath id={`${id}-isla-${i}`}><path d={is.d} /></clipPath>
            <path d={is.d} fill={paleta.papel} />
            <g clipPath={`url(#${id}-isla-${i})`}>
              {/* lado en sombra: rayado, y cruzado en lo más oscuro */}
              <rect x={is.x + is.w * 0.42} y={HORIZONTE - is.h - 10} width={is.w} height={is.h + 20} fill={`url(#${id}-rayado)`} />
              <rect x={is.x + is.w * 0.72} y={HORIZONTE - is.h - 10} width={is.w} height={is.h + 20} fill={`url(#${id}-cruzado)`} />
              {/* grietas del acantilado */}
              {Array.from({ length: 9 }, (_, k) => {
                const x = is.x + is.w * (0.08 + k * 0.1);
                return <line key={k} x1={x} y1={HORIZONTE} x2={x + 6} y2={HORIZONTE - is.h * 0.55} stroke={tinta} strokeWidth={0.8} opacity={0.5} />;
              })}
            </g>
            <path d={is.d} fill="none" stroke={tinta} strokeWidth={1.8} />
            {/* reflejo roto en el agua */}
            {Array.from({ length: 6 }, (_, k) => (
              <line key={k} x1={is.x + is.w * (0.15 + k * 0.05)} x2={is.x + is.w * (0.55 + k * 0.06)} y1={HORIZONTE + 10 + k * 9} y2={HORIZONTE + 10 + k * 9}
                stroke={paleta.papel} strokeWidth={3} opacity={0.85} />
            ))}
            {/* el guano: un montículo claro que crece, con curvas de nivel y punteado */}
            <g transform={`translate(0 ${HORIZONTE - is.h * 0.55}) scale(1 ${guano}) translate(0 ${-(HORIZONTE - is.h * 0.55)})`}>
              {/* relleno cerrado sin borde abajo: el guano se funde con la roca, no es un sombrero */}
              <path d={monticulo(is) + ' Z'} fill={paleta.papel} />
              <path d={monticulo(is)} fill="none" stroke={tinta} strokeWidth={1.4} />
              {[0.72, 0.48].map((k, j) => (
                <path key={j} d={`M${is.x + is.w * (0.5 - 0.3 * k)} ${HORIZONTE - is.h * 0.55 - is.monte * (0.62 - k * 0.55)} Q ${is.x + is.w * 0.5} ${HORIZONTE - is.h * 0.55 - is.monte * (0.95 - k * 0.5)} ${is.x + is.w * (0.5 + 0.3 * k)} ${HORIZONTE - is.h * 0.55 - is.monte * (0.62 - k * 0.55)}`}
                  fill="none" stroke={tinta} strokeWidth={0.9} opacity={0.55} />
              ))}
              {puntos[i].map((p, k) => {
                const x = is.x + is.w * (0.16 + 0.68 * p.u);
                const techo = Math.sin(Math.PI * (x - is.x - is.w * 0.16) / (is.w * 0.68)) * is.monte * 0.75;
                return <circle key={k} cx={x} cy={HORIZONTE - is.h * 0.55 - p.v * techo} r={p.s} fill={tinta} opacity={0.6} />;
              })}
            </g>
          </g>
        ))}

        {/* aves sobre las islas */}
        <g fill="none" stroke={tinta} strokeLinecap="round">
          {aves.map((a, i) => {
            const x = 900 + Math.sin(t * a.fx * 6.28 + a.fase) * a.ax;
            const y = 330 + Math.sin(t * a.fy * 6.28 + a.fase * 1.3) * a.ay;
            const h = (Math.sin(t * a.aleteo + a.fase) * 0.5 + 0.5) * 6 * a.tam + 1;
            const w = 10 * a.tam;
            return <path key={i} d={`M${x - w} ${y} Q${x - w / 2} ${y - h} ${x} ${y} Q${x + w / 2} ${y - h} ${x + w} ${y}`} strokeWidth={1.7} />;
          })}
        </g>
      </g>

      {/* marco de la lámina, como en un libro de grabados */}
      <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill="none" stroke={tinta} strokeWidth={2.5} />
      <rect x={X0 - 12} y={Y0 - 12} width={X1 - X0 + 24} height={Y1 - Y0 + 24} fill="none" stroke={tinta} strokeWidth={0.9} />
    </svg>
  );
};
