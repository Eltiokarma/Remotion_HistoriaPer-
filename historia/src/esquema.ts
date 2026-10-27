import { zColor } from '@remotion/zod-types';
import { z } from 'zod';

/**
 * Forma de videos/<id>/escenas.json. Si el JSON no calza, el Studio y `npm run validar`
 * dicen exactamente qué campo está mal. Las props de cada escena las valida su componente
 * (ver src/escenas/esquemas.ts).
 */

export const esquemaPaleta = z.object({
  /** tinta / fondo oscuro */
  fondo: zColor(),
  /** papel envejecido */
  papel: zColor(),
  /** dorado viejo: textos y filetes sobre fondo oscuro */
  ocre: zColor(),
  /** rojo de corrector: lo que importa */
  rojo: zColor(),
  /** verde guano / óxido: acentos de época, siempre en poca cantidad */
  verde: zColor().default('#5e6b4e'),
});

const nivel = z.number().min(0).max(1.5);
const ventanaBeats = { desde_beat: z.string().optional(), hasta_beat: z.string().optional() };

export const esquemaAudio = z.object({
  /**
   * Música de la escena: un archivo de public/videos/<id>/musica/. Suena desde el inicio de la
   * escena; si trae `desde_beat`, el archivo empieza a sonar en ese beat (la música entra ahí).
   */
  musica: z.object({ archivo: z.string(), nivel, ...ventanaBeats }).nullable().optional(),
  /** Ambientes de la biblioteca compartida (public/compartido/audio/ambiente/<nombre>.mp3). */
  ambientes: z.array(z.object({ nombre: z.string(), nivel, ...ventanaBeats })).optional(),
  /** Silencio deliberado: música y ambiente se callan entre dos beats. */
  silencio: z.object({ desde_beat: z.string(), hasta_beat: z.string() }).optional(),
  /** Cuánto baja la música cuando habla la voz (dB negativos). */
  duck_db: z.number().min(-30).max(0).optional(),
});

export const esquemaEscena = z.object({
  id: z.string().regex(/^s\d{2}$/, 'el id de escena es "s" + dos dígitos, p. ej. s01'),
  seccion: z.string(),
  /** Qué escena del catálogo (src/escenas) dibuja esta parte. */
  componente: z.string(),
  /** Segundos de narración estimados (sin la cola). Si hay voz, manda la voz (ver direction/timing.ts). */
  duracion_s: z.number().positive(),
  /** Segundos que la escena sigue después de que termina la voz. */
  cola_s: z.number().min(0).optional(),
  intensidad: z.number().int().min(1).max(5),
  cambio: z.string().min(5, 'toda escena necesita un "cambio" (si no cambia nada, sobra)'),
  intencion: z.string().optional(),
  transicion_salida: z.enum(['corte', 'fundido', 'duro']).optional(),
  /** Momentos clave en segundos desde el inicio de la escena, medidos sobre `duracion_s`. */
  beats: z.record(z.string(), z.number().min(0)),
  /** true cuando los beats ya se cuadraron a mano con la voz real (no se escalan). */
  beats_ajustados: z.boolean().optional(),
  /** Datos que recibe el componente: textos, cifras, lugares… */
  props: z.record(z.string(), z.unknown()),
  audio: esquemaAudio.optional(),
  /** Nota para humanos: en qué estado está la música aquí. */
  estado_musica: z.string().optional(),
});

export const esquemaVideo = z.object({
  id: z.string().regex(/^\d{3}-[a-z0-9-]+$/, 'el id del video es NNN-nombre, p. ej. 001-reformas'),
  titulo: z.string(),
  formato: z.enum(['largo', 'short']),
  fps: z.number().int().positive(),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
  paleta: esquemaPaleta,
  pregunta_central: z.string().optional(),
  /** Capa de película sobre todo el video. */
  atmosfera: z.object({ grano: z.number().min(0).max(1), vineta: z.number().min(0).max(1) }).optional(),
  escenas: z.array(esquemaEscena).min(1),
});

export type Paleta = z.infer<typeof esquemaPaleta>;
export type AudioEscena = z.infer<typeof esquemaAudio>;
export type Escena = z.infer<typeof esquemaEscena>;
export type VideoData = z.infer<typeof esquemaVideo>;

/** Escena ya resuelta: duración final en frames, beats ajustados y qué voz suena. */
export type EscenaResuelta = Escena & {
  frames: number;
  /** Ruta (relativa a public/) de la voz que suena, o null si no hay ninguna. */
  vozSrc: string | null;
  vozProvisional: boolean;
};

/** Lo que recibe cada escena del catálogo. P = sus props ya validadas. */
export type EscenaProps<P> = {
  escena: EscenaResuelta;
  props: P;
  video: VideoData;
};
