# Mi Justicia · DATAthon Justicia 2026 · Reto 2 Infancia y Juventud

App web instalable (PWA) para que niños, niñas y adolescentes entiendan la justicia y pidan ayuda.
Sin inicio de sesión, sin historial y con botón de salida rápida. Guía: Bubo, un búho.

## Archivos
- `index.html`: la app completa (HTML, CSS y JavaScript sin frameworks).
- `img/`: fotos de la sala Gesell y de la sala de juicio (caras difuminadas).
- `manifest.webmanifest`, `sw.js`, `icon.svg`: para instalarla en el móvil y usarla sin conexión. Instalada, aparece como «Nube» con icono de nube (camuflaje).
- `worker.js`: servidor gratuito opcional (Cloudflare Workers AI) que explica el texto oficial con palabras adaptadas a la edad.

## Publicar en GitHub Pages
1. Cread un repositorio y subid todo menos `worker.js` (incluida la carpeta `img`).
2. Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
3. En 1-2 minutos estará en `https://VUESTRO-USUARIO.github.io/NOMBRE-REPO/`.
4. En el móvil: abrid la URL → menú del navegador → "Añadir a pantalla de inicio".

## Activar el LLM (opcional, gratis)
Sin esto la app funciona igual: responde directamente con los textos oficiales preparados.
1. Cuenta gratuita en cloudflare.com → Workers & Pages → Create Worker → pegad `worker.js`.
2. Settings → Bindings → Add → Workers AI, nombre `AI`.
3. Cambiad `ALLOWED_ORIGIN` por vuestra URL de GitHub Pages y desplegad.
4. En `index.html`, poned la URL del worker en `CONFIG.WORKER_URL`.

## Privacidad
- El chat no guarda ni envía lo que se escribe. Al llamar al especialista solo se usa el tema para elegir a la persona adecuada; no se envía la conversación.
- La edad se elige al entrar y no se guarda.
- Los datos personales escritos (teléfono, DNI, email, dirección, nombre, colegio) se ocultan antes de procesar nada.

## Qué es simulado en la demo
- La llamada a la persona especialista.
- La preinstalación en todos los móviles (requiere acuerdo del Ministerio).

## Antes de un uso real
- Revisar los textos legales con profesionales del derecho.
- Sustituir la foto de la sala de juicio (fuente: 20minutos) por una imagen con licencia o propia del Ministerio, y la de la sala Gesell por una foto real de una sala adaptada para menores.
