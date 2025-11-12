/**
 * Implements exponential backoff for API retries.
 */
export async function fetchWithBackoff(url, options, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status !== 429) {
        return response;
      }
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }

    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Maximum retries exceeded.");
}

/**
 * Shuffles an array and selects a specified count of elements.
 */
export const selectRandomWords = (words, count) => {
  if (words.length <= count) return words;
  let shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};
