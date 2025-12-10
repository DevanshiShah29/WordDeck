"use client";

import React, { useState } from "react";

export default function FilterPanel({ onSearch = () => {}, onFiltersChange = () => {} }) {
  const [q, setQ] = useState("");

  const handleSearch = (e) => {
    const v = e.target.value;
    setQ(v);
    onSearch(v);
  };

  return (
    <aside className="filter-panel h-full p-5 bg-white rounded-xl shadow-sm border border-[var(--slate-200)]">
      <div>
        <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">Search</label>
        <input
          value={q}
          onChange={handleSearch}
          placeholder="Search words..."
          className="w-full px-3 py-2 rounded-md border border-[var(--slate-200)] bg-[var(--slate-50)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        />
      </div>

      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-semibold text-[var(--slate-700)]">Filters</h4>

        <div className="text-sm text-[var(--slate-600)]">
          <div className="mt-2">
            <label className="block text-xs mb-1">Difficulty</label>
            <select
              onChange={(e) => onFiltersChange({ difficulty: e.target.value })}
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
              onChange={(e) => onFiltersChange({ type: e.target.value })}
              className="w-full py-2 px-2 rounded-md border border-[var(--slate-200)] bg-white"
            >
              <option value="">Any</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adj">Adjective</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
