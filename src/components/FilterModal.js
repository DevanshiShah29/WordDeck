"use client";

import React, { useState, useCallback } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { TAG_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, difficultyColorMap } from "@/utils/constants";
import Button from "@/components/buttons/Button";

// --- Helper Component: Filter Section Wrapper ---
const FilterSection = ({ title, children }) => (
  <div className="border-b border-slate-200 last:border-b-0 pb-6 mb-6">
    <h3 className="text-lg font-semibold mb-4 text-slate-800  pl-3">{title}</h3>
    {children}
  </div>
);

// --- Helper Component: Type Filter Section ---
const TypeFilter = ({ selectedTypes, setSelectedTypes }) => {
  const [showAllTypes, setShowAllTypes] = useState(false);
  const visibleTypes = showAllTypes ? TYPE_OPTIONS : TYPE_OPTIONS.slice(0, 6);

  const toggleSelection = useCallback(
    (option) => {
      setSelectedTypes((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelectedTypes]
  );

  const toggleAllTypes = () => {
    setSelectedTypes((prev) => (prev.length === TYPE_OPTIONS.length ? [] : TYPE_OPTIONS));
  };

  return (
    <FilterSection title="Word Type">
      <div className="flex flex-col gap-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <input
            type="checkbox"
            checked={selectedTypes.length === TYPE_OPTIONS.length}
            onChange={toggleAllTypes}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-slate-800 font-bold">All Types</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleTypes.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => toggleSelection(type)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="capitalize text-slate-700">{type}</span>
          </label>
        ))}
      </div>

      {TYPE_OPTIONS.length > 6 && (
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

// --- Helper Component: Tag/Level/Generic Button Filter ---
const ButtonFilter = ({ title, options, selected, setSelected, colorMap = {} }) => {
  const toggleSelection = useCallback(
    (option) => {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelected]
  );

  return (
    <FilterSection title={title}>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const baseClasses = "px-4 py-2 font-medium transition-all text-sm shadow-sm";

          let colorClasses;
          if (title === "Difficulty Level") {
            const lowerCaseLevel = option.toLowerCase();
            // Get the color classes based on the lowercase key
            const levelColors = colorMap[lowerCaseLevel] || "bg-gray-100 text-gray-700";

            colorClasses = isSelected
              ? `${levelColors}`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200";
          } else {
            // Logic for Tags (fixed color)
            colorClasses = isSelected
              ? "bg-purple-600 shadow-md hover:bg-purple-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200";
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

// =========================================================================
//                             MAIN COMPONENT
// =========================================================================

export default function FilterModal({
  onClose,
  onFilterChange,
  typeFilter,
  tagFilter,
  levelFilter,
}) {
  // --- State Initialization ---
  const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
  const [selectedTags, setSelectedTags] = useState(tagFilter || []);
  const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // --- Actions ---
  const applyFilters = () => {
    onFilterChange?.({
      type: selectedTypes,
      tag: selectedTags,
      level: selectedLevels,
      dateRange,
    });
    onClose();
  };

  const clearAllFilters = () => {
    const defaultFilters = { type: [], tag: [], level: [], dateRange: { from: "", to: "" } };
    setSelectedTypes([]);
    setSelectedTags([]);
    setSelectedLevels([]);
    setDateRange(defaultFilters.dateRange);
    onFilterChange?.(defaultFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col relative transform transition-all duration-300 scale-95 md:scale-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Filter Vocabulary</h2>

          <Button
            variant="transparent"
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            aria-label="Close filter modal"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Body (scrollable content) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Date Range */}
          <FilterSection title="Date Added">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="From Date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 w-full focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <input
                type="date"
                placeholder="To Date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 w-full focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </FilterSection>

          {/* Type Filter */}
          <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />

          {/* Tag Filter */}
          <ButtonFilter
            title="Tags"
            options={TAG_OPTIONS}
            selected={selectedTags}
            setSelected={setSelectedTags}
          />

          {/* Level Filter */}
          <ButtonFilter
            title="Difficulty Level"
            options={LEVEL_OPTIONS}
            selected={selectedLevels}
            setSelected={setSelectedLevels}
            colorMap={difficultyColorMap}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <Button variant="secondary" onClick={clearAllFilters}>
            Clear All
          </Button>

          <Button variant="primary" onClick={applyFilters} className="">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
