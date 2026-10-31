import { asienta, clamp, mix, tramo } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';
import { fuente } from '../../estilo/fuentes';
import { Renglones } from '../texto/Renglones';

/** Dónde va la ilustración en la página derecha (16:9, para que el zoom termine en pantalla completa). */
export const ILUSTRACION = { x: 1020, y: 300, w: 560, h: 315 } as const;
const LOMO = 960, IZQ = 280, DER = 1640, ARR = 130, ABA = 950;
const W = DER - LOMO, H = ABA - ARR;
/** Tiras en que se parte una hoja para que se curve al pasar. */
const TIRAS = 6;

type Props = {
  paleta: Paleta;
  t: number;
  /** El libro entra cerrado. */
  tEntra: number;
  /** Se abre la tapa. */
  tAbre: number;
  /** La última hoja cae: queda la página con la ilustración (y el libro ya plano, de frente). */
  tPagina: number;
  hojas?: number;
  /** Encabezado de la página de la ilustración (p. ej. "Siglo XIX"). */
  encabezado: string;
  /** La ilustración, dibujada a 1920×1080: se reduce a su caja en la página. */
  children: React.ReactNode;
};

/**
 * Cuándo empieza y cuánto dura cada hoja. Se hojea como se busca algo: las primeras despacio, al
 * medio una ráfaga (varias en el aire a la vez) y la última frena y cae justo en `tPagina`.
 */
export const tiemposHojas = (tAbre: number, tPagina: number, hojas = 9) => {
  const dur = (u: number) => mix(0.95, 0.55, Math.sin(Math.PI * u));
  const ultima = 1.05;
  const A = tAbre + 1.0, B = tPagina - ultima;
  return Array.from({ length: hojas }, (_, i) => {
    const u = hojas > 1 ? i / (hojas - 1) : 1;
    // g(u) = u + a·sen(2πu)/2π: huecos grandes al principio y al final, chicos al medio
    const g = u + (0.7 * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
    return { desde: A + (B - A) * g, dura: i === hojas - 1 ? ultima : dur(u) };
  });
};

/** Una cara de hoja: papel con su sombra hacia el lomo y texto simulado (o lo que se le pase). */
const Cara: React.FC<{ paleta: Paleta; lado: 'izq' | 'der'; semilla: number; children?: React.ReactNode }> = ({ paleta, lado, semilla, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden',
    background: `${paleta.papel} url(${textura.papel}) center/cover`, backgroundBlendMode: 'multiply' }}>
    {children ?? (
      <>
        <div style={{ position: 'absolute', left: lado === 'der' ? 70 : 60, top: 60, width: 550, borderBottom: `1px solid ${alfa(paleta.fondo, 0.25)}`, height: 18 }}>
          <Renglones ancho={lado === 'der' ? 200 : 160} lineas={1} interlinea={10} alto={7} color={paleta.fondo} opacidad={0.3} semilla={semilla + 500}
            style={{ marginLeft: lado === 'der' ? 350 : 0 }} />
        </div>
        <div style={{ position: 'absolute', left: lado === 'der' ? 70 : 60, top: 110 }}>
          <Renglones ancho={550} lineas={19} interlinea={34} alto={9} color={paleta.fondo} opacidad={0.3} semilla={semilla} />
        </div>
        <div style={{ position: 'absolute', bottom: 34, [lado === 'der' ? 'right' : 'left']: 54, width: 22, height: 7, background: alfa(paleta.fondo, 0.3), borderRadius: 2 }} />
      </>
    )}
    {/* el papel se hunde hacia el lomo y se aclara hacia el canto */}
    <div style={{ position: 'absolute', inset: 0, background: lado === 'der'
      ? `linear-gradient(90deg, ${alfa('#000000', 0.32)} 0%, ${alfa('#000000', 0.08)} 7%, transparent 16%, transparent 92%, ${alfa('#000000', 0.06)} 100%)`
      : `linear-gradient(270deg, ${alfa('#000000', 0.32)} 0%, ${alfa('#000000', 0.08)} 7%, transparent 16%, transparent 92%, ${alfa('#000000', 0.06)} 100%)` }} />
  </div>
);

/**
 * Una hoja que gira sobre el lomo, partida en tiras para que se curve: la punta se queda atrás
 * mientras sube y se estira al caer. `k` va de 0 (a la derecha) a 1 (a la izquierda).
 */
const Pagina3D: React.FC<{ k: number; frente: React.ReactNode; dorso: React.ReactNode; ancho?: number; alto?: number; x?: number; y?: number; rigida?: boolean }> = ({
  k, frente, dorso, ancho = W, alto = H, x = LOMO, y = ARR, rigida = false,
}) => {
  const n = rigida ? 1 : TIRAS;
  const w = ancho / n;
  const curva = rigida ? 0 : Math.sin(Math.PI * k) * (k < 0.5 ? 13 : 9);
  const luzFrente = 0.38 * clamp(k * 1.6), luzDorso = 0.38 * clamp((1 - k) * 1.6);
  const tira = (i: number): React.ReactNode => (
    <div key={i} style={{ position: 'absolute', left: i === 0 ? x : w, top: i === 0 ? y : 0, width: w + (i < n - 1 ? 0.6 : 0), height: alto,
      transformOrigin: '0 50%', transformStyle: 'preserve-3d', transform: i === 0 ? `rotateY(${-180 * k}deg)` : `rotateY(${curva}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden' }}>
        <div style={{ position: 'absolute', left: -i * w, top: 0, width: ancho, height: alto }}>{frente}</div>
        <div style={{ position: 'absolute', inset: 0, background: alfa('#000000', luzFrente * (0.6 + (0.4 * i) / n)) }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        <div style={{ position: 'absolute', left: -(n - 1 - i) * w, top: 0, width: ancho, height: alto }}>{dorso}</div>
        <div style={{ position: 'absolute', inset: 0, background: alfa('#000000', luzDorso * (0.6 + (0.4 * i) / n)) }} />
      </div>
      {i < n - 1 ? tira(i + 1) : null}
    </div>
  );
  return <>{tira(0)}</>;
};

/**
 * Un libro que entra cerrado, se abre y se hojea hasta una página con su ilustración. Sirve para
 * llegar a un grabado sin que se vea repetirse (DIRECCION_DE_VIDEO §2.12): la cámara hace zoom a la
 * ilustración desde la escena. Tiene volumen: está echado sobre la mesa (en perspectiva) y se
 * endereza de frente antes del zoom; las hojas se curvan, dan sombra y hacen crecer el bloque de la
 * izquierda.
 */
export const LibroHojeable: React.FC<Props> = ({ paleta, t, tEntra, tAbre, tPagina, hojas = 9, encabezado, children }) => {
  const entra = tramo(t, tEntra, 1.5, 'pesado');
  const tapa = tramo(t, tAbre, 1.3, 'pesado');
  // cerrado, el libro está centrado; al abrirse se corre para que el pliego quede al medio
  const corre = tramo(t, tAbre - 0.1, 1.5, 'solemne');
  const plano = tramo(t, tPagina - 1.9, 1.9, 'solemne');
  const inclina = 26 * (1 - plano) + 16 * (1 - entra);
  const gira = -5 * (1 - plano) + 3 * (1 - entra);
  const cae = (1 - entra) * 950 - 6 * asienta(t, tEntra + 1.5, 1, 6, 4);
  const ts = tiemposHojas(tAbre, tPagina, hojas);
  const ks = ts.map((h) => tramo(t, h.desde, h.dura, 'natural'));
  const enAire = ks.map((k, i) => ({ k, i })).filter((h) => h.k > 0 && h.k < 1);
  const quietaDer = ks.findIndex((k) => k <= 0);
  const pasadas = ks.filter((k) => k >= 1).length;
  const tela = mezclar(paleta.fondo, paleta.rojo, 0.35);
  const guarda = mezclar(paleta.papel, paleta.ocre, 0.45);
  // grosor de los bloques: el de la derecha baja y el de la izquierda crece
  const bloqueDer = 2 + Math.round(5 * (1 - pasadas / hojas)), bloqueIzq = tapa >= 1 ? 1 + Math.round(5 * (pasadas / hojas)) : 0;
  const pagina = (lado: 'izq' | 'der', semilla: number) => <Cara paleta={paleta} lado={lado} semilla={semilla} />;
  const destino = (
    <Cara paleta={paleta} lado="der" semilla={90}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fuente.imprenta, fontSize: 40, letterSpacing: '0.3em',
        color: alfa(paleta.fondo, 0.8) }}>{encabezado.toUpperCase()}</div>
      <div style={{ position: 'absolute', left: ILUSTRACION.x - LOMO, top: ILUSTRACION.y - ARR, width: ILUSTRACION.w, height: ILUSTRACION.h, overflow: 'hidden' }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${ILUSTRACION.w / 1920})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
      <div style={{ position: 'absolute', left: 70, top: ILUSTRACION.y - ARR + ILUSTRACION.h + 50 }}>
        <Renglones ancho={540} lineas={6} interlinea={34} alto={9} color={paleta.fondo} opacidad={0.3} semilla={91} />
      </div>
    </Cara>
  );
  const tapaFrente = (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '4px 10px 10px 4px', background: `${tela} url(${textura.papel}) center/cover`, backgroundBlendMode: 'multiply',
      boxShadow: `inset 0 0 0 3px ${alfa('#000000', 0.25)}, inset 14px 0 18px -10px ${alfa('#000000', 0.5)}` }}>
      <div style={{ position: 'absolute', inset: 30, border: `2px solid ${alfa(paleta.ocre, 0.55)}`, boxShadow: `0 1px 0 ${alfa('#ffffff', 0.12)}, inset 0 1px 0 ${alfa('#000000', 0.3)}` }} />
      <div style={{ position: 'absolute', inset: 40, border: `1px solid ${alfa(paleta.ocre, 0.35)}` }} />
      <div style={{ position: 'absolute', left: '50%', top: '42%', width: 46, height: 46, marginLeft: -23, transform: 'rotate(45deg)', border: `2px solid ${alfa(paleta.ocre, 0.6)}` }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, ${alfa('#ffffff', 0.1)} 0%, transparent 40%, ${alfa('#000000', 0.18)} 100%)` }} />
    </div>
  );
  const tapaDorso = (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '10px 4px 4px 10px', background: tela }}>
      <div style={{ position: 'absolute', inset: 14, background: `${guarda} url(${textura.papel}) center/cover`, backgroundBlendMode: 'multiply',
        backgroundImage: `repeating-linear-gradient(35deg, ${alfa(paleta.fondo, 0.06)} 0 2px, transparent 2px 9px), url(${textura.papel})` }} />
    </div>
  );
  const TAPA = { x: LOMO, y: ARR - 12, w: W + 14, h: H + 24 };
  const izqBase = pasadas > 0 ? (
    <div style={{ position: 'absolute', left: IZQ, top: ARR }}>{pagina('izq', 61 + pasadas - 1 + 300)}</div>
  ) : null;
  const sombraHoja = (k: number) => {
    // la sombra que la hoja en el aire deja sobre la página de abajo
    const a = 0.32 * Math.sin(Math.PI * k);
    const derecha = k < 0.5;
    const ancho = W * Math.abs(Math.cos(Math.PI * k)) + 60;
    return (
      <div style={{ position: 'absolute', top: ARR, height: H, left: derecha ? LOMO : LOMO - ancho, width: ancho,
        background: `linear-gradient(${derecha ? 90 : 270}deg, ${alfa('#000000', a)} 0%, ${alfa('#000000', a * 0.5)} 60%, transparent 100%)` }} />
    );
  };
  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 2400, perspectiveOrigin: '50% 20%', opacity: clamp(entra * 3) }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '960px 640px',
        transform: `translate(${-340 * (1 - corre)}px, ${cae}px) rotateX(${inclina}deg) rotateZ(${gira}deg)` }}>
        {/* la sombra del libro sobre la mesa */}
        <div style={{ position: 'absolute', left: mix(LOMO, IZQ, corre) - 16, top: ARR + 26, width: DER - mix(LOMO, IZQ, corre) + 44, height: H + 18,
          background: alfa('#000000', 0.55), filter: 'blur(26px)' }} />
        {/* la tapa de atrás y el canto de las hojas (el grosor) */}
        <div style={{ position: 'absolute', left: LOMO - 4, top: ARR - 12, width: W + 18, height: H + 24, background: mezclar(tela, '#000000', 0.25), borderRadius: '4px 10px 10px 4px' }} />
        {Array.from({ length: bloqueDer }, (_, i) => (
          <div key={`d${i}`} style={{ position: 'absolute', left: LOMO, top: ARR + (bloqueDer - i) * 1.6, width: W + (bloqueDer - i) * 1.8, height: H,
            background: mezclar(paleta.papel, paleta.fondo, 0.12 + 0.05 * (bloqueDer - i)), borderRadius: '0 3px 3px 0' }} />
        ))}
        {tapa >= 1 ? <Pagina3D k={1} rigida ancho={TAPA.w} alto={TAPA.h} x={TAPA.x} y={TAPA.y} frente={tapaFrente} dorso={tapaDorso} /> : null}
        {Array.from({ length: bloqueIzq }, (_, i) => (
          <div key={`i${i}`} style={{ position: 'absolute', left: IZQ - (bloqueIzq - i) * 1.8, top: ARR + (bloqueIzq - i) * 1.6, width: W + (bloqueIzq - i) * 1.8, height: H,
            background: mezclar(paleta.papel, paleta.fondo, 0.12 + 0.05 * (bloqueIzq - i)), borderRadius: '3px 0 0 3px' }} />
        ))}
        {/* la página de destino, debajo de todas */}
        <div style={{ position: 'absolute', left: LOMO, top: ARR }}>{destino}</div>
        {izqBase}
        {quietaDer >= 0 && quietaDer < hojas ? <div style={{ position: 'absolute', left: LOMO, top: ARR }}>{pagina('der', 61 + quietaDer)}</div> : null}
        {/* las hojas en el aire, con su sombra y su curva */}
        <div style={{ position: 'absolute', inset: 0, perspective: 2600, perspectiveOrigin: `${LOMO}px 540px` }}>
          {enAire.map(({ k, i }) => (
            <div key={i} style={{ position: 'absolute', inset: 0 }}>
              {sombraHoja(k)}
              <Pagina3D k={k} frente={pagina('der', 61 + i)} dorso={pagina('izq', 61 + i + 300)} />
            </div>
          ))}
          {/* la tapa: cerrada encima de todo; al abrirse, gira sobre el lomo */}
          {tapa < 1 ? (
            <>
              {tapa > 0 ? sombraHoja(tapa) : null}
              <Pagina3D k={tapa} rigida ancho={TAPA.w} alto={TAPA.h} x={TAPA.x} y={TAPA.y} frente={tapaFrente} dorso={tapaDorso} />
            </>
          ) : null}
        </div>
        {/* el lomo */}
        {tapa > 0.5 ? <div style={{ position: 'absolute', left: LOMO - 4, top: ARR, width: 8, height: H, background: `linear-gradient(90deg, transparent, ${alfa('#000000', 0.3)}, transparent)` }} /> : null}
        {/* la luz de la lámpara sobre el libro: se va cuando el libro queda de frente (para que el zoom empalme) */}
        <div style={{ position: 'absolute', left: tapa > 0.5 ? IZQ - 14 : LOMO, top: ARR - 12, width: DER + 14 - (tapa > 0.5 ? IZQ - 14 : LOMO), height: H + 24, opacity: 1 - plano,
          background: `radial-gradient(ellipse at 35% 25%, ${alfa('#fff3dc', 0.14)} 0%, transparent 55%, ${alfa('#000000', 0.22)} 100%)` }} />
      </div>
    </div>
  );
};
