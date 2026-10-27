export type Paleta = { fondo: string; papel: string; ocre: string; rojo: string };

export type Escena = {
  id: string;
  seccion: string;
  duracion_s: number;
  /** Archivo en public/ con la voz real de esta escena. Si existe, manda su duración. */
  voz?: string;
  /** Voz provisional (TTS) que se usa mientras no exista la real. */
  voz_provisional?: string;
  audio?: AudioEscena;
  /** Segundos que la escena sigue después de que termina la voz. */
  cola_s?: number;
  intensidad: number;
  cambio: string;
  intencion?: string;
  transicion_salida?: 'corte' | 'fundido' | 'duro';
  /** Momentos clave dentro de la escena, en segundos (se ajustan a la voz grabada). */
  beats: Record<string, number>;
  /** true cuando los beats ya se cuadraron a mano con la voz grabada (no se escalan). */
  beats_ajustados?: boolean;
  textos?: Record<string, string>;
  [extra: string]: unknown;
};

/** Una pista de música o ambiente; desde/hasta son nombres de beats de la escena. */
export type Pista = { pista: string; nivel: number; desde_beat?: string; hasta_beat?: string };

export type AudioEscena = {
  musica?: Pista | null;
  ambientes?: Pista[];
  /** Silencio deliberado: música y ambiente se callan entre estos dos beats. */
  silencio?: { desde_beat: string; hasta_beat: string };
  /** Cuánto baja la música cuando habla la voz (dB negativos, entre -12 y -18). */
  duck_db?: number;
};

export type VideoData = {
  id: string;
  titulo: string;
  fps: number;
  ancho: number;
  alto: number;
  paleta: Paleta;
  escenas: Escena[];
};

/** Escena ya resuelta por calculateMetadata: duración final y si hay voz. */
export type EscenaResuelta = Escena & {
  frames: number;
  /** Voz que suena en esta escena (real o provisional), o null si no hay ninguna. */
  vozSrc: string | null;
  vozProvisional: boolean;
};

export type VideoProps = { video: VideoData; resueltas?: EscenaResuelta[] };
