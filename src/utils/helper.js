export const speakWord = (word) => {
  if (typeof window !== "undefined") {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // you can change based on origin
    speechSynthesis.speak(utterance);
  }
};

export function formattedDate(dateString) {
  // 1. 🎯 FIX: Check for a valid, truthy string.
  if (!dateString) {
    return "N/A";
  }

  // 2. Attempt to create the Date object.
  const date = new Date(dateString);

  // 3. 🎯 FIX: Check if the Date object is valid.
  // The getTime() method returns NaN for an "Invalid Date" object.
  if (isNaN(date.getTime())) {
    // If the input string was invalid, return a safe fallback.
    console.error(`Invalid date string received: ${dateString}`);
    return "Invalid Date Format";
  }

  // Use Intl.DateTimeFormat for robust, locale-aware formatting (recommended over manual string creation)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}
/**
 * Converts a string to a URL-friendly slug.
 * @param {string} text - The input string (e.g., 'A Great Word')
 * @returns {string} The slug (e.g., 'a-great-word')
 */
export const slugify = (text) => {
  if (typeof text !== "string" || !text) {
    return "";
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Takes a comma-separated string and returns a cleaned array of strings.
 * @param {string | string[]} input - The input string (e.g., "tag1, tag2, "tag3"")
 * @returns {string[]} An array of cleaned strings.
 */
export const parseCommaSeparatedString = (input) => {
  if (typeof input !== "string") {
    // If it's already an array or something else, return an empty array for safety
    return [];
  }
  return input
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, "")) // Trim and remove surrounding single/double quotes
    .filter((item) => item.length > 0);
};
