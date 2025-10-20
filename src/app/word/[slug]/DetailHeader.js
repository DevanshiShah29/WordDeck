import React from "react";

// Library Imports
import { ArrowLeft, Volume2, Bookmark, Pencil } from "lucide-react";
import Link from "next/link";

// Component Imports
import Button from "@/components/buttons/Button";

const DetailHeader = ({ word, onSpeak, onToggleBookmark, isBookmarked, handleEditClick }) => {
  const { word: title, pronunciation } = word;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Back Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/word"
              className="p-2 rounded-lg transition-all duration-300 group hover:bg-slate-100"
              aria-label="Go back to vocabulary list"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="mt-1 text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
                {pronunciation}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="transparent"
              onClick={onSpeak}
              title="Play pronunciation"
              className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 text-slate-600 hover:text-blue-600 transform hover:scale-110 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </Button>

            <Button
              variant="transparent"
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              onClick={onToggleBookmark}
              className={`p-2 cursor-pointer rounded-lg transition transform hover:scale-105 ${
                isBookmarked
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>

            <Button
              variant="transparent"
              title="Edit word entry"
              className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 text-slate-600 hover:text-blue-600 transform hover:scale-110 cursor-pointer"
              onClick={handleEditClick}
            >
              <Pencil className="w-5 h-5 " />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
