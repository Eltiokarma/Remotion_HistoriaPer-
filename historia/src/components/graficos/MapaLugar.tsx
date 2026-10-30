import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import paises50 from 'world-atlas/countries-50m.json';
import { clamp } from '../../direction/anim';
import { alfa } from '../../estilo/color';

const topo = paises50 as unknown as Topology<{ countries: GeometryCollection }>;
const PAISES = feature(topo, topo.objects.countries) as unknown as FeatureCollection<MultiPolygon>;

type Props = {
  id: string;
  /** Código numérico ISO 3166 del país (Perú = 604). */
  codigo: number;
  /** El lugar al que se acerca la cámara. */
  lon: number;
  lat: number;
  /** Caja donde cabe el país entero al comienzo: [x, y, ancho, alto]. */
  caja: [number, number, number, number];
  /** 0–1: de ver el país entero a acercarse al lugar. */
  zoom: number;
  /** Cuánto se acerca al final. */
  acerca?: number;
  /** 0–1: aparición. */
  aparece: number;
  /** Color de la tinta. */
  tinta: string;
  /** Color del punto del lugar. */
  acento: string;
};

/**
 * Una fecha lejana pesa más con un lugar (DIRECCION_DE_VIDEO §2.7): el país dibujado en tinta, con
 * sus vecinos tenues, y la cámara que se acerca a una ciudad marcada con un punto que late.
 */
export const MapaLugar: React.FC<Props> = ({ id, codigo, lon, lat, caja, zoom, acerca = 3.2, aparece, tinta, acento }) => {
  const g = useMemo(() => {
    const pais = PAISES.features.find((p) => Number(p.id) === codigo) as Feature<MultiPolygon> | undefined;
    if (!pais) return null;
    const [x, y, w, h] = caja;
    const pr = geoMercator().fitExtent([[x, y], [x + w, y + h]], pais);
    const camino = geoPath(pr);
    const vecinos = PAISES.features.filter((p) => Number(p.id) !== codigo).map((p) => camino(p) ?? '').filter((d) => d.length > 0);
    const punto = pr([lon, lat]) ?? [x + w / 2, y + h / 2];
    return { pais: camino(pais) ?? '', vecinos, punto };
  }, [codigo, caja, lon, lat]);
  if (!g) return null;
  const k = 1 + (acerca - 1) * clamp(zoom);
  const [px, py] = g.punto;
  // el lugar va hacia el centro de la caja mientras la cámara se acerca
  const cx = caja[0] + caja[2] / 2, cy = caja[1] + caja[3] / 2;
  const tx = (cx - px) * clamp(zoom), ty = (cy - py) * clamp(zoom);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <clipPath id={`${id}-caja`}><rect x={caja[0] - 60} y={caja[1] - 40} width={caja[2] + 120} height={caja[3] + 80} rx={8} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-caja)`}>
        <g transform={`translate(${tx} ${ty}) translate(${px} ${py}) scale(${k}) translate(${-px} ${-py})`}>
          {g.vecinos.map((d, i) => <path key={i} d={d} fill="none" stroke={alfa(tinta, 0.18)} strokeWidth={1.2 / k} />)}
          <path d={g.pais} fill={alfa(tinta, 0.06)} stroke={alfa(tinta, 0.7)} strokeWidth={2 / k} />
          <circle cx={px} cy={py} r={(10 + 10 * clamp(zoom)) / k} fill="none" stroke={alfa(acento, 0.6)} strokeWidth={2 / k} />
          <circle cx={px} cy={py} r={6 / k} fill={acento} />
        </g>
      </g>
    </svg>
  );
};
