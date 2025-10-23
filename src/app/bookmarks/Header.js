import React from "react";

// Library Imports
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import Button from "@/components/buttons/Button";
import SortSelect from "@/components/formItems/SortSelect";

// Utility Imports
import { SORT_OPTIONS } from "@/utils/constants";

const Header = ({ bookmarkedWords, onSearch, currentSort = "date_desc", onSortChange }) => {
  const router = useRouter();

  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <header className="bg-white backdrop-blur-sm shadow-sm border-b border-slate-200/50 z-40 relative">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 ">
          <Button variant="transparent" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bookmarks</h1>
              <p className="text-slate-500">
                {bookmarkedWords.length} {bookmarkedWords.length === 1 ? "word" : "words"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-3 gap-4">
          <div className="flex items-center w-full bg-white border border-slate-300 rounded-lg px-4 py-3  hover:border-slate-400 ">
            <Search size={20} className="text-slate-400 mr-3" />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Search words, difficulty, or type..."
              className="w-full outline-none text-base text-slate-700 placeholder-slate-400"
            />
          </div>

          <SortSelect
            currentSort={currentSort}
            onSortChange={onSortChange}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
