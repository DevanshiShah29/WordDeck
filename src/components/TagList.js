import React from "react";

// 1. Structure: Move the color configuration outside the component
const TAG_COLOR_MAP = {
  purple: {
    bgFrom: "from-purple-100",
    bgTo: "to-pink-100",
    hoverFrom: "hover:from-purple-200",
    hoverTo: "hover:to-pink-200",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  blue: {
    bgFrom: "from-blue-100",
    bgTo: "to-purple-100",
    text: "text-blue-700",
    border: "border-blue-200",
    hoverFrom: "hover:from-blue-200",
    hoverTo: "hover:to-purple-200",
  },
  // Extend this map for any other colors
};

/**
 * Renders a list of items as styled tags with a title and icon.
 * Preserves the original gradient styling.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - The icon element for the header.
 * @param {string} props.title - The title of the tag group (e.g., "Related Tags").
 * @param {Array<string>} props.items - The list of strings to render as tags.
 * @param {string} props.colors - The key for the color preset (e.g., "purple", "blue").
 */
export default function TagList({ icon, title, items, colors = "purple" }) {
  const color = TAG_COLOR_MAP[colors] || TAG_COLOR_MAP.purple;

  const validItems = Array.isArray(items) ? items.filter((i) => i) : [];

  if (validItems.length === 0) return null;

  const tagClasses = `
    px-3 py-2 
    bg-gradient-to-r 
    ${color.bgFrom} 
    ${color.bgTo} 
    ${color.text} 
    rounded-xl 
    text-md 
    font-medium 
    border 
    ${color.border} 
    ${color.hoverFrom} 
    ${color.hoverTo} 
    transition-all 
    duration-300
    hover:scale-[1.02]
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-slate-600">{icon}</div>{" "}
        {/* Added text-slate-600 for icon color consistency */}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      {/* Tag List */}
      <div className="flex flex-wrap gap-2">
        {validItems.map((tag, i) => (
          <span key={tag + i} className={tagClasses}>
            {title === "Tags" && <span className="opacity-70 mr-0.5">#</span>}
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
