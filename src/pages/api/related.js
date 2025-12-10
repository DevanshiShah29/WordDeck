// /pages/api/related.js

import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";

// --- Configuration ---
const uri = process.env.MONGODB_URI;

// Global Cache Variables
let cachedClient = null;
const CACHE_COLLECTION_NAME = "word_groups_cache";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to connect or return cached connection
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
      return res.status(200).json(cachedResult.groups);
    }

    // CACHE MISS/STALE: Fetch words and call AI
    const wordsToGroup = await wordsCollection
      .find({})
      .project({ word: 1, _id: 0 })
      .map((doc) => doc.word)
      .toArray();

    if (wordsToGroup.length === 0) {
      return res.status(200).json([]);
    }

    // New schema: each group is an object { words: [...], description: "one line" }
    const responseSchema = {
      type: "object",
      properties: {
        related_groups: {
          type: "array",
          description: "Array of group objects with words and a one-line description",
          items: {
            type: "object",
            properties: {
              words: {
                type: "array",
                items: { type: "string" },
              },
              description: {
                type: "string",
                description:
                  "A single short sentence describing the connection between words in the group",
              },
            },
            required: ["words", "description"],
          },
        },
      },
      required: ["related_groups"],
    };

    const prompt = `
Task: Analyze the provided list of words and group words that are related through synonymy, antonymy, or a close conceptual/lexical relationship.

Requirements:
1. Return ONLY a single JSON object that conforms exactly to the provided schema.
2. The JSON must include "related_groups": an array of objects. Each object must have:
   - "words": an array of strings (the group members)
   - "description": a single short sentence (one line) describing the relationship of the group
3. Do NOT include groups that contain only a single word. Only include groups with 2 or more words.
4. Be concise in descriptions (one short sentence, 5-10 words preferred).
5. Do not return any extra explanatory text outside the JSON.

Word List:
${wordsToGroup.join(", ")}
`;

    console.log("CACHE MISS: Calling Gemini API...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Parse structured JSON response
    let grouped = [];
    try {
      const parsed = JSON.parse(response.text);
      grouped = parsed.related_groups;
    } catch (err) {
      console.warn("Failed to parse AI JSON response:", err);
      // Attempt to be resilient: if text contains JSON-like content, try to extract
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          grouped = parsed.related_groups || [];
        }
      } catch (err2) {
        console.error("Fallback JSON parse failed:", err2);
        grouped = [];
      }
    }

    // Normalize legacy array-of-arrays responses to new object form,
    // and filter out single-child groups.
    let normalized = [];
    if (Array.isArray(grouped)) {
      if (grouped.length === 0) {
        normalized = [];
      } else if (grouped.every((g) => Array.isArray(g))) {
        // legacy: array of arrays -> convert and drop singletons
        normalized = grouped
          .map((arr) => ({ words: arr.filter(Boolean).map(String), description: "" }))
          .filter((g) => Array.isArray(g.words) && g.words.length >= 2);
      } else {
        // expected object form: ensure shape, coerce if necessary, drop singletons
        normalized = grouped
          .map((g) => {
            if (!g) return null;
            if (Array.isArray(g.words)) {
              return { words: g.words.map(String), description: (g.description || "").trim() };
            }
            // if the AI returned {words: "..."} incorrectly, try to coerce
            if (Array.isArray(g)) {
              return { words: g.map(String), description: "" };
            }
            return null;
          })
          .filter(Boolean)
          .filter((g) => Array.isArray(g.words) && g.words.length >= 2);
      }
    }

    // Final result to cache/return
    const finalGroups = normalized;

    // --- 3. CACHE UPDATE ---
    const cacheDocument = {
      groups: finalGroups,
      timestamp: Date.now(),
      wordsCount: wordsToGroup.length,
    };

    await cacheCollection.replaceOne({}, cacheDocument, { upsert: true });
    console.log("Cache updated successfully.");

    return res.status(200).json(finalGroups);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to process words with AI." });
  }
}
