// pages/api/quiz.js
import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client.
const ai = new GoogleGenAI({});

/**
 * Defines the strict JSON structure for the quiz question response.
 */
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    word: { type: "string", description: "The word the question is based on." },
    question: { type: "string", description: "The quiz question based on the word." },
    options: {
      type: "array",
      items: { type: "string" },
      description: "Exactly four multiple-choice options.",
    },
    correct_option: { type: "string", description: "The correct option from the 'options' array." },
  },
  required: ["word", "question", "options", "correct_option"],
};

export default async function handler(req, res) {
  // Check for correct HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { word } = req.body;

    if (!word) {
      return res.status(400).json({ error: "Missing 'word' payload in request body." });
    }

    const systemInstruction =
      "You are a professional quiz master. Your task is to generate a single-choice vocabulary question for the given word. The question must test the user's understanding of the word's meaning, synonym, antonym, or usage context. Provide the output strictly as a JSON object matching the provided schema.";
    const prompt = `Generate a quiz question for the word: ${word}.`;

    // Call the Gemini API with Structured Output
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

    // Success: Return the generated data directly
    return res.status(200).json(generatedData);
  } catch (error) {
    console.error("--- GEMINI QUIZ API CALL FAILED ---");
    console.error(error);
    console.error("----------------------------------");

    // Return a generic server error
    return res
      .status(500)
      .json({ error: "Failed to generate quiz question using AI. Check server logs." });
  }
}
