"use client";

import React, { useState, useEffect } from "react";

// Library Imports
import { X } from "lucide-react";

// Utility Imports
import { fetchWordOrigins } from "./helper";
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
  const [allOrigins, setAllOrigins] = useState([]);
  const [loadingOrigins, setLoadingOrigins] = useState(true);

  useEffect(() => {
    async function loadOrigins() {
      setLoadingOrigins(true);
      const origins = await fetchWordOrigins();
      setAllOrigins(origins);
      setLoadingOrigins(false);
    }

    loadOrigins();
  }, []);

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
        <div className="py-4 px-8 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Advance filters</h2>
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
          <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
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
          <OriginFilter
            selectedOrigins={selectedOrigins}
            setSelectedOrigins={setSelectedOrigins}
            allOrigins={allOrigins}
            isLoading={loadingOrigins}
          />
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
          <BookmarkedToggle
            isBookmarkedOnly={isBookmarkedOnly}
            setIsBookmarkedOnly={setIsBookmarkedOnly}
          />
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
