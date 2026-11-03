// Punto de entrada del laboratorio: separado del de los episodios (src/index.ts), así una muestra
// nunca aparece en la lista de videos ni toca su validación.
//   npx remotion studio laboratorio/remotion/index.ts
//   npx remotion render laboratorio/remotion/index.ts lab-02-cordillera-tinta out/...
import { registerRoot } from 'remotion';
import { LabRoot } from './Root';

registerRoot(LabRoot);
