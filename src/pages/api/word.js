// pages/api/words.js
import { MongoClient } from "mongodb";

// Replace with your actual MongoDB connection string
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await client.connect();
    const database = client.db("vocabdb");
    const collection = database.collection("words");

    // Fetch all documents, project only the 'word' field, and map to an array of strings
    const words = await collection
      .find({})
      .project({ word: 1, _id: 0 })
      .map((doc) => doc.word)
      .toArray();

    // Success: Return the array of words
    return res.status(200).json(words);
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch words from database." });
  } finally {
    // Ensure the client is closed after operation
    if (client) {
      client.close(); // Uncomment this line if you use serverless functions
    }
  }
}
