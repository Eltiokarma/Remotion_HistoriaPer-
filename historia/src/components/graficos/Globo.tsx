import { geoGraticule, geoOrthographic, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiPolygon } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import tierra110 from 'world-atlas/land-110m.json';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';

const topo = tierra110 as unknown as Topology<{ land: GeometryCollection }>;
const TIERRA = feature(topo, topo.objects.land) as unknown as FeatureCollection<MultiPolygon>;
const RETICULA = geoGraticule().step([20, 20])();

type Props = {
  paleta: Paleta;
  id: string;
  /** Longitud que mira al frente (gira con el tiempo). */
  lon: number;
  lat?: number;
  cx?: number;
  cy?: number;
  radio?: number;
  /** Puntos a marcar: devuelve dónde quedan en pantalla para que se les pueda unir una ficha. */
  marcas?: { lon: number; lat: number; k: number }[];
};

/** Proyecta un punto del globo a pantalla (null si está del otro lado). */
export const proyectarGlobo = (lon0: number, lat0: number, cx: number, cy: number, radio: number, lon: number, lat: number): [number, number] | null => {
  const pr = geoOrthographic().rotate([-lon0, -lat0]).translate([cx, cy]).scale(radio).clipAngle(90);
  const p = pr([lon, lat]);
  if (!p) return null;
  const visible = geoPath(pr)({ type: 'Point', coordinates: [lon, lat] });
  return visible ? (p as [number, number]) : null;
};

/** Globo terráqueo en grabado: océano con sombra esférica, retícula, tierras y halo. */
export const Globo: React.FC<Props> = ({ paleta, id, lon, lat = 18, cx = 960, cy = 560, radio = 380, marcas = [] }) => {
  const pr = geoOrthographic().rotate([-lon, -lat]).translate([cx, cy]).scale(radio).clipAngle(90);
  const camino = geoPath(pr);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id={`${id}-mar`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={mezclar(paleta.fondo, paleta.ocre, 0.22)} />
          <stop offset="0.7" stopColor={mezclar(paleta.fondo, paleta.ocre, 0.08)} />
          <stop offset="1" stopColor={mezclar(paleta.fondo, '#000000', 0.4)} />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0.86" stopColor={paleta.ocre} stopOpacity={0.25} />
          <stop offset="1" stopColor={paleta.ocre} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-luz`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radio * 1.12} fill={`url(#${id}-halo)`} />
      <circle cx={cx} cy={cy} r={radio} fill={`url(#${id}-mar)`} />
      <path d={camino(RETICULA) ?? ''} fill="none" stroke={alfa(paleta.ocre, 0.22)} strokeWidth={0.8} />
      <path d={camino(TIERRA) ?? ''} fill={mezclar(paleta.fondo, paleta.ocre, 0.35)} stroke={paleta.ocre} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={radio} fill={`url(#${id}-luz)`} />
      <circle cx={cx} cy={cy} r={radio} fill="none" stroke={paleta.ocre} strokeWidth={1.6} opacity={0.7} />
      {marcas.map((m, i) => {
        const p = proyectarGlobo(lon, lat, cx, cy, radio, m.lon, m.lat);
        if (!p || m.k <= 0) return null;
        return (
          <g key={i} opacity={Math.min(1, m.k)}>
            <circle cx={p[0]} cy={p[1]} r={8 + 26 * (1 - Math.min(1, m.k))} fill="none" stroke={paleta.rojo} strokeWidth={2} />
            <circle cx={p[0]} cy={p[1]} r={6} fill={paleta.rojo} />
          </g>
        );
      })}
    </svg>
  );
};
