"use client";

import React, { useState, useEffect } from "react";

// Library Imports
import { X, RotateCcw } from "lucide-react";

// Utility Imports
import { LEVEL_OPTIONS, difficultyColorMap, WORD_LENGTH_OPTIONS } from "@/utils/constants";

// Component Imports
import Button from "@/components/buttons/Button";
import FilterSection from "./FilterSection";
import TypeFilter from "./TypeFilter";
import OriginFilter from "./FilterOrigin";
import BookmarkedToggle from "./BookmarkToggle";
import FilterDifficulty from "./FilterDifficulty";

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
  const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
  const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
  const [selectedOrigins, setSelectedOrigins] = useState(originFilter || []);
  const [selectedWordLengths, setSelectedWordLengths] = useState(wordLengthFilter || []);
  const [isBookmarkedOnly, setIsBookmarkedOnly] = useState(isBookmarked || false);
  const [dateRange, setDateRange] = useState(dateRangeFilter || { from: "", to: "" });

  // Actions
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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const MODAL_CONTAINER_CLASSES =
    "bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col relative transform transition-all duration-300 scale-95 md:scale-100";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={MODAL_CONTAINER_CLASSES}>
        {/* Header */}
        <div className="py-4 px-8 border-b border-[var(--slate-200)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--slate-800)]">Advance filters</h2>
          <Button
            variant="transparent"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--slate-500)] hover:text-[var(--slate-800)] hover:bg-slate-100 transition"
            aria-label="Close filter modal"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Body (scrollable content) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <FilterDifficulty
            title="Difficulty Level"
            options={LEVEL_OPTIONS}
            selected={selectedLevels}
            setSelected={setSelectedLevels}
            colorMap={difficultyColorMap}
          />
          <FilterDifficulty
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
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="date"
                placeholder="From Date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="flex-1 px-4 py-2 border border-[var(--slate-300)] rounded-lg w-full 
                 focus:ring-2 focus:ring-[var(--primary)] transition-colors 
                 appearance-none text-[var(--slate-700)]"
              />
              <input
                type="date"
                placeholder="To Date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="flex-1 px-4 py-2 border border-[var(--slate-300)] rounded-lg w-full 
                 focus:ring-2 focus:ring-[var(--primary)] transition-colors 
                 appearance-none  text-[var(--slate-700)]"
              />
            </div>
          </FilterSection>
          <BookmarkedToggle
            isBookmarkedOnly={isBookmarkedOnly}
            setIsBookmarkedOnly={setIsBookmarkedOnly}
          />
          <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-[var(--slate-200)] bg-white">
          <Button variant="secondary" onClick={clearAllFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
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
