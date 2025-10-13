import React, { useState, useCallback } from "react";

// Library Imports
import { ChevronDown, ChevronUp } from "lucide-react";

// Component Imports
import FilterSection from "./FilterSection";
import Button from "../buttons/Button";

// Constants
import { TYPE_OPTIONS_DROPDOWN } from "@/utils/constants";

const TYPE_VALUES = TYPE_OPTIONS_DROPDOWN.map((option) => option.value);

const TypeFilter = ({ selectedTypes, setSelectedTypes }) => {
  const [showAllTypes, setShowAllTypes] = useState(false);
  const visibleTypes = showAllTypes ? TYPE_OPTIONS_DROPDOWN : TYPE_OPTIONS_DROPDOWN.slice(0, 6);

  const toggleSelection = useCallback(
    (option) => {
      setSelectedTypes((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelectedTypes]
  );

  const clearTypes = () => setSelectedTypes([]);

  const toggleAllTypes = () => {
    setSelectedTypes((prev) => (prev.length === TYPE_VALUES.length ? [] : TYPE_VALUES));
  };

  return (
    <FilterSection title="Word Type" selectedCount={selectedTypes.length} onClear={clearTypes}>
      <div className="flex flex-col gap-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <input
            type="checkbox"
            checked={selectedTypes.length === TYPE_VALUES.length}
            onChange={toggleAllTypes}
            className="w-5 h-5  border-gray-300 rounded  cursor-pointer accent-blue-600"
          />
          <span className="text-slate-800 font-bold">All Types</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleTypes.map((typeOption) => (
          <label
            key={typeOption.value}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <input
              type="checkbox"
              id={typeOption.value}
              checked={selectedTypes.includes(typeOption.value)}
              onChange={() => toggleSelection(typeOption.value)}
              className="w-5 h-5  border-gray-300 rounded cursor-pointer accent-blue-600"
            />
            <span className="capitalize text-slate-700">{typeOption.label}</span>
          </label>
        ))}
      </div>

      {TYPE_OPTIONS_DROPDOWN.length > 6 && (
        <Button
          variant="transparent"
          onClick={() => setShowAllTypes((prev) => !prev)}
          className="flex items-center gap-1 mt-4 text-blue-600 hover:text-blue-800 transition text-sm font-medium outline-none "
        >
          {showAllTypes ? "See Less" : "See More"}
          {showAllTypes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      )}
    </FilterSection>
  );
};

export default TypeFilter;
