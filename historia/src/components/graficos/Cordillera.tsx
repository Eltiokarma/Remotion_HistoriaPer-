import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** 0–1: las cordilleras se dibujan de atrás hacia adelante. */
  dibujo: number;
  /** 0–1: el punto rojo baja desde el cielo hasta el lugar. */
  baja: number;
  /** 0–1: aparece la línea de altura y su escala. */
  altura: number;
  /** Rótulo de la escala de altura (p. ej. "3 600 m"). */
  rotuloAltura?: string;
};

const HORIZONTE = 780;
export const LUGAR = { x: 1010, y: 640 };

/** Perfil de una sierra: picos con laderas rectas (como los Andes, no lomas) y un borde quebrado. */
const sierra = (semilla: number, base: number, alto: number, rugosidad: number, picos: number): string => {
  const r = azar(semilla);
  const cimas = Array.from({ length: picos }, (_, i) => ({
    x: ((i + r.rango(0.1, 0.9)) / picos) * 2100 - 90, h: alto * r.rango(0.45, 1), pend: r.rango(0.55, 1.15),
  }));
  let d = `M0 ${HORIZONTE + 300}`;
  for (let x = 0; x <= 1920; x += 8) {
    let techo = 0;
    for (const c of cimas) techo = Math.max(techo, c.h - Math.abs(x - c.x) * c.pend);
    const quiebre = rugosidad * (Math.abs(Math.sin(x * 0.071 + semilla)) * 0.6 + Math.abs(Math.sin(x * 0.23 + semilla * 2)) * 0.4);
    d += ` L${x} ${(base - Math.max(techo, alto * 0.08) - quiebre).toFixed(1)}`;
  }
  return d + ` L1920 ${HORIZONTE + 300} Z`;
};

/**
 * Cordillera en grabado: tres sierras con rayado cada vez más denso hacia adelante, nieve en
 * las cumbres de atrás, un punto rojo que baja hasta un lugar y una escala de altura.
 */
export const Cordillera: React.FC<Props> = ({ paleta, id, dibujo, baja, altura, rotuloAltura }) => {
  const tinta = paleta.ocre;
  const capas = useMemo(() => [
    { d: sierra(11, 560, 380, 14, 7), tono: 0.12, raya: 9, nieve: true },
    { d: sierra(23, 690, 240, 10, 9), tono: 0.2, raya: 6, nieve: false },
    { d: sierra(37, 800, 120, 8, 12), tono: 0.3, raya: 4, nieve: false },
  ], []);
  const yPunto = 80 + (LUGAR.y - 80) * (1 - (1 - clamp(baja)) ** 2);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        {capas.map((c, i) => (
          <pattern key={i} id={`${id}-raya${i}`} width={c.raya} height={c.raya} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1={0} y1={0} x2={0} y2={c.raya} stroke={tinta} strokeWidth={0.9} opacity={0.25 + i * 0.12} />
          </pattern>
        ))}
        <linearGradient id={`${id}-nieve`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={paleta.papel} stopOpacity={0.85} />
          <stop offset="0.16" stopColor={paleta.papel} stopOpacity={0.35} />
          <stop offset="0.3" stopColor={paleta.papel} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* cielo grabado */}
      {Array.from({ length: 40 }, (_, i) => <line key={i} x1={0} x2={1920} y1={60 + i * 11} y2={60 + i * 11} stroke={alfa(tinta, 0.12 - i * 0.002)} />)}
      {capas.map((c, i) => {
        const k = clamp(dibujo * 3 - i);
        if (k <= 0) return null;
        return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 40})`}>
            <path d={c.d} fill={mezclar(paleta.fondo, paleta.ocre, c.tono)} />
            <path d={c.d} fill={`url(#${id}-raya${i})`} />
            {c.nieve ? <path d={c.d} fill={`url(#${id}-nieve)`} /> : null}
            <path d={c.d} fill="none" stroke={tinta} strokeWidth={1.6} opacity={0.8} />
          </g>
        );
      })}
      {/* el punto rojo baja hasta el lugar, dejando una estela de puntos */}
      {baja > 0 ? (
        <g>
          <line x1={LUGAR.x} x2={LUGAR.x} y1={80} y2={yPunto} stroke={paleta.rojo} strokeWidth={2} strokeDasharray="2 8" opacity={0.7} />
          <circle cx={LUGAR.x} cy={yPunto} r={11} fill={paleta.rojo} />
          {baja >= 1 ? <circle cx={LUGAR.x} cy={LUGAR.y} r={24} fill="none" stroke={paleta.rojo} strokeWidth={2} opacity={0.8} /> : null}
        </g>
      ) : null}
      {/* la altura: línea punteada hasta una escala a la derecha */}
      {altura > 0 ? (
        <g opacity={altura}>
          <line x1={LUGAR.x + 30} x2={LUGAR.x + 30 + (1680 - LUGAR.x - 30) * altura} y1={LUGAR.y} y2={LUGAR.y} stroke={alfa(paleta.papel, 0.7)} strokeWidth={1.5} strokeDasharray="8 7" />
          <line x1={1680} x2={1680} y1={HORIZONTE + 60} y2={300} stroke={alfa(paleta.papel, 0.6)} strokeWidth={2} />
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={1670} x2={1690} y1={HORIZONTE + 60 - i * 50} y2={HORIZONTE + 60 - i * 50} stroke={alfa(paleta.papel, 0.5)} />)}
          {rotuloAltura ? <text x={1660} y={LUGAR.y - 16} textAnchor="end" fill={paleta.papel} fontFamily={fuente.mono} fontSize={34} letterSpacing={2}>{rotuloAltura}</text> : null}
        </g>
      ) : null}
    </svg>
  );
};
