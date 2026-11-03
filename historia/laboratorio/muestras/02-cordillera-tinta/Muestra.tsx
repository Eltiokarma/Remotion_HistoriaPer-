import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { FiltroTinta } from '../../../src/components/graficos/svg';
import { clamp, tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { alfa } from '../../../src/estilo/color';
import { textura } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 02 · Cordillera, lago y barco que se dibujan con tinta.
 *
 * Qué se prueba: si un trazo procedural (SVG + Rough.js) se ve hecho a mano sin «hervir» (el temblor
 * que cambia en cada cuadro), y si se puede dibujar en orden, como lo haría una pluma.
 *
 * Decisiones:
 * - Rough.js solo genera la geometría (con `seed`: el mismo trazo en cada cuadro y en cada render);
 *   el dibujo progresivo es SVG puro (pathLength = 1 y stroke-dashoffset).
 * - El orden cuenta el paisaje: la sierra del fondo, la del frente, la sombra de sus laderas, el
 *   agua y al final el barco (lo único que va a moverse en una escena real).
 * - Una sola tinta (la del canal) y un lavado ocre en la vela: el color se reserva.
 */

const TINTA = PALETA.fondo;
const HORIZONTE = 640;

type Trazo = { d: string; ancho: number; color: string; desde: number; dura: number; peso: 'solemne' | 'pesado' | 'natural' | 'ligero'; recorte?: boolean };

/** Separa un path de Rough.js en sus subtrazos: cada uno se dibuja con su propio largo. */
const subtrazos = (d: string): string[] => d.split(/(?=M)/).map((s) => s.trim()).filter((s) => s.length > 2);

/**
 * Perfil andino: cimas y abras alternadas y después desplazamiento de punto medio (cuatro
 * pasadas, cada una con la mitad de amplitud): crestas quebradas, no triángulos de cuaderno.
 */
export const perfil = (semilla: number, base: number, alto: number, picos: number, x0 = 60, x1 = 1860): [number, number][] => {
  const r = azar(semilla);
  let pts: [number, number][] = [[x0, base - alto * r.rango(0.1, 0.25)]];
  for (let i = 0; i < picos; i++) {
    const xc = x0 + ((i + r.rango(0.3, 0.7)) / picos) * (x1 - x0);
    const xv = x0 + ((i + 1) / picos) * (x1 - x0) + r.rango(-20, 20);
    pts.push([xc, base - alto * r.rango(0.55, 1)]);
    pts.push([Math.min(xv, x1), base - alto * r.rango(0.15, 0.35)]);
  }
  for (let pasada = 0, amp = 0.16; pasada < 4; pasada++, amp *= 0.55) {
    const nuevos: [number, number][] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      const largo = Math.hypot(bx - ax, by - ay);
      nuevos.push([(ax + bx) / 2 + r.rango(-0.08, 0.08) * largo, (ay + by) / 2 + r.rango(-amp, amp) * largo], [bx, by]);
    }
    pts = nuevos;
  }
  return pts.map(([x, y]) => [x, Math.min(base, y)]);
};

/**
 * Laderas en sombra: la cara derecha de cada cima, entre la cresta (de la cima a la abra) y una
 * línea interior que baja de la cima hasta la altura de la abra. Así la sombra no pasa de la abra
 * ni baja en vertical hasta el horizonte (primera versión: un bloque rayado por debajo de la abra).
 */
const laderas = (pts: [number, number][], base: number): [number, number][][] => {
  const polis: [number, number][][] = [];
  for (let i = 2; i < pts.length - 2; i++) {
    const [x, y] = pts[i];
    if (y < pts[i - 1][1] && y <= pts[i + 1][1] && base - y > 150) {
      // bajar por la derecha hasta que el perfil vuelva a subir: la abra
      let j = i + 1;
      while (j < pts.length - 1 && pts[j + 1][1] >= pts[j][1]) j++;
      const lado = pts.slice(i, j + 1);
      const abra = lado[lado.length - 1];
      // la línea interior: de la abra hacia la cima, por dentro de la montaña
      const pie: [number, number] = [x + (abra[0] - x) * 0.22, abra[1] + (base - abra[1]) * 0.12];
      polis.push([...lado, pie]);
    }
  }
  return polis;
};

export const CordilleraTinta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const { lista: trazos, tapa, x0, x1 } = useMemo(() => {
    const gen = rough.generator();
    const lista: Trazo[] = [];
    const agregar = (drawable: ReturnType<typeof gen.curve>, color: string, ancho: number, desde: number, dura: number, peso: Trazo['peso'], escalonar = 0) => {
      const partes = gen.toPaths(drawable).flatMap((p) => subtrazos(p.d));
      partes.forEach((d, i) => lista.push({ d, ancho, color, desde: desde + i * escalonar, dura, peso }));
    };

    // 1. la sierra del fondo, tenue (0,0–1,4 s)
    const fondo = perfil(11, HORIZONTE - 6, 300, 8);
    agregar(gen.curve(fondo, { seed: 3, roughness: 0.9, bowing: 0.6, strokeWidth: 1.4 }), alfa(TINTA, 0.45), 1.4, 0.0, 1.4, 'solemne');
    // 2. la del frente, más negra (0,5–2,0 s)
    const frente = perfil(29, HORIZONTE, 430, 5, 120, 1800);
    agregar(gen.curve(frente, { seed: 5, roughness: 1.1, bowing: 0.8, strokeWidth: 2.4 }), TINTA, 2.4, 0.5, 1.5, 'solemne');
    // 3. la sombra de las laderas: rayado a pluma, de a una ladera (1,5–2,8 s)
    laderas(frente, HORIZONTE).forEach((poli, i) => {
      const relleno = gen.polygon(poli, {
        seed: 40 + i, stroke: 'none', fill: TINTA, fillStyle: 'hachure', hachureAngle: -52, hachureGap: 7, fillWeight: 1.1, roughness: 1.4,
      });
      gen.toPaths(relleno).flatMap((p) => subtrazos(p.d)).forEach((d, k) =>
        lista.push({ d, ancho: 1.1, color: alfa(TINTA, 0.7), desde: 1.5 + i * 0.16 + k * 0.012, dura: 0.22, peso: 'ligero', recorte: true }));
    });
    // 4. el agua: renglones horizontales, más separados y más largos hacia el frente (2,3–3,5 s)
    const r = azar(77);
    for (let i = 0; i < 16; i++) {
      const y = HORIZONTE + 14 + Math.pow(i / 15, 1.6) * 360;
      const cx = 960 + r.rango(-500, 500), largo = 160 + i * 52 + r.rango(-60, 60);
      const pts: [number, number][] = [];
      for (let x = cx - largo / 2; x <= cx + largo / 2; x += 30) pts.push([x, y + Math.sin(x * 0.02 + i) * 1.5]);
      agregar(gen.curve(pts, { seed: 100 + i, roughness: 0.8, strokeWidth: 1.2 }), alfa(TINTA, 0.32 + i * 0.02), 1 + i * 0.05, 2.3 + r.rango(0, 0.6), 0.55, 'ligero');
    }
    // la orilla
    agregar(gen.line(60, HORIZONTE, 1860, HORIZONTE, { seed: 9, roughness: 0.6, strokeWidth: 1.6 }), alfa(TINTA, 0.8), 1.6, 1.9, 0.9, 'natural');
    // la sierra del frente tapa a la del fondo: un relleno de papel con su forma
    const tapa = `M${frente[0][0]} ${HORIZONTE} ` + frente.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ` L${frente[frente.length - 1][0]} ${HORIZONTE} Z`;
    return { lista, tapa, x0: frente[0][0], x1: frente[frente.length - 1][0] };
  }, []);

  // el barco: una balsa de totora con su vela, dibujada al final (3,3–4,3 s)
  const barco = useMemo(() => {
    const gen = rough.generator();
    const bx = 1260, by = HORIZONTE + 200;
    // balsa de totora: dos haces curvos con las puntas levantadas, atados de trecho en trecho
    const casco = gen.path(`M${bx - 190} ${by - 58} Q${bx - 150} ${by + 14} ${bx} ${by + 16} Q${bx + 150} ${by + 14} ${bx + 196} ${by - 64}`, { seed: 60, roughness: 1, strokeWidth: 2.6 });
    const borda = gen.path(`M${bx - 186} ${by - 52} Q${bx - 130} ${by - 14} ${bx} ${by - 12} Q${bx + 130} ${by - 14} ${bx + 190} ${by - 58}`, { seed: 61, roughness: 1.1, strokeWidth: 1.8 });
    const amarras = [-120, -60, 0, 60, 120].map((dx, i) => gen.line(bx + dx - 3, by - 14, bx + dx + 3, by + 15, { seed: 64 + i, roughness: 0.8, strokeWidth: 1.4 }));
    const mastil = gen.line(bx - 8, by - 10, bx - 2, by - 250, { seed: 62, roughness: 0.6, strokeWidth: 2.2 });
    const vela: [number, number][] = [[bx + 2, by - 238], [bx + 112, by - 206], [bx + 104, by - 46], [bx + 2, by - 36]];
    const lienzo = gen.polygon(vela, { seed: 63, roughness: 1.2, strokeWidth: 1.8 });
    const reflejo = [0, 1, 2].map((i) => gen.line(bx - 150 + i * 40, by + 34 + i * 14, bx + 140 - i * 36, by + 34 + i * 14, { seed: 70 + i, roughness: 1.4, strokeWidth: 1 }));
    const partes = (d: ReturnType<typeof gen.line>) => gen.toPaths(d).filter((p) => p.stroke !== 'none').flatMap((p) => subtrazos(p.d));
    return {
      lineas: [
        ...partes(casco).map((d) => ({ d, desde: 3.3, dura: 0.5 })),
        ...partes(borda).map((d) => ({ d, desde: 3.45, dura: 0.4 })),
        ...amarras.flatMap((x, i) => partes(x).map((d) => ({ d, desde: 3.6 + i * 0.04, dura: 0.12 }))),
        ...partes(mastil).map((d) => ({ d, desde: 3.75, dura: 0.3 })),
        ...partes(lienzo).map((d) => ({ d, desde: 3.9, dura: 0.45 })),
        ...reflejo.flatMap((x, i) => partes(x).map((d) => ({ d, desde: 4.15 + i * 0.08, dura: 0.3 }))),
      ],
      vela,
      // lo que el barco tapa del agua y del horizonte: el casco y la vela, rellenos de papel
      cuerpo: `M${bx - 190} ${by - 58} Q${bx - 150} ${by + 14} ${bx} ${by + 16} Q${bx + 150} ${by + 14} ${bx + 196} ${by - 64} Q${bx + 130} ${by - 14} ${bx} ${by - 12} Q${bx - 130} ${by - 14} ${bx - 190} ${by - 58} Z`,
    };
  }, []);

  // la tapa va justo después de los trazos de la sierra del fondo
  const nFondo = trazos.findIndex((x) => x.desde === 0.5);
  const trazo = (s: (typeof trazos)[number], i: number) => {
    const k = tramo(t, s.desde, s.dura, s.peso);
    if (k <= 0) return null;
    // el rayado no sale de la silueta de la sierra (Rough.js tiembla y a veces asomaba por la cresta)
    return <path key={i} d={s.d} stroke={s.color} strokeWidth={s.ancho} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k}
      clipPath={s.recorte ? 'url(#lab02-silueta)' : undefined} />;
  };

  const lavado = tramo(t, 4.1, 0.6, 'natural');

  return (
    <AbsoluteFill>
      <Papel color={PALETA.papel} envejecido={0.4} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <FiltroTinta id="lab02-tinta" fuerza={1.4} />
          {/* la tapa avanza con la pluma (que dibuja la sierra del frente de izquierda a derecha) */}
          <clipPath id="lab02-silueta"><path d={tapa} /></clipPath>
          <clipPath id="lab02-avance"><rect x={0} y={0} width={x0 + (x1 - x0) * tramo(t, 0.5, 1.5, 'solemne')} height={1080} /></clipPath>
          <pattern id="lab02-papel" patternUnits="userSpaceOnUse" width={1024} height={1024}>
            <rect width={1024} height={1024} fill={PALETA.papel} />
            <image href={textura.papel} width={1024} height={1024} style={{ mixBlendMode: 'multiply' }} />
          </pattern>
        </defs>
        <g filter="url(#lab02-tinta)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {trazos.map((s, i) => {
            if (i === nFondo) return [<path key="tapa" d={tapa} fill="url(#lab02-papel)" clipPath="url(#lab02-avance)" />, trazo(s, i)];
            return trazo(s, i);
          })}
          <g opacity={tramo(t, 3.3, 0.45, 'natural')}>
            <path d={barco.cuerpo} fill="url(#lab02-papel)" />
            <polygon points={barco.vela.map((p) => p.join(',')).join(' ')} fill="url(#lab02-papel)" />
          </g>
          {/* el lavado de la vela entra debajo del trazo, como acuarela sobre tinta seca */}
          <polygon points={barco.vela.map((p) => p.join(',')).join(' ')} fill={alfa(PALETA.ocre, 0.55 * lavado)} stroke="none" />
          {barco.lineas.map((s, i) => {
            const k = tramo(t, s.desde, s.dura, 'natural');
            if (k <= 0) return null;
            return <path key={`b${i}`} d={s.d} stroke={TINTA} strokeWidth={1.9} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(k)} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
