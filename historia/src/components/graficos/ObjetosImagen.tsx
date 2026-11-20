import { Img } from 'remotion';
import { clamp } from '../../direction/anim';

/**
 * Objetos dibujados como imagen (PNG en estilo de grabado, generados con ChatGPT y revisados:
 * videos/001-el-hombre/diseno/revision-objetos-chatgpt-2026-11-20.md). Reemplazan a las láminas de vector
 * conservando su animación. Todo es HTML con <Img> de Remotion, que espera a que la imagen cargue antes
 * de capturar el cuadro (una <image> de SVG no espera: canal-historia/trampas.md).
 */

/** Las imágenes del grabado de las islas: fondo de mar y cielo, isla recortada, barco y un saco cerrado. */
export type ImagenesGrabado = { mar: string; islas: string; barco: string; saco?: string };

/** El barco de la imagen (1536 × 1024): centro del casco y línea de flotación, y la escala a la que mide ~600 px. */
const BARCO = { w: 1536, h: 1024, cx: 768, flota: 950, escala: 0.4 };
/** Dónde queda el barco anclado en el grabado: en el agua del tercio derecho, no en el horizonte (y = 707). */
export const BARCO_IMAGEN = { x: 1440, y: 800, escala: 1 } as const;

/**
 * El barco, volteado para que la proa mire a la derecha (hacia Europa: la isla queda a la izquierda;
 * la imagen no tiene letras, así que voltearla no falsea nada). Se mece sobre su línea de flotación.
 */
export const BarcoImagen: React.FC<{ src: string; x: number; y: number; escala: number; t: number; navega?: number }> = ({ src, x, y, escala, t, navega = 0 }) => {
  const k = BARCO.escala * escala;
  return (
    <div style={{ position: 'absolute', left: x + navega - BARCO.cx * k, top: y - BARCO.flota * k, width: BARCO.w * k, height: BARCO.h * k,
      transformOrigin: `${BARCO.cx * k}px ${BARCO.flota * k}px`,
      transform: `translateY(${Math.sin(t * 1.1) * 2}px) rotate(${Math.sin(t * 0.8) * 0.6}deg) scaleX(-1)` }}>
      <Img src={src} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

/** El muelle de la isla (dónde empiezan los sacos) y la borda del barco (dónde entran), en el cuadro de 1920 × 1080. */
const MUELLE = { x: 1050, y: 772 }, BORDA = { x: 1330, y: 752 };

/**
 * El grabado de las islas con imágenes: el mar, la isla encima (calzan: el horizonte en la fila 707), el barco
 * anclado y, con `carga`, cinco sacos que van del muelle a la borda uno tras otro, una sola vez.
 */
export const GrabadoImagen: React.FC<{ imagenes: ImagenesGrabado; t: number; carga?: number; anclado: boolean }> = ({ imagenes, t, carga, anclado }) => {
  const navega = !anclado && carga === undefined ? -t * 9 : 0;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden' }}>
      <Img src={imagenes.mar} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
      <Img src={imagenes.islas} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
      {imagenes.saco && carga !== undefined && carga >= 0 ? Array.from({ length: 5 }, (_, i) => {
        const u = clamp((carga - i * 0.55) / 1.3);
        if (u <= 0 || u >= 1) return null;
        const x = MUELLE.x + (BORDA.x - MUELLE.x) * u, y = MUELLE.y + (BORDA.y - MUELLE.y) * u - Math.abs(Math.sin(u * Math.PI * 7)) * 3; // a pulso
        return (
          <Img key={i} src={imagenes.saco!} style={{ position: 'absolute', left: x - 30, top: y - 62, width: 60, height: 60,
            opacity: 1 - clamp((u - 0.85) / 0.15) }} />
        );
      }) : null}
      <BarcoImagen src={imagenes.barco} x={BARCO_IMAGEN.x} y={BARCO_IMAGEN.y} escala={BARCO_IMAGEN.escala} t={t} navega={navega} />
    </div>
  );
};

/** La fachada (1536 × 1024): franja lisa del entablamento, donde va el rótulo, en filas 300–345. */
const FRANJA = { y: 300, h: 45 };

/** El edificio del Estado: aparece de abajo hacia arriba (`dibujo`, como el dibujado) y el rótulo va en su franja. */
export const EdificioImagen: React.FC<{ src: string; rotulo: string; dibujo: number; width: number; color: string; fuenteRotulo: string }> = ({ src, rotulo, dibujo, width, color, fuenteRotulo }) => {
  const k = width / 1536, h = 1024 * k;
  return (
    <div style={{ position: 'relative', width, height: h, clipPath: `inset(${(1 - clamp(dibujo)) * 100}% -10% 0 -10%)` }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width, height: h }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: FRANJA.y * k, height: FRANJA.h * k, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fuenteRotulo, fontSize: FRANJA.h * k * 0.62, letterSpacing: '0.4em', marginRight: '-0.4em', color, opacity: clamp((dibujo - 0.7) / 0.3) }}>
        {rotulo}
      </div>
    </div>
  );
};

/** El vale (1536 × 1024, recortado a su papel 35–1495 × 42–985): título arriba y el monto en el centro libre. */
const VALE = { x: 35, y: 42, w: 1460, h: 943 };
export const ValeImagen: React.FC<{ src: string; width: number; edad: number; titulo: string; color: string; fuenteTitulo: string; monto?: React.ReactNode }> = ({ src, width, edad, titulo, color, fuenteTitulo, monto }) => {
  const k = width / VALE.w;
  return (
    <div style={{ position: 'relative', width, height: VALE.h * k, overflow: 'hidden' }}>
      <Img src={src} style={{ position: 'absolute', left: -VALE.x * k, top: -VALE.y * k, width: 1536 * k, height: 1024 * k,
        // los vales más viejos, más tostados
        filter: `sepia(${0.25 * edad}) brightness(${1 - 0.1 * edad})` }} />
      {/* dentro del marco, a la derecha del óvalo y debajo de la guarda de guilloché */}
      <div style={{ position: 'absolute', left: VALE.w * k * 0.3, right: VALE.w * k * 0.12, top: VALE.h * k * 0.27, textAlign: 'center', fontFamily: fuenteTitulo,
        fontSize: VALE.w * k * 0.042, letterSpacing: '0.22em', marginRight: '-0.22em', color, opacity: 0.8 }}>{titulo}</div>
      {monto ? <div style={{ position: 'absolute', left: VALE.w * k * 0.42, width: VALE.w * k * 0.45, top: VALE.h * k * 0.52, height: VALE.h * k * 0.2,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{monto}</div> : null}
    </div>
  );
};

/** El libro de 2013 (1086 × 1448): recuadro vacío de la tapa, en 200–930 × 266–1040. */
const TAPA = { x: 200, y: 266, w: 730, h: 774 };
/**
 * El libro que no llegó a ver, con la tapa vacía de la imagen: el estampado enciende primero el autor,
 * después el título y al final el año (como la lámina). No copia la carátula real de la edición.
 */
export const LibroImagen: React.FC<{ src: string; ancho: number; estampado: number; titulo: string; autor: string; anio: string;
  oro: string; fuentes: { titulo: string; autor: string } }> = ({ src, ancho, estampado, titulo, autor, anio, oro, fuentes }) => {
  const k = ancho / 1086;
  const paso = (i: number) => clamp((estampado - i * 0.2) / 0.5);
  const dorado: React.CSSProperties = { color: oro, textShadow: '0 1px 0 rgba(0,0,0,0.45), 0 -1px 0 rgba(255,235,190,0.18)' };
  return (
    <div style={{ position: 'relative', width: ancho, height: 1448 * k }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width: ancho, height: 1448 * k }} />
      <div style={{ position: 'absolute', left: TAPA.x * k, top: TAPA.y * k, width: TAPA.w * k, height: TAPA.h * k, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between', padding: `${70 * k}px ${50 * k}px`, boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ ...dorado, opacity: paso(0), fontFamily: fuentes.autor, fontSize: 34 * k, letterSpacing: '0.3em', marginRight: '-0.3em' }}>{autor.toUpperCase()}</div>
        <div style={{ ...dorado, opacity: paso(1), fontFamily: fuentes.titulo, fontStyle: 'italic', fontSize: 92 * k, lineHeight: 1.12 }}>{titulo}</div>
        <div style={{ ...dorado, opacity: paso(2), fontFamily: fuentes.autor, fontSize: 64 * k, letterSpacing: '0.24em' }}>{anio}</div>
      </div>
    </div>
  );
};

/** Las pruebas (1086 × 1448): las líneas grises de la hoja de arriba, en tres bloques; las marcas del corrector van sobre ellas. */
const MARCAS = [
  'M252 205 C 234 205, 240 310, 226 310 C 240 310, 234 415, 252 415',                       // llave: el primer párrafo
  'M425 588 C 480 584, 560 594, 645 586',                                                        // tachón en el segundo bloque
  'M500 312 C 500 290, 720 288, 722 312 C 724 336, 502 340, 498 316',                            // círculo
  'M892 590 L 906 606 L 934 568',                                                                // visto bueno al margen
  'M845 905 C 870 880, 890 868, 912 860 M912 860 L 896 856 M912 860 L 902 874',                  // flecha hacia la nota
];
/**
 * La pila de pruebas de imprenta con su lápiz rojo. Con `correcciones` (0–1), el corrector hace las marcas
 * en rojo una tras otra (llave, tachón, círculo, visto bueno, flecha y la nota «precisar»), como en la lámina.
 */
export const PruebasImagen: React.FC<{ src: string; lapiz?: string; width: number; correcciones: number; rojo: string; fuenteNota: string }> = ({ src, lapiz, width, correcciones, rojo, fuenteNota }) => {
  const k = width / 1086, h = 1448 * k;
  const marca = (i: number) => clamp(correcciones * MARCAS.length - i);
  return (
    <div style={{ position: 'relative', width, height: h }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width, height: h }} />
      <svg viewBox="0 0 1086 1448" width={width} height={h} style={{ position: 'absolute', inset: 0 }}>
        {MARCAS.map((d, i) => (marca(i) > 0 ? (
          <path key={i} d={d} fill="none" stroke={rojo} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - marca(i)} opacity={0.9} />
        ) : null))}
        <text x={918} y={858} fill={rojo} fontFamily={fuenteNota} fontStyle="italic" fontSize={34} opacity={marca(4)}>precisar</text>
      </svg>
      {lapiz ? (
        // el lápiz descansa a la derecha de la pila, con la punta hacia la hoja
        <Img src={lapiz} style={{ position: 'absolute', left: width * 0.62, top: h * 0.7, width: width * 0.62, transformOrigin: '50% 50%', transform: 'rotate(150deg)' }} />
      ) : null}
    </div>
  );
};
