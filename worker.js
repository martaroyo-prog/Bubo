// Cloudflare Worker gratuito para Mi Justicia.
// Recibe SOLO el fragmento oficial y la pregunta (ya sin datos personales) y lo explica con palabras fáciles.
// Requiere el binding de Workers AI llamado "AI" (Settings > Bindings > Workers AI).
const ALLOWED_ORIGIN = '*'; // Cambiad por https://VUESTRO-USUARIO.github.io

const SYSTEM = {
  es: 'Eres Bubo, el asistente de la app Mi Justicia para niños, niñas y adolescentes del Ministerio de Justicia de España. Reescribe el TEXTO OFICIAL con palabras muy sencillas, en 2-4 frases cortas y en tono tranquilo y cercano. Usa SOLO la información del TEXTO OFICIAL: no añadas datos, opiniones, consejos ni leyes que no aparezcan. No pidas datos personales. Si el texto no responde a la pregunta, di que una persona especialista puede ayudar. Responde en castellano.',
  gl: 'Es Bubo, o asistente da app Mi Justicia para nenos, nenas e adolescentes do Ministerio de Xustiza de España. Reescribe o TEXTO OFICIAL con palabras moi sinxelas, en 2-4 frases curtas e en ton tranquilo e próximo. Usa SÓ a información do TEXTO OFICIAL: non engadas datos, opinións, consellos nin leis que non aparezan. Non pidas datos persoais. Se o texto non responde á pregunta, di que unha persoa especialista pode axudar. Responde en galego.',
  en: 'You are Bubo, the assistant of the Mi Justicia app for children and teenagers from the Spanish Ministry of Justice. Rewrite the OFFICIAL TEXT in very simple words, in 2-4 short sentences, with a calm and friendly tone. Use ONLY the information in the OFFICIAL TEXT: do not add facts, opinions, advice or laws that are not there. Do not ask for personal data. If the text does not answer the question, say a specialist can help. Answer in English.'
};

export default {
  async fetch(request, env) {
    const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Not allowed', { status: 405, headers: cors });
    try {
      const { lang = 'es', age = 'kid', question = '', context = '', source = '' } = await request.json();
      if (!context || question.length > 600) return Response.json({ answer: null }, { headers: cors });
      const l = SYSTEM[lang] ? lang : 'es';
      const out = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: SYSTEM[l] + (age === 'teen' ? ' The reader is 14-17: you may use precise legal terms, briefly explained.' : ' The reader is under 14: use very simple words and short sentences.') },
          { role: 'user', content: `TEXTO OFICIAL (${source}):\n${context}\n\nPREGUNTA:\n${question}` }
        ],
        max_tokens: 220, temperature: 0.2
      });
      return Response.json({ answer: (out && out.response) || null }, { headers: cors });
    } catch (e) {
      return Response.json({ answer: null }, { headers: cors });
    }
  }
};
