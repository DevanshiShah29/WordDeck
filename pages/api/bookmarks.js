// pages/api/bookmarks.js
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Returns the 'words' collection from vocabdb.
 */
const getWordsCollection = (client) => {
  const db = client.db("vocabdb");
  return db.collection("words");
};

/**
 * Fetch all bookmarked words.
 */
async function handleGet(req, res, collection) {
  try {
    const bookmarkedWords = await collection.find({ bookmarked: true }).toArray();

    const wordsWithStringIds = bookmarkedWords.map((word) => ({
      ...word,
      _id: word._id.toString(),
      bookmarked: !!word.bookmarked,
    }));

    return res.status(200).json(wordsWithStringIds);
  } catch (error) {
    console.error("MongoDB Bookmark Fetch Failed:", error);
    return res.status(500).json({ error: "Failed to fetch bookmarked words." });
  }
}

/**
 * Toggle or update bookmark status for a specific word.
 */
async function handlePatch(req, res, collection) {
  const { _id, slug } = req.query;
  const { bookmarked } = req.body;

  if (typeof bookmarked !== "boolean") {
    return res.status(400).json({ error: "Bookmark status must be a boolean value." });
  }

  const filter = {};
  if (_id) {
    if (!ObjectId.isValid(_id)) return res.status(400).json({ error: "Invalid _id format." });
    filter._id = new ObjectId(_id);
  } else if (slug) {
    filter.slug = slug;
  } else {
    return res
      .status(400)
      .json({ error: "Either _id or slug must be provided for bookmark update." });
  }

  try {
    const updateResult = await collection.updateOne(filter, {
      $set: { bookmarked, updatedAt: new Date() },
    });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Word not found for bookmark update." });
    }

    return res.status(200).json({
      message: `Bookmark status updated to ${bookmarked}`,
      bookmarked,
    });
  } catch (error) {
    console.error("MongoDB Bookmark Update Failed:", error);
    return res.status(500).json({ error: "Failed to update bookmark status." });
  }
}

/**
 * (Optional) Remove all bookmarks.
 */
async function handleDelete(req, res, collection) {
  try {
    const result = await collection.updateMany(
      { bookmarked: true },
      { $set: { bookmarked: false } }
    );

    return res.status(200).json({
      message: `Removed ${result.modifiedCount} bookmarks successfully.`,
    });
  } catch (error) {
    console.error("MongoDB Bookmark Delete Failed:", error);
    return res.status(500).json({ error: "Failed to clear bookmarks." });
  }
}

/**
 * Main API handler
 */
export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const collection = getWordsCollection(client);

    switch (req.method) {
      case "GET":
        return handleGet(req, res, collection);
      case "PATCH":
        return handlePatch(req, res, collection);
      case "DELETE":
        return handleDelete(req, res, collection);
      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Global Bookmark API Error:", error);
    return res.status(500).json({ error: "Database connection or internal server error." });
  }
}
