import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Rótulo del frontón. */
  rotulo: string;
  /** Etiqueta de las siluetas que se encienden en las ventanas. */
  etiqueta?: string;
  /** 0–1: se dibuja la fachada (de abajo hacia arriba). */
  dibujo?: number;
  /** 0–1: se encienden las ventanas con siluetas, una tras otra. */
  siluetas?: number;
  /** Ancho del dibujo en px (alto proporcional). */
  width?: number;
};

const W = 760, H = 560;
const COLUMNAS = 6;

/** Una silueta de funcionario: busto con sombrero de copa, en una ventana iluminada. */
const Silueta: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`} fill={color}>
    <rect x={-9} y={-44} width={18} height={14} rx={1} />
    <rect x={-14} y={-31} width={28} height={3} />
    <circle cx={0} cy={-20} r={9} />
    <path d="M-20 12 C -20 -4, -12 -10, 0 -10 C 12 -10, 20 -4, 20 12 Z" />
  </g>
);

/**
 * Fachada neoclásica en grabado (un edificio público genérico, no uno real): escalinata, sillares,
 * columnas con volumen (luz a la izquierda, sombra a la derecha, estrías), capiteles, frontón con
 * dentículos y un relieve de laureles, la sombra honda del pórtico y la que el edificio echa al
 * piso. Las ventanas se encienden con siluetas.
 */
export const EdificioEstado: React.FC<Props> = ({ paleta, id, rotulo, etiqueta, dibujo = 1, siluetas = 0, width = 760 }) => {
  const tinta = mezclar(paleta.fondo, paleta.rojo, 0.06);
  const papel = paleta.papel;
  const piedra = mezclar(papel, paleta.ocre, 0.22);
  const piedraSombra = mezclar(piedra, tinta, 0.28);
  const piedraLuz = mezclar(papel, '#ffffff', 0.35);
  const orden = useMemo(() => {
    const r = azar(1850);
    return Array.from({ length: COLUMNAS }, (_, i) => i).sort(() => r.n() - 0.5);
  }, []);
  // manchas de la piedra (con semilla: siempre las mismas)
  const manchas = useMemo(() => {
    const r = azar(1851);
    return Array.from({ length: 40 }, () => ({ x: r.rango(60, W - 60), y: r.rango(110, H - 90), rx: r.rango(6, 26), ry: r.rango(3, 10), o: r.rango(0.04, 0.12) }));
  }, []);
  const ancho = (W - 160) / COLUMNAS;
  const yBase = H - 70, yCornisa = 210, yFronton = 120;
  const u = (n: string) => `url(#${id}-${n})`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} style={{ overflow: 'visible' }}>
      <defs>
        <pattern id={`${id}-sombra`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={tinta} strokeWidth={0.9} />
        </pattern>
        <pattern id={`${id}-cruzado`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={tinta} strokeWidth={0.8} />
        </pattern>
        <clipPath id={`${id}-dibujo`}><rect x={-60} y={H + 20 - (H + 40) * clamp(dibujo)} width={W + 160} height={H + 40} /></clipPath>
        <radialGradient id={`${id}-luz`}>
          <stop offset="0" stopColor={mezclar(paleta.ocre, '#ffffff', 0.35)} />
          <stop offset="1" stopColor={paleta.ocre} />
        </radialGradient>
        {/* una columna es un cilindro: luz a la izquierda, brillo, sombra a la derecha */}
        <linearGradient id={`${id}-fuste`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={piedraSombra} />
          <stop offset="0.18" stopColor={piedra} />
          <stop offset="0.34" stopColor={piedraLuz} />
          <stop offset="0.55" stopColor={piedra} />
          <stop offset="0.85" stopColor={piedraSombra} />
          <stop offset="1" stopColor={mezclar(piedraSombra, tinta, 0.3)} />
        </linearGradient>
        {/* el fondo del pórtico: más oscuro arriba, bajo la cornisa */}
        <linearGradient id={`${id}-portico`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(piedra, tinta, 0.55)} />
          <stop offset="0.35" stopColor={mezclar(piedra, tinta, 0.32)} />
          <stop offset="1" stopColor={mezclar(piedra, tinta, 0.2)} />
        </linearGradient>
        <linearGradient id={`${id}-huella`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={piedraLuz} />
          <stop offset="0.3" stopColor={piedra} />
          <stop offset="1" stopColor={piedraSombra} />
        </linearGradient>
        <linearGradient id={`${id}-cornisa`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={piedraLuz} />
          <stop offset="0.6" stopColor={piedra} />
          <stop offset="1" stopColor={piedraSombra} />
        </linearGradient>
        <linearGradient id={`${id}-timpano`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(piedra, tinta, 0.3)} />
          <stop offset="1" stopColor={mezclar(piedra, tinta, 0.12)} />
        </linearGradient>
        <radialGradient id={`${id}-piso`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={tinta} stopOpacity={0.3} />
          <stop offset="1" stopColor={tinta} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-muro`}><rect x={80} y={yCornisa} width={W - 160} height={yBase - yCornisa} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-dibujo)`}>
        {/* la sombra del edificio sobre el piso, hacia la derecha (la luz viene de arriba a la izquierda) */}
        <ellipse cx={W / 2 + 60} cy={H - 4} rx={W / 2 + 40} ry={22} fill={u('piso')} />
        {/* escalinata: huella con luz, contrahuella en sombra */}
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={40 - k * 14} y={yBase + k * 16} width={W - 80 + k * 28} height={16} fill={u('huella')} stroke={tinta} strokeWidth={1.2} />
            <rect x={40 - k * 14} y={yBase + k * 16 + 10} width={W - 80 + k * 28} height={6} fill={`url(#${id}-sombra)`} opacity={0.45} />
          </g>
        ))}
        {/* muro del fondo: sillares, en la sombra del pórtico */}
        <rect x={80} y={yCornisa} width={W - 160} height={yBase - yCornisa} fill={u('portico')} stroke={tinta} strokeWidth={1.4} />
        <g clipPath={u('muro')} stroke={alfa(tinta, 0.4)} strokeWidth={0.8}>
          {Array.from({ length: 12 }, (_, f) => {
            const y = yCornisa + 18 + f * 26;
            return (
              <g key={f}>
                <line x1={80} x2={W - 80} y1={y} y2={y} />
                {Array.from({ length: 12 }, (_, c) => <line key={c} x1={80 + c * 56 + (f % 2) * 28} x2={80 + c * 56 + (f % 2) * 28} y1={y} y2={y + 26} />)}
              </g>
            );
          })}
          <rect x={80} y={yCornisa} width={W - 160} height={60} fill={`url(#${id}-cruzado)`} opacity={0.35} stroke="none" />
        </g>
        {/* puertas entre columnas: hondas (sombra en el marco); se encienden con siluetas */}
        {Array.from({ length: COLUMNAS }, (_, i) => {
          const cx = 80 + ancho * (i + 0.5);
          const on = clamp(siluetas * COLUMNAS - orden.indexOf(i));
          const arco = `M${cx - 24} ${yBase - 40} L${cx - 24} ${yCornisa + 90} Q ${cx} ${yCornisa + 62}, ${cx + 24} ${yCornisa + 90} L${cx + 24} ${yBase - 40} Z`;
          return (
            <g key={i}>
              <path d={`M${cx - 30} ${yBase - 34} L${cx - 30} ${yCornisa + 86} Q ${cx} ${yCornisa + 52}, ${cx + 30} ${yCornisa + 86} L${cx + 30} ${yBase - 34} Z`}
                fill={piedra} stroke={tinta} strokeWidth={1} />
              <path d={arco} fill={on > 0 ? u('luz') : mezclar(tinta, paleta.papel, 0.22)} opacity={on > 0 ? 0.35 + 0.65 * on : 0.92} />
              {/* el derrame: la sombra del marco cae a la derecha y arriba */}
              <path d={`M${cx - 24} ${yBase - 40} L${cx - 24} ${yCornisa + 90} Q ${cx} ${yCornisa + 62}, ${cx + 24} ${yCornisa + 90} L${cx + 14} ${yCornisa + 96} Q ${cx} ${yCornisa + 76}, ${cx - 16} ${yCornisa + 96} L${cx - 16} ${yBase - 40} Z`}
                fill={tinta} opacity={on > 0 ? 0.15 : 0.35} />
              <rect x={cx - 34} y={yBase - 40} width={68} height={6} fill={u('cornisa')} stroke={tinta} strokeWidth={0.8} />
              {on > 0 ? <g opacity={on}><Silueta x={cx} y={yBase - 52} color={tinta} /></g> : null}
              {on > 0.5 && etiqueta ? (
                <text x={cx} y={yBase - 6} textAnchor="middle" fill={paleta.rojo} fontFamily={fuente.mono} fontSize={13} letterSpacing={1} opacity={(on - 0.5) * 2}>{etiqueta}</text>
              ) : null}
            </g>
          );
        })}
        {/* columnas: sombra que echan al muro, fuste cilíndrico con estrías, basa y capitel */}
        {Array.from({ length: COLUMNAS + 1 }, (_, i) => {
          const x = 80 + ancho * i;
          const alto = yBase - yCornisa - 36;
          return (
            <g key={i}>
              <rect x={x + 12} y={yCornisa + 26} width={20} height={alto} fill={tinta} opacity={0.16} />
              {/* éntasis: el fuste se angosta apenas hacia arriba */}
              <path d={`M${x - 18} ${yBase - 10} L${x - 15} ${yCornisa + 26} L${x + 15} ${yCornisa + 26} L${x + 18} ${yBase - 10} Z`} fill={u('fuste')} stroke={tinta} strokeWidth={1.3} />
              {[-10, -5, 0, 5, 10].map((d) => (
                <g key={d}>
                  <line x1={x + d * 1.12} x2={x + d * 0.94} y1={yBase - 14} y2={yCornisa + 32} stroke={tinta} strokeWidth={0.7} opacity={d > 0 ? 0.6 : 0.35} />
                  <line x1={x + d * 1.12 - 1.4} x2={x + d * 0.94 - 1.4} y1={yBase - 14} y2={yCornisa + 32} stroke={piedraLuz} strokeWidth={0.8} opacity={d < 0 ? 0.7 : 0.3} />
                </g>
              ))}
              {/* capitel: equino (curvo) y ábaco */}
              <path d={`M${x - 16} ${yCornisa + 27} Q ${x - 24} ${yCornisa + 18}, ${x - 26} ${yCornisa + 14} L${x + 26} ${yCornisa + 14} Q ${x + 24} ${yCornisa + 18}, ${x + 16} ${yCornisa + 27} Z`}
                fill={u('fuste')} stroke={tinta} strokeWidth={1.2} />
              <rect x={x - 28} y={yCornisa + 6} width={56} height={9} fill={u('cornisa')} stroke={tinta} strokeWidth={1.2} />
              {/* basa: dos toros y el plinto */}
              <rect x={x - 21} y={yBase - 12} width={42} height={5} rx={2.5} fill={u('fuste')} stroke={tinta} strokeWidth={1} />
              <rect x={x - 24} y={yBase - 7} width={48} height={7} fill={u('huella')} stroke={tinta} strokeWidth={1.1} />
            </g>
          );
        })}
        {/* entablamento: arquitrabe, friso con triglifos, cornisa con su sombra */}
        <rect x={56} y={yCornisa - 2} width={W - 112} height={12} fill={u('cornisa')} stroke={tinta} strokeWidth={1.2} />
        <rect x={50} y={yCornisa - 18} width={W - 100} height={16} fill={u('cornisa')} stroke={tinta} strokeWidth={1.4} />
        {Array.from({ length: 34 }, (_, i) => (
          <g key={i}>
            <rect x={58 + i * 19} y={yCornisa + 1} width={9} height={7} fill={tinta} opacity={0.7} />
            <rect x={58 + i * 19} y={yCornisa + 1} width={2} height={7} fill={piedraLuz} opacity={0.5} />
          </g>
        ))}
        <rect x={50} y={yCornisa + 10} width={W - 100} height={6} fill={tinta} opacity={0.22} />
        {/* frontón: tímpano en sombra, cornisa inclinada con luz y un relieve de laureles */}
        <path d={`M34 ${yCornisa - 18} L${W / 2} ${yFronton - 44} L${W - 34} ${yCornisa - 18} Z`} fill={u('cornisa')} stroke={tinta} strokeWidth={1.8} />
        <path d={`M72 ${yCornisa - 24} L${W / 2} ${yFronton - 26} L${W - 72} ${yCornisa - 24} Z`} fill={u('timpano')} stroke={tinta} strokeWidth={1} />
        <path d={`M72 ${yCornisa - 24} L${W / 2} ${yFronton - 26} L${W - 72} ${yCornisa - 24} Z`} fill={`url(#${id}-sombra)`} opacity={0.22} />
        {Array.from({ length: 22 }, (_, i) => {
          // dentículos bajo la cornisa inclinada, a los dos lados
          const k = (i + 0.5) / 22;
          const xa = mixN(72, W / 2, k), ya = mixN(yCornisa - 24, yFronton - 26, k);
          const xb = mixN(W - 72, W / 2, k);
          return (
            <g key={i} fill={tinta} opacity={0.45}>
              <rect x={xa - 3} y={ya + 1} width={6} height={5} />
              <rect x={xb - 3} y={ya + 1} width={6} height={5} />
            </g>
          );
        })}
        {/* el relieve: dos ramas de laurel en torno a un disco (genérico, no un escudo real) */}
        <g transform={`translate(${W / 2} ${yFronton - 6}) scale(0.78)`}>
          <circle r={20} fill={piedra} stroke={tinta} strokeWidth={1.2} />
          <circle r={20} fill="none" stroke={piedraLuz} strokeWidth={1.4} transform="translate(-1.2 -1.2)" opacity={0.8} />
          <circle r={13} fill="none" stroke={tinta} strokeWidth={0.8} opacity={0.6} />
          {[-1, 1].map((lado) => (
            <g key={lado} transform={`scale(${lado} 1)`}>
              <path d="M24 10 C 46 4, 62 -6, 74 -22" fill="none" stroke={tinta} strokeWidth={1.2} />
              {Array.from({ length: 6 }, (_, j) => {
                const px = 30 + j * 8, py = 7 - j * 5;
                return <ellipse key={j} cx={px} cy={py} rx={6} ry={2.6} transform={`rotate(${-30 - j * 6} ${px} ${py})`} fill={piedraSombra} stroke={tinta} strokeWidth={0.7} />;
              })}
            </g>
          ))}
        </g>
        {/* acroterios */}
        {[[W / 2, yFronton - 44], [34, yCornisa - 18], [W - 34, yCornisa - 18]].map(([ax, ay], i) => (
          <path key={i} d={`M${ax - 9} ${ay} L${ax} ${ay - 18} L${ax + 9} ${ay} Z`} fill={u('cornisa')} stroke={tinta} strokeWidth={1.1} />
        ))}
        {/* manchas y desgaste de la piedra */}
        {manchas.map((m, i) => <ellipse key={i} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill={tinta} opacity={m.o * 0.6} />)}
        {/* el rótulo, en una placa con relieve */}
        <rect x={W / 2 - 150} y={yCornisa - 70} width={300} height={44} fill={u('cornisa')} stroke={tinta} strokeWidth={1.4} />
        <rect x={W / 2 - 144} y={yCornisa - 64} width={288} height={32} fill="none" stroke={tinta} strokeWidth={0.7} opacity={0.6} />
        <text x={W / 2 + 1.2} y={yCornisa - 36} textAnchor="middle" fill={piedraLuz} fontFamily={fuente.imprenta} fontSize={30} letterSpacing={10}>{rotulo}</text>
        <text x={W / 2} y={yCornisa - 37.2} textAnchor="middle" fill={tinta} fontFamily={fuente.imprenta} fontSize={30} letterSpacing={10}>{rotulo}</text>
      </g>
      <line x1={0} x2={W} y1={H - 6} y2={H - 6} stroke={alfa(tinta, 0.5)} strokeWidth={1} />
    </svg>
  );
};

const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
