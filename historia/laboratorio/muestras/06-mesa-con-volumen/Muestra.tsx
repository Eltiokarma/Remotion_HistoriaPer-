import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { Sfx } from '../../../src/components/audio/Sfx';
import { FiltroTinta, trazoManuscrito } from '../../../src/components/graficos/svg';
import { asienta, clamp, impacto, mix, tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { alfa, mezclar } from '../../../src/estilo/color';
import { fuente } from '../../../src/estilo/fuentes';
import { ambiente, textura } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 06 · La mesa con volumen (10 s). Responde al veredicto de Gerson sobre la tanda 1: «está
 * bien, pero se ve muy plano». Es la misma escena que la 05 (un documento llega a la mesa y el
 * corrector señala «Puno»), pero buscando lo que le da volumen y vida:
 *
 *   - espacio: la mesa en perspectiva (CSS 3D), la cámara que se acerca y se abre;
 *   - luz con intención: una lámpara que se enciende, su charco en la mesa, el haz con polvo;
 *   - sombra que dice la altura: mientras el papel cae, su sombra se achica y se afila;
 *   - capas: un primer plano desenfocado que se mueve más que la mesa (paralaje);
 *   - objetos con cuerpo: un libro con lomo y cantos, que golpea y levanta el polvo;
 *   - contraste de ritmo: quietud, golpe, quietud, trazo.
 *
 * Beats (s):
 *   0,0–1,2  la lámpara se enciende (titila una vez). Cámara quieta.
 *   1,2–3,4  la cámara se acerca a la mesa (pesado). Motivo: la luz nos invita a mirar.
 *   3,6–4,3  el documento cae planeando; aterriza en 4,3 (hoja).
 *   4,3–5,6  quietud.
 *   5,6–6,15 el libro cae (tenso); golpe en 6,15: se aplasta apenas, el papel se levanta, el polvo salta.
 *   6,15–7,2 quietud.
 *   7,2–7,8  el rojo de corrector subraya «Puno» (lápiz).
 *   8,2–9,4  la cámara se abre (solemne): el tablero entero. Los objetos, quietos.
 *   9,4–10   quieto.
 *
 * Contenido: escritura asémica salvo «Puno», como en la 05. Sin citas, fechas ni cifras.
 */

// la mesa, en sus coordenadas (px antes de la perspectiva)
const MESA = { w: 3600, h: 2600 };
const LAMPARA = { x: 1450, y: 600 }; // dónde cae la luz en la mesa (atrás a la izquierda)
const DOC = { x: 1330, y: 640, w: 620, h: 800 };
const LIBRO = { x: 2080, y: 470, w: 440, h: 600, grosor: 64 };
const RENGLON = 46;
const PALABRA = { renglon: 6, x: 70 };

// beats
const ENCIENDE = 0.15;
const ACERCA = 1.2;
const CAE_DOC = 3.6;
const TOCA_DOC = 4.3;
const CAE_LIBRO = 5.6;
const TOCA_LIBRO = 6.15;
const SUBRAYA = 7.2;
const ABRE = 8.2;

/** Sombra en la mesa de algo que está a `alto` px: se corre lejos de la luz, se agranda, se ablanda y se aclara. */
const sombra = (cx: number, cy: number, alto: number) => {
  const dx = cx - LAMPARA.x;
  const dy = cy - LAMPARA.y;
  const d = Math.hypot(dx, dy) || 1;
  const corre = alto * 0.55;
  return {
    x: (dx / d) * corre + 10,
    y: (dy / d) * corre + 14,
    blur: 10 + alto * 0.09,
    escala: 1 + alto * 0.0006,
    opacidad: 0.62 * (1 - clamp(alto / 900)) + 0.1,
  };
};

const capa3d: React.CSSProperties = { position: 'absolute', transformStyle: 'preserve-3d' };

export const MesaConVolumen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // la lámpara: sube, titila una vez y se asienta
  const titila = t > 0.32 && t < 0.4 ? 0.45 : 1;
  const luz = tramo(t, ENCIENDE, 1.0, 'natural') * titila;

  // la cámara: se acerca y, al final, se abre un poco para ver el tablero entero
  const acerca = tramo(t, ACERCA, 2.2, 'pesado');
  const abre = tramo(t, ABRE, 1.2, 'solemne');
  const camZ = mix(-520, 0, acerca) - 260 * abre;
  const camY = mix(120, 0, acerca) - 40 * abre;
  const inclina = mix(62, 56, acerca) + 2 * abre;

  // el documento cae planeando: baja, se desliza en arco y gira; al tocar se asienta con un roce
  const kDoc = tramo(t, CAE_DOC, TOCA_DOC - CAE_DOC, 'tenso');
  const docVisible = t >= CAE_DOC - 0.05;
  const docAlto = mix(760, 0, kDoc);
  const docDx = mix(-260, 0, tramo(t, CAE_DOC, TOCA_DOC - CAE_DOC, 'natural')) + asienta(t, TOCA_DOC, 10, 6, 4);
  const docGiro = mix(-14, -2.2, kDoc) + asienta(t, TOCA_DOC, 0.9, 7, 3.5);
  const docInclina = Math.sin(kDoc * Math.PI * 2) * 9 * (1 - kDoc); // el planeo
  // el golpe del libro levanta apenas el borde del papel (acción secundaria). El giro va siempre hacia
  // arriba (negativo): positivo, el papel atraviesa la mesa y desaparece bajo su propia sombra
  const soplo = t > TOCA_LIBRO ? 6 * Math.exp(-(t - TOCA_LIBRO) * 5) * Math.sin((t - TOCA_LIBRO) * 22) : 0;

  // el libro cae recto y pesado; al tocar se aplasta como cartón y el área no cambia
  const kLibro = tramo(t, CAE_LIBRO, TOCA_LIBRO - CAE_LIBRO, 'tenso');
  const libroVisible = t >= CAE_LIBRO - 0.05;
  const libroAlto = mix(520, 0, kLibro);
  // entra desde el fondo oscuro, en arco (no pasa por delante de la cámara)
  const libroDy = mix(-420, 0, tramo(t, CAE_LIBRO, TOCA_LIBRO - CAE_LIBRO, 'natural'));
  const golpe = impacto(t, TOCA_LIBRO, 0.05);

  const subraya = tramo(t, SUBRAYA, 0.6, 'ligero');

  const sDoc = sombra(DOC.x + DOC.w / 2, DOC.y + DOC.h / 2, docAlto);
  const sLibro = sombra(LIBRO.x + LIBRO.w / 2, LIBRO.y + LIBRO.h / 2, libroAlto);

  // luz sobre los objetos: más oscuro lo que está lejos de la lámpara
  const oscuridad = (base: number) => mix(0.82, base, luz);

  const tinta = PALETA.fondo;
  const cuero = mezclar(PALETA.verde, PALETA.fondo, 0.45);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0a09', overflow: 'hidden' }}>
      {/* sonido: el cuarto, la lámpara, la hoja, el golpe, el lápiz */}
      <Sequence layout="none" name="ambiente cuarto">
        <Audio src={ambiente('cuarto')} volume={(f) => 0.32 * interpolate(f, [0, 20, 280, 300], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sfx nombre="tic" en={ENCIENDE} fps={fps} volumen={0.45} />
      <Sfx nombre="hoja" en={TOCA_DOC - 0.12} fps={fps} volumen={0.55} />
      <Sfx nombre="golpe" en={TOCA_LIBRO} fps={fps} volumen={0.85} />
      <Sfx nombre="lapiz" en={SUBRAYA} fps={fps} volumen={0.5} dura={0.75} />

      {/* el espacio: perspectiva de la cámara */}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: '50% 30%' }}>
        <div style={{ ...capa3d, left: 960 - MESA.w / 2, top: 540 - MESA.h / 2, width: MESA.w, height: MESA.h,
          transform: `translateY(${camY + 180}px) translateZ(${camZ}px) rotateX(${inclina}deg)` }}>
          {/* el piso de la escena, plano (sin preserve-3d): mesa, luz y sombras se dibujan juntas a z = 0 y
              los objetos en 3D siempre quedan encima (si no, Chrome a veces ordena la sombra sobre el papel) */}
          <div style={{ position: 'absolute', inset: 0 }}>
          {/* la mesa: oscura, con el charco de luz de la lámpara */}
          <div style={{ position: 'absolute', inset: 0,
            backgroundColor: '#14110e',
            backgroundImage: `url(${textura.papel})`, backgroundSize: '900px 900px', backgroundBlendMode: 'multiply' }} />
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 1500px 1250px at ${LAMPARA.x}px ${LAMPARA.y}px, ${alfa(PALETA.ocre, 0.42 * luz)} 0%, ${alfa(PALETA.ocre, 0.16 * luz)} 38%, rgba(0,0,0,0) 72%)` }} />

          {/* sombras en la mesa */}
          {docVisible ? (
            <div style={{ position: 'absolute', left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h,
              transform: `translate(${sDoc.x + docDx}px, ${sDoc.y}px) rotate(${docGiro}deg) scale(${sDoc.escala})`,
              background: alfa('#000000', sDoc.opacidad * mix(0.4, 1, luz)), filter: `blur(${sDoc.blur}px)`, borderRadius: 6 }} />
          ) : null}
          {libroVisible ? (
            <div style={{ position: 'absolute', left: LIBRO.x, top: LIBRO.y, width: LIBRO.w, height: LIBRO.h,
              transform: `translate(${sLibro.x + 26}px, ${sLibro.y + 30 + libroDy}px) rotate(4deg) scale(${sLibro.escala})`,
              background: alfa('#000000', (sLibro.opacidad + 0.12) * mix(0.4, 1, luz)), filter: `blur(${sLibro.blur * 0.8}px)`, borderRadius: 8 }} />
          ) : null}
          {/* lo lejano de la mesa se pierde en lo oscuro: no se ve el borde */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0b0a09 0px, rgba(11,10,9,0) 900px)' }} />
          </div>

          {/* el documento */}
          {docVisible ? (
            <div style={{ ...capa3d, left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h, transformOrigin: '50% 100%',
              transform: `translateX(${docDx}px) translateZ(${docAlto + 2}px) rotateZ(${docGiro}deg) rotateX(${-Math.abs(docInclina) - Math.abs(soplo)}deg)` }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <Papel color={PALETA.papel} envejecido={0.45} />
                <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0 }}>
                  <defs><FiltroTinta id="lab06-tinta" /></defs>
                  <g filter="url(#lab06-tinta)" fill="none" stroke={alfa(tinta, 0.78)} strokeWidth={1.7} strokeLinecap="round">
                    {Array.from({ length: 14 }, (_, i) => {
                      const y = 110 + i * RENGLON;
                      if (i === PALABRA.renglon) return <path key={i} d={trazoManuscrito(600 + i, 205, y, 330, 15)} />;
                      return <path key={i} d={trazoManuscrito(600 + i, 70, y, i === 13 ? 240 : 480, 15)} />;
                    })}
                  </g>
                  <text x={PALABRA.x} y={110 + PALABRA.renglon * RENGLON} fontFamily={fuente.caligrafia} fontSize={46} fill={alfa(tinta, 0.92)}>Puno</text>
                  <path d={`M${PALABRA.x - 8} ${120 + PALABRA.renglon * RENGLON} q 52 5 118 -3`} stroke={PALETA.rojo} strokeWidth={4.5} fill="none"
                    strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - subraya} opacity={0.92} />
                </svg>
                {/* la luz sobre el papel: viene de atrás a la izquierda */}
                <div style={{ position: 'absolute', inset: 0,
                  background: `linear-gradient(150deg, rgba(0,0,0,0) 0%, ${alfa('#000000', 0.38)} 100%)`, opacity: mix(1, 0.75, luz) }} />
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: oscuridad(0.04) }} />
              </div>
            </div>
          ) : null}

          {/* el libro: una caja con tapa, cantos de papel y lomo */}
          {libroVisible ? (
            <div style={{ ...capa3d, left: LIBRO.x, top: LIBRO.y, width: LIBRO.w, height: LIBRO.h, transformOrigin: '50% 50% 0',
              transform: `translateY(${libroDy}px) translateZ(${libroAlto + 2}px) rotateZ(4deg) scale3d(${Math.sqrt(golpe.sx)}, ${Math.sqrt(golpe.sx)}, ${golpe.sy})` }}>
              {/* tapa */}
              <div style={{ position: 'absolute', inset: 0, transform: `translateZ(${LIBRO.grosor}px)`, borderRadius: 4, overflow: 'hidden',
                backgroundColor: cuero, backgroundImage: `url(${textura.papel})`, backgroundSize: '700px 700px', backgroundBlendMode: 'multiply' }}>
                <div style={{ position: 'absolute', inset: 26, border: `2px solid ${alfa(PALETA.ocre, 0.45)}`, borderRadius: 2 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(150deg, ${alfa(PALETA.ocre, 0.22)} 0%, rgba(0,0,0,0) 45%, ${alfa('#000000', 0.45)} 100%)` }} />
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: oscuridad(0) }} />
              </div>
              {/* canto de abajo (hacia la cámara): las hojas */}
              <div style={{ position: 'absolute', left: 0, top: LIBRO.h, width: LIBRO.w, height: LIBRO.grosor, transformOrigin: '50% 0', transform: 'rotateX(90deg)',
                background: `repeating-linear-gradient(0deg, ${mezclar(PALETA.papel, PALETA.ocre, 0.35)} 0px, ${mezclar(PALETA.papel, PALETA.ocre, 0.35)} 3px, ${mezclar(PALETA.papel, '#000000', 0.35)} 4px)` }}>
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: mix(0.85, 0.32, luz) }} />
              </div>
              {/* canto izquierdo (hacia la lámpara) */}
              <div style={{ position: 'absolute', left: -LIBRO.grosor, top: 0, width: LIBRO.grosor, height: LIBRO.h, transformOrigin: '100% 50%', transform: 'rotateY(90deg)',
                background: `repeating-linear-gradient(90deg, ${mezclar(PALETA.papel, PALETA.ocre, 0.25)} 0px, ${mezclar(PALETA.papel, PALETA.ocre, 0.25)} 3px, ${mezclar(PALETA.papel, '#000000', 0.3)} 4px)` }}>
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: mix(0.85, 0.12, luz) }} />
              </div>
              {/* lomo (derecha, a la sombra) */}
              <div style={{ position: 'absolute', left: LIBRO.w, top: 0, width: LIBRO.grosor, height: LIBRO.h, transformOrigin: '0 50%', transform: 'rotateY(-90deg)',
                backgroundColor: mezclar(cuero, '#000000', 0.35), borderRadius: 6 }}>
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: mix(0.85, 0.45, luz) }} />
              </div>
              {/* canto de atrás */}
              <div style={{ position: 'absolute', left: 0, top: -LIBRO.grosor, width: LIBRO.w, height: LIBRO.grosor, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)',
                backgroundColor: mezclar(PALETA.papel, '#000000', 0.5) }} />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {/* el haz de la lámpara y el polvo que flota en él */}
      <Haz t={t} luz={luz} golpe={TOCA_LIBRO} camara={acerca - abre * 0.4} />

      {/* primer plano: lomos de libros desenfocados, cerca de la cámara (se mueven más: paralaje) */}
      <PrimerPlano acerca={acerca} abre={abre} luz={luz} />

      {/* viñeta: el ojo va al charco de luz */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 70% at 48% 52%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const POLVO = (() => {
  const a = azar(606);
  return Array.from({ length: 90 }, () => ({
    x: a.rango(0, 1), y: a.rango(0, 1), r: a.rango(1.2, 3.4), fase: a.rango(0, Math.PI * 2),
    vel: a.rango(0.15, 0.5), brillo: a.rango(0.35, 1),
  }));
})();

/** El haz: un cono de luz desde arriba a la izquierda, con polvo que flota y salta con el golpe. */
const Haz: React.FC<{ t: number; luz: number; golpe: number; camara: number }> = ({ t, luz, golpe, camara }) => {
  // el cono, en pantalla: de la lámpara (fuera de cuadro) al charco
  const corre = camara * 60;
  const arriba = { x1: 420 + corre, x2: 720 + corre, y: -60 };
  const abajo = { x1: 420 + corre * 1.4, x2: 1640 + corre * 1.4, y: 860 };
  const empuje = t > golpe ? (1 - Math.exp(-(t - golpe) * 4)) * Math.exp(-(t - golpe) * 0.7) : 0;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', opacity: luz }}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="lab06-haz" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={PALETA.ocre} stopOpacity={0.42} />
            <stop offset="0.6" stopColor={PALETA.ocre} stopOpacity={0.14} />
            <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
          </linearGradient>
          <filter id="lab06-suave"><feGaussianBlur stdDeviation={40} /></filter>
        </defs>
        <polygon points={`${arriba.x1},${arriba.y} ${arriba.x2},${arriba.y} ${abajo.x2},${abajo.y} ${abajo.x1},${abajo.y}`} fill="url(#lab06-haz)" filter="url(#lab06-suave)" />
        {POLVO.map((p, i) => {
          // posición dentro del cono (v: de arriba abajo; u: de un borde al otro)
          const v = (p.y + t * 0.012 * p.vel) % 1;
          const xa = mix(arriba.x1, abajo.x1, v);
          const xb = mix(arriba.x2, abajo.x2, v);
          let x = mix(xa, xb, p.x) + Math.sin(t * p.vel * 1.3 + p.fase) * 14;
          let y = mix(arriba.y, abajo.y, v) + Math.cos(t * p.vel + p.fase) * 10;
          // el golpe del libro sopla el polvo de abajo hacia arriba y hacia afuera
          const cerca = clamp((v - 0.45) / 0.55);
          y -= empuje * cerca * 90 * p.brillo;
          x += empuje * cerca * (p.x - 0.5) * 120;
          const borde = Math.sin(Math.PI * clamp(p.x)); // más brillo en el centro del haz
          return <circle key={i} cx={x} cy={y} r={p.r} fill={PALETA.papel} opacity={0.55 * p.brillo * borde * (1 - v * 0.5)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Primer plano: unos lomos fuera de foco a la derecha, cerca de la cámara. */
const PrimerPlano: React.FC<{ acerca: number; abre: number; luz: number }> = ({ acerca, abre, luz }) => {
  const k = acerca - abre * 0.5;
  const x = mix(80, -60, k);
  const s = mix(1, 1.18, k);
  const lomos = [
    { w: 120, h: 520, c: mezclar(PALETA.verde, '#000000', 0.72) },
    { w: 96, h: 470, c: mezclar(PALETA.ocre, '#000000', 0.75) },
    { w: 140, h: 560, c: mezclar(PALETA.rojo, '#000000', 0.8) },
  ];
  let izq = 0;
  return (
    <div style={{ position: 'absolute', right: -150, bottom: -160, width: 420, height: 700,
      transform: `translateX(${x}px) scale(${s})`, transformOrigin: '100% 100%', filter: 'blur(26px)' }}>
      {lomos.map((l, i) => {
        const el = (
          <div key={i} style={{ position: 'absolute', left: izq, bottom: 0, width: l.w, height: l.h, backgroundColor: l.c, borderRadius: 10,
            boxShadow: `inset 12px 0 18px ${alfa(PALETA.ocre, 0.22 * luz)}` }} />
        );
        izq += l.w + 6;
        return el;
      })}
    </div>
  );
};
