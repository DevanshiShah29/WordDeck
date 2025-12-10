// utils.js

export const transformSingleGroup = (group) => {
  const nodes = [];
  const edges = [];
  let nodeCounter = 1;
  let edgeCounter = 1;
  const difficultyColors = ["Beginner", "Intermediate", "Advanced"];
  const groupIndex = Math.floor(Math.random() * difficultyColors.length); // Use random index for unique color per group instance

  const rootWord = group[0];
  let rootNodeId = "";

  // --- 1. Create Nodes ---
  group.forEach((word) => {
    // Prefix ID with the word itself to ensure uniqueness across all mini-maps
    const nodeId = `n-${word}-${nodeCounter++}`;
    const difficulty = difficultyColors[groupIndex];

    nodes.push({
      id: nodeId,
      position: { x: 0, y: 0 },
      data: { label: word, difficulty: difficulty },
      type: "wordNode",
    });

    if (word === rootWord) {
      rootNodeId = nodeId;
    }
  });

  // --- 2. Create Edges ---
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
