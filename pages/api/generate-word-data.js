// pages/api/generate-word-data.js (CORRECT STRUCTURE FOR PAGES ROUTER)

import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  // 1. Check for correct HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 2. Extract the payload from the request body
    const { word } = req.body; // In Pages Router, the body is automatically parsed

    if (!word) {
      return res.status(400).json({ error: "Missing 'word' payload." });
    }

    // Define the list of allowed word types based on your dropdown
    const allowedTypes = [
      "noun",
      "verb",
      "adjective",
      "adverb",
      "pronoun",
      "preposition",
      "conjunction",
      "interjection",
      "idiom",
      "phrase",
      "proverb",
      "expression",
      "slang",
      "phrasal-verb",
      "euphemism",
      "loanword",
      "archaic",
      "neologism",
    ].join(", ");

    // --- 3. Define the Structured Output Schema (remains the same) ---
    const generationSchema = {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: `The grammatical type. Must be one of: ${allowedTypes}.`,
        },
        pronunciation: { type: "string", description: "The phonetic spelling (IPA format)." },
        definition: { type: "string", description: "A concise definition." },
        example: { type: "string", description: "A sentence demonstrating word usage." },
        difficulty: {
          type: "string",
          description: "Difficulty level: beginner, intermediate, advanced.",
        },
        origin: {
          type: "string",
          description: "The primary origin language (e.g., Latin, Old English).",
        },
        synonyms: { type: "string", description: "A comma-separated list of 3-5 synonyms." },
        etymology: {
          type: "string",
          description: "A brief, one-sentence summary of the etymology.",
        },
        etymologyStory: {
          type: "string",
          description: "A fascinating, short paragraph story about the word's origin.",
        },
        mnemonics: { type: "string", description: "A short, memorable mnemonic or memory aid." },
        tags: {
          type: "string",
          description: "A comma-separated list of 3-5 relevant category tags.",
        },
      },
      required: [
        "type",
        "pronunciation",
        "definition",
        "example",
        "difficulty",
        "origin",
        "synonyms",
        "etymology",
        "etymologyStory",
        "mnemonics",
        "tags",
      ],
    };

    // --- 4. Create the Detailed Prompt (remains the same) ---
    const prompt = `Generate a complete, comprehensive, and highly engaging vocabulary entry for the English word: "${word}". All output must strictly adhere to the provided JSON schema. Do not include any text outside the JSON object.`;

    // --- 5. Call the Gemini API with Structured Output ---
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: generationSchema,
        temperature: 0.5,
      },
    });

    const generatedData = JSON.parse(response.text);

    // Success: Return the generated data using the Pages Router response object
    return res.status(200).json(generatedData);
  } catch (error) {
    console.error("--- GEMINI API CALL FAILED ---");
    console.error(error);
    console.error("------------------------------");

    // Return the 500 status using the Pages Router response object
    return res
      .status(500)
      .json({ error: "Failed to generate word data using AI. Check server logs for details." });
  }
}
