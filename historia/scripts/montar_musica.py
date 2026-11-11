"""Monta la música de una escena desde pistas de Suno (capas o una pista corrida) sobre el reloj de la escena.

Uso: python scripts/montar_musica.py 001-el-hombre s04   (lee videos/<video>/montaje_musica/<escena>.json)
Necesita numpy y ffmpeg. Las rutas de `archivo` son relativas a public/videos/<video>/musica/.

Monta capas sobre el reloj de la escena: cada capa empieza en `inicio` (s de escena) y su volumen
sigue una envolvente de tramos (s de escena, ganancia) con rampas lineales. Salida con 0,4 s de corte J."""
import json, subprocess, sys, numpy as np
SR=44100; J=0.4
from pathlib import Path
RAIZ=Path(__file__).resolve().parent.parent
video, escena = sys.argv[1], sys.argv[2]
MUS=RAIZ/'public'/'videos'/video/'musica'
cfg=json.load(open(RAIZ/'videos'/video/'montaje_musica'/f'{escena}.json',encoding='utf-8')); out=str(MUS/cfg['salida'])
# --- anclas: los tiempos se resuelven contra los beats y la voz de ahora (si la voz cambia, se vuelve a correr)
import math
ESC={e['id']:e for e in json.load(open(RAIZ/'videos'/video/'escenas.json',encoding='utf-8'))['escenas']}
def dur_voz(s):
    return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(RAIZ/'public'/'videos'/video/'voz'/f'{s}.mp3')],capture_output=True,text=True).stdout)
def fin_escena(s): return dur_voz(s)+ESC[s].get('cola_s',0.8)
BEATS=ESC[escena]['beats']
def empalme(s, fps=30):
    """Corte J/L entre s y la siguiente: dónde arranca la música de s (desde_beat) y en qué segundo de s empieza la ventana de la siguiente."""
    e=ESC[s]; b=e['beats'][e['audio']['musica']['desde_beat']]
    t0=(round(12+b*fps-15)-12)/fps; S=(math.ceil(fin_escena(s)*fps)-12)/fps
    return b,t0,S
if cfg.get('empalme')=='siguiente':          # la pista sigue en la escena siguiente: aquí, hasta el corte
    b,t0,S=empalme(escena); cfg['t0']=t0; cfg['dur']=S+0.4
    for c in cfg['capas']: c['inicio']=b; c['env']=[[b,1],[S,1],[S+0.4,0]]
if 'viene_de' in cfg:                         # la pista viene de la escena anterior: entra a la mitad, en el corte
    b,t0,S=empalme(cfg['viene_de'])
    for c in cfg['capas']: c['inicio']=-0.4-(S-b)
if cfg.get('dur')=='escena': cfg['dur']=fin_escena(escena)+0.5
for c in cfg['capas']:
    if 'ancla' in c:                          # [beat, segundo del archivo que cae en ese beat]
        c['inicio']=BEATS[c['ancla'][0]]-c['ancla'][1]
    c['env']=[[BEATS[p[0]]+p[1],p[2]] if isinstance(p[0],str) else p for p in c.get('env',[[-1e9,1]])]
dur=cfg['dur']
T0=cfg.get('t0',-J)   # segundo de la escena en que empieza el archivo (por defecto, el corte J: 0,4 s antes)
total=int((dur-T0)*SR); mix=np.zeros((total,2),np.float32)
def lufs(f):
    r=subprocess.run(['ffmpeg','-nostats','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    return float([l for l in r.splitlines() if l.strip().startswith('I:')][-1].split()[1])
for c in cfg['capas']:
    x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(MUS/c['archivo']),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32).reshape(-1,2)
    ref=cfg.get('lufs_ref',-18)   # null: las capas suenan como vinieron (los stems de una misma mezcla)
    g=10**(((ref-lufs(str(MUS/c['archivo']))) if ref is not None else 0)/20+c.get('db',0)/20)
    t=np.arange(len(x))/SR+c['inicio']           # tiempo de escena de cada muestra
    pts=np.array(c['env'],float)                    # [[t, ganancia], ...]
    env=np.interp(t,pts[:,0],pts[:,1],left=pts[0,1],right=pts[-1,1])
    a=int((c['inicio']-T0)*SR)
    if a<0: x=x[-a:]; env=env[-a:]; a=0   # la pista empezó antes que el archivo: se entra a la mitad
    b=min(total,a+len(x)); y=x[:b-a]*(g*env[:b-a])[:,None]
    mix[a:b]+=y
fin=total; mix[max(0,fin-int(0.3*SR)):fin]*=np.linspace(1,0,fin-max(0,fin-int(0.3*SR)))[:,None]
pk=np.abs(mix).max(); print('pico %.2f dBFS'%(20*np.log10(pk)))
if pk>0.89: mix*=0.89/pk
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','libmp3lame','-b:a','160k',out],input=mix.tobytes(),check=True)
