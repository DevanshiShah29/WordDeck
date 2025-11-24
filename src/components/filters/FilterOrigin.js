import React, { useState } from "react";

// Library Imports
import Button from "../buttons/Button";
import { X, Search } from "lucide-react";

// Component Imports
import FilterSection from "./FilterSection";

import { ORIGIN_OPTIONS } from "@/utils/constants";

const OriginFilter = ({ selectedOrigins, setSelectedOrigins, allOrigins }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = ORIGIN_OPTIONS.filter((origin) =>
    origin.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20);

  const toggleSelection = (origin) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
    setSearchTerm("");
  };

  const clearOrigins = () => setSelectedOrigins([]);

  return (
    <FilterSection
      title="Word Origin"
      selectedCount={selectedOrigins.length}
      onClear={clearOrigins}
    >
      {/* Search Input */}
      <div className="flex items-center w-full bg-white border border-[var(--slate-300)] rounded-lg px-4 py-2  hover:border-[var(--slate-300)] mb-3">
        <Search size={18} className="text-[var(--slate-300)] mr-3" />
        <input
          type="text"
          placeholder="Search origins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-base text-slate-700 placeholder-[var(--slate-300)]"
        />
      </div>

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
                            ? "bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-200)]"
                            : "bg-slate-50 text-slate-700 hover:bg-[var(--primary-100)]"
                        }
                    `}
              >
                {origin}
                {/* Cross icon shown only if selected */}
                {isSelected && (
                  <X size={14} className="ml-1.5 text-[var(--primary-700)]  transition" />
                )}
              </Button>
            );
          })}
        </div>
        {searchTerm && filteredOptions.length === 0 && (
          <p className="text-sm text-[var(--slate-500)] p-2">
            No origins found matching &quot;{searchTerm} &quot;
          </p>
        )}
      </div>
    </FilterSection>
  );
};

export default OriginFilter;
