'use server'

import { NovelWithChapters } from "@/types/novel";
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

export { generateFeedback, generateSummary };