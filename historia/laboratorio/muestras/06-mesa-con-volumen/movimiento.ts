import { getLength, getPointAtLength } from '@remotion/paths';
import { arqueo, asienta, clamp, impacto, mix, tramo, type Escala } from '../../../src/direction/anim';

/**
 * El movimiento de la muestra 06 como funciones puras del tiempo (segundos). Las usa la muestra para
 * dibujar y `laboratorio/scripts/fluidez.ts` para medir, sin navegador, si algo frena en seco, se
 * cuelga o salta de un cuadro al otro.
 *
 * Unidades: la hoja y el libro en px de la mesa (antes de la perspectiva); la pluma en px del papel.
 */

export const FPS = 30;
export const DURACION_S = 10;

/** Beats (s). */
export const B = {
  enciende: 0.15,
  acerca: 1.2,
  caeDoc: 3.45, // la hoja entra desde la cámara, ya en movimiento
  tocaDoc: 4.4, // apoya: el colchón de aire la frenó
  deslizaFin: 4.9, // termina de deslizarse por roce
  caeLibro: 5.6,
  tocaLibro: 6.15,
  entraPluma: 6.65,
  escribe: 7.15,
  salePluma: 7.8,
  abre: 8.2,
} as const;

export const MESA = { w: 3600, h: 2600 };
/** El escritorio: la tapa (px de la mesa), su grosor y el faldón con el cajón. Detrás, la pared (y = 0). */
export const ESCRITORIO = { x0: 500, x1: 3100, y0: 0, y1: 1900, grosor: 90, faldon: 330 };
/** Dónde cae la luz de la lámpara en la mesa (centro del charco). */
export const LAMPARA = { x: 1450, y: 600 };
/** La lámpara de banquero: base en la mesa; la pantalla, de `largo` px, con su borde de abajo a `altoPantalla`. */
export const LAMPARA_3D = { x: 1450, y: 400, altoPantalla: 760, largo: 700, alto: 1000 };
/** La pila de libros de la esquina (quieta). */
export const PILA = [
  { x: 2560, y: 1260, w: 480, h: 640, grosor: 72, giro: -7, tono: 0.55 },
  { x: 2600, y: 1300, w: 420, h: 560, grosor: 56, giro: 4, tono: 0.3, sobre: 72 },
];
export const DOC = { x: 1330, y: 640, w: 620, h: 800 };
export const LIBRO = { x: 2080, y: 470, w: 440, h: 600, grosor: 64 };
export const RENGLON = 46;
export const PALABRA = { renglon: 6, x: 70 };

/** El subrayado de corrector bajo «Puno», en px del papel: lo dibuja la punta de la pluma. */
export const SUBRAYADO = `M${PALABRA.x - 8} ${120 + PALABRA.renglon * RENGLON} q 52 5 118 -3`;
const LARGO_SUBRAYADO = getLength(SUBRAYADO);
/** Un punto del subrayado a `largo` px de su inicio (getPointAtLength puede devolver null). */
const puntoSubrayado = (largo: number) => getPointAtLength(SUBRAYADO, largo) ?? { x: PALABRA.x, y: 120 + PALABRA.renglon * RENGLON };

const campana = (t: number, centro: number, ancho: number) => Math.exp(-(((t - centro) / ancho) ** 2));

// ── cámara ──────────────────────────────────────────────────────────────────────────────────────
export const camara = (t: number) => {
  // abre en plano amplio (el escritorio entero, la lámpara, la pared) y entra hasta los papeles
  const acerca = tramo(t, B.acerca, 2.2, 'pesado'); // la luz invita a mirar
  const abre = tramo(t, B.abre, 1.2, 'solemne'); // el tablero entero
  return {
    acerca,
    abre,
    z: mix(-2400, 0, acerca) - 260 * abre,
    y: mix(250, 0, acerca) - 40 * abre,
    inclina: mix(50, 56, acerca) + 2 * abre,
  };
};

/** Perspectiva de la escena (px) y su origen en pantalla: los mismos que usa Muestra.tsx. */
export const PERSPECTIVA = 1500;
export const ORIGEN = { x: 960, y: 324 };

/**
 * Dónde cae en pantalla un punto de la mesa (x, y en px de la mesa; z hacia arriba), con la misma
 * transformación CSS de la escena: translateY(y + 180) translateZ(z) rotateX(inclina) y la perspectiva.
 * Sirve para que lo que se dibuja en 2D (el haz) salga del lugar exacto de la lámpara.
 */
export const proyectar = (x: number, y: number, z: number, cam: { y: number; z: number; inclina: number }) => {
  const th = (cam.inclina * Math.PI) / 180;
  const cx = x - MESA.w / 2;
  const cy = y - MESA.h / 2;
  const y1 = cy * Math.cos(th) - z * Math.sin(th);
  const z1 = cy * Math.sin(th) + z * Math.cos(th);
  const s = PERSPECTIVA / (PERSPECTIVA - (z1 + cam.z));
  return { x: ORIGEN.x + (960 + cx - ORIGEN.x) * s, y: ORIGEN.y + (540 + y1 + cam.y + 180 - ORIGEN.y) * s, escala: s };
};

// ── la lámpara ──────────────────────────────────────────────────────────────────────────────────
/** La cadenita del interruptor: se jala (px hacia abajo) y queda meciéndose (grados). */
export const cadena = (t: number) => ({
  jala: 26 * Math.max(0, Math.sin(clamp((t - (B.enciende - 0.12)) / 0.24) * Math.PI)),
  mece: asienta(t, B.enciende + 0.05, 9, 9, 2.2) + asienta(t, B.tocaLibro, 4, 11, 3),
});

/** La lámpara está sobre la mesa: el golpe del libro la hace temblar (px de la mesa). */
export const temblor = (t: number) => asienta(t, B.tocaLibro, 5, 42, 7);

export const luz = (t: number) => {
  const sube = tramo(t, B.enciende, 1.0, 'natural');
  const titila = 1 - 0.55 * campana(t, 0.36, 0.045); // un titileo, sin cortes
  const d = t - B.tocaLibro;
  const sacudida = d > 0 ? 1 - 0.05 * Math.exp(-d * 6) * Math.abs(Math.sin(d * 42)) : 1;
  return sube * titila * sacudida;
};

// ── la hoja ─────────────────────────────────────────────────────────────────────────────────────
export type EstadoHoja = { x: number; y: number; alto: number; giro: number; inclinaX: number; inclinaY: number; soplo: number };

const HOJA = { dx: -140, dy: 950, alto: 380, giro: -24 };

/**
 * La hoja cae como cae un papel, no como una piedra: entra desde la cámara ya en movimiento, se mece
 * de lado (y se inclina hacia donde va), el aire la frena antes de tocar y, una vez apoyada, sigue
 * deslizándose hasta que el roce la para. La velocidad no se corta en ningún momento.
 */
export const estadoDoc = (t: number): EstadoHoja => {
  const avance = tramo(t, B.caeDoc, B.deslizaFin - B.caeDoc, 'ligero'); // horizontal: entra rápido, frena por roce
  const baja = tramo(t, B.caeDoc, B.tocaDoc - B.caeDoc, 'natural'); // vertical: el colchón de aire
  const vaiven = (1 - baja) ** 2;
  const fase = (t - B.caeDoc) * 2 * Math.PI * 1.15;
  const alto = Math.max(0, HOJA.alto * (1 - baja) + 14 * Math.sin(fase * 2) * vaiven);
  // cuanto más cerca de la mesa, menos puede inclinarse (si no, media hoja la atraviesa)
  const margen = clamp(alto / 120);
  const d = t - B.tocaLibro;
  // el golpe del libro sopla aire bajo la hoja: el borde lejano se levanta (siempre hacia arriba)
  const soplo = d > 0 ? -Math.abs(6 * Math.exp(-d * 5) * Math.sin(d * 22)) : 0;
  return {
    x: DOC.x + HOJA.dx * (1 - avance) + 60 * Math.sin(fase) * vaiven,
    y: DOC.y + HOJA.dy * (1 - avance),
    alto,
    giro: mix(HOJA.giro, -2.2, avance),
    inclinaX: -9 * (1 - baja) * margen,
    inclinaY: 12 * Math.cos(fase) * vaiven * margen,
    soplo,
  };
};

// ── el libro ────────────────────────────────────────────────────────────────────────────────────
export type EstadoLibro = { alto: number; dy: number; golpe: Escala };

/** El libro entra desde lo oscuro y cae con peso; golpea, se aplasta como cartón y da un saltito. */
export const estadoLibro = (t: number): EstadoLibro => {
  const dura = B.tocaLibro - B.caeLibro;
  const cae = tramo(t, B.caeLibro, dura, 'tenso');
  const d = t - B.tocaLibro;
  const salto = d > 0 ? 9 * Math.exp(-d * 10) * Math.max(0, Math.sin(d * 24)) : 0;
  return {
    alto: 520 * (1 - cae) + salto,
    dy: -420 * (1 - tramo(t, B.caeLibro, dura, 'natural')),
    golpe: impacto(t, B.tocaLibro, 0.05),
  };
};

// ── la pluma ────────────────────────────────────────────────────────────────────────────────────
export type EstadoPluma = { x: number; y: number; alzada: number; traza: number; visible: boolean };

const PLUMA_DESDE = { x: 1250, y: 1250 }; // fuera de cuadro, abajo a la derecha (px del papel; comprobado en los cuadros 199–203)
const PLUMA_HACIA = { x: 1700, y: 1800 }; // lejos: se va de cuadro antes de que termine el tramo (cuadros 238–247)

/**
 * La pluma del corrector: llega en arco y frena, apoya la punta (la sombra se junta con ella),
 * traza el subrayado con la punta sobre la línea y se va acelerando. Entre un tramo y el siguiente
 * la velocidad es cero en los dos lados: no hay tirones.
 */
export const estadoPluma = (t: number): EstadoPluma => {
  const llega = tramo(t, B.entraPluma, B.escribe - B.entraPluma, 'natural');
  const traza = tramo(t, B.escribe, 0.6, 'natural');
  const sale = tramo(t, B.salePluma, 0.4, 'tenso');
  const inicio = puntoSubrayado(0);
  const fin = puntoSubrayado(LARGO_SUBRAYADO);
  let x: number;
  let y: number;
  if (t < B.escribe) {
    x = mix(PLUMA_DESDE.x, inicio.x, llega);
    y = mix(PLUMA_DESDE.y, inicio.y, llega) - arqueo(llega, 140);
  } else if (t < B.salePluma) {
    const p = puntoSubrayado(LARGO_SUBRAYADO * traza);
    x = p.x;
    y = p.y;
  } else {
    x = mix(fin.x, PLUMA_HACIA.x, sale);
    y = mix(fin.y, PLUMA_HACIA.y, sale) - arqueo(sale, 60);
  }
  const alzada = t < B.salePluma ? 1 - tramo(t, B.escribe - 0.25, 0.25, 'natural') : tramo(t, B.salePluma - 0.05, 0.2, 'natural');
  return { x, y, alzada, traza, visible: t >= B.entraPluma && sale < 1 };
};

// ── desenfoque de movimiento ────────────────────────────────────────────────────────────────────
/** Obturador de 180°: lo que se mueve se desenfoca la mitad de lo que avanza en un cuadro (cine). */
export const OBTURADOR = 0.5;
/** Distancia máxima entre dos copias de la estela (px): más, y se ven las copias. */
export const PASO_ESTELA = 4;
export const MAX_COPIAS = 8;

/** Cuántas copias necesita algo que avanza `d` px mientras el obturador está abierto. Quieto: una (no cuesta nada). */
export const copiasPara = (d: number, max = MAX_COPIAS) => Math.max(1, Math.min(max, Math.ceil(d / PASO_ESTELA)));

/** Los instantes de la estela alrededor de `t` (centrada en el cuadro). */
export const instantesEstela = (t: number, n: number, fps = FPS): number[] =>
  n === 1 ? [t] : Array.from({ length: n }, (_, k) => t + (k / (n - 1) - 0.5) * (OBTURADOR / fps));

const dist = (a: number[], b: number[]) => Math.hypot(...a.map((v, i) => v - b[i]));

/** Instantes de la estela para una trayectoria: según cuánto avanza mientras el obturador está abierto. */
export const estela = (pos: (t: number) => number[], t: number, fps = FPS, max = MAX_COPIAS): number[] =>
  instantesEstela(t, copiasPara(dist(pos(t - OBTURADOR / (2 * fps)), pos(t + OBTURADOR / (2 * fps))), max), fps);

// posiciones que se comparan (y que usa la estela)
export const posDoc = (t: number) => {
  const e = estadoDoc(t);
  return [e.x, e.y, e.alto];
};
export const posLibro = (t: number) => {
  const e = estadoLibro(t);
  return [LIBRO.x, LIBRO.y + e.dy, e.alto];
};
export const posPluma = (t: number) => {
  const e = estadoPluma(t);
  return [e.x, e.y, e.alzada * 16];
};

/** Lo que mide `fluidez.ts`. `contactos`: golpes buscados, donde frenar en seco es lo correcto. */
export const TRAYECTORIAS = [
  { nombre: 'hoja', pos: posDoc, contactos: [] as number[], desde: B.caeDoc, hasta: 6.8 },
  { nombre: 'libro', pos: posLibro, contactos: [B.tocaLibro, B.tocaLibro + Math.PI / 24], desde: B.caeLibro, hasta: 6.8 },
  { nombre: 'pluma', pos: posPluma, contactos: [] as number[], desde: B.entraPluma, hasta: B.salePluma + 0.4 },
  { nombre: 'cámara', pos: (t: number) => { const c = camara(t); return [0, c.y, c.z]; }, contactos: [] as number[], desde: 0, hasta: DURACION_S, quietaPorDecision: true },
];

// ── la versión anterior (commit bafd27c), solo para comparar con fluidez.ts ─────────────────────
const antesDoc = (t: number) => [
  DOC.x + mix(-260, 0, tramo(t, 3.6, 0.7, 'natural')) + asienta(t, 4.3, 10, 6, 4),
  DOC.y,
  mix(760, 0, tramo(t, 3.6, 0.7, 'tenso')),
];
const antesLibro = (t: number) => [LIBRO.x, LIBRO.y + mix(-420, 0, tramo(t, 5.6, 0.55, 'natural')), mix(520, 0, tramo(t, 5.6, 0.55, 'tenso'))];

/** La hoja anterior caía como piedra y se clavaba: no tiene contacto declarado porque un papel no golpea. */
export const ANTES = [
  { nombre: 'hoja', pos: antesDoc, contactos: [] as number[], desde: 3.6, hasta: 6.8 },
  { nombre: 'libro', pos: antesLibro, contactos: [6.15], desde: 5.6, hasta: 6.8 },
  { nombre: 'cámara', pos: (t: number) => { const a = tramo(t, 1.2, 2.2, 'pesado'); const b = tramo(t, 8.2, 1.2, 'solemne'); return [0, mix(120, 0, a) - 40 * b, mix(-520, 0, a) - 260 * b]; }, contactos: [] as number[], desde: 0, hasta: DURACION_S, quietaPorDecision: true },
];
