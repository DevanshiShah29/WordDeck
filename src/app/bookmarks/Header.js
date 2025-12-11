import React from "react";

// Library Imports
import { Lightbulb } from "lucide-react";

// Component Imports
import Button from "@/components/buttons/Button";
import SortSelect from "@/components/formItems/SortSelect";
import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/header/PageHeader";

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
  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  const handleHintClick = () => {
    onHintToggle();
  };

  const bookmarkSubtitle = (
    <p className="text-[var(--slate-500)] text-sm">
      {bookmarkedWords.length} {bookmarkedWords.length === 1 ? "word" : "words"}
    </p>
  );

  const bookmarkControls = (
    <>
      <SearchBar onChange={handleSearch} placeholder="Search words, difficulty, or type..." />

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
    </>
  );

  return <PageHeader title="Bookmarks" subtitle={bookmarkSubtitle} controls={bookmarkControls} />;
};

export default Header;
