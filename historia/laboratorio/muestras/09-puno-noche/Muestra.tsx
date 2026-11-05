import { Application, Container, FillGradient, Graphics, Sprite, type Texture, type WebGLRenderer } from 'pixi.js';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, Audio, cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { clamp, mix, tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { ambiente } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 09 · Puno de noche: la ciudad se enciende (PixiJS).
 *
 * Primera muestra hecha con el skill del canal versión 1: referencias (los paisajes vectoriales que
 * mandó Gerson para la 06), pase de imagen, coreografía por papeles (movimiento.md) y sonido en el
 * beat principal.
 *
 * El encuadre: desde un cerro detrás de la ciudad. Primer plano oscuro con ichu (enmarca, cortado por
 * el borde); la ciudad baja entre cerros hasta la bahía; detrás, el lago, una isla, la otra orilla y el
 * cielo de altura. Ningún edificio ni lugar está dibujado como el real: es una composición, sin
 * rótulos (si fuera una escena, los perfiles saldrían de datos: t2-qgis).
 *
 * La coreografía (cámara quieta: el movimiento son las luces):
 *   Protagonista: la plaza, que se enciende primero (1,4 s) con la campana.
 *   Apoyo: las calles, que se encienden lámpara por lámpara desde la plaza (recorrer), y los barrios,
 *     en una ola que sale de la plaza y sube por los cerros; los retrasos se acortan (no es un
 *     metrónomo) y cada barrio tiene su propio desfase.
 *   Decoración: estrellas (aparecen, no se mueven), el brillo sobre la ciudad (crece con las luces).
 *   Remate: una sola luz en la isla (4,2 s), sin sonido; después, quietud.
 *   Quieto: el lago, los cerros, el cielo.
 */

const SEMILLA = 9;
const ORILLA_LEJANA = 392; // base de la otra orilla
const BAHIA = 610; // borde de la ciudad con el agua (promedio)
const ISLA = { x: 1395, y: 432 };
const T = { quietud: 0.8, plaza: 1.4, ola: 1.55, olaFin: 3.7, isla: 4.2 };

// --- Color: mezclas de la paleta del canal ------------------------------------------------------
const aRGB = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const aHex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mezclar = (a: string, b: string, k: number) => {
  const [x, y] = [aRGB(a), aRGB(b)];
  return aHex(x.map((v, i) => v + (y[i] - v) * k));
};
const conAlfa = (hex: string, a: number) => hex + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');
const num = (hex: string) => parseInt(hex.slice(1), 16);

const NOCHE = mezclar(PALETA.fondo, PALETA.verde, 0.28); // el cielo alto
const HORIZONTE_CIELO = mezclar(PALETA.verde, PALETA.ocre, 0.35); // lo que queda del atardecer
const CERRO = mezclar(PALETA.fondo, PALETA.verde, 0.12); // lo más cercano: casi tinta
const LUZ = mezclar(PALETA.papel, PALETA.ocre, 0.55); // ventanas y faroles: cálidos
const LUZ_FRIA = mezclar(PALETA.papel, PALETA.verde, 0.25); // algunos tubos
const RESPLANDOR = PALETA.ocre;
/** Siluetas de lejos a cerca: lo lejano toma el color del aire nocturno (más claro), lo cercano es tinta. */
const silueta = (k: number) => mezclar(mezclar(NOCHE, HORIZONTE_CIELO, 0.35), CERRO, k);

const vertical = (arriba: string, abajo: string) =>
  new FillGradient({ type: 'linear', start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, colorStops: [{ offset: 0, color: arriba }, { offset: 1, color: abajo }], textureSpace: 'local' });

// --- Geometría ----------------------------------------------------------------------------------
type Pt = [number, number];
/** Contorno suave con semilla entre puntos de control (la cresta de un cerro). */
const cresta = (semilla: number, control: Pt[], paso = 14, rugosidad = 5): Pt[] => {
  const r = azar(semilla);
  const pts: Pt[] = [];
  for (let i = 0; i < control.length - 1; i++) {
    const [x0, y0] = control[i], [x1, y1] = control[i + 1];
    const n = Math.max(1, Math.round(Math.abs(x1 - x0) / paso));
    for (let j = 0; j < n; j++) {
      const u = j / n, s = (1 - Math.cos(Math.PI * u)) / 2;
      pts.push([mix(x0, x1, u), mix(y0, y1, s) + r.rango(-rugosidad, rugosidad)]);
    }
  }
  pts.push(control[control.length - 1]);
  return pts;
};
const dentro = (p: Pt, poli: Pt[]) => {
  let c = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i], [xj, yj] = poli[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const cerrar = (crestaPts: Pt[], fondo = 1090): Pt[] => [...crestaPts, [crestaPts[crestaPts.length - 1][0], fondo], [crestaPts[0][0], fondo]];

const OTRA_ORILLA = cresta(31, [[-20, 385], [260, 360], [520, 378], [820, 352], [1100, 372], [1500, 348], [1940, 380]], 18, 3);
const CERRO_FONDO_DER = cerrar(cresta(33, [[1180, 600], [1420, 470], [1640, 400], [1940, 330]], 14, 6));
const CERRO_FONDO_IZQ = cerrar(cresta(35, [[-20, 400], [220, 440], [420, 520], [560, 612]], 14, 6));
// la cuenca de la ciudad: el borde con la bahía sube a los lados
const CIUDAD = cerrar(cresta(37, [[-20, 520], [180, 560], [420, 615], [700, 628], [1000, 612], [1250, 622], [1520, 560], [1940, 470]], 12, 4));
const PRIMER_PLANO = cerrar(cresta(39, [[-30, 930], [160, 905], [360, 940], [620, 1010], [760, 1080]], 10, 7));
const PRIMER_PLANO_DER = cerrar(cresta(41, [[1560, 1080], [1720, 1022], [1950, 1000]], 10, 5));

// --- Las luces -----------------------------------------------------------------------------------
type Luz = { x: number; y: number; t: number; tam: number; fria: boolean; brillo: number; parpadeo: number };

/**
 * Las luces viven sobre un suelo en perspectiva: (u, v) con u de 0 a 1 a lo ancho y v de 0 (junto a la
 * bahía, lejos) a 1 (al pie del cerro donde estamos). Lo lejano sale más apretado y más chico; las
 * calles forman una trama que converge hacia la bahía; los bordes suben por los cerros.
 */
const CRESTA_CIUDAD = CIUDAD.slice(0, -2);
const bordeCiudad = (x: number) => {
  const c = CRESTA_CIUDAD;
  for (let i = 1; i < c.length; i++) if (c[i][0] >= x) return mix(c[i - 1][1], c[i][1], (x - c[i - 1][0]) / (c[i][0] - c[i - 1][0] || 1));
  return c[c.length - 1][1];
};
const aPantalla = (u: number, v: number): Pt => {
  const x = 960 + (u - 0.5) * 2100 * (0.62 + 0.45 * v); // lo lejano se junta hacia el centro
  const arriba = bordeCiudad(x) + 10;
  return [x, arriba + (1075 - arriba) * v ** 1.55]; // lo lejano se aprieta
};
const PLAZA_UV = { u: 0.47, v: 0.42 };
const PLAZA: { x: number; y: number } = (() => { const [x, y] = aPantalla(PLAZA_UV.u, PLAZA_UV.v); return { x, y }; })();

/** La ola: sale de la plaza, sube por los cerros y se acelera (los retrasos se acortan). */
const luces = (): { ciudad: Luz[]; plaza: Luz[]; lejos: Luz[] } => {
  const r = azar(SEMILLA);
  const cuando = (u: number, v: number, barrio: number) => {
    const d = Math.hypot((u - PLAZA_UV.u) * 1.5, v - PLAZA_UV.v); // distancia sobre el suelo, no en pantalla
    return T.ola + (T.olaFin - T.ola) * clamp(d / 0.95) ** 0.75 + barrio; // ^0.75: la ola se acelera
  };
  const desfase = new Map<string, number>();
  const barrio = (u: number, v: number) => {
    const k = `${Math.floor(u * 9)}:${Math.floor(v * 6)}`;
    if (!desfase.has(k)) desfase.set(k, r.rango(-0.1, 0.25));
    return desfase.get(k)!;
  };
  // huecos oscuros: quebradas, canchas, terrenos sin casas
  const huecos = Array.from({ length: 9 }, () => ({ u: r.rango(0.05, 0.95), v: r.rango(0.15, 0.95), rad: r.rango(0.03, 0.07) }));
  const libre = (u: number, v: number) => huecos.every((h) => Math.hypot((u - h.u) * 1.4, v - h.v) > h.rad);
  const visible = ([x, y]: Pt) => x > -20 && x < 1940 && !dentro([x, y], PRIMER_PLANO) && !dentro([x, y], PRIMER_PLANO_DER);
  const ciudad: Luz[] = [];
  const tam = (v: number) => 0.45 + 0.7 * v;
  // calles: filas (v constante, con curva) y columnas (u constante); faroles regulares, encendidos en orden
  const filas = Array.from({ length: 11 }, (_, i) => 0.06 + (i / 10) * 0.9);
  const columnas = Array.from({ length: 13 }, (_, i) => 0.04 + (i / 12) * 0.92);
  const faroles = (puntos: { u: number; v: number }[], inicio: number) => {
    // desde el punto más cercano a la plaza hacia los dos extremos: el ojo recorre la calle
    const cerca = puntos.reduce((m, p, i) => (Math.hypot(p.u - PLAZA_UV.u, p.v - PLAZA_UV.v) < Math.hypot(puntos[m].u - PLAZA_UV.u, puntos[m].v - PLAZA_UV.v) ? i : m), 0);
    const lado = Math.max(cerca, puntos.length - 1 - cerca) || 1;
    puntos.forEach((p, i) => {
      const pt = aPantalla(p.u, p.v);
      if (!visible(pt) || !libre(p.u, p.v)) return;
      const avance = tramo(Math.abs(i - cerca) / lado, 0, 1, 'ligero');
      ciudad.push({ x: pt[0], y: pt[1], t: inicio + 1.5 * avance, tam: tam(p.v) * 0.8, fria: false, brillo: 0.95, parpadeo: -1 });
    });
  };
  for (const v0 of filas) {
    const pasos = Math.round(70 + 60 * (1 - v0)); // lejos, más faroles por ancho (la perspectiva los junta)
    const pts = Array.from({ length: pasos }, (_, i) => { const u = i / (pasos - 1); return { u, v: v0 + 0.035 * Math.sin(u * (5 + v0 * 4) + v0 * 11) + 0.015 * Math.sin(u * 23 + v0 * 5) }; });
    faroles(pts, cuando(PLAZA_UV.u, v0, 0) - 0.15);
  }
  for (const u0 of columnas) {
    const pts = Array.from({ length: 40 }, (_, i) => ({ u: u0 + 0.022 * Math.sin(i * 0.25 + u0 * 17), v: i / 39 }));
    faroles(pts, cuando(u0, PLAZA_UV.v, 0) - 0.15);
  }
  // casas: en las manzanas entre calles, más densas cerca de la plaza; ventanas cálidas y algunas frías
  const nCasas = ciudad.length + 1100;
  for (let n = 0; ciudad.length < nCasas && n < 30000; n++) {
    // la mayoría de las casas da a una calle: se pegan a una fila o a una columna (manzanas)
    let u = r.n(), v = r.n();
    const pega = r.n();
    if (pega < 0.4) v = filas.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)) + r.rango(-0.022, 0.022);
    else if (pega < 0.7) u = columnas.reduce((a, b) => (Math.abs(b - u) < Math.abs(a - u) ? b : a)) + r.rango(-0.012, 0.012);
    if (v < 0 || v > 1) continue;
    if (!libre(u, v)) continue;
    const densidad = 0.25 + 0.75 * Math.exp(-Math.hypot((u - PLAZA_UV.u) * 1.4, v - PLAZA_UV.v) / 0.45);
    if (r.n() > densidad) continue;
    const pt = aPantalla(u, v);
    if (!visible(pt)) continue;
    ciudad.push({ x: pt[0], y: pt[1], t: cuando(u, v, barrio(u, v)) + r.rango(0, 0.2), tam: tam(v) * r.rango(0.6, 1), fria: r.n() < 0.14, brillo: r.rango(0.45, 0.95), parpadeo: r.n() < 0.08 ? r.rango(0, 6.28) : -1 });
  }
  // la plaza: un racimo apretado y más brillante (la protagonista), todo junto en el mismo beat
  const plaza: Luz[] = Array.from({ length: 30 }, (_, i) => {
    const borde = i < 20; // el contorno de la plaza (cuatro lados) y algunas luces adentro
    const lado = i % 4, k = r.n();
    const du = borde ? (lado < 2 ? (k - 0.5) * 0.06 : (lado === 2 ? -0.03 : 0.03)) : r.rango(-0.02, 0.02);
    const dv = borde ? (lado < 2 ? (lado === 0 ? -0.03 : 0.03) : (k - 0.5) * 0.06) : r.rango(-0.02, 0.02);
    const [x, y] = aPantalla(PLAZA_UV.u + du, PLAZA_UV.v + dv);
    return { x, y, t: T.plaza + r.rango(0, 0.04), tam: tam(PLAZA_UV.v) * 1.6, fria: false, brillo: 1, parpadeo: -1 };
  });
  // la otra orilla: pocas luces chicas y frías, ya encendidas (pueblos lejanos)
  const lejos: Luz[] = Array.from({ length: 14 }, () => {
    const x = r.rango(80, 1880);
    const y = OTRA_ORILLA.reduce((a, b) => (Math.abs(b[0] - x) < Math.abs(a[0] - x) ? b : a))[1] + r.rango(6, 16);
    return { x, y, t: r.rango(-1, 0.6), tam: 0.32, fria: true, brillo: r.rango(0.4, 0.8), parpadeo: -1 };
  });
  return { ciudad, plaza, lejos };
};

/** Encendido de una luz: sube rápido, se pasa apenas y se asienta (una lámpara que agarra). */
const encendido = (t: number, t0: number) => (t < t0 ? 0 : clamp(tramo(t, t0, 0.12, 'ligero') * (1 + 0.35 * Math.exp(-(t - t0 - 0.12) / 0.08) * (t > t0 + 0.12 ? 1 : 0))));

type Escena = {
  app: Application;
  sprites: { s: Sprite; halo: Sprite; luz: Luz }[];
  resplandor: Graphics;
  estrellas: Container;
  atardecer: Graphics;
  isla: { s: Sprite; halo: Sprite; reflejo: Graphics };
  ichu: Graphics;
};

const tallosIchu = () => {
  const r = azar(SEMILLA + 5);
  const enCresta = (crestaPts: Pt[], x: number) => crestaPts.reduce((a, b) => (Math.abs(b[0] - x) < Math.abs(a[0] - x) ? b : a))[1];
  const izq = PRIMER_PLANO.slice(0, -2), der = PRIMER_PLANO_DER.slice(0, -2);
  return Array.from({ length: 150 }, (_, i) => {
    const enIzq = i < 115;
    const x = enIzq ? r.rango(-20, 700) : r.rango(1580, 1940);
    const base = enCresta(enIzq ? izq : der, x) + r.rango(4, 14);
    return { x, base, alto: r.rango(26, 70) * (enIzq ? 1.2 : 0.9), inclina: r.rango(-0.5, 0.35), fase: r.rango(0, 6.28) };
  });
};

export const PunoNoche: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const contenedor = useRef<HTMLDivElement>(null);
  const [escena, setEscena] = useState<Escena | null>(null);
  const [espera] = useState(() => delayRender('pixi: creando el renderizador'));
  const datos = useMemo(() => luces(), []);
  const ichu = useMemo(() => tallosIchu(), []);

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
        console.warn(`[lab09] Pixi ${app.renderer.name}: ${info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)} | búfer ${gl.drawingBufferWidth}×${gl.drawingBufferHeight}`);
        const r = azar(SEMILLA + 1);
        const poly = (pts: Pt[]) => pts.flat();

        // texturas: un punto de luz y un halo (anillos concéntricos horneados una vez)
        const punto = app.renderer.generateTexture({ target: new Graphics().circle(8, 8, 3.2).fill(0xffffff).circle(8, 8, 1.6).fill(0xffffff), resolution: 2 });
        const haloG = new Graphics();
        for (let i = 16; i >= 1; i--) haloG.circle(32, 32, 2 + i * 1.9).fill({ color: 0xffffff, alpha: 0.05 });
        const halo: Texture = app.renderer.generateTexture({ target: haloG, resolution: 1 });

        // el cielo: tinta verdosa arriba, lo que queda del atardecer abajo
        const cielo = new Graphics().rect(0, 0, width, ORILLA_LEJANA + 20).fill(vertical(NOCHE, mezclar(NOCHE, HORIZONTE_CIELO, 0.55)));
        const atardecer = new Graphics().rect(0, 120, width, ORILLA_LEJANA - 100).fill(vertical(conAlfa(HORIZONTE_CIELO, 0), conAlfa(mezclar(HORIZONTE_CIELO, PALETA.ocre, 0.4), 0.55)));
        // estrellas y la franja de la Vía Láctea (más estrellas y un velo, en diagonal)
        const estrellas = new Container();
        const eg = new Graphics();
        for (let i = 0; i < 1500; i++) {
          const enFranja = i < 900;
          const u = r.n();
          const x = enFranja ? mix(-100, 2000, u) + r.rango(-1, 1) * 60 : r.rango(0, width);
          const y = enFranja ? mix(-40, 300, u) + (r.n() + r.n() + r.n() - 1.5) * 55 : r.rango(0, ORILLA_LEJANA - 20);
          const altura = 1 - clamp(y / (ORILLA_LEJANA - 10)); // cerca del horizonte, la bruma las apaga
          eg.circle(x, y, enFranja ? r.rango(0.4, 0.9) : r.rango(0.6, 1.6)).fill({ color: PALETA.papel, alpha: (enFranja ? r.rango(0.15, 0.6) : r.rango(0.3, 0.95)) * (0.2 + 0.8 * altura) });
        }
        estrellas.addChild(eg);

        // la otra orilla, el lago y la isla
        const orilla = new Graphics().poly([...poly(OTRA_ORILLA), 1940, ORILLA_LEJANA + 14, -20, ORILLA_LEJANA + 14]).fill(silueta(0.25));
        const lago = new Graphics().rect(0, ORILLA_LEJANA, width, 700 - ORILLA_LEJANA).fill(vertical(mezclar(NOCHE, HORIZONTE_CIELO, 0.4), mezclar(PALETA.fondo, PALETA.verde, 0.2)));
        // brillo del cielo sobre el agua, en líneas (el lago quieto de noche)
        const brillo = new Graphics();
        for (let i = 0; i < 40; i++) {
          const k = i / 40, y = ORILLA_LEJANA + 10 + k * 220;
          let x = r.rango(-100, 0);
          while (x < width) {
            const largo = r.rango(30, 220) * (0.4 + k);
            brillo.moveTo(x, y).lineTo(x + largo, y);
            x += largo + r.rango(60, 260);
          }
          brillo.stroke({ color: HORIZONTE_CIELO, width: 0.6 + 1.2 * k, alpha: 0.18 * (1 - k * 0.6) });
        }
        const isla = new Graphics().poly(poly(cresta(43, [[ISLA.x - 150, ISLA.y + 6], [ISLA.x - 60, ISLA.y - 12], [ISLA.x + 30, ISLA.y - 16], [ISLA.x + 120, ISLA.y + 6]], 8, 2))).fill(silueta(0.35));

        // los cerros: de lejos a cerca, con bruma al pie (se aclaran hacia abajo) y borde iluminado por la ciudad
        const capa = (pts: Pt[], k: number) => {
          const g = new Graphics().poly(poly(pts)).fill(vertical(silueta(k), mezclar(silueta(k), mezclar(HORIZONTE_CIELO, PALETA.ocre, 0.3), 0.22)));
          return g;
        };
        const fondoDer = capa(CERRO_FONDO_DER, 0.55), fondoIzq = capa(CERRO_FONDO_IZQ, 0.55);
        const ciudad = new Graphics().poly(poly(CIUDAD)).fill(vertical(silueta(0.62), silueta(0.85)));
        const primer = new Graphics().poly(poly(PRIMER_PLANO)).fill(CERRO).poly(poly(PRIMER_PLANO_DER)).fill(CERRO);

        // el resplandor de la ciudad sobre el aire (crece con las luces): elipses aditivas
        const halo2 = new FillGradient({ type: 'radial', center: { x: 0.5, y: 0.5 }, innerRadius: 0, outerCenter: { x: 0.5, y: 0.5 }, outerRadius: 0.5, colorStops: [{ offset: 0, color: conAlfa(RESPLANDOR, 0.6) }, { offset: 0.5, color: conAlfa(RESPLANDOR, 0.22) }, { offset: 1, color: conAlfa(RESPLANDOR, 0) }], textureSpace: 'local' });
        const resplandor = new Graphics().ellipse(PLAZA.x, BAHIA + 120, 1250, 360).fill(halo2);
        resplandor.blendMode = 'add';

        // luces de la ciudad
        const capaLuces = new Container();
        capaLuces.blendMode = 'add';
        const sprites = [...datos.lejos, ...datos.ciudad, ...datos.plaza].map((luz) => {
          const color = num(luz.fria ? LUZ_FRIA : LUZ);
          const h = new Sprite(halo);
          h.anchor.set(0.5);
          h.position.set(luz.x, luz.y);
          h.scale.set(luz.tam * 0.32);
          h.tint = num(RESPLANDOR);
          const s = new Sprite(punto);
          s.anchor.set(0.5);
          s.position.set(luz.x, luz.y);
          s.scale.set(luz.tam * 0.38);
          s.tint = color;
          capaLuces.addChild(h, s);
          return { s, halo: h, luz };
        });

        // la luz de la isla y su reflejo (el único reflejo: está del otro lado del agua)
        const islaS = new Sprite(punto), islaH = new Sprite(halo);
        for (const s of [islaS, islaH]) { s.anchor.set(0.5); s.position.set(ISLA.x + 18, ISLA.y - 6); }
        islaS.scale.set(0.42); islaS.tint = num(LUZ);
        islaH.scale.set(0.45); islaH.tint = num(RESPLANDOR); islaH.blendMode = 'add'; islaS.blendMode = 'add';
        const reflejoIsla = new Graphics();
        for (let i = 0; i < 9; i++) reflejoIsla.rect(ISLA.x + 18 - (5 - i * 0.4), ISLA.y + 12 + i * 7, 10 - i * 0.8, 2).fill({ color: LUZ, alpha: 0.5 * (1 - i / 9) });
        reflejoIsla.blendMode = 'add';

        const ichuG = new Graphics();
        app.stage.addChild(cielo, atardecer, estrellas, orilla, lago, brillo, isla, reflejoIsla, islaH, islaS, fondoDer, fondoIzq, ciudad, resplandor, capaLuces, primer, ichuG);
        setEscena({ app, sprites, resplandor, estrellas, atardecer, isla: { s: islaS, halo: islaH, reflejo: reflejoIsla }, ichu: ichuG });
        continueRender(espera);
      })
      .catch((e) => cancelRender(e as Error));
    return () => {
      vivo = false;
      app.destroy?.(true, { children: true, texture: true });
    };
  }, [espera, width, height, datos]);

  useLayoutEffect(() => {
    if (!escena) return;
    const h = delayRender(`pixi: cuadro ${frame}`);
    try {
      const t = frame / fps;
      // anochece: el resto del atardecer se apaga y aparecen las estrellas
      escena.atardecer.alpha = 1 - tramo(t, 0, 1.6, 'natural');
      escena.estrellas.alpha = 0.25 + 0.75 * tramo(t, 0, 1.4, 'ligero');

      let encendidas = 0;
      for (const { s, halo, luz } of escena.sprites) {
        let a = encendido(t, luz.t) * luz.brillo;
        if (a > 0 && luz.parpadeo >= 0) a *= 0.85 + 0.15 * Math.sin(t * 9 + luz.parpadeo); // algún foco que tiembla
        s.alpha = a;
        halo.alpha = 0.4 * a;
        s.visible = halo.visible = a > 0.003;
        encendidas += clamp(a);
      }
      // el resplandor crece con lo encendido
      escena.resplandor.alpha = 0.7 * clamp(encendidas / (escena.sprites.length * 0.75));
      const isla = encendido(t, T.isla);
      escena.isla.s.alpha = isla;
      escena.isla.halo.alpha = 0.7 * isla;
      escena.isla.reflejo.alpha = isla * (0.85 + 0.15 * Math.sin(t * 5));

      // ichu del primer plano: casi quieto (el viento de la noche), con la punta encendida por la ciudad
      const g = escena.ichu.clear();
      const rim = escena.resplandor.alpha;
      for (const s of ichu) {
        const m = s.inclina + 0.04 * Math.sin(t * 1.7 + s.fase);
        const tx = s.x + Math.sin(m) * s.alto, ty = s.base - Math.cos(m) * s.alto;
        g.moveTo(s.x, s.base).quadraticCurveTo(s.x + Math.sin(m * 0.5) * s.alto * 0.5, s.base - s.alto * 0.55, tx, ty).stroke({ color: CERRO, width: 2.2, cap: 'round' });
        g.moveTo(mix(s.x, tx, 0.7), mix(s.base, ty, 0.7)).lineTo(tx, ty).stroke({ color: mezclar(CERRO, PALETA.ocre, 0.55), width: 1.2, alpha: 0.25 + 0.5 * rim, cap: 'round' });
      }

      escena.app.renderer.render(escena.app.stage);
      continueRender(h);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [frame, fps, escena, ichu]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <div ref={contenedor} style={{ position: 'absolute', inset: 0 }} />
      {/* el grano del papel del canal, encima del dibujo */}
      <Papel color="#ffffff" envejecido={0.6} style={{ mixBlendMode: 'multiply', opacity: 0.4 }} />
      {/* sonido: el viento de la noche, bajo; la campana con la plaza (el beat principal); la isla, en silencio */}
      <Audio src={ambiente('viento')} volume={(f) => 0.22 * interpolate(f, [0, 20, 135, 150], [0, 1, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      <Sfx nombre="campana" en={T.plaza} fps={fps} volumen={0.55} />
    </AbsoluteFill>
  );
};
