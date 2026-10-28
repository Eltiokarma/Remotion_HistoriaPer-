import { clamp, impacto } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

export type EventoTiempo = {
  /** Posición en la escala (el tramo i va de i a i + 1). */
  en: number;
  rotulo: string;
  detalle?: string;
  /** sombra: un final o una pérdida · luz: un logro, el destino · nota: un paso intermedio. */
  tono: 'sombra' | 'luz' | 'nota';
};

type Props = {
  paleta: Paleta;
  id: string;
  /** Un rótulo por tramo (meses, años, siglos…), en orden. */
  tramos: string[];
  /** Nombre largo de cada tramo, para el fondo (aparece y se desvanece al pasar). */
  fondo?: string[];
  eventos: EventoTiempo[];
  /** Qué punto de la escala está en el centro de la pantalla: la cámara. */
  centro: number;
  /** Píxeles por tramo: el zoom de la cámara. */
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
  y?: number;
};

const PARALAJE = 0.35;

/**
 * Una línea de tiempo que se recorre con la cámara, para que el espectador atraviese el tiempo en
 * vez de saltarlo. Lo recorrido queda encendido; lo que falta, punteado; una flecha va delante;
 * las marcas se iluminan al pasar; los eventos tienen tono (la sombra se apaga, la luz crece al
 * acercarse). La coreografía (cuándo se mueve y cuánto) la pone la escena.
 */
export const LineaDeTiempo: React.FC<Props> = ({ paleta, id, tramos, fondo, eventos, centro, escala, recorrido, aparece, guia = 0, realce = [], tras = [], fondoVisible = 1, y = 560 }) => {
  const X = (u: number) => 960 + (u - centro) * escala;
  const n = tramos.length;
  const tinta = paleta.papel;
  const encendido = mezclar(paleta.papel, paleta.ocre, 0.45);
  const xFin = Math.min(X(recorrido), X(n));
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
          const cerca = clamp(1 - Math.abs(i + 0.5 - centro) / 0.5) * fondoVisible;
          return cerca > 0 ? (
            <text key={`f${i}`} x={960 + (i + 0.5 - centro) * escala * PARALAJE} y={y + 300} textAnchor="middle"
              fill={alfa(tinta, 0.09 * cerca)} fontFamily={fuente.imprentaItalica} fontSize={200}>{(fondo ?? tramos)[i]}</text>
          ) : null;
        })}

        {/* la línea: punteada lo que falta, encendida lo recorrido */}
        <line x1={X(0)} x2={X(n)} y1={y} y2={y} stroke={alfa(tinta, 0.28)} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round" />
        <line x1={X(0)} x2={xFin} y1={y} y2={y} stroke={alfa(encendido, 0.45)} strokeWidth={12} filter={`url(#${id}-brillo)`} />
        <line x1={X(0)} x2={xFin} y1={y} y2={y} stroke={encendido} strokeWidth={4} strokeLinecap="round" />

        {/* marcas y rótulos de cada tramo: se iluminan al pasar */}
        {Array.from({ length: n + 1 }, (_, i) => {
          const paso = clamp((recorrido - i) / 0.15 + 1);
          return <line key={`m${i}`} x1={X(i)} x2={X(i)} y1={y - 12} y2={y + 12} stroke={alfa(tinta, 0.35 + 0.55 * paso)} strokeWidth={2} />;
        })}
        {tramos.map((r, i) => {
          const paso = clamp((recorrido - (i + 0.5)) / 0.3 + 1);
          return (
            <text key={`t${i}`} x={X(i + 0.5)} y={y + 58} textAnchor="middle" fill={alfa(tinta, 0.38 + 0.57 * paso)}
              fontFamily={fuente.mono} fontSize={26} letterSpacing={5}>{r}</text>
          );
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
          const llega = clamp((recorrido - e.en) / 0.2 + 1);
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
          if (e.tono === 'sombra') {
            return (
              <g key={k} opacity={llega}>
                {extra > 0 ? <circle cx={x} cy={y} r={14 + 22 * extra} fill="none" stroke={alfa(paleta.rojo, 0.7 * (1 - extra * 0.6))} strokeWidth={2} /> : null}
                <circle cx={x} cy={y} r={13} fill={mezclar(paleta.rojo, '#000000', 0.45)} stroke={alfa(tinta, 0.85)} strokeWidth={2} />
                <text x={x} y={y - 46} textAnchor="middle" fill={tinta} fontFamily={fuente.mono} fontSize={30} letterSpacing={3}>{e.rotulo}</text>
                {e.detalle ? <text x={x} y={y - 84} textAnchor="middle" fill={alfa(tinta, 0.6)} fontFamily={fuente.mono} fontSize={20} letterSpacing={3}>{e.detalle}</text> : null}
              </g>
            );
          }
          // luz: brilla más cuanto más cerca está la cámara; el libro aparece al llegar
          const cerca = clamp(1 - Math.abs(centro - e.en) / 1.6);
          const brillo = clamp(0.25 + 0.75 * cerca * cerca + 0.5 * extra);
          const libro = clamp((recorrido - e.en) / 0.06 + 1);
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
      </g>
    </svg>
  );
};
