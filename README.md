# Bubo · DATAthon Justicia 2026 · Reto 2 Infancia y Juventud

App web instalable (PWA) para que niños, niñas y adolescentes entiendan la justicia y pidan ayuda.
Sin inicio de sesión, sin historial y con botón de salida rápida. Guía: Bubo, un búho.

## Archivos
- `index.html`: la app completa (HTML, CSS y JavaScript sin frameworks).
- `img/`: fotos de la sala polivalente y de la sala de juicio (caras difuminadas), usadas en «Mi camino por la justicia».
- `manifest.webmanifest`, `sw.js`, `icon.svg`: para instalarla en el móvil y usarla sin conexión. Instalada, aparece como «Nube» con icono de nube (camuflaje).
- `worker.js`: servidor gratuito opcional (Cloudflare Workers AI) con el que Bubo conversa de forma libre, apoyándose solo en los textos oficiales.

## Publicar en GitHub Pages
1. Cread un repositorio y subid todo menos `worker.js` (incluida la carpeta `img`).
2. Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
3. En 1-2 minutos estará en `https://VUESTRO-USUARIO.github.io/NOMBRE-REPO/`.
4. En el móvil: abrid la URL → menú del navegador → "Añadir a pantalla de inicio".

## Activar el LLM (opcional, gratis)
Sin esto la app funciona igual: Bubo entiende saludos, emociones, respuestas de sí/no y los temas principales, y contesta con frases naturales y los textos oficiales preparados.
1. Cuenta gratuita en cloudflare.com → Workers & Pages → Create Worker → pegad `worker.js`.
2. Settings → Bindings → Add → Workers AI, nombre `AI`.
3. Cambiad `ALLOWED_ORIGIN` por vuestra URL de GitHub Pages y desplegad.
4. En `index.html`, poned la URL del worker en `CONFIG.WORKER_URL`.

## Privacidad
- El chat no guarda lo que se escribe. Sin LLM no envía nada; con el LLM activado se envían al worker los últimos mensajes (con los datos personales ya ocultos) para que la respuesta tenga contexto, y el worker no los guarda. Al llamar al especialista solo se usa el tema para elegir a la persona adecuada; no se envía la conversación.
- La edad se elige al entrar y no se guarda.
- Los datos personales escritos (teléfono, DNI, email, dirección, nombre, colegio) se ocultan antes de procesar nada.

## Qué es simulado en la demo
- La llamada a la persona especialista.
- La llamada al 112 por internet (para móviles sin SIM, tablets u ordenadores). Para hacerla real hace falta un acuerdo con el servicio 112.
- La preinstalación en todos los móviles (requiere acuerdo del Ministerio).

## Antes de un uso real
- Revisar los textos legales con profesionales del derecho.
- Sustituir la foto de la sala de juicio (fuente: 20minutos) por una imagen con licencia o propia del Ministerio, y confirmar la licencia de la foto de la sala polivalente.

## Mi camino por la justicia
Una sola sección, «Exploro la plaza judicial», con dos salas: la sala polivalente (sala penal de la plaza judicial) y la sala de juicio. En cada una, Bubo cuenta un cuento en tres viñetas (se puede escuchar en voz alta) y después se explora una foto real: al tocar un número aparece una viñeta con esa zona ampliada y la explicación de Bubo. La sala de juicio termina con el juego de ordenar los pasos del día. Todos los textos tienen versión para menores de 14 y para 14 o más.

## Realidad virtual
Sección nueva en el menú y en el inicio. Está hecha con A-Frame (WebXR), que se descarga de internet solo al entrar en una experiencia (`vr.js` sí se guarda para usar sin conexión, A-Frame no).
- **Mi diccionario de globos**: las palabras del diccionario flotan en globos en una plaza; se pinchan con la chincheta que se lleva en la mano y Bubo explica la palabra (en pantalla y en voz alta).
- **Escape room de derechos**: cuatro candados (ser escuchado, ir acompañado, no ver al acusado, entenderlo todo). Cada objeto con «?» plantea un caso; la respuesta correcta abre un candado. Al salir se consigue la llave de derechos (solo en memoria). Para 14+ los casos llevan referencias legales y hay cronómetro.
- **Sala de espera mágica**: playa o bosque, 3 minutos de respiración guiada con sonido ambiente sintetizado. Menores de 14: 3 s tomar aire / 4 s soltarlo, guiado por Bubo con voz. 14+: 4-4-6 con avisos sonoros.
- **Las puertas**: pasillo con seis puertas («me molestan en clase», «en casa no estoy bien», «alguien tiene una foto mía»…). Cada una lleva a quién acudir, una frase para pedir ayuda y botones para llamar. Debajo de la escena están las mismas puertas como botones normales.

Cómo se usa: con el ratón o con el dedo se arrastra para mirar alrededor (también arriba y abajo) y un clic o un toque corto elige el objeto; el botón «Pantalla completa» de la esquina de la escena la amplía y se sigue jugando igual (con 112 y Salir a mano); en el móvil también basta con moverlo; con gafas Cardboard se pulsa el botón de las gafas y se elige mirando fijamente un objeto 1,5 segundos o pulsando el botón de las gafas. El botón de gafas solo aparece en los móviles que pueden usarlas. El modo gafas necesita un navegador con WebXR (Chrome en Android); en iPhone funciona en la pantalla, sin modo gafas.
