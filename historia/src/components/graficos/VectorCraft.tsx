import { useEffect, useId, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import { getLength, getPointAtLength } from '@remotion/paths';
import { asienta, clamp, mix, tramo } from '../../direction/anim';
import { delVideo } from '../../estilo/recursos';

type Lamina = {defs: string; layers: {name: string; parts: string[]}[]};
type Props = {
  videoId: string; archivo: string; modo: 'lima' | 'viaje' | 'regresion' | 'costo';
  t: number; beats: Record<string, number>; notas?: string[];
  /** Regresión: de dónde salen los puntos (la boca del fichero). Sin esto, aparecen en su lugar. */
  origen?: {x: number; y: number};
  /** Regresión → serie (0–1): los ejes del ejemplo viajan hasta los de la serie; los puntos simulados se retiran antes. */
  haciaSerie?: number;
  /** Costo: la tabla de donde salen las cifras, a la derecha del gráfico (cada fila se enciende con su punto). */
  tabla?: {titulo: string; columnas: [string, string]; etiquetas: string[]; valores: number[]};
};

/** Con tabla, el gráfico del costo se achica para dejarle una columna a la derecha. */
const COSTO_CON_TABLA = {s: 0.86, tx: 0, ty: 60};
/** Ejes del ejemplo de regresión (x0, y0, ancho, alto) y del gráfico del costo, en la lámina. */
const EJES_REGRESION = [760, 300, 1000, 540] as const, EJES_COSTO = [220, 330, 1430, 490] as const;
/** La recta de la lámina de regresión y el escalón de la pendiente (de x = 1100 a x = 1400). */
const RECTA = {x1: 760, y1: 743.624, x2: 1720, y2: 426.042};
const yRecta = (x: number) => RECTA.y1 + ((x - RECTA.x1) * (RECTA.y2 - RECTA.y1)) / (RECTA.x2 - RECTA.x1);
const PASO = {xa: 1100, xb: 1400};

/** SVG propio exportado por VectorCraft. Cada pieza conserva su vector y su tiempo de entrada.
 * No se acepta HTML remoto: los JSON se generan de los SVG revisados dentro de public/videos.
 */
export const VectorCraft: React.FC<Props> = ({videoId, archivo, modo, t, beats: b, notas, origen, haciaSerie = 0, tabla}) => {
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
  const PASO_DECADA = 3.4 / 18;
  // E10: los ejes del ejemplo viajan hasta los ejes de la serie (ya achicados para la tabla)
  const ejesHaciaSerie = (() => {
    const [rx, ry, rw, rh] = EJES_REGRESION, [cx0, cy0, cw, ch] = EJES_COSTO, c = COSTO_CON_TABLA;
    const sx = (c.s * cw) / rw, sy = (c.s * ch) / rh;
    const tx = c.tx + c.s * cx0 - rx * sx, ty = c.ty + c.s * cy0 - ry * sy;
    const kk = haciaSerie;
    return `translate(${mix(0, tx, kk)} ${mix(0, ty, kk)}) scale(${mix(1, sx, kk)} ${mix(1, sy, kk)})`;
  })();
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
      const sale = 1 - clamp(haciaSerie * 2.5); // el ejemplo se retira antes de que los ejes lleguen a la serie
      // los residuos y su explicación llegan juntos, después de que la recta se asentó; la cautela, con la pendiente
      if (name === 'Texto') return (1 - haciaSerie) * (i < 4 ? k('puntos') : i < 6 ? k('recta') : i < 9 ? k('recta', 0.8, 1.8) : k('pendiente', 0.8, 2.4));
      if (name === 'Gráfico') {
        if (i < 9) return k('puntos');
        if (i === 43) return k('puntos') * (1 - haciaSerie);
        if (i === 41) return k('recta', 0.3) * sale;
        if (i === 42) return k('recta', 0.8, 1.4) * sale;
        if ((i - 9) % 4 === 0) return sale; // residuos: se estiran con su trazo
        return tramo(t, T('caen') + (i - 10) * 0.13, 0.45, 'natural') * sale;
      }
    }
    if (modo === 'costo') {
      if (name === 'Datos_originales' && i > 0) return tramo(t, T('serie') + 1.3 + decadas[i] * (3.4 / 18), 0.22, 'natural');
      if (name === 'Ejes_y_banda' && i === 1) return k('serie', 0.7, 5.6);
      if (name === 'Lectura' && (i === 3 || i === 4)) return k('serie', 0.7, 4.7);
      return k('serie', 0.6);
    }
    return 1;
  };
  return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs dangerouslySetInnerHTML={{__html: namespaced(data.defs)}} />
    <defs>
      {/* la banda del promedio se extiende de izquierda a derecha, después de la serie */}
      <clipPath id={`${uid}-banda`}><rect x={0} y={0} width={220 + 1560 * tramo(t, T('serie') + 4.7, 1.3, 'solemne')} height={1080}/></clipPath>
      <clipPath id={`${uid}-mapa`}><rect x={0} y={235} width={1920} height={735}/></clipPath>
    </defs>
    {data.layers.map(l => <g key={l.name} transform={modo === 'costo' && tabla && l.name !== 'Pizarra_verde' ? `translate(${COSTO_CON_TABLA.tx} ${COSTO_CON_TABLA.ty}) scale(${COSTO_CON_TABLA.s})` : undefined}><g clipPath={modo === 'viaje' && ['Cartografía', 'Rutas'].includes(l.name) ? `url(#${uid}-mapa)` : undefined}>
      <g transform={modo === 'viaje' && ['Cartografía', 'Rutas'].includes(l.name) ? `translate(${960 - scale * cx} ${540 - scale * cy}) scale(${scale})`
        : modo === 'regresion' && l.name === 'Gráfico' && haciaSerie > 0 ? ejesHaciaSerie : undefined}>
      {l.parts.map((part, i) => {
        let html = namespaced(part);
        if (modo === 'viaje' && l.name === 'Rutas' && i === 0) html = html.replace('<path ', `<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - viaje}" `);
        if (modo === 'regresion' && l.name === 'Gráfico' && i === 41) {
          // E08: la recta busca su pendiente: entra torcida, gira hasta la que mejor pasa y se asienta
          const busca = tramo(t, T('recta'), 1.6, 'pesado');
          const giro = -16 * (1 - busca) + asienta(t, T('recta') + 1.6, 2.2, 9, 3.5);
          const mx = (RECTA.x1 + RECTA.x2) / 2, my = (RECTA.y1 + RECTA.y2) / 2;
          return <g key={i} opacity={opacity(l.name, i)} transform={`rotate(${giro.toFixed(2)} ${mx} ${my})`} dangerouslySetInnerHTML={{__html: html}} />;
        }
        if (modo === 'regresion' && l.name === 'Gráfico' && i >= 9 && i < 41 && (i - 9) % 4 === 0) {
          // los residuos se estiran desde cada punto hasta la recta, uno tras otro
          const kr = tramo(t, T('recta') + 1.8 + ((i - 9) / 4) * 0.12, 0.45, 'natural');
          if (kr <= 0) return null;
          html = html.replace('<line ', `<line pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - kr).toFixed(4)}" `);
        }
        if (modo === 'costo' && l.name === 'Datos_originales' && i === 0) {
          // E12: la línea une puntos ya encendidos: llega a cada punto cuando ese punto se enciende
          const pts = (part.match(/points="([^"]+)"/)?.[1] ?? '').trim().split(/\s+/).map((q) => q.split(',').map(Number));
          const avance = (t - (T('serie') + 1.3)) / PASO_DECADA;
          if (avance <= 0 || pts.length < 2) return null;
          const n = Math.min(pts.length - 1, Math.floor(avance)), f = Math.min(1, avance - n);
          const visibles = pts.slice(0, n + 1);
          if (n < pts.length - 1) visibles.push([mix(pts[n][0], pts[n + 1][0], f), mix(pts[n][1], pts[n + 1][1], f)]);
          html = html.replace(/points="[^"]+"/, `points="${visibles.map((q) => q.join(',')).join(' ')}"`);
          return <g key={i} dangerouslySetInnerHTML={{__html: html}} />;
        }
        if (modo === 'costo' && l.name === 'Datos_originales' && i > 0 && /^<circle\b/.test(part)) {
          // cada punto late al encenderse (foco), como pide el ojo
          const td = T('serie') + 1.3 + decadas[i] * PASO_DECADA;
          const cx = Number(part.match(/\bcx="([\d.]+)"/)?.[1] ?? 0), cy = Number(part.match(/\bcy="([\d.]+)"/)?.[1] ?? 0);
          const late = t < td ? 0 : Math.exp(-(t - td) * 5) * 0.9;
          return <g key={i} opacity={opacity(l.name, i)} transform={`translate(${cx} ${cy}) scale(${(1 + late).toFixed(3)}) translate(${-cx} ${-cy})`} dangerouslySetInnerHTML={{__html: html}} />;
        }
        // cada observación sale del fichero y viaja en arco hasta su lugar (el dato viene de un documento)
        if (origen && modo === 'regresion' && l.name === 'Gráfico' && i >= 10 && i < 41 && (i - 9) % 4 !== 0) {
          const cx = Number(part.match(/\bcx="([\d.]+)"/)?.[1] ?? 0), cy = Number(part.match(/\bcy="([\d.]+)"/)?.[1] ?? 0);
          const kv = tramo(t, T('caen') + (i - 10) * 0.13, 0.6, 'natural');
          if (kv <= 0) return null;
          const dx = (1 - kv) * (origen.x - cx), dy = (1 - kv) * (origen.y - cy) - Math.sin(Math.PI * kv) * 120;
          return <g key={i} opacity={1 - clamp(haciaSerie * 2.5)} transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`} dangerouslySetInnerHTML={{__html: html}} />;
        }
        return <g key={i} opacity={opacity(l.name, i)} clipPath={modo === 'costo' && ((l.name === 'Ejes_y_banda' && i === 0) || (l.name === 'Lectura' && (i === 3 || i === 4))) ? `url(#${uid}-banda)` : undefined} dangerouslySetInnerHTML={{__html: html}} />;
      })}
    </g></g></g>)}
    {modo === 'regresion' && T('pendiente', Infinity) < Infinity ? (() => {
      // E09: «y dice cuánto pesa»: el escalón de la pendiente sobre la recta, un paso hacia la derecha y lo que sube
      const ya = yRecta(PASO.xa), yb = yRecta(PASO.xb);
      const h = tramo(t, T('pendiente'), 0.6, 'natural'), v = tramo(t, T('pendiente') + 0.6, 0.6, 'natural');
      const fuera = 1 - clamp(haciaSerie * 2.5);
      if (h <= 0 || fuera <= 0) return null;
      return <g opacity={fuera} fontFamily="serif" fontStyle="italic" fontSize={26}>
        <line x1={PASO.xa} y1={ya} x2={mix(PASO.xa, PASO.xb, h)} y2={ya} stroke="#e8dabc" strokeWidth={2.5} strokeDasharray="8 6" />
        {v > 0 ? <line x1={PASO.xb} y1={ya} x2={PASO.xb} y2={mix(ya, yb, v)} stroke="#d08a70" strokeWidth={4} strokeLinecap="round" /> : null}
        <text x={(PASO.xa + PASO.xb) / 2} y={ya + 34} textAnchor="middle" fill="#e8dabc" opacity={h}>un paso</text>
        <text x={PASO.xb + 16} y={(ya + yb) / 2 + 8} fill="#e6a58c" opacity={v}>cuánto sube</text>
      </g>;
    })() : null}
    {modo === 'costo' && tabla ? (() => {
      // E11: de dónde sale cada cifra: la fila de los cuadros se enciende, se subraya y un hilo la une a su punto
      const X = 1560, Y0 = 262, FILA = 30, s = COSTO_CON_TABLA;
      const aparece = k('serie', 0.6, 0.4);
      const n = tabla.valores.length;
      return <g opacity={aparece} fontFamily="monospace">
        <text x={X} y={Y0} fill="#e8dabc" fontSize={17} letterSpacing={2}>{tabla.titulo}</text>
        <text x={X} y={Y0 + 30} fill="#aab39a" fontSize={14} letterSpacing={2}>{tabla.columnas[0]}</text>
        <text x={X + 300} y={Y0 + 30} fill="#aab39a" fontSize={14} letterSpacing={2} textAnchor="end">{tabla.columnas[1]}</text>
        {tabla.valores.map((v, j) => {
          const td = T('serie') + 1.3 + j * PASO_DECADA;
          const on = tramo(t, td - 0.05, 0.15, 'natural');
          const y = Y0 + 62 + j * FILA;
          const px = s.tx + s.s * (EJES_COSTO[0] + (j * EJES_COSTO[2]) / (n - 1)), py = s.ty + s.s * (820 - 70 * v);
          const hilo = t < td ? 0 : clamp((t - td) / 0.12) * (1 - tramo(t, td + 0.5, 0.5, 'natural'));
          return <g key={j}>
            <text x={X} y={y} fill="#e8dabc" fontSize={20} opacity={0.35 + 0.65 * on}>{tabla.etiquetas[j]}</text>
            <text x={X + 300} y={y} fill="#f3d692" fontSize={20} textAnchor="end" opacity={0.35 + 0.65 * on}>{v.toFixed(1).replace('.', ',')}</text>
            <line x1={X} x2={X + 300 * on} y1={y + 7} y2={y + 7} stroke="#d08a70" strokeWidth={1.5} opacity={0.8 * on} />
            {hilo > 0 ? <line x1={X - 10} y1={y - 6} x2={px} y2={py} stroke="#f3d692" strokeWidth={1.2} strokeDasharray="4 5" opacity={0.7 * hilo} /> : null}
          </g>;
        })}
      </g>;
    })() : null}
    {modo === 'viaje' && notas?.length ? <g opacity={k('paris_notas') * (1 - k('duda'))}>
      <rect x={1000} y={400} width={740} height={170} fill="#1b2b22" opacity={0.95}/>
      {notas.map((nota, i) => <text key={i} x={1030} y={440 + i * 46} fill="#e8dabc" fontFamily="serif" fontSize={25}>{nota}</text>)}
    </g> : null}
    {modo === 'lima' && notas?.length ? <g opacity={k('lugar', 0.8, 1.5)}>
      {notas.map((nota, i) => <text key={i} x={155} y={900 + i * 32} fill="#c6cdb3" fontFamily="serif" fontSize={22}>{nota}</text>)}
    </g> : null}
  </svg>;
};

