import { toast } from "react-toastify";

// Fetch all bookmarked words
export const getBookmarkedWords = async () => {
  try {
    const res = await fetch("/api/bookmarks", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookmarks");
    return await res.json();
  } catch (error) {
    toast.error("Failed to load bookmarked words.");
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
    toast.error("Failed to remove bookmark.");
    throw error;
  }
};

// Update word knowledge status (Don't know, Skip, Know it)
export const updateWordStatus = async (wordId, status) => {
  try {
    const res = await fetch(`/api/bookmarks?_id=${wordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ knowledgeStatus: status }), // status will be 'dont-know', 'skip', or 'know'
    });
    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  } catch (error) {
    toast.error("Failed to save progress.");
    throw error;
  }
};
