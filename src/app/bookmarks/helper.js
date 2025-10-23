// Fetch all bookmarked words
export const getBookmarkedWords = async () => {
  try {
    const res = await fetch("/api/bookmarks", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookmarks");
    return await res.json();
  } catch (error) {
    console.error("Error in getBookmarkedWords:", error);
    throw error;
  }
};

// Remove bookmark (toggle to false)
export const removeBookmark = async (wordId) => {
  try {
    const res = await fetch(`/api/bookmarks?_id=${wordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookmarked: false }),
    });
    if (!res.ok) throw new Error("Failed to remove bookmark");
    return await res.json();
  } catch (error) {
    console.error("Error in removeBookmark:", error);
    throw error;
  }
};
