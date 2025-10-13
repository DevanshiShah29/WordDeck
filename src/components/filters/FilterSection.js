import React from "react";

// Component Imports
import ClearButton from "./ClearButton";

const FilterSection = ({ title, children, onClear, selectedCount = 0 }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {selectedCount > 0 && <ClearButton onClick={onClear} />}
    </div>
    {children}
  </div>
);

export default FilterSection;
