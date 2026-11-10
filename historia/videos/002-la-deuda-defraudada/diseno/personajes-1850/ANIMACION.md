# Animar los personajes por piezas

Entrega para Claude. Usar los modelos como personajes de ejemplo y ajustar cada gesto a una acción de la escena. El pedido de Gerson del 10 de noviembre de 2026 permite movimiento y expresión; reemplaza las indicaciones anteriores que exigían mantener quietos a los personajes del episodio 002.

## Construcción

Cada carpeta de personaje contiene el original VectorCraft, un SVG completo, un PNG de referencia, una versión recortada, la carpeta capas y rig.json. Todas las piezas de capas tienen viewBox 0 0 900 1200. Se colocan a x=0, y=0 con ancho=900 y alto=1200, en el orden del JSON. No ajustar cada pieza a sus bounds.

El campo parent define la jerarquía. Escena coloca al actor y su sombra en el plano; raiz coloca el cuerpo. Torso, cabeza y miembros se agrupan según sus relaciones. El antebrazo cuelga del brazo y la mano del antebrazo. Cada contenedor conserva el mismo origen del lienzo y usa el pivote indicado como transformOrigin en px. Las rotaciones de los hijos son locales: no sumar de nuevo el giro que ya heredan del padre.

Usar Img para cada SVG y las rutas delVideo del proyecto. Si se incorporan las SVG inline, prefijar id y referencias url(#…), href y xlink:href por personaje y archivo; se repiten identificadores de gradientes. El SVG completo es una referencia visual, no la pieza que deba trasladarse entera para fingir un gesto.

## Gestos y contacto

[gestos.json](gestos.json) contiene dos secuencias con estado inicial, preparación y pose de contacto. Los ángulos son grados CSS, positivos en sentido horario. Los ensayos nativos usaron el signo opuesto, porque VectorCraft declara sus giros antihorarios.

El saco y el folio están separados en objetos, con el mismo lienzo 900 × 1200 y colocación para la pose final. El JSON indica dónde insertarlos en profundidad. Sus trayectorias y contactos aún deben resolverse en la escena: no constituyen un sistema automático de cinemática inversa.

Para la carga, comenzar con un saco apoyado, acercar las manos, establecer el agarre y recién levantar. La mano sigue el punto de contacto. El brazo cercano tapa parte del saco y el lejano queda detrás. El objeto baja o se entrega antes de abrir los dedos. Para el reclamo, mostrar de dónde se toma el papel, sujetarlo por el borde y mantenerlo hasta que la mesa o un receptor lo reciban. La mano de agarre se corrigió para evitar cubrir el folio con una palma abierta.

Las poses SVG y las láminas muestran estados, no un ciclo para fundir ni una animación ya validada. Conservar el mismo personaje, prendas, mano y objeto durante el gesto. Probar también los estados intermedios y revisar hombro, codo, muñeca y contacto con el objeto a tamaño real. La pierna necesita conservar rodilla y apoyo del pie; no se ha dibujado un ciclo de caminar ni vistas de perfil o espalda. En la reclamante, la falda cubre las piernas y el chal cruza el torso: una caminata amplia necesitaría variantes de pliegues.

## Expresión

Rig.json enumera las combinaciones de ojos, cejas y boca. Mostrar una variante de cada familia por vez y una mano cercana por vez. Las demás quedan ocultas. La expresión cambia con el hecho que está sucediendo, no con cada palabra de la narración. Se pueden usar parpadeos puntuales y una inclinación leve de la cabeza; no un bucle de respiración, ojos o balanceo común a todos.

A, O y MBP son variantes disponibles para una intervención que tenga texto y voz definidos. No equivalen a un sistema completo de sincronización labial. Los personajes históricos no reciben diálogos inventados ni articulan automáticamente la narración de Gerson. Atención o inquietud no deben usarse para atribuir culpa o una emoción documentada a una persona real.

## Ritmo y estilo

La animación depende de useCurrentFrame. Pasar frame/fps a tramo, que en este repo trabaja en segundos. Usar los pesos del canal: una carga se levanta con peso; un folio entra ligero y se asienta. Los beats finales se ajustan a la voz. Mientras actúan los brazos, mantener quieta la cámara; cuando la cámara recorre la escena, sostener la pose.

Conservar degradados, sombra, grano y luz del video. La ropa acompaña la articulación con discreción. No deformar cabeza, manos ni la palabra GUANO para simular peso. El gesto termina y deja entender el resultado antes del siguiente. Las tres posiciones de una lámina no obligan a tres planos ni a duraciones iguales.
