/* ======================= REALIDAD VIRTUAL =======================
   Cuatro experiencias hechas con A-Frame (WebXR). Funcionan en la pantalla (arrastrar para mirar, tocar para elegir),
   moviendo el móvil o con unas gafas Cardboard (mirar fijamente un objeto 1,5 s para elegirlo).
   A-Frame solo se descarga cuando se entra en una experiencia. No se guarda nada: todo vive en memoria. */
const AFRAME_URL = 'https://aframe.io/releases/1.6.0/aframe.min.js';
const VR = { voice:true, found:new Set(), last:null, env:null, timers:[], panel:null, world:null, esc:null, door:null, key:false };

/* ---------- textos ---------- */
const VT = {
 hubIntro:{es:'¡Ponte unas gafas de cartón (Cardboard) o mueve el móvil para mirar a tu alrededor! Elige una aventura y yo te acompaño.',gl:'Pon unhas lentes de cartón (Cardboard) ou move o móbil para mirar ao teu arredor! Escolle unha aventura e eu acompáñote.',en:'Put on some cardboard goggles (Cardboard) or move your phone to look around! Pick an adventure and I’ll come with you.',
  teen:{es:'Experiencias inmersivas para conocer tus derechos, prepararte para la plaza judicial y saber a quién acudir. Funcionan con gafas Cardboard o directamente en la pantalla.',gl:'Experiencias inmersivas para coñecer os teus dereitos, prepararte para a praza xudicial e saber a quen acudir. Funcionan con lentes Cardboard ou directamente na pantalla.',en:'Immersive experiences to learn your rights, get ready for court and know who to turn to. They work with Cardboard goggles or right on the screen.'}},
 howTitle:{es:'Cómo se juega',gl:'Como se xoga',en:'How to play'},
 how1:{es:'Con el ratón o con el dedo: arrastra para mirar a tu alrededor (también arriba y abajo) y haz clic o toca las cosas para elegirlas.',gl:'Co rato ou co dedo: arrastra para mirar ao teu arredor (tamén arriba e abaixo) e fai clic ou toca as cousas para escollelas.',en:'With a mouse or your finger: drag to look around (up and down too) and click or tap things to choose them.'},
 how2:{es:'Con el móvil: muévelo y la escena se mueve contigo.',gl:'Co móbil: móveo e a escena móvese contigo.',en:'With a phone: move it and the scene moves with you.'},
 how3:{es:'Con gafas Cardboard: pulsa el botón de las gafas (abajo a la derecha), mete el móvil en las gafas y mira fijamente algo durante un segundo y medio, o pulsa el botón de las gafas, para elegirlo.',gl:'Con lentes Cardboard: preme o botón das lentes (abaixo á dereita), mete o móbil nas lentes e mira fixamente algo durante un segundo e medio, ou preme o botón das lentes, para escollelo.',en:'With Cardboard goggles: press the goggles button (bottom right), put the phone in the goggles and stare at something for a second and a half, or press the goggles button, to choose it.'},
 how4:{es:'En pantalla completa: pulsa «Pantalla completa» en la esquina de la escena. Se sigue jugando igual, con el ratón o con el dedo.',gl:'En pantalla completa: preme «Pantalla completa» na esquina da escena. Segues xogando igual, co rato ou co dedo.',en:'Full screen: press “Full screen” in the corner of the scene. You play the same way, with a mouse or your finger.'},
 fsOn:{es:'Pantalla completa',gl:'Pantalla completa',en:'Full screen'}, fsOff:{es:'Salir de pantalla completa',gl:'Saír da pantalla completa',en:'Exit full screen'},
 loading:{es:'Preparando la realidad virtual…',gl:'Preparando a realidade virtual…',en:'Getting virtual reality ready…'},
 loadErr:{es:'No se ha podido cargar la realidad virtual. Comprueba que tienes conexión a internet y vuelve a intentarlo.',gl:'Non se puido cargar a realidade virtual. Comproba que tes conexión a internet e volve intentalo.',en:'Virtual reality could not be loaded. Check your internet connection and try again.'},
 retry:{es:'Reintentar',gl:'Reintentar',en:'Try again'},
 voiceOn:{es:'Voz de Bubo: sí',gl:'Voz de Bubo: si',en:'Bubo’s voice: on'}, voiceOff:{es:'Voz de Bubo: no',gl:'Voz de Bubo: non',en:'Bubo’s voice: off'},
 restart:{es:'Volver a empezar',gl:'Volver comezar',en:'Start again'},
 // globos
 gName:{es:'Mi diccionario de globos',gl:'O meu dicionario de globos',en:'My balloon dictionary'},
 gDesc:{es:'Pincha los globos con tu chincheta y Bubo te explica cada palabra.',gl:'Pincha os globos coa túa chincheta e Bubo explícache cada palabra.',en:'Pop the balloons with your pin and Bubo explains each word.',teen:{es:'Revienta los globos con la chincheta y descubre qué significa cada término jurídico.',gl:'Rebenta os globos coa chincheta e descobre que significa cada termo xurídico.',en:'Pop the balloons with the pin and find out what each legal term means.'}},
 gIntro:{es:'¡Mira cuántos globos! Cada uno lleva una palabra del mundo de la justicia. Apunta con tu chincheta, pincha uno y te cuento qué significa.',gl:'Mira cantos globos! Cada un leva unha palabra do mundo da xustiza. Apunta coa túa chincheta, pincha un e cóntoche que significa.',en:'Look at all these balloons! Each one carries a word from the world of justice. Aim your pin, pop one and I’ll tell you what it means.',
  teen:{es:'Estás en una plaza llena de globos. Cada uno esconde un término jurídico: revienta los que quieras con la chincheta y te explico su significado.',gl:'Estás nunha praza chea de globos. Cada un agocha un termo xurídico: rebenta os que queiras coa chincheta e explícoche o seu significado.',en:'You’re in a square full of balloons. Each one hides a legal term: pop any you like with the pin and I’ll explain what it means.'}},
 gHead:{es:'Bubo te lo explica',gl:'Bubo explícacho',en:'Bubo explains',teen:{es:'Definición',gl:'Definición',en:'Definition'}},
 gOk:{es:'¡Entendido!',gl:'Entendido!',en:'Got it!'},
 gCount:{es:'Palabras descubiertas',gl:'Palabras descubertas',en:'Words discovered'},
 gNone:{es:'Todavía no has pinchado ningún globo.',gl:'Aínda non pinchaches ningún globo.',en:'You haven’t popped any balloons yet.'},
 gAll:{es:'¡Has pinchado todos los globos! Ya conoces un montón de palabras de la justicia.',gl:'Pinchaches todos os globos! Xa coñeces un montón de palabras da xustiza.',en:'You popped every balloon! Now you know loads of justice words.',teen:{es:'Diccionario completado: ya conoces todos los términos. ¡Buen trabajo!',gl:'Dicionario completado: xa coñeces todos os termos. Bo traballo!',en:'Dictionary complete: you now know every term. Great job!'}},
 gClassic:{es:'Ver el diccionario clásico',gl:'Ver o dicionario clásico',en:'See the classic dictionary'},
 // escape
 eName:{es:'Escape room de derechos',gl:'Escape room de dereitos',en:'Rights escape room'},
 eDesc:{es:'Abre los cuatro candados descubriendo tus derechos y llévate la llave.',gl:'Abre os catro candados descubrindo os teus dereitos e lévate a chave.',en:'Open the four padlocks by discovering your rights and take the key.'},
 eIntro:{es:'¡Estamos encerrados! La puerta tiene cuatro candados. Busca los objetos con una «?» y descubre un derecho en cada uno para abrirlos.',gl:'Estamos pechados! A porta ten catro candados. Busca os obxectos cunha «?» e descobre un dereito en cada un para abrilos.',en:'We’re locked in! The door has four padlocks. Look for the objects with a “?” and discover a right in each one to open them.',
  teen:{es:'Sala cerrada con cuatro candados. Cada objeto marcado con «?» plantea un caso real: resuélvelo con el derecho correcto para abrir un candado. El cronómetro está en marcha.',gl:'Sala pechada con catro candados. Cada obxecto marcado con «?» presenta un caso real: resólveo co dereito correcto para abrir un candado. O cronómetro está en marcha.',en:'A locked room with four padlocks. Each object marked “?” sets out a real case: solve it with the right legal right to open a padlock. The clock is running.'}},
 eLocks:{es:'Candados abiertos',gl:'Candados abertos',en:'Padlocks open'},
 eOpen:{es:'¡Candado abierto!',gl:'Candado aberto!',en:'Padlock open!'},
 eAlmost:{es:'¡Casi!',gl:'Case!',en:'Almost!',teen:{es:'Respuesta incorrecta',gl:'Resposta incorrecta',en:'Wrong answer'}},
 eRetry:{es:'Probar otra vez',gl:'Probar outra vez',en:'Try again'},
 eNext:{es:'Seguir',gl:'Seguir',en:'Continue'},
 eDone:{es:'¡Lo has conseguido! La puerta está abierta. Coge la llave: es tuya y lleva dentro todos tus derechos.',gl:'Conseguíchelo! A porta está aberta. Colle a chave: é túa e leva dentro todos os teus dereitos.',en:'You did it! The door is open. Take the key: it’s yours and it holds all your rights.',teen:{es:'Sala superada. Coge la llave: resume los cuatro derechos que acabas de demostrar que conoces.',gl:'Sala superada. Colle a chave: resume os catro dereitos que acabas de demostrar que coñeces.',en:'Room cleared. Take the key: it sums up the four rights you’ve just shown you know.'}},
 eTake:{es:'Coger la llave',gl:'Coller a chave',en:'Take the key'},
 eKey:{es:'Tu llave de derechos',gl:'A túa chave de dereitos',en:'Your key of rights'},
 eKeyNote:{es:'La llave solo se guarda mientras usas la aplicación.',gl:'A chave só se garda mentres usas a aplicación.',en:'The key is only kept while you use the app.'},
 eTime:{es:'Tiempo',gl:'Tempo',en:'Time'},
 // espera
 wName:{es:'Sala de espera mágica',gl:'Sala de espera máxica',en:'Magic waiting room'},
 wDesc:{es:'Tres minutos en la playa o en el bosque, respirando con calma.',gl:'Tres minutos na praia ou no bosque, respirando con calma.',en:'Three minutes at the beach or in the forest, breathing calmly.'},
 wIntro:{es:'Esperar puede ser lo más difícil. Vamos a un sitio bonito a respirar juntos un ratito. ¿Playa o bosque?',gl:'Agardar pode ser o máis difícil. Imos a un sitio bonito respirar xuntos un pouquiño. Praia ou bosque?',en:'Waiting can be the hardest part. Let’s go somewhere nice and breathe together for a bit. Beach or forest?',
  teen:{es:'La espera en la plaza judicial suele ser lo peor. Tres minutos de respiración guiada ayudan a bajar los nervios. Elige dónde quieres estar.',gl:'A espera na praza xudicial adoita ser o peor. Tres minutos de respiración guiada axudan a baixar os nervios. Escolle onde queres estar.',en:'Waiting at court is often the worst part. Three minutes of guided breathing help calm your nerves. Choose where you want to be.'}},
 beach:{es:'Playa',gl:'Praia',en:'Beach'}, beachD:{es:'Olas, arena y sol',gl:'Ondas, area e sol',en:'Waves, sand and sun'},
 forest:{es:'Bosque',gl:'Bosque',en:'Forest'}, forestD:{es:'Árboles, pájaros y luciérnagas',gl:'Árbores, paxaros e vagalumes',en:'Trees, birds and fireflies'},
 wStart:{es:'Empezar (3 minutos)',gl:'Comezar (3 minutos)',en:'Start (3 minutes)'},
 wChange:{es:'Cambiar de lugar',gl:'Cambiar de lugar',en:'Change place'},
 inhale:{es:'Toma aire',gl:'Colle aire',en:'Breathe in'}, hold:{es:'Aguanta',gl:'Aguanta',en:'Hold'}, exhale:{es:'Suelta el aire',gl:'Solta o aire',en:'Breathe out'},
 wGuide:{es:'Mira la bola de luz. Cuando crece, toma aire como si inflaras un globo. Cuando se hace pequeña, sopla despacito, como si apagaras una vela.',gl:'Mira a bóla de luz. Cando crece, colle aire coma se enchises un globo. Cando se fai pequena, sopra amodiño, coma se apagases unha vela.',en:'Look at the ball of light. When it grows, breathe in as if you were blowing up a balloon. When it shrinks, blow out slowly, as if you were blowing out a candle.',
  teen:{es:'Sigue la esfera: inspira 4 segundos, mantén 4 y suelta el aire durante 6. Soltar el aire más despacio de lo que lo tomas calma el cuerpo.',gl:'Segue a esfera: inspira 4 segundos, mantén 4 e solta o aire durante 6. Soltar o aire máis amodo do que o collés calma o corpo.',en:'Follow the sphere: breathe in for 4 seconds, hold for 4 and breathe out for 6. Breathing out more slowly than you breathe in calms your body.'}},
 wLeft:{es:'Quedan',gl:'Quedan',en:'Left'},
 wEnd:{es:'¡Lo has hecho genial! Tu cuerpo ya está más tranquilo. Puedes repetirlo siempre que lo necesites.',gl:'Fixéchelo xenial! O teu corpo xa está máis tranquilo. Podes repetilo sempre que o precises.',en:'You did brilliantly! Your body is calmer now. You can do it again whenever you need to.',teen:{es:'Tres minutos completados. Puedes repetirlo siempre que lo necesites, también mientras esperas en la plaza judicial.',gl:'Tres minutos completados. Podes repetilo sempre que o precises, tamén mentres agardas na praza xudicial.',en:'Three minutes done. You can repeat it whenever you need to, including while you wait at court.'}},
 wAgain:{es:'Repetir',gl:'Repetir',en:'Repeat'},
 // puertas
 dName:{es:'Las puertas',gl:'As portas',en:'The doors'},
 dDesc:{es:'Elige una puerta y descubre dónde pedir ayuda.',gl:'Escolle unha porta e descobre onde pedir axuda.',en:'Choose a door and find out where to get help.'},
 dIntro:{es:'No hace falta que me expliques lo que te pasa. Solo elige la puerta que más se parezca y te enseño a quién pedir ayuda.',gl:'Non fai falta que me expliques o que che pasa. Só escolle a porta que máis se pareza e ensínoche a quen pedir axuda.',en:'You don’t need to explain what’s happening. Just pick the door that fits best and I’ll show you who to ask for help.',
  teen:{es:'Elige la puerta que más se parezca a tu situación. Detrás encontrarás a quién acudir y cómo pedirlo, sin tener que dar explicaciones.',gl:'Escolle a porta que máis se pareza á túa situación. Detrás atoparás a quen acudir e como pedilo, sen ter que dar explicacións.',en:'Pick the door closest to your situation. Behind it you’ll find who to turn to and how to ask, without having to explain anything.'}},
 dWho:{es:'Quién te puede ayudar',gl:'Quen che pode axudar',en:'Who can help you'},
 dSay:{es:'Cómo pedirlo. Puedes decir:',gl:'Como pedilo. Podes dicir:',en:'How to ask. You can say:'},
 dBack:{es:'Volver al pasillo',gl:'Volver ao corredor',en:'Back to the hallway'},
 dCall:{es:'Llamar al',gl:'Chamar ao',en:'Call'},
 dChat:{es:'Hablar con Bubo',gl:'Falar con Bubo',en:'Talk to Bubo'},
 dWait:{es:'Ir a la sala de espera mágica',gl:'Ir á sala de espera máxica',en:'Go to the magic waiting room'},
 dPick:{es:'Elige una puerta',gl:'Escolle unha porta',en:'Choose a door'}
};
const vt = k => L(VT[k]);
Object.assign(IC, {
 vr:'<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-2-3h-2l-2 3H5a2 2 0 0 1-2-2z"/><circle cx="8" cy="11.5" r="1.6"/><circle cx="16" cy="11.5" r="1.6"/>',
 balloon:'<path d="M12 3a6 6 0 0 0-6 6c0 4 3.4 7 6 7s6-3 6-7a6 6 0 0 0-6-6z"/><path d="M11 16.5h2l-1 1.5zM12 18c0 1.5-1.5 2-1 3.5"/>',
 wave:'<path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="12" cy="6" r="2.5"/>',
 door:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18"/><path d="M14.5 12h.01"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 shrink:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'
});

/* ---------- contenidos ---------- */
/* Escape room: un derecho por candado. "teen" = versión 14+. */
const ESC = [
 {id:'oido', e:'👂', icon:'ear', col:['#7FB8FF','#6E9FE3'], station:'mic',
  name:{es:'A ser escuchado',gl:'A ser escoitado',en:'To be heard'},
  q:{es:'Un juez va a decidir con quién vas a vivir. ¿Qué tiene que hacer?',gl:'Un xuíz vai decidir con quen vas vivir. Que ten que facer?',en:'A judge is going to decide who you will live with. What must the judge do?',
   teen:{es:'Tienes 13 años y en el divorcio de tus padres se decide con quién vivirás. ¿Qué dice la ley?',gl:'Tes 13 anos e no divorcio dos teus pais decídese con quen vivirás. Que di a lei?',en:'You are 13 and your parents’ divorce will decide who you live with. What does the law say?'}},
  opts:[{t:{es:'Decidir sin preguntarte nada',gl:'Decidir sen preguntarche nada',en:'Decide without asking you anything',teen:{es:'Solo cuenta la opinión de tus padres',gl:'Só conta a opinión dos teus pais',en:'Only your parents’ opinion counts'}}},
        {ok:1,t:{es:'Escuchar lo que tú piensas',gl:'Escoitar o que ti pensas',en:'Listen to what you think',teen:{es:'Tienes derecho a ser oído y tu opinión debe tenerse en cuenta',gl:'Tes dereito a ser oído e a túa opinión debe terse en conta',en:'You have the right to be heard and your view must be taken into account'}}},
        {t:{es:'Preguntar solo a los adultos',gl:'Preguntarlles só aos adultos',en:'Only ask the adults',teen:{es:'No te escuchan hasta que cumplas 18',gl:'Non te escoitan ata que cumpras 18',en:'They won’t hear you until you turn 18'}}}],
  ex:{es:'Tienes derecho a que te escuchen. Tu opinión cuenta en todo lo que te afecta, y los adultos tienen que tenerla en cuenta.',gl:'Tes dereito a que te escoiten. A túa opinión conta en todo o que che afecta, e os adultos teñen que tela en conta.',en:'You have the right to be listened to. Your opinion counts in everything that affects you, and adults must take it into account.',
   teen:{es:'Derecho a ser oído y escuchado (Convención sobre los Derechos del Niño, art. 12; LO 1/1996, art. 9). Se tiene en cuenta según tu madurez y, desde los 12 años, la ley considera que la tienes.',gl:'Dereito a ser oído e escoitado (Convención sobre os Dereitos do Neno, art. 12; LO 1/1996, art. 9). Tense en conta segundo a túa madurez e, desde os 12 anos, a lei considera que a tes.',en:'Right to be heard (Convention on the Rights of the Child, art. 12; Organic Law 1/1996, art. 9). It depends on your maturity and, from age 12, the law considers you mature enough.'}},
  hint:{es:'Piensa: ¿a quién le va a pasar esto? A ti. ¿No deberían preguntarte?',gl:'Pensa: a quen lle vai pasar isto? A ti. Non deberían preguntarche?',en:'Think: who will this happen to? You. Shouldn’t they ask you?',teen:{es:'Pista: la ley protege el «interés superior del menor», y eso incluye oír su opinión.',gl:'Pista: a lei protexe o «interese superior do menor», e iso inclúe oír a súa opinión.',en:'Hint: the law protects the “best interests of the child”, and that includes hearing their opinion.'}}},
 {id:'acompana', e:'🤝', icon:'users', col:['#7ED6A5','#6CBF9C'], station:'chairs',
  name:{es:'A ir acompañado',gl:'A ir acompañado',en:'To have someone with you'},
  q:{es:'Tienes que ir a la plaza judicial y estás nervioso. ¿Puedes ir con alguien?',gl:'Tes que ir á praza xudicial e estás nervioso. Podes ir con alguén?',en:'You have to go to court and you’re nervous. Can someone go with you?',
   teen:{es:'Vas a declarar como víctima. ¿Quién puede acompañarte?',gl:'Vas declarar como vítima. Quen pode acompañarte?',en:'You are going to give a statement as a victim. Who can go with you?'}},
  opts:[{t:{es:'No, tienes que ir solo',gl:'Non, tes que ir só',en:'No, you have to go alone',teen:{es:'Nadie: la declaración siempre es a solas',gl:'Ninguén: a declaración sempre é a soas',en:'Nobody: statements are always given alone'}}},
        {ok:1,t:{es:'Sí, con una persona de confianza que tú elijas',gl:'Si, cunha persoa de confianza que ti escollas',en:'Yes, with a trusted person you choose',teen:{es:'Una persona que elijas, desde el primer contacto con las autoridades',gl:'Unha persoa que escollas, desde o primeiro contacto coas autoridades',en:'A person of your choice, from your first contact with the authorities'}}},
        {t:{es:'Solo si te deja la persona acusada',gl:'Só se te deixa a persoa acusada',en:'Only if the accused person lets you',teen:{es:'Solo tu abogado o abogada',gl:'Só o teu avogado ou avogada',en:'Only your lawyer'}}}],
  ex:{es:'No tienes que ir solo ni sola. Puedes ir con una persona que elijas y hay oficinas que te ayudan y te lo explican todo gratis.',gl:'Non tes que ir só nin soa. Podes ir cunha persoa que escollas e hai oficinas que che axudan e cho explican todo de balde.',en:'You don’t have to go alone. You can go with a person you choose, and there are offices that help you and explain everything for free.',
   teen:{es:'Estatuto de la Víctima (Ley 4/2015, art. 4): puedes estar acompañado por una persona de tu elección desde el primer contacto con las autoridades. Las Oficinas de Asistencia a las Víctimas te apoyan gratis.',gl:'Estatuto da Vítima (Lei 4/2015, art. 4): podes estar acompañado por unha persoa da túa elección desde o primeiro contacto coas autoridades. As Oficinas de Asistencia ás Vítimas apóiante de balde.',en:'Victims’ Statute (Law 4/2015, art. 4): you can be accompanied by a person of your choice from your first contact with the authorities. Victim Support Offices help you for free.'}},
  hint:{es:'Piensa en esas dos sillas: ¿por qué crees que hay dos y no una?',gl:'Pensa nesas dúas cadeiras: por que cres que hai dúas e non unha?',en:'Think about those two chairs: why do you think there are two and not one?',teen:{es:'Pista: el Estatuto de la Víctima reconoce el derecho a estar acompañado.',gl:'Pista: o Estatuto da Vítima recoñece o dereito a estar acompañado.',en:'Hint: the Victims’ Statute recognises the right to be accompanied.'}}},
 {id:'acusado', e:'🛡️', icon:'shield', col:['#B69CFF','#A08BE3'], station:'screen',
  name:{es:'A no ver al acusado',gl:'A non ver o acusado',en:'Not to see the accused'},
  q:{es:'Te da miedo ver a la persona que te hizo daño. ¿Qué pueden hacer en la plaza judicial?',gl:'Dáche medo ver a persoa que che fixo dano. Que poden facer na praza xudicial?',en:'You’re scared of seeing the person who hurt you. What can the court do?',
   teen:{es:'Eres víctima y no quieres coincidir con la persona acusada. ¿Qué medidas existen?',gl:'Es vítima e non queres coincidir coa persoa acusada. Que medidas existen?',en:'You are a victim and don’t want to run into the accused. What measures exist?'}},
  opts:[{t:{es:'Nada, tienes que verla',gl:'Nada, tes que vela',en:'Nothing, you have to see them',teen:{es:'Ninguna: el juicio es público y hay que estar en la sala',gl:'Ningunha: o xuízo é público e hai que estar na sala',en:'None: the trial is public and you must be in the room'}}},
        {ok:1,t:{es:'Ponerte en otra sala o detrás de un biombo',gl:'Poñerte noutra sala ou detrás dun biombo',en:'Put you in another room or behind a screen',teen:{es:'Evitar el contacto: salas separadas, videoconferencia o mamparas',gl:'Evitar o contacto: salas separadas, videoconferencia ou mamparas',en:'Avoid contact: separate rooms, video link or screens'}}},
        {t:{es:'Decirte que no vengas nunca',gl:'Dicirche que non veñas nunca',en:'Tell you never to come',teen:{es:'Obligar a la persona acusada a irse de la ciudad',gl:'Obrigar a persoa acusada a marchar da cidade',en:'Force the accused to leave the city'}}}],
  ex:{es:'No tienes que ver a quien te hizo daño. Puedes esperar en otra sala y contarlo detrás de un biombo o desde otra habitación, con una cámara.',gl:'Non tes que ver a quen che fixo dano. Podes agardar noutra sala e contalo detrás dun biombo ou desde outra habitación, cunha cámara.',en:'You don’t have to see the person who hurt you. You can wait in another room and tell your story from behind a screen or from another room, on camera.',
   teen:{es:'Ley 4/2015, arts. 20 y 25: debe evitarse el contacto entre víctima y acusado y el contacto visual al declarar (videoconferencia, mamparas). Con menos de 14 años se usa normalmente la prueba preconstituida (LECrim, art. 449 ter).',gl:'Lei 4/2015, arts. 20 e 25: debe evitarse o contacto entre vítima e acusado e o contacto visual ao declarar (videoconferencia, mamparas). Con menos de 14 anos úsase normalmente a proba preconstituída (LECrim, art. 449 ter).',en:'Law 4/2015, arts. 20 and 25: contact between victim and accused, and visual contact while testifying, must be avoided (video link, screens). Under 14, a pre-recorded statement is normally used (LECrim, art. 449 ter).'}},
  hint:{es:'Mira el biombo: ¿para qué sirve algo que tapa?',gl:'Mira o biombo: para que serve algo que tapa?',en:'Look at the screen: what is something that blocks the view for?',teen:{es:'Pista: la ley busca proteger a la víctima durante todo el proceso.',gl:'Pista: a lei busca protexer a vítima durante todo o proceso.',en:'Hint: the law aims to protect the victim throughout the process.'}}},
 {id:'entender', e:'💡', icon:'bulb', col:['#FFB86B','#EBA66E'], station:'board',
  name:{es:'A entenderlo todo',gl:'A entendelo todo',en:'To understand everything'},
  q:{es:'El juez dice una palabra muy rara y no la entiendes. ¿Qué haces?',gl:'O xuíz di unha palabra moi rara e non a entendes. Que fas?',en:'The judge says a very strange word and you don’t understand it. What do you do?',
   teen:{es:'En la citación pone «prueba preconstituida» y no sabes qué significa. ¿Qué derecho tienes?',gl:'Na citación pon «proba preconstituída» e non sabes que significa. Que dereito tes?',en:'Your summons says “pre-recorded statement” and you don’t know what it means. What right do you have?'}},
  opts:[{t:{es:'Me callo y digo que sí',gl:'Calo e digo que si',en:'Stay quiet and say yes',teen:{es:'Ninguno: tienes que buscarlo tú',gl:'Ningún: tes que buscalo ti',en:'None: you have to look it up yourself'}}},
        {t:{es:'Me invento la respuesta',gl:'Invento a resposta',en:'Make up an answer',teen:{es:'Solo a que se lo expliquen a tus padres',gl:'Só a que llelo expliquen aos teus pais',en:'Only for it to be explained to your parents'}}},
        {ok:1,t:{es:'Pido que me lo expliquen con palabras fáciles',gl:'Pido que mo expliquen con palabras doadas',en:'Ask them to explain it in easy words',teen:{es:'A entender y ser entendido: te lo deben explicar de forma clara',gl:'A entender e ser entendido: débencho explicar de forma clara',en:'To understand and be understood: it must be explained clearly'}}}],
  ex:{es:'Tienes derecho a que te lo expliquen todo con palabras que entiendas. Puedes preguntar todas las veces que lo necesites.',gl:'Tes dereito a que cho expliquen todo con palabras que entendas. Podes preguntar todas as veces que o precises.',en:'You have the right to have everything explained in words you understand. You can ask as many times as you need.',
   teen:{es:'Derecho a entender y ser entendido (Ley 4/2015, art. 4; LO 1/1996, art. 9): la información debe darse en un lenguaje claro, sencillo y adaptado a tu edad y madurez.',gl:'Dereito a entender e ser entendido (Lei 4/2015, art. 4; LO 1/1996, art. 9): a información debe darse nunha linguaxe clara, sinxela e adaptada á túa idade e madurez.',en:'Right to understand and be understood (Law 4/2015, art. 4; Organic Law 1/1996, art. 9): information must be given in clear, simple language adapted to your age and maturity.'}},
  hint:{es:'En la pizarra pone «¿?». Cuando algo no se entiende… ¡se pregunta!',gl:'No encerado pon «¿?». Cando algo non se entende… pregúntase!',en:'The board says “?”. When something isn’t clear… you ask!',teen:{es:'Pista: el Estatuto de la Víctima empieza precisamente por este derecho.',gl:'Pista: o Estatuto da Vítima comeza precisamente por este dereito.',en:'Hint: the Victims’ Statute starts with exactly this right.'}}}
];
/* Las puertas: cada una lleva a un recurso. Teléfonos reales y gratuitos. */
const VPH = {'900202010':'900 20 20 10','112':'112','017':'017','016':'016','024':'024'};
const DOORS = [
 {k:'bullying', e:'🏫', icon:'school', col:['#FF9AA2','#E3848F'],
  l:{es:'Me molestan en clase',gl:'Moléstanme na clase',en:'I’m bullied at school'},
  who:{es:'La persona coordinadora de bienestar de tu cole, tu tutor o tutora y tu familia. Y la Fundación ANAR, que te escucha gratis a cualquier hora.',gl:'A persoa coordinadora de benestar do teu colexio, o teu titor ou titora e a túa familia. E a Fundación ANAR, que te escoita de balde a calquera hora.',en:'Your school’s wellbeing coordinator, your form teacher and your family. And the ANAR Foundation, which listens for free at any time.',
   teen:{es:'La persona coordinadora de bienestar y protección del centro, que tiene que activar el protocolo contra el acoso (LOPIVI). También tu tutor o tutora y la Fundación ANAR (gratis y confidencial).',gl:'A persoa coordinadora de benestar e protección do centro, que ten que activar o protocolo contra o acoso (LOPIVI). Tamén o teu titor ou titora e a Fundación ANAR (de balde e confidencial).',en:'Your school’s wellbeing and protection coordinator, who must activate the anti-bullying protocol (LOPIVI). Also your form teacher and the ANAR Foundation (free and confidential).'}},
  say:{es:'«Me están molestando en clase y necesito ayuda para que pare.»',gl:'«Estanme molestando na clase e preciso axuda para que pare.»',en:'“I’m being bullied in class and I need help to make it stop.”'}, ph:['900202010']},
 {k:'home', e:'🏠', icon:'home', col:['#FFB86B','#EBA66E'],
  l:{es:'En casa no estoy bien',gl:'Na casa non estou ben',en:'I’m not OK at home'},
  who:{es:'Un adulto de confianza de fuera de casa: un profe, un familiar o la Fundación ANAR. Si estás en peligro ahora, llama al 112.',gl:'Un adulto de confianza de fóra da casa: un profe, un familiar ou a Fundación ANAR. Se estás en perigo agora, chama ao 112.',en:'A trusted adult outside your home: a teacher, a relative or the ANAR Foundation. If you’re in danger now, call 112.',
   teen:{es:'Un adulto de confianza, la Fundación ANAR o los servicios sociales. La Fiscalía de Menores vela por tu protección y tú mismo puedes comunicar la situación (LOPIVI). Si hay peligro, 112.',gl:'Un adulto de confianza, a Fundación ANAR ou os servizos sociais. A Fiscalía de Menores vela pola túa protección e ti mesmo podes comunicar a situación (LOPIVI). Se hai perigo, 112.',en:'A trusted adult, the ANAR Foundation or social services. The Juvenile Prosecutor’s Office protects you, and you can report the situation yourself (LOPIVI). If there’s danger, 112.'}},
  say:{es:'«En casa pasa algo que no me hace sentir bien y necesito contarlo.»',gl:'«Na casa pasa algo que non me fai sentir ben e preciso contalo.»',en:'“Something is happening at home that doesn’t feel right and I need to tell someone.”'}, ph:['900202010','112']},
 {k:'images', e:'📸', icon:'eye', col:['#B69CFF','#A08BE3'],
  l:{es:'Alguien tiene una foto mía',gl:'Alguén ten unha foto miña',en:'Someone has a photo of me'},
  who:{es:'Cuéntaselo enseguida a un adulto de confianza. No reenvíes la foto y recuerda: no es culpa tuya.',gl:'Cóntallo axiña a un adulto de confianza. Non reenvíes a foto e lembra: non é culpa túa.',en:'Tell a trusted adult straight away. Don’t forward the photo, and remember: it’s not your fault.',
   teen:{es:'Pide la retirada urgente en el Canal Prioritario de la Agencia de Protección de Datos (aepd.es). Difundirla sin permiso es delito (Código Penal, art. 197.7). No la guardes ni la reenvíes: guarda el enlace y el perfil. La línea 017 te orienta.',gl:'Pide a retirada urxente na Canle Prioritaria da Axencia de Protección de Datos (aepd.es). Difundila sen permiso é delito (Código Penal, art. 197.7). Non a gardes nin a reenvíes: garda a ligazón e o perfil. A liña 017 oriéntate.',en:'Request urgent removal through the Data Protection Agency’s Priority Channel (aepd.es). Sharing it without permission is a crime (Criminal Code, art. 197.7). Don’t keep or forward it: save the link and the profile. The 017 helpline can guide you.'}},
  say:{es:'«Alguien tiene una foto mía que no quiero que esté ahí. ¿Me ayudas a quitarla?»',gl:'«Alguén ten unha foto miña que non quero que estea aí. Axúdasme a quitala?»',en:'“Someone has a photo of me that I don’t want out there. Can you help me get it removed?”'}, ph:['017','900202010']},
 {k:'cyber', e:'📱', icon:'mobile', col:['#7FB8FF','#6E9FE3'],
  l:{es:'Me molestan por internet',gl:'Moléstanme por internet',en:'I’m bullied online'},
  who:{es:'No contestes, bloquea a esa persona y enséñaselo a un adulto de confianza. La línea 017 ayuda a familias y a chicos y chicas con problemas en internet.',gl:'Non contestes, bloquea esa persoa e amósallo a un adulto de confianza. A liña 017 axuda a familias e a rapaces e rapazas con problemas en internet.',en:'Don’t reply, block the person and show it to a trusted adult. The 017 helpline helps families and young people with online problems.',
   teen:{es:'Haz capturas con fecha y hora, bloquea y denuncia en la plataforma. Las amenazas, el acoso repetido o la suplantación pueden ser delito y se pueden denunciar. La línea 017 de INCIBE te asesora gratis.',gl:'Fai capturas con data e hora, bloquea e denuncia na plataforma. As ameazas, o acoso repetido ou a suplantación poden ser delito e pódense denunciar. A liña 017 de INCIBE asesórate de balde.',en:'Take screenshots with date and time, block and report on the platform. Threats, repeated harassment or impersonation can be crimes and can be reported. INCIBE’s 017 helpline advises you for free.'}},
  say:{es:'«Me están molestando por internet y no sé cómo pararlo.»',gl:'«Estanme molestando por internet e non sei como paralo.»',en:'“Someone is bothering me online and I don’t know how to stop it.”'}, ph:['017','900202010']},
 {k:'harm', e:'💙', icon:'heart', col:['#FF8FB1','#E88AA6'],
  l:{es:'Alguien me ha hecho daño',gl:'Alguén me fixo dano',en:'Someone has hurt me'},
  who:{es:'No es culpa tuya. Cuéntaselo a un adulto de confianza o llama a ANAR. Si estás en peligro ahora mismo, llama al 112.',gl:'Non é culpa túa. Cóntallo a un adulto de confianza ou chama a ANAR. Se estás en perigo agora mesmo, chama ao 112.',en:'It’s not your fault. Tell a trusted adult or call ANAR. If you’re in danger right now, call 112.',
   teen:{es:'Puedes contarlo tú mismo, sin un adulto (LOPIVI). Las Oficinas de Asistencia a las Víctimas te acompañan gratis y tienes derecho a abogado gratuito. Si hay peligro ahora, 112.',gl:'Podes contalo ti mesmo, sen un adulto (LOPIVI). As Oficinas de Asistencia ás Vítimas acompáñante de balde e tes dereito a avogado gratuíto. Se hai perigo agora, 112.',en:'You can report it yourself, without an adult (LOPIVI). Victim Support Offices accompany you for free and you have the right to a free lawyer. If there’s danger now, 112.'}},
  say:{es:'«Alguien me ha hecho daño y quiero contarlo.»',gl:'«Alguén me fixo dano e quero contalo.»',en:'“Someone has hurt me and I want to tell someone.”'}, ph:['112','900202010']},
 {k:'court', e:'🏛️', icon:'court', col:['#7ED6A5','#6CBF9C'],
  l:{es:'Tengo que ir a un juicio',gl:'Teño que ir a un xuízo',en:'I have to go to a trial'},
  who:{es:'Puedes ir con alguien de confianza y preguntar todo lo que no entiendas. Muchas veces se cuenta una sola vez, en una sala tranquila. La Oficina de Asistencia a las Víctimas te lo explica todo.',gl:'Podes ir con alguén de confianza e preguntar todo o que non entendas. Moitas veces cóntase unha soa vez, nunha sala tranquila. A Oficina de Asistencia ás Vítimas explícacho todo.',en:'You can go with someone you trust and ask about anything you don’t understand. Often you only tell it once, in a calm room. The Victim Support Office explains everything.',
   teen:{es:'Oficina de Asistencia a las Víctimas: te informa y acompaña gratis. Tienes derecho a ir acompañado, a evitar el contacto con la persona acusada y a abogado gratuito si eres víctima de maltrato o abuso.',gl:'Oficina de Asistencia ás Vítimas: infórmate e acompáñate de balde. Tes dereito a ir acompañado, a evitar o contacto coa persoa acusada e a avogado gratuíto se es vítima de maltrato ou abuso.',en:'Victim Support Office: it informs and accompanies you for free. You have the right to be accompanied, to avoid contact with the accused and to a free lawyer if you are a victim of abuse.'}},
  say:{es:'«Tengo que ir a un juicio y quiero saber qué va a pasar.»',gl:'«Teño que ir a un xuízo e quero saber que vai pasar.»',en:'“I have to go to a trial and I want to know what will happen.”'}, ph:['900202010'], wait:true}
];

/* ---------- utilidades ---------- */
/* Estética de cuento: pasteles luminosos para todos; para 14+ un poco más suaves. */
const vpal = () => TEEN() ? ['#E88AA6','#EBA66E','#E2C15A','#6CBF9C','#6E9FE3','#A08BE3','#E3848F','#55B8C3'] : ['#FF8FB1','#FFB86B','#FFD966','#7ED6A5','#7FB8FF','#B69CFF','#FF9AA2','#6ED3CF'];
const vcol = o => TEEN() ? o.col[1] : o.col[0];
const INK = '#3E2F5B';
const lum = h => { const n=parseInt(h.slice(1),16); return (.2126*(n>>16&255)+.7152*(n>>8&255)+.0722*(n&255))/255; };
const ink = bg => lum(bg)>.58 ? INK : '#FFFFFF';
const mix = (a,b,f) => { const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16), c=s=>Math.round(((A>>s)&255)*(1-f)+((B>>s)&255)*f); return '#'+((1<<24)+(c(16)<<16)+(c(8)<<8)+c(0)).toString(16).slice(1); };
const FT = () => TEEN() ? '"Source Sans 3", system-ui, sans-serif' : '"Nunito", system-ui, sans-serif';
const FH = () => TEEN() ? '"Source Sans 3", system-ui, sans-serif' : '"Baloo 2", "Nunito", sans-serif';
const EMOJI_F = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
const later = (fn,ms) => { const id=setTimeout(fn,ms); VR.timers.push(id); return id; };
const every = (fn,ms) => { const id=setInterval(fn,ms); VR.timers.push(id); return id; };
const rnd = (a,b) => a+Math.random()*(b-a);
const fmtT = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function vspeak(text){ if(VR.voice) speak(text); }

/* Las texturas de texto se dibujan en canvas: así se ven bien las tildes, la ñ y las fuentes de la app. */
const TEX = {}; let texN = 0;
const texId = c => { const id='t'+(texN++); TEX[id]=c; return id; };
const IMG = {};
const loadImg = src => new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.onerror=()=>r(null); i.src=src; });
const svgURL = s => 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
async function vrPrep(){
  try{ await Promise.all(['600 40px "Nunito"','800 40px "Nunito"','800 40px "Baloo 2"','400 40px "Source Sans 3"','700 40px "Source Sans 3"'].map(f=>document.fonts.load(f))); }catch(e){}
  for(const e of ['talk','happy','party','listen']) if(!IMG[e]) IMG[e]=await loadImg(svgURL(bubo(e,256)));
}
async function iconImg(name,color){
  const k='i_'+name+color; if(!IMG[k]) IMG[k]=await loadImg(svgURL(`<svg width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${IC[name]||''}</svg>`));
  return IMG[k];
}
function cv(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function rrect(x,X,Y,W,H,r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+W,Y,X+W,Y+H,r); x.arcTo(X+W,Y+H,X,Y+H,r); x.arcTo(X,Y+H,X,Y,r); x.arcTo(X,Y,X+W,Y,r); x.closePath(); }
function star(x,cx,cy,r,col){ x.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.45:r; x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr); } x.closePath(); x.fillStyle=col; x.fill(); }
function wrap(x,text,maxW){
  const out=[];
  String(text).split('\n').forEach(par=>{ let line=''; par.split(' ').forEach(w=>{ const tryL=line?line+' '+w:w; if(x.measureText(tryL).width>maxW && line){ out.push(line); line=w; } else line=tryL; }); out.push(line); });
  return out;
}
/* Panel de cuento: fondo crema, borde de color, cabecera, Bubo (opcional), título y texto. */
function panelCanvas(o){
  const W=1000, pad=46, teen=TEEN(), img=o.expr?IMG[o.expr]:null, imgS=img?(teen?150:190):0, color=o.color||vpal()[4];
  const c=cv(W,10); let x=c.getContext('2d');
  const bodyF=`${teen?400:600} ${o.small?32:37}px ${FT()}`, lh=o.small?44:51, titleF=`800 ${teen?50:58}px ${FH()}`;
  const textX=pad+(img?imgS+28:0), maxW=W-textX-pad;
  x.font=titleF; const tLines=o.title?wrap(x,o.title,maxW):[];
  x.font=bodyF; const lines=o.body?wrap(x,o.body,maxW):[];
  const headH=o.head?74:0, tH=tLines.length*(teen?58:64);
  const H=Math.max(headH+pad*2+tH+(tLines.length&&lines.length?14:0)+lines.length*lh, headH+pad*2+imgS);
  c.height=H; x=c.getContext('2d');
  rrect(x,4,4,W-8,H-8,40); x.fillStyle='#FFFDF8'; x.fill(); x.lineWidth=8; x.strokeStyle=color; x.stroke();
  x.save(); rrect(x,4,4,W-8,H-8,40); x.clip(); [[W-40,H-30],[60,H-24],[W-90,headH+30]].forEach(([a,b],i)=>star(x,a,b,i?10:14,mix(color,'#FFFFFF',.35))); x.restore();
  if(o.head){ x.save(); rrect(x,4,4,W-8,H-8,40); x.clip(); x.fillStyle=color; x.fillRect(0,0,W,headH); x.restore();
    x.fillStyle=ink(color); x.font=`800 34px ${FT()}`; x.textBaseline='middle'; x.fillText(o.head,pad,headH/2+2); }
  if(img) x.drawImage(img,pad-6,headH+pad-8,imgS,imgS);
  let y=headH+pad; x.textBaseline='top';
  x.font=titleF; x.fillStyle=mix(color,INK,.55); tLines.forEach(l=>{ x.fillText(l,textX,y); y+=teen?58:64; });
  if(tLines.length&&lines.length) y+=14;
  x.font=bodyF; x.fillStyle='#2F2A40'; lines.forEach(l=>{ x.fillText(l,textX,y); y+=lh; });
  return c;
}
function btnCanvas(label,bg){
  const W=760,H=150,c=cv(W,H),x=c.getContext('2d');
  rrect(x,6,10,W-12,H-16,64); x.fillStyle=mix(bg,INK,.25); x.fill();
  rrect(x,6,4,W-12,H-20,64); x.fillStyle=bg; x.fill();
  x.fillStyle='rgba(255,255,255,.35)'; rrect(x,40,14,W-80,22,11); x.fill();
  let s=54; x.font=`800 ${s}px ${FH()}`; while(x.measureText(label).width>W-80&&s>26){ s-=2; x.font=`800 ${s}px ${FH()}`; }
  x.fillStyle=ink(bg); x.textAlign='center'; x.textBaseline='middle'; x.fillText(label,W/2,H/2-2); return c;
}
function optCanvas(text,color,state){
  const W=1000,H=170,c=cv(W,H),x=c.getContext('2d');
  rrect(x,5,5,W-10,H-10,40); x.fillStyle=state==='bad'?'#FFE8EC':state==='ok'?'#E3F7EC':'#FFFDF8'; x.fill();
  x.lineWidth=6; x.strokeStyle=state==='bad'?'#E5737F':state==='ok'?'#5CC48F':color; x.stroke();
  star(x,58,H/2,24,state==='bad'?'#E5737F':state==='ok'?'#5CC48F':color);
  x.font=`${TEEN()?600:700} 38px ${FT()}`; x.fillStyle='#2F2A40'; x.textBaseline='middle';
  const lines=wrap(x,text,W-140).slice(0,2); lines.forEach((l,i)=>x.fillText(l,100,H/2+(i-(lines.length-1)/2)*46));
  return c;
}
function labelCanvas(text,opts={}){
  const W=opts.w||600,H=opts.h||240,c=cv(W,H),x=c.getContext('2d');
  let s=opts.size||64; x.font=`800 ${s}px ${FH()}`;
  let lines=wrap(x,text,W-40); while((lines.length*s*1.1>H-20 || lines.some(l=>x.measureText(l).width>W-30)) && s>26){ s-=3; x.font=`800 ${s}px ${FH()}`; lines=wrap(x,text,W-40); }
  x.textAlign='center'; x.textBaseline='middle'; x.lineJoin='round';
  lines.forEach((l,i)=>{ const y=H/2+(i-(lines.length-1)/2)*s*1.08;
    if(opts.stroke!==false){ x.lineWidth=Math.max(6,s/6); x.strokeStyle=opts.strokeColor||'rgba(62,47,91,.8)'; x.strokeText(l,W/2,y); }
    x.fillStyle=opts.color||'#FFFFFF'; x.fillText(l,W/2,y); });
  return c;
}
function emojiCanvas(e,size=200){ const c=cv(size,size),x=c.getContext('2d'); x.font=`${size*.78}px ${EMOJI_F}`; x.textAlign='center'; x.textBaseline='middle'; x.fillText(e,size/2,size/2+size*.05); return c; }
function imgCanvas(img,size=256){ const c=cv(size,size); if(img) c.getContext('2d').drawImage(img,0,0,size,size); return c; }
/* Texturas de cuento */
function skyTex(stops){ const c=cv(8,512),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512); stops.forEach(([p,col])=>g.addColorStop(p,col)); x.fillStyle=g; x.fillRect(0,0,8,512); return texId(c); }
function tiles(a,b,n=8){ const c=cv(256,256),x=c.getContext('2d'),s=256/n; for(let i=0;i<n;i++) for(let j=0;j<n;j++){ x.fillStyle=(i+j)%2?a:b; x.fillRect(i*s,j*s,s,s); } return c; }
function cobbles(base,stones){ const c=cv(256,256),x=c.getContext('2d'); x.fillStyle=base; x.fillRect(0,0,256,256);
  for(let j=0;j<4;j++) for(let i=0;i<4;i++){ const off=j%2?32:0; rrect(x,(i*64+off)%256+5,j*64+5,54,54,18); x.fillStyle=stones[(i+j)%stones.length]; x.fill(); } return c; }
function wallpaper(bg,dot,gold){ const c=cv(256,256),x=c.getContext('2d'); x.fillStyle=bg; x.fillRect(0,0,256,256);
  for(let j=0;j<4;j++) for(let i=0;i<4;i++){ const px=i*64+(j%2?32:0)+16, py=j*64+16; if((i+j)%2) star(x,px,py,9,gold); else { x.beginPath(); x.arc(px,py,5,0,7); x.fillStyle=dot; x.fill(); } } return c; }
function planks(a,b){ const c=cv(256,256),x=c.getContext('2d'); for(let i=0;i<4;i++){ x.fillStyle=i%2?a:b; x.fillRect(i*64,0,64,256); x.fillStyle='rgba(120,80,40,.18)'; x.fillRect(i*64,0,3,256); x.fillRect(i*64,(i*97)%256,64,3); } return c; }
function gardenCanvas(){ const c=cv(512,820),x=c.getContext('2d'), g=x.createLinearGradient(0,0,0,820); g.addColorStop(0,'#8FD3FF'); g.addColorStop(.6,'#E6F6FF'); g.addColorStop(.6,'#9BE09B'); g.addColorStop(1,'#6CC47A'); x.fillStyle=g; x.fillRect(0,0,512,820);
  ['#FF9AA2','#FFB86B','#FFE066','#9BE09B','#7FB8FF','#B69CFF'].forEach((col,i)=>{ x.beginPath(); x.lineWidth=22; x.strokeStyle=col; x.arc(256,520,330-i*22,Math.PI,0); x.stroke(); });
  x.beginPath(); x.arc(400,120,50,0,7); x.fillStyle='#FFE08A'; x.fill();
  x.fillStyle='#86D18F'; x.beginPath(); x.ellipse(120,520,260,90,0,0,7); x.fill(); x.fillStyle='#74C77F'; x.beginPath(); x.ellipse(420,540,260,100,0,0,7); x.fill();
  for(let i=0;i<26;i++){ x.beginPath(); x.arc(20+Math.random()*472,560+Math.random()*240,8,0,7); x.fillStyle=['#FF8FB1','#FFE066','#FFFFFF','#B69CFF'][i%4]; x.fill(); } return c; }

/* ---------- sonidos (sintetizados, sin archivos) ---------- */
let AC=null;
function ac(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(AC.state==='suspended') AC.resume(); return AC; }
function tone(f,dur,type='sine',vol=.18,when=0,slide){
  const a=ac(); if(!a) return; const t0=a.currentTime+when, o=a.createOscillator(), g=a.createGain();
  o.type=type; o.frequency.setValueAtTime(f,t0); if(slide) o.frequency.exponentialRampToValueAtTime(slide,t0+dur);
  g.gain.setValueAtTime(.0001,t0); g.gain.exponentialRampToValueAtTime(vol,t0+.015); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g).connect(a.destination); o.start(t0); o.stop(t0+dur+.05);
}
function noiseBuf(a,sec,brown){ const b=a.createBuffer(1,a.sampleRate*sec,a.sampleRate), d=b.getChannelData(0); let last=0;
  for(let i=0;i<d.length;i++){ const w=Math.random()*2-1; if(brown){ last=(last+.02*w)/1.02; d[i]=last*3.5; } else d[i]=w; } return b; }
const SFX = {
  pop(){ const a=ac(); if(!a) return; const s=a.createBufferSource(); s.buffer=noiseBuf(a,.18); const f=a.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1400; f.Q.value=.7; const g=a.createGain(); const t0=a.currentTime;
    g.gain.setValueAtTime(.9,t0); g.gain.exponentialRampToValueAtTime(.001,t0+.16); s.connect(f).connect(g).connect(a.destination); s.start(); tone(880,.25,'sine',.08,.05,1320); },
  ok(){ tone(660,.16,'triangle',.2); tone(990,.32,'triangle',.18,.12); },
  no(){ tone(392,.18,'sine',.12); tone(330,.3,'sine',.12,.15); },
  unlock(){ [1047,1319,1568].forEach((f,i)=>tone(f,.3,'sine',.1,i*.08)); },
  fanfare(){ [523,659,784,1047].forEach((f,i)=>tone(f,.45,'triangle',.16,i*.15)); [1568,2093].forEach((f,i)=>tone(f,.9,'sine',.07,.6+i*.1)); },
  chime(){ [1319,1568,2093].forEach((f,i)=>tone(f,.9,'sine',.05,i*.09)); },
  door(){ [523,659,784].forEach((f,i)=>tone(f,.5,'sine',.08,i*.1)); }
};
function ambient(kind){
  const a=ac(); if(!a) return; const s=a.createBufferSource(); s.buffer=noiseBuf(a,5,true); s.loop=true;
  const f=a.createBiquadFilter(); f.type='lowpass'; f.frequency.value=kind==='beach'?900:500; const g=a.createGain(); g.gain.value=kind==='beach'?.13:.05;
  s.connect(f).connect(g).connect(a.destination); s.start();
  if(kind==='beach'){ const l=a.createOscillator(), lg=a.createGain(); l.frequency.value=.12; lg.gain.value=.11; l.connect(lg).connect(g.gain); l.start(); }
  else every(()=>{ if(Math.random()<.7){ const f0=rnd(2200,3400); tone(f0,.09,'sine',.035,0,f0*1.3); tone(f0*1.1,.09,'sine',.03,.13,f0*1.4); } },2600);
}
function stopAudio(){ if(AC){ try{ AC.close(); }catch(e){} AC=null; } }

/* ---------- carga de A-Frame y componentes ---------- */
let vrLoading=null;
function loadAframe(){
  if(window.AFRAME) return Promise.resolve();
  if(!vrLoading) vrLoading=new Promise((ok,ko)=>{ const s=document.createElement('script'); s.src=AFRAME_URL; s.onload=()=>{ registerVR(); ok(); }; s.onerror=()=>{ vrLoading=null; s.remove(); ko(); }; document.head.appendChild(s); });
  return vrLoading;
}
function registerVR(){
  const THREE=AFRAME.THREE;
  AFRAME.registerComponent('canvas-tex',{schema:{id:{type:'string'},repeat:{type:'vec2',default:{x:1,y:1}}},
    update(){ const apply=()=>{ const m=this.el.getObject3D('mesh'), c=TEX[this.data.id]; if(!m||!c) return; const tx=new THREE.CanvasTexture(c);
        tx.colorSpace=THREE.SRGBColorSpace; tx.anisotropy=4; if(this.data.repeat.x!==1||this.data.repeat.y!==1){ tx.wrapS=tx.wrapT=THREE.RepeatWrapping; tx.repeat.set(this.data.repeat.x,this.data.repeat.y); }
        if(m.material.map) m.material.map.dispose(); m.material.map=tx; m.material.color&&m.material.color.set('#ffffff'); m.material.needsUpdate=true; this.tex=tx; };
      if(this.el.hasLoaded) apply(); else this.el.addEventListener('loaded',apply,{once:true}); },
    refresh(){ if(this.tex) this.tex.needsUpdate=true; }});
  AFRAME.registerComponent('face-camera',{init(){ this.v=new THREE.Vector3(); this.w=new THREE.Vector3(); },
    tick(){ const cam=this.el.sceneEl.camera; if(!cam) return; cam.getWorldPosition(this.v); this.el.object3D.getWorldPosition(this.w); this.v.y=this.w.y; this.el.object3D.lookAt(this.v); }});
  AFRAME.registerComponent('hoverable',{init(){ const o=this.el.object3D; this.el.addEventListener('mouseenter',()=>{ if(!this.s) this.s=o.scale.clone(); o.scale.copy(this.s).multiplyScalar(1.1); });
    this.el.addEventListener('mouseleave',()=>{ if(this.s) o.scale.copy(this.s); }); }});
  AFRAME.registerComponent('waves',{schema:{amp:{default:.12},speed:{default:.7}},init(){ this.n=0; },
    tick(t){ const m=this.el.getObject3D('mesh'); if(!m) return; const p=m.geometry.attributes.position; if(!this.base) this.base=Float32Array.from(p.array);
      const k=t/1000*this.data.speed, A=this.data.amp; for(let i=0;i<p.count;i++){ const X=this.base[i*3], Y=this.base[i*3+1]; p.array[i*3+2]=Math.sin(X*.35+k)*A+Math.cos(Y*.45+k*1.3)*A*.6; }
      p.needsUpdate=true; if(++this.n%3===0) m.geometry.computeVertexNormals(); }});
}
function ent(tag,attrs={},parent){ const e=document.createElement(tag); for(const k in attrs){ if(k==='class') e.className=attrs[k]; else e.setAttribute(k,attrs[k]); } if(parent) parent.appendChild(e); return e; }
function mkPlane(parent,c,w,attrs={}){ return ent('a-plane',Object.assign({width:w,height:(w*c.height/c.width).toFixed(4),material:'shader: flat; transparent: true; side: double; alphaTest: 0.01','canvas-tex':'id: '+texId(c)},attrs),parent); }
function onPick(el,fn){ let last=0; el.addEventListener('click',e=>{ e.stopPropagation(); const n=Date.now(); if(n-last<700) return; last=n; fn(e); }); }
function mkButton(parent,label,color,pos,fn,w=.95){ const b=mkPlane(parent,btnCanvas(label,color),w,{position:pos,class:'clickable',hoverable:''}); onPick(b,fn); return b; }

/* Ratón y dedo: un toque o clic corto elige el objeto; arrastrar mueve la vista (con el dedo, también arriba y abajo).
   Se hace a mano, con un rayo desde la cámara, para que funcione igual en ordenador, móvil y tablet. */
function setupPointer(sc){
  const THREE=AFRAME.THREE, rc=new THREE.Raycaster(), v=new THREE.Vector2(), canvas=sc.canvas, look=sc.querySelector('#vrCam').components['look-controls'];
  let down=null, hov=null, lastMove=0;
  canvas.style.touchAction='none'; canvas.style.cursor='grab';
  const shown=o=>{ while(o){ if(!o.visible) return false; o=o.parent; } return true; };
  const pick=(cx,cy)=>{ const r=canvas.getBoundingClientRect(); v.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1); rc.setFromCamera(v,sc.camera); rc.far=80;
    const els=[...sc.querySelectorAll('.clickable')].filter(e=>e.object3D&&shown(e.object3D));
    for(const h of rc.intersectObjects(els.map(e=>e.object3D),true)){ if(!shown(h.object)) continue; let e=h.object.el;
      while(e&&e!==sc&&!(e.classList&&e.classList.contains('clickable'))) e=e.parentElement; if(e&&e!==sc) return e; }
    return null; };
  /* solo con gafas (sesión WebXR) se elige con la mirada; en pantalla completa normal se sigue tocando y haciendo clic */
  canvas.addEventListener('pointerdown',e=>{ if(xrOn(sc)) return; down={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,t:Date.now(),id:e.pointerId,touch:e.pointerType!=='mouse'};
    if(down.touch) try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
  canvas.addEventListener('pointermove',e=>{
    if(down&&down.touch&&e.pointerId===down.id&&look){ const dx=e.clientX-down.lx, dy=e.clientY-down.ly; down.lx=e.clientX; down.ly=e.clientY;
      look.yawObject.rotation.y+=dx/canvas.clientWidth*Math.PI; look.pitchObject.rotation.x=Math.max(-1.2,Math.min(1.2,look.pitchObject.rotation.x+dy/canvas.clientHeight*Math.PI*.8)); return; }
    if(e.pointerType!=='mouse'||(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>10)) return;
    const n=performance.now(); if(n-lastMove<60) return; lastMove=n;
    const el=pick(e.clientX,e.clientY); if(el!==hov){ if(hov) hov.emit('mouseleave',null,false); if(el) el.emit('mouseenter',null,false); hov=el; } canvas.style.cursor=el?'pointer':'grab'; });
  canvas.addEventListener('pointerup',e=>{ if(!down||e.pointerId!==down.id) return; const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y), dt=Date.now()-down.t; down=null;
    if(moved<14&&dt<800){ const el=pick(e.clientX,e.clientY); if(el){ el.emit('mouseenter',null,false); setTimeout(()=>el.emit('mouseleave',null,false),180); el.emit('click',{pointer:true},false); } } });
  canvas.addEventListener('pointercancel',()=>{ down=null; });
  canvas.addEventListener('pointerleave',e=>{ if(e.pointerType==='mouse'&&hov){ hov.emit('mouseleave',null,false); hov=null; } });
}
const CAM = {x:0,y:1.6,z:0};
function toward(p,dist,dy=0){ const dx=p.x-CAM.x, dy0=p.y-CAM.y, dz=p.z-CAM.z, l=Math.hypot(dx,dy0,dz)||1; return {x:CAM.x+dx/l*dist, y:CAM.y+dy0/l*dist+dy, z:CAM.z+dz/l*dist}; }
/* mientras hay un panel abierto, el contador de arriba se esconde para no taparlo */
function closePanel(){ if(VR.panel){ VR.panel.remove(); VR.panel=null; } if(hudEl) hudEl.setAttribute('visible',true); }
/* Panel flotante con botones debajo, siempre mirando a quien juega. */
function openPanel(pos,c,btns=[],w=1.8){
  closePanel();
  /* en un móvil en vertical el panel se aleja lo justo para que quepa entero en la pantalla */
  const cam=VR.world&&VR.world.sceneEl&&VR.world.sceneEl.camera;
  if(cam&&cam.aspect){ const hf=2*Math.atan(Math.tan(cam.fov*Math.PI/360)*cam.aspect), need=(w/2+.15)/Math.tan(hf/2), d=Math.hypot(pos.x-CAM.x,pos.y-CAM.y,pos.z-CAM.z)||1;
    if(need>d){ const k=need/d; pos={x:CAM.x+(pos.x-CAM.x)*k,y:CAM.y+(pos.y-CAM.y)*k,z:CAM.z+(pos.z-CAM.z)*k}; } }
  const g=ent('a-entity',{position:`${pos.x} ${pos.y} ${pos.z}`,'face-camera':'',scale:'0.01 0.01 0.01',animation:'property: scale; to: 1 1 1; dur: 340; easing: easeOutBack'},VR.world);
  const h=w*c.height/c.width; mkPlane(g,c,w,{class:'clickable'});
  let y=-h/2-.17; btns.forEach(b=>{ if(b.canvas){ const bh=(b.w||w)*b.canvas.height/b.canvas.width; y-=bh/2-.08; const el=mkPlane(g,b.canvas,b.w||w,{position:`0 ${y.toFixed(3)} 0.01`,class:'clickable',hoverable:''}); onPick(el,()=>b.on(el)); y-=bh/2+.06; }
    else { mkButton(g,b.label,b.color,`0 ${y.toFixed(3)} 0.01`,b.on,b.w||.95); y-=.27; } });
  later(()=>{ if(g.object3D&&g.object3D.scale.x<1){ g.removeAttribute('animation'); g.object3D.scale.set(1,1,1); } },700);
  if(hudEl) hudEl.setAttribute('visible',false);
  VR.panel=g; return g;
}
function buboPlane(parent,expr,size,pos){ return mkPlane(parent,imgCanvas(IMG[expr]),size,{position:pos,'face-camera':''}); }

/* ---------- piezas de cuento ---------- */
function cloud(parent,x,y,z,s=1,drift){ const c=ent('a-entity',{position:`${x} ${y} ${z}`,scale:`${s} ${s} ${s}`},parent);
  [[0,0,1.6],[1.4,.25,1.25],[-1.4,.15,1.2],[.5,.85,1.15],[-.6,.7,1]].forEach(([a,b,r])=>ent('a-sphere',{radius:r,position:`${a} ${b} 0`,'segments-width':'16','segments-height':'12',material:'color: #FFFFFF; shader: flat; opacity: 0.96; transparent: true'},c));
  if(drift) c.setAttribute('animation',`property: position; dir: alternate; loop: true; dur: ${drift}; to: ${x+5} ${y} ${z}; easing: easeInOutSine`); return c; }
function sparkles(parent,n,cx,cy,cz,spread,colors){ for(let i=0;i<n;i++){ const x=cx+rnd(-spread,spread), y=cy+rnd(-spread*.3,spread*.5), z=cz+rnd(-spread,spread);
  if((parent===VR.world||/^vr(Hall|Room)$/.test(parent.id))&&Math.hypot(x-CAM.x,z-CAM.z)<1.6) continue; /* nunca pegadas a la cara */
  ent('a-octahedron',{radius:rnd(.03,.07).toFixed(3),position:`${x.toFixed(2)} ${Math.max(.3,y).toFixed(2)} ${z.toFixed(2)}`,material:`color: ${colors[i%colors.length]}; shader: flat`,
    animation:`property: scale; from: 0.15 0.15 0.15; to: 1.3 1.3 1.3; dir: alternate; loop: true; dur: ${(700+Math.random()*1200)|0}; easing: easeInOutSine`,
    animation__r:`property: rotation; to: 0 360 0; loop: true; dur: ${(3000+Math.random()*3000)|0}; easing: linear`},parent); } }
function lolliTree(parent,x,z,h,col){ const g=ent('a-entity',{position:`${x.toFixed(2)} 0 ${z.toFixed(2)}`},parent);
  ent('a-cylinder',{radius:'0.13',height:h.toFixed(2),position:`0 ${(h/2).toFixed(2)} 0`,material:'color: #C99A6B'},g);
  ent('a-sphere',{radius:(h*.55).toFixed(2),position:`0 ${(h*1.4).toFixed(2)} 0`,material:`color: ${col}; roughness: 0.85`},g);
  ent('a-sphere',{radius:(h*.3).toFixed(2),position:`${(h*.35).toFixed(2)} ${(h*1.15).toFixed(2)} ${(h*.25).toFixed(2)}`,material:`color: ${col}; roughness: 0.85`},g); return g; }
function flower(parent,x,z,col,s=1){ const g=ent('a-entity',{position:`${x.toFixed(2)} 0 ${z.toFixed(2)}`,scale:`${s} ${s} ${s}`},parent);
  ent('a-cylinder',{radius:'0.015',height:'0.34',position:'0 0.17 0',material:'color: #6CBF6C'},g);
  [[.06,0],[-.06,0],[0,.06],[0,-.06]].forEach(([a,b])=>ent('a-sphere',{radius:'0.055',position:`${a} 0.36 ${b}`,material:`color: ${col}; shader: flat`},g));
  ent('a-sphere',{radius:'0.045',position:'0 0.37 0',material:'color: #FFE066; shader: flat'},g); return g; }
function mushroom(parent,x,z,s=1){ const g=ent('a-entity',{position:`${x.toFixed(2)} 0 ${z.toFixed(2)}`,scale:`${s} ${s} ${s}`},parent);
  ent('a-cylinder',{radius:'0.08',height:'0.3',position:'0 0.15 0',material:'color: #FFF4E0'},g);
  ent('a-sphere',{radius:'0.24','theta-length':'90',position:'0 0.26 0',material:'color: #FF7A8A; side: double'},g);
  [[.1,.42,.12],[-.12,.41,.06],[0,.49,-.02],[.04,.42,-.15]].forEach(([a,b,c])=>ent('a-sphere',{radius:'0.035',position:`${a} ${b} ${c}`,material:'color: #FFFFFF; shader: flat'},g)); return g; }
function castle(parent,x,z,s,c){ const g=ent('a-entity',{position:`${x} 0 ${z}`,scale:`${s} ${s} ${s}`},parent);
  ent('a-box',{width:'6',height:'4',depth:'3',position:'0 2 0',material:`color: ${c.wall}`},g);
  for(let i=0;i<6;i++) ent('a-box',{width:'0.6',height:'0.5',depth:'3',position:`${-2.5+i} 4.25 0`,material:`color: ${c.wall}`},g);
  [[-3.2,6],[3.2,6],[-1.3,7.6],[1.3,7.1]].forEach(([tx,h],i)=>{ ent('a-cylinder',{radius:'0.85',height:h,position:`${tx} ${h/2} 0.4`,material:`color: ${c.wall}`},g);
    ent('a-cone',{'radius-bottom':'1.05','radius-top':'0',height:'2.3',position:`${tx} ${h+1.15} 0.4`,material:`color: ${i%2?c.roof2:c.roof}`},g);
    ent('a-cylinder',{radius:'0.03',height:'0.9',position:`${tx} ${h+2.7} 0.4`,material:'color: #E2B13C'},g);
    ent('a-plane',{width:'0.6',height:'0.34',position:`${tx+.3} ${h+2.95} 0.4`,material:`color: ${c.flag}; side: double`,animation:`property: rotation; dir: alternate; loop: true; dur: 900; from: 0 -15 0; to: 0 15 0; easing: easeInOutSine`},g);
    ent('a-plane',{width:'0.34',height:'0.55',position:`${tx} ${(h*.62).toFixed(2)} 1.26`,material:'color: #FFE9A8; shader: flat'},g); });
  ent('a-plane',{width:'1.4',height:'1.4',position:'0 0.7 1.51',material:'color: #D99A6C'},g);
  ent('a-circle',{radius:'0.7','theta-length':'180',position:'0 1.4 1.51',material:'color: #D99A6C'},g);
  [[-1.8,2.3],[1.8,2.3]].forEach(([wx,wy])=>ent('a-circle',{radius:'0.35',position:`${wx} ${wy} 1.51`,material:'color: #FFE9A8; shader: flat'},g)); return g; }
function rainbow(parent,x,y,z,r){ const g=ent('a-entity',{position:`${x} ${y} ${z}`},parent);
  ['#FF9AA2','#FFB86B','#FFE066','#9BE09B','#7FB8FF','#B69CFF'].forEach((col,i)=>ent('a-torus',{radius:(r-i*.6).toFixed(2),'radius-tubular':'0.3',arc:'180','segments-tubular':'48','segments-radial':'8',material:`color: ${col}; shader: flat; opacity: 0.8; transparent: true`},g)); return g; }
function fairyLights(parent,points,colors){ points.forEach(([x,y,z],i)=>ent('a-sphere',{radius:'0.045',position:`${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`,material:`color: ${colors[i%colors.length]}; shader: flat; transparent: true; opacity: 1`,
  animation:`property: material.opacity; from: 1; to: 0.35; dir: alternate; loop: true; dur: ${(600+(i*137)%900)|0}; easing: easeInOutSine`},parent)); }
function butterfly(parent,cx,cy,cz,r,col,dur){ const pv=ent('a-entity',{position:`${cx} ${cy} ${cz}`,animation:`property: rotation; to: 0 360 0; loop: true; dur: ${dur}; easing: linear`},parent);
  const b=ent('a-entity',{position:`${r} 0 0`,rotation:'0 0 0',animation:`property: position; dir: alternate; loop: true; dur: 1300; to: ${r} 0.4 0; easing: easeInOutSine`},pv);
  [-1,1].forEach(sd=>ent('a-circle',{radius:'0.09',position:`0 0 ${sd*.08}`,rotation:`${sd*30} 90 0`,material:`color: ${col}; shader: flat; side: double`,animation:`property: rotation; dir: alternate; loop: true; dur: 220; from: ${sd*30} 90 0; to: ${-sd*40} 90 0`},b)); }
function lights(sky='#FFFFFF',ground='#E8D2B0',sun=.7){ ent('a-entity',{light:`type: hemisphere; color: ${sky}; groundColor: ${ground}; intensity: 1`},VR.world); ent('a-entity',{light:`type: directional; color: #FFF6E8; intensity: ${sun}`,position:'3 8 4'},VR.world); }

/* ---------- escena común ---------- */
function sceneHTML(){
  return `<div class="vrwrap"><a-scene embedded vr-mode-ui="enabled: true" loading-screen="enabled: false" renderer="antialias: true" device-orientation-permission-ui="enabled: true">
   <a-entity id="vrCam" camera look-controls="pointerLockEnabled: false; magicWindowTrackingEnabled: true; touchEnabled: false" wasd-controls="enabled: false" position="0 1.6 0">
    <a-entity id="vrGaze" cursor="fuse: true; fuseTimeout: 1400" raycaster="objects: .clickable; far: 40; enabled: false" position="0 0 -0.9" visible="false"
      geometry="primitive: ring; radiusInner: 0.013; radiusOuter: 0.021" material="color: #FFFFFF; shader: flat; opacity: 0.95; transparent: true"
      animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1400; from: 1 1 1; to: 0.2 0.2 0.2"
      animation__leave="property: scale; startEvents: mouseleave; dur: 200; to: 1 1 1"></a-entity>
   </a-entity>
   <a-entity id="vrWorld"></a-entity>
  </a-scene>
  <div class="vrtools">
   <button class="vrtb" id="vrFsBtn" onclick="vrFull()">${ic('expand')} <span>${vt('fsOn')}</span></button>
   <span class="vrfsonly"><button class="vrtb sos" onclick="vrFsSos()">${ic('phone')} 112</button><button class="vrtb" onclick="quickExit()">${ic('exit')} <span>${t('exit')}</span></button></span>
  </div></div>`;
}
const xrOn = sc => !!(sc&&sc.renderer&&sc.renderer.xr&&sc.renderer.xr.isPresenting);
/* Pantalla completa propia: la escena ocupa toda la pantalla y se sigue tocando con el dedo o el ratón.
   Si el navegador no deja (iPhone), se simula con CSS. */
function vrFull(force){
  const w=document.querySelector('.vrwrap'); if(!w) return;
  const on=w.classList.contains('vrfull'), want=force===undefined?!on:force;
  if(want===on) return;
  if(want){ w.classList.add('vrfull'); document.body.classList.add('vrlock');
    const req=w.requestFullscreen||w.webkitRequestFullscreen;
    if(req) try{ const p=req.call(w); w.dataset.native='1'; if(p&&p.catch) p.catch(()=>{ w.dataset.native=''; }); }catch(e){ w.dataset.native=''; } }
  else { w.classList.remove('vrfull'); document.body.classList.remove('vrlock');
    if(document.fullscreenElement||document.webkitFullscreenElement){ const ex=document.exitFullscreen||document.webkitExitFullscreen; try{ const p=ex.call(document); if(p&&p.catch) p.catch(()=>{}); }catch(e){} } w.dataset.native=''; }
  const b=document.getElementById('vrFsBtn'); if(b) b.innerHTML=`${ic(want?'shrink':'expand')} <span>${vt(want?'fsOff':'fsOn')}</span>`;
  [60,300].forEach(ms=>setTimeout(()=>window.dispatchEvent(new Event('resize')),ms));
}
function vrFsSos(){ vrFull(false); openSos(); }
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{ const w=document.querySelector('.vrwrap');
  if(w&&w.classList.contains('vrfull')&&w.dataset.native==='1'&&!(document.fullscreenElement||document.webkitFullscreenElement)) vrFull(false); }));
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&document.querySelector('.vrwrap.vrfull')) vrFull(false); });
let hudEl=null, hudC=null;
function hud(text){ const cam=document.getElementById('vrCam'); if(!cam) return;
  if(!hudEl){ hudC=cv(640,96); hudEl=mkPlane(cam,hudC,.42,{position:'0 0.33 -1',material:'shader: flat; transparent: true; depthTest: false'}); hudEl.object3D.renderOrder=10; }
  const x=hudC.getContext('2d'); x.clearRect(0,0,640,96); rrect(x,4,4,632,88,44); x.fillStyle='rgba(255,253,248,.92)'; x.fill(); x.lineWidth=4; x.strokeStyle=vpal()[5]; x.stroke();
  star(x,48,48,18,vpal()[2]); x.fillStyle=INK; x.font=`800 42px ${FT()}`; x.textAlign='center'; x.textBaseline='middle'; x.fillText(text,336,50);
  const ct=hudEl.components&&hudEl.components['canvas-tex']; if(ct) ct.refresh(); }
function pinTo(parent){ /* la chincheta que se lleva en la mano */
  const pin=ent('a-entity',{id:'vrPin',position:'0.3 -0.27 -0.7',rotation:'12 -48 -8'},parent), head=TEEN()?'#E88AA6':'#FF6FA5';
  ent('a-cylinder',{radius:'0.006',height:'0.17',rotation:'90 0 0',position:'0 0 -0.085',material:'color: #DDE3EA; metalness: 0.9; roughness: 0.2'},pin);
  ent('a-cone',{'radius-bottom':'0.006','radius-top':'0.0005',height:'0.025',rotation:'-90 0 0',position:'0 0 -0.18',material:'color: #DDE3EA; metalness: 0.9; roughness: 0.2'},pin);
  ent('a-cylinder',{radius:'0.02',height:'0.075',rotation:'90 0 0',position:'0 0 0.03',material:`color: ${head}; roughness: 0.3`},pin);
  ent('a-cylinder',{radius:'0.048',height:'0.022',rotation:'90 0 0',position:'0 0 0.075',material:`color: ${head}; roughness: 0.3`},pin);
  ent('a-octahedron',{radius:'0.022',position:'0 0 0.095',material:'color: #FFE066; shader: flat',animation:'property: rotation; to: 0 0 360; loop: true; dur: 3000; easing: linear'},pin);
  return pin;
}
function poke(){ const p=document.getElementById('vrPin'); if(!p) return; p.setAttribute('animation__poke','property: position; to: 0.16 -0.12 -1.02; dur: 130; easing: easeOutQuad');
  later(()=>p.setAttribute('animation__poke','property: position; to: 0.3 -0.27 -0.7; dur: 260; easing: easeOutQuad'),150); }
function burst(p,colors,n=16){ for(let i=0;i<n;i++){ const c=colors[i%colors.length], a=rnd(0,Math.PI*2), b=rnd(-1,1), r=rnd(.5,1.3);
  const e=ent(i%3?'a-octahedron':'a-sphere',{radius:'0.04',position:`${p.x} ${p.y} ${p.z}`,material:`color: ${c}; shader: flat`,
    animation:`property: position; to: ${(p.x+Math.cos(a)*r).toFixed(2)} ${(p.y+b*r).toFixed(2)} ${(p.z+Math.sin(a)*r).toFixed(2)}; dur: 750; easing: easeOutQuad`,
    animation__r:`property: rotation; to: ${rnd(-360,360)|0} ${rnd(-360,360)|0} 0; dur: 750`,animation__s:'property: scale; to: 0.01 0.01 0.01; dur: 750; delay: 250; easing: easeInQuad'},VR.world);
  later(()=>e.remove(),1100); } }

/* ---------- vistas HTML ---------- */
function vrCrumb(title){ return `<div class="crumb">${t('home')} › <a href="#rv">${t('tRV')}</a>${title?' › '+esc(title):''}</div>`; }
function voiceBtn(){ return `<button class="btn sec" id="vrVoice" onclick="vrToggleVoice()">${ic('sound')} ${vt(VR.voice?'voiceOn':'voiceOff')}</button>`; }
function vrToggleVoice(){ VR.voice=!VR.voice; if(!VR.voice) try{ speechSynthesis.cancel(); }catch(e){} const b=document.getElementById('vrVoice'); if(b) b.innerHTML=`${ic('sound')} ${vt(VR.voice?'voiceOn':'voiceOff')}`; }
function vrHow(){ return `<details class="vrhowto"><summary>${vt('howTitle')}</summary><ul><li>${vt('how1')}</li><li>${vt('how4')}</li><li>${vt('how2')}</li><li>${vt('how3')}</li></ul></details>`; }
const VR_EXP = [['globos','balloon','gName','gDesc'],['escape','lock','eName','eDesc'],['espera','wave','wName','wDesc'],['puertas','door','dName','dDesc']];
function vrHub(){
  const tile=(r,icn,a,b)=>`<button class="tile" onclick="go('rv/${r}')"><span class="ic">${ic(icn)}</span><span><b>${a}</b><span class="d">${b}</span></span></button>`;
  return `${vrCrumb()}<section class="hero">${bubo('happy',88)}<div><h1 style="margin:0 0 .2em">${t('tRV')}</h1><p class="muted" style="margin:0">${vt('hubIntro')}</p></div></section>
   <div class="grid" style="margin-top:14px">${VR_EXP.map(x=>tile(x[0],x[1],vt(x[2]),vt(x[3]))).join('')}</div>
   ${VR.key?keyCard():''}${vrHow()}`;
}
function keyCard(){ return `<div class="keycard"><div class="keyic">${TEEN()?ic('key'):'🔑'}</div><div><b>${vt('eKey')}</b><ul>${ESC.map(r=>`<li>${esc(L(r.name))}</li>`).join('')}</ul><span class="note">${vt('eKeyNote')}</span></div></div>`; }
function vrPage(sub,name,intro,side,extraBtns=''){
  return `${vrCrumb(vt(name))}<div class="vrhead"><h1>${vt(name)}</h1><div class="row">${voiceBtn()}${extraBtns}<button class="btn sec" onclick="vrRestart('${sub}')">${ic('arrowL')} ${vt('restart')}</button></div></div>
   <div class="mrow">${bubo('talk',46)}<div class="msg bot">${esc(vt(intro))}</div></div>
   ${window.AFRAME?sceneHTML():`<div class="vrwrap"><div class="vrload" id="vrLoad">${bubo('listen',80)}<span>${vt('loading')}</span></div></div>`}
   <div id="vrSide">${side}</div>${vrHow()}`;
}
function viewRV(sub){
  if(!sub) return vrHub();
  if(!window.AFRAME) loadAframe().then(()=>{ if(route()==='rv/'+sub) render(); }).catch(()=>{ const l=document.getElementById('vrLoad'); if(l) l.innerHTML=`<span>${vt('loadErr')}</span><button class="btn" onclick="render()">${vt('retry')}</button>`; });
  if(sub==='globos') return vrPage(sub,'gName','gIntro',globosSide(),`<button class="btn sec" onclick="go('diccionario')">${ic('book')} ${vt('gClassic')}</button>`);
  if(sub==='escape') return vrPage(sub,'eName','eIntro',escapeSide());
  if(sub==='espera'){ if(!VR.env) return `${vrCrumb(vt('wName'))}<h1>${vt('wName')}</h1><div class="mrow">${bubo('talk',46)}<div class="msg bot">${esc(vt('wIntro'))}</div></div>
      <div class="envpick"><button class="envcard beach" onclick="vrEnv('beach')"><span class="art"></span><span class="tx"><b>${vt('beach')}</b><span class="note">${vt('beachD')}</span></span></button>
      <button class="envcard forest" onclick="vrEnv('forest')"><span class="art"></span><span class="tx"><b>${vt('forest')}</b><span class="note">${vt('forestD')}</span></span></button></div>${vrHow()}`;
    return vrPage(sub,'wName','wGuide',esperaSide(),`<button class="btn sec" onclick="vrEnv(null)">${vt('wChange')}</button>`); }
  if(sub==='puertas') return vrPage(sub,'dName','dIntro',puertasSide());
  return vrHub();
}
function vrEnv(e){ VR.env=e; render(); }
function vrRestart(sub){ if(sub==='globos'){ VR.found=new Set(); VR.last=null; } if(sub==='escape') VR.esc=null; if(sub==='puertas') VR.door=null; render(); }
/* Se llama al salir de una pantalla: para sonidos, temporizadores, voz y libera WebGL. */
function vrCleanup(){
  VR.timers.forEach(id=>{ clearTimeout(id); clearInterval(id); }); VR.timers=[]; stopAudio(); VR.panel=null; hudEl=null; hudC=null;
  VR.breathing=false; VR.startBtn=null; VR.phaseC=null; VR.phaseEl=null; vrFull(false);
  const sc=document.querySelector('a-scene'); if(sc){ try{ if(sc.is&&sc.is('vr-mode')) sc.exitVR(); }catch(e){} try{ speechSynthesis.cancel(); }catch(e){} try{ sc.renderer&&sc.renderer.dispose(); sc.renderer&&sc.renderer.forceContextLoss(); }catch(e){} }
  for(const k in TEX) delete TEX[k];
}
function vrAfterRender(r){
  if(!r.startsWith('rv/')||!window.AFRAME) return; const sc=document.querySelector('a-scene'); if(!sc) return;
  const sub=r.slice(3);
  const go2=async()=>{ VR.world=sc.querySelector('#vrWorld'); await vrPrep(); if(!document.body.contains(sc)) return;
    const gaze=sc.querySelector('#vrGaze');
    /* gafas Cardboard: se elige mirando fijamente o tocando la pantalla (el toque elige lo que hay en el centro) */
    sc.addEventListener('enter-vr',()=>setTimeout(()=>{ if(!xrOn(sc)) return; gaze.setAttribute('raycaster','enabled',true); gaze.setAttribute('visible',true);
      const sess=sc.renderer.xr.getSession(); if(sess&&!sess.__bubo){ sess.__bubo=true; sess.addEventListener('select',()=>{ const rc=gaze.components.raycaster; let e=rc&&rc.intersectedEls&&rc.intersectedEls[0];
        while(e&&e!==sc&&!(e.classList&&e.classList.contains('clickable'))) e=e.parentElement; if(e&&e!==sc) e.emit('click',{select:true},false); }); } },200));
    sc.addEventListener('exit-vr',()=>{ gaze.setAttribute('raycaster','enabled',false); gaze.setAttribute('visible',false); });
    /* el botón de gafas de A-Frame solo se enseña si el dispositivo puede usarlas; si no, basta nuestro botón de pantalla completa */
    try{ const ok=navigator.xr&&await navigator.xr.isSessionSupported('immersive-vr'); if(!ok) sc.closest('.vrwrap').classList.add('novr'); }catch(e){ sc.closest('.vrwrap').classList.add('novr'); }
    setupPointer(sc);
    ({globos:setupGlobos,escape:setupEscape,espera:setupEspera,puertas:setupPuertas})[sub]?.(); };
  if(sc.hasLoaded) go2(); else sc.addEventListener('loaded',go2,{once:true});
}

/* ======================= 1. DICCIONARIO DE GLOBOS ======================= */
function globosSide(){
  const f=[...VR.found].map(i=>WORDS[i]);
  const last=VR.last!=null?WORDS[VR.last]:null;
  return `${last?`<div class="mrow" style="margin:12px 0">${bubo('talk',46)}<div class="msg bot"><b>${esc(L(last.w))}</b><br>${esc(L(last.d))}<br>${spk(L(last.w)+'. '+L(last.d))}</div></div>`:''}
   <div class="card"><b>${vt('gCount')}: ${f.length}/${WORDS.length}</b><div class="progress"><i style="width:${Math.round(f.length/WORDS.length*100)}%"></i></div>
   ${f.length?`<div class="found">${[...VR.found].map(i=>`<button class="chip" onclick="vrShowWord(${i})">${esc(L(WORDS[i].w))}</button>`).join('')}</div>`:`<p class="note" style="margin:0">${vt('gNone')}</p>`}</div>`;
}
function vrShowWord(i){ VR.last=i; const s=document.getElementById('vrSide'); if(s) s.innerHTML=globosSide(); vspeak(L(WORDS[i].w)+'. '+L(WORDS[i].d)); }
function setupGlobos(){
  const w=VR.world, teen=TEEN(), P=vpal();
  /* una plaza de cuento: cielo rosado, castillo con arcoíris, fuente, árboles de piruleta, flores y farolillos */
  ent('a-sky',{material:'shader: flat','canvas-tex':'id: '+skyTex([[0,'#8FCBFF'],[.45,'#CFE8FF'],[.5,'#FFE1EE'],[1,'#FFF3E0']])},w);
  lights('#FFFFFF','#F4D9C0',.75);
  ent('a-circle',{radius:'30',rotation:'-90 0 0',material:'shader: standard; roughness: 0.95','canvas-tex':`id: ${texId(cobbles('#E8C6A9',['#F3D6BE','#F4C8D4','#E6D5F2']))}; repeat: 26 26`},w);
  ent('a-circle',{radius:'5.6',rotation:'-90 0 0',position:'0 0.01 0',material:'color: #FFFFFF; opacity: 0.35; transparent: true'},w);
  castle(w,0,-30,1.4,{wall:'#FCE3EC',roof:'#B69CFF',roof2:'#FF8FB1',flag:'#FFD966'});
  rainbow(w,0,0,-34,13);
  [[-14,13,-26,1.4],[16,15,-24,1.2],[-6,18,-40,1.6],[24,11,-6,1.1],[-24,12,4,1.3],[6,16,26,1.4]].forEach(([x,y,z,s],i)=>cloud(w,x,y,z,s,30000+i*5000));
  const fz=7, stone='#F9D8E4';
  ent('a-cylinder',{radius:'1.6',height:'0.45',position:`0 0.22 ${fz}`,material:`color: ${stone}`},w);
  ent('a-torus',{radius:'1.6','radius-tubular':'0.09',rotation:'90 0 0',position:`0 0.45 ${fz}`,material:'color: #FFFFFF'},w);
  ent('a-cylinder',{radius:'1.45',height:'0.05',position:`0 0.43 ${fz}`,material:'color: #8FDDF5; opacity: 0.85; transparent: true; roughness: 0.1'},w);
  ent('a-cylinder',{radius:'0.16',height:'1.3',position:`0 0.9 ${fz}`,material:`color: ${stone}`},w);
  ent('a-sphere',{radius:'0.5','theta-start':'90','theta-length':'90',position:`0 1.75 ${fz}`,material:`color: ${stone}; side: double`},w);
  ent('a-octahedron',{radius:'0.2',position:`0 2.1 ${fz}`,material:'color: #FFE066; shader: flat',animation:'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear'},w);
  sparkles(w,14,0,1.8,fz,1.4,['#FFFFFF','#BDEBFF','#FFE066']);
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2+.3, r=11+(i%2)*2.5; lolliTree(w,Math.sin(a)*r,Math.cos(a)*r,1.5+(i%3)*.25,teen?['#9CD9A8','#F2B8C8','#A9D7F0'][i%3]:['#8EE29A','#FFB3C7','#A8E3FF','#C9F59B'][i%4]); }
  for(let i=0;i<34;i++){ const a=rnd(0,Math.PI*2), r=rnd(6.3,9.5); flower(w,Math.sin(a)*r,Math.cos(a)*r,P[i%P.length],rnd(.9,1.4)); }
  for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+Math.PI/4, r=8.6, b=ent('a-entity',{position:`${(Math.sin(a)*r).toFixed(2)} 0 ${(Math.cos(a)*r).toFixed(2)}`,rotation:`0 ${(a*180/Math.PI+180).toFixed(0)} 0`},w), wood='#FFFFFF';
    ent('a-box',{width:'1.6',height:'0.08',depth:'0.45',position:'0 0.45 0',material:`color: ${P[i]}`},b); ent('a-box',{width:'1.6',height:'0.45',depth:'0.06',position:'0 0.74 -0.2',material:`color: ${P[i]}`},b);
    ent('a-box',{width:'0.08',height:'0.45',depth:'0.4',position:'-0.7 0.22 0',material:`color: ${wood}`},b); ent('a-box',{width:'0.08',height:'0.45',depth:'0.4',position:'0.7 0.22 0',material:`color: ${wood}`},b);
    const l=ent('a-entity',{position:'1.15 0 0'},b); ent('a-cylinder',{radius:'0.04',height:'2.2',position:'0 1.1 0',material:'color: #FFFFFF'},l);
    ent('a-sphere',{radius:'0.17',position:'0 2.3 0',material:'color: #FFF3C4; shader: flat'},l); ent('a-cone',{'radius-bottom':'0.2','radius-top':'0.02',height:'0.2',position:'0 2.52 0',material:`color: ${P[i+4]}`},l); }
  sparkles(w,30,0,2.2,-2,6,['#FFFFFF','#FFE066','#FFC2DA']);
  pinTo(document.getElementById('vrCam'));
  /* los globos: uno por palabra, en dos alturas, rodeando a quien juega */
  const N=WORDS.length; let shown=0;
  WORDS.forEach((wd,i)=>{ if(VR.found.has(i)) return; shown++;
    const a=(-135+270*(i/(N-1)))*Math.PI/180, high=i%2, r=high?4.6:3.7, y=high?2.75:1.55, x=Math.sin(a)*r, z=-Math.cos(a)*r, col=P[i%P.length];
    const b=ent('a-entity',{class:'clickable',hoverable:'',position:`${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`},w);
    const bob=ent('a-entity',{animation:`property: position; dir: alternate; loop: true; dur: ${(2400+Math.random()*1800)|0}; easing: easeInOutSine; to: ${rnd(-.08,.08).toFixed(2)} ${rnd(.15,.3).toFixed(2)} 0`},b);
    ent('a-sphere',{radius:'0.46',scale:'1 1.17 1','segments-width':'28','segments-height':'20',material:`color: ${col}; roughness: 0.25; metalness: 0.05`},bob);
    ent('a-sphere',{radius:'0.09',position:'-0.17 0.24 0.36',material:'color: #FFFFFF; shader: flat; opacity: 0.6; transparent: true'},bob);
    ent('a-cone',{'radius-bottom':'0.07','radius-top':'0.015',height:'0.09',position:'0 -0.56 0',rotation:'180 0 0',material:`color: ${col}`},bob);
    ent('a-cylinder',{radius:'0.005',height:'1.2',position:'0 -1.18 0',material:'color: #FFFFFF; shader: flat'},bob);
    const dx=CAM.x-x, dz=CAM.z-z, l=Math.hypot(dx,dz);
    mkPlane(bob,labelCanvas(L(wd.w),{w:640,h:320,size:120}),.92,{position:`${(dx/l*.5).toFixed(3)} 0 ${(dz/l*.5).toFixed(3)}`,'face-camera':''});
    onPick(b,()=>popBalloon(b,i,col)); });
  hud(`${vt('gCount')}: ${VR.found.size}/${N}`);
  if(!shown) showAllDone();
}
function popBalloon(b,i,col){
  if(b.dataset.popped) return; b.dataset.popped='1'; b.classList.remove('clickable'); ac(); poke(); SFX.pop();
  const p=b.object3D.position.clone(); later(()=>{ b.setAttribute('visible',false); burst({x:p.x,y:p.y+.15,z:p.z},[col,'#FFFFFF','#FFE066',...vpal().slice(0,3)],20); b.remove(); },120);
  VR.found.add(i); VR.last=i; const wd=WORDS[i]; hud(`${vt('gCount')}: ${VR.found.size}/${WORDS.length}`);
  const s=document.getElementById('vrSide'); if(s) s.innerHTML=globosSide();
  later(()=>{ openPanel(toward(p,1.85,.05),panelCanvas({head:vt('gHead'),title:L(wd.w),body:L(wd.d),color:col,expr:'talk'}),
    [{label:vt('gOk'),color:col,on:()=>{ closePanel(); try{ speechSynthesis.cancel(); }catch(e){} if(VR.found.size===WORDS.length) showAllDone(); }}]);
    vspeak(L(wd.w)+'. '+L(wd.d)); },380);
}
function showAllDone(){ SFX.fanfare(); burst({x:0,y:2.4,z:-2.5},vpal(),30);
  openPanel({x:0,y:1.75,z:-2.4},panelCanvas({title:vt('gAll'),color:vpal()[5],expr:'party'}),[{label:vt('restart'),color:vpal()[3],on:()=>vrRestart('globos')}]); vspeak(vt('gAll')); }

/* ======================= 2. ESCAPE ROOM DE DERECHOS ======================= */
function escState(){ if(!VR.esc) VR.esc={open:new Set(),t0:Date.now(),secs:0,done:false}; return VR.esc; }
function escapeSide(){
  const s=escState();
  return `<div class="card"><b>${vt('eLocks')}: ${s.open.size}/4</b>${TEEN()?` · <span class="note">${vt('eTime')}: <span id="vrTime">${fmtT(s.secs)}</span></span>`:''}
   <div class="locks">${ESC.map(r=>`<span class="lockpill ${s.open.has(r.id)?'on':''}" style="--lc:${vcol(r)}">${s.open.has(r.id)?(TEEN()?ic('check'):'🔓'):(TEEN()?ic('lock'):'🔒')} ${esc(L(r.name))}</span>`).join('')}</div></div>
   ${s.done?keyCard():''}`;
}
function setupEscape(){
  /* la habitación de la torre de un castillo: papel pintado con estrellas, suelo de madera, guirnalda de luces y ventanas al cielo */
  const w=VR.world, teen=TEEN(), s=escState(); if(s.done){ s.done=false; s.open=new Set(); s.t0=Date.now(); }
  const wallBg=teen?'#F6EFE6':'#F1E8FF', dot=teen?'#E7D7C6':'#DCCBFF', gold='#F2C14E', trim=teen?'#9CD9C0':'#FFC2DA';
  ent('a-sky',{color:'#CFE8FF'},w); lights('#FFFFFF','#E8CBA8',.5);
  ent('a-entity',{light:'type: point; color: #FFF1D6; intensity: 0.7; distance: 12',position:'0 3.2 0'},w);
  ent('a-plane',{width:'8',height:'8',rotation:'-90 0 0',material:'roughness: 0.85','canvas-tex':`id: ${texId(planks('#E9C9A0','#E2BE92'))}; repeat: 4 2`},w);
  ent('a-circle',{radius:'1.8',rotation:'-90 0 0',position:'0 0.01 0',material:`color: ${teen?'#CFE6F2':'#FFD6E7'}; roughness: 1`},w);
  const ceil=cv(256,256),cx=ceil.getContext('2d'); cx.fillStyle='#DDEBFF'; cx.fillRect(0,0,256,256); for(let i=0;i<6;i++) star(cx,30+i*40,(i*83)%230+15,10,'#FFE38A');
  ent('a-plane',{width:'8',height:'8',rotation:'90 0 0',position:'0 3.6 0',material:'shader: flat','canvas-tex':`id: ${texId(ceil)}; repeat: 3 3`},w);
  const wp=wallpaper(wallBg,dot,mix(gold,'#FFFFFF',.2));
  [['0 1.8 4','0 180 0'],['0 1.8 -4','0 0 0'],['-4 1.8 0','0 90 0'],['4 1.8 0','0 -90 0']].forEach(([p,r])=>{ ent('a-plane',{width:'8',height:'3.6',position:p,rotation:r,material:'roughness: 0.95','canvas-tex':`id: ${texId(wp)}; repeat: 8 3.6`},w);
    const e=ent('a-entity',{position:p,rotation:r},w); ent('a-plane',{width:'8',height:'0.14',position:'0 -0.75 0.01',material:`color: ${trim}`},e); ent('a-plane',{width:'8',height:'0.25',position:'0 -1.68 0.01',material:'color: #FFFFFF'},e);
    fairyLights(e,Array.from({length:11},(_,i)=>[-3.75+i*.75,1.55-Math.sin(i/10*Math.PI)*.18,.04]),['#FFE066','#FF9AA2','#7FB8FF','#7ED6A5','#B69CFF']); });
  /* ventanas redondas al cielo */
  const sky=cv(256,256),sx=sky.getContext('2d'),sg=sx.createLinearGradient(0,0,0,256); sg.addColorStop(0,'#8FCBFF'); sg.addColorStop(1,'#E6F4FF'); sx.fillStyle=sg; sx.fillRect(0,0,256,256);
  sx.fillStyle='#FFFFFF'; [[80,110,30],[110,100,38],[145,112,28],[180,170,24],[200,162,30]].forEach(([a,b,r])=>{ sx.beginPath(); sx.arc(a,b,r,0,7); sx.fill(); });
  [['-3.98 2.05 0.2','0 90 0'],['0 2.05 3.98','0 180 0']].forEach(([p,r])=>{ const e=ent('a-entity',{position:p,rotation:r},w); ent('a-circle',{radius:'0.62',material:'shader: flat','canvas-tex':'id: '+texId(sky)},e);
    ent('a-torus',{radius:'0.66','radius-tubular':'0.05',material:'color: #FFFFFF'},e); ent('a-box',{width:'1.3',height:'0.04',depth:'0.03',position:'0 0 0.02',material:'color: #FFFFFF'},e); ent('a-box',{width:'0.04',height:'1.3',depth:'0.03',position:'0 0 0.02',material:'color: #FFFFFF'},e); });
  /* la puerta de cuento con sus cuatro candados dorados; detrás espera un jardín con arcoíris */
  ent('a-plane',{width:'1.52',height:'2.42',position:'0 1.2 -3.93',material:'shader: flat','canvas-tex':'id: '+texId(gardenCanvas())},w);
  const frame=`color: ${teen?'#FFFFFF':'#FFF7E8'}`;
  ent('a-box',{width:'0.14',height:'2.45',depth:'0.14',position:'-0.83 1.22 -3.94',material:frame},w); ent('a-box',{width:'0.14',height:'2.45',depth:'0.14',position:'0.83 1.22 -3.94',material:frame},w);
  ent('a-box',{width:'1.8',height:'0.14',depth:'0.14',position:'0 2.45 -3.94',material:frame},w);
  const fan=cv(512,256),fx=fan.getContext('2d'); ['#FF9AA2','#FFB86B','#FFE066','#9BE09B','#7FB8FF','#B69CFF'].forEach((col,i)=>{ fx.beginPath(); fx.moveTo(256,256); fx.arc(256,256,256,Math.PI+i*Math.PI/6,Math.PI+(i+1)*Math.PI/6); fx.closePath(); fx.fillStyle=col; fx.fill(); });
  fx.beginPath(); fx.arc(256,256,70,Math.PI,0); fx.fillStyle='#FFFFFF'; fx.fill();
  ent('a-circle',{radius:'0.83','theta-length':'180',position:'0 2.52 -3.93',material:'shader: flat','canvas-tex':'id: '+texId(fan)},w);
  ent('a-torus',{radius:'0.86','radius-tubular':'0.06',arc:'180',position:'0 2.52 -3.92',material:frame},w);
  const sign=ent('a-entity',{position:'0 3.25 -3.9'},w), exitC=labelCanvas(L({es:'SALIDA',gl:'SAÍDA',en:'EXIT'}),{w:400,h:120,color:INK,stroke:false,size:70});
  ent('a-plane',{width:'0.9',height:'0.28',material:'color: #9BE5BF; shader: flat'},sign); mkPlane(sign,exitC,.75,{position:'0 0 0.01'});
  const pivot=ent('a-entity',{id:'vrDoor',position:'-0.72 1.2 -3.86'},w), doorC=teen?'#A08BE3':'#B69CFF', doorD=mix(doorC,'#FFFFFF',.25);
  ent('a-box',{width:'1.44',height:'2.36',depth:'0.08',position:'0.72 0 0',material:`color: ${doorC}; roughness: 0.6`},pivot);
  ent('a-box',{width:'1.1',height:'0.9',depth:'0.02',position:'0.72 0.55 0.05',material:`color: ${doorD}`},pivot);
  ent('a-box',{width:'1.1',height:'0.9',depth:'0.02',position:'0.72 -0.55 0.05',material:`color: ${doorD}`},pivot);
  ent('a-sphere',{radius:'0.06',position:'1.25 0 0.08',material:`color: ${gold}; metalness: 0.7; roughness: 0.25`},pivot);
  ESC.forEach((r,i)=>{ const y=.78-i*.52, lk=ent('a-entity',{id:'vrLock'+i,position:`0.72 ${y.toFixed(2)} 0.16`},pivot), col=vcol(r), done=s.open.has(r.id);
    ent('a-box',{width:'0.3',height:'0.25',depth:'0.09',material:`color: ${done?'#7ED6A5':gold}; metalness: 0.55; roughness: 0.3`,class:'vrLockBody'},lk);
    ent('a-circle',{radius:'0.095',position:'0 -0.005 0.047',material:`color: ${col}; shader: flat`},lk);
    ent('a-torus',{radius:'0.085','radius-tubular':'0.016',arc:'180',position:`0 ${done?'0.17':'0.12'} 0`,class:'vrShackle',material:'color: #E6E9EE; metalness: 0.8; roughness: 0.2'},lk);
    mkPlane(lk,teen?imgCanvas(null):emojiCanvas(r.e,160),.15,{position:'0 -0.005 0.05'}); if(done) lk.setAttribute('visible',false); });
  if(teen) ESC.forEach(async(r,i)=>{ const im=await iconImg(r.icon,INK); const lk=document.getElementById('vrLock'+i); if(lk){ const pl=lk.querySelector('a-plane'); if(pl){ TEX[pl.getAttribute('canvas-tex').id]=imgCanvas(im,160); pl.components['canvas-tex']&&pl.components['canvas-tex'].update(); } } });
  sparkles(w,12,0,1.4,-3.6,.9,['#FFE066','#FFFFFF']);
  hud(escHudText());
  /* las cuatro estaciones con su «?» */
  const st={mic:{x:-2.7,z:-2.3},chairs:{x:-2.5,z:2.3},screen:{x:2.5,z:2.3},board:{x:3.6,z:-1.4}};
  ESC.forEach((r,i)=>{ const p=st[r.station], g=ent('a-entity',{position:`${p.x} 0 ${p.z}`,class:s.open.has(r.id)?'':'clickable',hoverable:'',id:'vrSt'+i},w), col=vcol(r), light=mix(col,'#FFFFFF',.35);
    g.setAttribute('rotation',`0 ${(Math.atan2(-p.x,-p.z)*180/Math.PI).toFixed(0)} 0`);
    if(r.station==='mic'){ /* trompetilla mágica para escuchar */
      ent('a-cylinder',{radius:'0.28',height:'0.05',position:'0 0.03 0',material:`color: ${gold}; metalness: 0.6; roughness: 0.3`},g);
      ent('a-cylinder',{radius:'0.03',height:'1.15',position:'0 0.6 0',material:`color: ${gold}; metalness: 0.6; roughness: 0.3`},g);
      ent('a-cone',{'radius-bottom':'0.34','radius-top':'0.05',height:'0.6','open-ended':'true',rotation:'-90 0 0',position:'0 1.3 0.12',material:`color: ${col}; side: double; roughness: 0.4`},g);
      ent('a-torus',{radius:'0.34','radius-tubular':'0.025',position:'0 1.3 0.42',material:`color: ${gold}; metalness: 0.6`},g); }
    if(r.station==='chairs'){ [-.38,.38].forEach(dx=>{ ent('a-box',{width:'0.6',height:'0.16',depth:'0.58',position:`${dx} 0.5 0`,material:`color: ${col}`},g);
      ent('a-box',{width:'0.6',height:'0.62',depth:'0.12',position:`${dx} 0.86 -0.24`,material:`color: ${col}`},g);
      ent('a-sphere',{radius:'0.3',scale:'1 0.35 1',position:`${dx} 0.6 0.02`,material:`color: ${light}`},g);
      ent('a-sphere',{radius:'0.08',position:`${dx} 1.2 -0.24`,material:`color: ${gold}; metalness: 0.5`},g);
      [[-.25,-.24],[.25,-.24],[-.25,.24],[.25,.24]].forEach(([a,b])=>ent('a-cylinder',{radius:'0.03',height:'0.42',position:`${dx+a} 0.21 ${b}`,material:`color: ${gold}; metalness: 0.5`},g)); }); }
    if(r.station==='screen'){ const fc=cv(256,512),fx2=fc.getContext('2d'); fx2.fillStyle=light; fx2.fillRect(0,0,256,512);
      for(let k=0;k<14;k++){ const a=(k*53)%220+18, b=(k*97)%470+20; [[0,-10],[0,10],[-10,0],[10,0]].forEach(([u,v2])=>{ fx2.beginPath(); fx2.arc(a+u,b+v2,8,0,7); fx2.fillStyle=['#FFFFFF','#FF9AA2','#FFE066'][k%3]; fx2.fill(); }); fx2.beginPath(); fx2.arc(a,b,6,0,7); fx2.fillStyle='#FFB86B'; fx2.fill(); }
      const ft=texId(fc);
      [[-.62,30],[0,0],[.62,-30]].forEach(([dx,ry])=>{ const pn=ent('a-entity',{position:`${dx} 0 ${Math.abs(dx)*.3}`,rotation:`0 ${ry} 0`},g);
        ent('a-box',{width:'0.62',height:'1.7',depth:'0.04',position:'0 0.95 0',material:'roughness: 0.8','canvas-tex':'id: '+ft},pn);
        ent('a-sphere',{radius:'0.05',position:'-0.28 1.84 0',material:`color: ${gold}`},pn); ent('a-sphere',{radius:'0.05',position:'0.28 1.84 0',material:`color: ${gold}`},pn); }); }
    if(r.station==='board'){ const bc=cv(800,520),x=bc.getContext('2d'); x.fillStyle=teen?'#FFF8EC':'#FFF1F7'; x.fillRect(0,0,800,520); x.strokeStyle='#E9C9A0'; x.lineWidth=30; x.strokeRect(0,0,800,520);
      x.textAlign='center'; x.font=`800 160px ${FH()}`; x.fillStyle='#FF8FB1'; x.fillText('¿',330,250); x.fillStyle='#7FB8FF'; x.fillText('?',470,250);
      x.font=`700 52px ${FT()}`; x.fillStyle=INK; x.fillText(L({es:'Palabras difíciles',gl:'Palabras difíciles',en:'Hard words'}),400,380);
      [[90,90,'#FFE066'],[700,110,'#7ED6A5'],[110,440,'#B69CFF'],[690,430,'#FFB86B']].forEach(([a,b,c])=>star(x,a,b,26,c));
      mkPlane(g,bc,1.6,{position:'0 1.55 0'}); ent('a-box',{width:'1.6',height:'0.05',depth:'0.12',position:'0 1.02 0.04',material:'color: #E9C9A0'},g); }
    const qy=r.station==='board'?2.55:r.station==='screen'?2.15:1.95;
    const qb=ent('a-entity',{position:`0 ${qy} 0`,animation:'property: position; dir: alternate; loop: true; dur: 1100; easing: easeInOutSine; to: 0 '+(qy+.12).toFixed(2)+' 0'},g);
    ent('a-sphere',{radius:'0.22',class:'vrQb',material:`color: ${s.open.has(r.id)?'#7ED6A5':col}; emissive: ${s.open.has(r.id)?'#7ED6A5':col}; emissiveIntensity: 0.3`},qb);
    mkPlane(qb,labelCanvas(s.open.has(r.id)?'✓':'?',{w:200,h:200,size:150}),.34,{position:'0 0 0.28','face-camera':'',class:'vrQ'});
    sparkles(qb,4,0,0,0,.4,['#FFFFFF','#FFE066']);
    onPick(g,()=>escAsk(i)); });
  if(teen) every(()=>{ if(s.done) return; s.secs=Math.round((Date.now()-s.t0)/1000); const el=document.getElementById('vrTime'); if(el) el.textContent=fmtT(s.secs); hud(escHudText()); },1000);
}
function escHudText(){ const s=escState(); return `${vt('eLocks')}: ${s.open.size}/4`+(TEEN()?` · ${fmtT(s.secs)}`:''); }
function stPos(i){ const g=document.getElementById('vrSt'+i); const p=g.object3D.position; return {x:p.x,y:1.4,z:p.z}; }
function cap(s){ return s.replace(/^./,m=>m.toUpperCase()); }
function escAsk(i){
  const r=ESC[i], s=escState(); if(s.open.has(r.id)) return; const col=vcol(r); ac();
  vspeak(L(r.q));
  openPanel(toward(stPos(i),2.1,.45),panelCanvas({head:cap(L(r.name)),body:L(r.q),color:col,expr:'listen'}),
    r.opts.map(o=>({canvas:optCanvas(L(o.t),col),w:1.8,on:el=>escAnswer(i,o,el)})));
}
function escAnswer(i,o,el){
  const r=ESC[i], col=vcol(r), pos=VR.panel?VR.panel.object3D.position.clone():toward(stPos(i),2.1,.45);
  if(!o.ok){ SFX.no(); TEX[el.getAttribute('canvas-tex').id]=optCanvas(L(o.t),col,'bad'); el.components['canvas-tex'].update();
    later(()=>{ openPanel(pos,panelCanvas({head:vt('eAlmost'),body:L(r.hint),color:col,expr:'listen'}),[{label:vt('eRetry'),color:col,on:()=>escAsk(i)}]); vspeak(L(r.hint)); },550); return; }
  SFX.ok(); TEX[el.getAttribute('canvas-tex').id]=optCanvas(L(o.t),col,'ok'); el.components['canvas-tex'].update();
  const s=escState(); s.open.add(r.id);
  later(()=>{ openLock(i); const st=document.getElementById('vrSt'+i); st.classList.remove('clickable');
    const q=st.querySelector('.vrQ'); if(q){ TEX[q.getAttribute('canvas-tex').id]=labelCanvas('✓',{w:200,h:200,size:150}); q.components['canvas-tex'].update(); }
    const qb=st.querySelector('.vrQb'); if(qb) qb.setAttribute('material',{color:'#7ED6A5',emissive:'#7ED6A5'});
    burst(stPos(i),['#FFE066','#FFFFFF',col],14);
    openPanel(pos,panelCanvas({head:vt('eOpen'),title:cap(L(r.name)),body:L(r.ex),color:'#7ED6A5',expr:'happy'}),
      [{label:vt('eNext'),color:'#7ED6A5',on:()=>{ closePanel(); try{ speechSynthesis.cancel(); }catch(e){} if(s.open.size===4) escWin(); }}]);
    vspeak(vt('eOpen')+' '+L(r.ex)); hud(escHudText()); const sd=document.getElementById('vrSide'); if(sd) sd.innerHTML=escapeSide(); },500);
}
function openLock(i){
  const lk=document.getElementById('vrLock'+i); if(!lk) return; SFX.unlock();
  lk.querySelector('.vrShackle').setAttribute('animation','property: position; to: 0 0.19 0; dur: 300; easing: easeOutBack');
  lk.querySelector('.vrLockBody').setAttribute('material','color','#7ED6A5');
  later(()=>{ lk.setAttribute('animation','property: position; to: '+lk.getAttribute('position').x+' -1.15 0.5; dur: 700; easing: easeInQuad');
    lk.setAttribute('animation__r','property: rotation; to: 70 20 160; dur: 700'); },650);
  later(()=>lk.setAttribute('visible',false),1400);
}
function escWin(){
  const s=escState(); s.done=true; s.secs=Math.round((Date.now()-s.t0)/1000); hud(escHudText());
  SFX.door(); const d=document.getElementById('vrDoor'); d.setAttribute('animation','property: rotation; to: 0 -105 0; dur: 1600; easing: easeInOutCubic');
  later(()=>{ SFX.fanfare(); burst({x:0,y:1.6,z:-3.4},vpal(),36); sparkles(VR.world,20,0,1.5,-3.2,1.2,['#FFE066','#FFFFFF','#FFC2DA']);
    const key=ent('a-entity',{position:'0 1.45 -3',class:'clickable',hoverable:'',animation:'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear',
      animation__f:'property: position; dir: alternate; loop: true; to: 0 1.6 -3; dur: 1200; easing: easeInOutSine'},VR.world);
    const gm='color: #F2C14E; metalness: 0.75; roughness: 0.25; emissive: #8A6A00; emissiveIntensity: 0.25';
    ent('a-torus',{radius:'0.13','radius-tubular':'0.035',position:'0 0.22 0',material:gm},key); ent('a-cylinder',{radius:'0.03',height:'0.42',position:'0 -0.1 0',material:gm},key);
    ent('a-box',{width:'0.12',height:'0.05',depth:'0.04',position:'0.06 -0.24 0',material:gm},key); ent('a-box',{width:'0.09',height:'0.05',depth:'0.04',position:'0.05 -0.14 0',material:gm},key);
    ent('a-octahedron',{radius:'0.06',position:'0 0.22 0',material:'color: #FF8FB1; shader: flat'},key);
    ent('a-entity',{light:'type: point; color: #FFE7A0; intensity: 1.2; distance: 3'},key);
    onPick(key,()=>{ key.remove(); escKey(); });
    openPanel({x:0,y:2.15,z:-2.1},panelCanvas({body:vt('eDone')+(TEEN()?` (${vt('eTime')}: ${fmtT(s.secs)})`:''),color:'#F2C14E',expr:'party',small:true}),[],1.6);
    vspeak(vt('eDone')); const sd=document.getElementById('vrSide'); if(sd) sd.innerHTML=escapeSide(); },1700);
}
function escKey(){
  VR.key=true; SFX.chime(); const list=ESC.map(r=>'• '+cap(L(r.name))).join('\n');
  openPanel({x:0,y:1.75,z:-2.3},panelCanvas({head:vt('eKey'),body:list,color:'#F2C14E',expr:'party'}),[{label:vt('restart'),color:'#F2C14E',on:()=>vrRestart('escape')}]);
  vspeak(vt('eKey')+'. '+ESC.map(r=>L(r.name)).join(', ')); const sd=document.getElementById('vrSide'); if(sd) sd.innerHTML=escapeSide();
}

/* ======================= 3. SALA DE ESPERA MÁGICA ======================= */
const BREATH = () => TEEN() ? [['inhale',4],['hold',4],['exhale',6]] : [['inhale',3],['exhale',4]];
const WAIT_SECS = 180;
function esperaSide(){ return `<div class="card breathbar"><b id="vrPhase">${VR.env==='beach'?vt('beach'):vt('forest')}</b><span class="note">${vt('wLeft')}: <span id="vrLeft">${fmtT(WAIT_SECS)}</span></span>
  <div class="progress"><i id="vrBar" style="width:0%"></i></div><button class="btn ok" id="vrStartBtn" onclick="vrBreathStart()">${ic('check')} ${vt('wStart')}</button></div>`; }
function setupEspera(){
  const w=VR.world, beach=VR.env==='beach', teen=TEEN();
  if(beach){
    ent('a-sky',{material:'shader: flat','canvas-tex':'id: '+skyTex([[0,'#6FB8F0'],[.42,'#BFE4FF'],[.5,'#FFE6D6'],[1,'#FFE6D6']])},w);
    lights('#FFF4E0','#F3D9A6',.9);
    ent('a-sphere',{radius:'4',position:'0 7 -70',material:'color: #FFE08A; shader: flat'},w);
    ent('a-plane',{width:'260',height:'200','segments-width':'70','segments-height':'50',rotation:'-90 0 0',position:'0 -0.05 -95',waves:'amp: 0.18; speed: 0.8',material:'color: #4FB7E3; roughness: 0.25; metalness: 0.1'},w);
    ent('a-plane',{width:'60',height:'2.5',rotation:'-90 0 0',position:'0 0.02 -11',material:'color: #FFFFFF; opacity: 0.55; transparent: true',animation:'property: position; dir: alternate; loop: true; dur: 4200; to: 0 0.02 -9.5; easing: easeInOutSine'},w);
    ent('a-circle',{radius:'14',rotation:'-90 0 0',position:'0 0.01 2',material:'color: #F7E0B5; roughness: 1'},w);
    rainbow(w,-20,0,-60,16);
    [[-5,-4],[6,-3],[-7,4],[8,5]].forEach(([x,z],k)=>{ const p=ent('a-entity',{position:`${x} 0 ${z}`,rotation:`0 ${k*70} 0`},w);
      for(let j=0;j<6;j++) ent('a-cylinder',{radius:(0.2-j*.015).toFixed(3),height:'0.65',position:`${(j*j*.03).toFixed(2)} ${(0.32+j*.6).toFixed(2)} 0`,rotation:`0 0 ${-j*4}`,material:'color: #C99A6B; roughness: 1'},p);
      const top=ent('a-entity',{position:`${(25*.03).toFixed(2)} 3.7 0`,animation:`property: rotation; dir: alternate; loop: true; dur: ${3000+k*400}; to: 0 0 4; easing: easeInOutSine`},p);
      for(let j=0;j<7;j++) ent('a-box',{width:'1.9',height:'0.06',depth:'0.42',position:'0.85 0 0',rotation:'0 0 -20',material:`color: ${['#6CCB7A','#8EE29A'][j%2]}`},ent('a-entity',{rotation:`0 ${j*51} 0`},top)); });
    for(let k=0;k<8;k++){ const a=rnd(.5,Math.PI*2-.5), r=rnd(2.5,6), x=Math.sin(a)*r, z=-Math.cos(a)*r;
      if(k%2) ent('a-sphere',{radius:'0.12','theta-length':'90',position:`${x.toFixed(1)} 0 ${z.toFixed(1)}`,material:`color: ${['#FFC2DA','#FFE0B5'][k%4>1?1:0]}; side: double`},w);
      else { const sf=ent('a-entity',{position:`${x.toFixed(1)} 0.03 ${z.toFixed(1)}`,rotation:`-90 0 ${rnd(0,90)|0}`},w); for(let j=0;j<5;j++) ent('a-box',{width:'0.05',height:'0.2',depth:'0.02',position:'0 0.09 0',material:'color: #FF9A8A'},ent('a-entity',{rotation:`0 0 ${j*72}`},sf)); } }
    for(let k=0;k<6;k++) cloud(w,rnd(-30,30).toFixed(1),rnd(12,18).toFixed(1),rnd(-45,-25).toFixed(1),rnd(.9,1.3).toFixed(2),30000+k*5000);
    for(let k=0;k<3;k++){ const pv=ent('a-entity',{position:`0 ${8+k*1.5} -8`,animation:`property: rotation; to: 0 ${k%2?-360:360} 0; loop: true; dur: ${24000+k*6000}; easing: linear`},w);
      const bird=ent('a-entity',{position:`${10+k*3} 0 0`},pv);
      ['-25','25'].forEach((rz,j)=>ent('a-box',{width:'0.7',height:'0.04',depth:'0.12',position:`${j?0.3:-0.3} 0 0`,rotation:`0 0 ${rz}`,material:'color: #FFFFFF; shader: flat',animation:`property: rotation; dir: alternate; loop: true; dur: 500; to: 0 0 ${-rz}`},bird)); }
  } else {
    /* bosque encantado: setas, flores, mariposas y luciérnagas */
    ent('a-sky',{material:'shader: flat','canvas-tex':'id: '+skyTex([[0,'#8CCBF2'],[.45,'#DDF3E4'],[1,'#F2FAEE']])},w);
    w.sceneEl.setAttribute('fog','type: exponential; color: #E6F5EA; density: 0.025');
    lights('#FFFFFF','#9CCB86',.75);
    ent('a-circle',{radius:'60',rotation:'-90 0 0',material:'color: #9CD68A; roughness: 1'},w);
    ent('a-circle',{radius:'2.4',rotation:'-90 0 0',position:'-3 0.02 -5',material:'color: #8FD3F2; roughness: 0.1; metalness: 0.2'},w);
    sparkles(w,8,-3,.3,-5,1.6,['#FFFFFF']);
    for(let k=0;k<44;k++){ const a=rnd(0,Math.PI*2), r=rnd(5.5,26), x=Math.sin(a)*r, z=Math.cos(a)*r, h=rnd(2.5,5), t=ent('a-entity',{position:`${x.toFixed(1)} 0 ${z.toFixed(1)}`},w);
      ent('a-cylinder',{radius:'0.18',height:(h*.45).toFixed(2),position:`0 ${(h*.22).toFixed(2)} 0`,material:'color: #B9875A'},t);
      if(k%3===0) ent('a-sphere',{radius:(h*.38).toFixed(2),position:`0 ${(h*.7).toFixed(2)} 0`,material:`color: ${['#FFC2DA','#B7E59A'][k%2]}; roughness: 0.9`},t);
      else [0,1,2].forEach(j=>ent('a-cone',{'radius-bottom':(1.3-j*.32).toFixed(2),'radius-top':'0',height:(h*.45).toFixed(2),position:`0 ${(h*.4+j*h*.2).toFixed(2)} 0`,material:`color: ${['#5DBB73','#6FCB84','#86D995'][j]}; roughness: 0.95`},t)); }
    for(let k=0;k<14;k++){ const a=rnd(.6,Math.PI*2-.6), r=rnd(3.5,8); ent('a-sphere',{radius:rnd(.3,.6).toFixed(2),position:`${(Math.sin(a)*r).toFixed(1)} 0.2 ${(-Math.cos(a)*r).toFixed(1)}`,scale:'1 0.7 1',material:'color: #7CC96E'},w); }
    for(let k=0;k<8;k++){ const a=rnd(.7,Math.PI*2-.7), r=rnd(2.2,5); mushroom(w,Math.sin(a)*r,-Math.cos(a)*r,rnd(.8,1.5)); }
    for(let k=0;k<26;k++){ const a=rnd(0,Math.PI*2), r=rnd(2,7); if(Math.abs(Math.sin(a)*r)<1.2&&Math.cos(a)>0) continue; flower(w,Math.sin(a)*r,-Math.cos(a)*r,['#FF8FB1','#FFE066','#B69CFF','#FFFFFF','#FFB86B'][k%5],rnd(.9,1.4)); }
    [['#FF8FB1',2.5,9000],['#7FB8FF',3.5,12000],['#FFE066',2,8000],['#B69CFF',4,14000]].forEach(([c,r,d],k)=>butterfly(w,rnd(-2,2).toFixed(1),(1.2+k*.25).toFixed(2),-2,r,c,d));
    for(let k=0;k<26;k++){ const x=rnd(-6,6), y=rnd(.6,2.6), z=rnd(-7,3); ent('a-sphere',{radius:'0.03',position:`${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`,material:'color: #FFF59D; shader: flat; transparent: true; opacity: 1',
      animation:`property: position; dir: alternate; loop: true; dur: ${(2500+Math.random()*3000)|0}; to: ${(x+rnd(-.6,.6)).toFixed(2)} ${(y+rnd(-.4,.4)).toFixed(2)} ${(z+rnd(-.6,.6)).toFixed(2)}; easing: easeInOutSine`,
      animation__b:`property: material.opacity; from: 1; to: 0.25; dir: alternate; loop: true; dur: ${(800+Math.random()*900)|0}`},w); }
    for(let k=0;k<12;k++){ const x=rnd(-5,5), z=rnd(-6,2); ent('a-plane',{width:'0.12',height:'0.08',position:`${x.toFixed(1)} 4 ${z.toFixed(1)}`,material:`color: ${['#FFC2DA','#FFE066','#B7E59A'][k%3]}; side: double`,
      animation:`property: position; to: ${(x+rnd(-1,1)).toFixed(1)} 0 ${z.toFixed(1)}; loop: true; dur: ${(7000+Math.random()*5000)|0}; delay: ${(Math.random()*5000)|0}; easing: linear`,
      animation__r:`property: rotation; to: 360 ${rnd(0,360)|0} 720; loop: true; dur: 5000; easing: linear`},w); }
  }
  /* la bola de respiración, el anillo de progreso y los textos */
  const orbC=teen?'#9FC4F0':'#FFD966', g=ent('a-entity',{id:'vrOrb',position:'0 1.65 -2.6'},w);
  ent('a-sphere',{id:'vrBall',radius:'0.32',material:`color: ${orbC}; emissive: ${orbC}; emissiveIntensity: 0.6; opacity: 0.92; transparent: true`},g);
  ent('a-sphere',{id:'vrHalo',radius:'0.42',material:`color: ${orbC}; shader: flat; opacity: 0.18; transparent: true`},g);
  ent('a-entity',{light:`type: point; color: ${orbC}; intensity: 0.6; distance: 4`},g);
  sparkles(g,10,0,0,0,.8,['#FFFFFF','#FFE066']);
  ent('a-ring',{id:'vrRing','radius-inner':'0.66','radius-outer':'0.7','theta-length':'0.01',material:'color: #FFFFFF; shader: flat; opacity: 0.9; transparent: true; side: double'},g);
  ent('a-ring',{'radius-inner':'0.66','radius-outer':'0.7',material:'color: #FFFFFF; shader: flat; opacity: 0.25; transparent: true; side: double'},g);
  VR.phaseC=cv(700,150); VR.phaseEl=mkPlane(g,VR.phaseC,1.3,{position:'0 -0.98 0'});
  if(!teen) buboPlane(g,'listen',.6,'-1.15 -0.5 0');
  drawPhase('');
  VR.startBtn=mkButton(g,vt('wStart'),teen?'#6CBF9C':'#7ED6A5','0 -1.25 0.02',()=>vrBreathStart(),1.1);
}
function drawPhase(text,sub){ const c=VR.phaseC; if(!c) return; const x=c.getContext('2d'); x.clearRect(0,0,700,150);
  if(text){ rrect(x,10,10,680,130,65); x.fillStyle='rgba(255,253,248,.9)'; x.fill(); x.lineWidth=5; x.strokeStyle=vpal()[5]; x.stroke(); x.fillStyle=INK; x.textAlign='center'; x.textBaseline='middle';
    x.font=`800 64px ${FH()}`; x.fillText(text,350,sub?62:78); if(sub){ x.font=`600 34px ${FT()}`; x.fillText(sub,350,118); } }
  const ct=VR.phaseEl&&VR.phaseEl.components&&VR.phaseEl.components['canvas-tex']; if(ct) ct.refresh(); }
function vrBreathStart(){
  if(VR.breathing) return; VR.breathing=true; ac(); ambient(VR.env); SFX.chime();
  if(VR.startBtn){ VR.startBtn.remove(); VR.startBtn=null; } const hb=document.getElementById('vrStartBtn'); if(hb) hb.style.display='none';
  vspeak(vt('wGuide'));
  const t0=Date.now(), ph=BREATH(); let i=0;
  const ball=document.getElementById('vrBall'), halo=document.getElementById('vrHalo'), ring=document.getElementById('vrRing');
  const step=()=>{ const left=WAIT_SECS-Math.floor((Date.now()-t0)/1000); if(left<=0) return breathEnd();
    const [k,sec]=ph[i%ph.length]; i++;
    const sc=k==='inhale'?1.7:k==='exhale'?1:null;
    if(sc){ [ball,halo].forEach(b=>b&&b.setAttribute('animation__b',`property: scale; to: ${sc} ${sc} ${sc}; dur: ${sec*1000}; easing: easeInOutSine`)); }
    drawPhase(vt(k),TEEN()?`${sec} s`:''); const pe=document.getElementById('vrPhase'); if(pe) pe.textContent=vt(k);
    if(TEEN()) tone(k==='inhale'?523:k==='hold'?587:440,.6,'sine',.05); else if(i>1) vspeak(vt(k));
    later(step,sec*1000); };
  later(step,TEEN()?400:3500);
  every(()=>{ const el=Math.min(WAIT_SECS,(Date.now()-t0)/1000), left=Math.max(0,Math.ceil(WAIT_SECS-el));
    if(ring) ring.setAttribute('theta-length',Math.max(.01,el/WAIT_SECS*360).toFixed(1)); const l=document.getElementById('vrLeft'); if(l) l.textContent=fmtT(left);
    const b=document.getElementById('vrBar'); if(b) b.style.width=(el/WAIT_SECS*100).toFixed(1)+'%'; },500);
}
function breathEnd(){
  VR.breathing=false; SFX.fanfare(); drawPhase(''); const orb=document.getElementById('vrOrb');
  burst({x:0,y:1.65,z:-2.6},vpal(),24);
  openPanel({x:0,y:1.9,z:-2.3},panelCanvas({body:vt('wEnd'),color:TEEN()?'#6CBF9C':'#7ED6A5',expr:'happy'}),[{label:vt('wAgain'),color:TEEN()?'#6CBF9C':'#7ED6A5',on:()=>render()}],1.7);
  if(orb) orb.setAttribute('visible',false); vspeak(vt('wEnd')); const pe=document.getElementById('vrPhase'); if(pe) pe.textContent='✓';
}

/* ======================= 4. LAS PUERTAS ======================= */
function doorInfo(i){ const d=DOORS[i]; return `<div class="card doorinfo" style="--dc:${vcol(d)}"><h2 style="margin-top:0">${TEEN()?'':d.e+' '}${esc(L(d.l))}</h2>
  <p><b>${vt('dWho')}</b><br>${esc(L(d.who))}</p><p><b>${vt('dSay')}</b><br><i>${esc(L(d.say))}</i></p>
  <div class="row">${d.ph.map(n=>n==='112'?`<button class="btn sos" onclick="openSos()">${ic('phone')} 112</button>`:`<a class="btn" href="tel:${n}">${ic('phone')} ${vt('dCall')} ${VPH[n]}</a>`).join('')}
  <button class="btn sec" onclick="go('chat')">${ic('chat')} ${vt('dChat')}</button>${d.wait?`<button class="btn sec" onclick="VR.env=null;go('rv/espera')">${ic('wave')} ${vt('dWait')}</button>`:''}</div></div>`; }
function puertasSide(){ return `<h2>${vt('dPick')}</h2><div class="doorgrid">${DOORS.map((d,i)=>`<button class="doorbtn" style="--dc:${vcol(d)};--dt:${ink(vcol(d))}" onclick="vrDoor(${i})"><span class="dk">${TEEN()?ic(d.icon):d.e}</span>${esc(L(d.l))}</button>`).join('')}</div><div id="vrDoorInfo">${VR.door!=null?doorInfo(VR.door):''}</div>`; }
function setupPuertas(){
  /* el pasillo de un castillo de cuento: puertas con arco, banderines, macetas con flores y lucecitas */
  const w=VR.world, teen=TEEN(), P=vpal();
  ent('a-sky',{material:'shader: flat','canvas-tex':'id: '+skyTex([[0,'#BFE4FF'],[1,'#FFF3E8']])},w);
  lights('#FFFFFF','#F0D6BF',.55);
  const hall=ent('a-entity',{id:'vrHall'},w);
  ent('a-circle',{radius:'7',rotation:'-90 0 0',material:'roughness: 0.9','canvas-tex':`id: ${texId(tiles(teen?'#F3EDE6':'#FFE9F1',teen?'#E9F1F4':'#FFF6DA'))}; repeat: 10 10`},hall);
  ent('a-circle',{radius:'1.6',rotation:'-90 0 0',position:'0 0.01 0',material:`color: ${teen?'#CFE6F2':'#FFD6E7'}`},hall);
  ent('a-cylinder',{radius:'6',height:'3.8','open-ended':'true','theta-start':'85','theta-length':'190',position:'0 1.9 0',material:'side: back; roughness: 0.95','canvas-tex':`id: ${texId(wallpaper(teen?'#F6EFE6':'#FFF1F6',teen?'#E7D7C6':'#FFD3E2','#F7D77A'))}; repeat: 16 4`},hall);
  ent('a-cylinder',{radius:'5.98',height:'0.16','open-ended':'true','theta-start':'85','theta-length':'190',position:'0 0.9 0',material:`color: ${teen?'#9CD9C0':'#B69CFF'}; side: back`},hall);
  /* banderines */
  for(let k=0;k<30;k++){ const deg=-92+k*6.3, a=deg*Math.PI/180, r=5.85; ent('a-triangle',{position:`${(Math.sin(a)*r).toFixed(2)} ${(3.45-Math.abs(Math.sin(k*.52))*.12).toFixed(2)} ${(-Math.cos(a)*r).toFixed(2)}`,rotation:`0 ${-deg} 180`,scale:'0.32 0.4 0.32',material:`color: ${P[k%P.length]}; side: double; shader: flat`},hall); }
  fairyLights(hall,Array.from({length:30},(_,k)=>{ const a=(-90+k*6.2)*Math.PI/180; return [Math.sin(a)*5.9,3.05,-Math.cos(a)*5.9]; }),['#FFE066','#FF9AA2','#7FB8FF','#7ED6A5']);
  DOORS.forEach((d,i)=>{ const deg=-75+i*30, a=deg*Math.PI/180, r=5.75, col=vcol(d);
    const g=ent('a-entity',{position:`${(Math.sin(a)*r).toFixed(2)} 0 ${(-Math.cos(a)*r).toFixed(2)}`,rotation:`0 ${-deg} 0`,class:'clickable',hoverable:'',id:'vrDoorG'+i},hall);
    ent('a-plane',{width:'1.15',height:'2.2',position:'0 1.1 0.06',material:'color: #FFFDF0; shader: flat'},g);
    ent('a-circle',{radius:'0.575','theta-length':'180',position:'0 2.2 0.06',material:'color: #FFFDF0; shader: flat'},g);
    ent('a-box',{width:'0.12',height:'2.25',depth:'0.12',position:'-0.64 1.12 0',material:'color: #FFFFFF'},g); ent('a-box',{width:'0.12',height:'2.25',depth:'0.12',position:'0.64 1.12 0',material:'color: #FFFFFF'},g);
    ent('a-torus',{radius:'0.64','radius-tubular':'0.06',arc:'180',position:'0 2.2 0',material:'color: #FFFFFF'},g);
    const pv=ent('a-entity',{id:'vrLeaf'+i,position:'-0.575 1.1 0.08'},g);
    ent('a-box',{width:'1.15',height:'2.2',depth:'0.06',position:'0.575 0 0',material:`color: ${col}; roughness: 0.55`},pv);
    ent('a-circle',{radius:'0.575','theta-length':'180',position:'0.575 1.1 0.031',material:`color: ${col}; side: double`},pv);
    ent('a-box',{width:'0.85',height:'0.7',depth:'0.02',position:'0.575 -0.55 0.04',material:`color: ${mix(col,'#FFFFFF',.3)}`},pv);
    ent('a-sphere',{radius:'0.055',position:'1.02 -0.05 0.06',material:'color: #F2C14E; metalness: 0.7; roughness: 0.25'},pv);
    const ic0=mkPlane(pv,teen?imgCanvas(null):emojiCanvas(d.e,240),.6,{position:'0.575 0.45 0.04'});
    if(teen) iconImg(d.icon,INK).then(im=>{ TEX[ic0.getAttribute('canvas-tex').id]=imgCanvas(im,240); ic0.components['canvas-tex']&&ic0.components['canvas-tex'].update(); });
    const sc=cv(700,230),x=sc.getContext('2d'); rrect(x,6,6,688,218,60); x.fillStyle=mix(col,'#FFFFFF',.15); x.fill(); x.lineWidth=8; x.strokeStyle='#FFFFFF'; x.stroke(); x.fillStyle=ink(col);
    let s=84; x.font=`800 ${s}px ${FH()}`; let lines=wrap(x,L(d.l),640); while(lines.length>2&&s>34){ s-=4; x.font=`800 ${s}px ${FH()}`; lines=wrap(x,L(d.l),640); }
    x.textAlign='center'; x.textBaseline='middle'; lines.forEach((l,j)=>x.fillText(l,350,115+(j-(lines.length-1)/2)*s*1.05));
    mkPlane(g,sc,1.75,{position:'0 3.15 0.07'});
    [-0.95,0.95].forEach(px=>{ ent('a-cylinder',{radius:'0.15',height:'0.3',position:`${px} 0.15 0.25`,material:`color: ${teen?'#E9B79A':'#FFB3A0'}`},g);
      ent('a-sphere',{radius:'0.2',position:`${px} 0.38 0.25`,material:'color: #8EE29A'},g);
      [[-.08,.5,.08],[.09,.48,.1],[0,.56,0]].forEach(([fx,fy,fz])=>ent('a-sphere',{radius:'0.045',position:`${px+fx} ${fy} ${0.25+fz}`,material:`color: ${P[(i+2)%P.length]}; shader: flat`},g)); });
    onPick(g,()=>vrDoor(i)); });
  sparkles(hall,24,0,2,-3,4.5,['#FFFFFF','#FFE066','#FFC2DA']);
  const room=ent('a-entity',{id:'vrRoom',visible:'false'},w);
  const fader=ent('a-sphere',{id:'vrFade',radius:'0.25',material:'color: #FFFFFF; shader: flat; side: back; opacity: 0; transparent: true; depthTest: false'},document.getElementById('vrCam'));
  fader.object3D.renderOrder=20;
  if(VR.door!=null) later(()=>enterRoom(VR.door,true),300);
}
function vrDoor(i){
  VR.door=i; const info=document.getElementById('vrDoorInfo'); if(info){ info.innerHTML=doorInfo(i); }
  if(!document.getElementById('vrHall')) return;
  const leaf=document.getElementById('vrLeaf'+i); if(!leaf) return; ac();
  if(document.getElementById('vrRoom').getAttribute('visible')){ enterRoom(i,true); return; }
  SFX.door(); leaf.setAttribute('animation','property: rotation; to: 0 -100 0; dur: 700; easing: easeInOutCubic');
  later(()=>enterRoom(i),750);
}
function fade(to,dur=400){ const f=document.getElementById('vrFade'); if(f) f.setAttribute('animation__f',`property: material.opacity; to: ${to}; dur: ${dur}; easing: linear`); }
function enterRoom(i,instant){
  const d=DOORS[i], col=vcol(d), teen=TEEN();
  fade(1,instant?1:350);
  later(()=>{ const hall=document.getElementById('vrHall'), room=document.getElementById('vrRoom'); if(!room) return;
    hall.setAttribute('visible',false); hall.querySelectorAll('.clickable').forEach(e=>{ e.classList.add('vrOff'); e.classList.remove('clickable'); });
    while(room.firstChild) room.firstChild.remove(); room.setAttribute('visible',true);
    ent('a-circle',{radius:'7',rotation:'-90 0 0',material:`color: ${mix(col,'#FFFFFF',.55)}`},room);
    ent('a-cylinder',{radius:'6',height:'4','open-ended':'true',position:'0 2 0',material:`color: ${mix(col,'#FFFFFF',.7)}; side: back`},room);
    fairyLights(room,Array.from({length:36},(_,k)=>{ const a=k/36*Math.PI*2; return [Math.sin(a)*5.9,3.4,Math.cos(a)*5.9]; }),['#FFE066','#FFFFFF',col]);
    for(let k=0;k<14;k++){ const a=rnd(0,Math.PI*2), r=rnd(2.5,5); ent(k%2?'a-sphere':'a-octahedron',{radius:rnd(.08,.18).toFixed(2),position:`${(Math.sin(a)*r).toFixed(1)} ${rnd(.5,3).toFixed(1)} ${(Math.cos(a)*r).toFixed(1)}`,
      material:`color: ${k%3?col:'#FFFFFF'}; emissive: ${col}; emissiveIntensity: 0.25`,animation:`property: position; dir: alternate; loop: true; dur: ${(2000+Math.random()*2000)|0}; to: ${(Math.sin(a)*r).toFixed(1)} ${rnd(.5,3).toFixed(1)} ${(Math.cos(a)*r).toFixed(1)}; easing: easeInOutSine`},room); }
    sparkles(room,20,0,2,-2,3,['#FFFFFF','#FFE066']);
    const body=`${vt('dWho')}:\n${L(d.who)}\n\n${vt('dSay')}\n${L(d.say)}`;
    const old=VR.world; VR.world=room;
    openPanel({x:0,y:1.95,z:-2.05},panelCanvas({head:(teen?'':d.e+'  ')+L(d.l),body,color:col,expr:'talk',small:true}),
      [...d.ph.map(n=>({label:`${vt('dCall')} ${VPH[n]}`,color:n==='112'?'#E5484D':col,on:()=>{ if(n==='112') openSos(); else location.href='tel:'+n; }})),
       {label:vt('dBack'),color:'#E9E3F5',on:()=>leaveRoom()}],1.9);
    VR.world=old; fade(0,450); SFX.chime(); vspeak(L(d.l)+'. '+L(d.who)+' '+vt('dSay')+' '+L(d.say)); },instant?20:380);
}
function leaveRoom(){
  try{ speechSynthesis.cancel(); }catch(e){} fade(1,300);
  later(()=>{ closePanel(); const hall=document.getElementById('vrHall'), room=document.getElementById('vrRoom'); if(!room) return;
    room.setAttribute('visible',false); while(room.firstChild) room.firstChild.remove();
    hall.setAttribute('visible',true); hall.querySelectorAll('.vrOff').forEach(e=>{ e.classList.add('clickable'); e.classList.remove('vrOff'); });
    DOORS.forEach((_,i)=>{ const l=document.getElementById('vrLeaf'+i); if(l) l.setAttribute('animation','property: rotation; to: 0 0 0; dur: 10'); });
    fade(0,400); },320);
}
