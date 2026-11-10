import { getLength, getPointAtLength } from '@remotion/paths';
import { clamp, mix } from '../../direction/anim';
import { CapaVC, DefsLamina, capa, usePrefijo, type Lamina } from './vectorcraft/Lamina';

/** Mercator de la lámina: la latitud φ está en y = ecuador − escala · ln(tan(π/4 + φ/2)). */
export type Mercator = { ecuador_y: number; escala: number };
export const yDeLatitud = (m: Mercator, lat: number) => m.ecuador_y - m.escala * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
export const latitudDeY = (m: Mercator, y: number) => (2 * Math.atan(Math.exp((m.ecuador_y - y) / m.escala)) - Math.PI / 2) * (180 / Math.PI);

/** La ruta del viaje en la lámina (la primera pieza de la capa Rutas). */
export const rutaDeLamina = (l: Lamina) => {
  const d = capa(l, 'Rutas').parts[0].match(/\bd="([^"]+)"/)?.[1] ?? 'M0 0';
  return { d, largo: getLength(d) };
};

/** Piezas de la capa Rutas (en el orden de la exportación aprobada). */
const P = { viaje: 0, alternativa: [1, 28], lima: [29, 30, 40], ny: [31, 32], nyNombre: 35, nyFicha: [36, 37], paris: [33, 34, 38, 39], oceano: 41 } as const;
/** Área útil del mapa en la lámina (debajo del encabezado). */
const MAPA = { x0: 130, x1: 1790, y0: 235, y1: 960 };

type Props = {
  lamina: Lamina;
  t: number;
  /** 0–1: aparece el mapa. */
  aparece: number;
  /** 0–1: avance del viaje (ya con su peso). */
  avance: number;
  /** 0–1 (con sobrepaso negativo): cuánto entra la cámara. */
  camara: number;
  zoom: number;
  /** Cuánto mira por delante de la punta (fracción de la ruta). */
  miraAdelante: number;
  /** 0–1: la ruta a la alternativa (duda y se borra: la cifra sube y baja). */
  alternativa: number;
  /** Brillo del marcador de la alternativa. */
  paris: number;
  /** Faro del destino (se anuncia antes de llegar). */
  faro: number;
  /** Resorte de llegada (0 → 1, se pasa). */
  llegada: number;
  /** 0–1: la ficha del destino se escribe. */
  ficha: number;
  /** 0–1 cada uno: rótulos que se encienden al cruzar un paralelo. */
  paralelos: { y: number; rotulo: string; brillo: number }[];
  /** 0–1: el gráfico de abajo («Pensar la historia con números») y la fuente. */
  leyenda: number;
};

/**
 * El viaje Lima → Nueva York sobre la lámina aprobada, con la cámara que lo hace con él
 * (CLAUDE.md §4, «El movimiento guía»): se echa atrás, se lanza, mira por delante de la punta,
 * frena al llegar y se abre con un resorte; la ruta a París duda y se borra; los paralelos se
 * encienden al cruzarlos; el destino brilla más mientras nos acercamos.
 */
export const ViajeLamina: React.FC<Props> = (p) => {
  const uid = usePrefijo();
  const { lamina: l, t } = p;
  const ruta = rutaDeLamina(l);
  const punta = getPointAtLength(ruta.d, ruta.largo * clamp(p.avance)) ?? { x: 0, y: 0 };
  const mira = getPointAtLength(ruta.d, ruta.largo * clamp(p.avance + p.miraAdelante)) ?? punta;
  // lo que pasa de largo (la anticipación y el rebote) se nota, pero no deja ver el borde del mapa
  const z = p.camara < 0 ? p.camara * 0.35 : p.camara;
  const S = mix(1, p.zoom, z);
  const medio = { x: 960 / S, y: 540 / S };
  const acota = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.max(a, Math.min(b, v)));
  const cx = mix(960, acota(mira.x, MAPA.x0 + medio.x, MAPA.x1 - medio.x), clamp(z));
  const cy = mix(540, acota(mira.y, MAPA.y0 + medio.y - 40, MAPA.y1 - medio.y + 40), clamp(z));
  const camara = `translate(${960 - S * cx} ${540 - S * cy}) scale(${S})`;
  const rutas = capa(l, 'Rutas');
  const caja = (i: number) => rutas.boxes[i];
  const ny = caja(P.ny[1]), nyC = { x: ny[0] + ny[2] / 2, y: ny[1] + ny[3] / 2 };
  const nAlt = P.alternativa[1] - P.alternativa[0] + 1;
  // la ficha del destino: se escribe de izquierda a derecha, un renglón y después el otro
  const largoFicha = [caja(P.nyFicha[0])[2], caja(P.nyFicha[1])[2]];
  const escrito = clamp(p.ficha) * (largoFicha[0] + largoFicha[1]);
  const pieza = (i: number) => {
    if (i === P.viaje) return undefined; // se dibuja aparte con su trazo
    if (i >= P.alternativa[0] && i <= P.alternativa[1]) return { opacity: clamp(p.alternativa * nAlt - (i - P.alternativa[0])) };
    if ((P.paris as readonly number[]).includes(i)) return { opacity: p.paris };
    if ((P.ny as readonly number[]).includes(i)) {
      const s = Math.max(0, p.llegada);
      return { opacity: clamp(p.llegada * 3), transform: `translate(${nyC.x} ${nyC.y}) scale(${s}) translate(${-nyC.x} ${-nyC.y})` };
    }
    if (i === P.nyNombre) return { opacity: clamp(p.llegada * 2) };
    if ((P.nyFicha as readonly number[]).includes(i)) return { opacity: escrito > 0 ? 1 : 0 };
    return undefined;
  };
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, opacity: p.aparece }}>
      <DefsLamina lamina={l} uid={uid} />
      <defs>
        <clipPath id={`${uid}-mapa`}><rect x={0} y={MAPA.y0} width={1920} height={MAPA.y1 - MAPA.y0 + 10} /></clipPath>
        {P.nyFicha.map((n, j) => {
          const b = caja(n);
          const ancho = clamp((escrito - (j === 0 ? 0 : largoFicha[0])) / largoFicha[j]) * (b[2] + 8);
          return <clipPath key={j} id={`${uid}-ficha${j}`}><rect x={b[0] - 4} y={b[1] - 8} width={ancho} height={b[3] + 16} /></clipPath>;
        })}
        <radialGradient id={`${uid}-faro`}>
          <stop offset="0" stopColor="#f3d692" stopOpacity={0.7} />
          <stop offset="1" stopColor="#f3d692" stopOpacity={0} />
        </radialGradient>
      </defs>
      <CapaVC lamina={l} uid={uid} nombre="Pizarra_verde" />
      <g clipPath={`url(#${uid}-mapa)`}>
        <g transform={camara}>
          <CapaVC lamina={l} uid={uid} nombre="Cartografía" />
          {/* los paralelos que se cruzan: se encienden con un pulso y se apagan despacio */}
          {p.paralelos.map((q, i) => (
            <g key={i} opacity={0.12 + 0.75 * q.brillo}>
              <line x1={MAPA.x0} x2={MAPA.x1} y1={q.y} y2={q.y} stroke="#e8dabc" strokeWidth={1.2 + 1.6 * q.brillo} strokeDasharray="10 8" />
              <text x={MAPA.x0 + 330} y={q.y - 8} fill="#e8dabc" fontFamily="monospace" fontSize={16} letterSpacing={3} opacity={0.4 + 0.6 * q.brillo}>{q.rotulo}</text>
            </g>
          ))}
          {/* el destino se anuncia: un faro que crece mientras nos acercamos */}
          {p.faro > 0 ? <circle cx={nyC.x} cy={nyC.y} r={30 + 50 * p.faro + 6 * Math.sin(t * 4)} fill={`url(#${uid}-faro)`} opacity={p.faro} /> : null}
          <path d={ruta.d} fill="none" stroke="#e5c17c" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp(p.avance)} />
          {p.avance > 0 && p.avance < 1 ? <circle cx={punta.x} cy={punta.y} r={7} fill="#f3d692" /> : null}
          <CapaVC lamina={l} uid={uid} nombre="Rutas" solo={(i) => !(P.nyFicha as readonly number[]).includes(i)} pieza={(i) => pieza(i)} />
          {P.nyFicha.map((n, j) => (
            <g key={n} clipPath={`url(#${uid}-ficha${j})`}><CapaVC lamina={l} uid={uid} nombre="Rutas" solo={(i) => i === n} /></g>
          ))}
        </g>
      </g>
      <CapaVC lamina={l} uid={uid} nombre="Encabezado" />
      <CapaVC lamina={l} uid={uid} nombre="Leyenda" solo={(i) => i !== 5} />
      <CapaVC lamina={l} uid={uid} nombre="Leyenda" solo={(i) => i === 5} opacity={p.leyenda} />
    </svg>
  );
};
