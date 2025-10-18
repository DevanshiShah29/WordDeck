// pages/api/words.js
import clientPromise from "../../lib/mongodb";
import { parseCommaSeparatedString, slugify } from "@/utils/helper";
import { ObjectId } from "mongodb";

/**
 * Connects to the database and returns the 'words' collection.
 * @param {object} client - The MongoDB client instance.
 * @returns {object} The MongoDB collection object.
 */
const getWordsCollection = (client) => {
  const db = client.db("vocabdb");
  return db.collection("words");
};

/**
 * Handles fetching all words or a single word by slug.
 */
async function handleGet(req, res, collection) {
  const { slug } = req.query;

  if (slug) {
    // Fetch Single Word by Slug
    try {
      const word = await collection.findOne({ slug: slug });

      if (!word) {
        return res.status(404).json({ error: `Word with slug "${slug}" not found.` });
      }

      // Normalize the word object for client response
      const wordWithSlug = {
        ...word,
        _id: word._id.toString(), // Convert ObjectId to string
        bookmarked: !!word.bookmarked,
        slug: word.slug || (word.word ? slugify(word.word) : undefined),
      };

      return res.status(200).json(wordWithSlug);
    } catch (dbError) {
      console.error("MongoDB Single Fetch Failed:", dbError);
      return res.status(500).json({ error: "Failed to fetch single word from database." });
    }
  } else {
    // Fetch All Words
    const words = await collection.find({}).toArray();

    // Normalize all word objects
    const wordsWithSlugs = words.map((word) => ({
      ...word,
      _id: word._id.toString(), // Convert ObjectId to string
      bookmarked: !!word.bookmarked,
      slug: word.slug || (word.word ? slugify(word.word) : undefined),
    }));

    return res.status(200).json(wordsWithSlugs);
  }
}

/**
 * Handles inserting a new vocabulary word.
 */
async function handlePost(req, res, collection) {
  let dataToInsert = req.body;

  //  Data Cleaning and Preparation
  dataToInsert.word = dataToInsert.word ? dataToInsert.word.trim() : null;
  if (!dataToInsert.word) {
    return res.status(400).json({ error: "Word field is required for insertion." });
  }

  // Generate necessary fields
  dataToInsert.createdAt = new Date();
  dataToInsert.bookmarked = false; // Initialize status
  dataToInsert.slug = slugify(dataToInsert.word);

  // Clean array fields
  dataToInsert.tags = parseCommaSeparatedString(dataToInsert.tags);
  dataToInsert.synonyms = parseCommaSeparatedString(dataToInsert.synonyms);

  // Duplication Check (Case-Insensitive Exact Match)
  const wordPattern = new RegExp(`^${dataToInsert.word}$`, "i");
  const existingWord = await collection.findOne({ word: { $regex: wordPattern } });

  if (existingWord) {
    return res.status(409).json({
      error: `The word '${dataToInsert.word}' already exists in the database.`,
      existingSlug: existingWord.slug,
    });
  }

  //  Insertion
  try {
    const result = await collection.insertOne(dataToInsert);
    return res.status(201).json({
      message: "Word added successfully!",
      id: result.insertedId.toString(), // Return ID as string
      slug: dataToInsert.slug,
      createdAt: dataToInsert.createdAt,
    });
  } catch (dbError) {
    console.error("MongoDB Insertion Failed:", dbError);
    if (dbError.code === 11000) {
      return res.status(409).json({ error: "A word with this slug already exists." });
    }
    return res.status(500).json({ error: "Failed to insert word into database." });
  }
}

/**
 * Handles updating a full word document or just the bookmark status.
 */
async function handlePatch(req, res, collection) {
  const { _id, slug } = req.query;
  let dataToUpdate = req.body;
  const filter = {};

  //  Determine the Filter
  if (_id) {
    if (!ObjectId.isValid(_id)) return res.status(400).json({ error: "Invalid _id format." });
    filter._id = new ObjectId(_id);
  } else if (slug) {
    filter.slug = slug;
  } else {
    return res.status(400).json({ error: "Missing _id or slug for update operation." });
  }

  //  Handle Simple Bookmark Toggle
  if (Object.keys(dataToUpdate).length === 1 && typeof dataToUpdate.bookmarked === "boolean") {
    try {
      const updateResult = await collection.updateOne(filter, {
        $set: {
          bookmarked: dataToUpdate.bookmarked,
          updatedAt: new Date(),
        },
      });

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: `Word not found for bookmark update.` });
      }

      return res.status(200).json({
        message: `Bookmark status updated to ${dataToUpdate.bookmarked}`,
        bookmarked: dataToUpdate.bookmarked,
      });
    } catch (dbError) {
      console.error("MongoDB Bookmark Update Failed:", dbError);
      return res.status(500).json({ error: "Failed to update bookmark status in database." });
    }
  }

  // Handle Full Document Update

  // Clean up data for update
  delete dataToUpdate._id;
  delete dataToUpdate.createdAt;

  dataToUpdate.updatedAt = new Date();
  dataToUpdate.tags = parseCommaSeparatedString(dataToUpdate.tags);
  dataToUpdate.synonyms = parseCommaSeparatedString(dataToUpdate.synonyms);
  dataToUpdate.word = dataToUpdate.word ? dataToUpdate.word.trim() : null;

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
    console.error("MongoDB Full Update Failed:", dbError);
    if (dbError.code === 11000) {
      return res.status(409).json({ error: "A word with this name already exists." });
    }
    return res.status(500).json({ error: "Failed to update word in database." });
  }
}

export default async function handler(req, res) {
  let client;
  try {
    client = await clientPromise;
    const collection = getWordsCollection(client);

    switch (req.method) {
      case "GET":
        return handleGet(req, res, collection);
      case "POST":
        return handlePost(req, res, collection);
      case "PATCH":
        return handlePatch(req, res, collection);
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Catches connection errors or errors thrown outside the method handlers
    console.error("Global API Error:", error);
    return res.status(500).json({ error: "Database connection or internal server error." });
  }
}
