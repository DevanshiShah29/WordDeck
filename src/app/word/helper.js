/**
 * Ensures a word detail property (like tags or synonyms) is a clean array of strings.
 * Handles cases where the input is null/undefined, a clean array, or a comma-separated string.
 *
 * @param {string[] | string | undefined | null} prop - The raw property value.
 * @returns {string[]} A sanitized array of trimmed strings.
 */
export function formatWordListProp(prop) {
  if (Array.isArray(prop)) {
    return prop;
  }
  if (typeof prop === "string") {
    // Splits by comma and trims whitespace
    return prop
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
}

/**
 * Fetches the details for a single word by its slug.
 * @param {string} slug - The URL slug of the word.
 * @returns {Promise<object | null>} The word data, or null if fetch fails.
 */
export async function fetchWordDetails(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(`/api/words?slug=${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch word: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching word:", error);
    return null;
  }
}

/**
 * Fetches the entire vocabulary list from the API.
 * Handles errors and ensures the response is a clean array.
 * * @returns {Promise<Array>} A promise that resolves to an array of vocabulary words.
 */
export async function fetchAllWords() {
  try {
    const res = await fetch("/api/words");

    if (!res.ok) {
      throw new Error(`API fetch failed with status: ${res.status}`);
    }

    const data = await res.json();
    // Return an array, even if the API returns something unexpected
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching words:", err);
    // Return an empty array on any failure
    return [];
  }
}
