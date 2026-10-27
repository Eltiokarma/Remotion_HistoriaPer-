import { useMemo } from 'react';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

export type Capitulo = { desde: number; hasta: number };

type Props = {
  paleta: Paleta;
  id: string;
  capitulos: Capitulo[];
  /** Por capítulo: 0 = apagado (silueta), 1 = encendido (sacado de la repisa y dorado). */
  encendido: number[];
  /** Por capítulo: 0–1, vuelve a su lugar después de encenderse. */
  asentado: number[];
  /** 0–1: la línea roja que sigue después del último año (el presente). */
  hoy?: number;
  etiquetaHoy?: string;
  aparece?: number;
};

const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const X0 = 170, X1 = 1650, REPISA = 700, EJE = 820;

/**
 * Una repisa con un libro por capítulo. El grosor de cada lomo es proporcional a los años
 * que cubre: el largo de una época también es un dato. Debajo, la línea de tiempo.
 */
export const LomosDeLibro: React.FC<Props> = ({ paleta, id, capitulos, encendido, asentado, hoy = 0, etiquetaHoy = 'hoy', aparece = 1 }) => {
  const inicio = capitulos[0].desde, fin = capitulos[capitulos.length - 1].hasta + 1;
  const px = (anio: number) => X0 + ((anio - inicio) / (fin - inicio)) * (X1 - X0);
  const telas = [mezclar(paleta.fondo, paleta.rojo, 0.6), mezclar(paleta.fondo, paleta.ocre, 0.38), mezclar(paleta.fondo, paleta.papel, 0.14)];
  const altos = useMemo(() => { const r = azar(1750); return capitulos.map(() => r.rango(330, 420)); }, [capitulos]);
  const marcas: number[] = [];
  for (let a = Math.ceil(inicio / 10) * 10; a <= fin; a += 10) marcas.push(a);

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id={`${id}-tela`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke="#000" strokeWidth={1} opacity={0.35} />
        </pattern>
        <linearGradient id={`${id}-lomo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.55} />
          <stop offset="0.3" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.04} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </linearGradient>
        <filter id={`${id}-sombra`}><feGaussianBlur stdDeviation={10} /></filter>
      </defs>

      <g opacity={aparece}>
        {/* repisa */}
        <rect x={X0 - 60} y={REPISA + 10} width={X1 - X0 + 120} height={30} fill="#000" opacity={0.5} filter={`url(#${id}-sombra)`} />
        <rect x={X0 - 60} y={REPISA} width={X1 - X0 + 120} height={24} fill={mezclar(paleta.fondo, paleta.ocre, 0.3)} />
        <rect x={X0 - 60} y={REPISA} width={X1 - X0 + 120} height={3} fill={mezclar(paleta.ocre, paleta.papel, 0.2)} opacity={0.6} />

        {/* línea de tiempo: décadas y medios siglos */}
        <line x1={X0} x2={X1} y1={EJE} y2={EJE} stroke={paleta.ocre} strokeWidth={1.6} opacity={0.75} />
        {marcas.map((a) => {
          const grande = a % 50 === 0;
          return (
            <g key={a}>
              <line x1={px(a)} x2={px(a)} y1={EJE - (grande ? 14 : 6)} y2={EJE + (grande ? 14 : 6)} stroke={paleta.ocre} strokeWidth={grande ? 1.6 : 1} opacity={grande ? 0.9 : 0.5} />
              {grande ? <text x={px(a)} y={EJE + 52} textAnchor="middle" fill={paleta.ocre} fontFamily={fuente.imprenta} fontSize={30} opacity={0.9}>{a}</text> : null}
            </g>
          );
        })}
      </g>
      {/* el presente: la línea sigue en rojo más allá del último capítulo */}
      <line x1={X1} x2={X1 + (1880 - X1) * hoy} y1={EJE} y2={EJE} stroke={paleta.rojo} strokeWidth={5} strokeDasharray="14 9" />
      <text x={1880} y={EJE - 26} textAnchor="end" fill={paleta.rojo} fontFamily={fuente.imprentaItalica} fontSize={40} opacity={hoy}>{etiquetaHoy}</text>

      {capitulos.map((c, i) => {
        const x = px(c.desde) + 3, w = px(c.hasta + 1) - px(c.desde) - 6;
        const h = altos[i];
        const e = encendido[i] ?? 0, s = asentado[i] ?? 0;
        const alza = 26 * e * (1 - 0.75 * s); // se saca de la repisa y vuelve casi a su lugar
        const y = REPISA - h - alza;
        const tela = telas[i % telas.length];
        const numSize = Math.min(48, w * 0.52);
        const anioSize = Math.min(28, w * 0.36);
        const brillo = e > 0 && e < 1 ? e : 0; // el destello recorre el dorado mientras se enciende
        const centro = x + w / 2;
        return (
          <g key={i} opacity={0.35 + 0.65 * e * aparece}>
            <defs>
              <linearGradient id={`${id}-oro-${i}`} x1={-1 + 2 * brillo} y1="0" x2={0 + 2 * brillo} y2="0">
                <stop offset="0" stopColor={paleta.ocre} />
                <stop offset="0.5" stopColor={brillo > 0 ? mezclar(paleta.ocre, '#ffffff', 0.7) : paleta.ocre} />
                <stop offset="1" stopColor={paleta.ocre} />
              </linearGradient>
            </defs>
            <rect x={x} y={y} width={w} height={h} rx={3} fill={tela} />
            <rect x={x} y={y} width={w} height={h} rx={3} fill={`url(#${id}-tela)`} />
            <rect x={x} y={y} width={w} height={h} rx={3} fill={`url(#${id}-lomo)`} />
            {/* nervios dorados arriba y abajo */}
            {[22, 30, h - 30, h - 22].map((dy, k) => (
              <line key={k} x1={x + 3} x2={x + w - 3} y1={y + dy} y2={y + dy} stroke={paleta.ocre} strokeWidth={k % 2 ? 1 : 2} opacity={0.35 + 0.55 * e} />
            ))}
            {/* tejuelo con el número */}
            <rect x={x + 5} y={y + 52} width={w - 10} height={numSize * 1.6} fill={mezclar(paleta.fondo, '#000000', 0.3)} stroke={paleta.ocre} strokeWidth={1} strokeOpacity={0.5 * e} />
            <text x={centro} y={y + 52 + numSize * 1.18} textAnchor="middle" fill={`url(#${id}-oro-${i})`} fontFamily={fuente.titulo} fontWeight={700} fontSize={numSize}>
              {ROMANOS[i]}
            </text>
            {/* los años, de canto */}
            <text x={centro} y={y + h * 0.62} textAnchor="middle" dominantBaseline="middle" fill={paleta.ocre} fontFamily={fuente.imprenta} fontSize={anioSize}
              letterSpacing={2} opacity={0.4 + 0.5 * e} transform={`rotate(-90 ${centro} ${y + h * 0.62})`}>
              {`${c.desde} – ${c.hasta}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
