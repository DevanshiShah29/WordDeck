// src/api/vocabulary.js

/**
 * Fetches the list of unique word origins from the backend API route.
 * * This is the function the client component (FilterModal) should call.
 * * @returns {Promise<string[]>} A promise that resolves to an array of origin strings.
 */
export async function fetchWordOrigins() {
  try {
    // Call the server-side API route we defined above
    const response = await fetch("/api/origins", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache settings for Next.js fetch (optional, adjust as needed)
      cache: "force-cache",
    });

    if (!response.ok) {
      // Throw an error if the HTTP status is not 200-299
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
    }

    const data = await response.json();

    // Safely return the 'origins' array, defaulting to an empty array if undefined
    return Array.isArray(data.origins) ? data.origins : [];
  } catch (error) {
    console.error("Failed to fetch word origins from API:", error);
    // Return an empty array on failure to prevent the UI from crashing
    return [];
  }
}
