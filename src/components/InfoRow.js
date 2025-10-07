import React from "react";
import { difficultyColorMap } from "@/utils/constants";

/**
 * Renders a key-value pair row, optionally highlighting the value for 'difficulty' type.
 *
 * @param {object} props
 * @param {string} props.label - The label/key for the information (e.g., "Origin").
 * @param {string} props.value - The value of the information (e.g., "Latin").
 * @param {React.ReactNode} [props.icon] - An optional icon for non-difficulty rows.
 * @param {string} [props.type] - A special type identifier (e.g., "difficulty") to trigger specific styling.
 */
export default function InfoRow({ label, value, icon, type }) {
  if (!value) return null;

  if (type === "difficulty") {
    const colorKey = value.toLowerCase();
    const colors = difficultyColorMap[colorKey] || "bg-gray-100 text-gray-700 border-gray-300";

    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-md font-medium text-slate-700">{label}</span>

        <span
          className={`
            inline-flex items-center 
            px-3 py-1.5 
            rounded-lg 
            text-sm font-bold 
            border-2 
            shadow-sm 
            capitalize 
            ${colors}
          `}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-md font-medium text-slate-700">{label}</span>

      <div className="flex items-center gap-1">
        {icon && <div className="flex items-center justify-center text-slate-500 mr-1">{icon}</div>}
        <span className="text-md font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
