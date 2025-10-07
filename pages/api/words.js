import clientPromise from "../../lib/mongodb";
import { parseCommaSeparatedString, slugify } from "@/utils/helper";

export default async function handler(req, res) {
  let client;
  try {
    client = await clientPromise;
    const db = client.db("vocabdb");
    const collection = db.collection("words");

    if (req.method === "GET") {
      const { slug } = req.query; // 🎯 STEP 1: Extract the slug from the query parameters

      if (slug) {
        // --- Handles fetching a SINGLE word by slug ---
        try {
          // 🎯 STEP 2: Query the database to find one document matching the slug
          const word = await collection.findOne({ slug: slug });

          if (!word) {
            return res.status(404).json({ error: `Word with slug "${slug}" not found.` });
          }

          // Ensure the returned object has the slug property (if it wasn't saved initially)
          const wordWithSlug = {
            ...word,
            slug: word.slug || (word.word ? slugify(word.word) : undefined),
          };

          return res.status(200).json(wordWithSlug);
        } catch (dbError) {
          console.error("MongoDB Single Fetch Failed:", dbError);
          return res.status(500).json({ error: "Failed to fetch single word from database." });
        }
      } else {
        // --- Handles fetching ALL words (Original logic) ---
        const words = await collection.find({}).toArray();
        const wordsWithSlugs = words.map((word) => ({
          ...word,
          slug: word.slug || (word.word ? slugify(word.word) : undefined),
        }));

        return res.status(200).json(wordsWithSlugs);
      }
    } else if (req.method === "POST") {
      // Handles inserting a new word
      let dataToInsert = req.body;

      // FIX/IMPROVEMENT: Add the 'createdAt' timestamp to the document
      dataToInsert.createdAt = new Date();

      // Clean up array fields using the utility function
      dataToInsert.tags = parseCommaSeparatedString(dataToInsert.tags);
      dataToInsert.synonyms = parseCommaSeparatedString(dataToInsert.synonyms);

      // Ensure other fields are present/safe before inserting (optional, but good practice)
      dataToInsert.word = dataToInsert.word ? dataToInsert.word.trim() : null;

      // Generate the slug
      dataToInsert.slug = dataToInsert.word ? slugify(dataToInsert.word) : null;

      // Filter out null or empty required fields if needed, or rely on MDB schema validation
      if (!dataToInsert.word) {
        return res.status(400).json({ error: "Word field is required for insertion." });
      }

      try {
        const result = await collection.insertOne(dataToInsert);
        return res.status(201).json({
          message: "Word added successfully!",
          id: result.insertedId,
          slug: dataToInsert.slug,
          createdAt: dataToInsert.createdAt, // Return the timestamp
        });
      } catch (dbError) {
        console.error("MongoDB Insertion Failed:", dbError);
        // Check for specific errors like duplicate key (if using a unique index on 'slug')
        if (dbError.code === 11000) {
          return res.status(409).json({ error: "A word with this slug already exists." });
        }
        return res.status(500).json({ error: "Failed to insert word into database." });
      }
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle database connection or other global errors
    console.error("Global API Error:", error);
    return res.status(500).json({ error: "Database connection or internal server error." });
  }
}
