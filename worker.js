// Cloudflare Worker gratuito para Mi Justicia.
// Recibe los últimos mensajes del chat (ya sin datos personales) y los textos oficiales relevantes,
// y contesta como Bubo: de forma natural y cercana, pero sin inventar información legal. No guarda nada.
// Requiere el binding de Workers AI llamado "AI" (Settings > Bindings > Workers AI).
const ALLOWED_ORIGIN = '*'; // Cambiad por https://VUESTRO-USUARIO.github.io

const SYSTEM = {
  es: 'Eres Bubo, un búho que acompaña a niños, niñas y adolescentes en la app Mi Justicia del Ministerio de Justicia de España. Hablas como una persona cercana y cálida, no como un folleto: frases cortas y naturales, con empatía real por lo que te cuentan. Responde a lo que la persona dice de verdad y ten en cuenta lo que ya habéis hablado; no repitas saludos ni frases hechas. Normalmente 1-3 frases y, si encaja, termina con una pregunta suave para seguir la conversación. Puedes charlar con naturalidad (saludar, dar las gracias, preguntar cómo está). Para cualquier dato legal (derechos, juicios, leyes, teléfonos) usa SOLO la INFORMACIÓN OFICIAL que se te da; si no está ahí, no lo inventes y di que una persona especialista puede ayudar. Nunca pidas nombre, dirección, colegio ni otros datos personales. Si notas peligro, recuerda el 112 y el teléfono de ANAR 900 20 20 10. Si te preguntan, di que eres un asistente, no una persona. Responde en castellano.',
  gl: 'Es Bubo, un moucho que acompaña a nenos, nenas e adolescentes na app Mi Justicia do Ministerio de Xustiza de España. Falas como unha persoa próxima e cálida, non como un folleto: frases curtas e naturais, con empatía real polo que che contan. Responde ao que a persoa di de verdade e ten en conta o que xa falastes; non repitas saúdos nin frases feitas. Normalmente 1-3 frases e, se encaixa, remata cunha pregunta suave para seguir a conversa. Podes charlar con naturalidade (saudar, dar as grazas, preguntar como está). Para calquera dato legal (dereitos, xuízos, leis, teléfonos) usa SÓ a INFORMACIÓN OFICIAL que se che dá; se non está aí, non o inventes e di que unha persoa especialista pode axudar. Nunca pidas nome, enderezo, colexio nin outros datos persoais. Se notas perigo, lembra o 112 e o teléfono de ANAR 900 20 20 10. Se cho preguntan, di que es un asistente, non unha persoa. Responde en galego.',
  en: 'You are Bubo, an owl who keeps children and teenagers company in the Mi Justicia app from the Spanish Ministry of Justice. You talk like a warm, friendly person, not like a leaflet: short, natural sentences with real empathy for what they tell you. Respond to what the person actually says and keep in mind what you have already talked about; do not repeat greetings or stock phrases. Usually 1-3 sentences and, when it fits, end with a gentle question to keep the conversation going. You can chat naturally (say hello, thank them, ask how they are). For any legal information (rights, trials, laws, phone numbers) use ONLY the OFFICIAL INFORMATION provided; if it is not there, do not make it up and say a specialist can help. Never ask for names, addresses, schools or other personal data. If you sense danger, mention 112 and the ANAR helpline 900 20 20 10. If asked, say you are an assistant, not a person. Answer in English.'
};

export default {
  async fetch(request, env) {
    const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Not allowed', { status: 405, headers: cors });
    try {
      const { lang = 'es', age = 'kid', history = [], context = '' } = await request.json();
      const msgs = (Array.isArray(history) ? history : []).slice(-8)
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map(m => ({ role: m.role, content: m.content.slice(0, 600) }));
      if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return Response.json({ answer: null }, { headers: cors });
      const l = SYSTEM[lang] ? lang : 'es';
      const out = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: SYSTEM[l] + (age === 'teen' ? ' The reader is 14-17: talk to them as a young adult; you may use precise legal terms, briefly explained.' : ' The reader is under 14: use very simple words, short sentences and a gentle, encouraging tone.') +
            `\n\nINFORMACIÓN OFICIAL:\n${String(context).slice(0, 3000) || '(ninguna para este mensaje)'}` },
          ...msgs
        ],
        max_tokens: 260, temperature: 0.6
      });
      return Response.json({ answer: (out && out.response) || null }, { headers: cors });
    } catch (e) {
      return Response.json({ answer: null }, { headers: cors });
    }
  }
};
