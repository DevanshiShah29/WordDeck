import React, { useCallback } from "react";
import Button from "../buttons/Button";

// Component Imports
import FilterSection from "./FilterSection";

const FilterDifficulty = ({ title, options, selected, setSelected, colorMap = {} }) => {
  const toggleSelection = useCallback(
    (option) => {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelected]
  );

  const clearSelection = () => setSelected([]);

  return (
    <FilterSection title={title} selectedCount={selected.length} onClear={clearSelection}>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const baseClasses =
            "w-full px-4 py-2 font-medium transition-all text-sm shadow-sm rounded-lg";

          let colorClasses;

          if (title === "Difficulty Level") {
            const lowerCaseLevel = option.toLowerCase();
            const levelColors =
              colorMap[lowerCaseLevel] || "bg-slate-100 text-slate-700 hover:bg-slate-200";

            colorClasses = isSelected
              ? levelColors
              : "bg-slate-100 text-slate-700 hover:bg-slate-200";
          } else {
            colorClasses = isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200";
          }

          return (
            <Button
              variant="transparent"
              key={option}
              onClick={() => toggleSelection(option)}
              className={`${baseClasses} ${colorClasses}`}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </FilterSection>
  );
};

export default FilterDifficulty;
