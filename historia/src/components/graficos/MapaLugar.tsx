import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import paises50 from 'world-atlas/countries-50m.json';
import { clamp } from '../../direction/anim';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

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
  /** Color del papel (el mar y la tierra se dibujan sobre él). */
  papel?: string;
  /** Nombre del lugar, junto al punto, cuando la cámara llega. */
  nombre?: string;
  /** Nombre del mar, en itálica, sobre el agua. */
  mar?: string;
  /**
   * La cordillera como en los mapas viejos: montañitas a lo largo de esta línea [lon, lat]
   * (aproximada: es dibujo, no un dato).
   */
  cordillera?: [number, number][];
};

/**
 * Una fecha lejana pesa más con un lugar (DIRECCION_DE_VIDEO §2.7): el país en grabado, con el mar
 * en líneas que siguen la costa, la cordillera en montañitas, los vecinos tenues, y la cámara que se
 * acerca a una ciudad marcada con un punto que late.
 */
export const MapaLugar: React.FC<Props> = ({ id, codigo, lon, lat, caja, zoom, acerca = 3.2, aparece, tinta, acento, papel = '#ede4d3', nombre, mar, cordillera }) => {
  const g = useMemo(() => {
    const pais = PAISES.features.find((p) => Number(p.id) === codigo) as Feature<MultiPolygon> | undefined;
    if (!pais) return null;
    const [x, y, w, h] = caja;
    const pr = geoMercator().fitExtent([[x, y], [x + w, y + h]], pais);
    const camino = geoPath(pr);
    // solo los vecinos que caen cerca de la caja (el resto del mundo no se dibuja)
    const vecinos = PAISES.features.filter((p) => Number(p.id) !== codigo).filter((p) => {
      const [[a, b], [c, d]] = camino.bounds(p);
      return c > x - w && a < x + 2 * w && d > y - h && b < y + 2 * h;
    }).map((p) => camino(p) ?? '').filter((d) => d.length > 0);
    const punto = pr([lon, lat]) ?? [x + w / 2, y + h / 2];
    // montañitas a lo largo de la cordillera: cada ~0,45°, alternando a un lado y al otro
    const montes: { x: number; y: number; s: number }[] = [];
    if (cordillera && cordillera.length > 1) {
      let n = 0;
      for (let i = 0; i < cordillera.length - 1; i++) {
        const [a, b] = cordillera[i], [c, d] = cordillera[i + 1];
        const largo = Math.hypot(c - a, d - b), pasos = Math.max(1, Math.round(largo / 0.62));
        const nx = -(d - b) / largo, ny = (c - a) / largo;
        for (let k = 0; k < pasos; k++, n++) {
          const u = k / pasos, lado = n % 2 === 0 ? 1 : -0.6;
          const q = pr([a + (c - a) * u + nx * 0.3 * lado, b + (d - b) * u + ny * 0.3 * lado]);
          if (q) montes.push({ x: q[0], y: q[1], s: 0.8 + ((n * 37) % 5) / 10 });
        }
      }
    }
    const centro = camino.centroid(pais);
    return { pais: camino(pais) ?? '', vecinos, punto, montes, centro };
  }, [codigo, caja, lon, lat, cordillera]);
  if (!g) return null;
  const z = clamp(zoom);
  const k = 1 + (acerca - 1) * z;
  const [px, py] = g.punto;
  // el lugar va hacia el centro de la caja mientras la cámara se acerca
  const cx = caja[0] + caja[2] / 2, cy = caja[1] + caja[3] / 2;
  const tx = (cx - px) * z, ty = (cy - py) * z;
  const tierra = [g.pais, ...g.vecinos];
  const agua = mezclar(papel, '#5d7f8c', 0.18);
  // líneas de agua: a qué distancia de la costa (px de pantalla) va cada una
  const LINEAS = [5, 10, 16, 24];
  // la lámina: el mapa va impreso en un recuadro, como un mapa de atlas pegado en la página
  const L = { x: caja[0] - 40, y: caja[1] - 30, w: caja[2] + 80, h: caja[3] + 60 };
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <clipPath id={`${id}-caja`}><rect x={L.x} y={L.y} width={L.w} height={L.h} /></clipPath>
        <pattern id={`${id}-rayado`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={5} stroke={tinta} strokeWidth={0.6} opacity={0.35} />
        </pattern>
        {LINEAS.map((d, i) => (
          <mask key={i} id={`${id}-linea${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
            {tierra.map((c, j) => <path key={j} d={c} fill="none" stroke="#fff" strokeWidth={(2 * d) / k} strokeLinejoin="round" />)}
            {tierra.map((c, j) => <path key={`n${j}`} d={c} fill="none" stroke="#000" strokeWidth={(2 * d - 1.3) / k} strokeLinejoin="round" />)}
          </mask>
        ))}
      </defs>
      <rect x={L.x + 8} y={L.y + 10} width={L.w} height={L.h} fill={alfa(tinta, 0.25)} style={{ filter: 'blur(10px)' }} />
      <rect x={L.x} y={L.y} width={L.w} height={L.h} fill={mezclar(papel, '#ffffff', 0.2)} />
      <g clipPath={`url(#${id}-caja)`}>
        {/* el mar: un tono de agua apenas */}
        <rect x={L.x} y={L.y} width={L.w} height={L.h} fill={agua} opacity={0.6} />
        <g transform={`translate(${tx} ${ty}) translate(${px} ${py}) scale(${k}) translate(${-px} ${-py})`}>
          {/* las líneas de agua que siguen la costa, cada vez más tenues */}
          {LINEAS.map((_, i) => (
            <rect key={i} x={caja[0] - 400} y={caja[1] - 400} width={caja[2] + 800} height={caja[3] + 800} fill={tinta} opacity={0.32 - i * 0.065} mask={`url(#${id}-linea${i})`} />
          ))}
          {/* la tierra: los vecinos tenues, el país con su sombra hacia el mar y su doble borde */}
          {g.vecinos.map((d, i) => <path key={i} d={d} fill={mezclar(papel, tinta, 0.05)} stroke={alfa(tinta, 0.28)} strokeWidth={1 / k} />)}
          <path d={g.pais} fill={alfa(tinta, 0.25)} transform={`translate(${2.5 / k} ${2.5 / k})`} />
          <path d={g.pais} fill={mezclar(papel, '#ffffff', 0.25)} />
          <path d={g.pais} fill={`url(#${id}-rayado)`} opacity={0.35} />
          <path d={g.pais} fill="none" stroke={alfa(tinta, 0.85)} strokeWidth={2.2 / k} strokeLinejoin="round" />
          <path d={g.pais} fill="none" stroke={alfa(acento, 0.35)} strokeWidth={5 / k} strokeLinejoin="round" opacity={0.6} />
          {/* la cordillera: montañitas con la ladera de la derecha sombreada */}
          {g.montes.map((m, i) => {
            const a = (7 * m.s) / Math.sqrt(k), h = (9 * m.s) / Math.sqrt(k);
            return (
              <g key={i}>
                <path d={`M${m.x} ${m.y - h} L${m.x + a} ${m.y} L${m.x} ${m.y} Z`} fill={alfa(tinta, 0.22)} />
                <path d={`M${m.x - a} ${m.y} L${m.x} ${m.y - h} L${m.x + a} ${m.y}`} fill="none" stroke={alfa(tinta, 0.55)} strokeWidth={1 / k} strokeLinejoin="round" />
              </g>
            );
          })}
          {/* el nombre del país, que se va al acercarse */}
          <text x={g.centro[0]} y={g.centro[1]} textAnchor="middle" fontFamily={fuente.imprenta} fontSize={22 / k} letterSpacing={8 / k} fill={alfa(tinta, 0.55)} opacity={1 - z}>PERÚ</text>
          {mar ? (
            <text x={caja[0] + caja[2] * 0.12} y={caja[1] + caja[3] * 0.62} fontFamily={fuente.libro} fontStyle="italic" fontSize={17 / k} fill={alfa(tinta, 0.55)}
              transform={`rotate(-62 ${caja[0] + caja[2] * 0.12} ${caja[1] + caja[3] * 0.62})`} opacity={1 - 0.6 * z}>{mar}</text>
          ) : null}
          {/* la ciudad: un círculo con su punto, como en los mapas viejos, y un pulso */}
          <circle cx={px} cy={py} r={(10 + 10 * z) / k} fill="none" stroke={alfa(acento, 0.6)} strokeWidth={2 / k} />
          <circle cx={px} cy={py} r={8 / k} fill={papel} stroke={tinta} strokeWidth={1.6 / k} />
          <circle cx={px} cy={py} r={4.5 / k} fill={acento} />
          {nombre ? (
            <text x={px - 14 / k} y={py + 5 / k} textAnchor="end" fontFamily={fuente.imprenta} fontSize={20 / k} letterSpacing={3 / k} fill={tinta} opacity={clamp(z * 2 - 0.6)}>{nombre}</text>
          ) : null}
        </g>
      </g>
      {/* el marco de la lámina, doble, y la flecha del norte */}
      <rect x={L.x + 8} y={L.y + 8} width={L.w - 16} height={L.h - 16} fill="none" stroke={alfa(tinta, 0.7)} strokeWidth={1.6} />
      <rect x={L.x + 13} y={L.y + 13} width={L.w - 26} height={L.h - 26} fill="none" stroke={alfa(tinta, 0.4)} strokeWidth={0.8} />
      <g transform={`translate(${L.x + L.w - 40} ${L.y + 44})`}>
        <path d="M0 -18 L6 6 L0 2 L-6 6 Z" fill={tinta} opacity={0.75} />
        <text x={0} y={22} textAnchor="middle" fontFamily={fuente.imprenta} fontSize={14} fill={alfa(tinta, 0.75)}>N</text>
      </g>
    </svg>
  );
};
