"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function FilterPanel({ onSearch = () => {}, onFiltersChange = () => {} }) {
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  const handleSearch = (e) => {
    const v = e?.target?.value ?? e;
    setQ(v);
    onSearch(v);
  };

  const handleDifficulty = (v) => {
    setDifficulty(v);
    onFiltersChange({
      difficulty: v || undefined,
      type: type || undefined,
      bookmarked: bookmarked || undefined,
    });
  };

  const handleType = (v) => {
    setType(v);
    onFiltersChange({
      difficulty: difficulty || undefined,
      type: v || undefined,
      bookmarked: bookmarked || undefined,
    });
  };

  const handleBookmarked = (checked) => {
    setBookmarked(checked);
    onFiltersChange({
      difficulty: difficulty || undefined,
      type: type || undefined,
      bookmarked: checked || undefined,
    });
  };

  const resetFilters = () => {
    setDifficulty("");
    setType("");
    setBookmarked(false);
    onFiltersChange({ difficulty: undefined, type: undefined, bookmarked: undefined });
  };

  return (
    <aside className="filter-panel h-full p-5 bg-white rounded-xl shadow-sm border border-[var(--slate-200)]">
      <div>
        <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">Search</label>
        <SearchBar
          value={q}
          placeholder="Search words..."
          className="w-full"
          onChange={(e) => handleSearch(e)}
          onSearch={(v) => handleSearch(v)}
        />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--slate-700)]">Filters</h4>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[var(--slate-500)] hover:text-[var(--primary-600)]"
          >
            Reset
          </button>
        </div>

        <div className="text-sm text-[var(--slate-600)]">
          <div className="mt-2">
            <label className="block text-xs mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => handleDifficulty(e.target.value)}
              className="w-full py-2 px-2 rounded-md border border-[var(--slate-200)] bg-white"
            >
              <option value="">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-xs mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => handleType(e.target.value)}
              className="w-full py-2 px-2 rounded-md border border-[var(--slate-200)] bg-white"
            >
              <option value="">Any</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
            </select>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="filter-bookmarked"
              type="checkbox"
              checked={bookmarked}
              onChange={(e) => handleBookmarked(e.target.checked)}
              className="h-4 w-4 rounded border border-[var(--slate-200)]"
            />
            <label htmlFor="filter-bookmarked" className="text-sm text-[var(--slate-600)]">
              Bookmarked only
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
