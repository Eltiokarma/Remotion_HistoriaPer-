import { geoNaturalEarth1, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiPolygon } from 'geojson';
import { Fragment } from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land from 'world-atlas/land-110m.json';
import { beat, mix, tramo } from '../../direction/anim';
import { Sfx } from '../../components/Sfx';
import { fuente } from '../../fonts';
import { texto, type EscenaProps } from './comun';

type Lugar = { nombre: string; lon: number; lat: number };

// Mapa: Natural Earth (dominio público), encuadrado entre las Américas y Europa.
const topo = land as unknown as Topology<{ land: GeometryCollection }>;
const tierra = feature(topo, topo.objects.land) as unknown as FeatureCollection<MultiPolygon>;
const proyeccion = geoNaturalEarth1().fitExtent([[40, 60], [1880, 1040]], {
  type: 'MultiPoint', coordinates: [[-125, -45], [30, 62], [-125, 62], [30, -45]],
});
const camino = geoPath(proyeccion);
const TIERRA_D = camino(tierra) ?? '';
const xy = (l: Lugar): [number, number] => proyeccion([l.lon, l.lat]) ?? [0, 0];

/** Arco curvo de A a B, levantado hacia el norte. */
const arco = (a: [number, number], b: [number, number]): string => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return `M${a[0]} ${a[1]} Q ${mx - d * 0.12} ${my - d * 0.28} ${b[0]} ${b[1]}`;
};

export const S04Pregunta: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const b = escena.beats;
  const origen = escena.origen as Lugar;
  const archivos = escena.archivos as Lugar[];
  const tArcos = beat(b, 'arcos', 1), PASO = beat(b, 'paso', 1.9), DUR_ARCO = Math.min(1.3, PASO + 0.2);
  const tApagar = beat(b, 'apagar', 12);
  const apagado = tramo(t, tApagar, 0.8, 'solemne');
  const tPregunta = beat(b, 'pregunta', 12.6), tBarra = beat(b, 'barra', 17);
  const tMitad = beat(b, 'mitad', tBarra + 2);
  // La pregunta aparece cuando la voz la hace, se va mientras se viaja por los archivos
  // y vuelve sola, en el silencio, cuando el mapa se apaga.
  const pregunta = Math.max(
    tramo(t, tPregunta, 1.0, 'solemne') * (1 - tramo(t, tArcos - 0.2, 0.6, 'natural')),
    tramo(t, tApagar + 0.3, 1.2, 'solemne'),
  ) * mix(1, 0.4, tramo(t, tBarra, 0.8, 'natural'));
  const lima = xy(origen);
  const mapaOp = mix(1, 0.1, apagado);

  return (
    <AbsoluteFill style={{ backgroundColor: paleta.fondo }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', opacity: mapaOp }}>
        <path d={TIERRA_D} fill="none" stroke={paleta.ocre} strokeWidth={1.3} opacity={0.6 * tramo(t, 0, 1, 'natural')} />
        {archivos.map((a, i) => {
          const t0 = tArcos + i * PASO;
          const k = tramo(t, t0, DUR_ARCO, 'natural');
          const p = xy(a);
          const llega = t >= t0 + DUR_ARCO ? spring({ frame: frame - (t0 + DUR_ARCO) * fps, fps, config: { damping: 11, mass: 0.5 } }) : 0;
          return (
            <g key={a.nombre}>
              <path d={arco(lima, p)} pathLength={1} fill="none" stroke={paleta.papel} strokeWidth={2.5}
                strokeDasharray={1} strokeDashoffset={1 - k} opacity={k > 0 ? 0.85 : 0} />
              <circle cx={p[0]} cy={p[1]} r={9 * llega} fill={paleta.rojo} />
              <circle cx={p[0]} cy={p[1]} r={9 + 26 * llega} fill="none" stroke={paleta.rojo} strokeWidth={2} opacity={(1 - llega) * 0.8} />
              <text x={p[0] + (a.nombre === 'Washington' ? -20 : 16)} y={p[1] - 16} textAnchor={a.nombre === 'Washington' ? 'end' : 'start'}
                fill={paleta.papel} fontFamily={fuente.mono} fontSize={26} opacity={llega}>{a.nombre}</text>
            </g>
          );
        })}
        <circle cx={lima[0]} cy={lima[1]} r={11} fill={paleta.papel} opacity={tramo(t, 0.4, 0.5, 'ligero')} />
        <text x={lima[0] + 18} y={lima[1] + 8} fill={paleta.papel} fontFamily={fuente.mono} fontSize={26}
          opacity={tramo(t, 0.6, 0.5, 'natural')}>{origen.nombre}</text>
      </svg>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 170 }}>
        <div style={{ fontFamily: fuente.titulo, fontStyle: 'italic', fontWeight: 400, fontSize: 104, color: paleta.papel,
          opacity: pregunta, transform: `translateY(${(1 - pregunta) * 14}px)` }}>
          {texto(escena, 'pregunta')}
        </div>
      </AbsoluteFill>

      {archivos.map((_, i) => (
        <Fragment key={i}>
          <Sfx src="audio/sfx/soplo.mp3" en={tArcos + i * PASO} fps={fps} volumen={0.3} />
          <Sfx src="audio/sfx/campana.mp3" en={tArcos + i * PASO + DUR_ARCO} fps={fps} volumen={0.22} />
        </Fragment>
      ))}
      {/* el golpe cae justo cuando la barra se detiene en la mitad */}
      <Sfx src="audio/sfx/golpe.mp3" en={tMitad} fps={fps} volumen={0.85} />
      {/* La mitad: una barra que se llena y se detiene a medio camino */}
      <div style={{ position: 'absolute', left: 460, top: 640, width: 1000, opacity: tramo(t, tBarra - 0.3, 0.5, 'natural') }}>
        <div style={{ height: 40, border: `2px solid ${paleta.papel}`, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${50 * tramo(t, tBarra + 0.4, Math.max(0.8, tMitad - tBarra - 0.4), 'pesado')}%`, background: paleta.rojo }} />
          <div style={{ position: 'absolute', left: '50%', top: -14, bottom: -14, width: 2, background: paleta.papel, opacity: 0.6 }} />
        </div>
        <div style={{ marginTop: 26, textAlign: 'center', fontFamily: fuente.mono, fontSize: 36, color: paleta.ocre,
          opacity: tramo(t, tMitad + 0.5, 0.8, 'natural') }}>
          {texto(escena, 'barra')}
        </div>
      </div>
    </AbsoluteFill>
  );
};
