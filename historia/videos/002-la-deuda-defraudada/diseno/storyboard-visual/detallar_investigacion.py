"""Láminas y piezas de la escena larga 4."""
import json
from math import cos, radians, sin

from piezas import HERE, LONG, OPENING, PEOPLE, CREAM, INK, GOLD, arrow, asset, circle, group, label, path, rect, svg
from detallar_islas import W, H, Panel, Sequence, clipped, paper_light, sheet, vignette
from detallar_novoa import ink_and_quill, wood
from detallar_reclamo import put, ruled_leaf, vale
from detallar_traspaso import hands, overhead_desk
from detallar_expediente import DEFS as NOVOA_DEFS, ELIAS_POSES, body, shelves

OUT=HERE/'revision-investigacion'
ENTRANCE=HERE/'revision-novoa/escena-completa'
DEFS=NOVOA_DEFS
PARTS={}


def register(name,art,w,h,use):
    PARTS[name]=(art,w,h,use)


def item(name,x,y,scale=1,angle=0):
    return put(PARTS[name][0],x,y,scale,angle)


def desk(x=640,y=342):
    return wood()+ink_and_quill()+paper_light(x,y,547,344,.58)


def tag(text,x,y,w=460):
    return put(ruled_leaf(w,68)+label(text,25,44,25,INK,bold=True),x,y)


def stat(title,value,unit,foot='',width=493):
    art=ruled_leaf(width,217)
    art+=label(title,27,46,25,INK,bold=True)
    art+=path(f'M28 60 H{width-28}',stroke='#a2875d',line=1.3)
    art+=label(value,26,130,54,INK,bold=True)
    art+=label(unit,29,166,23,INK)
    if foot:
        art+=label(foot,29,192,15,'#62634c',font='Arial')
    return art


def totals(beat):
    if beat==0:
        return asset(ENTRANCE/'enlace-4a-1851.svg',0,0,W,H)
    art=shelves()
    if beat==1:
        art+=asset(ENTRANCE/'capas/total-1851.svg',56,308,558,244)
        art+=item('total-1852',686,316,1.03,1)
        art+=label('Serie de deuda reconocida según Quiroz',640,627,25,CREAM,'middle')
    else:
        art+=put(vale(),352,263,1.01,-3)
        art+=paper_light(626,437,355,230,.20)
    return art+vignette(.65)


def arm_art(side,pose):
    role='reclamante' if side=='left' else 'comerciante'
    base,thumb=hands(role,pose)
    # Las poses conservan la articulación y la escala de la escena 2.
    tint=(('url(#manga-vino)','url(#tela-ley)'),('#4c3540','#2d3f32'),('#aa8791','#a2a685'))
    for before,after in tint:
        base=base.replace(before,after)
    return base,thumb


def arm_layer(side,pose,x,y,key):
    base,thumb=arm_art(side,pose)
    sx=-.91 if side=='right' else .91
    tilt=7 if side=='right' else -8
    transform=f'translate({x:.2f} {y:.2f}) rotate({tilt}) scale({sx} .91)'
    return (group(base,transform=transform,data_part=f'{key}-base'),
            group(thumb,transform=transform,data_part=f'{key}-thumb'))


def transfer(beat,live=False):
    x=(214,357,381,555)[beat]
    y,scale=205,.85
    angle=(-5,-3,0,2)[beat]
    rad=radians(angle)

    def contact(column):
        return (x+scale*(column*cos(rad)-196*sin(rad)),
                y+scale*(column*sin(rad)+196*cos(rad)))

    left_base,left_thumb=arm_layer('left','grip',*contact(5),'left')
    right_base,right_thumb=arm_layer('right','grip',*contact(568),'right')
    opened,_=arm_layer('right','open',960,382,'open')
    art=overhead_desk()+group(paper_light(x+235,355,505,285,.48),data_part='focus')
    art+=left_base if beat<3 else ''
    if beat==1 or live:
        art+=group(opened,data_part='receiver-open',visibility='hidden' if live else 'visible')
    if beat>=2 or live:
        art+=group(right_base,data_part='receiver-back',visibility='hidden' if live else 'visible')
    art+=group(put(vale(),x,y,scale,angle),data_part='vale')
    art+=left_thumb if beat<3 else ''
    if beat>=2 or live:
        art+=group(right_thumb,data_part='receiver-thumb',visibility='hidden' if live else 'visible')
    art+=label('Tenedor anterior',71,135,24,CREAM)
    art+=label('Nuevo tenedor',1206,135,24,CREAM,'end')
    return art+vignette(.61)


def bond():
    art=ruled_leaf(571,337)
    art+=rect(23,24,526,286,'none','#747f7a',2)
    art+=rect(32,34,507,267,'none','#9a9277',1)
    for x in (51,519):
        for y in (53,280):
            art+=path(f'M{x-13} {y} q13 -19 26 0 q-13 19 -26 0 Z',stroke='#7a8578',line=1.2)
            art+=circle(x,y,3,'#9e9c80')
    art+=label('Estado peruano',285,71,21,INK,'middle')
    art+=label('Bono de deuda externa',285,141,39,INK,'middle',bold=True)
    art+=path('M79 158 H492 M109 247 H463',stroke='#849089',line=1.6)
    art+=label('Obligación del Estado',285,212,27,INK,'middle')
    art+=label('Modelo editorial',285,281,16,'#686952','middle',font='Arial')
    return art


def conversion(beat):
    art=desk(688,350)+put(vale(),72,222,.78,-2)
    if beat>=1:
        art+=arrow(528,348,723,348)
        art+=label('Canje parcial',622,311,23,CREAM,'middle')
    if beat==2:
        art+=item('bono-externo',745,219,.81,1)
    return art+vignette(.6)


def letter(day):
    art=ruled_leaf(448,297)
    art+=label('El Comercio',222,68,45,'#493e2e','middle',bold=True)
    art+=path('M28 84 H420 M28 90 H420',stroke='#78634a',line=1.1)
    art+=label(f'{day} de agosto de 1853',222,126,28,INK,'middle',bold=True)
    art+=label('Carta de Elías a Echenique',222,174,24,INK,'middle')
    for x in (34,233):
        for i in range(4):
            art+=path(f'M{x} {193+i*11} h{176-(i%3)*9}',stroke='#a08e6d',line=1.15)
    art+=label('Resumen editorial',34,274,16,'#636650',font='Arial')
    return art


def denunciation(beat):
    if beat==0:
        art=shelves()
        figure=body(PEOPLE/ELIAS_POSES[0],781,118,386)
        art+=clipped(figure,(0,0,W,495),'elias-denuncia-archivo')
        art+=item('doble-funcion-elias',119,253,1.06,-3)
    else:
        art=desk(420 if beat==1 else 854,336)
        art+=item('carta-12-agosto',123,174,1.07,-4)
        if beat==2:
            art+=item('carta-16-agosto',672,155,1.07,3)
            art+=label('Intermediario y denunciante',640,587,31,CREAM,'middle')
    return art+vignette(.63)


def cabinet():
    art=shelves()
    art+=path('M53 489 H1223 V634 Q603 665 53 633 Z','url(#canto-mesa)','#705338',2.2)
    art+=path('M65 502 H1208 M68 625 Q604 651 1207 623',stroke='#b18f61',line=1.8)
    for x in range(79,1116,212):
        art+=rect(x,526,188,74,'#6d553c','#393328',2,3)
        art+=rect(x+8,534,171,57,'none','#957754',1.5)
        art+=path(f'M{x+75} 557 q20 22 41 0',stroke='#c6a573',line=3.6)
    art+=path('M501 518 H692 L715 613 H477 Z','#3b3328','#90704f',2)
    for y in (534,550,566):
        art+=path(f'M515 {y} H677 L683 {y+14} H508 Z','#b6a17b','#6d5a41',1.6)
    art+=path('M477 594 H715 V649 H477 Z','url(#canto-mesa)','#9a7851',2)
    art+=path('M489 603 H704 M572 618 q24 19 46 0',stroke='#c3a16c',line=2.8)
    return art


def tab(text,lines,color='#a66a55'):
    art=ruled_leaf(365,256)
    art+=rect(25,-3,74,28,color,'#b39771',1)
    art+=label(text,26,75,28,INK,bold=True)
    for y,line in zip((132,181),lines,strict=True):
        art+=label(line,26,y,20,INK)
        art+=path(f'M26 {y+11} H337',stroke='#a4916b',line=1.25)
    art+=label('Esquema de revisión',26,228,16,'#676851',font='Arial')
    return art


def investigation(beat):
    if beat==0:
        art=group(shelves(),style='filter:brightness(.64)')
        art+=asset(OPENING/'estado.svg',85,168,568,353)
        art+=item('cambio-gobierno',682,202,1.03,-1)
        art+=put(vale(),744,427,.61,2)
    elif beat==1:
        art=PARTS['archivo-junta'][0]
        art+=item('junta-fiscal',302,290,1.13,-2)
    else:
        art=desk()
        for name,x,angle in (('antecedentes',67,-4),('aprobacion',458,0),('emision',847,3)):
            art+=item(name,x,225,.99,angle)
        art+=path('M207 544 H1049',stroke='#b39967',line=2)
        for x in (207,640,1049):
            art+=circle(x,544,5,GOLD)
        art+=label('Origen del reconocimiento',640,602,26,CREAM,'middle')
    return art+vignette(.59)


def missing():
    art=ruled_leaf(527,219)
    for i in range(4):
        x=30+i*120
        art+=rect(x,31,105,110,'#7e6850','#695642',1.7,3)
        art+=rect(x+6,37,93,97,'#605141','#a38965',1.2,2)
        art+=path(f'M{x+13} 124 H{x+92}',stroke='#b18d63',line=2)
    art+=label('4 expedientes robados',29,180,31,INK,bold=True)
    return art


def findings(beat):
    art=desk(322 if beat==0 else 892 if beat==2 else 637,341)
    art+=item('expedientes-observados',84,135,1.06,-2)
    if beat>=1:
        art+=item('monto-observado',666,120,1.06,1)
    if beat==2:
        art+=item('expedientes-robados',658,410,1.0,-1)
    art+=label('Quiroz · p. 183, nota 147',86,603,23,CREAM)
    return art+vignette(.63)


def dispute(beat):
    art=desk(640,332)
    if beat==0:
        art+=tag('29 de diciembre de 1856',413,78,446)
        art+=label('Vales cuestionados por su origen',635,184,26,CREAM,'middle')
        art+=put(vale(),83,216,.73,-2)
        art+=item('bono-externo',756,206,.74,2)
        art+=tag('Servicio suspendido',91,508,400)
        art+=tag('Conversión en pausa',765,508,400)
        art+=path('M545 331 H611 M667 331 H734 M626 315 V347 M652 315 V347',
                  stroke='#c09b69',line=3.2)
    elif beat==1:
        art+=item('argumento-tenedores',76,213,1.02,-3)
        art+=item('argumento-junta',669,199,1.02,2)
    else:
        art+=asset(OPENING/'estado.svg',790,174,417,257)
        art+=tag('Autoridades',847,460,296)
        art+=tag('Comerciantes y financistas',65,194,511)
        art+=tag('Representantes diplomáticos',65,369,511)
        art+=label('Gran Bretaña y Francia',91,483,23,CREAM)
        art+=arrow(581,231,771,313)+arrow(581,405,771,331)
    return art+vignette(.62)


def recovery(beat):
    art=desk(625 if beat<2 else 827,344)
    if beat==0:
        art+=tag('11 de marzo de 1857',397,73,478)
        art+=put(vale(),67,229,.74,-2)
        art+=item('bono-externo',781,222,.75,1)
        art+=label('Se reanudan los acuerdos',640,171,29,CREAM,'middle')
        art+=arrow(525,347,752,347)
    elif beat==1:
        art+=put(vale(),102,197,.78,-3)
        art+=item('examen-origen',693,193,1.03,2)
        art+=path('M637 166 V528',stroke='#a18660',line=1.6)
        art+=tag('Título rehabilitado',133,520,385)
    else:
        art+=item('informes-junta',238,167,1.03,-5)
        art+=item('antecedentes',814,193,.84,4)
        art+=paper_light(528,336,400,238,.31)
    return art+vignette(.63)


def build_parts():
    register('total-1852',stat('Conjunto de la deuda · 1852','24 millones','de pesos de deuda reconocida'),520,246,'Mostrar después de 1851.')
    register('bono-externo',bond(),596,361,'Mantener al lado del vale interno durante el canje.')
    register('carta-12-agosto',letter(12),473,322,'Primera fecha de publicación. Resumen editorial.')
    register('carta-16-agosto',letter(16),473,322,'Segunda fecha de publicación. Resumen editorial.')
    register('doble-funcion-elias',ruled_leaf(499,178)+label('Domingo Elías',26,56,39,INK,bold=True)
             +label('Intermediario en el caso Novoa',27,106,27,INK)+label('Denuncia publicada en 1853',27,143,23,INK),
             523,202,'Recuperar la identidad de la escena 3.')
    register('archivo-junta',cabinet(),W,H,'Reencuadrar de los estantes a los cajones.')
    register('cambio-gobierno',ruled_leaf(496,169)+label('Cambia el gobierno',25,54,32,INK,bold=True)
             +label('Cae Echenique',25,104,25,INK)+label('Castilla vuelve al poder · 1855',25,140,24,INK),
             520,194,'Mantener el edificio y el título mientras cambia la ficha.')
    register('junta-fiscal',ruled_leaf(599,150)+label('Junta de Examen Fiscal',30,62,38,INK,bold=True)
             +label('Febrero de 1855',32,112,25,INK),624,174,'Presentar antes de abrir los legajos.')
    for name,title,fields,color in (
        ('antecedentes','Antecedentes',('Quién reclama','Respaldo de la solicitud'),'#a66a55'),
        ('aprobacion','Aprobación',('Decisión de reconocimiento','Monto reconocido'),'#85835e'),
        ('emision','Emisión del título',('Vale emitido','Vínculo con la aprobación'),'#5c7765'),
    ):
        register(name,tab(title,fields,color),389,280,'Iluminar cuando se nombre esta etapa del expediente.')
    register('expedientes-observados',stat('La junta identificó','141 expedientes','irregulares o ilegales'),518,243,'Revelar recuento y calificación juntos.')
    register('monto-observado',stat('Monto de esos expedientes','12,2 millones','de pesos'),518,243,'Mantener al lado del recuento.')
    register('expedientes-robados',missing(),552,244,'Mantener separados los cuatro expedientes robados.')
    register('argumento-tenedores',ruled_leaf(516,205)+label('Tenedores',28,67,38,INK,bold=True)
             +label('Buscaban proteger su inversión',29,129,26,INK)+label('Argumento resumido',29,168,16,INK,font='Arial'),
             540,230,'Iluminar al presentar la posición de los tenedores.')
    register('argumento-junta',ruled_leaf(516,205)+label('Junta',28,65,38,INK,bold=True)
             +label('El traspaso no impedía anular',29,119,26,INK)+label('los títulos por fraude',29,150,26,INK)
             +label('Argumento resumido',29,180,16,INK,font='Arial'),
             540,230,'Iluminar al presentar la posición de la junta.')
    register('examen-origen',tab('Examen de origen',('Documentos del reclamo','Decisión de aprobación')),389,280,'Permanece visible mientras el título se reactiva.')
    register('informes-junta',ruled_leaf(508,342)+label('Informes de la junta',28,66,35,INK,bold=True)
             +label('Personas, expedientes y relaciones',28,122,24,INK)
             +path('M29 148 H477 M29 180 H455 M29 211 H475 M29 243 H431 M29 273 H476 M29 304 H442',
                   stroke='#a18b65',line=1.45),
             533,368,'Conservar como puente a las fuentes del historiador.')
    for name,side,pose in (('tenedor-anterior-agarre','left','grip'),('nuevo-tenedor-apertura','right','open'),
                           ('nuevo-tenedor-agarre','right','grip')):
        base,thumb=arm_art(side,pose)
        register(name,put(group(base,id='base')+group(thumb,id='pulgar'),579,93),633,337,
                 'Ancla (579,93). Usar la base debajo del vale y el pulgar encima. Reflejar para el lado derecho.')


def sequences():
    return (
        Sequence('4A.1','Del caso a la escala general',(
            Panel('Retomar el archivo de 1851',totals(0),('Conservar el último cuadro de la escena 3.','Sostener 1851 y cinco millones antes de comparar.')),
            Panel('La deuda reconocida en 1852',totals(1),('Abrir el espacio de lectura y asentar la segunda ficha.','Leer ambos años con sus montos y la fuente.')),
            Panel('Un vale genérico',totals(2),('Retirar las fichas y recuperar el marco doble.','Acercar la cámara al título para pasar a la mesa.')),
        ),'Del expediente al conjunto de la deuda.','Seguir un vale genérico entre tenedores.'),
        Sequence('4A.2','El vale cambia de manos',(
            Panel('El primer tenedor conserva el vale',transfer(0),('Cenital con la cámara fija y espacio a la derecha.','Conservar el marco y el rótulo del título.')),
            Panel('Se acerca la mano receptora',transfer(1),('Flexionar codo y muñeca con la misma longitud.','La luz sigue el borde que se va a sujetar.')),
            Panel('Agarre compartido',transfer(2),('Mantener las dos pinzas unidas a los bordes.','Dar un leve balanceo y roce de papel.')),
            Panel('El nuevo tenedor lo sostiene',transfer(3),('Retirar la primera mano después del contacto.','Asentar el vale y sostener la lectura.')),
        ),'Cambia el tenedor del mismo título.','Recuperar ese vale como punto de partida del canje.'),
        Sequence('4B','De vale interno a bono externo',(
            Panel('Vale de deuda interna',conversion(0),('Mantener el título visible en el lado izquierdo.','Pausar sobre el derecho de cobro.')),
            Panel('Canje de parte de los vales',conversion(1),('Dibujar el trazo hacia el espacio libre.','Revelar «Canje parcial» con el conector.')),
            Panel('Bono de deuda externa',conversion(2),('Hacer entrar el bono y conservar el vale.','Asentar la hoja y dejar leer ambos rótulos.')),
        ),'Parte de los vales se convierte antes de 1855.','Volver a Elías y a sus cartas de 1853.'),
        Sequence('4C','Elías, intermediario y denunciante',(
            Panel('Volver a Domingo Elías',denunciation(0),('Conservar escala, ropa y posición de la escena 3.','Dar tiempo a la función antes de las fechas.')),
            Panel('La carta del 12 de agosto',denunciation(1),('Cortar a la mesa cuando se nombre El Comercio.','Roce de hoja y foco de lectura.')),
            Panel('La carta del 16 de agosto',denunciation(2),('Entrar la segunda carta y sostener las dos.','Retomar su doble papel en la voz.')),
        ),'La denuncia se lee junto a su participación en el negocio.','Pasar del conflicto al cambio de gobierno.'),
        Sequence('4D','La Junta de Examen Fiscal',(
            Panel('Cambia el gobierno',investigation(0),('Mantener el edificio y el vale como anclas.','Mover la ficha política y sostener 1855.')),
            Panel('La junta abre el archivo',investigation(1),('Acercar de los estantes al cajón y su ficha.','Sonido corto de madera y legajo.')),
            Panel('Antecedentes, aprobación y emisión',investigation(2),('Cenital fijo sobre los tres papeles.','Mover un foco de izquierda a derecha.')),
        ),'Examinar los documentos que llevaron a la emisión.','Pasar de las etapas a lo que encontró la junta.'),
        Sequence('4E.1','Los hallazgos, por separado',(
            Panel('141 expedientes irregulares o ilegales',findings(0),('Revelar el recuento con su calificación.','Cámara quieta y pausa de lectura.')),
            Panel('12,2 millones de pesos vinculados',findings(1),('Asentar el monto al lado de los expedientes.','Conservar la nota de Quiroz.')),
            Panel('Cuatro expedientes robados',findings(2),('Bajar el foco a los cuatro espacios vacíos.','Dejar este recuento separado del monto.')),
        ),'Distinguir expedientes observados, monto y expedientes robados.','Pasar a las medidas sobre el servicio y el canje.'),
        Sequence('4E.2','La disputa por los títulos',(
            Panel('Suspensión y pausa de conversión',dispute(0),('Leer primero la fecha y después las medidas.','Detener el trazo y bajar la luz de los títulos.')),
            Panel('Las dos posiciones',dispute(1),('Recorrer la ficha de tenedores y la de la junta.','Sostener ambas con luz pareja.')),
            Panel('Presiones hacia las autoridades',dispute(2),('Mantener el Estado a la derecha.','Dibujar una flecha por grupo en orden de voz.')),
        ),'Seguir las medidas, los argumentos y las presiones.','Mantener los títulos al presentar la restauración.'),
        Sequence('4E.3','La rehabilitación y los informes',(
            Panel('11 de marzo de 1857',recovery(0),('Revelar la fecha antes de reactivar el conector.','Recuperar luz sobre los acuerdos.')),
            Panel('El origen sigue bajo examen',recovery(1),('Mantener el título y los antecedentes juntos.','Igualar luz sin borrar la ficha del origen.')),
            Panel('Quedan los informes de la junta',recovery(2),('Acercar a los informes y sostener el fondo.','Roce de papel antes de volver al circuito.')),
        ),'La rehabilitación financiera deja los informes como huellas.','Abrir 5A.1 desde el circuito y la finalidad del crédito.'),
    )


def save():
    build_parts()
    layers=OUT/'capas'
    layers.mkdir(parents=True,exist_ok=True)
    for name,(drawing,w,h,use) in PARTS.items():
        (layers/f'{name}.svg').write_text(svg(group(drawing,id=name),w,h,DEFS),encoding='utf-8')
    seq=sequences()
    old=json.loads((LONG/'escena-04/secuencia.json').read_text(encoding='utf-8'))
    assert [b.code for b in seq]==[b['id'] for b in old['desarrollo']]
    used={
        '4A.1':['total-1852'],
        '4A.2':['tenedor-anterior-agarre','nuevo-tenedor-apertura','nuevo-tenedor-agarre'],
        '4B':['bono-externo'],
        '4C':['doble-funcion-elias','carta-12-agosto','carta-16-agosto'],
        '4D':['archivo-junta','junta-fiscal','cambio-gobierno','antecedentes','aprobacion','emision'],
        '4E.1':['expedientes-observados','monto-observado','expedientes-robados'],
        '4E.2':['bono-externo','argumento-tenedores','argumento-junta'],
        '4E.3':['bono-externo','examen-origen','informes-junta','antecedentes'],
    }
    vale_ref='../revision-reclamo/capas/vale-deuda-interna.svg'
    archivo_ref='../revision-novoa/escena-completa/capas/archivo-conjunto.svg'
    mesa_ref='../revision-novoa/capas/mesa-cenital.svg'
    shared={
        '4A.1':['../revision-novoa/escena-completa/enlace-4a-1851.svg',
                 '../revision-novoa/escena-completa/capas/total-1851.svg',archivo_ref,vale_ref],
        '4A.2':['../revision-reclamo/capas/mesa-cenital-traspaso.svg',vale_ref],
        '4B':[mesa_ref,vale_ref],
        '4C':[archivo_ref,mesa_ref,f'../../personajes-1850/{ELIAS_POSES[0]}'],
        '4D':[archivo_ref,mesa_ref,vale_ref],
        '4E.1':[mesa_ref],
        '4E.2':[mesa_ref,vale_ref],
        '4E.3':[mesa_ref,vale_ref],
    }
    assert {name for block in used.values() for name in block}==PARTS.keys()
    timeline=[]
    for i,block in enumerate(seq,1):
        filename=f'lamina-{i:02}.svg'
        (OUT/filename).write_text(sheet(block,i,heading='La investigación y los vales',definitions=DEFS),encoding='utf-8')
        assert all((OUT/ref).is_file() for ref in shared[block.code]),block.code
        timeline.append({'id':block.code,'lamina':filename,'cambio':block.change,'enlace':block.link,
                         'piezas':used[block.code],'recursos_reutilizados':shared[block.code],
                         'encuadres':[{'plano':p.title,'camara_y_accion':p.direction[0],'efecto_y_pausa':p.direction[1]}
                                      for p in block.panels]})
    for name,scene,panel in (('entrada-1851',0,0),('agarre-del-vale',1,2),('canje-parcial',2,2),
                             ('archivo-junta',4,1),('hallazgos',5,2),('enlace-escena-05',7,2)):
        (OUT/f'{name}.svg').write_text(svg(seq[scene].panels[panel].image,W,H,DEFS),encoding='utf-8')
    inventory=[{'id':name,'archivo':f'capas/{name}.svg','lienzo':[w,h],'uso':use}
               for name,(_,w,h,use) in PARTS.items()]
    (OUT/'secuencia.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'piezas.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    template=(HERE/'prueba-traspaso-vale.html').read_text(encoding='utf-8')
    (OUT/'prueba-traspaso.html').write_text(template.replace('{{ARTE}}',svg(transfer(0,live=True),W,H,DEFS)),encoding='utf-8')
    print(f'{len(seq)} laminas, {sum(len(b.panels) for b in seq)} encuadres, {len(PARTS)} piezas.')


if __name__=='__main__':
    save()
