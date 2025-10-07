// // "use client";

// // import React, { useState } from "react";
// // import { X, ChevronDown, ChevronUp } from "lucide-react";
// // import { TAG_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, difficultyColorMap } from "@/utils/constants";

// // export default function FilterModal({
// //   onClose,
// //   onFilterChange,
// //   typeFilter,
// //   tagFilter,
// //   levelFilter,
// // }) {
// //   const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
// //   const [selectedTags, setSelectedTags] = useState(tagFilter || []);
// //   const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
// //   const [showAllTypes, setShowAllTypes] = useState(false);
// //   const [dateRange, setDateRange] = useState({ from: "", to: "" });

// //   const toggleSelection = (option, selected, setSelected) => {
// //     if (selected.includes(option)) {
// //       setSelected(selected.filter((o) => o !== option));
// //     } else {
// //       setSelected([...selected, option]);
// //     }
// //   };

// //   const toggleAllTypes = () => {
// //     if (selectedTypes.length === TYPE_OPTIONS.length) {
// //       setSelectedTypes([]);
// //     } else {
// //       setSelectedTypes(TYPE_OPTIONS);
// //     }
// //   };

// //   const applyFilters = () => {
// //     onFilterChange?.({
// //       type: selectedTypes,
// //       tag: selectedTags,
// //       level: selectedLevels,
// //       dateRange,
// //     });
// //     onClose();
// //   };

// //   const clearAllFilters = () => {
// //     setSelectedTypes([]);
// //     setSelectedTags([]);
// //     setSelectedLevels([]);
// //     setDateRange({ from: "", to: "" });
// //     onFilterChange?.({ type: [], tag: [], level: [], dateRange: { from: "", to: "" } });
// //     onClose();
// //   };

// //   const toggleTag = (tag) => {
// //     setSelectedTags((prev) =>
// //       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
// //     );
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[80%] flex flex-col relative">
// //         {/* Header */}
// //         <div className="p-6 border-b">
// //           <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
// //           <button
// //             onClick={onClose}
// //             className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
// //           >
// //             <X size={22} />
// //           </button>
// //         </div>

// //         {/* Body (scrollable) */}
// //         <div className="flex-1 overflow-y-auto p-6 text-slate-700">
// //           {/* Date Range */}
// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-3">Date Range</h3>
// //             <div className="flex gap-3">
// //               <input
// //                 type="date"
// //                 value={dateRange.from}
// //                 onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
// //                 className="px-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
// //               />
// //               <input
// //                 type="date"
// //                 value={dateRange.to}
// //                 onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
// //                 className="px-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Types */}
// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-3">Types</h3>
// //             <label className="flex items-center gap-2 mb-2 cursor-pointer">
// //               <input
// //                 type="checkbox"
// //                 checked={selectedTypes.length === TYPE_OPTIONS.length}
// //                 onChange={toggleAllTypes}
// //                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //               />
// //               <span className="text-gray-700 font-medium">All Types</span>
// //             </label>

// //             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //               {(showAllTypes ? TYPE_OPTIONS : TYPE_OPTIONS.slice(0, 6)).map((type) => (
// //                 <label key={type} className="flex items-center gap-2 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedTypes.includes(type)}
// //                     onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
// //                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                   />
// //                   <span>{type}</span>
// //                 </label>
// //               ))}
// //             </div>

// //             <button
// //               onClick={() => setShowAllTypes(!showAllTypes)}
// //               className="text-blue-600 text-sm flex items-center gap-1 mt-2"
// //             >
// //               {showAllTypes ? (
// //                 <>
// //                   See Less <ChevronUp size={14} />
// //                 </>
// //               ) : (
// //                 <>
// //                   See More <ChevronDown size={14} />
// //                 </>
// //               )}
// //             </button>
// //           </div>

// //           {/* Tags */}
// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-3">Tags</h3>
// //             <div className="flex flex-wrap gap-2">
// //               {TAG_OPTIONS.map((tag) => (
// //                 <button
// //                   key={tag}
// //                   onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
// //                   className={`px-3 py-1 rounded-full border transition ${
// //                     selectedTags.includes(tag)
// //                       ? "bg-purple-600 text-white border-purple-600"
// //                       : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
// //                   }`}
// //                 >
// //                   {tag}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Levels */}
// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-3">Levels</h3>
// //             <div className="flex gap-3">
// //               {LEVEL_OPTIONS.map((level) => (
// //                 <button
// //                   key={level}
// //                   onClick={() => toggleSelection(level, selectedLevels, setSelectedLevels)}
// //                   className={`flex-1 px-4 py-2 rounded-xl border transition ${
// //                     selectedLevels.includes(level)
// //                       ? difficultyColorMap[level]
// //                       : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
// //                   }`}
// //                 >
// //                   {level}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="flex justify-end gap-3 border-t p-6">
// //           <button
// //             onClick={clearAllFilters}
// //             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
// //           >
// //             Clear All
// //           </button>
// //           <button
// //             onClick={applyFilters}
// //             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
// //           >
// //             Apply Filters
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import { X, ChevronDown, ChevronUp } from "lucide-react";
// import { TAG_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, difficultyColorMap } from "@/utils/constants";

// export default function FilterModal({
//   onClose,
//   onFilterChange,
//   typeFilter,
//   tagFilter,
//   levelFilter,
// }) {
//   const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
//   const [selectedTags, setSelectedTags] = useState(tagFilter || []);
//   const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
//   const [showAllTypes, setShowAllTypes] = useState(false);
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });

//   const toggleSelection = (option, selected, setSelected) => {
//     if (selected.includes(option)) {
//       setSelected(selected.filter((o) => o !== option));
//     } else {
//       setSelected([...selected, option]);
//     }
//   };

//   const toggleAllTypes = () => {
//     if (selectedTypes.length === TYPE_OPTIONS.length) {
//       setSelectedTypes([]);
//     } else {
//       setSelectedTypes(TYPE_OPTIONS);
//     }
//   };

//   const applyFilters = () => {
//     onFilterChange?.({
//       type: selectedTypes,
//       tag: selectedTags,
//       level: selectedLevels,
//       dateRange,
//     });
//     onClose();
//   };

//   const clearAllFilters = () => {
//     setSelectedTypes([]);
//     setSelectedTags([]);
//     setSelectedLevels([]);
//     setDateRange({ from: "", to: "" });
//     onFilterChange?.({ type: [], tag: [], level: [], dateRange: { from: "", to: "" } });
//     onClose();
//   };

//   // Adjusted `visibleTypes` based on the state for better readability
//   const visibleTypes = showAllTypes ? TYPE_OPTIONS : TYPE_OPTIONS.slice(0, 6);

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl h-[90%] md:h-[80%] flex flex-col relative">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-200 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Body (scrollable content) */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
//           {/* Date Range */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-slate-700">Date Added</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input
//                 type="date"
//                 value={dateRange.from}
//                 onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//                 className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//               <input
//                 type="date"
//                 value={dateRange.to}
//                 onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//                 className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//             </div>
//           </div>

//           {/* Word Types */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-slate-700">Word Type</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition">
//                 <input
//                   type="checkbox"
//                   checked={selectedTypes.length === TYPE_OPTIONS.length}
//                   onChange={toggleAllTypes}
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-slate-700 font-medium">All Types</span>
//               </label>

//               {visibleTypes.map((type) => (
//                 <label
//                   key={type}
//                   className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedTypes.includes(type)}
//                     onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <span className="capitalize text-slate-700">{type}</span>
//                 </label>
//               ))}
//             </div>
//             {TYPE_OPTIONS.length > 6 && (
//               <button
//                 onClick={() => setShowAllTypes(!showAllTypes)}
//                 className="flex items-center gap-1 mt-4 text-blue-600 hover:text-blue-800 transition text-sm"
//               >
//                 {showAllTypes ? "See Less" : "See More"}
//                 {showAllTypes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//               </button>
//             )}
//           </div>

//           {/* Tags */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-slate-700">Tags</h3>
//             <div className="flex flex-wrap gap-2">
//               {TAG_OPTIONS.map((tag) => (
//                 <button
//                   key={tag}
//                   onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
//                   className={`px-4 py-2 rounded-full font-medium transition-colors ${
//                     selectedTags.includes(tag)
//                       ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Levels */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-slate-700">Difficulty Level</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               {LEVEL_OPTIONS.map((level) => {
//                 const isSelected = selectedLevels.includes(level);
//                 const colors = difficultyColorMap[level] || "bg-gray-100 text-gray-700";

//                 return (
//                   <button
//                     key={level}
//                     onClick={() => toggleSelection(level, selectedLevels, setSelectedLevels)}
//                     className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
//                       isSelected
//                         ? `${colors} border-transparent text-white shadow-md`
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
//                     }`}
//                   >
//                     {level}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-between items-center p-6 border-t border-slate-200">
//           <button
//             onClick={clearAllFilters}
//             className="text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition"
//           >
//             Clear All
//           </button>
//           <button
//             onClick={applyFilters}
//             className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useCallback } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { TAG_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, difficultyColorMap } from "@/utils/constants";

// --- Helper Component: Filter Section Wrapper ---
const FilterSection = ({ title, children }) => (
  <div className="border-b border-slate-200 last:border-b-0 pb-6 mb-6">
    <h3 className="text-lg font-semibold mb-4 text-slate-800  pl-3">{title}</h3>
    {children}
  </div>
);

// --- Helper Component: Type Filter Section ---
const TypeFilter = ({ selectedTypes, setSelectedTypes }) => {
  const [showAllTypes, setShowAllTypes] = useState(false);
  const visibleTypes = showAllTypes ? TYPE_OPTIONS : TYPE_OPTIONS.slice(0, 6);

  const toggleSelection = useCallback(
    (option) => {
      setSelectedTypes((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelectedTypes]
  );

  const toggleAllTypes = () => {
    setSelectedTypes((prev) => (prev.length === TYPE_OPTIONS.length ? [] : TYPE_OPTIONS));
  };

  return (
    <FilterSection title="Word Type">
      <div className="flex flex-col gap-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <input
            type="checkbox"
            checked={selectedTypes.length === TYPE_OPTIONS.length}
            onChange={toggleAllTypes}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-slate-800 font-bold">All Types</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleTypes.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => toggleSelection(type)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="capitalize text-slate-700">{type}</span>
          </label>
        ))}
      </div>

      {TYPE_OPTIONS.length > 6 && (
        <button
          onClick={() => setShowAllTypes((prev) => !prev)}
          className="flex items-center gap-1 mt-4 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
        >
          {showAllTypes ? "See Less" : "See More"}
          {showAllTypes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </FilterSection>
  );
};

// --- Helper Component: Tag/Level/Generic Button Filter ---
const ButtonFilter = ({ title, options, selected, setSelected, colorMap = {} }) => {
  const toggleSelection = useCallback(
    (option) => {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    },
    [setSelected]
  );

  return (
    <FilterSection title={title}>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const baseClasses = "px-4 py-2 rounded-xl font-medium transition-all text-sm shadow-sm";

          let colorClasses;
          if (title === "Difficulty Level") {
            // 🎯 FIX: Convert the option (e.g., "Easy") to lowercase for map lookup
            const lowerCaseLevel = option.toLowerCase();

            // Get the color classes based on the lowercase key
            const levelColors = colorMap[lowerCaseLevel] || "bg-gray-100 text-gray-700";

            colorClasses = isSelected
              ? `${levelColors} text-white border-transparent shadow-lg`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200";
          } else {
            // Logic for Tags (fixed color)
            colorClasses = isSelected
              ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200";
          }

          return (
            <button
              key={option}
              onClick={() => toggleSelection(option)}
              className={`${baseClasses} ${colorClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
};

// =========================================================================
//                             MAIN COMPONENT
// =========================================================================

export default function FilterModal({
  onClose,
  onFilterChange,
  typeFilter,
  tagFilter,
  levelFilter,
}) {
  // --- State Initialization ---
  const [selectedTypes, setSelectedTypes] = useState(typeFilter || []);
  const [selectedTags, setSelectedTags] = useState(tagFilter || []);
  const [selectedLevels, setSelectedLevels] = useState(levelFilter || []);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // --- Actions ---
  const applyFilters = () => {
    onFilterChange?.({
      type: selectedTypes,
      tag: selectedTags,
      level: selectedLevels,
      dateRange,
    });
    onClose();
  };

  const clearAllFilters = () => {
    const defaultFilters = { type: [], tag: [], level: [], dateRange: { from: "", to: "" } };
    setSelectedTypes([]);
    setSelectedTags([]);
    setSelectedLevels([]);
    setDateRange(defaultFilters.dateRange);
    onFilterChange?.(defaultFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col relative transform transition-all duration-300 scale-95 md:scale-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Filter Vocabulary</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            aria-label="Close filter modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body (scrollable content) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Date Range */}
          <FilterSection title="Date Added">
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

          {/* Type Filter */}
          <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />

          {/* Tag Filter */}
          <ButtonFilter
            title="Tags"
            options={TAG_OPTIONS}
            selected={selectedTags}
            setSelected={setSelectedTags}
          />

          {/* Level Filter */}
          <ButtonFilter
            title="Difficulty Level"
            options={LEVEL_OPTIONS}
            selected={selectedLevels}
            setSelected={setSelectedLevels}
            colorMap={difficultyColorMap}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={clearAllFilters}
            className="text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition font-medium"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:scale-[1.02]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
