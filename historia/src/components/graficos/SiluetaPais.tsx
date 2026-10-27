import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import paises50 from 'world-atlas/countries-50m.json';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';

const topo = paises50 as unknown as Topology<{ countries: GeometryCollection }>;
const PAISES = feature(topo, topo.objects.countries) as unknown as FeatureCollection<MultiPolygon>;

type Props = {
  paleta: Paleta;
  id: string;
  /** Código numérico ISO 3166 del país (Perú = 604). */
  codigo: number;
  /** Caja donde se dibuja: [x, y, ancho, alto]. */
  caja: [number, number, number, number];
  /** 0–1: aparición del país real. */
  real: number;
  /** 0–1: aparición del fantasma (el país que pudo ser), más grande y punteado. */
  fantasma: number;
  /** Cuánto más grande es el fantasma. */
  escala?: number;
};

/** Silueta de un país (Natural Earth 1:50 M) y, detrás, su fantasma más grande en línea punteada. */
export const SiluetaPais: React.FC<Props> = ({ paleta, id, codigo, caja, real, fantasma, escala = 1.45 }) => {
  const g = useMemo(() => {
    const f = PAISES.features.find((p) => Number(p.id) === codigo) as Feature<MultiPolygon> | undefined;
    if (!f) return null;
    const [x, y, w, h] = caja;
    const pr = geoMercator().fitExtent([[x + w * 0.2, y + h * 0.2], [x + w * 0.8, y + h * 0.8]], f);
    const camino = geoPath(pr);
    const c = camino.centroid(f);
    return { d: camino(f) ?? '', c };
  }, [codigo, caja]);
  if (!g) return null;
  const k = 1 + (escala - 1) * fantasma;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id={`${id}-grabado`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1={0} y1={0} x2={0} y2={6} stroke={mezclar(paleta.fondo, paleta.ocre, 0.2)} strokeWidth={1} />
        </pattern>
      </defs>
      {fantasma > 0 ? (
        <g transform={`translate(${g.c[0]} ${g.c[1]}) scale(${k}) translate(${-g.c[0]} ${-g.c[1]})`} opacity={fantasma}>
          <path d={g.d} fill={alfa(paleta.papel, 0.05)} stroke={alfa(paleta.papel, 0.75)} strokeWidth={2.4 / k} strokeDasharray={`${8 / k} ${8 / k}`} />
        </g>
      ) : null}
      <g opacity={real}>
        <path d={g.d} fill={mezclar(paleta.ocre, paleta.fondo, 0.15)} />
        <path d={g.d} fill={`url(#${id}-grabado)`} opacity={0.5} />
        <path d={g.d} fill="none" stroke={paleta.papel} strokeWidth={2} />
      </g>
    </svg>
  );
};
