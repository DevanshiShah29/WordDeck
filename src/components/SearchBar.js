// components/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

/**
 * A reusable component for a search input bar with an integrated Search icon.
 *
 * @param {object} props
 * @param {string} props.value - The current value of the input.
 * @param {function} props.onChange - Handler for input changes.
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {string} [props.className] - Optional Tailwind classes for the outer container.
 * @param {string} [props.inputClassName] - Optional Tailwind classes for the input element.
 * @param {number} [props.iconSize=20] - Size of the Search icon.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "md:flex-1", // Default to flexible width on desktop
  inputClassName = "",
  iconSize = 20,
}) {
  // Common styles applied to all instances
  const baseContainerClasses =
    "flex items-center w-full bg-white border border-[var(--slate-400)] rounded-lg px-4 py-3 hover:border-[var(--slate-400)]";

  const inputBaseClasses =
    "w-full outline-none text-base text-[var(--slate-700)] placeholder-[var(--slate-400)]";

  return (
    <div className={` ${className} ${baseContainerClasses}`}>
      <Search size={iconSize} className="text-[var(--slate-400)] mr-3" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={` ${inputClassName} ${inputBaseClasses}`}
      />
    </div>
  );
}
