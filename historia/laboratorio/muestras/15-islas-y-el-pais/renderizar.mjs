import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
const here=path.dirname(fileURLToPath(import.meta.url)),project=path.resolve(here,'../../..');
process.chdir(project);
const temporary=process.env.PRUEBA_TEMP_DIR?path.resolve(process.env.PRUEBA_TEMP_DIR):path.join(project,'laboratorio/out/15-islas-y-el-pais');
const outputDir=process.env.PRUEBA_OUTPUT_DIR?path.resolve(process.env.PRUEBA_OUTPUT_DIR):path.join(project,'out/prueba-002');
const bundleDir=path.join(temporary,'bundle'),qa=path.join(temporary,'qa'),out=path.join(outputDir,'002-prueba-islas.mp4');
fs.mkdirSync(qa,{recursive:true});fs.mkdirSync(path.dirname(out),{recursive:true});
const inicio=performance.now();
const serveUrl=process.argv.includes('--reuse')?bundleDir:await bundle({entryPoint:path.join(here,'index.tsx'),outDir:bundleDir,publicDir:path.join(here,'public'),enableCaching:false});
console.log('Montaje preparado. Dos capturas simultáneas; composición de prueba a 15 fps.');
const browser=await openBrowser('chrome',{logLevel:'error'});
try{
 const composition=await selectComposition({serveUrl,id:'prueba-002-islas',puppeteerInstance:browser,logLevel:'error'});
 const stills=[8,19,29,37,45.5,47.5,50.2,57,67,71];
 if(!process.argv.includes('--solo-video'))for(const t of stills){await renderStill({serveUrl,composition,output:path.join(qa,'cuadro-'+t+'.png'),frame:Math.round(t*composition.fps),scale:.5,puppeteerInstance:browser,logLevel:'error'});console.log('Revisar cuadro:',t,'s');}
 if(!process.argv.includes('--solo-cuadros')){
  const renderStart=performance.now();let reported=-1;
  const benchmark=process.argv.includes('--benchmark'),destination=benchmark?path.join(qa,'velocidad.mp4'):out;
  await renderMedia({serveUrl,composition,codec:'h264',outputLocation:destination,frameRange:benchmark?[0,44]:undefined,scale:.5,concurrency:2,imageFormat:'jpeg',jpegQuality:85,videoBitrate:'650k',encodingMaxRate:'850k',encodingBufferSize:'1700k',audioBitrate:'96k',x264Preset:'veryfast',pixelFormat:'yuv420p',enforceAudioTrack:true,puppeteerInstance:browser,logLevel:'error',onProgress:p=>{const part=Math.floor(p.renderedFrames/100);if(part!==reported){reported=part;console.log('Capturados:',p.renderedFrames,'cuadros; avance total',Math.round(p.progress*100)+'%; estimación restante',Math.round(p.renderEstimatedTime/1000),'s');}}});
  const measure={fecha:new Date().toISOString(),maquina:os.hostname(),cpu:os.cpus()[0].model,ram_gb:Math.round(os.totalmem()/1e9*10)/10,concurrencia:2,condicion:'Navegador preparado; sin caché de empaquetado',render_s:Math.round((performance.now()-renderStart)/100)/10,total_s:Math.round((performance.now()-inicio)/100)/10,duracion_s:benchmark?3:composition.durationInFrames/composition.fps,cuadros:benchmark?45:composition.durationInFrames,fps:composition.fps,ancho:960,alto:540,video_bitrate_objetivo:'650k',audio_bitrate:'96k',bytes:fs.statSync(destination).size,archivo:destination,voz:'Sintética provisional, es-PE-AlexNeural',alcance:benchmark?'Medición de 45 cuadros':'Extracto de prueba de la escena 1; no episodio completo',costo_servicios_pago:0,aprobacion_gerson:'Pendiente'};
  fs.writeFileSync(path.join(qa,benchmark?'velocidad.json':'render.json'),JSON.stringify(measure,null,2)+'\n');console.log(JSON.stringify(measure,null,2));
 }
}finally{await browser.close({silent:true});}
