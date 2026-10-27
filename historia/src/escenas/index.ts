import type { EscenaProps } from '../esquema';
import { DiasYManuscrito } from './DiasYManuscrito/Escena';
import { Presentacion } from './Presentacion/Escena';
import { PaisajeALibro } from './PaisajeALibro/Escena';
import { SerieCapitulos } from './SerieCapitulos/Escena';
import { Cierre } from './Cierre/Escena';
import { MapaRutas } from './MapaRutas/Escena';
import { PruebasDeImprenta } from './PruebasDeImprenta/Escena';
import { TiempoLargo } from './TiempoLargo/Escena';
import { MecanismoDeuda } from './MecanismoDeuda/Escena';
import { AprenderAMedir } from './AprenderAMedir/Escena';
import { LaPregunta } from './LaPregunta/Escena';
import { Objeciones } from './Objeciones/Escena';
import { LaCuenta } from './LaCuenta/Escena';
import { CirculosCorruptos } from './CirculosCorruptos/Escena';
import { Denunciantes } from './Denunciantes/Escena';
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
  PruebasDeImprenta,
  TiempoLargo,
  MecanismoDeuda,
  AprenderAMedir,
  LaPregunta,
  Objeciones,
  LaCuenta,
  CirculosCorruptos,
  Denunciantes,
};
