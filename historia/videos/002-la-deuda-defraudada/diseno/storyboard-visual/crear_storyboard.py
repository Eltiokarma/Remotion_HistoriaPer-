"""Encuadres de acción del episodio 002. Los rótulos de trabajo viven en la lámina."""
from dataclasses import dataclass
import json

from piezas import (
    HERE, LONG, OPENING, NOVOA, PEOPLE, PROJECT, CREAM, INK, GOLD, RUST, PALE,
    group, rect, path, circle, ellipse, label, arrow, svg, asset,
    existing, landscape, board, desk, office, paper, folder, stack, book,
    person, building, tray, hand, focus, seal, calendar, coin, magnifier,
)

BOOK_ART = PROJECT/'videos/001-el-hombre/diseno/recursos-aprobados'


@dataclass(frozen=True)
class Mini:
    ident: str
    name: str
    frames: tuple
    action: str
    effects: str
    resources: str


def moment(ident, name, draw, action, effects, resources):
    return Mini(ident, name, tuple(draw(i) for i in range(3)), action, effects, resources)


def opener(stage):
    if stage == 0:
        return (asset(OPENING/'mapa-peru.svg') + focus(455,373,14)
                + path('M351 391 L436 376',stroke=GOLD,line=2)
                + label('Pisco',338,402,29,anchor='end') + label('Perú',640,122,43))
    if stage == 1:
        return rect(0,0,960,540,'#638078')+''.join(asset(OPENING/(n+'.svg')) for n in
                       ('pisco-mar','pisco-dunas','pisco-costa','pisco-ciudad')) + label('Pisco',710,135,34)
    return existing('revision-02','panorama') + label('Chincha',738,92,36)


def extraction(stage):
    if stage < 2:
        return existing('revision-02', ('extraccion','llenado')[stage])
    ground = (rect(0,0,960,540,'#819480')
              +path('M0 269 Q202 147 404 230 T960 257 V540 H0 Z','#557558')
              +path('M0 355 Q313 214 960 330 V540 H0 Z','#778659'))
    for i in range(7):
        ground += path(f'M{215+i*108} 300 Q{178+i*119} 412 {43+i*148} 546',stroke='#c1ab76',line=4)
    return (ground+ellipse(222,447,76,13,'#506648')
            +asset(PEOPLE/'objetos/carga.svg',148,252,138,200,box='333 401 210 316'))


def embark(stage):
    if stage < 2:
        return existing('revision-02',f'embarque-{stage}')
    return (board()+landscape()+asset(OPENING/'07_barco.svg',70,15,1150,580)
            +asset(OPENING/'08_mapa_gran_bretana.svg',28,15,930,505,notes=False)
            +asset(OPENING/'13_flujo_comercial.svg',28,15,930,505)
            +label('Chincha',92,157,34)+label('Gran Bretaña',716,426,31))


def account(stage):
    art = desk()+book(131,135,660,355)
    art += paper(190,188,196,149,angle=-4,tab=False)
    art += label('Venta',232,245,33,INK)+coin(267,299,31)+coin(311,290,27)
    if stage > 0:
        art += paper(505,176,199,152,angle=4,tab=False)+label('Gastos y comisión',523,239,20,INK)
        art += arrow(394,260,485,251,'#92794b')
    if stage == 2:
        art += paper(533,336,233,114,lines=False,tab=False)+label('Ingreso público',559,405,24,INK)
        art += arrow(618,314,640,338,'#92794b')
    return art


def obligations(stage):
    art = board()
    if stage == 0:
        return (art+building(480,165,390,220)+book(79,238,255,164)
                +arrow(354,302,466,302)+label('Estado',674,422,31,anchor='middle'))
    if stage == 1:
        return (art+person('comerciante',62,95,230,295)+person('reclamante',628,95,230,295)
                +paper(349,162,226,259,angle=-5)+coin(235,419)+coin(281,422)
                +path('M740 427 l14 -77 m-11 43 l-28 -19 m26 4 l28 -19 m-29 1 l-19 -17',stroke=GOLD,line=4)
                +path('M773 425 l18 -70 m-9 35 l-25 -15 m28 2 l21 -18',stroke=GOLD,line=4))
    return desk()+folder(295,125,386,310,open=True)+hand(302,330,point=True)


def claim(stage):
    return desk()+folder(138-stage*38,174-stage*26,450+stage*45,296,open=True)+paper(
        362-stage*15,179-stage*44,254+stage*31,271+stage*27,angle=-6+stage*3
    )+(hand(343-stage*5,330-stage*16) if stage < 2 else '')


def law(stage):
    art = desk()+paper(167,112,350,354,angle=-3)
    if stage > 0:
        art += book(557,146,285,287,closed=True)+label('1850',701,256,55,GOLD,'middle')
        art += label('Ley de consolidación',701,306,24,CREAM,'middle')
    if stage == 2:
        art += arrow(530,294,556,294)
    return art


def review(stage):
    art = desk()+paper(177,119,303,322,angle=-2)
    art += paper(561,119,244,145,tab=False,angle=3)
    art += paper(583,300,239,129,tab=False,angle=-4)
    art += magnifier((315,662,680)[stage],(248,191,345)[stage])
    if stage == 2:
        art += seal(407,361,30)
    return art


def recognition(stage):
    art = desk()+paper(121,117,287,330)+seal(307,330,33)
    if stage > 0:
        art += paper(517,162,307,227,bond=True,tab=False)
        art += label('Vale',669,237,37,INK,'middle')+arrow(429,282,499,282)
    if stage == 2:
        art += coin(778,444,24)+coin(826,458,24)+path('M748 422 L861 478',stroke=RUST,line=6)
    return art


def privilege(stage):
    art = office()+person('intermediario',65,114,253,308,('atencion','senala','atencion')[stage])
    art += person('funcionario',646,113,226,300)
    art += paper(357+stage*37,157,234,286)
    if stage == 0:
        art += magnifier(429,268,42)
    elif stage == 1:
        art += arrow(310,392,618,391)
        art += path('M360 405 Q480 466 657 405',stroke=RUST,line=3)
    else:
        art += seal(585,328,30)
        art += focus(584,329,45)
    return art


def transition_novoa(stage):
    art = desk()
    if stage == 0:
        return art+folder(310,138,340,280,open=True)
    if stage == 1:
        return art+folder(65,210,319,216,angle=-8)+folder(463,119,370,299)
    return art+folder(263,104,425,334,open=True)+label('Novoa',488,370,35,CREAM,'middle')


def hacienda():
    body = rect(0,0,460,260,'#88967d')+path('M0 136 Q170 80 280 125 T460 137 V260 H0Z','#687e63')
    body += path('M0 172 Q180 147 460 188 V260 H0Z','#78865d')
    for y in (195,220,246):
        body += path(f'M0 {y} Q181 {y-32} 460 {y+9}',stroke='#b7a779',line=2)
    body += rect(48,98,115,75,'#e0c79e','#aa8965',2)
    body += path('M32 101 L94 62 L181 101 Z','#965e4a')
    body += rect(94,130,24,43,'#6e6650')+rect(64,119,18,21,'#6e6650')
    for x,y in ((281,171),(331,153),(384,195)):
        body += circle(x,y-38,7,'#3c483b')
        body += path(f'M{x-7} {y-30} L{x+7} {y-30} L{x+11} {y-11} L{x+4} {y-10} L{x+7} {y} '
                     f'H{x+1} L{x-2} {y-12} L{x-5} {y} H{x-11} Z','#3c483b')
    return body


def novoa_claim(stage):
    art = office()+person('reclamante',57,106,277,331)+folder(327,173,469,278,open=True)
    if stage == 0:
        return art+label('Ignacia Novoa',369,386,35,CREAM)
    art = desk()+paper(176,94,610,355,lines=False)
    if stage == 1:
        return art+group(hacienda(),transform='translate(251 139) scale(1 1)')+rect(251,139,460,260,'none','#9f946e',3)
    return (art+calendar(260,166,306,177,index=8)+calendar(307,191,306,177,index=10)
            +label('32 años',649,273,54,INK,'middle')+path('M343 392 H630',stroke='#a27d53',line=3))


def elias(stage):
    art = office()+folder(181,244,291,174,open=True)
    art += group(person('intermediario',510,109,307,344,('atencion','senala','atencion')[stage]),
                 transform='translate(1327 0) scale(-1 1)')
    art += paper((333,405,614)[stage],(254,251,272)[stage],218,214,angle=-8+stage*3)
    if stage == 2:
        art += arrow(837,373,903,373)
    return art


def deadline_layers():
    """Recursos independientes para el plano cenital de 3C."""
    return {
        'mesa': desk()+tray(677,124,225,303)+calendar(699,38,166,110,count=6,index=5),
        'folio': paper(0,0,207,250)+label('Novoa',26,59,30,INK),
        'mano': hand(0,0),
        'marca': (path('M626 98 V462',stroke=RUST,line=4)+circle(626,97,17,'#6d4839',GOLD,3)
                  +path('M618 97 H634',stroke=CREAM,line=3)+label('Plazo',625,493,24,CREAM,'middle')),
    }


def deadline(stage):
    parts = deadline_layers()
    x = (191,383,383)[stage]
    document = group(parts['folio'],transform=f'translate({x} 150)')
    palm_x = (188,378,146)[stage]
    return (parts['mesa']+document+group(parts['mano'],transform=f'translate({palm_x} 312)')
            +(parts['marca'] if stage > 0 else '')
            +(focus(626,97,26,RUST) if stage == 1 else ''))


def intervention(stage):
    if stage == 0:
        return (office()+paper(118,171,245,283)+asset(NOVOA/'torrico.svg',452,128,365,326)
                +label('Torrico',666,483,31,CREAM,'middle'))
    art = desk()+paper(82,216,206,231,angle=-5)+paper(341,103,504,339,lines=False)
    if stage == 1:
        return art+calendar(97,43,199,138,index=11)
    return art+label('948.500',593,263,90,INK,'middle')+label('pesos en vales',593,319,33,INK,'middle')


def values(stage):
    art = desk()+paper((258,100,66)[stage],115,424,311,lines=False)
    left = (470,312,278)[stage]
    art += label('Aprobado',left,191,30,INK,'middle')+label('948.500',left,277,68,INK,'middle')
    art += label('pesos en vales',left,326,27,INK,'middle')
    if stage > 0:
        art += paper(517,116,377,311,lines=False)
        art += label('Novoa habría recibido',706,190,25,INK,'middle')
        art += label('≈180.000',706,277,62,INK,'middle')+label('pesos en vales',706,326,27,INK,'middle')
    if stage == 2:
        art += path('M94 379 H458 M542 379 H868',stroke='#94794f',line=1.8)
    return art


def scope(stage):
    if stage == 0:
        return desk()+folder(260,128,421,301,open=True)+label('Novoa',461,365,37,CREAM,'middle')
    art = desk()+stack(65,269,4,236,136)+stack(352,279,5,233,136)+stack(650,254,4,221,136)
    if stage == 1:
        return art+folder(343,232,263,170,angle=-7)
    return art+book(333,83,319,172,closed=True)+label('Deuda reconocida',492,186,30,CREAM,'middle')


def amounts(stage):
    art = board()+path('M167 432 H827 M167 432 V119',stroke=PALE,line=2)+label('Deuda reconocida',166,82,38)
    art += rect(269,373,151,59,'#9b9466')+label('1851',346,476,26,CREAM,'middle')
    art += label('5 millones',345,347,30,CREAM,'middle')
    if stage > 0:
        art += rect(585,149,151,283,'#c3a16b')+label('1852',661,476,26,CREAM,'middle')
        art += label('24 millones',661,126,31,CREAM,'middle')
    if stage == 2:
        art += group(paper(739,282,170,123,bond=True,tab=False,angle=-8),opacity=.94)
    return art


def conversion(stage):
    art = desk()+paper((320,137,115)[stage],178,279,192,bond=True,tab=False)
    art += label('Vale', (460,277,255)[stage],250,32,INK,'middle')
    if stage > 0:
        art += arrow(438,272,532,272)
        art += paper(556,165,296,211,tab=False,bond=True,angle=4)
        art += label('Bono externo',705,240,26,INK,'middle')
    if stage == 2:
        art += path('M610 417 Q707 379 802 412 T938 407',stroke='#d0b184',line=2)
    return art


def letters(stage):
    if stage == 0:
        return office()+person('intermediario',485,105,278,343)+folder(162,227,275,185,open=True)
    art = desk()+paper(234,91,382,382,angle=-5,tab=False)
    if stage == 1:
        art += hand(508,277,point=True,mirror=True)+path('M574 247 l-102 72',stroke='#967348',line=7)
    else:
        art += paper(484,159,310,322,angle=6,tab=False)+label('Cartas públicas',631,250,29,INK,'middle')
    return art


def investigation(stage):
    if stage == 0:
        return board()+building(268,137,421,238)+label('1855',476,451,48,CREAM,'middle')
    art = desk()+stack(68,249,4,231,153)+paper(384,119,298,321,angle=-3)
    return art + (hand(411,348,mirror=True) if stage == 1 else magnifier(552,250,84))


def findings(stage):
    art = desk()+stack(104,237,4,262,166)+paper(424,101,413,332,lines=False)
    art += label('141 expedientes',629,200,44,INK,'middle')+label('irregulares o ilegales',629,246,27,INK,'middle')
    if stage > 0:
        art += label('12,2 millones de pesos',629,331,31,INK,'middle')
    if stage == 2:
        art += folder(126,113,201,139,angle=-8)+label('4 expedientes robados',251,461,23,CREAM,'middle')
    return art


def suspension(stage):
    art = desk()+paper(134,174,285,205,bond=True,tab=False)+paper(550,167,278,205,bond=True,tab=False)
    if stage < 2:
        art += arrow(428,272,529,272)
        if stage == 1:
            art += path('M471 220 V326 M488 220 V326',stroke=RUST,line=9)
            art += label('Suspensión · 1856',480,447,34,CREAM,'middle')
    else:
        art += hand(226,245,point=True)+hand(775,290,mirror=True,point=True,sleeve='#655a45')
    return art


def restoration(stage):
    art = desk()+paper(161,151,287,203,bond=True,tab=False)
    if stage == 0:
        return art+path('M493 190 V334 M512 190 V334',stroke=RUST,line=8)
    if stage == 1:
        return art+arrow(471,254,667,254)+label('1857',721,262,52,CREAM,'middle')
    return desk()+stack(131,244,4,266,157)+paper(523,110,303,317,tab=False,angle=3)


def beneficiaries(stage):
    art = board()+building(346,81,270,150)+person('comerciante',74,219,194,260)
    for x,y in ((725,278),(811,285)):
        art += circle(x,y,27,'#c7aa7b')
        art += path(f'M{x-32} {y+91} V{y+56} Q{x} {y+27} {x+32} {y+56} V{y+91} Z','#7d8a6b','#aaa986',2)
    if stage == 0:
        art += paper(379,264,189,163,bond=True,tab=False)
    elif stage == 1:
        art += paper(248,275,159,131,bond=True,tab=False)+arrow(472,314,434,314)
        art += folder(575,299,153,110,open=True)
    else:
        art += paper(190,276,167,131,bond=True,tab=False)+paper(221,303,167,131,bond=True,tab=False)
        art += folder(574,311,145,93)
    return art


def circuit(stage):
    art = board()+asset(LONG/'recursos/revision-02/panorama.svg',38,214,189,107,notes=False)
    art += folder(276,222,146,107,open=True)+arrow(232,273,268,273)
    if stage > 0:
        art += building(471,215,186,105)+arrow(430,273,461,273)
        art += paper(730,215,160,119,bond=True,tab=False)+arrow(666,273,719,273)
    if stage == 2:
        art += paper(737,359,141,105,tab=False,angle=9)+magnifier(805,406,37)
    return art


def historian(stage):
    if stage == 0:
        return desk()+stack(88,251,4,243,151)+paper(503,110,334,322,tab=False)
    art = desk()+rect(0,0,960,540,'#293e3542')
    art += asset(BOOK_ART/'tanda03-libro.svg',174,79,284,367,
                 box='628 115 652 844',layers=range(2,6))
    art += asset(BOOK_ART/'tanda03-pruebas.svg',517,169,358,324,
                 box='522 120 932 845',layers=range(2,6))
    if stage == 2:
        art += circle(601,149,25,'none','#4b5645',4)+circle(660,149,25,'none','#4b5645',4)
        art += path('M625 147 Q630 136 636 147 M577 146 l-54 -33 M684 148 l39 -33',stroke='#4b5645',line=4)
    return art


def method(stage):
    art = desk()+paper(122,141,254,293,tab=False,angle=-4)+book(464,113,402,266)
    art += magnifier(240+stage*127,243,60)
    if stage > 0:
        art += path('M220 327 Q434 452 688 311',stroke=GOLD,line=3)
    if stage == 2:
        art += label('≈',747,351,73,INK,'middle')
    return art


def close(stage):
    art = board()+book(266,149,426,244,closed=True)
    if stage == 0:
        return art+paper(385,106,198,241,tab=False,angle=-5)
    if stage == 1:
        return art+magnifier(480,256,106)
    return art+label('¿Cómo se mide',478,250,49,CREAM,'middle')+label('lo que se oculta?',478,316,49,CREAM,'middle')


def scenes():
    return (
        ('Las islas y el país', (
            moment('1A','Perú, Pisco y Chincha',opener,
                   'Acercarse a Pisco. Bajar al perfil de la ciudad y viajar sobre el agua hasta las islas.',
                   'Zoom al pin, paralaje de dunas y costa, destellos cortos de mar y aves en profundidad.',
                   'Mapa del Perú, pin de Pisco, mar, dunas, ciudad 2D, roca y aves del recorrido.'),
            moment('1B.1','De la roca al saco',extraction,
                   'La pala entra en el depósito. La carga cae al saco. Un corte acerca su uso agrícola.',
                   'Seguir la pala, polvo ocre al contacto y granos que caen hasta que se aquieta el saco.',
                   'Dos poses de extracción, pala, saco, partículas de guano, campos y cultivos.'),
            moment('1B.2','Agarrar y levantar',lambda i: existing('revision-02',f'carga-{i}'),
                   'Preparar el cuerpo, agarrar ambos bordes y apoyar el pie al levantar el mismo saco.',
                   'Bajar el centro de gravedad, acompasar sombra con el pie y soltar unos granos al despegue.',
                   'Trabajador corregido, manos con pivotes, apoyo, saco testigo y sombra.'),
            moment('1C.1','Embarque y mercado',embark,
                   'Seguir el saco hasta la borda y abrir el esquema comercial hacia Gran Bretaña.',
                   'Balanceo corto del casco, cuerda tensa al cargar y línea de ruta dibujada sobre el mar.',
                   'Saco, pasarela, barco detallado, mapa británico y trazado esquemático.'),
            moment('1C.2','La cuenta del guano',account,
                   'Abrir el libro. Separar la venta y sus descuentos. El ingreso público ocupa la última partida.',
                   'Barrido de luz sobre cada partida, giro de una hoja y pausa cuando se cierra la cuenta.',
                   'Libro abierto, fichas de venta, gastos y comisión, e ingreso público.'),
            moment('1D.1','Del ingreso a la deuda',obligations,
                   'Pasar del libro al Estado. Ver un préstamo y un bien requisado antes de abrir el reclamo.',
                   'Paneo libro–Estado, focos por turnos en los dos ejemplos y acercamiento a la pestaña.',
                   'Edificio, comerciantes, moneda y cosecha simbólicas, carpeta y mano.'),
            moment('1D.2','Elegir el folio',claim,
                   'Sacar de la carpeta el papel de pestaña roja y terminar con el folio en el centro.',
                   'Arrastre de papel con sombra, acercamiento corto y cuadro quieto para enlazar.',
                   'Carpeta, folio testigo, mano y mesa cenital.'),
        )),
        ('El recorrido de un reclamo', (
            moment('2A','El mismo reclamo y la ley',law,
                   'Recoger el folio del plano anterior. Abrir a su lado el libro que sitúa la ley de 1850.',
                   'Enlace por posición del folio, entrada del libro con peso y luz sobre la fecha.',
                   'Folio, libro de ley esquemático y rótulo de fecha.'),
            moment('2B','Cotejar los respaldos',review,
                   'Recorrer el reclamo y los dos respaldos. El reconocimiento aparece al acabar el cotejo.',
                   'Deslizar la lupa por tres puntos. Encender un foco a la vez y detenerlo en la revisión.',
                   'Folio, respaldos, lupa y marca editorial de revisión.'),
            moment('2C','Del reclamo al vale',recognition,
                   'Conservar el reclamo reconocido al introducir el vale de doble marco. Separar las monedas.',
                   'Entrada por deslizamiento, destello en el doble marco y foco breve en la diferencia.',
                   'Reclamo, vale genérico, monedas de contraste y flecha.'),
            moment('2D','El papel pasa de mano',lambda i: existing('revision-02-reclamo',f'compra-{i}'),
                   'Acercar el papel, sostenerlo entre dos manos y soltar después de recibir el sobre.',
                   'Cámara fija en el contacto, muñecas y dedos articulados, roce de papel al soltar.',
                   'Poses de entrega, manos receptoras, folio y sobre.'),
            moment('2E','La revisión eludida',privilege,
                   'Pasar de la revisión prevista a una vía favorecida del ejemplo. Mostrar quién recibe el folio.',
                   'Mover el foco de la lupa a la trayectoria lateral y marcar el reconocimiento al final.',
                   'Intermediario y funcionario, lupa, folio y trayectorias del ejemplo.'),
            moment('2F','Cerrar un caso y abrir otro',transition_novoa,
                   'Cerrar el ejemplo, apartarlo y abrir el expediente con el nombre de Novoa.',
                   'Giro de tapa, deslizamiento lateral y enlace por color de la pestaña roja.',
                   'Dos carpetas distinguibles, folio y pestaña.'),
        )),
        ('El expediente de Novoa', (
            moment('3A','Qué incluía la solicitud',novoa_claim,
                   'Abrimos el expediente de Novoa. Pasamos a la hacienda y a las personas esclavizadas incluidas en el reclamo, luego al lapso que pedía compensar.',
                   'Acercamiento al folio, parallax leve del campo y paso de páginas para mostrar los 32 años.',
                   'Reclamante corregida, carpeta, ilustración de hacienda y calendario.'),
            moment('3B','La gestión de Elías',elias,
                   'Elías toma la gestión. El expediente se desplaza hacia el siguiente paso.',
                   'Preparación de brazo, señalamiento corto con cámara fija y salida del papel a la derecha.',
                   'Busto de Elías y rig, carpeta y folio con pestaña.'),
            moment('3C','El trámite se detiene',deadline,
                   'La mano empuja el expediente hacia la bandeja. El indicador del plazo lo detiene y la mano se retira.',
                   'Cenital fijo, frenada de papel, pulso opaco de la marca y sombra al levantar la mano.',
                   'Mesa, bandeja, calendario, folio, mano y marcador editorial del plazo.'),
            moment('3D','Torrico y la aprobación',intervention,
                   'Presentar a Torrico. Pasar a días después y revelar el valor completo en un folio separado.',
                   'Leve luz de ventana, paso de calendario, aparición conjunta de cifra y unidad, pausa de lectura.',
                   'Torrico, antecedente, calendario y folio de aprobación.'),
            moment('3E','Dos montos, dos significados',values,
                   'Mostrar lo aprobado. Abrir espacio para la estimación de Novoa y sostener ambas juntas.',
                   'Alejar el encuadre al entrar la segunda hoja. Dejar luz pareja en la comparación.',
                   'Dos hojas independientes, 948.500 y estimación de 180.000 pesos en vales.'),
            moment('3F','Del expediente al conjunto',scope,
                   'Cerrar el caso de Novoa. Al abrir el encuadre aparecen otros expedientes y las cuentas generales.',
                   'Retroceso de cámara, sombras escalonadas de las carpetas y foco final sobre el libro.',
                   'Carpeta de Novoa, expedientes genéricos y libro de deuda reconocida.'),
        )),
        ('La investigación y los vales que siguen circulando', (
            moment('4A.1','La escala de la deuda',amounts,
                   'Levantar el dato de 1851 y añadir 1852 a la misma escala. Pasar a un título genérico.',
                   'Barras que crecen desde el mismo eje, cifras fijas y pausa antes de acercarse al vale.',
                   'Gráfico de deuda reconocida, 1851 y 1852, y vale genérico.'),
            moment('4A.2','El nuevo tenedor',lambda i: existing('encuadres',('vale-entrega-a','vale-entrega-b','vale-entrega-c')[i]),
                   'Sostener el mismo vale desde el primer agarre hasta que lo recibe la otra mano.',
                   'Alinear dedos y borde del vale, frenar en el agarre compartido y soltar después.',
                   'Tres poses de manos, mangas y vale con marco constante.'),
            moment('4B','Del vale al bono',conversion,
                   'Seguir un vale hacia el bono externo. Mantener a la vista ambos instrumentos durante el cambio.',
                   'Deslizar las hojas, dibujar el puente y encender el borde del nuevo instrumento.',
                   'Vale, bono externo esquemático y trayectoria.'),
            moment('4C','Elías vuelve como denunciante',letters,
                   'Recuperar a Elías y el expediente. Pasar a la escritura y circulación de sus cartas públicas.',
                   'Empalme por la silueta, trazo de pluma y salida de la hoja hacia la copia impresa.',
                   'Elías, carpeta, pluma, carta e impreso editorial.'),
            moment('4D','Abrir la investigación',investigation,
                   'Situar 1855 en el Estado. Bajar a la mesa donde se extrae y examina un expediente.',
                   'Paneo del edificio a la mesa, sombra de folios y foco de lupa en el papel seleccionado.',
                   'Edificio, legajos, folio de revisión, mano y lupa.'),
            moment('4E.1','Hallazgos separados',findings,
                   'Abrir el recuento de expedientes, vincularle el importe y apartar los cuatro robados.',
                   'Entradas escalonadas, luz común para 141 y su importe, foco separado para los cuatro.',
                   'Legajos, hoja de hallazgos, 141 expedientes, importe y carpeta separada.'),
            moment('4E.2','Suspensión y disputa',suspension,
                   'Detener el paso del título. Mostrar que sigue en manos de sus tenedores.',
                   'Frenar la trayectoria, bajar el brillo del puente y revelar las manos por turnos.',
                   'Vales, marcas de suspensión y manos de tenedores.'),
            moment('4E.3','Rehabilitación y documentos',restoration,
                   'Reabrir el paso del título en 1857 y volver a los informes sobre su origen.',
                   'Retirar la barrera, reanudar el desplazamiento y empalmar por la hoja del informe.',
                   'Vale, indicador de 1857, carpetas e informe.'),
        )),
        ('Del expediente al método de Quiroz', (
            moment('5A.1','El propósito y los beneficiarios',beneficiaries,
                   'Recuperar el propósito del crédito. Separar a los reclamantes de quienes concentran los títulos.',
                   'Dar foco por turnos a las dos posiciones, mover el vale y sostener la distribución final.',
                   'Estado, comerciante, reclamante, carpeta y vales genéricos.'),
            moment('5A.2','Reconstruir el circuito',circuit,
                   'Recuperar el guano y el reclamo, seguir al Estado y al vale, y terminar en el informe que permite examinarlos.',
                   'Recorrido de cámara entre objetos conocidos, líneas dibujadas por tramos y foco de lupa.',
                   'Islas, carpeta, Estado, vale, informe, lupa y trazados.'),
            moment('5B.1','Volver al historiador',historian,
                   'Enlazar el informe con una mesa de investigación posterior por el encuadre del papel.',
                   'Corte por forma de la hoja, cambio de luz y un leve desplazamiento de los lentes sobre la mesa.',
                   'Informe, libro abierto, notas y lentes de lectura.'),
            moment('5B.2','Cotejar y estimar',method,
                   'Recorrer documentos y libro con la lupa. Mostrar el signo de aproximación cuando entra la estimación.',
                   'Deslizar la lupa, unir las fuentes con un trazo y sostener el signo final.',
                   'Libro, hoja, lupa, trazo y signo de aproximación.'),
            moment('5C','Abrir la pregunta siguiente',close,
                   'Cerrar sobre el libro y la lupa. Dar espacio a la pregunta que abre el episodio 003.',
                   'Acercamiento suave, luz concentrada y pausa de cierre antes de la salida.',
                   'Libro cerrado, folio, lupa y pregunta del siguiente episodio.'),
        )),
    )


def sheet(title, rows, number):
    width, margin, gap, tile_width, row_height = 1520, 34, 18, 472, 338
    height = 112 + len(rows)*row_height + 24
    body = rect(0,0,width,height,'#e8dec3')
    body += label(f'Episodio 02 · Escena {number}',margin,34,18,'#5a6b5b',font='Arial')
    body += label(title,margin,83,42,INK)
    defs = ''
    for index, mini in enumerate(rows):
        y = 111 + index*row_height
        body += label(f'{mini.ident}   {mini.name}',margin,y+25,23,INK,font='Arial',bold=True)
        for frame, content in enumerate(mini.frames):
            x = margin+frame*(tile_width+gap)
            clip = f'panel-{index}-{frame}'
            defs += f'<clipPath id="{clip}">{rect(0,0,960,540,"white")}</clipPath>'
            body += group(group(content,clip_path=f'url(#{clip})'),
                          id=f'{mini.ident.replace(".","-")}-plano-{frame+1}',
                          transform=f'translate({x} {y+39}) scale({tile_width/960:.8f})')
        body += label(mini.effects,margin,y+326,16,'#405543',font='Arial')
    return svg(body,width,height,defs)


def write_assets():
    folder_path = HERE/'recursos'/'3C'
    folder_path.mkdir(parents=True,exist_ok=True)
    layers = deadline_layers()
    for name, art in layers.items():
        # Mesa y marca ocupan el encuadre. Folio y mano se exportan con coordenadas locales.
        if name == 'folio':
            out = svg(group(art,transform='translate(20 20)'),247,294)
        elif name == 'mano':
            out = svg(group(art,transform='translate(739 17)'),802,126)
        else:
            out = svg(art)
        (folder_path/f'{name}.svg').write_text(out,encoding='utf-8')


def main():
    original = json.loads((LONG/'secuencia.json').read_text(encoding='utf-8'))
    all_scenes = scenes()
    assert len(all_scenes) == len(original['escenas_largas'])
    effects = ['# Planos, recursos y efectos del episodio 002', '',
               'Los tres cuadros de cada fila marcan momentos de la acción. La locución, el movimiento y la pausa determinan cuánto se sostiene cada plano.', '']
    inventory = []
    for number, (title, rows) in enumerate(all_scenes,1):
        old = json.loads((LONG/f'escena-{number:02}'/'secuencia.json').read_text(encoding='utf-8'))
        assert [r.ident for r in rows] == [r['id'] for r in old['desarrollo']], title
        name = f'escena-{number:02}'
        (HERE/f'{name}.svg').write_text(sheet(title,rows,number),encoding='utf-8')
        effects += [f'## {title}', '', f'[Lámina ilustrada]({name}.svg)', '']
        for mini in rows:
            effects += [f'### {mini.ident} · {mini.name}', '', mini.action, '',
                        f'**Movimiento y efectos.** {mini.effects}', '', f'**Piezas.** {mini.resources}', '']
            inventory.append({'escena': number, 'id': mini.ident, 'titulo': mini.name, 'planos': 3,
                              'dibujo': mini.action, 'efectos': mini.effects, 'piezas': mini.resources})
    (HERE/'PLANOS-Y-EFECTOS.md').write_text('\n'.join(effects),encoding='utf-8')
    (HERE/'planos.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    write_assets()
    print(f'{len(all_scenes)} escenas, {len(inventory)} mini escenas y {3*len(inventory)} encuadres.')


if __name__ == '__main__':
    main()
