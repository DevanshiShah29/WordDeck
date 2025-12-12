// CustomRelationshipEdge.jsx

import React from "react";

export default function CustomRelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd = null,
}) {
  // vector from source -> target
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.max(Math.hypot(dx, dy), 1); // normalized perpendicular vector (points "out" of the segment)

  const nx = -dy / dist;
  const ny = dx / dist;
  //  Reduced Curvature Factor: Smaller value for a gentler, straighter curve.

  const CURVATURE_FACTOR = 0.05;
  // Significantly reduced from 0.25
  // Minimum offset is reduced to keep edges close, but still separated.
  const offset = Math.max(10, dist * CURVATURE_FACTOR);
  // pick direction from id hash so some edges curve one way, others opposite

  const idHash = (id || "").split("").reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) | 0, 0);
  const dir = idHash % 2 === 0 ? 1 : -1;
  // 2. Control Point Ratio: Moving control points closer to the center of the line
  // helps flatten the curve. Keeping it around 0.4-0.5 is good for stability.

  const cpRatio = 0.45;
  // Close to 0.5 for an almost straight, central control point
  // Calculate control points (Cubic Bézier formula)

  const cp1x = sourceX + dx * cpRatio + nx * offset * dir;
  const cp1y = sourceY + dy * cpRatio + ny * offset * dir;
  const cp2x = targetX - dx * cpRatio + nx * offset * dir;
  const cp2y = targetY - dy * cpRatio + ny * offset * dir;
  // SVG Path definition

  const d = `M ${sourceX},${sourceY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${targetX},${targetY}`; // --- OPTIMIZED FOR GRAY COLOR AND SUBTLE LOOK --- // Use a subtle, dark gray (e.g., Slate-600) for the stroke.

  const stroke = style.stroke ?? "rgba(71, 85, 105, 0.8)";
  // Subtle Gray (Slate-600 with 80% opacity)
  const strokeWidth = style.strokeWidth ?? 1.5;
  // Thinner line

  return (
    <g className="custom-edge-group" data-id={id} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pointerEvents: "none",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.05))",
          ...style,
        }}
        markerEnd={markerEnd}
      />
      {/* hit area for pointer interactions */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(12, strokeWidth * 6)}
        style={{ cursor: "pointer", pointerEvents: "stroke" }}
      />
    </g>
  );
}
