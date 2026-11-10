import { clamp, mix } from '../../direction/anim';
import { alfa } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { CapaVC, DefsLamina, usePrefijo, type Caja, type Lamina } from './vectorcraft/Lamina';

type Props = {
  lamina: Lamina;
  /** El punto del lugar en la lámina (la cámara se acerca a él sin moverlo). */
  foco: [number, number];
  /** Recuadro del mapa en la lámina (lo que queda cuando el mapa se vuelve recuadro de la página). */
  marco: Caja;
  /** Dónde queda el recuadro en la página: x, y y ancho. */
  recuadro: [number, number, number];
  /** 0–1: aparece la lámina entera (pizarra, rótulos y mapa). */
  aparece: number;
  /** 0–1: la cámara se acerca al lugar. */
  acerca: number;
  /** Cuánto se acerca (escala final). */
  escala?: number;
  /** 0–1: la pizarra se va y el mapa se vuelve un recuadro sobre la página. */
  aRecuadro: number;
  /** Frente del agua en px (el mapa está donde ya hay papel: x > frente). null: no hay agua. */
  frente: number | null;
  /** Un dato abajo a la izquierda (lo que la voz no dice). */
  dato?: string;
  datoK?: number;
  /** 0–1 cada uno: el nombre del lugar (con su palabra en la voz), el año, y el rótulo de la cordillera. */
  nombreK?: number;
  anioK?: number;
  andesK?: number;
};

const SUAVE = 180;

/**
 * La lámina de un lugar (Lima, 1956) con su cámara: aparece entera, la cámara se acerca al punto
 * (la ciudad no se mueve: el mapa crece a su alrededor), después la pizarra se retira y el mapa
 * queda como recuadro de la página. Ahí lo cubre el agua y vuelve con el papel.
 */
export const LugarLamina: React.FC<Props> = ({ lamina, foco, marco, recuadro, aparece, acerca, escala = 1.5, aRecuadro, frente, dato, datoK = 0, nombreK = 1, anioK = 1, andesK = 0 }) => {
  const uid = usePrefijo();
  const [fx, fy] = foco;
  // dos transformaciones del mapa (x' = s·x + t) y su mezcla: acercado a pantalla completa → recuadro
  const s1 = mix(1, escala, acerca);
  const t1 = [fx - s1 * fx, fy - s1 * fy];
  const s2 = recuadro[2] / marco[2];
  const t2 = [recuadro[0] - s2 * marco[0], recuadro[1] - s2 * marco[1]];
  const k = clamp(aRecuadro);
  const s = mix(s1, s2, k), tx = mix(t1[0], t2[0], k), ty = mix(t1[1], t2[1], k);
  const mapa = `translate(${tx} ${ty}) scale(${s})`;
  // el marcador y su rótulo no crecen con el acercamiento: van al punto, a tamaño fijo
  const px = s * fx + tx, py = s * fy + ty;
  const marcador = `translate(${px} ${py}) scale(${mix(1, 0.75, k)}) translate(${-fx} ${-fy})`;
  // ventana del mapa a pantalla completa (no pisa el título) → recuadro en la página
  const ventana = { x: mix(930, recuadro[0] - 6, k), y: mix(232, recuadro[1] - 6, k), w: mix(990, recuadro[2] + 12, k), h: mix(780, (recuadro[2] * marco[3]) / marco[2] + 12, k) };
  const mascara = frente === null ? undefined
    : `linear-gradient(90deg, transparent ${frente - SUAVE / 2}px, #000 ${frente + SUAVE / 2}px)`;
  if (aparece <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: aparece, WebkitMaskImage: mascara, maskImage: mascara }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <DefsLamina lamina={lamina} uid={uid} />
        <defs><clipPath id={`${uid}-ventana`}><rect x={ventana.x} y={ventana.y} width={ventana.w} height={ventana.h} rx={k * 6} /></clipPath></defs>
        {/* la pizarra y la columna de rótulos se retiran cuando el mapa pasa a la página */}
        <CapaVC lamina={lamina} uid={uid} nombre="Pizarra_verde" opacity={1 - k} />
        {/* la columna ya no es una lista: el título, después el nombre del lugar cuando la voz lo dice y el año
            debajo, cuando la voz lo dice. «El Pacífico al oeste / Los Andes hacia el interior» pasan al mapa,
            como rótulos de lo que señalan; el subtítulo repetía el nombre que ya está en la página */}
        <CapaVC lamina={lamina} uid={uid} nombre="Rotulación" opacity={1 - k} pieza={(i) => {
          if (i === 0) return undefined;
          if (i === 2 || i === 3) return { opacity: nombreK, transform: `translate(0 ${10 * (1 - nombreK) + 40})` };
          if (i === 7) return { opacity: anioK, transform: `translate(0 ${-200 + 10 * (1 - anioK)})` };
          return { opacity: 0 };
        }} />
        <CapaVC lamina={lamina} uid={uid} nombre="Relieve_ilustrado" solo={(i) => i === 61 || i === 62 || i === 69} opacity={1 - k} />
        {/* en la página, el recuadro lleva un fondo propio para que el mapa no se lea sobre el papel */}
        {k > 0 ? <rect x={ventana.x} y={ventana.y} width={ventana.w} height={ventana.h} rx={6} fill="#22332a" opacity={k} /> : null}
        <g clipPath={`url(#${uid}-ventana)`}>
          <g transform={mapa}>
            <CapaVC lamina={lamina} uid={uid} nombre="Geografía_Natural_Earth" />
            <CapaVC lamina={lamina} uid={uid} nombre="Relieve_ilustrado" solo={(i) => i <= 60 || i === 67 || i === 68} />
            {/* la cordillera se nombra sobre la cordillera, mientras la cámara se acerca */}
            {andesK > 0 ? (
              <text x={1218} y={612} transform="rotate(51.8 1218 612)" fill="#3a3220" opacity={0.85 * andesK} fontFamily={fuente.libro} fontStyle="italic" fontSize={20}
                letterSpacing={3}>Los Andes</text>
            ) : null}
          </g>
        </g>
        <g transform={marcador}>
          <CapaVC lamina={lamina} uid={uid} nombre="Relieve_ilustrado" solo={(i) => i === 63 || i === 64} />
        </g>
        {/* el rótulo LIMA con su línea: en la pizarra, tal como en la lámina; en el recuadro, se van */}
        <CapaVC lamina={lamina} uid={uid} nombre="Relieve_ilustrado" solo={(i) => i === 65 || i === 66} opacity={1 - clamp(k * 2)} />
      </svg>
      {dato ? (
        <div style={{ position: 'absolute', left: 158, top: 660, fontFamily: fuente.mono, fontSize: 22, letterSpacing: '0.12em', color: alfa('#c6cdb3', 0.9),
          opacity: datoK * (1 - k) }}>{dato}</div>
      ) : null}
    </div>
  );
};
