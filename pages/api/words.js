// pages/api/words.js

import clientPromise from "../../lib/mongodb";
import { parseCommaSeparatedString, slugify } from "@/utils/helper";
import { ObjectId } from "mongodb";

// Custom order for difficulty levels
const LEVEL_ORDER = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const DB_NAME = "vocabdb";
const COLLECTION_NAME = "words";

/**
 * Builds the MongoDB query filter object based on request query parameters.
 */
function buildMongoFilter(query) {
  const { search, type, tag, level, origin, wordLength, isBookmarked, dateRangeFrom, dateRangeTo } =
    query;

  const filter = {};

  // Helper function to handle single string, comma-separated string, or array of strings
  const normalizeValues = (value) => {
    if (Array.isArray(value)) {
      // If it's an array (e.g., from '?type=noun&type=verb') flatten it
      return value.flatMap((v) => parseCommaSeparatedString(v));
    }
    // If it's a string, use the existing parser (handles '?type=noun,verb')
    return parseCommaSeparatedString(value);
  };

  // Search Filter (remains the same)
  if (search) {
    filter.word = { $regex: new RegExp(search, "i") };
  }

  // Multi-Value Filters (type, tag, level, origin)
  const multiValueFields = { type, tag, level, origin };

  for (const [key, rawValue] of Object.entries(multiValueFields)) {
    if (rawValue) {
      const values = normalizeValues(rawValue);

      if (values.length > 0) {
        // Map query key 'level' to DB field 'difficulty', 'tag' to 'tags'
        const dbKey = key === "level" ? "difficulty" : key === "tag" ? "tags" : key;
        const lowerCaseValues = values.map((v) => v.toLowerCase());
        filter[dbKey] = { $in: lowerCaseValues };
      }
    }
  }

  //  Bookmark Filter
  if (isBookmarked === "true") {
    filter.bookmarked = true;
  } else if (isBookmarked === "false") {
    filter.bookmarked = false;
  }

  //  Date Range Filter (remains the same)
  if (dateRangeFrom || dateRangeTo) {
    filter.createdAt = {};
    if (dateRangeFrom) {
      // Ensure it's treated as a Date object for $gte
      filter.createdAt.$gte = new Date(dateRangeFrom);
    }
    if (dateRangeTo) {
      // FIX: Add one day to include the entire 'to' day
      const dateTo = new Date(dateRangeTo);
      dateTo.setDate(dateTo.getDate() + 1);
      filter.createdAt.$lt = dateTo;
    }
  }

  //  Word Length Filter (remains the same)
  if (wordLength) {
    const rangeArray = normalizeValues(wordLength);
    let range = rangeArray.length > 0 ? rangeArray[0] : null;

    if (range) {
      // Step 1: Normalize frontend display label to a simple range
      if (range.startsWith("Short")) {
        range = "1-5";
      } else if (range.startsWith("Medium")) {
        range = "6-10";
      } else if (range.startsWith("Long")) {
        range = "11+";
      }

      // Step 2: Extract numeric boundaries
      const [minStr, maxStr] = range.split("-");

      const minLength = parseInt(minStr, 10);

      // Final guard clause: ensure we have a valid starting number
      if (isNaN(minLength)) return filter;

      // Max length is the parsed number or a very large number for "11+"
      const maxLength = maxStr ? parseInt(maxStr, 10) : 9999;

      // Step 3: Apply the $expr filter
      filter.$expr = {
        $and: [
          // $strLenCP calculates length in code points (safest for strings)
          { $gte: [{ $strLenCP: "$word" }, minLength] },
          { $lte: [{ $strLenCP: "$word" }, maxLength] },
        ],
      };
    }
  }
  return filter;
}

/**
 * Builds the MongoDB sort object based on the 'sort' query parameter.
 * Returns null if level sorting is requested (requires aggregation).
 */
function buildMongoSort(sortParam = "date_desc") {
  // If it's a level sort, return null to signal aggregation
  if (sortParam.startsWith("level_")) {
    return null;
  }

  const sort = {};
  switch (sortParam) {
    case "word_asc":
      sort.word = 1;
      break;
    case "word_desc":
      sort.word = -1;
      break;
    case "date_asc":
      sort.createdAt = 1;
      break;
    case "random":
    case "date_desc":
    default:
      sort.createdAt = -1;
      break;
  }
  return sort;
}

/**
 * Handles fetching all words (paginated/filtered/sorted) or a single word by slug.
 */
async function handleGet(req, res, collection) {
  const { slug, page = 1, limit = 12, sort } = req.query;
  const pageNumber = parseInt(page, 10);
  const wordsPerPage = parseInt(limit, 10);

  // Fetch Single Word by slug
  if (slug) {
    try {
      const word = await collection.findOne({ slug: slug });

      if (!word) {
        return res.status(404).json({ error: `Word with slug "${slug}" not found.` });
      }

      const wordWithSlug = {
        ...word,
        _id: word._id.toString(),
        bookmarked: !!word.bookmarked,
        slug: word.slug || slugify(word.word),
      };
      return res.status(200).json(wordWithSlug);
    } catch (dbError) {
      console.error("MongoDB Single Fetch Failed:", dbError);
      return res.status(500).json({ error: "Failed to fetch single word from database." });
    }
  }

  // Fetch Paginated Words
  const mongoFilter = buildMongoFilter(req.query);
  const mongoSort = buildMongoSort(sort);
  const skip = (pageNumber - 1) * wordsPerPage;

  const isLevelSort = sort && sort.startsWith("level_");
  const sortDirection = sort === "level_asc" ? 1 : -1;

  try {
    let words;
    const totalWords = await collection.countDocuments(mongoFilter);

    if (isLevelSort) {
      // Use Aggregation Pipeline for custom level sorting
      const pipeline = [
        { $match: mongoFilter },
        {
          $addFields: {
            // Map string difficulty to numeric order
            levelOrder: {
              $switch: {
                branches: Object.entries(LEVEL_ORDER).map(([level, order]) => ({
                  case: { $eq: ["$difficulty", level] },
                  then: order,
                })),
                default: 99,
              },
            },
          },
        },
        {
          $sort: {
            levelOrder: sortDirection,
            word: 1,
          },
        },
        { $skip: skip },
        { $limit: wordsPerPage },
      ];

      words = await collection.aggregate(pipeline).toArray();
    } else {
      // Use standard find() for other sorts (faster)
      words = await collection
        .find(mongoFilter)
        .sort(mongoSort)
        .skip(skip)
        .limit(wordsPerPage)
        .toArray();
    }

    // Normalize Data: convert _id to string and remove temporary fields
    const wordsWithSlugs = words.map((word) => ({
      ...word,
      levelOrder: undefined, // Remove aggregation field
      _id: word._id.toString(),
      bookmarked: !!word.bookmarked,
      slug: word.slug || slugify(word.word),
    }));

    // Return paginated result
    return res.status(200).json({
      data: wordsWithSlugs,
      pagination: {
        currentPage: pageNumber,
        wordsPerPage: wordsPerPage,
        totalWords: totalWords,
        totalPages: Math.ceil(totalWords / wordsPerPage),
      },
    });
  } catch (dbError) {
    console.error("MongoDB Paginated Fetch Failed:", dbError);
    return res.status(500).json({ error: "Failed to fetch words from database." });
  }
}

/**
 * Handles inserting a new vocabulary word.
 */
async function handlePost(req, res, collection) {
  let dataToInsert = req.body;

  // Data Cleaning and Preparation
  const word = dataToInsert.word ? dataToInsert.word.trim() : null;
  if (!word) {
    return res.status(400).json({ error: "Word field is required for insertion." });
  }

  // Duplication Check
  const existingWord = await collection.findOne({ word: { $regex: new RegExp(`^${word}$`, "i") } });
  if (existingWord) {
    return res.status(409).json({
      error: `The word '${word}' already exists in the database.`,
      existingSlug: existingWord.slug,
    });
  }

  // Set default/calculated fields
  dataToInsert = {
    ...dataToInsert,
    word, // Use trimmed word
    createdAt: new Date(),
    bookmarked: false,
    slug: slugify(word),
    tags: parseCommaSeparatedString(dataToInsert.tags),
    synonyms: parseCommaSeparatedString(dataToInsert.synonyms),
  };

  // Insertion
  try {
    const result = await collection.insertOne(dataToInsert);
    return res.status(201).json({
      message: "Word added successfully!",
      id: result.insertedId.toString(),
      slug: dataToInsert.slug,
      createdAt: dataToInsert.createdAt,
    });
  } catch (dbError) {
    console.error("MongoDB Insertion Failed:", dbError);
    if (dbError.code === 11000) {
      // Duplicate key error
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

  // Determine the Filter (by _id or slug)
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
        $set: { bookmarked: dataToUpdate.bookmarked, updatedAt: new Date() },
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

  // Handle Full Update
  delete dataToUpdate._id;
  delete dataToUpdate.createdAt;

  const word = dataToUpdate.word ? dataToUpdate.word.trim() : null;

  if (!word) {
    return res.status(400).json({ error: "Word field is required for update." });
  }

  // Prepare fields for update
  dataToUpdate.updatedAt = new Date();
  dataToUpdate.tags = parseCommaSeparatedString(dataToUpdate.tags);
  dataToUpdate.synonyms = parseCommaSeparatedString(dataToUpdate.synonyms);
  dataToUpdate.word = word;
  dataToUpdate.slug = slugify(word);

  try {
    const updateResult = await collection.updateOne(filter, { $set: dataToUpdate });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: `Word not found for update.` });
    }

    return res.status(200).json({
      message:
        updateResult.modifiedCount > 0
          ? "Word updated successfully!"
          : "Word found but no changes detected.",
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

// Main Export Handler

export default async function handler(req, res) {
  let client;
  try {
    client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

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
    console.error("Global API Error:", error);
    return res.status(500).json({ error: "Database connection or internal server error." });
  }
}
