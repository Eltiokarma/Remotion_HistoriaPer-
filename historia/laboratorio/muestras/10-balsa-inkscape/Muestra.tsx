import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, Audio, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { clamp, tramo } from '../../../src/direction/anim';
import { ambiente } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 10 · Balsa de totora al amanecer: dibujada en Inkscape por MCP, animada en Remotion.
 *
 * El dibujo lo hizo Inkscape (servidor MCP inksmcp) con las llamadas que escribe `dibujo.py`: capas,
 * franjas de tono, nieve recortada a la montaña (intersección), casco de la balsa unido (unión y trazo a
 * forma), amarres recortados al casco (clip). Remotion carga ese SVG y anima sus grupos por id.
 *
 * Coreografía (movimiento.md), cámara quieta:
 *   Protagonista: la balsa. Deriva despacio; a los 2,0 s la boga empuja con la pértiga: la balsa cede
 *     apenas hacia atrás (anticipación) y toma impulso hacia la proa (peso 'pesado').
 *   Apoyo: la pértiga gira en la mano; en el cuadro del empuje, la gota (sonido) y los anillos en el
 *     agua, que nacen donde la pértiga toca el agua (lo secundario atado al golpe).
 *   Decoración: líneas del agua que derivan; la totora que se mece; el reflejo sigue a la balsa.
 *   Quieto: cielo, sol, cerros, isla.
 */

const SVG = staticFile('laboratorio/10-balsa.svg');
const EMPUJE = 2.0; // s (cuadro 60)
const LINEA_AGUA = 818; // y donde la balsa toca el agua (eje del reflejo)
const MANO = { x: 1063, y: 640 }; // donde la boga sostiene la pértiga (giro)
const PUNTA = { x: 985, y: 845 }; // donde la pértiga toca el agua

/** Desplazamiento de la balsa (px, hacia la proa = derecha). */
const avance = (t: number) => {
  const deriva = 9 * t; // venía andando
  const cede = -5 * tramo(t, EMPUJE - 0.2, 0.2, 'natural') * (1 - tramo(t, EMPUJE, 0.15, 'natural')); // anticipación
  const impulso = 70 * tramo(t, EMPUJE, 2.2, 'pesado');
  return deriva + cede + impulso;
};
/** Ángulo de la pértiga (grados): se carga hacia atrás antes del empuje y empuja. */
const pertiga = (t: number) => -4 * tramo(t, EMPUJE - 0.5, 0.5, 'natural') + 13 * tramo(t, EMPUJE, 0.9, 'pesado');

export const BalsaInkscape: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caja = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [espera] = useState(() => delayRender('svg de Inkscape'));
  const [listo, setListo] = useState(false);

  useEffect(() => {
    fetch(SVG)
      .then((r) => r.text())
      .then((texto) => setSvg(texto))
      .catch((e) => cancelRender(e as Error));
  }, []);

  // una vez insertado: el reflejo (un <use> de la balsa, invertido sobre la línea del agua, debajo de las
  // líneas del agua para que estas lo corten) y los anillos
  useLayoutEffect(() => {
    if (!svg || !caja.current || listo) return;
    const raiz = caja.current.querySelector('svg');
    const lineas = raiz?.querySelector('#agua-lineas');
    if (!raiz || !lineas) return cancelRender(new Error('el SVG no trae #agua-lineas'));
    raiz.setAttribute('width', '100%');
    raiz.setAttribute('height', '100%');
    const ns = 'http://www.w3.org/2000/svg';
    const reflejo = document.createElementNS(ns, 'use');
    reflejo.setAttribute('href', '#balsa');
    reflejo.setAttribute('transform', `matrix(1 0 0 -0.55 0 ${LINEA_AGUA * 1.55})`);
    reflejo.setAttribute('opacity', '0.22');
    lineas.parentNode!.insertBefore(reflejo, lineas);
    const anillos = document.createElementNS(ns, 'g');
    anillos.setAttribute('id', 'anillos');
    for (let i = 0; i < 3; i++) {
      const e = document.createElementNS(ns, 'ellipse');
      e.setAttribute('fill', 'none');
      e.setAttribute('stroke', PALETA.papel);
      anillos.appendChild(e);
    }
    raiz.appendChild(anillos);
    setListo(true);
    continueRender(espera);
  }, [svg, listo, espera]);

  useLayoutEffect(() => {
    if (!listo || !caja.current) return;
    const t = frame / fps;
    const $ = (id: string) => caja.current!.querySelector(`#${id}`);
    $('balsa')?.setAttribute('transform', `translate(${avance(t).toFixed(2)} 0)`);
    $('pertiga')?.setAttribute('transform', `rotate(${pertiga(t).toFixed(2)} ${MANO.x} ${MANO.y})`);
    // el agua deriva despacio; la totora se mece desde su base (inclinación, no giro)
    $('agua-lineas')?.setAttribute('transform', `translate(${(-6 * t).toFixed(2)} 0)`);
    const meneo = (fase: number, amp: number) => amp * Math.sin(t * 1.6 + fase) + amp * 0.4 * Math.sin(t * 3.7 + fase * 2);
    $('totora-izq')?.setAttribute('transform', `translate(0 1090) skewX(${meneo(0, 1.6).toFixed(3)}) translate(0 -1090)`);
    $('totora-der')?.setAttribute('transform', `translate(0 1090) skewX(${meneo(1.3, 1.2).toFixed(3)}) translate(0 -1090)`);
    // anillos: nacen en el cuadro del empuje, donde la pértiga toca el agua, y se abren y apagan
    const x = PUNTA.x + avance(EMPUJE);
    caja.current.querySelectorAll('#anillos ellipse').forEach((e, i) => {
      const edad = t - EMPUJE - i * 0.18;
      const k = clamp(edad / 1.6);
      const r = 6 + 120 * tramo(edad, 0, 1.6, 'ligero');
      e.setAttribute('cx', x.toFixed(1));
      e.setAttribute('cy', String(PUNTA.y));
      e.setAttribute('rx', r.toFixed(1));
      e.setAttribute('ry', (r * 0.16).toFixed(1));
      e.setAttribute('stroke-width', (2.2 - 1.2 * k).toFixed(2));
      e.setAttribute('opacity', edad < 0 ? '0' : (0.7 * (1 - k)).toFixed(3));
    });
  }, [frame, fps, listo]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <div ref={caja} style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={svg ? { __html: svg } : undefined} />
      {/* el grano del papel del canal, encima del dibujo vectorial */}
      <Papel color="#ffffff" envejecido={0.45} style={{ mixBlendMode: 'multiply', opacity: 0.45 }} />
      {/* sonido: el agua del lago, baja; la gota en el cuadro del empuje (el beat principal) */}
      <Audio src={ambiente('agua')} volume={(f) => 0.25 * interpolate(f, [0, 20, 130, 150], [0, 1, 1, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      <Sfx nombre="gota" en={EMPUJE} fps={fps} volumen={0.8} />
    </AbsoluteFill>
  );
};
