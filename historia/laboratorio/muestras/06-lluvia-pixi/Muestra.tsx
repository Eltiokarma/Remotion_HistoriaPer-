import {
  Application,
  BlurFilter,
  ColorMatrixFilter,
  Container,
  FillGradient,
  Graphics,
  Sprite,
  type Texture,
  type WebGLRenderer,
} from 'pixi.js';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { clamp, mix, tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { DURACION, PALETA } from '../../remotion/comun';
import { perfil } from '../02-cordillera-tinta/Muestra';

/**
 * Muestra 06 · Tormenta sobre el lago, con miles de gotas y filtros (PixiJS). Versión 2.
 *
 * La versión 1 la rechazó Gerson: «plana y sin corazón». Mandó paisajes vectoriales de la
 * comunidad que dan profundidad. Lo que se tomó de ellos (criterios.md, «Muestra 06»):
 * - Escala de valor y color de lejos a cerca en seis capas: lo lejano toma el color del cielo
 *   (bruma ocre), lo cercano es verde oscuro casi tinta. Todo sale de mezclar la paleta del canal.
 * - Bruma al pie de cada capa: cada capa se aclara hacia su base y se separa de la de atrás.
 * - Una fuente de luz con halo (el sol bajo, detrás de los nevados), nieve en las cumbres y lado de
 *   sombra en cada cara.
 * - Suelo que se aleja: penínsulas y cerros que entran al lago en diagonal, no franjas.
 * - Primer plano que enmarca, cortado por el borde: totora e ichu (en la puna no hay pinos).
 * - Agua que refleja cielo y capas, con oleaje que corta el reflejo y la columna de luz del sol.
 * - Paralaje: la cámara se desliza y cada capa se mueve según su distancia; se detiene antes del
 *   rayo (quietud antes del golpe).
 *
 * Ritmo: atardecer quieto con llovizna → el cielo se cierra, el sol se apaga → quietud → relámpago
 * en dos pulsos que deja las capas en silueta → aguacero.
 *
 * Pixi sin bucle propio: cada cuadro se arma desde el número de cuadro y se dibuja una vez.
 */

const SEMILLA = 61;
const HORIZONTE = 700; // orilla lejana del lago
const SOL = { x: 1230, y: 455, r: 46 };
const RAYO = 2.5; // cuadro 75

// --- Color: todo sale de la paleta del canal ----------------------------------------------------
const aRGB = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const aHex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mezclar = (a: string, b: string, k: number) => {
  const [x, y] = [aRGB(a), aRGB(b)];
  return aHex(x.map((v, i) => v + (y[i] - v) * k));
};
const conAlfa = (hex: string, a: number) => hex + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');
const num = (hex: string) => parseInt(hex.slice(1), 16);

const BRUMA = mezclar(PALETA.ocre, PALETA.papel, 0.35); // el aire lejano, del color del cielo bajo
const HONDO = mezclar(PALETA.verde, PALETA.fondo, 0.72); // lo más cercano
/** Color de una capa según su profundidad: 0 = el horizonte (bruma), 1 = primer plano. */
const capaColor = (k: number) =>
  k < 0.5 ? mezclar(BRUMA, PALETA.verde, k * 1.5) : mezclar(mezclar(BRUMA, PALETA.verde, 0.75), HONDO, Math.min(1, (k - 0.5) * 2.2));
const CIELO_ALTO = mezclar(PALETA.verde, PALETA.papel, 0.3);
const CIELO_BAJO = mezclar(PALETA.ocre, PALETA.papel, 0.3);
const SOL_COLOR = mezclar(PALETA.papel, '#ffffff', 0.55);
const NIEVE = mezclar(PALETA.papel, PALETA.ocre, 0.12);

const vertical = (arriba: string, abajo: string) =>
  new FillGradient({
    type: 'linear',
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: [
      { offset: 0, color: arriba },
      { offset: 1, color: abajo },
    ],
    textureSpace: 'local',
  });

// --- La partitura, en segundos -------------------------------------------------------------------
/** Cuánto llueve (0–1): llovizna, se apaga antes del rayo, aguacero después. */
const lluvia = (t: number) =>
  0.28 * tramo(t, 0.3, 0.8, 'natural') - 0.2 * tramo(t, 1.7, 0.7, 'solemne') + 0.92 * tramo(t, 2.85, 0.9, 'pesado');
const viento = (t: number) => 0.08 + 0.22 * tramo(t, 2.9, 1.2, 'natural');
/** El cielo que se cierra: sube hasta el rayo (tenso); el fogonazo lo borra; vuelve, más suave. */
const oscuridad = (t: number) => 0.62 * tramo(t, 0.9, RAYO - 0.9, 'tenso') - 0.12 * tramo(t, 3.0, 1.5, 'natural');
const fogonazo = (t: number) => {
  const pulso = (t0: number, alto: number, caida: number) => (t < t0 ? 0 : alto * Math.exp(-(t - t0) / caida));
  return clamp(pulso(RAYO, 1, 0.045) + pulso(RAYO + 0.17, 0.85, 0.3));
};
/** La cámara se desliza hacia la izquierda y se detiene antes del rayo (px del primer plano). */
const camara = (t: number) => 70 * tramo(t, 0, 2.2, 'natural');

// --- Las capas, de lejos a cerca ----------------------------------------------------------------
type Capa = {
  k: number; // profundidad 0–1 (color y paralaje)
  orilla: number; // y donde la capa toca el agua (eje del reflejo)
  puntos: [number, number][]; // contorno superior, de izquierda a derecha
  nieve?: boolean;
};

/** Un cerro que entra al lago: sube desde la punta (x0) y se pierde por el borde (x1). */
const cerro = (semilla: number, x0: number, x1: number, orilla: number, alto: number, cima: number): [number, number][] => {
  const r = azar(semilla);
  const pts: [number, number][] = [];
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = mix(x0, x1, u);
    const d = Math.abs(u - cima) / (u < cima ? cima : 1 - cima); // 0 en la cima, 1 en los extremos
    const forma = u < cima ? 1 - d ** 1.6 : 1 - 0.55 * d ** 1.3; // la punta baja al agua; el otro lado se queda alto
    pts.push([x, orilla - alto * Math.max(0, forma) * (0.985 + 0.015 * Math.sin(u * 23 + r.rango(0, 0.4))) - (i === 0 ? 0 : r.rango(0, 1.5))]);
  }
  return pts;
};

const CAPAS: Capa[] = [
  { k: 0.08, orilla: HORIZONTE, puntos: perfil(11, HORIZONTE, 360, 5, -160, 2080), nieve: true }, // nevados
  { k: 0.24, orilla: HORIZONTE, puntos: perfil(29, HORIZONTE + 2, 200, 8, -160, 2080) },
  { k: 0.4, orilla: HORIZONTE + 4, puntos: perfil(5, HORIZONTE + 4, 85, 12, -160, 2080) }, // la otra orilla
  { k: 0.6, orilla: 770, puntos: cerro(41, 980, 2120, 770, 175, 0.62) }, // península de la derecha
  { k: 0.9, orilla: 868, puntos: cerro(43, 880, -180, 868, 290, 0.7) }, // cerro de la izquierda
];
/** Paralaje: cuánto se mueve cada capa respecto del primer plano. */
const PARALAJE = [0.05, 0.1, 0.18, 0.38, 0.62, 1];

/** Dibuja una capa: cuerpo con bruma al pie, sombra en las caras y nieve en las cumbres. */
const dibujarCapa = (c: Capa, conDetalle: boolean): Container => {
  const capa = new Container();
  const pie = c.orilla + 2;
  const contorno = [...c.puntos.flat(), c.puntos[c.puntos.length - 1][0], pie, c.puntos[0][0], pie];
  const alto = Math.min(...c.puntos.map((p) => p[1]));
  const color = capaColor(c.k);
  // el cuerpo: su color arriba, aclarado por la bruma al pie
  capa.addChild(new Graphics().poly(contorno).fill(vertical(color, mezclar(color, BRUMA, 0.55 - 0.25 * c.k))));
  if (!conDetalle || c.k > 0.5) return capa; // los cerros cercanos: lisos, como en las referencias
  // las caras: cada cima tiene su lado de sombra (el sol está a la derecha y bajo: sombra a la izquierda)
  const mascara = new Graphics().poly(contorno).fill(0xffffff);
  const caras = new Graphics();
  const r = azar(semillaCapa(c));
  for (let i = 1; i < c.puntos.length - 1; i++) {
    const [x, y] = c.puntos[i];
    // solo las cimas de verdad: más altas que todo lo que tienen cerca y con 30 px de prominencia
    const cerca = c.puntos.slice(Math.max(0, i - 10), i + 11);
    if (cerca.some(([, yy]) => yy < y) || Math.max(...cerca.map(([, yy]) => yy)) - y < 30) continue;
    const ancho = (pie - y) * r.rango(0.5, 0.9);
    caras.poly([x, y, x - ancho * 0.25, pie, x - ancho, pie, x - ancho * 0.35, y + (pie - y) * 0.35]).fill({
      color: mezclar(color, PALETA.fondo, 0.22),
      alpha: 0.55,
    });
  }
  caras.mask = mascara;
  capa.addChild(caras, mascara);
  if (c.nieve) {
    // la nieve: desde las cumbres hasta una línea quebrada; más abajo en las cimas más altas
    const lineaNieve = alto + (pie - alto) * 0.3;
    const borde: number[] = [];
    for (let x = c.puntos[0][0]; x <= c.puntos[c.puntos.length - 1][0]; x += 18) borde.push(x, lineaNieve + r.rango(-26, 30));
    const nieve = new Graphics().poly([c.puntos[0][0], 0, ...borde, c.puntos[c.puntos.length - 1][0], 0]).fill(vertical(NIEVE, mezclar(NIEVE, color, 0.5)));
    const m2 = new Graphics().poly(contorno).fill(0xffffff);
    nieve.mask = m2;
    capa.addChild(nieve, m2);
  }
  return capa;
};
const semillaCapa = (c: Capa) => Math.round(c.k * 1000) + 7;

/** El rayo: una quebrada con semilla que baja hasta la cresta de la segunda capa. */
const trazarRayo = () => {
  const r = azar(SEMILLA + 7);
  const sierra = CAPAS[1].puntos;
  const destino = sierra.reduce((a, b) => (Math.abs(b[0] - 700) < Math.abs(a[0] - 700) ? b : a));
  const quebrada = (x0: number, y0: number, x1: number, y1: number, pasos: number, desvio: number) => {
    const pts: [number, number][] = [[x0, y0]];
    for (let i = 1; i < pasos; i++) {
      const k = i / pasos;
      pts.push([mix(x0, x1, k) + r.rango(-desvio, desvio), mix(y0, y1, k) + r.rango(-desvio, desvio) * 0.3]);
    }
    pts.push([x1, y1]);
    return pts;
  };
  const tronco = quebrada(620, -10, destino[0], destino[1] + 6, 16, 32);
  const ramas = [tronco[5], tronco[9]].map(([x, y], i) => quebrada(x, y, x + (i ? 140 : -170), y + 160, 7, 20));
  return { tronco, ramas };
};

/** Los tres planos de lluvia, intercalados entre las capas: la lluvia también tiene profundidad. */
const PLANOS = [
  { n: 2400, escala: 0.38, vel: 900, alfa: 0.3, desenfoque: 0, despuesDe: 2 },
  { n: 1000, escala: 0.8, vel: 1500, alfa: 0.42, desenfoque: 0, despuesDe: 4 },
  { n: 120, escala: 2.2, vel: 2600, alfa: 0.32, desenfoque: 5, despuesDe: 5 },
] as const;
const N_SALPICONES = 260;
const N_TOTORA = 230;

type Escena = {
  app: Application;
  capas: Container[];
  reflejos: Container[];
  planos: { capa: Container; gotas: Sprite[]; x0: Float32Array; y0: Float32Array; v: Float32Array; orden: Float32Array }[];
  paisaje: Container;
  nubarron: Graphics;
  sombraTotal: Graphics;
  halo: Container;
  luz: Graphics;
  lagoLuz: Graphics;
  rayo: Graphics;
  oleaje: Graphics;
  salpicones: Graphics;
  totora: Graphics;
  sombras: ColorMatrixFilter;
};

const recorridos = (fps: number) =>
  PLANOS.map((pl) => {
    const caida = new Float32Array(DURACION + 1);
    const deriva = new Float32Array(DURACION + 1);
    for (let f = 1; f <= DURACION; f++) {
      const t = f / fps;
      const v = (pl.vel * (0.75 + 0.45 * lluvia(t))) / fps;
      caida[f] = caida[f - 1] + v;
      deriva[f] = deriva[f - 1] + v * Math.tan(viento(t));
    }
    return { caida, deriva };
  });

/** Totora e ichu del primer plano: cada tallo con su base, alto, curva y fase (con semilla). */
const tallosTotora = () => {
  const r = azar(SEMILLA + 11);
  return Array.from({ length: N_TOTORA }, (_, i) => {
    const izquierda = i < N_TOTORA * 0.62; // más a la izquierda: la composición pesa de ese lado
    const x = izquierda ? r.rango(-40, 620) * (r.n() < 0.6 ? 0.7 : 1) : r.rango(1450, 1960);
    const borde = izquierda ? 1 - clamp(x / 620) : clamp((x - 1450) / 470);
    const alto = (izquierda ? 230 : 170) * (0.45 + 0.75 * borde) * r.rango(0.6, 1.15);
    return { x, base: 1086 - r.rango(0, 40) * (1 - borde), alto, curva: r.rango(-0.25, 0.1), fase: r.rango(0, 6.28), grosor: r.rango(2.2, 5), ichu: r.n() < 0.3 };
  });
};

export const LluviaPixi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const contenedor = useRef<HTMLDivElement>(null);
  const [escena, setEscena] = useState<Escena | null>(null);
  const [espera] = useState(() => delayRender('pixi: creando el renderizador'));
  const rec = useMemo(() => recorridos(fps), [fps]);
  const rayoPts = useMemo(() => trazarRayo(), []);
  const tallos = useMemo(() => tallosTotora(), []);

  useEffect(() => {
    let vivo = true;
    const app = new Application();
    app
      .init({ width, height, backgroundAlpha: 0, antialias: true, preference: 'webgl', autoStart: false, sharedTicker: false, preserveDrawingBuffer: true, resolution: 1 })
      .then(() => {
        if (!vivo || !contenedor.current) return;
        app.ticker.stop();
        contenedor.current.appendChild(app.canvas);
        const gl = (app.renderer as WebGLRenderer).gl;
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        // console.warn y no console.log: Remotion muestra los warn sin --log=verbose
        console.warn(`[lab06] Pixi ${app.renderer.name}: ${info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)} | ${gl.getParameter(gl.VERSION)} | búfer ${gl.drawingBufferWidth}×${gl.drawingBufferHeight}`);
        const r = azar(SEMILLA);

        // el cielo: de verde gris arriba a ocre claro sobre el horizonte
        const cielo = new Graphics().rect(0, 0, width, HORIZONTE + 4).fill(vertical(CIELO_ALTO, CIELO_BAJO));
        // el sol y su halo (anillos concéntricos, sin filtro)
        const halo = new Container();
        const resplandor = new Graphics();
        const tibio = mezclar(SOL_COLOR, PALETA.ocre, 0.35);
        // anillos cada vez más juntos cerca del sol: el halo se apaga suave, sin borde
        for (let i = 30; i >= 1; i--) resplandor.circle(SOL.x, SOL.y, SOL.r + 520 * (i / 30) ** 1.8).fill({ color: tibio, alpha: 0.03 });
        halo.addChild(resplandor, new Graphics().circle(SOL.x, SOL.y, SOL.r).fill(SOL_COLOR));
        // el fogonazo: el cielo se vuelve luz
        const luz = new Graphics().rect(0, 0, width, HORIZONTE + 4).fill(SOL_COLOR);

        // el agua: refleja el cielo bajo cerca de la orilla y se oscurece hacia el primer plano
        const agua = new Graphics().rect(0, HORIZONTE, width, height - HORIZONTE).fill(vertical(mezclar(CIELO_BAJO, BRUMA, 0.4), mezclar(PALETA.verde, PALETA.fondo, 0.45)));
        // la columna de luz del sol sobre el agua
        const columna = new Graphics();
        for (let y = HORIZONTE + 4; y < 1000; y += 5) {
          const k = (y - HORIZONTE) / 300;
          const ancho = (40 + 120 * k) * r.rango(0.3, 1);
          columna.rect(SOL.x - ancho / 2 + r.rango(-20, 20) * k, y, ancho, 1.6 + k).fill({ color: SOL_COLOR, alpha: 0.55 * (1 - clamp(k / 1.1)) });
        }

        // capas y sus reflejos (el reflejo: la capa invertida sobre su orilla, más tenue)
        const capas = CAPAS.map((c) => dibujarCapa(c, true));
        const reflejos = CAPAS.map((c) => {
          const ref = dibujarCapa(c, false);
          ref.scale.y = -0.8;
          ref.pivot.y = c.orilla;
          ref.y = c.orilla;
          ref.alpha = 0.38;
          return ref;
        });
        // bruma sobre la orilla lejana
        const brumaLago = new Graphics().rect(0, HORIZONTE - 70, width, 100).fill(vertical(conAlfa(BRUMA, 0), conAlfa(BRUMA, 0.55)));
        const brumaLago2 = new Graphics().rect(0, HORIZONTE + 30, width, 40).fill(vertical(conAlfa(BRUMA, 0.55), conAlfa(BRUMA, 0)));

        // oleaje: líneas que cortan los reflejos (se redibujan: derivan despacio)
        const oleaje = new Graphics();
        const nubarron = new Graphics().rect(0, 0, width, HORIZONTE + 4).fill(vertical(conAlfa(HONDO, 0.95), conAlfa(mezclar(HONDO, BRUMA, 0.5), 0.5)));
        const sombraTotal = new Graphics().rect(0, 0, width, height).fill(HONDO);
        const lagoLuz = new Graphics().rect(0, HORIZONTE, width, height - HORIZONTE).fill(vertical(conAlfa(SOL_COLOR, 0.7), conAlfa(SOL_COLOR, 0)));
        const rayo = new Graphics();
        rayo.filters = [new BlurFilter({ strength: 1.2, quality: 2 })];

        const forma = new Graphics().poly([2, 0, 3.4, 54, 2, 64, 0.6, 54]).fill(0xffffff);
        const textura: Texture = app.renderer.generateTexture({ target: forma, resolution: 2 });
        const gotaColor = num(mezclar(PALETA.papel, BRUMA, 0.3)); // gotas claras: la luz que atrapan
        const planos = PLANOS.map((pl) => {
          const capa = new Container();
          if (pl.desenfoque) capa.filters = [new BlurFilter({ strength: pl.desenfoque, quality: 3 })];
          const x0 = new Float32Array(pl.n), y0 = new Float32Array(pl.n), v = new Float32Array(pl.n), orden = new Float32Array(pl.n);
          const gotas = Array.from({ length: pl.n }, (_, i) => {
            const s = new Sprite(textura);
            s.anchor.set(0.5, 1);
            s.tint = gotaColor;
            s.scale.set(pl.escala * r.rango(0.8, 1.2));
            x0[i] = r.rango(-300, width + 300);
            y0[i] = r.rango(0, height + 200);
            v[i] = r.rango(0.85, 1.15);
            orden[i] = r.n();
            capa.addChild(s);
            return s;
          });
          return { capa, gotas, x0, y0, v, orden };
        });
        const salpicones = new Graphics();
        const totora = new Graphics();

        // orden de atrás hacia adelante; el paisaje lleva el filtro del fogonazo
        const paisaje = new Container();
        paisaje.addChild(
          agua, columna, ...reflejos, oleaje, lagoLuz,
          capas[0], rayo, capas[1], capas[2], brumaLago, brumaLago2, planos[0].capa,
          capas[3], capas[4], planos[1].capa, salpicones, totora,
        );
        const sombras = new ColorMatrixFilter();
        app.stage.addChild(cielo, halo, luz, paisaje);
        // el nubarrón tapa el cielo y el sol, por delante del cielo pero detrás de las capas
        paisaje.addChildAt(nubarron, 0);
        app.stage.addChild(sombraTotal, planos[2].capa);
        setEscena({ app, capas, reflejos, planos, paisaje, nubarron, sombraTotal, halo, luz, lagoLuz, rayo, oleaje, salpicones, totora, sombras });
        continueRender(espera);
      })
      .catch((e) => cancelRender(e as Error));
    return () => {
      vivo = false;
      app.destroy?.(true, { children: true, texture: true });
    };
  }, [espera, width, height]);

  useLayoutEffect(() => {
    if (!escena) return;
    const h = delayRender(`pixi: cuadro ${frame}`);
    try {
      const t = frame / fps;
      const ll = lluvia(t), fg = fogonazo(t), ang = viento(t), osc = oscuridad(t);
      const cam = camara(t);

      // paralaje: cada capa (y su reflejo) se desplaza según su distancia
      escena.capas.forEach((c, i) => (c.x = cam * PARALAJE[i]));
      escena.reflejos.forEach((c, i) => (c.x = cam * PARALAJE[i]));
      escena.halo.x = cam * 0.02;

      // la tormenta: el cielo se cierra y apaga el sol; el fogonazo lo borra todo un instante
      escena.nubarron.alpha = osc * (1 - fg);
      escena.halo.alpha = 1 - 0.85 * clamp(osc / 0.5);
      escena.sombraTotal.alpha = 0.32 * osc * (1 - fg);
      escena.luz.alpha = 0.95 * fg;
      escena.lagoLuz.alpha = 0.6 * fg;
      // con el fogonazo, el paisaje se vuelve silueta (el filtro solo se aplica cuando hace falta)
      // (en cada capa y no en el paisaje entero: el rayo, que va entre capas, no se oscurece)
      for (const c of [...escena.capas, ...escena.reflejos, escena.totora]) c.filters = fg > 0.01 ? [escena.sombras] : [];
      escena.sombras.brightness(1 - 0.7 * fg, false);
      escena.sombras.contrast(0.5 * fg, true);

      // oleaje: líneas cortas color cielo que derivan, más largas y separadas hacia adelante
      const ol = escena.oleaje.clear();
      const ro = azar(SEMILLA + 5);
      for (let i = 0; i < 70; i++) {
        const k = (i / 70) ** 1.8;
        const y = HORIZONTE + 6 + k * 360;
        let x = ro.rango(-200, 0) + ((t * (12 + 30 * k) + ro.rango(0, 200)) % 200);
        while (x < width) {
          const largo = ro.rango(40, 260) * (0.4 + k);
          ol.moveTo(x, y).lineTo(x + largo, y);
          x += largo + ro.rango(30, 180) * (0.5 + k);
        }
        ol.stroke({ color: mezclar(CIELO_BAJO, PALETA.papel, 0.3), width: 0.8 + 2.2 * k, alpha: 0.35 * (1 - 0.6 * osc) });
      }

      // lluvia
      const W = width + 600, H = height + 260;
      escena.planos.forEach((pl, p) => {
        const { caida, deriva } = rec[p];
        const base = PLANOS[p];
        for (let i = 0; i < pl.gotas.length; i++) {
          const g = pl.gotas[i];
          if (pl.orden[i] > ll * 1.05) {
            g.visible = false;
            continue;
          }
          g.visible = true;
          const y = ((((pl.y0[i] + caida[frame] * pl.v[i]) % H) + H) % H) - 130;
          const x = ((((pl.x0[i] - deriva[frame] * pl.v[i] - (y + 130) * Math.tan(ang) + 300) % W) + W) % W) - 300;
          g.position.set(x, y);
          g.rotation = ang;
          g.alpha = base.alfa * (0.6 + 0.6 * osc) * (1 - 0.6 * fg);
        }
      });

      // salpicones en el agua, con perspectiva
      const sp = escena.salpicones.clear();
      const rs = azar(SEMILLA + 3);
      for (let i = 0; i < N_SALPICONES; i++) {
        const periodo = rs.rango(0.35, 0.8), fase = rs.n() * periodo, orden = rs.n();
        const k = rs.n() ** 1.5;
        const x = rs.rango(0, width);
        const ciclo = Math.floor((t + fase) / periodo);
        const edad = (t + fase) / periodo - ciclo;
        if (orden > ll || edad > 0.55) continue;
        const dx = azar(i * 977 + ciclo).rango(-60, 60);
        const y = HORIZONTE + 10 + k * 330;
        const radio = (4 + 30 * k) * (0.3 + edad * 1.6);
        sp.ellipse(x + dx, y, radio, radio * (0.12 + 0.14 * k)).stroke({ color: mezclar(PALETA.papel, BRUMA, 0.3), width: 0.8 + 1.6 * k, alpha: (1 - edad / 0.55) * (0.25 + 0.45 * k) });
      }

      // totora e ichu: se mecen con el viento; el aguacero los dobla más
      const tz = escena.totora.clear();
      const ichuColor = mezclar(HONDO, PALETA.ocre, 0.18);
      for (const s of tallos) {
        const meneo = (0.03 + 0.12 * ll) * Math.sin(t * (2.2 + 2.5 * ll) + s.fase) + s.curva + 0.25 * ang;
        const x = s.x + cam; // primer plano: paralaje completo
        const tipX = x + Math.sin(meneo) * s.alto, tipY = s.base - Math.cos(meneo) * s.alto;
        const cx = x + Math.sin(meneo * 0.4) * s.alto * 0.5, cy = s.base - s.alto * 0.55;
        tz.moveTo(x, s.base).quadraticCurveTo(cx, cy, tipX, tipY).stroke({ color: s.ichu ? ichuColor : HONDO, width: s.ichu ? s.grosor * 0.5 : s.grosor, cap: 'round' });
        if (!s.ichu && s.alto > 150) tz.ellipse(tipX, tipY + 12, 3.2, 14).fill(mezclar(HONDO, PALETA.ocre, 0.3)); // la espiga
      }
      // la orilla del primer plano, de donde salen los tallos
      tz.poly([-20, 1090, -20, 1030, 260, 1050, 560, 1075, 700, 1090]).fill(HONDO);
      tz.poly([1380, 1090, 1600, 1066, 1940, 1040, 1940, 1090]).fill(HONDO);

      // el rayo, claro y con resplandor, detrás de la segunda capa
      const rz = escena.rayo.clear();
      escena.rayo.x = cam * PARALAJE[0];
      if (t >= RAYO && t < RAYO + 0.75) {
        const baja = clamp((t - RAYO) / 0.1);
        const vida = 1 - tramo(t, RAYO + 0.25, 0.5, 'ligero');
        const cuantos = Math.max(2, Math.ceil(rayoPts.tronco.length * baja));
        const dibujar = (pts: [number, number][], ancho: number) => {
          rz.moveTo(pts[0][0], pts[0][1]);
          for (const [x, y] of pts.slice(1)) rz.lineTo(x, y);
          rz.stroke({ color: SOL_COLOR, width: ancho * 3, alpha: 0.35 * vida, join: 'round' });
          rz.moveTo(pts[0][0], pts[0][1]);
          for (const [x, y] of pts.slice(1)) rz.lineTo(x, y);
          rz.stroke({ color: '#ffffff', width: ancho, alpha: vida, join: 'round' });
        };
        dibujar(rayoPts.tronco.slice(0, cuantos), 3.6);
        if (baja >= 1) rayoPts.ramas.forEach((rama) => dibujar(rama, 1.6));
      }

      escena.app.renderer.render(escena.app.stage);
      continueRender(h);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [frame, fps, width, escena, rec, rayoPts, tallos]);

  return (
    <AbsoluteFill>
      <div ref={contenedor} style={{ position: 'absolute', inset: 0 }} />
      {/* el grano del papel del canal, encima del dibujo vectorial */}
      <Papel color="#ffffff" envejecido={0.5} style={{ mixBlendMode: 'multiply', opacity: 0.55 }} />
    </AbsoluteFill>
  );
};
