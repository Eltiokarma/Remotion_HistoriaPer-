import { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { Sfx } from '../../../src/components/audio/Sfx';
import { tramo } from '../../../src/direction/anim';
import { FPS, PALETA } from '../../remotion/comun';
import { engraveShape, Ink, xf } from './vendor/burin';

/**
 * Muestra 14 · Grabado a buril sobre una forma de VectorCraft.
 *
 * Pregunta: ¿un motor de grabado en Canvas 2D (lemo-opuscar, MIT) convierte una silueta plana de
 * nuestras láminas en un grabado que se va cortando línea por línea, sin GPU y con el cuadro mandando?
 *
 * La forma es la isla principal de la lámina aprobada islas-guaneras-v3 (y las vetas de guano).
 * El buril corta en el orden del grabador, en tramos con su peso:
 *   0,2–1,4 s  el contorno (más grueso del lado de la sombra)
 *   1,4–2,6 s  primera familia de rayado (sigue la forma con la luz arriba a la izquierda)
 *   2,6–3,5 s  rayado cruzado en los medios tonos
 *   3,5–4,2 s  la tercera pasada (losange) en lo más oscuro; después queda quieto (4,2–5 s)
 * El tiempo que recibe el motor sale del cuadro: `t` del motor = tiempo de la escena pasado por un
 * peso del canal (`tramo`), así el buril arranca y frena como el resto del canal.
 */

// La isla de la lámina (polígono) y una veta de guano, en coordenadas de la lámina (1920 × 1080).
const ISLA = 'M164 631 L190 565 L210 553 L224 510 L253 490 L280 447 L311 445 L336 408 L375 398 L413 361 L444 366 L479 340 L512 350 L537 346 L573 366 L602 380 L637 386 L667 410 L707 418 L736 441 L780 443 L812 469 L849 472 L886 499 L916 500 L945 535 L983 544 L1008 582 L1030 591 L1042 657 L1008 686 L951 694 L872 679 L802 696 L720 681 L652 690 L572 674 L488 686 L407 672 L318 686 L244 668 L188 677 Z';
const GUANO = 'M355 477 C369 466.333 383.56 463.667 398.68 469 C409.88 473 423.32 472.667 439 468 L435 477 C412.6 478.333 395.8 477.333 384.6 474 Z';
/** Centramos la isla en el cuadro (su centro, ~603 × 517, va a 960 × 560) y la agrandamos 1,45 veces. */
const AT = xf(86, -190, 1.45);
const TRAMOS = { contorno: [0.2, 1.4], h1: [1.4, 2.6], h2: [2.6, 3.5], h3: [3.5, 4.2] } as const;

export const GrabadoBuril: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ref = useRef<HTMLCanvasElement>(null);
  // se arma una sola vez: geometría y orden de corte son deterministas (azar con semilla del motor)
  const ink = useMemo(() => {
    const tinta = new Ink({ color: PALETA.fondo });
    engraveShape(ISLA, { at: AT, ink: tinta, g: 'isla', spacing: 5, wMax: 1.9, outlineW: 2.4, light: [-0.6, -0.75], seed: 7 });
    engraveShape(GUANO, { at: AT, ink: tinta, g: 'guano', spacing: 3.2, wMax: 1.1, outlineW: 1.4, light: [-0.6, -0.75], seed: 11, style: 'contour' });
    // el motor agenda en «segundos de motor»: usamos 0–1 por pasada y el peso lo pone la escena
    tinta.schedule(['islaol', 'guanool'], 0, 1, { conc: 3 });
    tinta.schedule(['islah1', 'guanoh1'], 1, 2, { conc: 8 });
    tinta.schedule(['islah2', 'guanoh2'], 2, 3, { conc: 8 });
    tinta.schedule(['islah3', 'guanoh3'], 3, 4, { conc: 8 });
    return tinta.build();
  }, []);
  // tiempo del motor: cada pasada avanza con su peso (el contorno solemne, el rayado natural)
  const pasos = [
    tramo(t, TRAMOS.contorno[0], TRAMOS.contorno[1] - TRAMOS.contorno[0], 'solemne'),
    tramo(t, TRAMOS.h1[0], TRAMOS.h1[1] - TRAMOS.h1[0], 'natural'),
    tramo(t, TRAMOS.h2[0], TRAMOS.h2[1] - TRAMOS.h2[0], 'natural'),
    tramo(t, TRAMOS.h3[0], TRAMOS.h3[1] - TRAMOS.h3[0], 'pesado'),
  ];
  const tMotor = pasos.reduce((a, b) => a + b, 0);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ink.draw(ctx, tMotor);
  }, [ink, tMotor]);
  return (
    <AbsoluteFill>
      <Papel color={PALETA.papel} envejecido={0.35} />
      <canvas ref={ref} width={1920} height={1080} style={{ position: 'absolute', inset: 0 }} />
      {/* el sonido del buril en cada pasada (el beat principal es el contorno) */}
      <Sfx nombre="lapiz" en={TRAMOS.contorno[0]} fps={FPS} volumen={0.4} />
      <Sfx nombre="lapiz" en={TRAMOS.h1[0]} fps={FPS} volumen={0.25} />
      <Sfx nombre="lapiz" en={TRAMOS.h2[0]} fps={FPS} volumen={0.2} />
    </AbsoluteFill>
  );
};
