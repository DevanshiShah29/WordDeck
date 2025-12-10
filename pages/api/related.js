// /pages/api/related.js

import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";

// --- Configuration ---
const uri = process.env.MONGODB_URI;

// Global Cache Variables
let cachedClient = null;
const CACHE_COLLECTION_NAME = "word_groups_cache";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to connect or return cached connection (Corrected from previous steps)
async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// Initialize Gemini Client
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const client = await connectToDatabase();
    const database = client.db("vocabdb");
    const cacheCollection = database.collection(CACHE_COLLECTION_NAME);
    const wordsCollection = database.collection("words");

    // --- 1. CACHE CHECK ---
    const cachedResult = await cacheCollection.findOne({});

    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_EXPIRY_MS) {
      console.log("CACHE HIT: Returning grouped words from cache.");
      // Cache is fresh, return cached data
      return res.status(200).json(cachedResult.groups);
    }

    // --- 2. CACHE MISS/STALE: Proceed with DB Fetch and AI Call ---

    // Fetch all words from the database
    const wordsToGroup = await wordsCollection
      .find({})
      .project({ word: 1, _id: 0 })
      .map((doc) => doc.word)
      .toArray();

    if (wordsToGroup.length === 0) {
      return res.status(200).json([]);
    }

    // Define the desired output structure using JSON Schema
    const responseSchema = {
      type: "object",
      properties: {
        related_groups: {
          type: "array",
          description:
            "An array of arrays, where each inner array contains words that are semantically related.",
          items: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      required: ["related_groups"],
    };

    const prompt = `
Task: Analyze the provided list of words. Group words that are related through **synonymy, antonymy, or a close conceptual/lexical relationship.**

Rules:
1.  Form groups of any size where words are connected as synonyms, antonyms, or are very closely associated terms (e.g., 'happy', 'joyful', 'exuberant', 'melancholy'—where the group is focused on mood words, and happy is an antonym of melancholy).
2.  Do not group words based on arbitrary or non-lexical themes like "Jainism concepts" or "types of food." The relationship must be about meaning or opposition in meaning.
3.  If a word cannot be linked to any other word by synonymy, antonymy, or a close lexical bond, it should be placed alone in its own group.
4.  Return ONLY the JSON object.

Word List: ${wordsToGroup.join(", ")}
`;
    console.log("CACHE MISS: Calling Gemini API...");

    // Call the Gemini API for structured output
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Parse the structured JSON response
    const result = JSON.parse(response.text);
    const groupedWords = result.related_groups;

    // --- 3. CACHE UPDATE ---
    const cacheDocument = {
      groups: groupedWords,
      timestamp: Date.now(), // Store the current time
      wordsCount: wordsToGroup.length, // Optional: for debugging
    };

    // Replace the old cache document with the new one
    await cacheCollection.replaceOne(
      {}, // Filter: just find the one cache document (since we only need one)
      cacheDocument,
      { upsert: true } // Insert if no document is found
    );
    console.log("Cache updated successfully.");

    // Return the final result
    return res.status(200).json(groupedWords);
  } catch (error) {
    console.error("API Error:", error);
    // You might want to return the stale cache data here if the AI call fails!
    return res.status(500).json({ error: "Failed to process words with AI." });
  }
}
