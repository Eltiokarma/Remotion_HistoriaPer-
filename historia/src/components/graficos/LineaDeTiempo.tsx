import { clamp, impacto } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

export type EventoTiempo = {
  /** Posición en la escala (con `cortes` por defecto, el tramo i va de i a i + 1; con `cortes`, en sus unidades: p. ej. años). */
  en: number;
  rotulo: string;
  detalle?: string;
  /**
   * sombra: un final o una pérdida · luz: un logro, el destino · nota: un paso intermedio ·
   * persona: alguien (un cuadrito de corrector y su nombre).
   */
  tono: 'sombra' | 'luz' | 'nota' | 'persona';
  /** persona: 1 = el nombre va más arriba, con una línea fina hasta su cuadrito (para que dos vecinos no se pisen). */
  nivel?: 0 | 1;
};

/** Un parentesco entre dos personas de la línea: un arco que va de una a la otra, por encima de sus nombres. */
export type Lazo = {
  /** Índices en `eventos`: el arco sale de `desde` y se dibuja hacia `hasta`. */
  desde: number;
  hasta: number;
  /** 0–1: cuánto del arco está dibujado. */
  dibujo: number;
};

type Props = {
  paleta: Paleta;
  id: string;
  /** Un rótulo por tramo (meses, años, capítulos…), en orden. */
  tramos: string[];
  /**
   * Bordes de los tramos en la escala (uno más que `tramos`), si no miden lo mismo: p. ej. los
   * años de cada capítulo. Por defecto, 0, 1, 2… (tramos iguales).
   */
  cortes?: number[];
  /** Un rótulo chico bajo cada tramo (p. ej. sus años); solo si el tramo tiene lugar, y se apaga con `fondoVisible`. */
  subtramos?: string[];
  /** Nombre largo de cada tramo, para el fondo (aparece y se desvanece al pasar). */
  fondo?: string[];
  eventos: EventoTiempo[];
  /** Qué punto de la escala está en el centro de la pantalla: la cámara. */
  centro: number;
  /** Píxeles por unidad de la escala: el zoom de la cámara. */
  escala: number;
  /** Hasta dónde está encendida la línea: lo ya recorrido. */
  recorrido: number;
  /** 0–1: aparición de todo. */
  aparece: number;
  /** 0–1: la flecha que va delante de lo recorrido. */
  guia?: number;
  /** Brillo extra de cada evento (0–1), en el orden de `eventos`. */
  realce?: number[];
  /** Segundos desde que la cámara llegó a cada evento (negativo: todavía no); el libro se posa con un golpecito. */
  tras?: number[];
  /** 0–1: cuánto se ve el nombre del tramo en el fondo (es una ayuda del viaje; al abrir, se apaga). */
  fondoVisible?: number;
  /** 0–1 por tramo: el tramo se vuelve un bloque encendido (como en el índice de la serie). */
  bandas?: number[];
  /** 0–1: los años de las dos puntas, debajo (uno para las dos, o uno por punta). */
  extremos?: number | [number, number];
  /** Rótulos de las puntas (por defecto, el primer y el último corte). */
  rotulosExtremos?: [string, string];
  /** 0–1: cuánto se ven los nombres de las personas (con la cámara abierta se pisan: se apagan). */
  nombres?: number;
  /** 0–1: un brillo que corre por la línea de punta a punta (0 y 1: no se ve). */
  barrido?: number;
  lazos?: Lazo[];
  y?: number;
};

const PARALAJE = 0.35;
/** Cuánto más arriba va el nombre de una persona de nivel 1. */
const ALTO_NIVEL = 84;

/**
 * Una línea de tiempo que se recorre con la cámara, para que el espectador atraviese el tiempo en
 * vez de saltarlo. Lo recorrido queda encendido; lo que falta, punteado; una flecha va delante;
 * las marcas se iluminan al pasar; los eventos tienen tono (la sombra se apaga, la luz crece al
 * acercarse). Los tramos pueden medir distinto (los años de cada capítulo) y volverse bloques
 * encendidos. La coreografía (cuándo se mueve y cuánto) la pone la escena.
 */
export const LineaDeTiempo: React.FC<Props> = ({
  paleta, id, tramos, cortes: cortesProp, subtramos, fondo, eventos, centro, escala, recorrido, aparece, guia = 0, realce = [], tras = [],
  fondoVisible = 1, bandas = [], extremos = 0, rotulosExtremos, nombres = 1, barrido = 0, lazos = [], y = 560,
}) => {
  const X = (u: number) => 960 + (u - centro) * escala;
  const n = tramos.length;
  const cortes = cortesProp ?? Array.from({ length: n + 1 }, (_, i) => i);
  const ini = cortes[0], fin = cortes[n];
  const anchoMedio = (fin - ini) / n; // la unidad "de un tramo", para que todo escale igual con tramos iguales o no
  const medio = (i: number) => (cortes[i] + cortes[i + 1]) / 2;
  const tinta = paleta.papel;
  const encendido = mezclar(paleta.papel, paleta.ocre, 0.45);
  const xFin = Math.min(X(recorrido), X(fin));
  const puntos = (recorrido * escala) % 32; // los puntos de la guía corren con el recorrido
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <defs>
        <linearGradient id={`${id}-bordes`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.1" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.9" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mascara`}><rect width={1920} height={1080} fill={`url(#${id}-bordes)`} /></mask>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor={paleta.ocre} stopOpacity="0.9" />
          <stop offset="0.45" stopColor={paleta.ocre} stopOpacity="0.28" />
          <stop offset="1" stopColor={paleta.ocre} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-brillo`} x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <g mask={`url(#${id}-mascara)`}>
        {/* fondo: el nombre del tramo en curso, grande, lejano y debajo de la línea; de a uno: en cada
            borde de tramo se apaga del todo antes de que aparezca el siguiente */}
        {tramos.map((_, i) => {
          const media = (cortes[i + 1] - cortes[i]) / 2;
          const cerca = clamp(1 - Math.abs(medio(i) - centro) / media) * fondoVisible;
          const texto = (fondo ?? tramos)[i];
          const cuerpo = Math.max(64, Math.min(200, 2600 / Math.max(1, texto.length)));
          return cerca > 0 ? (
            <text key={`f${i}`} x={960 + (medio(i) - centro) * escala * PARALAJE} y={y + 300} textAnchor="middle"
              fill={alfa(tinta, 0.09 * cerca)} fontFamily={fuente.imprentaItalica} fontSize={cuerpo}>{texto}</text>
          ) : null;
        })}

        {/* los tramos como bloques encendidos (los mismos del índice de la serie) */}
        {tramos.map((_, i) => {
          const k = clamp(bandas[i] ?? 0);
          if (k <= 0) return null;
          return (
            <rect key={`b${i}`} x={X(cortes[i]) + 2} y={y - 24} width={Math.max(0, X(cortes[i + 1]) - X(cortes[i]) - 4)} height={48} rx={3}
              fill={mezclar(mezclar(paleta.fondo, paleta.ocre, 0.25), i % 2 ? paleta.rojo : paleta.ocre, 0.55 * k)} opacity={k} />
          );
        })}

        {/* la línea: punteada lo que falta, encendida lo recorrido */}
        <line x1={X(ini)} x2={X(fin)} y1={y} y2={y} stroke={alfa(tinta, 0.28)} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round" />
        <line x1={X(ini)} x2={xFin} y1={y} y2={y} stroke={alfa(encendido, 0.45)} strokeWidth={12} filter={`url(#${id}-brillo)`} />
        <line x1={X(ini)} x2={xFin} y1={y} y2={y} stroke={encendido} strokeWidth={4} strokeLinecap="round" />

        {/* marcas y rótulos de cada tramo: se iluminan al pasar */}
        {cortes.map((c, i) => {
          const paso = clamp((recorrido - c) / (0.15 * anchoMedio) + 1);
          return <line key={`m${i}`} x1={X(c)} x2={X(c)} y1={y - 12} y2={y + 12} stroke={alfa(tinta, 0.35 + 0.55 * paso)} strokeWidth={2} />;
        })}
        {tramos.map((r, i) => {
          const paso = Math.max(clamp((recorrido - medio(i)) / (0.3 * anchoMedio) + 1), clamp(bandas[i] ?? 0));
          const ancho = X(cortes[i + 1]) - X(cortes[i]);
          return (
            <g key={`t${i}`}>
              <text x={X(medio(i))} y={y + 58} textAnchor="middle" fill={alfa(tinta, 0.38 + 0.57 * paso)}
                fontFamily={fuente.mono} fontSize={26} letterSpacing={5}>{r}</text>
              {subtramos && ancho > 170 ? (
                <text x={X(medio(i))} y={y + 90} textAnchor="middle" fill={alfa(tinta, (0.25 + 0.4 * paso) * clamp((ancho - 170) / 60) * fondoVisible)}
                  fontFamily={fuente.mono} fontSize={19} letterSpacing={3}>{subtramos[i]}</text>
              ) : null}
            </g>
          );
        })}

        {/* el brillo que recorre la línea entera: de una punta a la otra */}
        {barrido > 0 && barrido < 1 ? (
          <g opacity={clamp(barrido * 10) * clamp((1 - barrido) * 10)}>
            <ellipse cx={X(ini + (fin - ini) * barrido)} cy={y} rx={120} ry={42} fill={`url(#${id}-halo)`} />
            <line x1={X(ini + (fin - ini) * barrido) - 46} x2={X(ini + (fin - ini) * barrido) + 46} y1={y} y2={y} stroke={tinta} strokeWidth={7}
              strokeLinecap="round" filter={`url(#${id}-brillo)`} />
          </g>
        ) : null}

        {/* las puntas: de dónde a dónde */}
        {[ini, fin].map((c, j) => {
          const k = clamp(typeof extremos === 'number' ? extremos : extremos[j]);
          return k > 0 ? (
            <text key={`e${j}`} x={X(c)} y={y + 128 - 8 * (1 - k)} textAnchor="middle" fill={alfa(paleta.ocre, 0.9 * k)} fontFamily={fuente.mono} fontSize={28}
              letterSpacing={3}>{rotulosExtremos ? rotulosExtremos[j] : String(c)}</text>
          ) : null;
        })}

        {/* la guía: una flecha delante de lo recorrido y puntos que corren hacia donde vamos */}
        {guia > 0 ? (
          <g opacity={guia}>
            {[0, 1, 2, 3].map((k) => {
              const x = xFin + 52 + k * 32 + puntos;
              return <circle key={k} cx={x} cy={y} r={3} fill={encendido} opacity={clamp(0.75 - k * 0.2 - puntos / 160)} />;
            })}
            <path d={`M${xFin + 18} ${y - 13} L${xFin + 32} ${y} L${xFin + 18} ${y + 13}`} fill="none" stroke={encendido} strokeWidth={4}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}

        {/* los eventos */}
        {eventos.map((e, k) => {
          const x = X(e.en);
          const llega = clamp((recorrido - e.en) / (0.2 * anchoMedio) + 1);
          const extra = realce[k] ?? 0;
          if (llega <= 0) return null;
          if (e.tono === 'nota') {
            return (
              <g key={k} opacity={llega * 0.85}>
                <circle cx={x} cy={y} r={7} fill={paleta.fondo} stroke={encendido} strokeWidth={2} />
                <text x={x} y={y - 40} textAnchor="middle" fill={alfa(tinta, 0.8)} fontFamily={fuente.mono} fontSize={22} letterSpacing={3}>{e.rotulo}</text>
                {e.detalle ? <text x={x} y={y - 70} textAnchor="middle" fill={alfa(tinta, 0.5)} fontFamily={fuente.mono} fontSize={18} letterSpacing={3}>{e.detalle}</text> : null}
              </g>
            );
          }
          if (e.tono === 'persona') {
            // el cuadrito rojo de corrector (el mismo de las fichas) y el nombre; al llegar, el nombre se enciende
            const lado = 14 + 6 * extra;
            const yNombre = y - 44 - ALTO_NIVEL * (e.nivel ?? 0);
            return (
              <g key={k} opacity={llega}>
                <rect x={x - lado / 2} y={y - lado / 2} width={lado} height={lado} fill={paleta.rojo} stroke={alfa(tinta, 0.6)} strokeWidth={1} />
                {/* el nombre sube apenas mientras aparece: llega, no se enciende de golpe */}
                <g opacity={nombres} transform={`translate(0 ${10 * (1 - llega)})`}>
                  {e.nivel ? <line x1={x} x2={x} y1={y - 14} y2={yNombre + 10} stroke={alfa(tinta, 0.3)} strokeWidth={1.5} /> : null}
                  <text x={x} y={yNombre} textAnchor="middle" fill={alfa(tinta, 0.75 + 0.25 * extra)} fontFamily={fuente.libro} fontStyle="italic" fontSize={38}>{e.rotulo}</text>
                  {e.detalle ? <text x={x} y={yNombre - 48} textAnchor="middle" fill={alfa(tinta, 0.55)} fontFamily={fuente.mono} fontSize={19} letterSpacing={3}>{e.detalle}</text> : null}
                </g>
              </g>
            );
          }
          if (e.tono === 'sombra') {
            return (
              <g key={k} opacity={llega}>
                {extra > 0 ? <circle cx={x} cy={y} r={14 + 22 * extra} fill="none" stroke={alfa(paleta.rojo, 0.7 * (1 - extra * 0.6))} strokeWidth={2} /> : null}
                <circle cx={x} cy={y} r={13} fill={mezclar(paleta.rojo, '#000000', 0.45)} stroke={alfa(tinta, 0.85)} strokeWidth={2} />
                <g opacity={nombres}>
                  <text x={x} y={y - 46} textAnchor="middle" fill={tinta} fontFamily={fuente.mono} fontSize={30} letterSpacing={3}>{e.rotulo}</text>
                  {e.detalle ? <text x={x} y={y - 84} textAnchor="middle" fill={alfa(tinta, 0.6)} fontFamily={fuente.mono} fontSize={20} letterSpacing={3}>{e.detalle}</text> : null}
                </g>
              </g>
            );
          }
          // luz: brilla más cuanto más cerca está la cámara; el libro aparece al llegar
          const cerca = clamp(1 - Math.abs(centro - e.en) / (1.6 * anchoMedio));
          const brillo = clamp(0.25 + 0.75 * cerca * cerca + 0.5 * extra);
          const libro = clamp((recorrido - e.en) / (0.06 * anchoMedio) + 1);
          // el libro baja acelerando y se posa: se aplasta apenas desde su base (papel y cartón: poco)
          const posa = impacto(tras[k] ?? -1, 0, 0.05);
          const bajaLibro = -26 * (1 - libro) ** 2;
          return (
            <g key={k}>
              <circle cx={x} cy={y} r={60 + 120 * brillo} fill={`url(#${id}-halo)`} opacity={0.35 + 0.65 * brillo} />
              <circle cx={x} cy={y} r={11} fill={mezclar(tinta, paleta.ocre, 0.3)} stroke={tinta} strokeWidth={2} />
              <g opacity={libro} transform={`translate(${x} ${y - 176 + bajaLibro}) translate(0 32) scale(${posa.sx} ${posa.sy}) translate(0 -32)`}>
                {/* un libro cerrado, de pie: tapa, lomo y páginas */}
                <rect x={-24} y={-34} width={48} height={66} rx={3} fill={mezclar(tinta, paleta.ocre, 0.15)} stroke={alfa(paleta.fondo, 0.5)} strokeWidth={1.5} />
                <rect x={-24} y={-34} width={8} height={66} fill={mezclar(paleta.ocre, paleta.fondo, 0.25)} />
                <line x1={-8} x2={16} y1={-12} y2={-12} stroke={alfa(paleta.fondo, 0.45)} strokeWidth={2} />
                <line x1={-8} x2={12} y1={-4} y2={-4} stroke={alfa(paleta.fondo, 0.3)} strokeWidth={1.5} />
              </g>
              <g opacity={llega}>
                <text x={x} y={y - 46} textAnchor="middle" fill={tinta} fontFamily={fuente.mono} fontSize={30} letterSpacing={3}>{e.rotulo}</text>
                {e.detalle ? <text x={x} y={y - 84} textAnchor="middle" fill={alfa(tinta, 0.75)} fontFamily={fuente.mono} fontSize={20} letterSpacing={3}>{e.detalle}</text> : null}
              </g>
            </g>
          );
        })}

        {/* los lazos: un arco fino de un nombre a otro, por encima de los nombres; se dibuja con una
            punta que lo guía y, al llegar, deja un punto */}
        {lazos.map((l, j) => {
          const a = eventos[l.desde], b = eventos[l.hasta];
          if (!a || !b || l.dibujo <= 0) return null;
          // de la cabeza de un nombre a la del otro (más arriba si tiene detalle)
          const tope = (e: EventoTiempo) => y - 44 - ALTO_NIVEL * (e.nivel ?? 0) - (e.detalle ? 48 + 26 : 42);
          const x0 = X(a.en), y0 = tope(a), x1 = X(b.en), y1 = tope(b);
          const yc = Math.min(y0, y1) - 150;
          const k = clamp(l.dibujo);
          // la cabeza del arco: el punto de la curva (x0,y0) → (x0,yc) → (x1,yc) → (x1,y1) en k
          const curva = (p0: number, c0: number, c1: number, p1: number) =>
            (1 - k) ** 3 * p0 + 3 * (1 - k) ** 2 * k * c0 + 3 * (1 - k) * k ** 2 * c1 + k ** 3 * p1;
          return (
            <g key={`l${j}`} opacity={nombres}>
              <path d={`M${x0} ${y0} C${x0} ${yc} ${x1} ${yc} ${x1} ${y1}`} fill="none" stroke={alfa(paleta.ocre, 0.8)} strokeWidth={2}
                strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
              <circle cx={x0} cy={y0} r={3.5} fill={paleta.ocre} />
              <circle cx={curva(x0, x0, x1, x1)} cy={curva(y0, yc, yc, y1)} r={k < 1 ? 4.5 : 3.5} fill={paleta.ocre} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
