export const speakWord = (word) => {
  if (typeof window !== "undefined") {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // you can change based on origin
    speechSynthesis.speak(utterance);
  }
};

export function formattedDate(dateString) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

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

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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
 * Custom function to build a URL query string, ensuring array values are
 * comma-separated in a single key (e.g., type=noun,verb).
 */
export function buildQueryString(params) {
  const parts = [];

  for (const key in params) {
    let value = params[key];

    // Skip falsy values (null, undefined, empty string) except for 0/false if needed
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      value = value.join(",");
    }

    if (value === "") {
      continue;
    }

    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  return parts.join("&");
}
/**
 * Manages an array of strings in localStorage, adding a new item
 * to the front of the array and removing any duplicates.
 * * @param {string} key - The localStorage key to manage (e.g., 'current_words').
 * @param {string} newItem - The new string item to add (e.g., the word or origin).
 */
export const localStorageArray = (key, newItem) => {
  if (typeof window === "undefined" || !newItem || newItem.trim() === "") {
    // Exit if not in the browser, or if the item is empty
    return;
  }

  const cleanedItem = newItem.trim();

  //  Retrieve existing array (or default to empty array)
  const existingJSON = localStorage.getItem(key);
  const existingArray = existingJSON ? JSON.parse(existingJSON) : [];

  // Remove the item if it already exists (to prevent duplicates)
  const filteredArray = existingArray.filter((item) => item !== cleanedItem);

  // Add the new item to the front (most recent)
  filteredArray.unshift(cleanedItem);

  // Save the updated array back as a JSON string
  localStorage.setItem(key, JSON.stringify(filteredArray));
};
