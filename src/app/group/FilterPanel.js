// FilterPanel.js
"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { ChevronDown, Zap, Link } from "lucide-react";
import Button from "@/components/buttons/Button";

// Filter Constants
const DIFFICULTY_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const CONNECTION_OPTIONS = [
  { value: "", label: "All Strengths" },
  { value: "3", label: "3+ connections" },
  { value: "5", label: "5+ connections" },
  { value: "10", label: "10+ connections" },
];

// Component for Collapsible Filter Section
const FilterSection = ({ title, children, defaultOpen = true, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--slate-200)] py-3 last:border-b-0">
      <button
        className="w-full flex items-center justify-between text-sm font-semibold text-[var(--slate-700)] hover:text-[var(--primary-600)]"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-[var(--slate-500)]" />} {title}
        </span>

        <ChevronDown
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pt-2" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default function FilterPanel({ onSearch = () => {}, onFiltersChange = () => {} }) {
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [connection, setConnection] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  const applyFilters = (newFilters = {}) => {
    const currentFilters = { difficulty, connection, bookmarked };
    const mergedFilters = { ...currentFilters, ...newFilters };

    onFiltersChange({
      difficulty: mergedFilters.difficulty || undefined,
      connection: mergedFilters.connection || undefined,
      bookmarked: mergedFilters.bookmarked || undefined,
    });
  };

  const handleSearch = (e) => {
    const v = e?.target?.value ?? e;
    setQ(v);
    onSearch(v);
  };

  const handleDifficulty = (v) => {
    setDifficulty(v);
    applyFilters({ difficulty: v });
  };

  const handleConnection = (v) => {
    setConnection(v);
    applyFilters({ connection: v });
  };

  const resetFilters = () => {
    setQ("");
    onSearch("");
    setDifficulty("");
    setConnection("");
    setBookmarked(false);
    onFiltersChange({ difficulty: undefined, connection: undefined, bookmarked: undefined });
  };

  return (
    <aside className="h-auto md:h-[100vh] filter-panel flex flex-col bg-white rounded-xl shadow-sm border border-[var(--slate-200)] sticky top-6">
      {/* Scrollable Content Wrapper */}
      <div className="flex-grow overflow-y-auto p-5 thin-scrollbar">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--slate-200)]">
          <h3 className="text-base font-semibold text-[var(--slate-700)]">Filters</h3>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-[var(--slate-500)] hover:text-[var(--primary-600)]"
          >
            Reset
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="mb-6">
          <SearchBar
            value={q}
            placeholder="Search words..."
            className="w-full py-1"
            onChange={(e) => handleSearch(e)}
            onSearch={(v) => handleSearch(v)}
          />
        </div>

        <h4 className="text-sm font-bold text-[var(--slate-700)] mb-3">QUICK ACTIONS</h4>

        {/* Filter Accordions */}
        <div className="space-y-1">
          <FilterSection title="Difficulty Level" icon={Zap} defaultOpen={true}>
            <ul className="text-sm space-y-1">
              {DIFFICULTY_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  className={`py-2 px-3 rounded-md cursor-pointer flex items-center gap-2 ${
                    difficulty === option.value
                      ? "bg-[var(--primary-100)] text-[var(--primary-700)] font-semibold"
                      : "text-[var(--slate-600)] hover:bg-[var(--slate-100)]"
                  }`}
                  onClick={() => handleDifficulty(option.value)}
                >
                  {option.label === "Beginner" ? (
                    <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                  ) : option.label === "Intermediate" ? (
                    <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                  ) : option.label === "Advanced" ? (
                    <span className="bg-red-500 h-2 w-2 rounded-full"></span>
                  ) : option.label === "All Levels" ? (
                    <span className="bg-slate-500 h-2 w-2 rounded-full"></span>
                  ) : null}
                  {option.label}
                </li>
              ))}
            </ul>
          </FilterSection>

          {/* Connection Strength */}
          <FilterSection title="Connection Strength" icon={Link} defaultOpen={false}>
            <ul className="text-sm space-y-1">
              {CONNECTION_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  className={`py-2 px-3 rounded-md cursor-pointer ${
                    connection === option.value
                      ? "bg-[var(--primary-100)] text-[var(--primary-700)] font-semibold"
                      : "text-[var(--slate-600)] hover:bg-[var(--slate-100)]"
                  }`}
                  onClick={() => handleConnection(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </FilterSection>
        </div>
      </div>
      {/* Footer Button - Fixed at the bottom of the FilterPanel */}
      <div className="p-5 border-t border-[var(--slate-200)] sticky bottom-0 bg-white">
        <Button className="w-full py-2 px-4 rounded-lg bg-[var(--primary-600)] text-white font-semibold hover:bg-[var(--primary-700)] transition">
          Generate
        </Button>
      </div>
    </aside>
  );
}
