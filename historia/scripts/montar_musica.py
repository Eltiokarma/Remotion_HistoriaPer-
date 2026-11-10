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
cfg=json.load(open(RAIZ/'videos'/video/'montaje_musica'/f'{escena}.json',encoding='utf-8')); out=str(MUS/cfg['salida']); dur=cfg['dur']
total=int((dur+J)*SR); mix=np.zeros((total,2),np.float32)
def lufs(f):
    r=subprocess.run(['ffmpeg','-nostats','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    return float([l for l in r.splitlines() if l.strip().startswith('I:')][-1].split()[1])
for c in cfg['capas']:
    x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(MUS/c['archivo']),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32).reshape(-1,2)
    g=10**((cfg.get('lufs_ref',-18)-lufs(str(MUS/c['archivo']))+c.get('db',0))/20)
    t=np.arange(len(x))/SR+c['inicio']           # tiempo de escena de cada muestra
    pts=np.array(c['env'],float)                    # [[t, ganancia], ...]
    env=np.interp(t,pts[:,0],pts[:,1],left=pts[0,1],right=pts[-1,1])
    a=int((c['inicio']+J)*SR); b=min(total,a+len(x)); y=x[:b-a]*(g*env[:b-a])[:,None]
    mix[a:b]+=y
fin=int((dur+J)*SR); mix[max(0,fin-int(0.3*SR)):fin]*=np.linspace(1,0,fin-max(0,fin-int(0.3*SR)))[:,None]
pk=np.abs(mix).max(); print('pico %.2f dBFS'%(20*np.log10(pk)))
if pk>0.89: mix*=0.89/pk
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','libmp3lame','-b:a','160k',out],input=mix.tobytes(),check=True)
