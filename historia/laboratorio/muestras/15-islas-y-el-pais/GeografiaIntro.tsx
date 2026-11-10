import {Img,staticFile} from 'remotion';
import {tramo,mix} from '../../../src/direction/anim';
import {fuente} from '../../../src/estilo/fuentes';
import type geografia from './geografia.json';
import type mapa from './mapa-inline.json';
import type datos from './datos.json';
import type tiempos from './tiempos.json';

type Props={t:number;geografia:typeof geografia;mapa:typeof mapa;datos:typeof datos;tiempos:typeof tiempos};
const OCRE='#d2b77a',TIZA='#ede5cb',SUAVE='#bec9b6';
const image=(n:string)=>staticFile('prueba-002/'+n+'.svg');

/** Un mapa vectorial con viewBox móvil: el acercamiento no crea una imagen gigante en memoria. */
export const GeografiaIntro:React.FC<Props>=({t,geografia:g,mapa:m,datos:d,tiempos:q})=>{
 const c=g.camara,z=tramo(t,c.inicio_zoom,c.duracion_zoom,'pesado'),scale=Math.exp(Math.log(c.escala_final)*z);
 const px=mix(g.pisco.punto[0],c.ancla_pisco[0],z),py=mix(g.pisco.punto[1],c.ancla_pisco[1],z);
 const bx=g.pisco.punto[0]-px/scale,by=g.pisco.punto[1]-py/scale;
 const plano=tramo(t,c.inicio_plano,c.duracion_plano,'pesado'),mapOpacity=1-tramo(t,c.inicio_plano+.15,1.45,'natural');
 const avance=tramo(t,c.inicio_travelling,c.duracion_travelling,'pesado'),travel=c.desplazamiento*avance;
 const marAbierto=plano*(1-tramo(t,c.inicio_travelling+c.duracion_travelling-.7,1.5,'natural'));
 const encuadraMar=tramo(t,c.inicio_travelling+c.duracion_travelling,.8,'pesado');
 const cx=px+(g.chincha.punto[0]-g.pisco.punto[0])*scale,cy=py+(g.chincha.punto[1]-g.pisco.punto[1])*scale;
 const active=z<.96?0:avance<.5?1:2;
 const voz=q.parrafos.find(p=>p.id==='islas')!,guanoCue=voz.desde+(voz.palabras.find(w=>w.texto.toLocaleLowerCase('es')==='guano')?.segundo??5.5);
 const guano=tramo(t,guanoCue-.12,.7,'natural');
 const pin=(x:number,y:number,label:string,alpha:number=1)=> <div style={{position:'absolute',left:x,top:y,opacity:alpha}}>
  <div style={{position:'absolute',width:17,height:17,borderRadius:'50%',background:OCRE,border:'3px solid #f4e7bb',left:-11,top:-11,boxShadow:'0 0 0 6px #cdb67e28'}}/>
  <div style={{position:'absolute',left:23,top:-30,fontFamily:fuente.libro,fontSize:38,fontWeight:700,color:TIZA,whiteSpace:'nowrap',textShadow:'0 2px 4px #203b33'}}>{label}</div>
 </div>;
 return <>
  <div style={{position:'absolute',inset:0,opacity:mapOpacity,perspective:1600}}>
   <svg width={1920} height={1080} viewBox={`${bx} ${by} ${1920/scale} ${1080/scale}`} preserveAspectRatio="none" style={{position:'absolute',inset:0,transform:`rotateX(${55*plano}deg)`,transformOrigin:`${px}px ${py}px`}} dangerouslySetInnerHTML={{__html:m.svg}}/>
   {pin(px,py,g.rotulos.pisco,tramo(t,1.1,.7,'natural'))}
   {pin(cx,cy,g.rotulos.chincha,tramo(t,6.8,.7,'natural')*(1-plano))}
   <div style={{position:'absolute',left:165,top:785,fontSize:31,fontFamily:fuente.libro,color:SUAVE,opacity:1-plano}}>{g.rotulos.oceano}</div>
  </div>
  <div style={{position:'absolute',inset:0,opacity:plano}}>
   <div style={{position:'absolute',inset:0,clipPath:`inset(0 ${480*encuadraMar}px 0 ${489*encuadraMar}px)`}}><Img src={image('pisco-mar')} style={{position:'absolute',inset:0,width:1920,height:1080,transform:`translate(${2.3*Math.sin(t*.31)}px,-126.1px) scaleY(1.02)`,transformOrigin:'0 0'}}/></div>
   <div style={{position:'absolute',inset:0,opacity:marAbierto,transform:`translateX(${travel*.55}px)`}}><Img src={image('pisco-dunas')} style={{width:1920,height:1080}}/></div>
   <div style={{position:'absolute',inset:0,opacity:1-tramo(t,16.5,1.2,'natural'),transform:`translateX(${travel}px)`}}>
    <Img src={image('pisco-costa')} style={{position:'absolute',inset:0,width:1920,height:1080}}/>
    <div style={{position:'absolute',inset:0,clipPath:'inset(0 0 395px 0)'}}><Img src={image('pisco-ciudad')} style={{position:'absolute',inset:0,width:1920,height:1080,transform:`translateY(${75*(1-plano)}px)`}}/></div>
    {pin(c.ancla_pisco[0],c.ancla_pisco[1],g.rotulos.pisco)}
   </div>
   <div style={{position:'absolute',inset:0,transform:`translate(${-1225+travel}px,-160px) scale(1.5)`,transformOrigin:'0 0'}}>
    <Img src={image('03_roca_chincha')} style={{position:'absolute',inset:0,width:1920,height:1080}}/>
    <Img src={image('04_aves_chincha')} style={{position:'absolute',inset:0,width:1920,height:1080}}/>
   </div>
   <div style={{position:'absolute',left:1460,top:340,width:335,opacity:guano,fontFamily:fuente.libro,color:OCRE,fontSize:51,fontWeight:600}}>{d.guano}</div>
   <div style={{position:'absolute',left:1460,top:410,width:335,opacity:guano,fontFamily:fuente.libro,color:TIZA,fontSize:31,fontWeight:600,lineHeight:1.12}}>{d.definicion}</div>
  </div>
  <div style={{position:'absolute',left:115,top:924,display:'flex',gap:28,fontFamily:fuente.libro,fontSize:30,color:SUAVE,opacity:tramo(t,.6,.6,'natural')}}>
   {g.rotulos.breadcrumb.map((label,i)=><div key={label} style={{color:i===active?OCRE:SUAVE,fontWeight:i===active?700:400}}>{i>0?'›  ':''}{label}</div>)}
  </div>
  <div style={{position:'absolute',right:120,top:924,fontFamily:fuente.libro,fontSize:23,color:SUAVE,opacity:plano*(1-avance)}}>{g.rotulos.nota}</div>
 </>;
};
