// pages/api/quiz.js
import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client.
const ai = new GoogleGenAI({});

// Change: Updated schema to be an ARRAY of questions
const RESPONSE_SCHEMA = {
  type: "ARRAY", // Try Uppercase
  items: {
    type: "OBJECT", // Try Uppercase
    properties: {
      word: { type: "STRING", description: "The word the question is based on." },
      question: { type: "STRING", description: "The quiz question based on the word." },
      options: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "Exactly four multiple-choice options.",
      },
      correct_option: {
        type: "STRING",
        description: "The correct option from the 'options' array.",
      },
    },
    required: ["word", "question", "options", "correct_option"],
  },
};
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { words } = req.body; // Change: Expecting 'words' array

    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ error: "Missing 'words' array in request body." });
    }

    const systemInstruction =
      "You are a professional quiz master. Generate a vocabulary question for EACH word provided in the list. Provide the output strictly as a JSON array of objects.";

    const prompt = `Generate a quiz questions for the following words: ${words.join(", ")}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.5,
      },
    });

    const generatedData = JSON.parse(response.text);
    return res.status(200).json(generatedData);
  } catch (error) {
    console.error("--- GEMINI BATCH API FAILED ---", error);
    return res.status(500).json({ error: "Failed to generate batch questions." });
  }
}
