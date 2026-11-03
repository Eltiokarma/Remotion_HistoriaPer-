import p5 from 'p5';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { clamp, tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { textura } from '../../../src/estilo/recursos';
import { DURACION, PALETA } from '../../remotion/comun';
import { perfil } from '../02-cordillera-tinta/Muestra';

/**
 * Muestra 03 · Viento sobre el lago con líneas y partículas (p5.js).
 *
 * Qué se prueba: si un campo de flujo (ruido de Perlin de p5) da un movimiento que se lee como
 * viento y agua sin perder la identidad de tinta sobre papel, y si p5 se deja gobernar por el
 * cuadro de Remotion (nada de draw() en bucle: el cuadro manda).
 *
 * Cómo:
 * - p5 en modo instancia, sin bucle (noLoop). Solo se usa para el ruido con semilla y para dibujar.
 * - La simulación se calcula entera una vez (posiciones de todas las partículas en los 150
 *   cuadros) con el ruido de p5 y azar() del canal: cada cuadro solo dibuja su tramo. El mismo
 *   cuadro da siempre la misma imagen, en cualquier orden y en cualquier hilo de render.
 * - Arriba, el viento: trazos largos que siguen el campo. Abajo, el agua: el mismo campo, aplastado
 *   y lento, en rayitas horizontales. El horizonte separa los dos.
 * - Una ráfaga: la velocidad sube hacia los 2,3 s y se calma al final (el viento también respira).
 */

const N_AIRE = 300;
const N_AGUA = 420;
const ESTELA = 30; // cuadros de estela que se dibujan
const HORIZONTE = 600;
const SEMILLA = 23;

type Pista = Float32Array; // x0, y0, x1, y1, ... para cada cuadro

/** Intensidad del viento en el tiempo: arranca, ráfaga, se calma. */
const rafaga = (t: number) => 0.35 + 0.9 * tramo(t, 0.2, 1.9, 'natural') - 0.75 * tramo(t, 2.8, 2.0, 'solemne');

const simular = (p: p5, fps: number): { aire: Pista[]; agua: Pista[] } => {
  p.noiseSeed(SEMILLA);
  const r = azar(SEMILLA);
  const pistas = (n: number, agua: boolean): Pista[] =>
    Array.from({ length: n }, () => {
      const pista = new Float32Array(DURACION * 2);
      let x = r.rango(-300, 1920);
      let y = agua ? r.rango(HORIZONTE + 12, 1060) : r.rango(70, HORIZONTE - 150);
      let altura = y; // cada hilo de viento tiene su altura y vuelve a ella (sin amontonarse)
      const vel = r.rango(0.6, 1.3);
      for (let f = 0; f < DURACION; f++) {
        const t = f / fps;
        const v = rafaga(t);
        if (agua) {
          // el agua: lenta, casi horizontal, más lenta cuanto más lejos (más cerca del horizonte)
          const prof = (y - HORIZONTE) / (1080 - HORIZONTE);
          const a = (p.noise(x * 0.0022, y * 0.006, t * 0.25) - 0.5) * 0.5;
          x += Math.cos(a) * v * (2.2 + 4 * prof);
          y += Math.sin(a) * 0.35;
          if (x > 1980) x -= 2160;
        } else {
          // el aire: ángulo del campo, sesgado hacia la derecha (el viento viene del oeste)
          // el campo se curva (remolinos suaves) y cada hilo tiene su velocidad (lejos/cerca)
          const a = (p.noise(x * 0.0011, y * 0.0018, t * 0.5) - 0.5) * 3.4;
          x += Math.cos(a) * v * 10 * vel + v * 3;
          y += Math.sin(a) * v * 7 * vel + (altura - y) * 0.025;
          // lo que sale por la derecha vuelve a entrar por la izquierda, a otra altura (sin estela)
          if (x > 1980) { x -= 2160; y = altura = r.rango(70, HORIZONTE - 150); }
        }
        pista[f * 2] = x;
        pista[f * 2 + 1] = y;
      }
      return pista;
    });
  return { aire: pistas(N_AIRE, false), agua: pistas(N_AGUA, true) };
};

export const VientoP5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const contenedor = useRef<HTMLDivElement>(null);
  const [lienzo, setLienzo] = useState<p5 | null>(null);
  const [espera] = useState(() => delayRender('p5: creando el lienzo'));

  // crear la instancia de p5 una vez; p5 2.x llama a setup() de forma asíncrona
  useEffect(() => {
    if (!contenedor.current) return;
    const inst = new p5((p: p5) => {
      p.setup = () => {
        p.createCanvas(width, height);
        p.pixelDensity(1);
        p.noLoop();
        setLienzo(p);
        continueRender(espera);
      };
    }, contenedor.current);
    return () => inst.remove();
  }, [espera, width, height]);

  const sierra = useMemo(() => perfil(11, HORIZONTE, 210, 8), []);
  const sim = useMemo(() => (lienzo ? simular(lienzo, fps) : null), [lienzo, fps]);

  // dibujar el cuadro pedido (antes de que Remotion saque la captura)
  useLayoutEffect(() => {
    if (!lienzo || !sim) return;
    const h = delayRender(`p5: cuadro ${frame}`);
    try {
      const p = lienzo;
      const t = frame / fps;
      p.clear();
      const tinta = p.color(PALETA.fondo);
      // el aire: estelas largas que se adelgazan hacia la cola
      const entra = tramo(t, 0, 0.6, 'natural');
      for (const pista of sim.aire) {
        for (let k = Math.max(1, frame - ESTELA); k <= frame; k++) {
          const u = (k - (frame - ESTELA)) / ESTELA; // 0 cola → 1 cabeza
          tinta.setAlpha(255 * 0.42 * u * entra);
          p.stroke(tinta);
          p.strokeWeight(0.5 + 1.6 * u);
          const x0 = pista[(k - 1) * 2], x1 = pista[k * 2];
          if (x1 < x0) continue; // dio la vuelta: no unir los dos bordes
          p.line(x0, pista[(k - 1) * 2 + 1], x1, pista[k * 2 + 1]);
        }
      }
      // el agua: rayitas cortas, horizontales, que se estiran con la ráfaga
      for (const pista of sim.agua) {
        const x = pista[frame * 2], y = pista[frame * 2 + 1];
        const prof = clamp((y - HORIZONTE) / (1080 - HORIZONTE));
        const largo = (6 + 26 * prof) * (0.6 + rafaga(t));
        tinta.setAlpha(255 * (0.18 + 0.4 * prof) * entra);
        p.stroke(tinta);
        p.strokeWeight(0.8 + 1.4 * prof);
        p.line(x - largo / 2, y, x + largo / 2, y);
      }
      // la cordillera al fondo, quieta y tenue: el lugar donde sopla (la misma de la muestra 02)
      tinta.setAlpha(255 * 0.5);
      p.stroke(tinta);
      p.strokeWeight(1.3);
      p.noFill();
      p.beginShape();
      for (const [x, y] of sierra) p.vertex(x, y);
      p.endShape();
      // el horizonte, firme: lo único que no se mueve
      tinta.setAlpha(255 * 0.85);
      p.stroke(tinta);
      p.strokeWeight(1.8);
      p.line(40, HORIZONTE, 1880, HORIZONTE);
      continueRender(h);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [frame, fps, lienzo, sim, sierra]);

  return (
    <AbsoluteFill>
      <Img src={textura.papel} style={{ display: 'none' }} />
      <Papel color={PALETA.papel} envejecido={0.4} />
      <div ref={contenedor} style={{ position: 'absolute', inset: 0 }} />
    </AbsoluteFill>
  );
};
