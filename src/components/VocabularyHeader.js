"use client";
import { useState, useMemo } from "react";
import { Search, Bookmark, Plus, ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import FilterModal from "./FilterModal";
import Button from "./buttons/Button";

/**
 * Header component for the vocabulary page, including search and filtering controls.
 *
 * @param {object} props
 * @param {number} [props.totalWords=0] - Total count of words in the collection.
 * @param {number} [props.bookmarkCount=0] - Count of bookmarked words.
 * @param {function} props.onSearch - Handler function for search input changes.
 * @param {function} props.onFilterChange - Handler function for when filters are applied in the modal.
 * @param {function} props.onBookmarkClick - Handler for the bookmark button (to toggle bookmark view).
 * @param {object} [props.filters] - The current state of active filters.
 */
export default function VocabularyHeader({
  totalWords = 0,
  bookmarkCount = 0,
  onSearch,
  onFilterChange,
  onBookmarkClick,
  filters = {},
}) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();

  // Destructure filters for direct use in logic and JSX
  const {
    type = [],
    tag = [],
    level = [],
    dateRange = { from: "", to: "" },
    searchTerm = "",
  } = filters;

  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  // Memoize the count of active filters for the badge logic
  const activeFilterCount = useMemo(() => {
    const isDateRangeActive = !!dateRange.from || !!dateRange.to;
    const isSearchActive = !!searchTerm.trim();

    return (
      type.length +
      tag.length +
      level.length +
      (isDateRangeActive ? 1 : 0) +
      (isSearchActive ? 1 : 0)
    );
  }, [type, tag, level, dateRange, searchTerm]);

  return (
    <>
      <header className="bg-white backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="container mx-auto p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title & Count */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vocabulary Collection</h1>
              <p className="text-slate-500">{totalWords} words total</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onBookmarkClick}
                className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <Bookmark size={18} />
                Bookmarks ({bookmarkCount})
              </Button>

              <Button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 relative"
              >
                <ListFilter size={18} />
                Filters
                {/* Active Filter Count Badge */}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Button
                onClick={() => router.push("/add")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                variant="transparent"
              >
                <Plus size={18} />
                Add Word
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mt-3">
            <div className="flex items-center w-full bg-white border border-slate-300 rounded-lg px-4 py-3 shadow-inner">
              <Search size={20} className="text-slate-400 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search words, definitions, or synonyms..."
                className="w-full outline-none text-base text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={onFilterChange}
          // Pass the entire filters object down
          currentFilters={filters}
        />
      )}
    </>
  );
}
