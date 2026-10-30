import { clamp, mix, tramo } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';
import { fuente } from '../../estilo/fuentes';
import { Renglones } from '../texto/Renglones';

/** Dónde va la ilustración en la página derecha (16:9, para que el zoom termine en pantalla completa). */
export const ILUSTRACION = { x: 1020, y: 300, w: 560, h: 315 } as const;
const LOMO = 960, IZQ = 280, DER = 1640, ARR = 130, ABA = 950;

type Props = {
  paleta: Paleta;
  t: number;
  /** El libro entra cerrado. */
  tEntra: number;
  /** Se abre la tapa. */
  tAbre: number;
  /** La última hoja cae: queda la página con la ilustración. */
  tPagina: number;
  hojas?: number;
  /** Encabezado de la página de la ilustración (p. ej. "Siglo XIX"). */
  encabezado: string;
  /** La ilustración, dibujada a 1920×1080: se reduce a su caja en la página. */
  children: React.ReactNode;
};

const Hoja: React.FC<{ paleta: Paleta; lado: 'izq' | 'der'; semilla: number; children?: React.ReactNode }> = ({ paleta, lado, semilla, children }) => (
  <div style={{ position: 'absolute', left: lado === 'izq' ? IZQ : LOMO, top: ARR, width: DER - LOMO, height: ABA - ARR, overflow: 'hidden',
    background: `${paleta.papel} url(${textura.papel}) center/cover`, backgroundBlendMode: 'multiply',
    boxShadow: lado === 'izq' ? `inset -30px 0 40px -20px ${alfa('#000000', 0.35)}` : `inset 30px 0 40px -20px ${alfa('#000000', 0.35)}` }}>
    {children ?? (
      <div style={{ position: 'absolute', left: 70, top: 90 }}>
        <Renglones ancho={540} lineas={20} interlinea={34} alto={9} color={paleta.fondo} opacidad={0.3} semilla={semilla} />
      </div>
    )}
  </div>
);

/**
 * Un libro que entra cerrado, se abre y se hojea hasta una página con su ilustración. Sirve para
 * llegar a un grabado sin que se vea repetirse (DIRECCION_DE_VIDEO §2.12): la cámara hace zoom a la
 * ilustración desde la escena.
 */
export const LibroHojeable: React.FC<Props> = ({ paleta, t, tEntra, tAbre, tPagina, hojas = 5, encabezado, children }) => {
  const entra = tramo(t, tEntra, 1.2, 'pesado');
  const tapa = tramo(t, tAbre, 0.9, 'natural');
  const paso = (tPagina - (tAbre + 0.9)) / hojas;
  const flips = Array.from({ length: hojas }, (_, i) => tramo(t, tAbre + 0.9 + i * paso, Math.min(0.55, paso * 0.9), 'natural'));
  const pasadas = flips.filter((f) => f >= 1).length;
  const tela = mezclar(paleta.fondo, paleta.rojo, 0.35);
  // una hoja que gira sobre el lomo: de 1 (a la derecha) a -1 (a la izquierda)
  const gira = (k: number) => `translateX(${LOMO}px) scaleX(${1 - 2 * k}) translateX(${-LOMO}px)`;
  const final = pasadas >= hojas;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - entra) * 700}px)`, opacity: clamp(entra * 3) }}>
      {/* la sombra del libro sobre la mesa */}
      <div style={{ position: 'absolute', left: mix(LOMO, IZQ, tapa) - 10, top: ARR + 20, width: DER - mix(LOMO, IZQ, tapa) + 30, height: ABA - ARR + 10,
        background: alfa('#000000', 0.45), filter: 'blur(22px)' }} />
      {/* tapa de atrás (siempre a la derecha) y, cuando se abre, la página izquierda */}
      <div style={{ position: 'absolute', left: LOMO - 6, top: ARR - 10, width: DER - LOMO + 20, height: ABA - ARR + 20, background: tela, borderRadius: 6 }} />
      {tapa > 0.5 ? <div style={{ position: 'absolute', left: IZQ - 14, top: ARR - 10, width: LOMO - IZQ + 20, height: ABA - ARR + 20, background: tela, borderRadius: 6 }} /> : null}
      {tapa > 0.5 ? <Hoja paleta={paleta} lado="izq" semilla={40 + pasadas} /> : null}
      {/* la página de destino, debajo de todas */}
      <Hoja paleta={paleta} lado="der" semilla={90}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fuente.imprenta, fontSize: 40, letterSpacing: '0.3em',
          color: alfa(paleta.fondo, 0.8) }}>{encabezado.toUpperCase()}</div>
        <div style={{ position: 'absolute', left: ILUSTRACION.x - LOMO, top: ILUSTRACION.y - ARR, width: ILUSTRACION.w, height: ILUSTRACION.h, overflow: 'hidden' }}>
          <div style={{ width: 1920, height: 1080, transform: `scale(${ILUSTRACION.w / 1920})`, transformOrigin: '0 0' }}>{children}</div>
        </div>
        <div style={{ position: 'absolute', left: 70, top: ILUSTRACION.y - ARR + ILUSTRACION.h + 50 }}>
          <Renglones ancho={540} lineas={6} interlinea={34} alto={9} color={paleta.fondo} opacidad={0.3} semilla={91} />
        </div>
      </Hoja>
      {/* las hojas que faltan pasar: la siguiente quieta y, encima, la que gira */}
      {pasadas + 1 < hojas ? <Hoja paleta={paleta} lado="der" semilla={61 + pasadas} /> : null}
      {!final ? (
        <div style={{ position: 'absolute', inset: 0, transform: gira(flips[pasadas] ?? 0) }}>
          <Hoja paleta={paleta} lado="der" semilla={60 + pasadas} />
        </div>
      ) : null}
      {/* la tapa, que gira sobre el lomo */}
      {tapa < 1 ? (
        <div style={{ position: 'absolute', inset: 0, transform: gira(tapa) }}>
          <div style={{ position: 'absolute', left: LOMO, top: ARR - 10, width: DER - LOMO + 14, height: ABA - ARR + 20, borderRadius: 6,
            background: tapa < 0.5 ? tela : mezclar(paleta.papel, tela, 0.25),
            boxShadow: `inset 0 0 0 18px ${alfa('#000000', 0.12)}, inset 0 0 0 22px ${alfa(paleta.ocre, tapa < 0.5 ? 0.5 : 0)}` }} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: LOMO - 3, top: ARR, width: 6, height: ABA - ARR, background: alfa('#000000', 0.25) }} />
    </div>
  );
};
