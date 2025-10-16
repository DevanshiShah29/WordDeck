// pages/api/words.js
import clientPromise from "../../lib/mongodb";
import { parseCommaSeparatedString, slugify } from "@/utils/helper";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  let client;
  try {
    client = await clientPromise;
    const db = client.db("vocabdb");
    const collection = db.collection("words");

    if (req.method === "GET") {
      const { slug } = req.query;

      if (slug) {
        // --- Handles fetching a SINGLE word by slug ---
        try {
          // Query the database to find one document matching the slug
          const word = await collection.findOne({ slug: slug });

          if (!word) {
            return res.status(404).json({ error: `Word with slug "${slug}" not found.` });
          }

          // Ensure the returned object has the slug property (if it wasn't saved initially)
          const wordWithSlug = {
            ...word,
            slug: word.slug || (word.word ? slugify(word.word) : undefined),
          };

          if (word._id) {
            wordWithSlug._id = word._id.toString();
          }

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
          _id: word._id.toString(),
          slug: word.slug || (word.word ? slugify(word.word) : undefined),
        }));

        return res.status(200).json(wordsWithSlugs);
      }
    } else if (req.method === "POST") {
      // Handles inserting a new word
      let dataToInsert = req.body;

      dataToInsert.word = dataToInsert.word ? dataToInsert.word.trim() : null;

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

      //  Create a RegExp for case-insensitive and exact match of the trimmed word

      const wordPattern = new RegExp(`^${dataToInsert.word}$`, "i");
      const existingWord = await collection.findOne({
        word: { $regex: wordPattern },
      });
      if (existingWord) {
        return res.status(409).json({
          error: `The word '${dataToInsert.word}' already exists in the database.`,
          existingSlug: existingWord.slug,
        });
      }

      try {
        const result = await collection.insertOne(dataToInsert);
        return res.status(201).json({
          message: "Word added successfully!",
          id: result.insertedId,
          slug: dataToInsert.slug,
          createdAt: dataToInsert.createdAt,
        });
      } catch (dbError) {
        console.error("MongoDB Insertion Failed:", dbError);
        // Check for specific errors like duplicate key (if using a unique index on 'slug')
        if (dbError.code === 11000) {
          return res.status(409).json({ error: "A word with this slug already exists." });
        }
        return res.status(500).json({ error: "Failed to insert word into database." });
      }
    } else if (req.method === "PATCH") {
      // --- Handles updating a word by its _id or slug ---
      const { _id, slug } = req.query;
      let dataToUpdate = req.body;
      const filter = {};

      if (_id) {
        // Use MongoDB ObjectId for filtering by _id
        if (!ObjectId.isValid(_id)) {
          return res.status(400).json({ error: "Invalid _id format." });
        }
        filter._id = new ObjectId(_id);
      } else if (slug) {
        // Use slug for filtering
        filter.slug = slug;
      } else {
        return res.status(400).json({ error: "Missing _id or slug for update operation." });
      }

      // Prepare data to be saved
      delete dataToUpdate._id; // Prevent overwriting the _id
      delete dataToUpdate.createdAt; // Keep original creation date

      dataToUpdate.updatedAt = new Date(); // Add an updated timestamp
      dataToUpdate.tags = parseCommaSeparatedString(dataToUpdate.tags);
      dataToUpdate.synonyms = parseCommaSeparatedString(dataToUpdate.synonyms);
      dataToUpdate.word = dataToUpdate.word ? dataToUpdate.word.trim() : null;

      // Re-generate slug if the word itself has changed
      if (dataToUpdate.word) {
        dataToUpdate.slug = slugify(dataToUpdate.word);
      } else {
        return res.status(400).json({ error: "Word field is required for update." });
      }

      try {
        const updateResult = await collection.updateOne(filter, { $set: dataToUpdate });

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: `Word not found for update.` });
        }

        if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 1) {
          return res.status(200).json({ message: "Word found but no changes detected." });
        }

        return res.status(200).json({
          message: "Word updated successfully!",
          slug: dataToUpdate.slug,
          updatedAt: dataToUpdate.updatedAt,
        });
      } catch (dbError) {
        console.error("MongoDB Update Failed:", dbError);
        if (dbError.code === 11000) {
          return res.status(409).json({ error: "A word with this name already exists." });
        }
        return res.status(500).json({ error: "Failed to update word in database." });
      }
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle database connection or other global errors
    console.error("Global API Error:", error);
    return res.status(500).json({ error: "Database connection or internal server error." });
  }
}
