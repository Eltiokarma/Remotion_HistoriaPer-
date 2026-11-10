# Rutina: conectar ElevenLabs por MCP y usarlo a favor del guion

Escrita el 2026-11-10. Todavía **sin probar en este repositorio**: el estado vive en el roadmap
(`t4-elevenlabs`). Lo que dice sobre el servidor MCP sale de su repositorio oficial
(`elevenlabs/elevenlabs-mcp`, MIT); verificar los nombres de las herramientas al instalarlo.

> **La regla que no se mueve** (`historia/CLAUDE.md` §1.1·1): la narración publicada es la voz de
> Gerson. ElevenLabs entra para **medir, alinear, limpiar y ambientar**, nunca para narrar. Nada de
> clonar la voz de Gerson: un clon se puede colar en un render final y es justo lo que YouTube
> desmonetiza.

## Parte 1 · Conectar (una vez)

### 1. La clave

1. En elevenlabs.io → **Developers → API Keys → Create**.
2. Dale solo los permisos que se van a usar (texto a voz, voz a texto, efectos, aislador de voz,
   música, alineación) y ponle un **límite mensual de créditos**: cada llamada del MCP gasta.
3. Guárdala en tu gestor de contraseñas. **Nunca** en el repositorio ni en el chat.

### 2. En la laptop (Windows), con Claude Desktop

1. Instalar `uv` (PowerShell):

   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. Abrir **Claude Desktop → Settings → Developer → Edit Config** (es
   `%APPDATA%\Claude\claude_desktop_config.json`) y agregar:

   ```json
   {
     "mcpServers": {
       "ElevenLabs": {
         "command": "uvx",
         "args": ["elevenlabs-mcp"],
         "env": {
           "ELEVENLABS_API_KEY": "<tu clave>",
           "ELEVENLABS_MCP_BASE_PATH": "C:\\canal\\elevenlabs"
         }
       }
     }
   }
   ```

   `ELEVENLABS_MCP_BASE_PATH` es donde guarda los audios: una carpeta **fuera de git**.
3. Cerrar Claude Desktop del todo (también de la bandeja) y abrirlo. Debe aparecer «ElevenLabs» en
   las herramientas.
4. Prueba: «Con ElevenLabs, dime cuántos créditos me quedan y lista mis voces». Si responde, está.

### 3. En la laptop, con Claude Code (terminal)

```bash
claude mcp add elevenlabs --scope user -e ELEVENLABS_API_KEY=<tu clave> -e ELEVENLABS_MCP_BASE_PATH=C:/canal/elevenlabs -- uvx elevenlabs-mcp
```

`--scope user` deja la clave en tu configuración, no en el proyecto (un `.mcp.json` del proyecto
se sube a git). Comprobar con `claude mcp list`.

### 4. En las sesiones en la nube (como esta)

El MCP de escritorio no corre aquí. Para la nube, lo práctico es la **API directa**: la clave se
guarda como *secreto de red* del entorno para el host `api.elevenlabs.io` (cabecera `xi-api-key`),
el proxy la inyecta y la clave no pasa por el chat ni por el repositorio. Pídemelo en una sesión y te
abro el formulario seguro; los scripts del repositorio (`historia/scripts/`) la usan igual que el MCP.

## Parte 2 · Usarlo a favor del guion

Ordenado por lo que más suma. Cada uso dice en qué paso de la producción entra.

### A. Beats exactos con la voz real (alineación forzada) — el más valioso

Hoy los beats de `escenas.json` se cuadran a mano después de grabar. La **alineación forzada** de
ElevenLabs recibe el audio de Gerson y el texto que ya conocemos (el guion), y devuelve en qué
segundo empieza cada palabra. Como el texto es el del guion, no hay errores de reconocimiento con
Azángaro, Denegri o los términos en aimara.

- **Cuándo:** apenas Gerson grabe `voz/sNN.wav`.
- **Cómo:** cada beat de `escenas.json` se ancla a una palabra del guion (`"sistema"` → la palabra
  «sistema» de s00). Un script alinea, reescribe los segundos y marca `beats_ajustados: true`. Es
  la idea pendiente del «editor de beats sobre la onda» (CLAUDE.md §15), sin editor.
- **Además:** los subtítulos salen de la misma alineación, con el texto exacto (§10 pide revisar a
  mano igual; se comparará con whisper.cpp en el laboratorio).
- **Música:** con los segundos reales, las pistas de Suno se recortan a los beats de verdad.

### B. Una voz provisional mejor (solo de trabajo)

La provisional de hoy (Piper, `voz_provisional.py`) tiene ritmo de metrónomo, y la dirección se
afina sobre ella. Una voz de ElevenLabs en español latinoamericano, con las marcas `[PAUSA n]`
convertidas a pausas reales, da tiempos más cercanos a los de Gerson y menos sorpresas al grabar.

- **Cuándo:** con el guion cerrado, antes de la escaleta.
- **Regla:** va en `voz-provisional/`, nunca en `voz/`; no se publica.

### C. Aislador de voz (grabaciones de campo)

Para lo que Gerson graba con el celular en Sillustani, Chucuito o la plaza de Azángaro (CLAUDE.md
§7, punto de vista participativo): saca el viento fuerte y el tráfico de la voz. Con mesura: las
respiraciones se quedan (skill de dirección, §3). Guardar siempre el original.

### D. Efectos que Freesound no tiene

Texto a efecto: «sello de goma sobre papel grueso», «pila de vales de papel que se asienta»,
«sacos de guano que caen sobre cubierta de madera». Solo para huecos: lo grabado o lo de Freesound
va primero. Con plan de pago, para uso comercial; se anota en `fuentes.md` como generado.

### E. Eleven Music, para comparar con Suno

Su ventaja para nosotros: se le pueden pedir **secciones con duración exacta** (en milisegundos).
Eso calza con los beats: «8,6 s de piano solo, 12 s de arpegios, frena en 20,6 s». Probarlo con una
escena (s04 o s05) en el laboratorio y comparar con la pista de Suno, a ciegas.

### F. Citas y personajes puntuales (con cuidado)

La regla lo permite marcado como tal: por ejemplo, la lectura de un documento de 1850. Que suene a
lectura, no a actuación, y que en pantalla esté el texto textual con su página. Usar poco: cada uso
suma voz sintética al video.

### Lo que **no** se hace

- Narración principal con TTS ni con un clon de Gerson.
- Doblaje automático de los episodios a otros idiomas con voz sintética (sería narración sintética).
- Música o voz de ElevenLabs sin anotar en `fuentes.md` (plan, fecha, qué se generó).

## Parte 3 · La rutina por episodio

1. Guion cerrado → **B** voz provisional → escaleta → animación.
2. Gerson graba `voz/sNN.wav` (si es de campo, **C**).
3. **A** alineación → beats ajustados → subtítulos → música recortada a los beats.
4. Huecos de sonido → Freesound; si no hay, **D**.
5. `npm run validar -- NNN-slug --final` y la prueba de escuchar sin mirar (§13).
