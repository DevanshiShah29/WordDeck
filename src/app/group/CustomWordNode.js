// CustomWordNode.jsx

import React from "react";
import { Handle, Position } from "reactflow";

// Use the same colors as the transformer
const difficultyColors = {
  Beginner: "#10B981", // Tailwind Green-500
  Intermediate: "#3B82F6", // Tailwind Blue-500
  Advanced: "#A855F7", // Tailwind Violet-500
};

export default function CustomWordNode({ id, data, selected }) {
  const label = data?.label ?? data?.title ?? "word";

  // Use a default color if difficulty isn't set, otherwise use the specific color
  const nodeColor = difficultyColors[data.difficulty] || "#64748B"; // Slate-500 for default

  // --- Styles for the inner container (The circle itself) ---
  const containerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%", // Keep the circle shape
    pointerEvents: "auto",
    cursor: "grab",
    userSelect: "none",

    // Background: Use the difficulty color
    background: nodeColor,
    color: "#FFFFFF", // High contrast white text
    fontWeight: 700,
    fontSize: 12,

    // Transition for smooth selection feedback
    transition: "all 0.2s ease-in-out",

    // Selection feedback: Stronger ring and shadow
    border: `3px solid ${selected ? "#FFFFFF" : nodeColor}`,
    boxShadow: selected
      ? `0 0 0 4px ${nodeColor}, 0 4px 12px rgba(0,0,0,0.2)`
      : "0 2px 4px rgba(0,0,0,0.1)", // Subtle default shadow
  };

  // --- Styles for the text wrapper ---
  const labelWrapperStyle = {
    padding: 6, // Removes the inner padding for a tight fit
    margin: 6, // Ensures no margin adds extra space
    textAlign: "center",
    lineHeight: 1.2, // Adjust line height for better vertical centering of text
  };

  return (
    <div id={id} className={`word-node-inner ${selected ? "selected" : ""}`} style={containerStyle}>
      <div style={labelWrapperStyle}>{label}</div>

      <Handle type="target" position={Position.Center} style={{ visibility: "hidden" }} />
      <Handle type="source" position={Position.Center} style={{ visibility: "hidden" }} />
    </div>
  );
}
