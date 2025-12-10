// CustomRelationshipEdge.jsx

import React from "react";
import { getBezierPath, BaseEdge, EdgeLabelRenderer } from "reactflow";

export const CustomRelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data, // Contains { type: 'Similar' | 'Opposite' }
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Define styling based on the edge type
  let strokeColor = "#9ca3af"; // Similar (Gray)
  let strokeDasharray = undefined;
  let strokeWidth = 1;

  if (data?.type === "Opposite") {
    strokeColor = "#ef4444"; // Opposite (Red)
    strokeDasharray = "5 5";
    strokeWidth = 2;
  }

  // The BaseEdge component handles rendering the path correctly
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: strokeColor, strokeDasharray, strokeWidth }}
      />
    </>
  );
};
