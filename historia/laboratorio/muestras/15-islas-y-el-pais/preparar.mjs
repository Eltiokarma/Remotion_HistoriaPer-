import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),project=path.resolve(here,'../../..'),out=path.join(here,'public');
const copy=(a,b)=>{fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(a,b);};
const kit=path.join(project,'videos/002-la-deuda-defraudada/diseno/storyboard-seccion01/revision-detallada/recursos/chincha-gran-bretana/capas');
const names=['02_mar_chincha','03_roca_chincha','04_aves_chincha','07_barco','08_mapa_gran_bretana','09_campos_suelo','10_almacen','11_cultivos','13_flujo_comercial','14_carga_testigo'];
for(const n of names)copy(path.join(kit,n+'.svg'),path.join(out,'prueba-002',n+'.svg'));
for(const name of ['libro','venta','descuentos','ingreso','estado','reclamo']){const src=path.join('C:/Users/Gerson/VectorCraft-Prueba','prueba-002-'+name+'.svg'),dest=path.join(out,'prueba-002',name+'.svg');if(!fs.existsSync(dest)&&fs.existsSync(src))copy(src,dest);if(!fs.existsSync(dest))throw Error('Falta exportación VectorCraft '+name);}
for(const folder of ['fuentes','texturas'])fs.cpSync(path.join(project,'public/compartido',folder),path.join(out,'compartido',folder),{recursive:true});
for(const [kind,files]of [['ambiente',['mar','cuarto']],['sfx',['hoja','pluma','carpeta']]])for(const name of files)copy(path.join(project,'public/compartido/audio',kind,name+'.mp3'),path.join(out,'compartido/audio',kind,name+'.mp3'));
console.log('Recursos y texturas preparados; no se copia la biblioteca completa de videos.');
