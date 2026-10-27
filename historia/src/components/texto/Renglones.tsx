import { useMemo } from 'react';
import { renglonesTipeados } from '../graficos/svg';

type Props = {
  /** Ancho y cantidad de líneas del bloque. */
  ancho: number;
  lineas: number;
  interlinea: number;
  color: string;
  /** Grosor de cada línea (alto de la letra simulada). */
  alto?: number;
  semilla?: number;
  opacidad?: number;
  /** Centrado (colofón, portada) en vez de justificado. */
  centrado?: boolean;
  style?: React.CSSProperties;
};

/**
 * Texto simulado: barras con el ritmo de palabras y párrafos. Llena páginas de libro sin
 * inventar contenido (lo que se lee en pantalla es solo lo que está en escenas.json).
 */
export const Renglones: React.FC<Props> = ({ ancho, lineas, interlinea, color, alto = 9, semilla = 1, opacidad = 0.4, centrado = false, style }) => {
  const palabras = useMemo(() => {
    const ps = renglonesTipeados(semilla, 0, alto, ancho, lineas, interlinea);
    if (!centrado) return ps;
    // centrar cada línea: correr sus palabras según lo que sobra
    const porLinea = new Map<number, typeof ps>();
    ps.forEach((p) => porLinea.set(p.y, [...(porLinea.get(p.y) ?? []), p]));
    return [...porLinea.values()].flatMap((l) => {
      const fin = Math.max(...l.map((p) => p.x + p.w));
      const ini = Math.min(...l.map((p) => p.x));
      const dx = (ancho - (fin - ini)) / 2 - ini;
      return l.map((p) => ({ ...p, x: p.x + dx }));
    });
  }, [ancho, lineas, interlinea, alto, semilla, centrado]);
  const altoTotal = Math.max(...palabras.map((p) => p.y), 0) + alto;
  return (
    <svg width={ancho} height={altoTotal} style={{ overflow: 'visible', ...style }}>
      {palabras.map((p, i) => (
        <rect key={i} x={p.x} y={p.y - alto} width={p.w} height={alto * 0.78} rx={alto * 0.25} fill={color} opacity={opacidad * (0.8 + ((i * 37) % 10) / 50)} />
      ))}
    </svg>
  );
};
