"use client";
import { useState, useMemo, useRef, useEffect } from "react";

// Library Imports
import { Search, Bookmark, Plus, ListFilter, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import FilterModal from "./filters/FilterModal";
import Button from "./buttons/Button";
import SortSelect from "./formItems/SortSelect";
import { useDebounce } from "@/components/hooks/useDebounce";

// Utility Imports
import { SORT_OPTIONS } from "@/utils/constants";

/**
 * Header component for the vocabulary page, including search and filtering controls.
 *
 * @param {object} props
 * @param {number} [props.totalWords=0] - Total count of words in the collection.
 * @param {function} props.onSearch - Handler function for search input changes.
 * @param {function} props.onFilterChange - Handler function for when filters are applied in the modal.
 * @param {function} props.onBookmarkClick - Handler for the bookmark button (to toggle bookmark view).
 * @param {object} [props.filters] - The current state of active filters.
 */
export default function VocabularyHeader({
  totalWords = 0,
  onSearch,
  onFilterChange,
  onBookmarkClick,
  onSortChange,
  currentSort = "date_desc",
  filters = {},
}) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();
  const sortRef = useRef(null);

  // Destructure filters for direct use in logic and JSX
  const {
    type = [],
    tag = [],
    level = [],
    dateRange = { from: "", to: "" },
    origin = [],
    wordLength = [],
    isBookmarked = false,
    searchTerm: externalSearchTerm = "",
  } = filters;

  const [localSearchTerm, setLocalSearchTerm] = useState(externalSearchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm !== externalSearchTerm) {
      onSearch?.(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, externalSearchTerm, onSearch]);

  const handleInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (externalSearchTerm !== localSearchTerm) {
      setLocalSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        // Assuming setIsSortMenuOpen is meant to be a state setter here,
        // though it's not defined. Removing the call for clarity/safety.
        // If you need sort menu state, it should be defined (e.g., [isSortMenuOpen, setIsSortMenuOpen])
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortRef]);

  // Memoize the count of active filters for the badge logic
  const activeFilterCount = useMemo(() => {
    const isDateRangeActive = !!dateRange.from || !!dateRange.to;
    const isBookmarkedActive = isBookmarked ? 1 : 0;

    return (
      type.length +
      tag.length +
      level.length +
      origin.length +
      wordLength.length +
      isBookmarkedActive +
      (isDateRangeActive ? 1 : 0)
    );
  }, [type, tag, level, dateRange, origin, wordLength, isBookmarked]);

  return (
    <>
      <header className="bg-white backdrop-blur-sm shadow-sm border-b border-[var(--slate-200)]/50 z-40 relative">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title & Count */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vocabulary Collection</h1>
              <p className="text-slate-500">{totalWords} words in total</p>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full md:w-auto gap-3">
              <Button
                onClick={onBookmarkClick}
                className="flex flex-1 items-center justify-center md:justify-start bg-[var(--secondary)] text-white hover:bg-[var(--secondary-600)] p-2 md:px-4 md:py-2"
              >
                <Bookmark size={18} className="mr-0 md:mr-2" />
                <span className="hidden md:inline">Bookmarks</span>
              </Button>

              <Button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex flex-1 items-center justify-center md:justify-start bg-purple-600 text-white hover:bg-purple-700 relative p-2 md:px-4 md:py-2"
              >
                <ListFilter size={18} className="mr-0 md:mr-2" />
                <span className="hidden md:inline">Filters</span>
                {/* Active Filter Count Badge */}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--red)] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Button
                onClick={() => router.push("/quiz")}
                className="flex flex-1 items-center justify-center md:justify-start bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-md p-2 md:px-4 md:py-2"
                variant="transparent"
              >
                <Brain size={18} className="mr-0 md:mr-2" />
                <span className="hidden md:inline">Quiz</span>
              </Button>

              <Button
                onClick={() => router.push("/add")}
                className="flex flex-1 items-center justify-center md:justify-start bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-600)] transition shadow-md p-2 md:px-4 md:py-2"
                variant="transparent"
              >
                <Plus size={18} className="mr-0 md:mr-2" />
                <span className="hidden md:inline">Add</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch mt-3 gap-4">
            {/* Search Bar */}
            <div className="flex items-center w-full md:flex-1 bg-white border border-[var(--slate-300)] rounded-lg px-4 py-3  hover:border-[var(--slate-300)] ">
              <Search size={20} className="text-[var(--slate-300)] mr-3" />
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleInputChange}
                placeholder="Search words, definitions, or synonyms..."
                className="w-full outline-none text-base text-slate-700 placeholder-[var(--slate-300)]"
              />
            </div>

            <SortSelect
              currentSort={currentSort}
              onSortChange={onSortChange}
              options={SORT_OPTIONS}
              className="w-full md:w-auto"
            />
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
          typeFilter={type}
          levelFilter={level}
          originFilter={origin}
          wordLengthFilter={wordLength}
          isBookmarked={isBookmarked}
          dateRangeFilter={dateRange}
        />
      )}
    </>
  );
}
