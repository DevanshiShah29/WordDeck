import React, { useState } from "react";

// Library Imports
import Button from "../buttons/Button";
import { X } from "lucide-react";

// Component Imports
import FilterSection from "./FilterSection";
import SearchBar from "../SearchBar";

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

      <SearchBar
        iconSize={18}
        placeholder="Search origins..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-3 py-1"
        inputClassName="text-sm"
      />

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
                        flex items-center px-3 py-1 text-sm rounded-full transition 
                        ${
                          isSelected
                            ? "bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-200)]"
                            : "bg-slate-50 text-[var(--slate-700)] hover:bg-[var(--primary-100)]"
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
