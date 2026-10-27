export type Paleta = { fondo: string; papel: string; ocre: string; rojo: string };

export type Escena = {
  id: string;
  seccion: string;
  duracion_s: number;
  /** Archivo en public/ con la voz de esta escena. Si existe, manda su duración. */
  voz?: string;
  /** Segundos que la escena sigue después de que termina la voz. */
  cola_s?: number;
  intensidad: number;
  cambio: string;
  intencion?: string;
  transicion_salida?: 'corte' | 'fundido';
  /** Momentos clave dentro de la escena, en segundos (se ajustan a la voz grabada). */
  beats: Record<string, number>;
  /** true cuando los beats ya se cuadraron a mano con la voz grabada (no se escalan). */
  beats_ajustados?: boolean;
  textos?: Record<string, string>;
  [extra: string]: unknown;
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
export type EscenaResuelta = Escena & { frames: number; vozOk: boolean };

export type VideoProps = { video: VideoData; resueltas?: EscenaResuelta[] };
