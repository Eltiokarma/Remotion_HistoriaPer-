"""Cierre ilustrado del episodio 002 y puente al método."""
import json

from piezas import HERE, LONG, OPENING, PROJECT, CREAM, INK, arrow, asset, gradient, group, label, path, rect, svg
from detallar_islas import W, H, Panel, Sequence, claim_leaf, folder_cover, grain, islands_frame, paper_light, sack, sheet, vignette
from detallar_novoa import shading, wood
from detallar_reclamo import put, ruled_leaf, vale
from detallar_expediente import DEFS as EPISODE_DEFS

OUT=HERE/'revision-metodo'
REPORTS=HERE/'revision-investigacion'
NOVOA=HERE/'revision-novoa/escena-completa'
APPROVED=PROJECT/'videos/001-el-hombre/diseno/recursos-aprobados'
DEFS=EPISODE_DEFS+(
    gradient('pizarra-metodo','#516d57','#182f2a',True)
    +gradient('mesa-metodo','#8c704f','#2e3933',True)
    +gradient('margen-apendice','#e2cfaa','#f2e5c5')
)
PARTS={}
CENTERS=(140,390,640,890,1140)
NAMES=('Guano','Estado','Reclamos','Vales','Investigación')


def add(name,art,w,h,use):
    PARTS[name]=(art,w,h,use)


def item(name,x,y,scale=1,angle=0):
    return put(PARTS[name][0],x,y,scale,angle)


def card(title,lines,width=510,height=190):
    art=ruled_leaf(width,height)+label(title,30,52,30,INK,bold=True)
    art+=path(f'M31 66 H{width-30}',stroke='#a58b63',line=1.2)
    for i,line in enumerate(lines):
        art+=label(line,31,109+i*38,24,INK)
    return art


def purpose(beat):
    if beat==0:
        return asset(REPORTS/'enlace-escena-05.svg',0,0,W,H)
    if beat==1:
        return islands_frame()
    art=wood()+paper_light(624,354,568,381,.59)
    art+=item('finalidad-del-credito',317,98,1)
    if beat==2:
        art+=put(claim_leaf(),200,326,.50,-5)
        art+=arrow(557,448,695,448)
        art+=put(vale(),728,347,.65,2)
    else:
        art+=item('quienes-quedaron-fuera',75,328,1.0,-2)
        art+=item('beneficios-concentrados',679,343,1,2)
    return art+vignette(.65)


def board():
    art=rect(0,0,W,H,'url(#pizarra-metodo)')
    art+=grain(131,(0,0,W,H),520,('#9da587','#1c3128','#738369'),.17)
    for i in range(20):
        y=95+i*29
        x=14+(i*43)%147
        art+=group(path(f'M{x} {y} Q{W*.48:.0f} {y-11} {W-22} {y+3}',
                        stroke='#bdc3a0',line=2.3),opacity=.022+(i%4)*.012)
    return art


def node_art(index):
    if index==0:
        art=put(sack(False),47,4,.66,-5)
        art+=path('M50 171 Q105 185 164 174',stroke='#bd9d6b',line=2)
    elif index==1:
        art=asset(OPENING/'estado.svg',9,29,203,127)
    elif index==2:
        art=put(claim_leaf(),27,2,.264,-3)
    elif index==3:
        art=put(vale(),15,38,.327,2)
    else:
        art=put(folder_cover(),21,13,.27,-5)
        art+=put(PARTS['informes-archivo'][0],57,65,.229,1)
    art+=label(NAMES[index],110,226,26,CREAM,'middle',bold=True)
    return art


def circuit(beat,live=False):
    art=board()
    count=(3,4,5)[beat]
    tiles=''
    for i,x in enumerate(CENTERS[:5 if live else count]):
        if i:
            link=arrow(CENTERS[i-1]+101,364,x-101,364)
            tiles+=group(link,data_fx=f'link-{i}',opacity=0 if live else .83)
        node=put(node_art(i),x-110,252)
        tiles+=group(node,data_fx=f'node-{i}',opacity=.25 if live else 1)
    tiles+=group(paper_light(632,358,387,210,.19),data_fx='focus',opacity=0 if live else .7)
    art+=group(tiles,data_fx='camera')
    art+=label('De los recursos públicos a los informes',640,107,42,CREAM,'middle')
    if beat==2:
        art+=path('M256 574 H1024',stroke='#8b9a7b',line=1.2)
    return art+vignette(.56)


def desk():
    art=wood().replace('url(#nogal)','url(#mesa-metodo)')
    art+=path('M33 21 H1202 L1180 623 Q580 648 45 632 Z','#414a3c','#8b8964',2.2)
    art+=path('M47 33 H1187 L1166 610 Q584 632 58 619 Z',stroke='#9d9a72',line=1.25)
    art+=grain(92,(52,40,1122,579),270,('#b8ad7e','#323c31','#626c51'),.18)
    art+=paper_light(708,337,652,405,.64)
    art+=path('M124 114 L532 82 L1110 540 L723 633 Z','#dec28725')
    return art


def approved(name,x,y,width,box,groups):
    _,_,bw,bh=map(float,box.split())
    return asset(APPROVED/f'{name}.svg',x,y,width,width*bh/bw,box=box,named=set(groups))


def writer(beat):
    if beat==0:
        art=asset(REPORTS/'enlace-escena-05.svg',0,0,W,H)
        art+=label('Muchos años después',638,630,39,CREAM,'middle',bold=True)
        return art
    art=PARTS['mesa-del-historiador'][0]
    if beat==1:
        art+=item('fichero-de-referencia',37,127,.84,0)
        art+=item('libro-de-quiroz',471,103,.90,-5)
        art+=item('pruebas-de-imprenta',799,157,.87,6)
    else:
        for name,x,angle in (('contabilidad-estatal',73,-4),('documentos-judiciales',455,1),('correspondencia-diplomatica',832,4)):
            art+=item(name,x,214,1,angle)
        art+=label('Algunas fuentes que Quiroz cotejó',640,130,37,CREAM,'middle')
    return art+vignette(.60)


def source_card(title,kind,lines):
    art=ruled_leaf(350,283)
    art+=rect(24,-3,58,26,('#897a54','#946151','#688274')[kind],'#9d8960',1.2)
    if kind==2:
        art+=label('Correspondencia',25,57,24,INK,bold=True)
        art+=label('diplomática',25,86,24,INK,bold=True)
        rule_y=102
    else:
        art+=label(title,25,63,24,INK,bold=True)
        rule_y=78
    art+=path(f'M25 {rule_y} H326',stroke='#9e8965',line=1.4)
    for i,line in enumerate(lines):
        y=137+i*42
        art+=label(line,27,y,21,INK)
        art+=path(f'M27 {y+12} H320',stroke='#a79472',line=1.1)
    art+=label('Ejemplo de fuente',27,252,16,'#66654f',font='Arial')
    return art


def appendix(beat):
    left='M60 66 Q298 30 520 73 L519 452 Q303 405 57 452 Z'
    right='M520 73 Q751 28 974 62 L990 446 Q751 407 519 452 Z'
    cover='M40 76 Q269 41 520 78 Q747 40 991 68 L1008 468 Q754 435 520 485 Q277 440 36 475 Z'
    art=shading(cover,10,12)+path(cover,'#553e32','#94724f',2.1)
    for dy in (17,12,7):
        art+=group(path(left,'#d5bc96','#ac956c',1.3)+path(right,'#d1b992','#a9946f',1.3),transform=f'translate(0 {dy})')
    art+=path(left,'url(#margen-apendice)','#c0a883',2)+path(right,'url(#papel-hoja)','#b89f77',2)
    art+=path('M519 75 L519 452 M70 85 Q296 51 505 86 M534 87 Q745 49 961 75',
              stroke='#a18c6a',line=1.6)
    art+=label('Apéndice',112,151,43,INK,bold=True)
    art+=label('Una estimación histórica',113,203,28,INK)
    art+=label('Distintos periodos y fuentes',114,246,22,INK)
    for y in (282,308,334,360):
        art+=path(f'M115 {y} Q288 {y-10} 471 {y+7}',stroke='#aa9672',line=1)
    art+=label('Esquema editorial · Quiroz, pp. 535–536',111,415,16,INK,font='Arial')
    if beat:
        for i,line in enumerate(('Aproximado','Provisional','Sujeto a revisión')):
            y=150+i*90
            art+=label(line,574,y,41,INK,bold=True)
            art+=path(f'M576 {y+16} Q743 {y+7} 902 {y+15}',stroke='#a77e59',line=1.7)
    else:
        art+=label('Del expediente',568,153,33,INK,bold=True)
        art+=label('a una cuenta más amplia',569,204,29,INK)
        for y in (266,293,321,349,376):
            art+=path(f'M569 {y} Q758 {y-11} 932 {y-4}',stroke='#aa9672',line=1)
    return art


def limits(beat):
    if beat==0:
        return asset(NOVOA/'comparacion-vales.svg',0,0,W,H)
    art=PARTS['mesa-del-historiador'][0]
    art+=item('apendice-cautelas' if beat==2 else 'apendice-alcance',131,104,1,-1)
    return art+vignette(.56)


def question():
    art=label('Siguiente episodio',640,199,27,'#d0ba85','middle',bold=True)
    art+=label('¿Se puede medir',640,321,78,CREAM,'middle',bold=True)
    art+=label('la corrupción?',640,414,87,CREAM,'middle',bold=True)
    art+=path('M426 468 Q646 456 855 467',stroke='#b4ab7a',line=2.3)
    return art


def series():
    art=label('La serie',115,128,49,CREAM,bold=True)
    titles=('El hombre que le sacó la cuenta al Perú','La deuda defraudada','¿Se puede medir la corrupción?','La cuenta')
    for i,title in enumerate(titles):
        y=198+i*102
        if i==2:
            art+=rect(98,y-45,1084,77,'#82734c','#d4b77a',1.7,2)
        art+=label(f'{i+1:03}',125,y,28,'#d8bd81','start',font='Arial',bold=True)
        art+=label(title,242,y,37,CREAM if i==2 else '#c6c7af',bold=i==2)
        if i!=2:
            art+=path(f'M113 {y+34} H1168',stroke='#647763',line=1)
    return art


def closing(beat):
    if beat==0:
        art=PARTS['mesa-del-historiador'][0]
        art+=item('contabilidad-estatal',104,194,.77,-6)
        art+=item('documentos-judiciales',488,348,.73,-2)
        art+=item('correspondencia-diplomatica',925,169,.75,6)
        art+=path('M344 308 Q456 278 533 359 M738 402 Q837 356 933 297',stroke='#d4b580',line=2.3)
        art+=label('¿Qué huellas quedaron?',640,136,39,CREAM,'middle')
    else:
        art=board()+PARTS['pregunta-003' if beat==1 else 'indice-serie'][0]
    return art+vignette(.62)


def build_parts():
    add('finalidad-del-credito',card('Recuperar la confianza',('Reconocer deudas para restablecer el crédito público.',),652,146),
        676,170,'Sostener al volver al propósito del reconocimiento.')
    add('quienes-quedaron-fuera',card('Muchos quedaron fuera',('Reclamantes originales','Pequeños inversionistas')),534,214,
        'Revelar juntos los dos grupos.')
    benefits=card('Los beneficios se concentraron',('Resultado descrito por Quiroz',),550)
    benefits+=put(vale(),306,136,.30,1)
    add('beneficios-concentrados',benefits,574,264,'Contraponer con los grupos excluidos, sin recuentos.')
    add('informes-archivo',ruled_leaf(517,257)+label('Informes',29,63,48,INK,bold=True)
        +label('de la junta',30,112,38,INK)+path('M31 149 H471 M31 181 H451 M31 213 H464',stroke='#9f8861',line=2),
        541,281,'Miniatura de los informes al reunir el circuito.')
    for i,name in enumerate(NAMES,1):
        add(f'circuito-{i}',node_art(i-1),220,245,f'{name}. Sostener el objeto al recorrer el tablero.')
    add('mesa-del-historiador',desk(),W,H,'Fondo editorial de otra época, con luz de escritorio.')
    add('fichero-de-referencia',approved('tanda04-fichero',2,2,432,'363 212 1215 755',
        ('Caja_de_madera___volumen','Ficha_FUENTES','Ficha_FECHAS','Ficha_CIFRAS','Ficha_CONTRASTE',
         'Cajón_frontal','Porte-étiquette_en_laiton','Poignée')),
        448,286,'Fichero aprobado del episodio 001, sin fondo de presentación.')
    add('libro-de-quiroz',approved('tanda03-libro',3,3,332,'630 118 648 837',
        ('Bloque_de_páginas','Encuadernación___lomo','Cubierta___tela_y_filetes','Autor__título_y_año')),
        346,446,'Portada editorial aprobada del episodio 001.')
    add('pruebas-de-imprenta',approved('tanda03-pruebas',3,3,420,'521 123 933 838',
        ('Hojas___separadas','Texto_editorial_de_muestra','Correcciones_rojas___trazos_independientes','Lápiz_de_corrector')),
        437,395,'Maqueta ilustrativa aprobada. Conservar su identificación.')
    sources=(
        ('contabilidad-estatal','Contabilidad del Estado',('Ingresos y gastos','Fecha y organismo','Registro de cuentas')),
        ('documentos-judiciales','Documentos judiciales',('Expediente y actuaciones','Personas mencionadas','Decisiones registradas')),
        ('correspondencia-diplomatica','Correspondencia diplomática',('Remitente y destinatario','Lugar y fecha','Contexto de la comunicación')),
    )
    for i,(name,title,lines) in enumerate(sources):
        add(name,source_card(title,i,lines),375,309,'Identificar procedencia y contexto al nombrar esta familia de fuentes.')
    add('apendice-alcance',appendix(0),1035,512,'Abrir hacia la estimación histórica.')
    add('apendice-cautelas',appendix(1),1035,512,'Pausa con las tres cautelas visibles.')
    add('pregunta-003',question(),W,H,'Revelar la pregunta completa y sostenerla.')
    add('indice-serie',series(),W,H,'Dar luz a 003 y sostener el índice.')


def sequences():
    return (
        Sequence('5A.1','La finalidad y sus beneficiarios',(
            Panel('Los informes de la junta',purpose(0),('Retomar el encuadre exacto que cierra 4E.3.','Pausa antes de regresar al inicio del circuito.')),
            Panel('Volver a las islas',purpose(1),('Fundir desde el papel hacia el perfil de Chincha.','Oleaje y aves en segundo plano.')),
            Panel('La finalidad del crédito público',purpose(2),('Conservar reclamo y vale en la misma mesa.','Iluminar primero el propósito y luego el vínculo.')),
            Panel('Quiénes quedaron fuera',purpose(3),('Mantener el propósito y revelar los dos lados.','Sostener la lectura cualitativa.')),
        ),'Volver al propósito antes de mostrar el resultado.','Reunir el circuito en una sola vista.'),
        Sequence('5A.2','El recorrido completo',(
            Panel('Guano, Estado y reclamos',circuit(0),('Entrar por los recursos y panear hacia el Estado.','Encender cada relación al nombrarla.')),
            Panel('Se incorporan los vales',circuit(1),('Seguir el movimiento hacia el título conocido.','Asentar el vale con un roce leve.')),
            Panel('Llegamos a la investigación',circuit(2),('Abrir el encuadre para ver el circuito completo.','Pausa sin voz. Sostener los informes como enlace.')),
        ),'Reunir relaciones ya explicadas.','Volver a los informes y cambiar de época.'),
        Sequence('5B.1','Muchos años después',(
            Panel('El cambio de época',writer(0),('Volver a los informes de la junta.','Leer «Muchos años después» antes de cambiar de mesa.')),
            Panel('La mesa del historiador',writer(1),('Abrir sobre el libro, el fichero y las pruebas.','Fundido de luz cálida. Asentar las pruebas.')),
            Panel('Tres familias de fuentes',writer(2),('Abrir las tres fichas por turno, de izquierda a derecha.','Luz de lectura y un roce en cada llegada.')),
        ),'Pasar del relato del caso a las fuentes de la reconstrucción.','Recuperar la distinción entre aprobado y probable.'),
        Sequence('5B.2','Alcance y cautelas',(
            Panel('Lo aprobado y lo probablemente recibido',limits(0),('Retomar la comparación exacta de Novoa.','Sostener «probablemente» y la unidad.')),
            Panel('Abrir hacia el apéndice',limits(1),('Pasar la página para cambiar el alcance.','Sombra en el lomo y ruido breve de papel.')),
            Panel('Una estimación revisable',limits(2),('Acercarse a la página derecha y detenerse.','Sostener las tres cautelas juntas.')),
        ),'De la cautela en un caso a una estimación histórica.','Plantear cómo medir prácticas ocultas.'),
        Sequence('5C','La pregunta del siguiente episodio',(
            Panel('Huellas que se pueden contrastar',closing(0),('Relacionar las fuentes sin cerrar un registro completo.','Trazos finos y cámara quieta.')),
            Panel('¿Se puede medir la corrupción?',closing(1),('Fundir la mesa hacia la pizarra.','Dejar entrar la pregunta completa y sostenerla.')),
            Panel('El índice enfoca el episodio 003',closing(2),('Abrir al índice y dejar quieta la cámara.','Entrar el tema del canal al terminar la frase.')),
        ),'Del caso de deuda al método de medición.','Episodio 003 · fuentes, decisiones y límites.'),
    )


def save():
    build_parts()
    layers=OUT/'capas'
    layers.mkdir(parents=True,exist_ok=True)
    for name,(art,w,h,use) in PARTS.items():
        (layers/f'{name}.svg').write_text(svg(group(art,id=name),w,h,DEFS),encoding='utf-8')
    seq=sequences()
    old=json.loads((LONG/'escena-05/secuencia.json').read_text(encoding='utf-8'))
    assert [b.code for b in seq]==[b['id'] for b in old['desarrollo']]
    sources=['contabilidad-estatal','documentos-judiciales','correspondencia-diplomatica']
    used={
        '5A.1':['finalidad-del-credito','quienes-quedaron-fuera','beneficios-concentrados'],
        '5A.2':['informes-archivo',*[f'circuito-{i}' for i in range(1,6)]],
        '5B.1':['mesa-del-historiador','fichero-de-referencia','libro-de-quiroz','pruebas-de-imprenta',*sources],
        '5B.2':['mesa-del-historiador','apendice-alcance','apendice-cautelas'],
        '5C':['mesa-del-historiador',*sources,'pregunta-003','indice-serie'],
    }
    reports_ref='../revision-investigacion/enlace-escena-05.svg'
    vale_ref='../revision-reclamo/capas/vale-deuda-interna.svg'
    claim_ref='../revision-islas/capas/folio-reclamo.svg'
    shared={
        '5A.1':[reports_ref,vale_ref,claim_ref],
        '5A.2':[vale_ref,claim_ref,'../revision-islas/capas/saco-cerrado.svg',
                '../revision-islas/capas/tapa-carpeta.svg'],
        '5B.1':[reports_ref],
        '5B.2':['../revision-novoa/escena-completa/comparacion-vales.svg'],
        '5C':[],
    }
    assert {name for names in used.values() for name in names}==PARTS.keys()
    timeline=[]
    for i,block in enumerate(seq,1):
        name=f'lamina-{i:02}.svg'
        (OUT/name).write_text(sheet(block,i,heading='Del expediente al método',definitions=DEFS),encoding='utf-8')
        assert all((OUT/ref).is_file() for ref in shared[block.code]),block.code
        timeline.append({'id':block.code,'lamina':name,'cambio':block.change,'enlace':block.link,
                         'piezas':used[block.code],'recursos_reutilizados':shared[block.code],
                         'encuadres':[{'plano':p.title,'camara_y_accion':p.direction[0],'efecto_y_pausa':p.direction[1]}
                                      for p in block.panels]})
    for name,i,j in (('entrada-informes',0,0),('circuito-completo',1,2),('mesa-quiroz',2,1),
                     ('cautelas-del-apendice',3,2),('pregunta-episodio-003',4,1),('indice-final',4,2)):
        (OUT/f'{name}.svg').write_text(svg(seq[i].panels[j].image,W,H,DEFS),encoding='utf-8')
    inventory=[{'id':n,'archivo':f'capas/{n}.svg','lienzo':[w,h],'uso':use}
               for n,(_,w,h,use) in PARTS.items()]
    (OUT/'secuencia.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'piezas.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    template=(HERE/'prueba-circuito-metodo.html').read_text(encoding='utf-8')
    preview=template.replace('{{ARTE}}',svg(circuit(2,live=True),W,H,DEFS))
    (OUT/'prueba-circuito.html').write_text(preview,encoding='utf-8')
    print(f'{len(seq)} laminas, {sum(len(b.panels) for b in seq)} encuadres, {len(PARTS)} piezas.')


if __name__=='__main__':
    save()
