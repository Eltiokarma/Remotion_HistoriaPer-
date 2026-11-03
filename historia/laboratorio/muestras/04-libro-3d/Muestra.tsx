import { ContactShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { trazoManuscrito } from '../../../src/components/graficos/svg';
import { mix, tramo } from '../../../src/direction/anim';
import { mezclar } from '../../../src/estilo/color';
import { fuente } from '../../../src/estilo/fuentes';
import { textura } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 04 · Libro con volumen: la cámara se acerca y se abre una página (Three.js + R3F + drei,
 * dentro de Remotion con @remotion/three).
 *
 * Qué se prueba: si el 3D puede vivir con la estética del canal (papel, tinta, ocre, luz de lámpara)
 * en vez de verse como un render de producto, y cuánto cuesta renderizarlo sin GPU.
 *
 * Coreografía (no mover todo a la vez, CLAUDE.md §4):
 *   0,0–2,4 s  la cámara baja hacia el libro cerrado (solemne); el libro quieto
 *   2,4–3,5 s  la cámara quieta; la tapa se abre sobre el lomo (pesado)
 *   3,5–4,5 s  pasa una hoja, curvada (natural)
 *   4,5–5,0 s  quieto
 *
 * Todo depende del cuadro: la cámara, la tapa y la curva de la hoja se calculan con tramo(); la
 * escena no usa useFrame ni relojes de three.js.
 */

// medidas del libro (unidades de three.js ≈ decímetros)
const ANCHO = 2.0; // de lomo a canto
const LARGO = 2.8;
const TAPA = 0.05;
const BLOQUE = 0.26;

/** Dibuja una textura en un canvas 2D (para las páginas y la tapa). */
const lienzo = (w: number, h: number, dibujar: (c: CanvasRenderingContext2D) => void): THREE.CanvasTexture => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d');
  if (!c) throw new Error('sin contexto 2D');
  dibujar(c);
  const tx = new THREE.CanvasTexture(cv);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 4;
  return tx;
};

/** Papel con su fibra (la textura del canal) y renglones asémicos: no dice nada inventado. */
const pagina = (papel: HTMLImageElement, semilla: number, conTitulo: boolean) =>
  lienzo(1024, 1434, (c) => {
    c.fillStyle = PALETA.papel;
    c.fillRect(0, 0, 1024, 1434);
    c.globalCompositeOperation = 'multiply';
    c.drawImage(papel, 0, 0, 1024, 1434);
    c.globalCompositeOperation = 'source-over';
    c.strokeStyle = 'rgba(28,27,25,0.75)';
    c.lineWidth = 2.2;
    if (conTitulo) {
      c.fillStyle = PALETA.fondo;
      c.textAlign = 'center';
      c.font = `500 64px ${fuente.imprenta}`;
      c.fillText('HISTORIA', 512, 360);
      c.font = `italic 40px ${fuente.libro}`;
      c.fillText('del altiplano', 512, 430);
      c.fillStyle = PALETA.rojo;
      c.fillRect(472, 486, 80, 4);
    }
    const desde = conTitulo ? 620 : 150;
    for (let i = 0; desde + i * 46 < 1300; i++) {
      c.stroke(new Path2D(trazoManuscrito(semilla + i, 120, desde + i * 46, 784, 15)));
    }
  });

type Texturas = { tapa: THREE.CanvasTexture; guarda: THREE.CanvasTexture; portadilla: THREE.CanvasTexture; hoja: THREE.CanvasTexture; dorso: THREE.CanvasTexture; cantos: THREE.CanvasTexture };

const useTexturas = (): { tx: Texturas | null; listo: () => void } => {
  const [tx, setTx] = useState<Texturas | null>(null);
  const [h] = useState(() => delayRender('libro: texturas y fuentes'));
  useEffect(() => {
    const img = new Image();
    img.src = textura.papel;
    Promise.all([
      new Promise((ok, mal) => { img.onload = ok; img.onerror = mal; }),
      document.fonts.load(`64px ${fuente.imprenta}`),
      document.fonts.load(`italic 40px ${fuente.libro}`),
    ]).then(() => {
      const cuero = mezclar(PALETA.rojo, PALETA.fondo, 0.55);
      setTx({
        tapa: lienzo(1024, 1434, (c) => {
          c.fillStyle = cuero;
          c.fillRect(0, 0, 1024, 1434);
          c.globalCompositeOperation = 'multiply';
          c.drawImage(img, 0, 0, 1024, 1434);
          c.globalCompositeOperation = 'source-over';
          c.strokeStyle = PALETA.ocre;
          c.lineWidth = 5;
          c.strokeRect(70, 70, 884, 1294);
          c.lineWidth = 2;
          c.strokeRect(88, 88, 848, 1258);
          c.fillStyle = PALETA.ocre;
          c.textAlign = 'center';
          c.font = `500 72px ${fuente.imprenta}`;
          c.fillText('HISTORIA', 512, 600);
          c.font = `italic 44px ${fuente.libro}`;
          c.fillText('del altiplano', 512, 680);
        }),
        guarda: lienzo(512, 717, (c) => {
          // la guarda: papel teñido de ocre, como el interior de las tapas de un libro viejo
          c.fillStyle = mezclar(PALETA.papel, PALETA.ocre, 0.45);
          c.fillRect(0, 0, 512, 717);
          c.globalCompositeOperation = 'multiply';
          c.drawImage(img, 0, 0, 512, 717);
        }),
        portadilla: pagina(img, 300, true),
        hoja: pagina(img, 500, false),
        dorso: pagina(img, 700, false),
        cantos: lienzo(64, 256, (c) => {
          // el canto de las hojas: rayitas finas, como un bloque de papel visto de lado
          c.fillStyle = mezclar(PALETA.papel, PALETA.ocre, 0.25);
          c.fillRect(0, 0, 64, 256);
          for (let y = 0; y < 256; y += 3) {
            c.fillStyle = `rgba(28,27,25,${0.08 + ((y * 7) % 5) * 0.02})`;
            c.fillRect(0, y, 64, 1);
          }
        }),
      });
    }).catch((e) => cancelRender(e));
  }, []);
  // El render se suelta desde dentro del lienzo (<AlEstarListo>), después de dibujar con las
  // texturas. Antes se soltaba con dos requestAnimationFrame: ThreeCanvas solo redibuja cuando cambia
  // el cuadro, así que a veces se capturaba la escena sin el libro (cuadros 0 y 3 en un render).
  return { tx, listo: () => continueRender(h) };
};

/** Hoja que pasa: una tira de 40 segmentos que se curva; la punta va detrás del lomo. */
const Hoja: React.FC<{ giro: number; frente: THREE.Texture; dorso: THREE.Texture }> = ({ giro, frente, dorso }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(ANCHO * 0.97, LARGO * 0.96, 40, 1), []);
  // el tramo de cada vértice (0–40), leído una sola vez: después las X ya están dobladas
  const tramoDe = useMemo(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    return Array.from({ length: pos.count }, (_, k) => Math.round(((pos.getX(k) + (ANCHO * 0.97) / 2) / (ANCHO * 0.97)) * 40));
  }, [geo]);
  useMemo(() => {
    // giro: 0 (echada a la derecha) → 1 (echada a la izquierda). La curva es máxima a mitad del giro.
    const a0 = giro * Math.PI * 0.995;
    const curva = Math.sin(giro * Math.PI) * 1.5;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const w = ANCHO * 0.97;
    const seg = 40;
    // integrar la tira desde el lomo: cada tramo un poco más atrasado que el anterior
    const xs: number[] = [0], ys: number[] = [0];
    for (let i = 1; i <= seg; i++) {
      const u = i / seg;
      const ang = a0 - curva * Math.pow(u, 1.6) * (giro < 0.5 ? 1 : -0.35);
      xs.push(xs[i - 1] + Math.cos(ang) * (w / seg));
      ys.push(ys[i - 1] + Math.sin(ang) * (w / seg));
    }
    for (let k = 0; k < pos.count; k++) {
      const i = tramoDe[k];
      // la hoja vive en el plano XY local (X del lomo al canto); Z local es «hacia arriba»
      pos.setX(k, xs[i]);
      // se levanta apenas al girar: al final queda sobre la guarda y no la atraviesa
      pos.setZ(k, ys[i] + giro * 0.08);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }, [geo, giro, tramoDe]);
  return (
    // acostada sobre el bloque: el eje X local va del lomo al canto, Z hacia arriba
    <group position={[-ANCHO / 2, TAPA + BLOQUE + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial map={frente} side={THREE.FrontSide} roughness={0.95} />
      </mesh>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial map={dorso} side={THREE.BackSide} roughness={0.95} />
      </mesh>
    </group>
  );
};

export const LibroTres: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const { tx, listo } = useTexturas();

  const acerca = tramo(t, 0, 2.4, 'solemne');
  const abre = tramo(t, 2.4, 1.1, 'pesado');
  const pasa = tramo(t, 3.5, 1.0, 'natural');

  // la cámara: de arriba y lejos, hacia el libro; termina mirando la página abierta
  const cam: [number, number, number] = [mix(0.6, -0.3, acerca), mix(8.4, 5.0, acerca), mix(6.2, 3.3, acerca)];
  const mira: [number, number, number] = [mix(0, -0.45, acerca), 0, mix(0, 0.15, acerca)];

  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 32, position: cam, near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          // deja en el registro del render qué backend gráfico dibujó de verdad (GPU o software)
          const c = gl.getContext();
          const info = c.getExtension('WEBGL_debug_renderer_info');
          // console.warn y no console.log: Remotion muestra los warn sin --log=verbose
          console.warn(`[lab04] WebGL: ${info ? c.getParameter(info.UNMASKED_VENDOR_WEBGL) : '?'} | ${info ? c.getParameter(info.UNMASKED_RENDERER_WEBGL) : c.getParameter(c.RENDERER)} | ${c.getParameter(c.VERSION)} | búfer ${c.drawingBufferWidth}×${c.drawingBufferHeight} | dpr ${gl.getPixelRatio()}`);
        }}>
        <Camara posicion={cam} mira={mira} />
        <AlEstarListo listo={tx !== null} alDibujar={listo} />
        <color attach="background" args={[PALETA.fondo]} />
        {/* luz de lámpara desde arriba a la izquierda, cálida; un relleno frío y bajo */}
        <ambientLight intensity={0.35} color={mezclar(PALETA.papel, '#ffffff', 0.3)} />
        <directionalLight position={[-3.5, 6, 2.5]} intensity={2.4} color={mezclar(PALETA.papel, PALETA.ocre, 0.25)} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
        <directionalLight position={[4, 2, -3]} intensity={0.35} color="#9fb3c8" />
        {/* la mesa */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={mezclar(PALETA.fondo, PALETA.ocre, 0.18)} roughness={1} />
        </mesh>
        <ContactShadows position={[0, 0.002, 0]} scale={8} blur={2.6} opacity={0.55} far={1.5} frames={1} />
        {tx ? (
          <group rotation={[0, 0.06, 0]}>
            {/* contratapa y bloque de hojas */}
            <Tapa tx={tx} position={[0, TAPA / 2, 0]} />
            <mesh position={[0.01, TAPA + BLOQUE / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[ANCHO - 0.04, BLOQUE, LARGO - 0.06]} />
              {/* caras: +x, -x, +y, -y, +z, -z */}
              <meshStandardMaterial attach="material-0" map={tx.cantos} roughness={1} />
              <meshStandardMaterial attach="material-1" map={tx.cantos} roughness={1} />
              <meshStandardMaterial attach="material-2" map={tx.hoja} roughness={0.95} />
              <meshStandardMaterial attach="material-3" map={tx.cantos} roughness={1} />
              <meshStandardMaterial attach="material-4" map={tx.cantos} roughness={1} />
              <meshStandardMaterial attach="material-5" map={tx.cantos} roughness={1} />
            </mesh>
            {/* la hoja que pasa, encima de la portadilla */}
            {abre > 0 ? <Hoja giro={pasa} frente={tx.portadilla} dorso={tx.dorso} /> : null}
            {/* la tapa, con bisagra en el lomo (x = -ANCHO/2) */}
            <group position={[-ANCHO / 2, TAPA + BLOQUE + TAPA / 2, 0]} rotation={[0, 0, abre * Math.PI * 0.995]}>
              <Tapa tx={tx} position={[ANCHO / 2, 0, 0]} />
            </group>
          </group>
        ) : null}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/**
 * Una tapa: caja simple con la textura solo arriba (cuero con el título) y abajo (la guarda).
 * RoundedBox de drei daba bordes redondos, pero sus UV no cubren la cara de 0 a 1: el título
 * quedaba chico en una esquina. Se cambió por una caja con un material por cara.
 */
const Tapa: React.FC<{ tx: Texturas; position: [number, number, number] }> = ({ tx, position }) => {
  const cuero = mezclar(PALETA.rojo, PALETA.fondo, 0.6);
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[ANCHO, TAPA, LARGO]} />
      <meshStandardMaterial attach="material-0" color={cuero} roughness={0.8} />
      <meshStandardMaterial attach="material-1" color={cuero} roughness={0.8} />
      <meshStandardMaterial attach="material-2" map={tx.tapa} roughness={0.8} />
      <meshStandardMaterial attach="material-3" map={tx.guarda} roughness={0.95} />
      <meshStandardMaterial attach="material-4" color={cuero} roughness={0.8} />
      <meshStandardMaterial attach="material-5" color={cuero} roughness={0.8} />
    </mesh>
  );
};

/** Cuando las texturas entran a la escena, dibuja una vez y recién entonces suelta el render. */
const AlEstarListo: React.FC<{ listo: boolean; alDibujar: () => void }> = ({ listo, alDibujar }) => {
  const advance = useThree((s) => s.advance);
  const hecho = useRef(false);
  useEffect(() => {
    if (!listo || hecho.current) return;
    hecho.current = true;
    advance(performance.now());
    requestAnimationFrame(alDibujar);
  }, [listo, advance, alDibujar]);
  return null;
};

/** La cámara se pone donde dice el cuadro (sin animaciones propias de three.js). */
const Camara: React.FC<{ posicion: [number, number, number]; mira: [number, number, number] }> = ({ posicion, mira }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...posicion);
  camera.lookAt(...mira);
  camera.updateProjectionMatrix();
  return null;
};
