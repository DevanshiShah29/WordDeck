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
      <div className="flex items-center w-full bg-white border border-slate-300 rounded-lg px-4 py-2  hover:border-slate-400 mb-3">
        <Search size={18} className="text-slate-400 mr-3" />
        <input
          type="text"
          placeholder="Search origins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-base text-slate-700 placeholder-slate-400"
          disabled={isLoading}
        />
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 text-blue-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span>Loading origins...</span>
        </div>
      )}
      {!isLoading && (
        <div className="max-h-40 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredOptions.map((origin) => {
              const isSelected = selectedOrigins.includes(origin);

              return (
                <Button
                  variant="transparent"
                  key={origin}
                  onClick={() => toggleSelection(origin)} // Conditional class application to merge styles and behavior
                  className={`
                        flex items-center // Essential for aligning text and icon
                        px-3 py-1 text-sm rounded-full transition 
                        ${
                          isSelected
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-slate-50 text-slate-700 hover:bg-blue-100"
                        }
                    `}
                >
                  {origin}
                  {/* Cross icon shown only if selected */}
                  {isSelected && (
                    <X size={14} className="ml-1.5 text-blue-800 hover:text-blue-900 transition" />
                  )}
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
