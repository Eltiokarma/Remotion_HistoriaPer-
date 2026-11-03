import { evolvePath } from '@remotion/paths';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { MapaLugar } from '../../../src/components/graficos/MapaLugar';
import { FiltroTinta, trazoManuscrito } from '../../../src/components/graficos/svg';
import { Ficha } from '../../../src/components/texto/Ficha';
import { asienta, mix, tramo } from '../../../src/direction/anim';
import { alfa } from '../../../src/estilo/color';
import { fuente } from '../../../src/estilo/fuentes';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 05 · Un mapa y un documento que se transforman en una explicación (Remotion puro, con
 * piezas del catálogo del canal: MapaLugar, Papel, Ficha, trazoManuscrito).
 *
 * Es la referencia: lo que el motor actual ya hace, contra lo que se comparan las otras muestras.
 *
 * El párrafo audiovisual en 5 s (CLAUDE.md §8):
 *   planteo  0,0–1,2  el documento cae en la mesa (se pasa y se asienta) y el mapa aparece
 *   prueba   1,2–3,3  una palabra del documento se subraya en rojo; el mapa va a ese lugar
 *   sentido  3,3–4,2  una línea roja une la palabra con el punto; la ficha dice dónde estamos
 *   respiro  4,2–5,0  todo quieto: el tablero que junta lo dicho
 * La cámara no se mueve: lo que se mueve son el papel, el mapa y la tinta.
 *
 * Contenido: el documento es escritura asémica (no dice nada) salvo «Puno»; no se inventa ninguna
 * cita ni fecha. El mapa de world-atlas no trae lagos: por eso la ficha no nombra el Titicaca. Las coordenadas de Puno son aproximadas (-70,02; -15,84), suficientes para un punto.
 */

const DOC = { x: 1060, y: 150, w: 640, h: 800 };
const RENGLON = 46;
// «Puno» abre su renglón: así la línea roja sale por el margen y no tacha la escritura
const PALABRA = { renglon: 7, x: DOC.x + 70 };
const CAJA: [number, number, number, number] = [200, 150, 520, 740];

export const MapaDocumento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // el documento cae: baja con peso, se pasa un poco y se asienta (acción continuada)
  const cae = tramo(t, 0, 0.7, 'tenso');
  const rebote = asienta(t, 0.7, 6, 6, 3.2);
  const docY = mix(-120, 0, cae) + (t > 0.7 ? rebote : 0);
  const docOp = tramo(t, 0, 0.25, 'natural');

  const mapaAparece = tramo(t, 0.4, 0.8, 'natural');
  const zoom = tramo(t, 2.0, 1.3, 'pesado');
  const subraya = tramo(t, 1.3, 0.5, 'ligero');
  const une = tramo(t, 3.3, 0.8, 'solemne');

  const yPalabra = DOC.y + 110 + PALABRA.renglon * RENGLON;
  // el punto de Puno termina en el centro de la caja del mapa (MapaLugar lo lleva ahí al acercarse)
  const punto = { x: CAJA[0] + CAJA[2] / 2, y: CAJA[1] + CAJA[3] / 2 };
  const inicio = { x: PALABRA.x - 14, y: yPalabra + 8 };
  const camino = `M${inicio.x} ${inicio.y} Q${(inicio.x + punto.x) / 2 + 60} ${Math.max(inicio.y, punto.y) + 160} ${punto.x + 24} ${punto.y + 8}`;
  const linea = evolvePath(une, camino);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      {/* el mapa: pieza del catálogo, sin tocar */}
      <MapaLugar id="lab05" codigo={604} lon={-70.02} lat={-15.84} caja={CAJA} zoom={zoom} acerca={2.4} aparece={mapaAparece}
        tinta={PALETA.fondo} acento={PALETA.rojo} papel={PALETA.papel} nombre="PUNO" mar="Océano Pacífico"
        cordillera={[[-79.6, -5.2], [-78.4, -7.6], [-77.4, -9.8], [-76.2, -11.9], [-74.8, -13.6], [-72.6, -15.0], [-70.4, -16.4]]} />
      {/* el documento */}
      <div style={{
        position: 'absolute', left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h, opacity: docOp,
        transform: `translateY(${docY}px) rotate(-1.6deg)`, boxShadow: `14px 18px 40px ${alfa('#000000', 0.45)}`,
      }}>
        <Papel color={PALETA.papel} envejecido={0.5} />
        <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0 }}>
          <defs><FiltroTinta id="lab05-tinta" /></defs>
          <g filter="url(#lab05-tinta)" fill="none" stroke={alfa(PALETA.fondo, 0.78)} strokeWidth={1.6} strokeLinecap="round">
            {Array.from({ length: 14 }, (_, i) => {
              const y = 110 + i * RENGLON;
              // el renglón de la palabra: escritura hasta la palabra y nada después
              if (i === PALABRA.renglon) return <path key={i} d={trazoManuscrito(900 + i, 200, y, 370, 15)} />;
              return <path key={i} d={trazoManuscrito(900 + i, 70, y, i === 13 ? 260 : 500, 15)} />;
            })}
          </g>
          <text x={PALABRA.x - DOC.x} y={110 + PALABRA.renglon * RENGLON} fontFamily={fuente.caligrafia} fontSize={44} fill={alfa(PALETA.fondo, 0.9)}>Puno</text>
          {/* el subrayado de corrector */}
          <path d={`M${PALABRA.x - DOC.x - 8} ${118 + PALABRA.renglon * RENGLON} q 50 4 112 -2`} stroke={PALETA.rojo} strokeWidth={4} fill="none"
            strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - subraya} />
        </svg>
      </div>
      {/* la línea que une la palabra con el lugar: va en arco y con su punta */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <path d={camino} fill="none" stroke={PALETA.rojo} strokeWidth={3.2} strokeLinecap="round" strokeDasharray={linea.strokeDasharray} strokeDashoffset={linea.strokeDashoffset} opacity={une > 0 ? 0.9 : 0} />
      </svg>
      <div style={{ position: 'absolute', left: CAJA[0] - 40, top: CAJA[1] + CAJA[3] + 70 }}>
        <Ficha texto="PUNO · ALTIPLANO" t={t - 3.9} color={PALETA.papel} acento={PALETA.rojo} size={26} cps={26} />
      </div>
    </AbsoluteFill>
  );
};
