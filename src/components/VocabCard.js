"use client";

import { useState, useEffect } from "react";

// Library Imports
import Link from "next/link";
import { Volume2, Languages, Bookmark, BookOpen, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Utility Imports
import { speakWord } from "@/utils/helper";
import { typeColorMap, difficultyColorMap } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/helper";

// Component Imports
import Button from "./buttons/Button";
import { toast } from "react-toastify";

export default function VocabCard({
  word,
  type,
  imageUrl,
  phonetic,
  definition,
  synonyms,
  difficulty,
  origin,
  slug,
  isBookmarked: initialBookmarked = false,
}) {
  const router = useRouter();
  const typeGradient = typeColorMap[type?.toLowerCase()] || typeColorMap.default;
  const difficultyClasses = difficultyColorMap[difficulty?.toLowerCase()];

  // State to manage the UI's bookmark status, initialized from the prop
  const [isBookmarkedState, setIsBookmarkedState] = useState(initialBookmarked);

  // Sync internal state if the prop changes (e.g., parent re-fetches data)
  useEffect(() => {
    setIsBookmarkedState(initialBookmarked);
  }, [initialBookmarked]);

  const updateBookmarkStatus = async (wordSlug, isNowBookmarked) => {
    const endpoint = `/api/words?slug=${wordSlug}`;

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmarked: isNowBookmarked,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update bookmark status: ${response.status}`);
      }

      toast.success(`Bookmark status for ${wordSlug} updated successfully.`);
      return true;
    } catch (error) {
      toast.error("Bookmark API Error:", error);
      return false;
    }
  };

  const handleActionClick = async (e, action) => {
    e.preventDefault(); // Prevents the default button action
    e.stopPropagation(); // Prevents the click from bubbling up to the Link
    if (action === "speak") {
      speakWord(word);
    } else if (action === "bookmark") {
      const newState = !isBookmarkedState;

      setIsBookmarkedState(newState);

      const success = await updateBookmarkStatus(slug, newState);

      if (!success) {
        setIsBookmarkedState(!newState);
        toast.error("Failed to update bookmark. Please try again.");
      }
    } else if (action === "edit") {
      router.push(`/edit/${slug}`);
    }
  };

  return (
    <Link href={`/word/${slug}`} className="block h-full">
      <div className="flex flex-col h-full group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-slate-100">
        {/* --- Image Header Area --- */}
        <div className="relative h-40 sm:h-48 md:h-50 overflow-hidden">
          <Image
            src={imageUrl || "/fallback.jpg"}
            alt={word || "Vocabulary image"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          <div className="absolute top-4 right-14 z-10">
            <Button
              className="p-2.5 cursor-pointer bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg"
              title="Edit word entry"
              onClick={(e) => handleActionClick(e, "edit")}
              variant="transparent"
            >
              <Pencil className="w-4 h-4 text-slate-600 drop-shadow-md" />
            </Button>
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              className={`p-2.5 cursor-pointer bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg ${
                isBookmarkedState
                  ? "text-red-500 hover:text-red-600"
                  : "text-slate-600 hover:bg-white hover:text-blue-600"
              }`}
              title={isBookmarkedState ? "Remove bookmark" : "Add bookmark"}
              onClick={(e) => handleActionClick(e, "bookmark")}
              variant="transparent"
            >
              <Bookmark
                className="w-4 h-4 text-slate-600 drop-shadow-md"
                fill={isBookmarkedState ? "currentColor" : "none"}
              />
            </Button>
          </div>

          {/* Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg bg-gradient-to-r ${typeGradient} text-white capitalize`}
            >
              {type}
            </span>
          </div>
        </div>

        {/* --- Card Body & Content --- */}
        <div className="flex-grow p-5 space-y-4">
          {/* Title + Speaker */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 py-1 group-hover:text-blue-600 transition-colors duration-300">
              {word}
            </h3>

            <Button
              onClick={(e) => handleActionClick(e, "speak")}
              variant="transparent"
              title="Play pronunciation"
              className="p-2 hover:bg-blue-100 rounded-xl cursor-pointer transition-all duration-300 text-slate-600 hover:text-blue-600 transform hover:scale-110"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Phonetic */}
          {phonetic && (
            <p className=" text-sm text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
              {phonetic}
            </p>
          )}

          {/* Definition */}
          <div className=" text-sm flex items-center gap-2 text-slate-700 font-semibold">
            <span className="flex items-center gap-2 text-slate-700">
              <BookOpen height={18} width={18} className="text-blue-700" />
              Definition
            </span>
          </div>
          <div className="border-l-3 border-blue-200">
            <p
              className="text-md text-slate-800 line-clamp-3 bg-blue-50 rounded-r-lg px-4 py-2.5
              leading-6 max-h-[87px] overflow-hidden"
            >
              {definition}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {synonyms?.map((synonym, index) => (
              <span
                key={index}
                className=" text-sm px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg font-medium"
              >
                {capitalizeFirstLetter(synonym)}
              </span>
            ))}
          </div>
        </div>

        {/* --- Footer Area */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Difficulty */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-medium ${difficultyClasses}`}
            >
              🎯 {capitalizeFirstLetter(difficulty)}
            </span>

            {/* Origin */}
            {origin && (
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  <span className="font-medium">{origin}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
