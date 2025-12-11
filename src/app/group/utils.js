// utils.js

export const transformSingleGroup = (group, groupDifficulty) => {
  const nodes = [];
  const edges = [];
  let nodeCounter = 1;
  let edgeCounter = 1;

  const rootWord = group[0];
  let rootNodeId = "";

  group.forEach((word) => {
    // Prefix ID with the word itself to ensure uniqueness across all mini-maps
    const nodeId = `n-${word}-${nodeCounter++}`;
    const difficulty = groupDifficulty;

    nodes.push({
      id: nodeId,
      position: { x: 0, y: 0 },
      data: {
        label: word,
        difficulty: difficulty,
      },
      type: "wordNode",
    });

    if (word === rootWord) {
      rootNodeId = nodeId;
    }
  });

  const nonRootNodes = nodes.filter((n) => n.id !== rootNodeId);

  nonRootNodes.forEach((node) => {
    edges.push({
      id: `e-sim-${edgeCounter++}`,
      source: rootNodeId,
      target: node.id,
      type: "similar",
      data: { type: "Similar" },
    });
  });

  return { nodes, edges };
};

/**
 * Converts a lowercase difficulty value (used for filtering) to a PascalCase
 * label (used for display and coloring in CustomWordNode).
 * @param {string | null} value - The lowercase difficulty string ("beginner", etc.)
 * @returns {string | null} - The PascalCase label ("Beginner", etc.) or null.
 */
export const mapDifficultyValueToLabel = (value) => {
  switch (value) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return null;
  }
};

/**
 * Applies all group filters (search, difficulty, connection, bookmark) to the group array.
 * This is the logic extracted from the original useMemo hook.
 *
 * @param {Array<Object>} groups - The array of group objects with enriched properties.
 * @param {string} search - The current search query (trimmed and lowercase).
 * @param {Object} filters - The object containing filter values (difficulty, type, connection, bookmarked).
 * @returns {Array<Object>} - The filtered array of groups.
 */
export const applyGroupFilters = (groups, search, filters) => {
  const { difficulty: filterDifficulty, connection, bookmarked } = filters;
  const q = search.trim().toLowerCase();

  return groups.filter((grp) => {
    // Search Filter
    if (q) {
      const matchesTitle = grp.title?.toLowerCase().includes(q);
      const matchesWord = (grp.words || []).some((s) => String(s).toLowerCase().includes(q));
      if (!matchesTitle && !matchesWord) return false;
    }

    //  Connection Strength Filter
    if (connection) {
      const minSize = parseInt(connection, 10);
      const groupSize = grp.words ? grp.words.length : 0;
      if (groupSize < minSize) return false;
    }

    // DIFFICULTY Filter (Checks against the lowercase filterableDifficulty)
    if (filterDifficulty) {
      if (grp.filterableDifficulty !== filterDifficulty) {
        return false;
      }
    }
    return true;
  });
};
