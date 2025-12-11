// FilterPanel.js
"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";

// Constants for the new difficulty and connection options
const DIFFICULTY_OPTIONS = [
  { value: "", label: "All Level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const CONNECTION_OPTIONS = [
  { value: "", label: "Any" },
  { value: "3", label: "3+ Connections" },
  { value: "5", label: "5+ Connections" },
  { value: "10", label: "10+ Connections" },
];

export default function FilterPanel({ onSearch = () => {}, onFiltersChange = () => {} }) {
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState(false);
  const [connection, setConnection] = useState(""); // Helper function to bundle and send all filters

  const applyFilters = (newFilters = {}) => {
    onFiltersChange({
      difficulty:
        newFilters.difficulty !== undefined ? newFilters.difficulty : difficulty || undefined,
      connection:
        newFilters.connection !== undefined ? newFilters.connection : connection || undefined,
    });
  };

  const handleSearch = (e) => {
    const v = e?.target?.value ?? e;
    setQ(v);
    onSearch(v);
  };

  const handleConnection = (v) => {
    setConnection(v);
    applyFilters({ connection: v });
  }; // RESTORED FUNCTION

  const handleDifficulty = (v) => {
    setDifficulty(v);
    applyFilters({ difficulty: v });
  };

  const resetFilters = () => {
    setQ("");
    onSearch("");
    setConnection("");
    setBookmarked(false);
    onFiltersChange({
      difficulty: undefined,
      connection: undefined,
    });
  };

  return (
    <aside className="filter-panel h-full p-5 bg-white rounded-xl shadow-sm border border-[var(--slate-200)]">
      {" "}
      <div>
        {" "}
        <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">
          Search
        </label>{" "}
        <SearchBar
          value={q}
          placeholder="Search words..."
          className="w-full"
          onChange={(e) => handleSearch(e)}
          onSearch={(v) => handleSearch(v)}
        />{" "}
      </div>{" "}
      <div className="mt-6 space-y-3">
        {" "}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--slate-700)]">Filters</h4>{" "}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[var(--slate-500)] hover:text-[var(--primary-600)]"
          >
            Reset{" "}
          </button>{" "}
        </div>{" "}
        <div className="text-sm text-[var(--slate-600)]">
          {" "}
          <div className="mt-2">
            {/* DIFFICULTY LEVEL FILTER */}{" "}
            <label className="block text-xs mb-1">Difficulty Level</label>{" "}
            <select
              value={difficulty}
              onChange={(e) => handleDifficulty(e.target.value)}
              className="w-full py-2 px-2 rounded-md border border-[var(--slate-200)] bg-white"
            >
              {" "}
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          <div className="mt-3">
            {/* CONNECTION STRENGTH FILTER */}{" "}
            <label className="block text-xs mb-1">Connection Strength</label>{" "}
            <select
              value={connection}
              onChange={(e) => handleConnection(e.target.value)}
              className="w-full py-2 px-2 rounded-md border border-[var(--slate-200)] bg-white"
            >
              {" "}
              {CONNECTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
        </div>{" "}
      </div>{" "}
    </aside>
  );
}
