import type { EscenaProps } from '../esquema';
import { DiasYManuscrito } from './DiasYManuscrito/Escena';
import { Presentacion } from './Presentacion/Escena';
import { PaisajeALibro } from './PaisajeALibro/Escena';
import { SerieCapitulos } from './SerieCapitulos/Escena';
import { Cierre } from './Cierre/Escena';
import { MapaRutas } from './MapaRutas/Escena';
import type { NombreEscena } from './esquemas';

/** Componente de cada escena del catálogo (ver ./esquemas.ts). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENTES: Record<NombreEscena, React.FC<EscenaProps<any>>> = {
  DiasYManuscrito,
  Presentacion,
  PaisajeALibro,
  MapaRutas,
  SerieCapitulos,
  Cierre,
};
