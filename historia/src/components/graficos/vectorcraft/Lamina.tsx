import { useEffect, useId, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import { delVideo } from '../../../estilo/recursos';

/** Caja de una pieza en coordenadas de la lámina (1920 × 1080): x, y, ancho, alto. */
export type Caja = [number, number, number, number];
export type CapaLamina = { name: string; transform?: string; box: Caja; parts: string[]; boxes: Caja[] };
export type Lamina = { defs: string; layers: CapaLamina[] };

/** Referencia a una lámina aprobada desde escenas.json: el componente solo sabe su nombre. */
export type RefLamina = { videoId: string; archivo: string };

const cache = new Map<string, Promise<Lamina>>();
const cargar = (url: string) => {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar ${url}: ${r.status}`);
      return r.json() as Promise<Lamina>;
    });
    cache.set(url, p);
  }
  return p;
};

/**
 * Carga una lámina separada por `scripts/vectorcraft-piezas.mjs`. Remotion espera a que llegue
 * antes de capturar el cuadro. Devuelve null mientras tanto (o si no hay referencia).
 */
export const useLamina = (ref: RefLamina | undefined): Lamina | null => {
  const url = ref ? delVideo(ref.videoId, ref.archivo) : null;
  const [data, setData] = useState<Lamina | null>(null);
  const [handle] = useState(() => (url ? delayRender(`Lámina VectorCraft: ${url}`) : null));
  useEffect(() => {
    if (!url || handle === null) return;
    let activo = true;
    cargar(url).then((d) => { if (activo) setData(d); continueRender(handle); }).catch(cancelRender);
    return () => { activo = false; };
  }, [url, handle]);
  return data;
};

/** Ids únicos por instancia: dos láminas en pantalla no comparten degradados. */
export const usePrefijo = () => useId().replace(/[^a-zA-Z0-9_-]/g, '');

const conPrefijo = (html: string, uid: string) =>
  html
    .replace(/\bid="([^"]+)"/g, `id="${uid}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${uid}-$1"`);

/** Busca una capa por el comienzo de su nombre («Brazo_móvil» encuentra «Brazo_móvil___pivote_960_330»). */
export const capa = (l: Lamina, nombre: string): CapaLamina => {
  const c = l.layers.find((x) => x.name === nombre) ?? l.layers.find((x) => x.name.startsWith(nombre));
  if (!c) throw new Error(`La lámina no tiene la capa «${nombre}». Capas: ${l.layers.map((x) => x.name).join(', ')}`);
  return c;
};

/** Centro de la caja de una capa (o de una de sus piezas). */
export const centro = (b: Caja) => ({ x: b[0] + b[2] / 2, y: b[1] + b[3] / 2 });

export const DefsLamina: React.FC<{ lamina: Lamina; uid: string }> = ({ lamina, uid }) => (
  <defs dangerouslySetInnerHTML={{ __html: conPrefijo(lamina.defs, uid) }} />
);

type PropsCapa = {
  lamina: Lamina;
  uid: string;
  nombre: string;
  transform?: string;
  opacity?: number;
  /** Para animar piezas sueltas de la capa: transform y opacidad de la pieza i. */
  pieza?: (i: number, caja: Caja) => { transform?: string; opacity?: number } | undefined;
  /** Solo estas piezas (por índice). */
  solo?: (i: number) => boolean;
};

/** Una capa de la lámina, con su transformación original y la que le pone la escena encima. */
export const CapaVC: React.FC<PropsCapa> = ({ lamina, uid, nombre, transform, opacity, pieza, solo }) => {
  const c = capa(lamina, nombre);
  if (opacity !== undefined && opacity <= 0.001) return null;
  return (
    <g transform={transform} opacity={opacity}>
      <g transform={c.transform}>
        {c.parts.map((html, i) => {
          if (solo && !solo(i)) return null;
          const p = pieza?.(i, c.boxes[i]);
          if (p?.opacity !== undefined && p.opacity <= 0.001) return null;
          return <g key={i} transform={p?.transform} opacity={p?.opacity} dangerouslySetInnerHTML={{ __html: conPrefijo(html, uid) }} />;
        })}
      </g>
    </g>
  );
};

/** Varias capas seguidas con la misma transformación (lo que en la lámina se mueve junto). */
export const CapasVC: React.FC<{ lamina: Lamina; uid: string; nombres: string[]; transform?: string; opacity?: number }> = ({ lamina, uid, nombres, transform, opacity }) => {
  if (opacity !== undefined && opacity <= 0.001) return null;
  return (
    <g transform={transform} opacity={opacity}>
      {nombres.map((n) => <CapaVC key={n} lamina={lamina} uid={uid} nombre={n} />)}
    </g>
  );
};

/**
 * Un recorte de la lámina como objeto suelto (un emblema, un vale, un libro) para ponerlo dentro de
 * la escena con su propio tamaño: `caja` es el recuadro de la lámina que se muestra.
 */
export const RecorteLamina: React.FC<{
  lamina: Lamina; caja: Caja; ancho: number;
  capas: { nombre: string; solo?: (i: number) => boolean; transform?: string; opacity?: number }[];
  style?: React.CSSProperties;
}> = ({ lamina, caja, ancho, capas, style }) => {
  const uid = usePrefijo();
  return (
    <svg width={ancho} height={(ancho * caja[3]) / caja[2]} viewBox={caja.join(' ')} style={{ display: 'block', overflow: 'visible', ...style }}>
      <DefsLamina lamina={lamina} uid={uid} />
      {capas.map((c, i) => <CapaVC key={i} lamina={lamina} uid={uid} {...c} />)}
    </svg>
  );
};
