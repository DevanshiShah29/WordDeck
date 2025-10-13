import React from "react";
import { Bookmark } from "lucide-react";

// Component Imports
import FilterSection from "./FilterSection";

const BookmarkedToggle = ({ isBookmarkedOnly, setIsBookmarkedOnly }) => {
  const clearBookmark = () => setIsBookmarkedOnly(false);

  return (
    <FilterSection
      title="Collection Status"
      selectedCount={isBookmarkedOnly ? 1 : 0}
      onClear={clearBookmark}
    >
      <div
        onClick={() => setIsBookmarkedOnly((prev) => !prev)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
          isBookmarkedOnly
            ? "bg-yellow-100 border border-yellow-300"
            : "bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <Bookmark
          size={20}
          className={isBookmarkedOnly ? "text-yellow-600 fill-yellow-600" : "text-slate-500"}
        />
        <span className={`font-medium ${isBookmarkedOnly ? "text-yellow-800" : "text-slate-700"}`}>
          Show Bookmarked Words Only
        </span>
      </div>
    </FilterSection>
  );
};

export default BookmarkedToggle;
