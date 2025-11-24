import React from "react";

// Library Imports
import { ArrowLeft, Search, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import Button from "@/components/buttons/Button";
import SortSelect from "@/components/formItems/SortSelect";

// Utility Imports
import { SORT_OPTIONS } from "@/utils/constants";

const Header = ({
  bookmarkedWords,
  onSearch,
  currentSort = "date_desc",
  onSortChange,
  isHintActive,
  onHintToggle,
}) => {
  const router = useRouter();

  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  const handleHintClick = () => {
    // Toggles the global state in the parent Bookmarks component
    onHintToggle();
  };

  return (
    <header className="bg-white backdrop-blur-sm shadow-sm border-b border-[var(--slate-200)]/50 z-40 relative">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 ">
          <Button variant="transparent" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-11 w-11 py-3" />
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[var(--slate-900)]">Bookmarks</h1>
              <p className="text-[var(--slate-500)]">
                {bookmarkedWords.length} {bookmarkedWords.length === 1 ? "word" : "words"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch mt-3 gap-4">
          <div className="flex items-center w-full md:flex-1 bg-white border border-[var(--slate-300)] rounded-lg px-4 py-3  hover:border-[var(--slate-300)] ">
            <Search size={20} className="text-[var(--slate-300)] mr-3" />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Search words, difficulty, or type..."
              className="w-full outline-none text-base text-[var(--slate-700)] placeholder-[var(--slate-300)]"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <SortSelect
              currentSort={currentSort}
              onSortChange={onSortChange}
              options={SORT_OPTIONS}
              className="w-1/2"
            />
            <Button
              variant="secondary"
              className={`!py-3 w-1/2 md:w-auto ${
                isHintActive
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-[var(--slate-100)] hover:bg-[var(--slate-200)] text-[var(--slate-700)]"
              }`}
              onClick={handleHintClick}
            >
              <Lightbulb
                className={`h-4 w-4 mr-2 ${isHintActive ? "text-white" : "text-yellow-500"}`}
              />
              Hint
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
