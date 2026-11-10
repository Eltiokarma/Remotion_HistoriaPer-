import type {CSSProperties} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Pizarra} from '../../../src/components/atmosfera/Pizarra';
import {Atmosfera} from '../../../src/components/atmosfera/Atmosfera';
import {Luz} from '../../../src/components/atmosfera/Luz';
import {PrecargaTexturas} from '../../../src/components/atmosfera/PrecargaTexturas';
import {Sfx} from '../../../src/components/audio/Sfx';
import {ambiente} from '../../../src/estilo/recursos';
import {fuente} from '../../../src/estilo/fuentes';
import {tramo, mix, asienta} from '../../../src/direction/anim';
import type datos from './datos.json';
import type tiempos from './tiempos.json';
import type geografia from './geografia.json';
import type mapa from './mapa-inline.json';
import {GeografiaIntro} from './GeografiaIntro';

type Props={datos:typeof datos;tiempos:typeof tiempos;geografia:typeof geografia;mapa:typeof mapa;soloIntroduccion?:boolean};
const OCRE='#d2b77a',TIZA='#ede5cb',SECUNDARIO='#b6c1a7';
const archivo=(name:string)=>staticFile('prueba-002/'+name+'.svg');
const fijo:CSSProperties={position:'absolute',margin:0};

/** Los SVG conservan sus gradientes. Cada archivo es una pieza funcional independiente. */
const Pieza=({name,x=0,y=0,w=1920,h=1080,opacity=1,style={}}:{name:string;x?:number;y?:number;w?:number;h?:number;opacity?:number;style?:CSSProperties})=>(
  <Img src={archivo(name)} style={{...fijo,left:x,top:y,width:w,height:h,opacity,...style}}/>
);
const Rotulo=({children,x,y,size=40,color=TIZA,opacity=1,width=1600,align='left',style={}}:{children:React.ReactNode;x:number;y:number;size?:number;color?:string;opacity?:number;width?:number;align?:CSSProperties['textAlign'];style?:CSSProperties})=>(
  <div style={{...fijo,left:x,top:y,width,fontSize:size,color,fontFamily:fuente.libro,fontWeight:600,lineHeight:1.12,opacity,textAlign:align,...style}}>{children}</div>
);

const Comercio=({t,datos:d,tiempos:q}:{t:number;datos:Props['datos'];tiempos:Props['tiempos']})=>{
  const p=(id:string)=>q.parrafos.find(p=>p.id===id)!;
  const abre=tramo(t,p('abono').desde+3.7,2.3,'pesado');
  const mercado=tramo(t,p('mercado').desde+1.7,0.9,'solemne');
  const abono=tramo(t,p('abono').desde+6.05,.7,'natural');
  const producto=tramo(t,p('islas').desde+4.5,0.7,'natural');
  const etiquetas=tramo(t,p('abono').desde+6.05,.7,'natural');
  const anotacion=producto*(1-tramo(t,p('abono').desde+3.35,.45,'natural'));
  const viaje=tramo(t,p('mercado').desde+2.1,1.25,'pesado');
  return <>
    <div style={{...fijo,inset:0,transform:`translate(${mix(375,0,abre)}px,${mix(-160,0,abre)}px) scale(${mix(1.5,1,abre)})`,transformOrigin:'0 0'}}>
      <Pieza name="02_mar_chincha" style={{transform:`translate(${2.3*Math.sin(t*.31)}px,${.6*Math.sin(t*.21)}px)`}}/>
      <Pieza name="03_roca_chincha"/>
      <Pieza name="04_aves_chincha"/>
      <Pieza name="07_barco" opacity={etiquetas} style={{transform:`rotate(${.38*Math.sin(t*.43)}deg)`,transformOrigin:'580px 640px'}}/>
      <Pieza name="09_campos_suelo" opacity={abono}/>
      <Pieza name="10_almacen" opacity={abono}/>
      <Pieza name="11_cultivos" opacity={abono}/>
      <Pieza name="08_mapa_gran_bretana" opacity={mercado} style={{filter:mercado>0?'drop-shadow(0 0 12px #d2b77a35)':undefined}}/>
      <Pieza name="14_carga_testigo" opacity={etiquetas}/>
      <Pieza name="13_flujo_comercial" opacity={mercado} style={{clipPath:`inset(0 ${(1-viaje)*100}% 0 0)`}}/>
      <Rotulo x={90} y={790} width={650} size={34} align="center" opacity={etiquetas}>{d.origen}</Rotulo>
      <Rotulo x={1190} y={790} width={650} size={34} align="center" opacity={mercado}>{d.destino}</Rotulo>
      <Rotulo x={760} y={660} width={370} size={35} align="center" color={OCRE} opacity={etiquetas}>{d.guano}</Rotulo>
    </div>
    <Rotulo x={1460} y={340} width={335} size={51} color={OCRE} opacity={anotacion}>{d.guano}</Rotulo>
    <Rotulo x={1460} y={410} width={335} size={31} opacity={anotacion}>{d.definicion}</Rotulo>
    <Rotulo x={765} y={868} width={1000} size={36} opacity={abono*abre} align="center">{d.uso}</Rotulo>
    <Rotulo x={765} y={925} width={1000} size={25} color={SECUNDARIO} opacity={mercado}>{d.comercio}</Rotulo>
  </>;
};

const Cuentas=({t,datos:d,tiempos:q}:{t:number;datos:Props['datos'];tiempos:Props['tiempos']})=>{
  const p=q.parrafos.find(p=>p.id==='cuentas')!;
  const venta=q.parrafos.find(p=>p.id==='venta')!;
  const obligaciones=q.parrafos.find(p=>p.id==='obligaciones')!;
  const cue=(word:string)=>p.desde+(p.palabras.find(w=>w.texto.toLocaleLowerCase('es')===word)?.segundo??0);
  const cueVenta=(word:string)=>venta.desde+(venta.palabras.find(w=>w.texto.toLocaleLowerCase('es')===word)?.segundo??0);
  const v=tramo(t,venta.desde+1.6,.5,'solemne');
  const focoVenta=tramo(t,cue('venta')-.12,.3,'natural')*(1-tramo(t,cue('gastos')-.12,.3,'natural'));
  const g=tramo(t,cue('gastos')-.12,.5,'solemne');
  const i=tramo(t,cue('ingreso')-.12,.6,'solemne');
  const estado=tramo(t,cueVenta('estado')-.12,.7,'solemne');
  const flecha=i*(1-tramo(t,obligaciones.desde-.2,.6,'natural'));
  const k=1.40,bookX=130,bookY=290;
  return <div style={{...fijo,left:1920,top:0,width:1920,height:1080}}>
    <Rotulo x={125} y={215} size={36} color={SECUNDARIO}>{d.consignataria}</Rotulo>
    <div style={{...fijo,left:bookX,top:bookY,width:930,height:540,transform:`rotate(${asienta(t,q.parrafos.find(p=>p.id==='venta')!.desde+2,.18,5,3)}deg)`,transformOrigin:'50% 90%'}}>
      <Pieza name="libro" w={651*k} h={358.518*k} style={{filter:'drop-shadow(12px 24px 16px #00000070)'}}/>
      <Pieza name="venta" x={34.962*k} y={92.925*k} w={207.432*k} h={32.951*k} opacity={v} style={{filter:`drop-shadow(0 0 ${5*focoVenta}px #c8a45590)`}}/>
      <Pieza name="descuentos" x={365.5*k} y={88.518*k} w={267*k} h={101*k} opacity={g} style={{filter:i<.5?'drop-shadow(0 0 6px #c8a45570)':undefined}}/>
      <Pieza name="ingreso" x={375.5*k} y={251.676*k} w={213.929*k} h={29.542*k} opacity={i} style={{filter:'drop-shadow(0 0 5px #c8a45575)'}}/>
    </div>
    <svg width={1920} height={1080} style={{...fijo,inset:0,opacity:flecha}}>
      <path d="M1070 680 C1165 680 1190 605 1305 605" fill="none" stroke={OCRE} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-tramo(t,cue('ingreso')+.2,.9,'pesado')}/>
      <path d="M1289 594 L1307 605 L1289 617" fill="none" stroke={OCRE} strokeWidth={4} opacity={tramo(t,cue('ingreso')+.8,.3,'natural')}/>
    </svg>
    <Pieza name="estado" x={1330} y={400} w={420} h={239.17} opacity={estado} style={{filter:'drop-shadow(8px 14px 10px #00000060)'}}/>
    <Rotulo x={1260} y={690} width={570} size={39} color={OCRE} opacity={estado} align="center">{t>=obligaciones.desde||i<.5?d.estado:d.ingreso}</Rotulo>
  </div>;
};

const Reclamo=({t,datos:d,tiempos:q}:{t:number;datos:Props['datos'];tiempos:Props['tiempos']})=>{
  const p=q.parrafos.find(p=>p.id==='obligaciones')!,r=q.parrafos.find(p=>p.id==='reclamo')!;
  const a=tramo(t,p.desde+3,.75,'natural'),b=tramo(t,p.desde+5,.75,'natural');
  const papel=tramo(t,r.desde-.5,1,'pesado');
  return <div style={{...fijo,left:3000,top:0,width:1920,height:1080}}>
    <Rotulo x={150} y={250} width={650} size={41} color={OCRE} opacity={a}>{d.ejemplo1}</Rotulo>
    <Rotulo x={150} y={315} width={730} size={39} opacity={b}>{d.ejemplo2}</Rotulo>
    <div style={{...fijo,left:1030,top:240,width:720,height:580,opacity:papel,transform:`translateY(${24*(1-papel)}px) rotate(${mix(-1.8,0,papel)+asienta(t,r.desde+.5,.2,7,3)}deg)`}}>
      <Pieza name="reclamo" w={714} h={556.8} style={{filter:'drop-shadow(12px 20px 14px #00000075)'}}/>
    </div>
    <svg width={1920} height={1080} style={{...fijo,inset:0,opacity:papel}}>
      <path d="M1004 545 C890 545 840 590 750 590" fill="none" stroke={OCRE} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-tramo(t,r.desde+.5,1,'pesado')}/>
      <path d="M769 578 L750 590 L769 602" fill="none" stroke={OCRE} strokeWidth={4} opacity={tramo(t,r.desde+1.25,.3,'natural')}/>
    </svg>
    <Rotulo x={1030} y={840} width={714} size={49} color={OCRE} opacity={tramo(t,r.voz_hasta-2.3,.7,'solemne')} align="center">{d.revision}</Rotulo>
  </div>;
};

export const Muestra:React.FC<Props>=({datos:d,tiempos:q,geografia:geo,mapa,soloIntroduccion=false})=>{
  const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig(),t=frame/fps;
  const p=(id:string)=>q.parrafos.find(p=>p.id===id)!;
  const panLibro=tramo(t,p('venta').desde-.25,2.1,'pesado');
  const panReclamo=tramo(t,p('obligaciones').desde-.2,2.1,'pesado');
  const cameraX=1920*panLibro+1080*panReclamo;
  const titulo=t<p('venta').desde?d.epoca:t<p('obligaciones').desde?d.cuentas:t<p('reclamo').desde?d.obligaciones:d.reclamo;
  const subtitulo=t<geo.camara.inicio_plano?geo.rotulos.general:t<geo.camara.inicio_travelling?geo.rotulos.ciudad:t<p('mercado').desde?d.islas:t<p('venta').desde?d.mercado:'';
  const mezcla=tramo(t,p('venta').desde,1.8,'natural');
  const fade=tramo(t,0,.65,'natural')*(1-tramo(t,durationInFrames/fps-.7,.7,'natural'));
  const enlace=tramo(t,geo.camara.enlace_islas,geo.camara.duracion_enlace,'natural');
  return <AbsoluteFill style={{background:'#20392e'}}>
    <div style={{...fijo,inset:0,opacity:fade}}>
      <Pizarra/>
      <div style={{...fijo,inset:0,clipPath:'inset(44px 40px 102px 40px)'}}>
      <div style={{...fijo,left:0,top:0,width:4920,height:1080,transform:`translateX(${-cameraX}px)`}}>
        {t<p('venta').desde+2.2?<div style={{...fijo,inset:0,opacity:enlace}}><Comercio t={t} datos={d} tiempos={q}/></div>:null}
        {t>p('venta').desde-.8?<Cuentas t={t} datos={d} tiempos={q}/>:null}
        {t>p('obligaciones').desde-.8?<Reclamo t={t} datos={d} tiempos={q}/>:null}
      </div>
      {enlace<1?<div style={{...fijo,inset:0,opacity:1-enlace}}><GeografiaIntro t={t} geografia={geo} mapa={mapa} datos={d} tiempos={q}/></div>:null}
      </div>
      <Luz color={OCRE} x={t<p('venta').desde?43:t<p('obligaciones').desde?53:74} y={52} radio={47} intensidad={.07}/>
      <Atmosfera grano={0} vineta={.25}/>
      <Rotulo x={112} y={83} width={1696} size={69} style={{fontFamily:fuente.titulo,fontWeight:650}}>{titulo}</Rotulo>
      <Rotulo x={114} y={175} width={1630} size={34} color={SECUNDARIO}>{subtitulo}</Rotulo>
      <div style={{...fijo,left:114,top:995,width:1692,height:2,background:'#a7a78570'}}/>
      <Rotulo x={114} y={1010} width={1692} size={21} color={SECUNDARIO}>{d.fuente}</Rotulo>
      <Rotulo x={1060} y={38} width={744} size={23} align="right" color={SECUNDARIO}>{d.aviso}</Rotulo>
    </div>
    {q.parrafos.filter(p=>!soloIntroduccion||geo.solo_voz.includes(p.id)).map(p=><Sequence key={p.id} name={'voz '+p.id} from={Math.round(p.desde*fps)} durationInFrames={Math.ceil(p.duracion_voz*fps)} layout="none"><Audio src={staticFile(p.archivo)}/></Sequence>)}
    <Audio src={ambiente('mar')} volume={()=>.18*tramo(t,0,1.2,'natural')*(1-mezcla)*fade} loop/>
    <Audio src={ambiente('cuarto')} volume={()=>.12*mezcla*(1-tramo(t,q.duracion-1,1,'natural'))} loop/>
    <Sfx nombre="hoja" en={p('venta').desde+1.8} fps={fps} dura={1.1} volumen={.22}/>
    <Sfx nombre="pluma" en={p('cuentas').desde+2.7} fps={fps} dura={1} volumen={.14}/>
    <Sfx nombre="hoja" en={p('reclamo').desde+.4} fps={fps} dura={1} volumen={.20}/>
    <PrecargaTexturas/>
  </AbsoluteFill>;
};
