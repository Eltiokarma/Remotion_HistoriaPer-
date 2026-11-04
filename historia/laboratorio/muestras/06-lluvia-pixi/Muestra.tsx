import {
  Application,
  BlurFilter,
  ColorMatrixFilter,
  Container,
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
 * Muestra 06 · Tormenta sobre el lago, con miles de gotas y filtros (PixiJS).
 *
 * Qué se prueba: si PixiJS (WebGL) mueve miles de elementos con filtros por cuadro dentro de
 * Remotion, cuánto cuesta frente a la muestra 03 (p5, Canvas 2D) y si, tras el veredicto de la
 * tanda 1 («está bien, pero se ve muy plano»), la profundidad y la luz le dan volumen a la tinta.
 *
 * Cómo:
 * - Pixi sin bucle propio (autoStart: false, ticker parado): cada cuadro se arma desde el número de
 *   cuadro y se dibuja una vez con renderer.render(). El cuadro manda.
 * - Nada se simula paso a paso: la caída acumulada de cada plano se precalcula por cuadro (integral
 *   de la velocidad), y la posición de cada gota es una fórmula de esa caída y de su semilla.
 * - Profundidad: tres planos de lluvia (lejos fina y tenue, medio, cerca gruesa y desenfocada) y
 *   tres capas de cordillera con perspectiva aérea (más clara y borrosa cuanto más lejos).
 * - Ritmo: llueve; la lluvia afloja y el cielo se cierra (quietud antes del golpe); relámpago en dos
 *   pulsos que vuelve negras las montañas contra el cielo blanco; después, el aguacero.
 */

const SEMILLA = 61;
const HORIZONTE = 742;

/** Los tres planos de lluvia: de lejos a cerca. */
const PLANOS = [
  { n: 2600, escala: 0.4, vel: 900, alfa: 0.32, desenfoque: 1.2 },
  { n: 1100, escala: 0.85, vel: 1500, alfa: 0.5, desenfoque: 0 },
  { n: 130, escala: 2.2, vel: 2600, alfa: 0.4, desenfoque: 5 },
] as const;
const N_SALPICONES = 280;

// --- La partitura, en segundos (5 s = 150 cuadros) ---------------------------------------------
const RAYO = 2.5; // primer pulso: cuadro 75
/** Cuánto llueve (0–1): entra, se sostiene, afloja antes del rayo, aguacero después. */
const lluvia = (t: number) =>
  0.55 * tramo(t, 0, 0.6, 'natural') - 0.38 * tramo(t, 1.6, 0.8, 'solemne') + 0.83 * tramo(t, 2.85, 0.9, 'pesado');
/** El viento inclina la lluvia (radianes): casi vertical, se tuerce con el aguacero. */
const viento = (t: number) => 0.1 - 0.04 * tramo(t, 1.6, 0.8, 'solemne') + 0.22 * tramo(t, 2.9, 1.2, 'natural');
/** El cielo que se cierra: sube hasta el rayo (tenso), lo borra el fogonazo, vuelve después. */
const oscuridad = (t: number) => 0.15 + 0.45 * tramo(t, 1.4, RAYO - 1.4, 'tenso') - 0.15 * tramo(t, 3.0, 1.5, 'natural');
/** El fogonazo: dos pulsos (el segundo más largo), con caída exponencial. */
const fogonazo = (t: number) => {
  const pulso = (t0: number, alto: number, caida: number) => (t < t0 ? 0 : alto * Math.exp(-(t - t0) / caida));
  return clamp(pulso(RAYO, 1, 0.045) + pulso(RAYO + 0.17, 0.85, 0.3));
};

// --- Colores ------------------------------------------------------------------------------------
const aRGB = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mezclar = (a: string, b: string, k: number) => {
  const [x, y] = [aRGB(a), aRGB(b)];
  return (x[0] + (y[0] - x[0]) * k) << 16 | (x[1] + (y[1] - x[1]) * k) << 8 | (x[2] + (y[2] - x[2]) * k);
};
const TINTA = mezclar(PALETA.fondo, PALETA.fondo, 0); // el número de la tinta, para Pixi

type Escena = {
  app: Application;
  planos: { capa: Container; gotas: Sprite[]; x0: Float32Array; y0: Float32Array; v: Float32Array; orden: Float32Array }[];
  cordillera: Container;
  sierras: Graphics[];
  cielo: Graphics;
  luz: Graphics;
  lagoLuz: Graphics;
  rayo: Graphics;
  salpicones: Graphics;
  sombras: ColorMatrixFilter;
};

/** Caída y deriva acumuladas por plano y por cuadro (integral de la velocidad): sin estado. */
const recorridos = (fps: number) =>
  PLANOS.map((pl) => {
    const caida = new Float32Array(DURACION + 1);
    const deriva = new Float32Array(DURACION + 1);
    for (let f = 1; f <= DURACION; f++) {
      const t = f / fps;
      const v = pl.vel * (0.75 + 0.45 * lluvia(t)) / fps;
      caida[f] = caida[f - 1] + v;
      deriva[f] = deriva[f - 1] + v * Math.tan(viento(t));
    }
    return { caida, deriva };
  });

/** El rayo: una quebrada con semilla que baja hasta la cresta media, con dos ramas. */
const trazarRayo = (sierra: [number, number][]) => {
  const r = azar(SEMILLA + 7);
  const destino = sierra.reduce((a, b) => (Math.abs(b[0] - 1240) < Math.abs(a[0] - 1240) ? b : a));
  const quebrada = (x0: number, y0: number, x1: number, y1: number, pasos: number, desvio: number) => {
    const pts: [number, number][] = [[x0, y0]];
    for (let i = 1; i < pasos; i++) {
      const k = i / pasos;
      pts.push([mix(x0, x1, k) + r.rango(-desvio, desvio), mix(y0, y1, k) + r.rango(-desvio, desvio) * 0.3]);
    }
    pts.push([x1, y1]);
    return pts;
  };
  const tronco = quebrada(1130, -10, destino[0], destino[1] + 4, 16, 34);
  const ramas = [tronco[5], tronco[9]].map(([x, y], i) => quebrada(x, y, x + (i ? 150 : -180), y + 170, 7, 22));
  return { tronco, ramas };
};

export const LluviaPixi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const contenedor = useRef<HTMLDivElement>(null);
  const [escena, setEscena] = useState<Escena | null>(null);
  const [espera] = useState(() => delayRender('pixi: creando el renderizador'));
  const rec = useMemo(() => recorridos(fps), [fps]);
  const sierras = useMemo(
    () => [perfil(11, HORIZONTE - 40, 340, 4, -60, 1980), perfil(29, HORIZONTE - 18, 230, 7, -60, 1980), perfil(5, HORIZONTE, 100, 11, -60, 1980)],
    [],
  );
  const rayoPts = useMemo(() => trazarRayo(sierras[1]), [sierras]);

  // Crear Pixi y la escena una vez; init() es asíncrono, así que se retiene el render.
  useEffect(() => {
    let vivo = true;
    const app = new Application();
    app
      .init({
        width,
        height,
        backgroundAlpha: 0,
        antialias: true,
        preference: 'webgl',
        autoStart: false,
        sharedTicker: false,
        preserveDrawingBuffer: true,
        resolution: 1,
      })
      .then(() => {
        if (!vivo || !contenedor.current) return;
        app.ticker.stop();
        contenedor.current.appendChild(app.canvas);
        const gl = (app.renderer as WebGLRenderer).gl;
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        // console.warn y no console.log: Remotion muestra los warn sin --log=verbose
        console.warn(
          `[lab06] Pixi ${app.renderer.name}: ${info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)} | ${gl.getParameter(gl.VERSION)} | búfer ${gl.drawingBufferWidth}×${gl.drawingBufferHeight}`,
        );
        const r = azar(SEMILLA);

        // el cielo que se cierra: bandas que se oscurecen hacia arriba (se anima su alfa)
        const cielo = new Graphics();
        // bandas de 2 px con bordes enteros: si se solapan, el solape se ve como rayas
        for (let y = 0; y < HORIZONTE; y += 2) {
          cielo.rect(0, y, width, Math.min(2, HORIZONTE - y)).fill({ color: TINTA, alpha: 0.9 * (1 - y / HORIZONTE) ** 1.4 + 0.1 });
        }
        // el fogonazo: el papel se vuelve luz (cielo y, más débil, el lago)
        const luz = new Graphics().rect(0, 0, width, HORIZONTE).fill('#fffdf7');
        const lagoLuz = new Graphics();
        for (let y = HORIZONTE; y < height; y += 2) {
          lagoLuz.rect(0, y, width, 2).fill({ color: '#fffdf7', alpha: 0.7 * (1 - (y - HORIZONTE) / (height - HORIZONTE)) });
        }

        // la cordillera en tres capas: perspectiva aérea (lejos: clara y borrosa)
        const cordillera = new Container();
        const tonos = [0.3, 0.55, 0.85];
        const borrones = [3.5, 1.2, 0];
        const sierrasG = sierras.map((s, i) => {
          const g = new Graphics();
          g.poly([...s.flat(), s[s.length - 1][0], HORIZONTE + 2, s[0][0], HORIZONTE + 2]).fill(mezclar(PALETA.papel, PALETA.fondo, tonos[i]));
          if (borrones[i]) g.filters = [new BlurFilter({ strength: borrones[i], quality: 3 })];
          cordillera.addChild(g);
          return g;
        });
        const sombras = new ColorMatrixFilter();
        cordillera.filters = [sombras];
        // el rayo cae detrás de la cordillera media: entre la capa lejana y la media
        const rayo = new Graphics();
        cordillera.addChildAt(rayo, 1);

        // el reflejo en el lago: la cordillera invertida, aplastada y borrosa (el agua da profundidad)
        const reflejo = new Container();
        sierras.forEach((s, i) => {
          const espejo = s.flatMap(([x, y]) => [x, HORIZONTE + (HORIZONTE - y) * 0.5]);
          reflejo.addChild(new Graphics().poly([...espejo, s[s.length - 1][0], HORIZONTE, s[0][0], HORIZONTE]).fill(mezclar(PALETA.papel, PALETA.fondo, tonos[i])));
        });
        reflejo.alpha = 0.32;
        reflejo.filters = [new BlurFilter({ strength: 6, quality: 3 }), sombras];

        // el lago: rayas horizontales con perspectiva (más juntas hacia el horizonte), quietas
        const lago = new Graphics();
        for (let i = 0; i < 46; i++) {
          const k = (i / 46) ** 1.9;
          const y = HORIZONTE + 6 + k * (height - HORIZONTE - 10);
          let x = r.rango(-80, 40);
          while (x < width) {
            const largo = r.rango(60, 320) * (0.5 + k);
            lago.moveTo(x, y).lineTo(x + largo, y);
            x += largo + r.rango(20, 140) * (0.4 + k);
          }
          lago.stroke({ color: TINTA, width: 0.6 + 1.6 * k, alpha: 0.12 + 0.28 * k });
        }
        const linea = new Graphics().moveTo(0, HORIZONTE).lineTo(width, HORIZONTE).stroke({ color: TINTA, width: 2, alpha: 0.85 });

        // la gota: un trazo afinado arriba (la cola) y lleno abajo (la cabeza); blanco para teñirlo
        const forma = new Graphics().poly([2, 0, 3.4, 54, 2, 64, 0.6, 54]).fill(0xffffff);
        const textura: Texture = app.renderer.generateTexture({ target: forma, resolution: 2 });

        const planos = PLANOS.map((pl) => {
          const capa = new Container();
          if (pl.desenfoque) capa.filters = [new BlurFilter({ strength: pl.desenfoque, quality: 3 })];
          const x0 = new Float32Array(pl.n), y0 = new Float32Array(pl.n), v = new Float32Array(pl.n), orden = new Float32Array(pl.n);
          const gotas = Array.from({ length: pl.n }, (_, i) => {
            const s = new Sprite(textura);
            s.anchor.set(0.5, 1);
            s.tint = TINTA;
            s.scale.set(pl.escala * r.rango(0.8, 1.2));
            x0[i] = r.rango(-300, width + 300);
            y0[i] = r.rango(0, height + 200);
            v[i] = r.rango(0.85, 1.15);
            orden[i] = r.n(); // qué gotas caen primero cuando llueve poco
            capa.addChild(s);
            return s;
          });
          return { capa, gotas, x0, y0, v, orden };
        });

        const salpicones = new Graphics();
        app.stage.addChild(cielo, luz, planos[0].capa, cordillera, reflejo, lago, lagoLuz, linea, salpicones, planos[1].capa, planos[2].capa);
        setEscena({ app, planos, cordillera, sierras: sierrasG, cielo, luz, lagoLuz, rayo, salpicones, sombras });
        continueRender(espera);
      })
      .catch((e) => cancelRender(e as Error));
    return () => {
      vivo = false;
      app.destroy?.(true, { children: true, texture: true });
    };
  }, [espera, width, height, sierras]);

  // Armar y dibujar el cuadro pedido antes de que Remotion saque la captura.
  useLayoutEffect(() => {
    if (!escena) return;
    const h = delayRender(`pixi: cuadro ${frame}`);
    try {
      const t = frame / fps;
      const ll = lluvia(t), fg = fogonazo(t), ang = viento(t);
      const entra = tramo(t, 0, 0.5, 'natural');

      escena.cielo.alpha = oscuridad(t) * (1 - fg);
      escena.luz.alpha = 0.95 * fg;
      escena.lagoLuz.alpha = 0.6 * fg;
      // con el fogonazo la cordillera se vuelve silueta: menos brillo y más contraste
      escena.sombras.brightness(1 - 0.75 * fg, false);
      escena.sombras.contrast(0.6 * fg, true);

      // lluvia: posición = semilla + caída acumulada del plano; cuántas caen depende de lluvia(t)
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
          const y = (((pl.y0[i] + caida[frame] * pl.v[i]) % H) + H) % H - 130;
          const x = (((pl.x0[i] - deriva[frame] * pl.v[i] - (y + 130) * Math.tan(ang) + 300) % W) + W) % W - 300;
          g.position.set(x, y);
          g.rotation = ang;
          // con el fogonazo, las gotas se marcan más: la luz las recorta
          g.alpha = base.alfa * entra * (1 + 0.8 * fg);
        }
      });

      // salpicones en el lago: anillos con perspectiva que nacen y se abren (con semilla, sin estado)
      const sp = escena.salpicones.clear();
      const r = azar(SEMILLA + 3);
      for (let i = 0; i < N_SALPICONES; i++) {
        const periodo = r.rango(0.35, 0.8), fase = r.n() * periodo, orden = r.n();
        const k = r.n() ** 1.7; // más cerca del horizonte, más chicos
        const x = r.rango(0, width);
        const ciclo = Math.floor((t + fase) / periodo);
        const edad = (t + fase) / periodo - ciclo;
        if (orden > ll || edad > 0.55) continue;
        const dx = azar(i * 977 + ciclo).rango(-60, 60); // cada ciclo cae en otro sitio
        const y = HORIZONTE + 8 + k * (height - HORIZONTE - 20);
        const radio = (4 + 26 * k) * (0.3 + edad * 1.6);
        sp.ellipse(x + dx, y, radio, radio * (0.12 + 0.12 * k)).stroke({ color: TINTA, width: 0.7 + 1.5 * k, alpha: (1 - edad / 0.55) * (0.25 + 0.4 * k) * entra });
      }

      // el rayo: baja en tres cuadros (guía), se sostiene y se apaga con el segundo pulso
      const rz = escena.rayo.clear();
      if (t >= RAYO && t < RAYO + 0.75) {
        const baja = clamp((t - RAYO) / 0.1);
        const vida = 1 - tramo(t, RAYO + 0.25, 0.5, 'ligero');
        const cuantos = Math.max(2, Math.ceil(rayoPts.tronco.length * baja));
        const dibujar = (pts: [number, number][], ancho: number) => {
          rz.moveTo(pts[0][0], pts[0][1]);
          for (const [x, y] of pts.slice(1)) rz.lineTo(x, y);
          rz.stroke({ color: TINTA, width: ancho, alpha: vida, join: 'miter' });
        };
        dibujar(rayoPts.tronco.slice(0, cuantos), 4.2);
        if (baja >= 1) rayoPts.ramas.forEach((rama) => dibujar(rama, 1.8));
      }

      escena.app.renderer.render(escena.app.stage);
      continueRender(h);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [frame, fps, width, escena, rec, rayoPts]);

  return (
    <AbsoluteFill>
      <Papel color={PALETA.papel} envejecido={0.45} />
      <div ref={contenedor} style={{ position: 'absolute', inset: 0 }} />
    </AbsoluteFill>
  );
};
