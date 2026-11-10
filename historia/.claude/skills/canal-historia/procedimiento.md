# Procedimiento de una muestra del laboratorio

Desde `historia/`. Las reglas de comparación están en `laboratorio/README.md`.

## 0. Referencias, antes de diseñar

Lo que destrabó la muestra 06 no fue una técnica: fueron las referencias de Gerson. Antes de dibujar
una escena o una muestra visual:

- Pedirle a Gerson referencias de cómo se tiene que ver, o proponerle dos o tres (descritas o
  enlazadas, con su origen) y que elija.
- Anotar en el informe **qué se toma de cada una** (técnicas: capas, luz, color, encuadre) y qué no.
  Las referencias no se copian ni se usan como recurso: se leen.
- Si no hay referencia todavía, decirlo: el primer render es un borrador para conseguirla, no algo
  que se muestre como terminado.

## 1. Preparar

- Carpeta `laboratorio/muestras/NN-nombre/` con el código y un `INFORME.md`.
- Remotion: componente en `Muestra.tsx`, registrado en `laboratorio/remotion/Root.tsx`
  (`lab-NN-nombre`, 150 cuadros, 1920×1080, 30 fps; `comun.ts`).
- Otra herramienta (Manim, Blender…): su script y un `.sh` en `laboratorio/scripts/` que pase por
  `medir.py`.
- Beats en cuadros, pesos del canal (`tramo`), azar con semilla, paleta y fuentes del canal.
- Recursos externos: origen y licencia en el informe antes de usarlos.
- **Sonido:** al menos el acento del beat principal (el golpe, la revelación), con `Sfx`
  (`src/components/audio/Sfx.tsx`, catálogo en `public/compartido/audio/sfx/`) en el cuadro exacto del
  beat. Si el sonido no existe, se sintetiza en `scripts/generar_audio.py` (material propio) o queda
  como pendiente en el informe. Una muestra sin sonido se dice «sin sonido» al mostrarla.

## 2. Comprobar el código

```bash
npm run typecheck && npm run reglas
```

## 3. Previa y revisión

```bash
./laboratorio/scripts/remotion.sh NN-nombre previa
```

```bash
python3 laboratorio/scripts/revisar.py NN-nombre laboratorio/out/NN-nombre/previa.mp4
```

- Mirar `resultados/NN-nombre/hoja.jpg` y además los tramos de movimiento a tamaño real
  (`ffmpeg -ss <s> -i … -frames:v 1` o un `select` de cuadros con `tile`).
- Un parpadeo local en un objeto que se mueve rápido puede ser solo movimiento: mirar esos cuadros.
- Antes de corregir un defecto, guardar la evidencia en `resultados/NN-nombre/antes/`.

### Pase de imagen (antes de mostrar nada a Gerson)

La revisión automática ve parpadeos y cuadros vacíos, no si la imagen tiene vida. Mirar el cuadro a
tamaño real y contestar cada punto; si uno falla y la escena lo necesita, se corrige antes de mostrar.
Viene de los veredictos de Gerson (`criterios.md`: tanda 1 «muy plano», muestra 06 «sin corazón»).

- [ ] **Profundidad:** varias capas con escala de valor y color de lejos a cerca (lo lejano toma el color
      del aire, lo cercano es oscuro y saturado). No tres grises iguales.
- [ ] **Separación:** cada capa se distingue de la de atrás (bruma al pie, contorno, contraste).
- [ ] **Luz con dirección:** se sabe de dónde viene la luz (sol, ventana, lámpara) y las formas tienen
      lado de luz y lado de sombra.
- [ ] **Encuadre:** un primer plano que enmarca o da escala, cortado por el borde; composición
      asimétrica con intención; el ojo sabe dónde mirar.
- [ ] **Suelo o espacio que se aleja:** diagonales que entran hacia el fondo, no solo franjas horizontales.
- [ ] **Ritmo:** quietud antes del golpe; el golpe se siente (imagen **y** sonido).
- [ ] **Algo que se sienta:** una palabra para la emoción del plano (`direccion-historia` §0). Si no se
      puede nombrar, la imagen todavía es un diagrama.
- [ ] **Paleta del canal:** todo sale de sus colores o de mezclas; una excepción se anota con motivo.

Al mostrar, decir qué puntos se cumplen y cuáles no, en vez de presentarlo como terminado.

## 4. Final medida

```bash
LAB_MAQUINA="<máquina real>" LAB_CONDICION=caliente ./laboratorio/scripts/remotion.sh NN-nombre final
```

Si el registro ya existe, `medir.py` no lo pisa: lo guarda como `<etapa>-<fecha>.json`. Para
reemplazarlo a propósito, `LAB_SOBRESCRIBIR=1`. Para medir otra muestra como referencia (como la 03
frente a la 06), no hace falta nada más: su registro original queda intacto.

Para frío y caliente de toda la tanda: `laboratorio/scripts/medir_tanda.sh`. En la CI corre
`laboratorio/scripts/ci.sh` y deja los MP4 como artefacto.

## 5. Informe (`INFORME.md` de la muestra)

1. Qué demuestra (con evidencia), y qué se tomó de cada referencia.
1. El pase de imagen: qué puntos cumple y cuáles no.
2. Qué salió mal: tabla con el problema y su estado (resuelto, con evidencia antes/después; o queda).
3. Qué costó: render (máquina, frío/caliente), agente (de registros), humano (desconocido si no se midió).
4. Para qué escenas del canal sirve.
5. Cómo reproducirlo, parámetros, recursos externos y licencias.

## 6. Roadmap

Actualizar la tarea en `roadmap/roadmap.json` (estado, fecha real, evidencia, tiempos medidos o
`null`) y luego:

```bash
node roadmap/generar.mjs && node roadmap/generar.mjs --comprobar
```

## Ajustar a mano (la línea de tiempo)

Si Gerson quiere mover tiempos o posiciones sin tocar código: escribir la pieza en el formato editable
del Studio (`Interactive.*` con nombre, claves `interpolate(frame, …)` en línea, curvas = pesos del
canal en números). Modelo: `laboratorio/muestras/12-titulo-editable/`. El Studio escribe el cambio en
el archivo; después, `npm run reglas` y `npm run typecheck`.

## Ideas tomadas de otros repositorios (2026-11-10)

Adaptadas, no instaladas (como los skills de Emil Kowalski, ver `movimiento.md`). Fuentes: `ClaudeAnimationBase`
(John Heibel, MIT), `lemo-opuscar` (`DIRECTOR.md`, LemoLab, MIT) y `video-shotcraft` (Apache-2.0).

- **Hoja de lecturas por beat.** Antes de animar, escribir por cada beat qué tiene que *entender* el espectador
  (no qué se mueve), con inicio y fin. Dos lecturas no se pisan: si se pisan, una espera.
- **Referencias con dos columnas.** Para cada referencia: qué se aprende de ella y qué **no** se toma.
- **Tres estructuras antes de elegir.** Para la secuencia propia del tema (§1.1·4), esbozar tres y elegir una.
  Si se parece a la de otro episodio en más de dos rasgos (encuadre, recorrido, ritmo, paleta, sonido,
  remate), no es propia.
- **Revisar en tres escalas.** La hoja de contactos; una tira cada 0,2 s en los tramos de movimiento; y un
  recorte que sigue el objeto que se mueve (ahí se ven los saltos que la hoja esconde).
- **Después de un silencio**, el primer sonido es de los que más pesan: elegirlo, no dejar el que toque.
- **Pendiente de medir en el laboratorio:** el desfase entre audio y video del render (se dice que el AAC
  adelanta o atrasa ~1 cuadro) y alinear los efectos por su pico, no por el comienzo del archivo.

**Choques (manda el canal):** «nada quieto nunca» (aquí, ≥ 20 % de cámara quieta y la imagen terminada se
sostiene); «sin texto en pantalla» (aquí, el texto aporta lo que la voz no dice, §5); «transición en cada
corte» (aquí, cortes J y L, y el corte duro se declara, §6); curvas sueltas `Easing.bezier` (aquí, pesos, §11);
voz TTS por defecto (aquí, la voz de Gerson, §1.1·1).
