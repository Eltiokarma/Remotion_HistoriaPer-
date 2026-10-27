import { AbsoluteFill, type CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { framesSinVoz } from '../direction/voz';
import { CATALOGO, type NombreEscena } from '../escenas/esquemas';
import { esquemaPaleta, type Paleta, type VideoData } from '../esquema';
import { fuente } from '../estilo/fuentes';
import { VideoLargo } from './VideoLargo';

/**
 * Catálogo: cada escena reutilizable con sus datos de muestra (el `ejemplo` de su esquema.ts).
 * En el Studio, el panel de props deja cambiar textos, cifras y paleta y ver el resultado al
 * instante; lo que quede bien se copia tal cual a las `props` de un escenas.json.
 */

/** Paleta de muestra (la del video 000). */
export const PALETA_CATALOGO: Paleta = { fondo: '#1b1a17', papel: '#e8e2d4', ocre: '#c2a878', rojo: '#8c2f1b' };
const FPS = 30;

const NOMBRES = Object.keys(CATALOGO) as [NombreEscena, ...NombreEscena[]];
const forma = z.object({
  componente: z.enum(NOMBRES),
  paleta: esquemaPaleta,
  duracion_s: z.number().positive(),
  cola_s: z.number().min(0).optional(),
  beats: z.record(z.string(), z.number().min(0)),
  props: z.unknown(),
});
export type PropsCatalogo = z.infer<typeof forma>;

/** Esquema para el panel de props del Studio: el de la escena, campo por campo. */
export const esquemaCatalogo = (nombre: NombreEscena) =>
  // para TypeScript basta la forma general; el Studio usa el esquema real de la escena
  forma.extend({ componente: z.literal(nombre), props: CATALOGO[nombre].esquema }) as unknown as typeof forma;

export const muestraDe = (nombre: NombreEscena): PropsCatalogo => {
  const { ejemplo } = CATALOGO[nombre];
  return { componente: nombre, paleta: PALETA_CATALOGO, ...ejemplo };
};

export const calcularCatalogo: CalculateMetadataFunction<PropsCatalogo> = ({ props }) => ({
  durationInFrames: Math.max(1, framesSinVoz(props, FPS)),
});

/** Una escena del catálogo dentro de un video de una sola escena, sin voz ni música. */
export const EscenaDeCatalogo: React.FC<PropsCatalogo> = ({ componente, paleta, duracion_s, cola_s, beats, props }) => {
  const validas = CATALOGO[componente].esquema.safeParse(props);
  if (!validas.success) {
    return (
      <AbsoluteFill style={{ backgroundColor: paleta.fondo, color: paleta.papel, fontFamily: fuente.mono, fontSize: 30, padding: 80, whiteSpace: 'pre-wrap' }}>
        {`Props no válidas para ${componente}:\n\n${validas.error.issues.map((i) => `· ${i.path.join('.')}: ${i.message}`).join('\n')}`}
      </AbsoluteFill>
    );
  }
  const video: VideoData = {
    id: '000-catalogo', titulo: componente, formato: 'largo', fps: FPS, ancho: 1920, alto: 1080, paleta,
    escenas: [{ id: 's01', seccion: 'catálogo', componente, duracion_s, cola_s, intensidad: 3, cambio: 'muestra del catálogo', beats, props: validas.data as Record<string, unknown> }],
  };
  return <VideoLargo video={video} />;
};
