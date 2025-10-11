export function filterVocabularies(vocabularies, filters) {
  const { searchTerm = "", type = [], tag = [], level = [], dateRange = {} } = filters;

  const lowerSearchTerm = searchTerm.toLowerCase();

  // 🎯 FIX: Convert filter arrays to lowercase for robust matching
  const lowerCaseTypeFilters = type.map((t) => t.toLowerCase());
  const lowerCaseLevelFilters = level.map((l) => l.toLowerCase());

  return vocabularies.filter((vocab) => {
    // --- 1. SEARCH TERM CHECK (No Change) ---

    const {
      word = "",
      definition = "",
      origin = "",
      difficulty = "",
      type: vocabType = "",
      synonyms = [],
    } = vocab;

    const matchesSearchTerm =
      word.toLowerCase().includes(lowerSearchTerm) ||
      definition.toLowerCase().includes(lowerSearchTerm) ||
      origin.toLowerCase().includes(lowerSearchTerm) ||
      vocabType.toLowerCase().includes(lowerSearchTerm) ||
      difficulty.toLowerCase().includes(lowerSearchTerm) ||
      synonyms.some((t) => t?.toLowerCase().includes(lowerSearchTerm));

    if (searchTerm.length > 0 && !matchesSearchTerm) {
      return false;
    }

    // --- 2. INDIVIDUAL FILTER CHECKS (The Fixes) ---

    if (
      lowerCaseTypeFilters.length > 0 &&
      !lowerCaseTypeFilters.includes(vocab.type?.toLowerCase())
    ) {
      return false;
    }

    if (
      lowerCaseLevelFilters.length > 0 &&
      !lowerCaseLevelFilters.includes(vocab.difficulty?.toLowerCase())
    ) {
      return false;
    }

    // Tag filter (already using normalization logic which is good)
    if (tag.length > 0) {
      const normalizedVocabTags = vocab.tags?.map((t) => t.replace(/^"|"$/g, "")) || [];
      const matchesTagFilter = tag.some((filterTag) => normalizedVocabTags.includes(filterTag));
      if (!matchesTagFilter) {
        return false;
      }
    }

    // Date range filter (no change)
    if (dateRange.from || dateRange.to) {
      // NOTE: Change 'createdAt' to your actual date field name if different
      const vocabDate = vocab.createdAt ? new Date(vocab.createdAt) : null;

      // Skip items without a valid date when a date filter is active
      if (!vocabDate || isNaN(vocabDate.getTime())) {
        return false;
      }

      const filterFrom = dateRange.from ? new Date(dateRange.from) : null;
      let filterTo = dateRange.to ? new Date(dateRange.to) : null;

      // CRITICAL FIX for 'To' date: Set the filter end date to the very end of the day (23:59:59)
      if (filterTo) {
        filterTo.setHours(23, 59, 59, 999);
      }

      // Check if the vocabDate is before the start date
      if (filterFrom && vocabDate < filterFrom) {
        return false;
      }

      // Check if the vocabDate is after the end date
      if (filterTo && vocabDate > filterTo) {
        return false;
      }
    }
    return true;
  });
}
