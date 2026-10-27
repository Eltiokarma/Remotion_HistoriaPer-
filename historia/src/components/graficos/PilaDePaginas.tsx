import { getLength, getPointAtLength } from '@remotion/paths';
import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';
import { PatronPapel } from '../atmosfera/Papel';
import { Pluma } from './Pluma';
import { bordePapel, FiltroSombra, FiltroTinta, renglonesTipeados, trazoManuscrito } from './svg';

type Props = {
  paleta: Paleta;
  /** Identificador único (para los ids internos del SVG). */
  id: string;
  /** 0–1: cuánto se han dibujado las correcciones en rojo. */
  correcciones: number;
  /** Mostrar la pluma que hace las correcciones. */
  conPluma?: boolean;
  width: number;
  semilla?: number;
};

// Página de arriba (coordenadas del viewBox 0 0 420 560).
const PX = 30, PY = 30, PW = 360, PH = 500;
const INTERLINEA = 17;
const Y_TEXTO = 104;

/** Correcciones a mano, en el orden en que se hacen. Coordenadas sobre la página. */
/** Punto sobre un trazo (nunca null: si el trazo está vacío, el origen). */
const punto = (d: string, largo: number) => getPointAtLength(d, largo) ?? { x: 0, y: 0 };

const correccionesBase = (semilla: number): string[] => {
  const linea = (n: number) => Y_TEXTO + n * INTERLINEA - 3;
  return [
    `M70 ${linea(2)} L${PX + PW - 48} ${linea(2) + 2}`, // tacha un renglón
    `M196 ${linea(6) - 2} C 222 ${linea(6) - 18}, 278 ${linea(6) - 14}, 282 ${linea(6) + 2} C 286 ${linea(6) + 18}, 210 ${linea(6) + 20}, 194 ${linea(6) + 6} C 188 ${linea(6) - 2}, 204 ${linea(6) - 10}, 218 ${linea(6) - 10}`, // encierra una palabra
    `M${PX + PW - 20} ${linea(6) - 6} l9 -10 M${PX + PW - 20} ${linea(6) - 6} l-6 -8`, // marca al margen
    `M120 ${linea(10)} L262 ${linea(10) + 4}`, // otra tachadura
    `M${PX + PW - 22} ${linea(13) - 10} C ${PX + PW - 2} ${linea(13)}, ${PX + PW - 2} ${linea(15)}, ${PX + PW - 22} ${linea(16) + 4}`, // llave al margen
    `M96 ${linea(18) + 6} l8 -12 l8 12`, // signo de inserción
    `M62 ${linea(22) + 6} C 130 ${linea(22)}, 230 ${linea(22) + 10}, ${PX + PW - 40} ${linea(22) + 2}`, // subraya
    trazoManuscrito(semilla + 11, 70, PY + PH - 42, 210, 12), // nota al pie, escrita a mano
  ];
};

/** Pila de páginas de un manuscrito: papel de verdad, texto a máquina y correcciones con pluma. */
export const PilaDePaginas: React.FC<Props> = ({ paleta, id, correcciones, conPluma = true, width, semilla = 2012 }) => {
  const hojas = useMemo(() => {
    const r = azar(semilla);
    return [5, 4, 3, 2, 1].map((k) => ({ k, rot: r.rango(-1.6, 1.6), dx: k * 4 + r.rango(-2, 2), dy: -k * 4 + r.rango(-1, 1) }));
  }, [semilla]);
  const texto = useMemo(() => renglonesTipeados(semilla, 62, Y_TEXTO, PW - 70, 22, INTERLINEA), [semilla]);
  const trazos = useMemo(() => correccionesBase(semilla).map((d) => ({ d, largo: getLength(d) })), [semilla]);
  const borde = useMemo(() => bordePapel(semilla, PX, PY, PW, PH), [semilla]);

  // Cada trazo: 75 % del tiempo dibujando, 25 % la pluma viaja (levantada) al siguiente.
  const n = trazos.length;
  const p = clamp(correcciones) * n;
  const i = Math.min(n - 1, Math.floor(p));
  const u = p - i;
  const dibujo = (k: number) => (k < i ? 1 : k > i ? 0 : clamp(u / 0.75));
  let punta = { x: 0, y: 0 }, alzada = 1;
  if (correcciones > 0 && correcciones < 1) {
    const actual = trazos[i];
    if (u <= 0.75) {
      punta = punto(actual.d, actual.largo * clamp(u / 0.75));
      alzada = 0;
    } else {
      const viaje = clamp((u - 0.75) / 0.25);
      const a = punto(actual.d, actual.largo);
      const b = i + 1 < n ? punto(trazos[i + 1].d, 0) : { x: a.x + 60, y: a.y + 40 };
      punta = { x: a.x + (b.x - a.x) * viaje, y: a.y + (b.y - a.y) * viaje };
      alzada = Math.sin(Math.PI * viaje);
    }
  }
  const verPluma = conPluma && correcciones > 0 && correcciones < 1;

  return (
    <svg viewBox="0 0 420 560" width={width} style={{ overflow: 'visible' }}>
      <defs>
        <PatronPapel id={`${id}-papel`} escala={512} />
        <FiltroTinta id={`${id}-tinta`} fuerza={1.2} />
        <FiltroSombra id={`${id}-sombra`} desenfoque={10} />
      </defs>
      {/* sombra de la pila sobre la mesa */}
      <rect x={PX + 14} y={PY + 18} width={PW + 10} height={PH} fill="#000" opacity={0.55} filter={`url(#${id}-sombra)`} />
      {/* hojas de abajo, cada una un poco movida: se lee "muchas páginas" */}
      {hojas.map(({ k, rot, dx, dy }) => (
        <g key={k} transform={`translate(${dx} ${dy}) rotate(${rot} ${PX + PW / 2} ${PY + PH / 2})`}>
          <rect x={PX} y={PY} width={PW} height={PH} fill={mezclar(paleta.papel, paleta.fondo, 0.06 + k * 0.035)} />
          <rect x={PX} y={PY} width={PW} height={PH} fill={`url(#${id}-papel)`} style={{ mixBlendMode: 'multiply' }} />
          <line x1={PX + PW} y1={PY} x2={PX + PW} y2={PY + PH} stroke={paleta.fondo} strokeOpacity={0.18} />
        </g>
      ))}
      {/* página de arriba */}
      <path d={borde} fill={paleta.papel} />
      <path d={borde} fill={`url(#${id}-papel)`} style={{ mixBlendMode: 'multiply' }} />
      <path d={borde} fill="none" stroke={paleta.fondo} strokeOpacity={0.12} />
      {/* encabezado y texto a máquina */}
      <rect x={PX + PW / 2 - 70} y={64} width={140} height={7} rx={1.5} fill={paleta.fondo} opacity={0.7} />
      <rect x={PX + PW / 2 - 40} y={78} width={80} height={4} rx={1} fill={paleta.fondo} opacity={0.45} />
      {texto.map((w, k) => (
        <rect key={k} x={w.x} y={w.y - 6} width={w.w} height={5.2} rx={1.2} fill={paleta.fondo} opacity={0.5 + ((k * 37) % 10) / 60} />
      ))}
      {/* correcciones en tinta roja */}
      <g filter={`url(#${id}-tinta)`}>
        {trazos.map((t, k) => {
          const kk = dibujo(k);
          return kk > 0 ? (
            <path key={k} d={t.d} pathLength={1} fill="none" stroke={paleta.rojo} strokeWidth={k === n - 1 ? 2.2 : 3.6}
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - kk} opacity={0.92} />
          ) : null;
        })}
      </g>
      {verPluma ? <Pluma x={punta.x} y={punta.y} paleta={paleta} id={`${id}-pluma`} alzada={alzada} escala={0.62} /> : null}
    </svg>
  );
};
