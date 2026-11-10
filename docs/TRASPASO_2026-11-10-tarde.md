# Traspaso · tarde del 2026-11-10

Sigue al [traspaso de la mañana](TRASPASO_2026-11-10.md). Para la próxima conversación: **musicalización del 001**
y las decisiones de abajo.

## Qué quedó hecho

- Los 16 diseños aprobados del 001 están integrados y se conserva su animación. También se recuperaron los
  efectos E01–E12. Detalle en `historia/videos/001-el-hombre/diseno/inventario-graficos-efectos.md` (§F y §G).
- Correcciones de la revisión de Gerson: la ruta a Nueva York ya no aparece antes de tiempo; el texto de la
  regresión y el de Lima van una idea a la vez, con su palabra en la voz y señalando lo que explican; el guion
  del s01 dice «Nueva York. Nuestro historiador revisa…».
- Vista previa más reciente: `historia/out/001-el-hombre-vista-previa-720p-v4.mp4`, fuera de git (720p,
  48 MB, voz provisional).
- Revisión de los once repositorios: `docs/HERRAMIENTAS.md`, sección «Repositorios revisados».

## Pendiente

1. **Musicalización del 001** (próxima conversación).
2. **Pruebas en el laboratorio** que salieron de los repositorios:
   - Física con `react-three-rapier`, calculada de antemano: por ejemplo, las diez monedas del gancho cayendo.
   - `Linocut` y `Halftone` de `react-postprocessing` sobre el libro 3D de la muestra 04.
   - Muestra 14 (grabado a buril): veredicto de Gerson, medirla sin otro render en paralelo y pasarle las vetas
     del acantilado.
   - `beats_voz.py` junto con las marcas por palabra de whisper.
3. **Decisión abierta sobre la voz del canal** (ver abajo).
4. Los avisos de las láminas que no se leen sobre papel (vale, edificio, fichero), y la «pequeña cruz» que
   todavía figura en `DIRECCION_DE_VIDEO.md`.

## Decisión abierta: ¿quién narra?

Gerson planteó (2026-11-10) que la narración sea con una voz sintética de buena calidad (ElevenLabs por MCP),
con otras voces para personajes. Su razón: el trabajo es en gran parte de la IA, y la gente no debería creer
que todo es suyo. La honestidad sobre la autoría es el centro de la propuesta.

**Choca con una regla innegociable** (`historia/CLAUDE.md` §1.1·1: narración con la voz real de Gerson). Esa
regla se apoya en la política de YouTube de julio de 2025 sobre contenido «inauténtico», que puede
desmonetizar la voz sintética sobre material producido en serie. Mientras Gerson no decida, la regla sigue
vigente y no se cambia.

Puntos a decidir:

- **Riesgo de monetización:** comprobar la política de YouTube vigente antes de decidir; no suponerla.
- **Declarar el contenido sintético:** YouTube pide declarar el contenido sintético realista. Con una voz IA,
  hay que marcarlo.
- **Opciones intermedias:**
  - (a) Voz IA para la exposición; Gerson con su voz en lo propio: su punto de vista, el lugar, lo personal (§7).
  - (b) Voz de Gerson, con la autoría declarada en el video y en la descripción («guion y animación
    desarrollados con IA bajo dirección de…»).
  - (c) Voz IA completa, declarada.
- **Lo que no cambia, sea cual sea la decisión:** el rigor (§1.1·2), las fuentes y la dirección de Gerson.

Si se decide cambiar la regla, se actualiza `historia/CLAUDE.md` §1.1·1 con la fecha y el motivo, igual que
las otras decisiones de Gerson.
