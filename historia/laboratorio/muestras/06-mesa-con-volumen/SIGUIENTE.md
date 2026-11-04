# Dónde quedó la muestra 06 (para la próxima sesión)

Cerrado el 2026-11-04. Rama `claude/kind-keller-4h52xo`, último commit con todo subido. Nada sin
guardar. Sin PR abierto (Gerson no lo pidió).

## Estado

- **v3 hecha y renderizada** (10 s): plano amplio del escritorio, lámpara de banquero, pared con
  estante, hoja con física de papel, libro, pluma que escribe el rojo. Informe: [`INFORME.md`](INFORME.md).
- **Veredictos de Gerson:** v2 «ya no se ve tan plano; falta contexto» (aplicado en v3). Sobre v3 aún
  no dijo nada de la imagen. Registro: `historia/.claude/skills/canal-historia/criterios.md`.
- **Bloqueado: el sonido.** Los efectos sintetizados «son malazos». Gerson eligió CC0 de Freesound.
  Freesound responde 403 desde este entorno, también con la clave de la API
  (`FREESOUND_API_KEY`, ya está en el entorno). Detalle y lista de sonidos: [`SONIDOS.md`](SONIDOS.md).
  Roadmap: `t1-volumen`, estado `bloqueado`.

## Qué sigue

1. **Sonidos:** Gerson baja a mano los 5 sonidos de `SONIDOS.md` (filtro «Creative Commons 0») y los
   sube a `historia/public/compartido/audio/sfx/cc0/` (o los adjunta en la conversación) con el enlace
   de cada uno. Entonces: `LICENCIAS.md` al lado; recortar, fundidos ≥ 6 cuadros, nivelar con ffmpeg;
   cambiar los `<Sfx>` de `Muestra.tsx` (y el ambiente) por los nuevos; render; roadmap a `en_curso`.
2. **Pedir a Gerson el veredicto de la imagen de v3** (contexto, lámpara, plano amplio).
3. Pendientes que no se tocaron: el render subió a 138,9 s (candidatas a optimizar, por medir, en el
   informe); la lámpara y la pluma son planos dibujados (Gerson: «está bien por ahora»).

## Cómo retomar

```bash
cd historia && npm ci
```

```bash
./laboratorio/scripts/remotion.sh 06-mesa-con-volumen final
```

Cuadros sueltos sin render completo: `node laboratorio/scripts/cuadros.mjs lab-06-mesa-con-volumen 15,104,215`.
Fluidez: `npx tsx laboratorio/scripts/fluidez.ts laboratorio/muestras/06-mesa-con-volumen/movimiento.ts`.
Cómo se trabaja (y qué hizo el esfuerzo extra): skill `canal-historia`, en especial `procedimiento.md`,
`trampas.md` y `esfuerzo.md`.

## Consumo de esta sesión (medido, `consumo_sesion.py`)

Sesión completa (02:46–12:11 UTC, con una pausa larga entre vueltas): 99 llamadas, $12,89 de
equivalente API. Registro: `historia/laboratorio/resultados/06-mesa-con-volumen/esfuerzo/consumo-sesion-completa.json`.
