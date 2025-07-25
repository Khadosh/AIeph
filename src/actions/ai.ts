'use server'

import { NovelWithAll, NovelWithChapters } from "@/types/novel";
import { Tables } from "@/types/supabase";
import { GoogleGenAI } from "@google/genai";

const validateText = (text: string) => {
  const MAX_LENGTH = 100000;
  return text.length < MAX_LENGTH;
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
});

const generateOutput = async (prompt: string, isJsonOutput: boolean) => {
  if (!validateText(prompt)) {
    return { error: "El texto excede el límite de caracteres permitido." };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // Forzar salida JSON si el tipo lo requiere
      ...(isJsonOutput && { generationConfig: { responseMimeType: "application/json" } })
    });

    const responseText = response.text;

    if (isJsonOutput) {
      // Limpiar posible markdown que a veces envuelve el JSON
      const cleanJsonText = responseText?.replace(/```json\n|```/g, '').trim();
      return JSON.parse(cleanJsonText || "");
    }

    return responseText;

  } catch (error) {
    console.error("Error en la generación de feedback:", error);
    return { error: "No se pudo generar el feedback." };
  }
}

type FeedbackType = 'correccion_rapida' | 'analisis_profundo' | 'sugerencia_json';

function getAnalysisPrompt(type: FeedbackType, text: string): string {
  switch (type) {
    case 'correccion_rapida':
      return `Eres un corrector de textos. Revisa el siguiente texto, corrige únicamente los errores de gramática y ortografía y devuelve solo el texto corregido, sin explicaciones adicionales.\n\nTexto original:\n---\n${text}\n---`;

    case 'analisis_profundo':
      return `Eres un editor profesional. Analiza el siguiente texto y proporciona feedback constructivo sobre claridad, tono, estilo y gramática. Usa viñetas para organizar tus sugerencias.\n\nTexto a analizar:\n---\n${text}\n---`;

    default:
      return text;
  }
}

async function generateFeedback(userText: string, type: FeedbackType) {
  try {
    const prompt = getAnalysisPrompt(type, userText);
    const isJsonOutput = type === 'sugerencia_json';

    const response = await generateOutput(prompt, isJsonOutput);
    return response;
  } catch (error) {
    console.error("Error en la generación de feedback:", error);
    return { error: "No se pudo generar el feedback." };
  }
}

async function generateSummary(novel: NovelWithChapters, currentChapter: Tables<'chapters'>, userText: string) {
  const previousContext = novel.chapters
    .filter((chapter: Tables<'chapters'>) => chapter.summary && chapter.order_index < currentChapter.order_index)
    .sort((a, b) => a.order_index - b.order_index)
    .map((chapter: Tables<'chapters'>) => `\n---Capítulo ${chapter.order_index}: ${chapter.summary}---\n`)
    .join("\n");

  const previousContextPrompt = previousContext
    ? `\n\nContexto previo:\n---\n${previousContext}\n---`
    : "";

  const prompt = `
  Eres un editor profesional y un analista de narrativas. Tu tarea es analizar el texto de un capítulo de novela y generar un análisis conciso y relevante.

  ### INSTRUCCIONES GENERALES ###
  - Tu respuesta completa debe ser directa, sin introducciones como "Como editor profesional...".
  - Sé conciso y enfócate únicamente en la información crucial para la trama.
  - No incluyas información que no se pueda obtener del texto original.
  - No incluyas las tareas del prompt como ### TAREA 1, ### TAREA 2, etc.
  - Idioma: El mismo idioma del texto original.
  - Formato: Párrafos de texto plano.

  ### TAREA 1: RESUMEN EN PROSA ###
  Escribe un resumen en prosa del capítulo. El resumen debe cumplir con los siguientes requisitos:
  - Longitud: Hasta 200 palabras. Si puede condensarse en 100, mejor.
  - Focaliza en los cambios y evoluciones del protagonista y los personajes más importantes.
  - Si un personaje ha sido previamente introducido (según el contexto previo), no repetir su descripción, solo su acción.


  ### TAREA 2: ANÁLISIS ESTRUCTURADO ###
  Extrae la siguiente información y preséntala en la estructura de lista solicitada.
  Agrega la sección sólo si es relevante para el capítulo, sólo Personajes es obligatorio.

  Personajes:
  Identifica únicamente a los personajes más importantes del capítulo (aquellos con nombre o un rol decisivo). 
  Ignora personajes anónimos o de fondo a menos que su acción sea el catalizador de un evento principal.
  - [Nombre del Personaje 1]: [Breve descripción de su rol en este capítulo]
  - [Nombre del Personaje 2]: [Breve descripción de su rol en este capítulo]


  --------------------------------------------------------------------

  ${previousContextPrompt}

  --------------------------------------------------------------------

  Texto a analizar:
  ---\n${userText}\n---
`

  const response = await generateOutput(prompt, false);
  return response;
}

async function generateMagic(
  novel: NovelWithAll,
  currentChapter: Tables<'chapters'>,
  userText: string
) {
  // 1. Filtrar datos hasta el capítulo actual (inclusive)
  const currentOrder = currentChapter.order_index;

  // Obtener todos los personajes de la novela
  const allCharacters = novel.characters || [];
  
  // Filtrar eventos hasta el capítulo actual
  const relevantEvents = novel.events?.filter(event => {
    if (!event.chapter_id) return false;
    const eventChapter = novel.chapters?.find(c => c.id === event.chapter_id);
    return eventChapter && eventChapter.order_index <= currentOrder;
  }) || [];

  // Filtrar relaciones hasta el capítulo actual  
  const relevantRelations = novel.character_relations?.filter(relation => {
    if (!relation.chapter_id) return false;
    const relationChapter = novel.chapters?.find(c => c.id === relation.chapter_id);
    return relationChapter && relationChapter.order_index <= currentOrder;
  }) || [];

  // 2. Obtener contexto de capítulos anteriores
  const previousChapters = novel.chapters
    ?.filter(ch => ch.order_index < currentOrder && ch.summary)
    ?.sort((a, b) => a.order_index - b.order_index)
    ?.map(ch => ({
      order: ch.order_index,
      title: ch.title,
      summary: ch.summary
    })) || [];

  // 3. Crear contexto más rico y estructurado
  const contextString = `
CONTEXTO NARRATIVO DE LA NOVELA "${novel.title}":

=== CAPÍTULOS ANTERIORES ===
${previousChapters.map(ch => 
  `Capítulo ${ch.order}: ${ch.title}\n${ch.summary || 'Sin resumen'}`
).join('\n\n') || 'No hay capítulos anteriores'}

=== PERSONAJES EXISTENTES (${allCharacters.length}) ===
${allCharacters.map(char => 
  `• ${char.name}: ${char.summary || 'Sin descripción'}`
).join('\n') || 'No hay personajes registrados'}

=== EVENTOS REGISTRADOS (${relevantEvents.length}) ===
${relevantEvents.map(event => 
  `• ${event.title}: ${event.summary || 'Sin descripción'}`
).join('\n') || 'No hay eventos registrados'}

=== RELACIONES ENTRE PERSONAJES (${relevantRelations.length}) ===
${relevantRelations.map(rel => {
  const charA = allCharacters.find(c => c.id === rel.character_a_id);
  const charB = allCharacters.find(c => c.id === rel.character_b_id);
  return `• ${charA?.name || 'Desconocido'} ↔ ${charB?.name || 'Desconocido'} (${rel.type}): ${rel.summary || 'Sin descripción'}`;
}).join('\n') || 'No hay relaciones registradas'}

=== ESTADÍSTICAS ===
• Capítulo actual: ${currentOrder}
• Total de capítulos: ${novel.chapters?.length || 0}
• Personajes únicos: ${allCharacters.length}
• Eventos hasta ahora: ${relevantEvents.length}
• Relaciones establecidas: ${relevantRelations.length}
`;

  // 4. Crear prompt mejorado con instrucciones más específicas
  const prompt = `
Eres un editor profesional especializado en análisis narrativo y construcción de mundos ficticios.

INSTRUCCIONES PRINCIPALES:
1. Analiza el texto del capítulo actual considerando TODO el contexto narrativo previo
2. Identifica ÚNICAMENTE elementos nuevos o ampliaciones significativas de elementos existentes
3. NO repitas información que ya esté registrada en el contexto
4. Prioriza coherencia narrativa y consistencia con la historia establecida
5. Asigna niveles de confianza basados en la claridad de la evidencia textual

${contextString}

REGLAS DE ANÁLISIS:
• PERSONAJES: Solo sugiere personajes nuevos con nombre propio o personajes existentes con nueva información significativa
• EVENTOS: Solo eventos con impacto narrativo claro, evita acciones menores o rutinarias  
• RELACIONES: Solo relaciones nuevas o cambios importantes en relaciones existentes

Analiza el siguiente texto del capítulo ${currentOrder} y extrae sugerencias siguiendo la estructura JSON exacta:
{
  "personajes": [
    {
      "id": "unique-id",
      "name": "Nombre del personaje",
      "description": "Descripción detallada",
      "context": "Fragmento de texto donde aparece",
      "confidence": 0.9,
      "isNew": true,
      "existingCharacterId": null
    }
  ],
  "eventos": [
    {
      "id": "unique-id",
      "title": "Título del evento",
      "description": "Descripción del evento",
      "context": "Fragmento de texto relevante",
      "confidence": 0.8,
      "involvedCharacters": ["nombre1", "nombre2"],
      "date": "fecha si se menciona"
    }
  ],
  "relaciones": [
    {
      "id": "unique-id",
      "characterAId": "id-personaje-a",
      "characterBId": "id-personaje-b", 
      "characterAName": "Nombre A",
      "characterBName": "Nombre B",
      "type": "tipo de relación",
      "description": "Descripción de la relación",
      "context": "Fragmento de texto donde se evidencia",
      "confidence": 0.7
    }
  ]
}

CRITERIOS DE CONFIANZA:
• 0.9-1.0: Información explícita y clara en el texto
• 0.7-0.8: Información implícita pero bien fundamentada
• 0.5-0.6: Información inferida con evidencia moderada
• 0.3-0.4: Información especulativa con poca evidencia
• Descarta sugerencias con confianza < 0.3

IMPORTANTE: 
- Usa IDs únicos con formato UUID válido (genera UUIDs reales o usa crypto.randomUUID())
- Para personajes existentes, usa "isNew": false y el UUID real del "existingCharacterId" de la base de datos
- En "context" incluye máximo 2-3 oraciones específicas donde aparece la evidencia
- Si no hay elementos nuevos suficientemente claros, devuelve arrays vacíos
- NUNCA uses IDs descriptivos como "char_maria" - siempre UUIDs válidos

=== TEXTO DEL CAPÍTULO ${currentOrder} A ANALIZAR ===
${userText}
`;

  // 4. Llamar a la IA
  const response = await generateOutput(prompt, true);
  
  // 5. Post-procesar la respuesta para generar UUIDs válidos
  if (response && !response.error) {
    try {
      // Generar UUIDs válidos para todas las sugerencias
      if (response.personajes) {
        response.personajes = response.personajes.map((char: any) => ({
          ...char,
          id: crypto.randomUUID()
        }));
      }
      if (response.eventos) {
        response.eventos = response.eventos.map((event: any) => ({
          ...event,
          id: crypto.randomUUID()
        }));
      }
      if (response.relaciones) {
        response.relaciones = response.relaciones.map((rel: any) => ({
          ...rel,
          id: crypto.randomUUID(),
          characterAId: rel.characterAId || crypto.randomUUID(),
          characterBId: rel.characterBId || crypto.randomUUID()
        }));
      }
    } catch (error) {
      console.error('Error post-processing AI response:', error);
    }
  }
  
  return response;
}

export { generateFeedback, generateSummary, generateMagic };