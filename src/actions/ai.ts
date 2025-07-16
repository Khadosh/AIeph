'use server'

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
});

type FeedbackType = 'correccion_rapida' | 'analisis_profundo' | 'sugerencia_json';

function getPrompt(type: FeedbackType, text: string): string {
  switch (type) {
    case 'correccion_rapida':
      return `Eres un corrector de textos. Revisa el siguiente texto, corrige únicamente los errores de gramática y ortografía y devuelve solo el texto corregido, sin explicaciones adicionales.\n\nTexto original:\n---\n${text}\n---`;
    
    case 'analisis_profundo':
      return `Eres un editor profesional. Analiza el siguiente texto y proporciona feedback constructivo sobre claridad, tono, estilo y gramática. Usa viñetas para organizar tus sugerencias.\n\nTexto a analizar:\n---\n${text}\n---`;

    case 'sugerencia_json':
      // Este es el prompt avanzado que devuelve JSON
      return `Eres una API de análisis de texto. Tu única función es analizar el texto proporcionado y devolver un objeto JSON válido con la estructura { "resumen_feedback": "...", "sugerencias": [{"tipo": "...", "original": "...", "sugerencia": "...", "explicacion": "..."}] }. No incluyas explicaciones fuera del JSON.\n\nTexto a analizar:\n---\n${text}\n---`;
    
    default:
      return text;
  }
}

async function generateFeedback(userText: string, type: FeedbackType) {
  try {
    const prompt = getPrompt(type, userText);
    const isJsonOutput = type === 'sugerencia_json';

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

export { generateFeedback };