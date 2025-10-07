"use client";
import React from "react";
import Select from "react-select";

/**
 * Custom wrapper for react-select styled for Tailwind consistency.
 *
 * @param {object} props
 * @param {string} props.value - The currently selected string value.
 * @param {(value: string) => void} props.onChange - Handler called when a new option is selected.
 * @param {string[]} props.options - Array of string values for the dropdown options.
 * @param {string} [props.placeholder] - Text to display when no value is selected.
 * @param {boolean} [props.isSearchable=true] - Whether the dropdown is searchable.
 * @param {string} [props.width="200px"] - CSS width value for the control and menu.
 */
export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  isSearchable = true,
  width = "200px",
}) {
  // Map string array to react-select's { label, value } format
  const formattedOptions = options.map((o) => ({ label: o, value: o }));

  // Format the current string value to react-select's format
  const selectedValue = value ? { label: value, value } : null;

  // Use the externalized styles function
  const componentStyles = customStyles({ width });

  return (
    <Select
      classNamePrefix="react-select"
      value={selectedValue}
      onChange={(option) => onChange(option.value)}
      options={formattedOptions}
      placeholder={placeholder || "Select..."}
      menuPortalTarget={document.body} // Good practice for modal/fixed headers
      isSearchable={isSearchable}
      styles={componentStyles}
    />
  );
}

// --- Externalized Styles Object ---
const customStyles = ({ width }) => ({
  control: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "4px 6px",
    // Tailwind's blue-500 and slate-300
    borderColor: state.isFocused ? "#3B82F6" : "#CBD5E1",
    // Tailwind's blue-500 with opacity
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.2)" : "none",
    minHeight: "44px",
    width, // Dynamic width passed from props
    "&:hover": { borderColor: "#3B82F6" },
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Ensure the dropdown is above everything
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.05), 0px 2px 6px rgba(0,0,0,0.03)",
    overflow: "hidden",
    width, // Dynamic width for the menu container
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    // Custom scrollbar styling (necessary because Tailwind doesn't handle this by default)
    scrollbarWidth: "thin",
    scrollbarColor: "#94a3b8 transparent", // slate-400
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-thumb": {
      background: "#94a3b8", // slate-400
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-track": { background: "transparent" },
  }),

  option: (base, state) => ({
    ...base,
    // Selected: blue-600, Focused: sky-100, Text Focused: cyan-700, Text Default: slate-800
    backgroundColor: state.isSelected ? "#2563EB" : state.isFocused ? "#E0F2FE" : "white",
    color: state.isSelected ? "white" : state.isFocused ? "#0369A1" : "#1E293B",
    padding: "10px",
    cursor: "pointer",
  }),
});
