import React, { useEffect, useState } from "react";

// Library Imports
import { Volume2, Bookmark, Pencil, MoreVertical, Trash2 } from "lucide-react";

// Component Imports
import Button from "@/components/buttons/Button";
import PageHeader from "@/components/header/PageHeader";

const DetailHeader = ({
  word,
  onSpeak,
  onToggleBookmark,
  isBookmarked,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { word: title, pronunciation } = word;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      document.addEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  const handleMenuAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    if (action === "edit") {
      handleEditClick();
    } else if (action === "bookmark") {
      onToggleBookmark();
    } else if (action === "delete") {
      handleDeleteClick();
    }
  };

  // Subtitle JSX
  const detailSubtitle = (
    <p className="mt-1 text-[var(--slate-500)] text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
      {pronunciation}
    </p>
  );

  //  Actions
  const detailActions = (
    <div className="flex items-center gap-2">
      {/* Speak Button */}
      <Button
        variant="transparent"
        onClick={onSpeak}
        title="Play pronunciation"
        className="p-2 hover:bg-[var(--primary-100)] rounded-lg transition-all duration-300 text-[var(--slate-600)] hover:text-[var(--primary-600)] transform hover:scale-110 cursor-pointer"
      >
        <Volume2 className="w-5 h-5" />
      </Button>

      {/* Kebab Menu Dropdown */}
      <div className="relative">
        <Button
          variant="transparent"
          onClick={toggleMenu}
          className="p-2 hover:bg-[var(--primary-100)] rounded-lg transition-all duration-300 text-[var(--slate-600)] hover:text-[var(--primary-600)] transform hover:scale-110 cursor-pointer"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>

        {isMenuOpen && (
          <div
            className="absolute right-0 mt-2 w-40 origin-top-right rounded-md shadow-xl bg-white divide-y divide-slate-100 focus:outline-none z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <Button
                varient="transparent"
                onClick={(e) => handleMenuAction(e, "edit")}
                className="group flex items-center justify-start w-full px-4 py-2 text-md !text-[var(--slate-700)] bg-white hover:bg-[var(--slate-100)]"
              >
                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                Edit
              </Button>

              <Button
                varient="transparent"
                onClick={(e) => handleMenuAction(e, "bookmark")}
                className="group flex items-center justify-start w-full px-4 py-2 text-md !text-[var(--slate-700)] bg-white hover:bg-[var(--slate-100)]"
              >
                <Bookmark
                  className={`mr-2 h-4 w-4 ${
                    isBookmarked ? "text-[var(--red)] fill-current" : "text-blue-500"
                  }`}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                {isBookmarked ? "Unbookmark" : "Bookmark"}
              </Button>

              <Button
                varient="transparent"
                onClick={(e) => handleMenuAction(e, "delete")}
                className="group flex items-center justify-start w-full px-4 py-2 text-md !text-red-700 bg-white hover:bg-[var(--slate-100)]"
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-700" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <PageHeader title={title} subtitle={detailSubtitle} actions={detailActions} />;
};

export default DetailHeader;
