import { useEffect, useId, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import { getLength, getPointAtLength } from '@remotion/paths';
import { clamp, mix, tramo } from '../../direction/anim';
import { delVideo } from '../../estilo/recursos';

type Lamina = {defs: string; layers: {name: string; parts: string[]}[]};
type Props = {
  videoId: string; archivo: string; modo: 'lima' | 'viaje' | 'regresion' | 'costo';
  t: number; beats: Record<string, number>; notas?: string[];
  /** Regresión: de dónde salen los puntos (la boca del fichero). Sin esto, aparecen en su lugar. */
  origen?: {x: number; y: number};
};

/** SVG propio exportado por VectorCraft. Cada pieza conserva su vector y su tiempo de entrada.
 * No se acepta HTML remoto: los JSON se generan de los SVG revisados dentro de public/videos.
 */
export const VectorCraft: React.FC<Props> = ({videoId, archivo, modo, t, beats: b, notas, origen}) => {
  const [data, setData] = useState<Lamina | null>(null);
  const [handle] = useState(() => delayRender(`VectorCraft: ${archivo}`));
  const uid = useId().replace(/:/g, '');
  useEffect(() => {
    let active = true;
    fetch(delVideo(videoId, archivo)).then(r => {
      if (!r.ok) throw new Error(`No se pudo cargar ${archivo}: ${r.status}`);
      return r.json() as Promise<Lamina>;
    }).then(d => { if (active) setData(d); continueRender(handle); }).catch(cancelRender);
    return () => { active = false; };
  }, [videoId, archivo, handle]);
  if (!data) return null;
  const T = (name: string, fallback = 0) => b[name] ?? fallback;
  const k = (name: string, duration = 0.8, offset = 0) => tramo(t, T(name) + offset, duration, 'natural');
  const viaje = tramo(t, T('sale'), T('llega') - T('sale'), 'solemne');
  const d = data.layers.find(l => l.name === 'Rutas')?.parts[0]?.match(/\bd="([^"]+)"/)?.[1];
  const punta = (d ? getPointAtLength(d, getLength(d) * viaje) : null) ?? {x: 960, y: 540};
  const zoom = modo === 'viaje' ? 0.3 * tramo(t, T('sale') - 0.3, 1, 'pesado') * (1 - tramo(t, T('abre'), 1.5, 'solemne')) : 0;
  const scale = 1 + zoom;
  // El mapa exportado tiene un encuadre finito: mantener margen alrededor de la ruta.
  const cx = mix(960, Math.max(800, Math.min(1120, punta.x)), clamp(zoom / 0.3));
  const cy = mix(540, Math.max(480, Math.min(600, punta.y)), clamp(zoom / 0.3));
  const namespaced = (html: string) => html.replace(/\bid="([^"]+)"/g, `id="${uid}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`);
  // Una década tiene marca, punto, valor y, a veces, año. El número de piezas
  // varía: agrupar por la marca evita adelantar una cifra al punto anterior.
  let decada = -1;
  const decadas = data.layers.find(l => l.name === 'Datos_originales')?.parts.map((part, i) => {
    if (i > 0 && /^<line\b/.test(part)) decada++;
    return decada;
  }) ?? [];
  const opacity = (name: string, i: number) => {
    if (name === 'Pizarra_verde') return 1;
    if (modo === 'lima') {
      if (name === 'Relieve_ilustrado') return tramo(t, T('lugar') + 0.7 + Math.min(i, 60) * 0.012, 0.5, 'natural');
      return k('lugar', 0.8);
    }
    if (modo === 'viaje') {
      if (name === 'Rutas') {
        if (i >= 1 && i <= 28) return tramo(t, T('paris') + (i - 1) * 1.8 / 28, 0.2, 'natural') * (1 - 0.72 * k('duda', 0.8));
        if ([33, 34, 38, 39].includes(i)) return k('paris') * (1 - 0.5 * k('duda'));
        if ([31, 32, 35, 36, 37].includes(i)) return k('llega', 0.6);
      }
      if (name === 'Leyenda' && i === 5) return k('ficha');
      return k('mapa', 1);
    }
    if (modo === 'regresion') {
      if (name === 'Texto') return k(i < 4 ? 'puntos' : i < 6 ? 'recta' : 'pendiente');
      if (name === 'Gráfico') {
        if (i < 9) return k('puntos');
        if (i === 43) return k('puntos');
        if (i >= 41) return k('recta', 1.4);
        // Every fourth object is a residual; the other pieces are observations.
        if ((i - 9) % 4 === 0) return k('pendiente');
        return tramo(t, T('caen') + (i - 10) * 0.13, 0.45, 'natural');
      }
    }
    if (modo === 'costo') {
      if (name === 'Datos_originales' && i > 0) return tramo(t, T('serie') + 1.3 + decadas[i] * (3.4 / 18), 0.22, 'natural');
      if (name === 'Ejes_y_banda' && i < 2) return k('serie', 0.7, 4.7);
      if (name === 'Lectura' && (i === 3 || i === 4)) return k('serie', 0.7, 4.7);
      return k('serie', 0.6);
    }
    return 1;
  };
  return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs dangerouslySetInnerHTML={{__html: namespaced(data.defs)}} />
    <defs>
      <clipPath id={`${uid}-serie`}><rect x={0} y={0} width={220 + 1430 * tramo(t, T('serie') + 1.3, 3.4, 'solemne')} height={1080}/></clipPath>
      <clipPath id={`${uid}-mapa`}><rect x={0} y={235} width={1920} height={735}/></clipPath>
    </defs>
    {data.layers.map(l => <g key={l.name} clipPath={modo === 'viaje' && ['Cartografía', 'Rutas'].includes(l.name) ? `url(#${uid}-mapa)` : undefined}>
      <g transform={modo === 'viaje' && ['Cartografía', 'Rutas'].includes(l.name) ? `translate(${960 - scale * cx} ${540 - scale * cy}) scale(${scale})` : undefined}>
      {l.parts.map((part, i) => {
        let html = namespaced(part);
        if (modo === 'viaje' && l.name === 'Rutas' && i === 0) html = html.replace('<path ', `<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - viaje}" `);
        if (modo === 'regresion' && l.name === 'Gráfico' && i === 41) html = html.replace('<line ', `<line pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - k('recta', 1.4)}" `);
        // cada observación sale del fichero y viaja en arco hasta su lugar (el dato viene de un documento)
        if (origen && modo === 'regresion' && l.name === 'Gráfico' && i >= 10 && i < 41 && (i - 9) % 4 !== 0) {
          const cx = Number(part.match(/\bcx="([\d.]+)"/)?.[1] ?? 0), cy = Number(part.match(/\bcy="([\d.]+)"/)?.[1] ?? 0);
          const kv = tramo(t, T('caen') + (i - 10) * 0.13, 0.6, 'natural');
          if (kv <= 0) return null;
          const dx = (1 - kv) * (origen.x - cx), dy = (1 - kv) * (origen.y - cy) - Math.sin(Math.PI * kv) * 120;
          return <g key={i} transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`} dangerouslySetInnerHTML={{__html: html}} />;
        }
        return <g key={i} opacity={opacity(l.name, i)} clipPath={modo === 'costo' && l.name === 'Datos_originales' && i === 0 ? `url(#${uid}-serie)` : undefined} dangerouslySetInnerHTML={{__html: html}} />;
      })}
    </g></g>)}
    {modo === 'viaje' && notas?.length ? <g opacity={k('paris_notas') * (1 - k('duda'))}>
      <rect x={1000} y={400} width={740} height={170} fill="#1b2b22" opacity={0.95}/>
      {notas.map((nota, i) => <text key={i} x={1030} y={440 + i * 46} fill="#e8dabc" fontFamily="serif" fontSize={25}>{nota}</text>)}
    </g> : null}
    {modo === 'lima' && notas?.length ? <g opacity={k('lugar', 0.8, 1.5)}>
      {notas.map((nota, i) => <text key={i} x={155} y={900 + i * 32} fill="#c6cdb3" fontFamily="serif" fontSize={22}>{nota}</text>)}
    </g> : null}
  </svg>;
};

