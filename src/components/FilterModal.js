"use client";

import React, { useState, useCallback } from "react";
import { X, ChevronDown, ChevronUp, Search, Bookmark } from "lucide-react";
import {
  LEVEL_OPTIONS,
  TYPE_OPTIONS,
  difficultyColorMap,
  WORD_LENGTH_OPTIONS,
  ORIGIN_OPTIONS,
} from "@/utils/constants";
import Button from "@/components/buttons/Button";

// --- Helper Component: Clear Button ---
const ClearButton = ({ onClick }) => (
  <Button
    variant="transparent"
    onClick={onClick}
    className="text-sm font-medium text-red-500 hover:text-red-700 p-1 transition"
  >
    Clear
  </Button>
);

// --- Helper Component: Filter Section Wrapper ---
const FilterSection = ({ title, children, onClear, selectedCount = 0 }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {selectedCount > 0 && <ClearButton onClick={onClear} />}
    </div>
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

  const clearTypes = () => setSelectedTypes([]);

  const toggleAllTypes = () => {
    setSelectedTypes((prev) => (prev.length === TYPE_OPTIONS.length ? [] : TYPE_OPTIONS));
  };

  return (
    <FilterSection title="Word Type" selectedCount={selectedTypes.length} onClear={clearTypes}>
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

// --- Helper Component: Button Filter (Level/Length) ---
const ButtonFilter = ({ title, options, selected, setSelected, colorMap = {} }) => {
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
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const baseClasses = "px-4 py-2 font-medium transition-all text-sm shadow-sm rounded-lg";

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

const OriginFilter = ({ selectedOrigins, setSelectedOrigins }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = ORIGIN_OPTIONS.filter((origin) =>
    origin.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const toggleSelection = (origin) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
    setSearchTerm("");
  };

  const removeChip = (origin) => {
    setSelectedOrigins((prev) => prev.filter((o) => o !== origin));
  };

  const clearOrigins = () => setSelectedOrigins([]);

  return (
    <FilterSection
      title="Word Origin"
      selectedCount={selectedOrigins.length}
      onClear={clearOrigins}
    >
      {/* Search Input */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search origins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Selected Chips */}
      {selectedOrigins.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-2 border-b border-slate-100">
          {selectedOrigins.map((origin) => (
            <div
              key={origin}
              className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer"
              onClick={() => removeChip(origin)}
            >
              {origin}
              <X size={14} className="ml-1.5 hover:text-blue-900 transition" />
            </div>
          ))}
        </div>
      )}

      {/* Options List */}
      <div className="max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {filteredOptions.map((origin) => {
            const isSelected = selectedOrigins.includes(origin);
            if (isSelected) return null; // Hide selected origins from the list

            return (
              <Button
                variant="transparent"
                key={origin}
                onClick={() => toggleSelection(origin)}
                className="px-3 py-1 text-sm bg-slate-50 text-slate-700 hover:bg-blue-100 rounded-lg transition"
              >
                {origin}
              </Button>
            );
          })}
        </div>
        {searchTerm && filteredOptions.length === 0 && (
          <p className="text-sm text-slate-500 p-2">No origins found matching "{searchTerm}"</p>
        )}
      </div>
    </FilterSection>
  );
};

// --- Helper Component: Bookmarked Only Toggle ---
const BookmarkedToggle = ({ isBookmarkedOnly, setIsBookmarkedOnly }) => {
  const clearBookmark = () => setIsBookmarkedOnly(false);

  return (
    <FilterSection
      title="Collection Status"
      selectedCount={isBookmarkedOnly ? 1 : 0}
      onClear={clearBookmark}
    >
      <div
        onClick={() => setIsBookmarkedOnly((prev) => !prev)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
          isBookmarkedOnly
            ? "bg-yellow-100 border border-yellow-300"
            : "bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <Bookmark
          size={20}
          className={isBookmarkedOnly ? "text-yellow-600 fill-yellow-600" : "text-slate-500"}
        />
        <span className={`font-medium ${isBookmarkedOnly ? "text-yellow-800" : "text-slate-700"}`}>
          Show Bookmarked Words Only
        </span>
      </div>
    </FilterSection>
  );
};

export default function FilterModal({
  onClose,
  onFilterChange,
  typeFilter,
  levelFilter,
  originFilter,
  wordLengthFilter,
  isBookmarked,
  dateRangeFilter,
}) {
  // --- State Initialization ---
  const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
  const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
  const [selectedOrigins, setSelectedOrigins] = useState(originFilter || []);
  const [selectedWordLengths, setSelectedWordLengths] = useState(wordLengthFilter || []);
  const [isBookmarkedOnly, setIsBookmarkedOnly] = useState(isBookmarked || false);
  const [dateRange, setDateRange] = useState(dateRangeFilter || { from: "", to: "" });

  // --- Actions ---
  const applyFilters = () => {
    onFilterChange?.({
      type: selectedTypes,
      level: selectedLevels,
      origin: selectedOrigins,
      wordLength: selectedWordLengths,
      isBookmarked: isBookmarkedOnly,
      dateRange,
    });
    onClose();
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      type: [],
      level: [],
      origin: [],
      wordLength: [],
      isBookmarked: false,
      dateRange: { from: "", to: "" },
    };
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSelectedOrigins([]);
    setSelectedWordLengths([]);
    setIsBookmarkedOnly(false);
    setDateRange(defaultFilters.dateRange);
    onFilterChange?.(defaultFilters);
    onClose();
  };

  const MODAL_CONTAINER_CLASSES =
    "bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col relative transform transition-all duration-300 scale-95 md:scale-100";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={MODAL_CONTAINER_CLASSES}>
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
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <BookmarkedToggle
            isBookmarkedOnly={isBookmarkedOnly}
            setIsBookmarkedOnly={setIsBookmarkedOnly}
          />
          <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
          <ButtonFilter
            title="Difficulty Level"
            options={LEVEL_OPTIONS}
            selected={selectedLevels}
            setSelected={setSelectedLevels}
            colorMap={difficultyColorMap}
          />
          <ButtonFilter
            title="Word Length"
            options={WORD_LENGTH_OPTIONS}
            selected={selectedWordLengths}
            setSelected={setSelectedWordLengths}
          />
          <OriginFilter selectedOrigins={selectedOrigins} setSelectedOrigins={setSelectedOrigins} />
          {/* Date Range */}
          <FilterSection
            title="Date Added"
            selectedCount={dateRange.from || dateRange.to ? 1 : 0}
            onClear={() => setDateRange({ from: "", to: "" })}
          >
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-white">
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
