import React, { useState } from "react";

// Library Imports
import Button from "../buttons/Button";
import { X, Search, Loader2 } from "lucide-react";

// Component Imports
import FilterSection from "./FilterSection";

const OriginFilter = ({ selectedOrigins, setSelectedOrigins, allOrigins, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = allOrigins
    .filter((origin) => origin.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

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
          disabled={isLoading} // Disable search while loading
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 text-blue-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span>Loading origins...</span>
        </div>
      )}

      {/* Selected Chips */}
      {!isLoading &&
        selectedOrigins.length > 0 && ( // Hide chips while loading
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
      {!isLoading && (
        <div className="max-h-40 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredOptions.map((origin) => {
              const isSelected = selectedOrigins.includes(origin);
              if (isSelected) return null;

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
      )}
    </FilterSection>
  );
};

export default OriginFilter;
