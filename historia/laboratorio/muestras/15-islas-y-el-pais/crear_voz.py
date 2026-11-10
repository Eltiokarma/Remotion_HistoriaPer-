"""Voz de prueba. Requiere edge-tts y el ffmpeg incluido en Remotion. No usa una API de pago."""
import asyncio
import json
import shutil
import subprocess
from pathlib import Path
import edge_tts

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parents[2]
FF = Path(shutil.which('ffmpeg') or PROJECT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe')
PROBE = Path(shutil.which('ffprobe') or FF.with_name('ffprobe.exe'))
OUT = HERE / 'public/prueba-002'

def seconds(file):
    return float(subprocess.check_output([str(PROBE), '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(file)]))

async def main():
    config = json.loads((HERE / 'narracion.json').read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    clock = 1.0
    data = []
    for p in config['parrafos']:
        raw = OUT / (p['id'] + '-original.mp3')
        target = OUT / (p['id'] + '.mp3')
        boundaries = []
        if not target.exists():
            speech = edge_tts.Communicate(p['texto'], config['voz'], rate=config['ritmo'], boundary='WordBoundary')
            with raw.open('wb') as stream:
                async for chunk in speech.stream():
                    if chunk['type'] == 'audio':
                        stream.write(chunk['data'])
                    elif chunk['type'] == 'WordBoundary':
                        boundaries.append({'segundo': round(chunk['offset']/10_000_000, 3), 'texto': chunk['text']})
            subprocess.run([str(FF), '-v', 'error', '-y', '-i', str(raw), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '96k', str(target)], check=True)
            raw.unlink()
            (OUT / (p['id']+'-palabras.json')).write_text(json.dumps(boundaries, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
        else:
            boundaries = json.loads((OUT / (p['id']+'-palabras.json')).read_text(encoding='utf-8'))
        duration = seconds(target)
        data.append({**p, 'desde': round(clock, 3), 'voz_hasta': round(clock+duration, 3), 'duracion_voz': duration, 'archivo': 'prueba-002/'+target.name, 'palabras': boundaries})
        clock += duration+p['pausa']
        print(p['id'], round(duration, 2), 's', flush=True)
    result = {'fps': 15, 'duracion': round(clock, 3), 'voz': config['voz'], 'revision_entrada': 2, 'parrafos': data}
    (HERE/'tiempos.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print('TOTAL:', round(clock, 2), 's', flush=True)

if __name__ == '__main__':
    asyncio.run(main())
