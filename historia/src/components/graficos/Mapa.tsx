import { getLength, getPointAtLength } from '@remotion/paths';
import { geoGraticule, geoNaturalEarth1, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiLineString, MultiPolygon } from 'geojson';
import { useMemo } from 'react';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import paises from 'world-atlas/countries-110m.json';
import tierra110 from 'world-atlas/land-110m.json';
import tierra50 from 'world-atlas/land-50m.json';
import { clamp } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { RosaDeLosVientos } from './RosaDeLosVientos';

export type Lugar = { nombre: string; lon: number; lat: number };

type Props = {
  paleta: Paleta;
  id: string;
  origen: Lugar;
  destinos: Lugar[];
  /** Avance de cada ruta (0–1), en el orden de `destinos`. */
  rutas: number[];
  /** Llegada de cada ruta (0–1, con rebote): enciende el sello y el nombre. */
  llegadas: number[];
  /** Encuadre en grados: [oeste, sur, este, norte]. */
  encuadre?: [number, number, number, number];
  /** Aparición del mapa base (0–1). */
  aparece?: number;
};

// Mapa base: Natural Earth (dominio público), costas a 1:50 millones y fronteras a 1:110 millones.
const topoTierra = tierra50 as unknown as Topology<{ land: GeometryCollection }>;
const topoTierraSimple = tierra110 as unknown as Topology<{ land: GeometryCollection }>;
const topoPaises = paises as unknown as Topology<{ countries: GeometryCollection }>;
const TIERRA = feature(topoTierra, topoTierra.objects.land) as unknown as FeatureCollection<MultiPolygon>;
// Para el halo de las costas basta la versión simple (es borroso) y es mucho más rápido de dibujar.
const TIERRA_SIMPLE = feature(topoTierraSimple, topoTierraSimple.objects.land) as unknown as FeatureCollection<MultiPolygon>;
const FRONTERAS = mesh(topoPaises, topoPaises.objects.countries, (a, b) => a !== b) as unknown as MultiLineString;

/** Arco de A a B levantado hacia el norte (una ruta, no una línea recta). */
const arco = (a: [number, number], b: [number, number]): string => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${(mx - d * 0.12).toFixed(1)} ${(my - d * 0.28).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
};

/**
 * Mapa con aire de carta grabada: mar rayado, retícula de meridianos y paralelos, costas con
 * resplandor, fronteras punteadas y rosa de los vientos. Las rutas salen del origen con una
 * cabeza luminosa y al llegar encienden un sello de lacre con el nombre del lugar.
 */
export const Mapa: React.FC<Props> = ({ paleta, id, origen, destinos, rutas, llegadas, encuadre = [-125, -45, 30, 62], aparece = 1 }) => {
  const geo = useMemo(() => {
    const [o, s, e, n] = encuadre;
    const proyeccion = geoNaturalEarth1().fitExtent([[40, 60], [1880, 1040]], {
      type: 'MultiPoint', coordinates: [[o, s], [e, n], [o, n], [e, s]],
    });
    const camino = geoPath(proyeccion);
    const xy = (l: Lugar): [number, number] => proyeccion([l.lon, l.lat]) ?? [0, 0];
    const lima = xy(origen);
    const puntos = destinos.map(xy);
    const arcos = puntos.map((p) => { const d = arco(lima, p); return { d, largo: getLength(d) }; });
    // Nombres sin pisarse: los que están juntos (Europa) se escalonan hacia abajo.
    const etiquetas = puntos.map((p, i) => ({ i, p, izquierda: destinos[i].lon < origen.lon + 30 }));
    const ordenadas = [...etiquetas].filter((e) => !e.izquierda).sort((a, b) => a.p[1] - b.p[1]);
    const yEtiqueta: number[] = puntos.map((p) => p[1]);
    let ultima = -Infinity;
    for (const e of ordenadas) { yEtiqueta[e.i] = Math.max(e.p[1] - 4, ultima + 38); ultima = yEtiqueta[e.i]; }
    const xDerecha = Math.max(...ordenadas.map((e) => e.p[0]), 0) + 44;
    return {
      tierra: camino(TIERRA) ?? '',
      tierraSimple: camino(TIERRA_SIMPLE) ?? '',
      fronteras: camino(FRONTERAS) ?? '',
      reticula: camino(geoGraticule().step([15, 15])()) ?? '',
      ecuador: camino({ type: 'LineString', coordinates: Array.from({ length: 73 }, (_, k) => [-180 + k * 5, 0]) }) ?? '',
      lima, puntos, arcos, etiquetas, yEtiqueta, xDerecha,
    };
  }, [origen, destinos, encuadre]);
  const tierraColor = mezclar(paleta.fondo, paleta.ocre, 0.07);

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id={`${id}-mar`} width={1920} height={6} patternUnits="userSpaceOnUse">
          <line x1={0} x2={1920} y1={3} y2={3} stroke={paleta.ocre} strokeWidth={0.6} opacity={0.12} />
        </pattern>
        <radialGradient id={`${id}-cometa`}>
          <stop offset="0" stopColor={paleta.papel} stopOpacity={1} />
          <stop offset="0.3" stopColor={paleta.papel} stopOpacity={0.55} />
          <stop offset="1" stopColor={paleta.ocre} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-lacre`} cx="35%" cy="30%">
          <stop offset="0" stopColor={mezclar(paleta.rojo, paleta.papel, 0.35)} />
          <stop offset="0.6" stopColor={paleta.rojo} />
          <stop offset="1" stopColor={mezclar(paleta.rojo, '#000000', 0.5)} />
        </radialGradient>
        <filter id={`${id}-brillo`}><feGaussianBlur stdDeviation={3} /></filter>
      </defs>

      <g opacity={aparece}>
        <rect width={1920} height={1080} fill={`url(#${id}-mar)`} />
        <path d={geo.reticula} fill="none" stroke={paleta.ocre} strokeWidth={0.8} strokeDasharray="2 6" opacity={0.28} />
        <path d={geo.ecuador} fill="none" stroke={paleta.ocre} strokeWidth={1} strokeDasharray="10 6" opacity={0.3} />
        <path d={geo.tierra} fill={tierraColor} />
        <path d={geo.tierraSimple} fill="none" stroke={paleta.ocre} strokeWidth={6} opacity={0.08} />
        <path d={geo.tierra} fill="none" stroke={paleta.ocre} strokeWidth={1.3} opacity={0.75} />
        <path d={geo.fronteras} fill="none" stroke={paleta.ocre} strokeWidth={0.7} strokeDasharray="3 4" opacity={0.3} />
        <RosaDeLosVientos x={190} y={880} radio={92} paleta={paleta} />
      </g>

      {/* rutas */}
      {geo.arcos.map((a, i) => {
        const k = clamp(rutas[i] ?? 0);
        if (k <= 0) return null;
        const cabeza = getPointAtLength(a.d, a.largo * k) ?? { x: 0, y: 0 };
        return (
          <g key={i}>
            <path d={a.d} pathLength={1} fill="none" stroke={paleta.papel} strokeWidth={7} strokeDasharray={1} strokeDashoffset={1 - k} opacity={0.1} filter={`url(#${id}-brillo)`} />
            <path d={a.d} pathLength={1} fill="none" stroke={paleta.papel} strokeWidth={2.2} strokeDasharray={1} strokeDashoffset={1 - k} opacity={0.85} />
            {k < 1 ? <circle cx={cabeza.x} cy={cabeza.y} r={16} fill={`url(#${id}-cometa)`} /> : null}
          </g>
        );
      })}

      {/* origen */}
      <g opacity={aparece}>
        <circle cx={geo.lima[0]} cy={geo.lima[1]} r={8} fill={paleta.papel} />
        <circle cx={geo.lima[0]} cy={geo.lima[1]} r={14} fill="none" stroke={paleta.papel} strokeWidth={1.2} opacity={0.6} />
        <text x={geo.lima[0] + 22} y={geo.lima[1] + 10} fill={paleta.papel} fontFamily={fuente.imprentaItalica} fontSize={34}>{origen.nombre}</text>
      </g>

      {/* destinos: sello de lacre y nombre */}
      {geo.etiquetas.map(({ i, p, izquierda }) => {
        const l = clamp(llegadas[i] ?? 0, 0, 1.4);
        if (l <= 0) return null;
        const yl = geo.yEtiqueta[i];
        const xl = izquierda ? p[0] - 28 : geo.xDerecha;
        return (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={10 + 30 * Math.min(1, l)} fill="none" stroke={paleta.rojo} strokeWidth={2} opacity={Math.max(0, 1 - l) * 0.9} />
            <circle cx={p[0]} cy={p[1]} r={11 * l} fill={`url(#${id}-lacre)`} />
            <circle cx={p[0]} cy={p[1]} r={6 * l} fill="none" stroke={mezclar(paleta.rojo, '#000000', 0.4)} strokeWidth={1.2} />
            {!izquierda ? <line x1={p[0] + 12} y1={p[1]} x2={xl - 8} y2={yl - 9} stroke={paleta.papel} strokeWidth={0.9} opacity={0.55 * Math.min(1, l)} /> : null}
            <text x={xl} y={yl} textAnchor={izquierda ? 'end' : 'start'} fill={paleta.papel} fontFamily={fuente.imprentaItalica} fontSize={32}
              opacity={Math.min(1, l)}>{destinos[i].nombre}</text>
          </g>
        );
      })}
    </svg>
  );
};
