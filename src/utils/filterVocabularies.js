export function filterVocabularies(vocabularies, filters) {
  const {
    searchTerm = "",
    type: typeFilters = [],
    level: levelFilters = [],
    origin: originFilters = [],
    wordLength: wordLengthFilters = [],
    isBookmarked = false,
    dateRange = {},
  } = filters;

  const lowerSearchTerm = searchTerm.toLowerCase(); // Prepare filter lists once

  const lowerTypeFilters = typeFilters.map((t) => t.toLowerCase());
  const lowerLevelFilters = levelFilters.map((l) => l.toLowerCase());
  const lowerOriginFilters = originFilters.map((o) => o.toLowerCase());

  return vocabularies.filter((vocab) => {
    const {
      word = "",
      definition = "",
      origin = "",
      difficulty = "",
      type: vocabType = "",
      bookmarked: vocabIsBookmarked = false,
      synonyms = [],
    } = vocab;

    //  SEARCH TERM CHECK
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

    // Only show bookmarked words if the filter is active (isBookmarked === true)

    if (isBookmarked && !vocabIsBookmarked) {
      return false;
    }
    // Check if the vocab's type is included in the list of selected types
    if (lowerTypeFilters.length > 0 && !lowerTypeFilters.includes(vocabType?.toLowerCase())) {
      return false;
    }
    // Check if the vocab's difficulty is included in the list of selected levels
    if (lowerLevelFilters.length > 0 && !lowerLevelFilters.includes(difficulty?.toLowerCase())) {
      return false;
    }
    // Check if the vocab's origin is included in the list of selected origins
    if (lowerOriginFilters.length > 0 && !lowerOriginFilters.includes(origin?.toLowerCase())) {
      return false;
    }
    // --- WORD LENGTH FILTER  ---

    if (wordLengthFilters.length > 0) {
      const length = word.length;
      let lengthCategory = "";

      if (length <= 5) {
        lengthCategory = "Short (1-5)";
      } else if (length >= 6 && length <= 10) {
        lengthCategory = "Medium (6-10)";
      } else {
        lengthCategory = "Long (11+)";
      }
      // If the vocab's length category is NOT in the selected filter list, return false

      if (!wordLengthFilters.includes(lengthCategory)) {
        return false;
      }
    }
    // --- DATE RANGE FILTER  ---

    if (dateRange.from || dateRange.to) {
      const vocabDate = vocab.createdAt ? new Date(vocab.createdAt) : null;

      if (!vocabDate || isNaN(vocabDate.getTime())) {
        return false;
      }

      const filterFrom = dateRange.from ? new Date(dateRange.from) : null;
      let filterTo = dateRange.to ? new Date(dateRange.to) : null;

      if (filterTo) {
        filterTo.setHours(23, 59, 59, 999);
      }

      if (filterFrom && vocabDate < filterFrom) {
        return false;
      }

      if (filterTo && vocabDate > filterTo) {
        return false;
      }
    }
    // If the word passes all active filters, keep it.
    return true;
  });
}
