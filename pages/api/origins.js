// pages/api/origins.js
export default async function handler(req, res) {
  if (req.method !== "GET") {
    // Standard response for unsupported methods
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // ----------------------------------------------------
    // 🛑 CRITICAL: REPLACE THIS PLACEHOLDER WITH YOUR DB LOGIC
    // This is an example of what your database logic should do (e.g., using MongoDB's distinct)

    // const db = await connectToDatabase();
    // const uniqueOrigins = await db.collection('vocabularies').distinct('origin');

    // --- TEMPORARY MOCK DATA (Remove once DB logic is implemented) ---
    const uniqueOrigins = ["Latin", "Greek", "French", "German", "Spanish", "Arabic"];
    // ----------------------------------------------------

    // Send the list of origins back to the client
    return res.status(200).json({ origins: uniqueOrigins });
  } catch (error) {
    console.error("Error fetching unique origins:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve word origins", error: error.message });
  }
}
