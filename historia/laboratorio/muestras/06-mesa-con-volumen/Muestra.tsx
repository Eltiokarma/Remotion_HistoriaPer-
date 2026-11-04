import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Atmosfera } from '../../../src/components/atmosfera/Atmosfera';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Pluma } from '../../../src/components/graficos/Pluma';
import { bordePapel, FiltroTinta, trazoManuscrito } from '../../../src/components/graficos/svg';
import { clamp, mix } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { alfa, mezclar } from '../../../src/estilo/color';
import { fuente } from '../../../src/estilo/fuentes';
import { ambiente, textura } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';
import {
  B, DOC, LAMPARA, LIBRO, MESA, PALABRA, RENGLON, SUBRAYADO,
  camara, estadoDoc, estadoLibro, estadoPluma, estela, luz as luzDe, posDoc, posLibro, posPluma, temblor,
  type EstadoHoja, type EstadoLibro,
} from './movimiento';

/**
 * Muestra 06 · La mesa con volumen (10 s). Responde al veredicto de Gerson sobre la tanda 1: «está
 * bien, pero se ve muy plano». La escena de la 05 (un documento llega a la mesa y el corrector señala
 * «Puno») con volumen, fluidez y detalle:
 *
 *   - espacio: mesa de madera en perspectiva (CSS 3D); la cámara se acerca y, al final, se abre;
 *   - luz: una lámpara que se enciende y tiembla con el golpe; su charco cálido y un relleno frío;
 *     el haz con polvo, y polvo cerca de la cámara, desenfocado;
 *   - sombras: blandas que dicen la altura, y de contacto, que apoyan las cosas en la mesa;
 *   - movimiento con física (movimiento.ts): la hoja planea, el libro golpea, la pluma escribe;
 *   - desenfoque de movimiento solo en lo que va rápido (obturador de 180°): lo quieto no cuesta;
 *   - detalle: hoja doblada en tres con borde irregular; libro con tapas que sobresalen, lomo con
 *     nervios y cinta; la pluma del catálogo; el grano del canal (Atmosfera).
 *
 * Beats: ver `B` en movimiento.ts. Contenido: escritura asémica salvo «Puno», como en la 05.
 */

const capa3d: React.CSSProperties = { position: 'absolute', transformStyle: 'preserve-3d' };
const lleno: React.CSSProperties = { position: 'absolute', inset: 0 };
const BORDE = bordePapel(61, 0, 0, DOC.w, DOC.h, 1.6);
const MADERA = mezclar(PALETA.ocre, PALETA.fondo, 0.66);
const CUERO = mezclar(PALETA.verde, PALETA.fondo, 0.45);

/** Sombra blanda en la mesa de algo que está a `alto` px: se corre lejos de la luz, se agranda, se ablanda y se aclara. */
const sombra = (cx: number, cy: number, alto: number, tiembla: number) => {
  const dx = cx - (LAMPARA.x + tiembla);
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

export const MesaConVolumen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cam = camara(t);
  const luz = luzDe(t);
  const tiembla = temblor(t);

  // la hoja, el libro y la pluma, con su estela (una copia si están quietos)
  const docVisible = t >= B.caeDoc;
  const copiasDoc = docVisible ? estela(posDoc, t, fps, 8).map(estadoDoc).sort((a, b) => a.alto - b.alto) : [];
  const doc = estadoDoc(t);
  const libroVisible = t >= B.caeLibro - 0.05;
  const copiasLibro = libroVisible ? estela(posLibro, t, fps, 12).map(estadoLibro).sort((a, b) => a.alto - b.alto) : [];
  const libro = estadoLibro(t);
  const pluma = estadoPluma(t);
  const copiasPluma = pluma.visible ? estela(posPluma, t, fps, 16).map(estadoPluma) : [];

  const sDoc = sombra(doc.x + DOC.w / 2, doc.y + DOC.h / 2, doc.alto, tiembla);
  const sLibro = sombra(LIBRO.x + LIBRO.w / 2, LIBRO.y + LIBRO.h / 2 + libro.dy, libro.alto, tiembla);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0a09', overflow: 'hidden' }}>
      {/* sonido: el cuarto, la lámpara, la hoja, el golpe, la pluma */}
      <Sequence layout="none" name="ambiente cuarto">
        <Audio src={ambiente('cuarto')} volume={(f) => 0.32 * interpolate(f, [0, 20, 280, 300], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sfx nombre="tic" en={B.enciende} fps={fps} volumen={0.45} />
      <Sfx nombre="hoja" en={B.tocaDoc - 0.1} fps={fps} volumen={0.5} />
      <Sfx nombre="golpe" en={B.tocaLibro} fps={fps} volumen={0.85} />
      <Sfx nombre="pluma" en={B.escribe} fps={fps} volumen={0.5} dura={0.7} />

      {/* el espacio: perspectiva de la cámara */}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: '50% 30%' }}>
        <div style={{ ...capa3d, left: 960 - MESA.w / 2, top: 540 - MESA.h / 2, width: MESA.w, height: MESA.h,
          transform: `translateY(${cam.y + 180}px) translateZ(${cam.z}px) rotateX(${cam.inclina}deg)` }}>
          {/* el piso, plano (sin preserve-3d): mesa, luz y sombras van juntas a z = 0 y los objetos en 3D
              siempre quedan encima (si no, Chrome a veces ordena una sombra sobre el papel) */}
          <div style={lleno}>
            <div style={{ ...lleno, backgroundColor: MADERA, backgroundImage: `url(${textura.madera})`, backgroundSize: '1300px 1300px', backgroundBlendMode: 'multiply' }} />
            {/* lo que la lámpara no alcanza queda a oscuras; antes de encenderse, todo */}
            <div style={{ ...lleno, background: `radial-gradient(ellipse 1500px 1250px at ${LAMPARA.x + tiembla}px ${LAMPARA.y + tiembla * 0.6}px, rgba(0,0,0,${mix(0.9, 0.08, luz)}) 0%, rgba(0,0,0,${mix(0.93, 0.5, luz)}) 45%, rgba(0,0,0,${mix(0.95, 0.86, luz)}) 75%)` }} />
            <div style={{ ...lleno, background: `radial-gradient(ellipse 1100px 900px at ${LAMPARA.x + tiembla}px ${LAMPARA.y + tiembla * 0.6}px, ${alfa(PALETA.ocre, 0.22 * luz)} 0%, rgba(0,0,0,0) 70%)` }} />
            {/* relleno frío desde la derecha: separa las sombras del negro */}
            <div style={{ ...lleno, background: `radial-gradient(ellipse 1300px 1100px at 3100px 500px, ${alfa(PALETA.verde, 0.1 * luz)} 0%, rgba(0,0,0,0) 70%)` }} />

            {/* sombras blandas (dicen la altura) */}
            {docVisible ? (
              <div style={{ position: 'absolute', left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h,
                transform: `translate(${doc.x - DOC.x + sDoc.x}px, ${doc.y - DOC.y + sDoc.y}px) rotate(${doc.giro}deg) scale(${sDoc.escala})`,
                background: alfa('#000000', sDoc.opacidad * mix(0.4, 1, luz)), filter: `blur(${sDoc.blur}px)`, borderRadius: 6 }} />
            ) : null}
            {libroVisible ? (
              <div style={{ position: 'absolute', left: LIBRO.x, top: LIBRO.y, width: LIBRO.w, height: LIBRO.h,
                transform: `translate(${sLibro.x + 26}px, ${sLibro.y + 30 + libro.dy}px) rotate(4deg) scale(${sLibro.escala})`,
                background: alfa('#000000', (sLibro.opacidad + 0.12) * mix(0.4, 1, luz)), filter: `blur(${sLibro.blur * 0.8}px)`, borderRadius: 8 }} />
            ) : null}
            {/* sombras de contacto: lo que toca la mesa, se apoya en ella */}
            {docVisible ? (
              <div style={{ position: 'absolute', left: DOC.x - 3, top: DOC.y - 3, width: DOC.w + 6, height: DOC.h + 6,
                transform: `translate(${doc.x - DOC.x + 3}px, ${doc.y - DOC.y + 4}px) rotate(${doc.giro}deg)`,
                background: alfa('#000000', 0.45 * (1 - clamp(doc.alto / 14))), filter: 'blur(3px)', borderRadius: 4 }} />
            ) : null}
            {libroVisible ? (
              <div style={{ position: 'absolute', left: LIBRO.x - 4, top: LIBRO.y - 4, width: LIBRO.w + 8, height: LIBRO.h + 8,
                transform: `translate(4px, ${libro.dy + 6}px) rotate(4deg)`,
                background: alfa('#000000', 0.8 * (1 - clamp(libro.alto / 24))), filter: 'blur(4px)', borderRadius: 6 }} />
            ) : null}
            {/* lo lejano de la mesa se pierde en lo oscuro: no se ve el borde */}
            <div style={{ ...lleno, background: 'linear-gradient(180deg, #0b0a09 0px, rgba(11,10,9,0) 900px)' }} />
          </div>

          {/* la hoja y su estela (ordenada de abajo arriba: así cada copia pesa lo mismo) */}
          {copiasDoc.map((e, i) => (
            <Hoja key={i} e={e} indice={i} alfaCopia={1 / (i + 1)} luz={luz} subraya={pluma.traza}
              pluma={copiasDoc.length === 1 && copiasPluma.length > 0 ? (
                <>
                  {copiasPluma.map((p, k) => (
                    <Pluma key={k} id={`lab06-pluma-${k}`} x={p.x} y={p.y} alzada={p.alzada} paleta={PALETA} escala={1.45} angulo={32} opacidad={1 / (k + 1)} />
                  ))}
                </>
              ) : null} />
          ))}

          {/* el libro y su estela */}
          {copiasLibro.map((e, i) => <Libro key={i} e={e} alfaCopia={1 / (i + 1)} luz={luz} />)}
        </div>
      </AbsoluteFill>

      {/* el haz de la lámpara y el polvo que flota en él */}
      <Haz t={t} luz={luz} golpe={B.tocaLibro} camara={cam.acerca - cam.abre * 0.4} tiembla={tiembla} />
      {/* polvo cerca de la cámara, fuera de foco (se mueve más que la mesa) */}
      <PolvoCercano t={t} luz={luz} camara={cam.acerca - cam.abre * 0.5} />
      {/* primer plano: lomos de libros desenfocados, cerca de la cámara */}
      <PrimerPlano acerca={cam.acerca} abre={cam.abre} luz={luz} />
      {/* el grano y la viñeta del canal */}
      <Atmosfera grano={0.07} vineta={0.6} />
    </AbsoluteFill>
  );
};

/** La hoja: doblada en tres, con borde irregular, la luz que cambia cuando se inclina y, si la hay, la pluma encima. */
const Hoja: React.FC<{ e: EstadoHoja; indice: number; alfaCopia: number; luz: number; subraya: number; pluma: React.ReactNode }> = ({ e, indice, alfaCopia, luz, subraya, pluma }) => {
  // inclinada hacia la lámpara (atrás a la izquierda) se aclara; hacia la cámara o a la derecha, se oscurece
  const sombreado = clamp(0.05 + 0.01 * e.inclinaY - 0.006 * e.inclinaX, 0, 0.35);
  return (
    <div style={{ ...capa3d, left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h,
      transform: `translate3d(${e.x - DOC.x}px, ${e.y - DOC.y}px, ${e.alto + 2}px) rotateZ(${e.giro}deg)` }}>
      <div style={{ ...capa3d, inset: 0, transformOrigin: '50% 100%', transform: `rotateX(${e.soplo}deg)` }}>
        <div style={{ ...capa3d, inset: 0, transform: `rotateX(${e.inclinaX}deg) rotateY(${e.inclinaY}deg)` }}>
          <div style={{ ...lleno, opacity: alfaCopia, clipPath: `path('${BORDE}')` }}>
            <Papel color={PALETA.papel} envejecido={0.45} />
            <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0 }}>
              <defs><FiltroTinta id={`lab06-tinta-${indice}`} /></defs>
              <g filter={`url(#lab06-tinta-${indice})`} fill="none" stroke={alfa(PALETA.fondo, 0.78)} strokeWidth={1.7} strokeLinecap="round">
                {Array.from({ length: 14 }, (_, i) => {
                  const y = 110 + i * RENGLON;
                  if (i === PALABRA.renglon) return <path key={i} d={trazoManuscrito(600 + i, 205, y, 330, 15)} />;
                  return <path key={i} d={trazoManuscrito(600 + i, 70, y, i === 13 ? 240 : 480, 15)} />;
                })}
              </g>
              <text x={PALABRA.x} y={110 + PALABRA.renglon * RENGLON} fontFamily={fuente.caligrafia} fontSize={46} fill={alfa(PALETA.fondo, 0.92)}>Puno</text>
              {/* el rojo de corrector: va justo detrás de la punta de la pluma */}
              <path d={SUBRAYADO} stroke={PALETA.rojo} strokeWidth={4.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - subraya} opacity={0.92} />
            </svg>
            {/* doblada en tres: el tercio de arriba mira a la lámpara, el de abajo no; cada pliegue con su filo de luz */}
            <div style={{ ...lleno, background: `linear-gradient(180deg,
              rgba(255,244,220,0.06) 0%, rgba(255,244,220,0.02) 33%, rgba(0,0,0,0.13) 33.4%, rgba(0,0,0,0.02) 36%,
              rgba(0,0,0,0) 66%, rgba(255,246,226,0.12) 66.4%, rgba(0,0,0,0.03) 67.5%, rgba(0,0,0,0.08) 100%)` }} />
            {/* la luz viene de atrás a la izquierda */}
            <div style={{ ...lleno, background: `linear-gradient(150deg, rgba(0,0,0,0) 0%, ${alfa('#000000', 0.36)} 100%)`, opacity: mix(1, 0.75, luz) }} />
            <div style={{ ...lleno, background: '#000', opacity: mix(0.82, sombreado, luz) }} />
          </div>
          {pluma ? (
            <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0, overflow: 'visible', transform: 'translateZ(1px)' }}>{pluma}</svg>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Una cara del libro: su color, lo que lleva encima y cuánto la oscurece la luz. */
const Cara: React.FC<{ estilo: React.CSSProperties; oscuro: number; alfaCopia: number; children?: React.ReactNode }> = ({ estilo, oscuro, alfaCopia, children }) => (
  <div style={{ position: 'absolute', opacity: alfaCopia, ...estilo }}>
    {children}
    <div style={{ ...lleno, background: '#000', opacity: oscuro, borderRadius: estilo.borderRadius }} />
  </div>
);

const TAPA = 6; // grosor de cada tapa
const CEJA = 8; // cuánto sobresalen las tapas del bloque de hojas
const HOJAS = (dir: string) => `repeating-linear-gradient(${dir}, ${mezclar(PALETA.papel, PALETA.ocre, 0.3)} 0px, ${mezclar(PALETA.papel, PALETA.ocre, 0.3)} 2.4px, ${mezclar(PALETA.papel, '#000000', 0.32)} 3.2px)`;

/** El libro: dos tapas que sobresalen del bloque de hojas, lomo redondeado con nervios y una cinta. */
const Libro: React.FC<{ e: EstadoLibro; alfaCopia: number; luz: number }> = ({ e, alfaCopia, luz }) => {
  const { w: W, h: H, grosor: G } = LIBRO;
  const s = Math.sqrt(e.golpe.sx);
  const o = (enLuz: number) => mix(0.85, enLuz, luz);
  const bordeTapa = (z: number) => [
    // canto de la tapa hacia la cámara y hacia la lámpara
    <Cara key={`f${z}`} alfaCopia={alfaCopia} oscuro={o(0.4)} estilo={{ left: 0, top: H, width: W, height: TAPA, transformOrigin: '50% 0', transform: `translateZ(${z}px) rotateX(90deg)`, backgroundColor: mezclar(CUERO, PALETA.ocre, 0.12) }} />,
    <Cara key={`i${z}`} alfaCopia={alfaCopia} oscuro={o(0.18)} estilo={{ left: -TAPA, top: 0, width: TAPA, height: H, transformOrigin: '100% 50%', transform: `translateZ(${z}px) rotateY(90deg)`, backgroundColor: mezclar(CUERO, PALETA.ocre, 0.12) }} />,
  ];
  return (
    <div style={{ ...capa3d, left: LIBRO.x, top: LIBRO.y, width: W, height: H, transformOrigin: '50% 50% 0',
      transform: `translate3d(0px, ${e.dy}px, ${e.alto + 2}px) rotateZ(4deg) scale3d(${s}, ${s}, ${e.golpe.sy})` }}>
      {/* tapa de arriba */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0)} estilo={{ left: 0, top: 0, width: W, height: H, transform: `translateZ(${G}px)`, borderRadius: 3, overflow: 'hidden',
        backgroundColor: CUERO, backgroundImage: `url(${textura.papel})`, backgroundSize: '700px 700px', backgroundBlendMode: 'multiply' }}>
        <div style={{ position: 'absolute', inset: 24, border: `2px solid ${alfa(PALETA.ocre, 0.42)}`, borderRadius: 2 }} />
        <div style={{ position: 'absolute', inset: 32, border: `1px solid ${alfa(PALETA.ocre, 0.25)}`, borderRadius: 2 }} />
        {/* esquinas gastadas por el uso */}
        <div style={{ ...lleno, background: `radial-gradient(circle at 0% 0%, ${alfa(PALETA.ocre, 0.35)} 0px, rgba(0,0,0,0) 40px),
          radial-gradient(circle at 100% 0%, ${alfa(PALETA.ocre, 0.25)} 0px, rgba(0,0,0,0) 34px),
          radial-gradient(circle at 0% 100%, ${alfa(PALETA.ocre, 0.3)} 0px, rgba(0,0,0,0) 38px),
          radial-gradient(circle at 100% 100%, ${alfa(PALETA.ocre, 0.22)} 0px, rgba(0,0,0,0) 30px)` }} />
        <div style={{ ...lleno, background: `linear-gradient(150deg, ${alfa(PALETA.ocre, 0.24)} 0%, rgba(0,0,0,0) 45%, ${alfa('#000000', 0.45)} 100%)` }} />
      </Cara>
      {bordeTapa(G - TAPA)}
      {bordeTapa(0)}
      {/* el bloque de hojas, metido CEJA px bajo las tapas */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.3)} estilo={{ left: CEJA, top: H - CEJA, width: W - CEJA, height: G - 2 * TAPA, transformOrigin: '50% 0', transform: `translateZ(${TAPA}px) rotateX(90deg)`, background: HOJAS('0deg') }} />
      <Cara alfaCopia={alfaCopia} oscuro={o(0.12)} estilo={{ left: CEJA - (G - 2 * TAPA), top: CEJA, width: G - 2 * TAPA, height: H - 2 * CEJA, transformOrigin: '100% 50%', transform: `translateZ(${TAPA}px) rotateY(90deg)`, background: HOJAS('90deg') }} />
      {/* la cinta: sale de entre las hojas y cuelga */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.25)} estilo={{ left: W * 0.62, top: H - CEJA, width: 13, height: 46, transformOrigin: '50% 0', transform: `translateZ(${G / 2}px) rotateX(-38deg)`,
        background: `linear-gradient(90deg, ${mezclar(PALETA.ocre, PALETA.fondo, 0.5)}, ${mezclar(PALETA.ocre, PALETA.fondo, 0.3)} 50%, ${mezclar(PALETA.ocre, PALETA.fondo, 0.55)})`,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)' }} />
      {/* lomo (a la derecha, a la sombra): redondeado, con nervios y el borde frío de la luz de relleno */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.38)} estilo={{ left: W, top: 0, width: G, height: H, transformOrigin: '0 50%', transform: 'rotateY(-90deg)', borderRadius: 8,
        background: `linear-gradient(180deg, rgba(0,0,0,0) 17%, ${alfa(PALETA.ocre, 0.2)} 18%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0) 21%,
          rgba(0,0,0,0) 37%, ${alfa(PALETA.ocre, 0.2)} 38%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 41%,
          rgba(0,0,0,0) 57%, ${alfa(PALETA.ocre, 0.2)} 58%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 61%,
          rgba(0,0,0,0) 77%, ${alfa(PALETA.ocre, 0.2)} 78%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0) 81%),
          linear-gradient(90deg, ${mezclar(CUERO, '#000000', 0.55)} 0%, ${mezclar(CUERO, PALETA.verde, 0.35)} 55%, ${mezclar(CUERO, '#000000', 0.4)} 100%)` }} />
    </div>
  );
};

const POLVO = (() => {
  const a = azar(606);
  return Array.from({ length: 110 }, () => ({
    x: a.rango(0, 1), y: a.rango(0, 1), r: a.rango(1.0, 3.2), fase: a.rango(0, Math.PI * 2),
    vel: a.rango(0.15, 0.5), brillo: a.rango(0.35, 1),
  }));
})();

/** El haz: un cono de luz desde arriba a la izquierda, con su foco, y polvo que flota y salta con el golpe. */
const Haz: React.FC<{ t: number; luz: number; golpe: number; camara: number; tiembla: number }> = ({ t, luz, golpe, camara, tiembla }) => {
  const corre = camara * 60;
  const arriba = { x1: 420 + corre + tiembla, x2: 720 + corre + tiembla, y: -60 };
  const abajo = { x1: 420 + corre * 1.4 + tiembla * 1.6, x2: 1640 + corre * 1.4 + tiembla * 1.6, y: 860 };
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
          <radialGradient id="lab06-foco">
            <stop offset="0" stopColor={PALETA.papel} stopOpacity={0.55} />
            <stop offset="0.35" stopColor={PALETA.ocre} stopOpacity={0.22} />
            <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
          </radialGradient>
          <filter id="lab06-suave"><feGaussianBlur stdDeviation={40} /></filter>
        </defs>
        <polygon points={`${arriba.x1},${arriba.y} ${arriba.x2},${arriba.y} ${abajo.x2},${abajo.y} ${abajo.x1},${abajo.y}`} fill="url(#lab06-haz)" filter="url(#lab06-suave)" />
        {/* el foco de la lámpara asoma por arriba, fuera de cuadro */}
        <ellipse cx={(arriba.x1 + arriba.x2) / 2} cy={-40} rx={360} ry={150} fill="url(#lab06-foco)" />
        {POLVO.map((p, i) => {
          const v = (p.y + t * 0.012 * p.vel) % 1;
          const xa = mix(arriba.x1, abajo.x1, v);
          const xb = mix(arriba.x2, abajo.x2, v);
          let x = mix(xa, xb, p.x) + Math.sin(t * p.vel * 1.3 + p.fase) * 14;
          let y = mix(arriba.y, abajo.y, v) + Math.cos(t * p.vel + p.fase) * 10;
          // el golpe del libro sopla el polvo de abajo hacia arriba y hacia afuera
          const cerca = clamp((v - 0.45) / 0.55);
          y -= empuje * cerca * 90 * p.brillo;
          x += empuje * cerca * (p.x - 0.5) * 120;
          const borde = Math.sin(Math.PI * clamp(p.x));
          return <circle key={i} cx={x} cy={y} r={p.r} fill={PALETA.papel} opacity={0.55 * p.brillo * borde * (1 - v * 0.5)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const CERCANO = (() => {
  const a = azar(707);
  return Array.from({ length: 9 }, () => ({ x: a.rango(0.05, 0.75), y: a.rango(0.05, 0.7), r: a.rango(14, 42), fase: a.rango(0, Math.PI * 2), vel: a.rango(0.1, 0.3) }));
})();

/** Polvo muy cerca de la cámara: grande, blando y lento. Da profundidad delante de todo. */
const PolvoCercano: React.FC<{ t: number; luz: number; camara: number }> = ({ t, luz, camara }) => (
  <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', opacity: luz }}>
    <svg width={1920} height={1080}>
      <defs>
        <radialGradient id="lab06-cercano">
          <stop offset="0" stopColor={PALETA.papel} stopOpacity={0.16} />
          <stop offset="0.6" stopColor={PALETA.ocre} stopOpacity={0.08} />
          <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
        </radialGradient>
      </defs>
      {CERCANO.map((p, i) => (
        <circle key={i} r={p.r} fill="url(#lab06-cercano)"
          cx={p.x * 1920 - camara * 140 + Math.sin(t * p.vel + p.fase) * 30}
          cy={p.y * 1080 + Math.cos(t * p.vel * 0.8 + p.fase) * 22 - t * 6} />
      ))}
    </svg>
  </AbsoluteFill>
);

/** Primer plano: unos lomos fuera de foco a la derecha, cerca de la cámara (paralaje). */
const PrimerPlano: React.FC<{ acerca: number; abre: number; luz: number }> = ({ acerca, abre, luz }) => {
  const k = acerca - abre * 0.5;
  const x = mix(80, -60, k);
  const s = mix(1, 1.18, k);
  const lomos = [
    { w: 120, h: 520, c: mezclar(PALETA.verde, '#000000', 0.72) },
    { w: 96, h: 470, c: mezclar(PALETA.ocre, '#000000', 0.75) },
    { w: 140, h: 560, c: mezclar(mezclar(PALETA.verde, PALETA.ocre, 0.4), '#000000', 0.78) }, // sin rojo: es del corrector y de la culpa
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
