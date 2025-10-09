"use client";

import Link from "next/link";
import { Volume2, Languages, Bookmark, BookOpen } from "lucide-react";
import Image from "next/image";
import { speakWord } from "@/utils/helper";
import { typeColorMap, difficultyColorMap } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/helper";
import Button from "./buttons/Button";

/**
 * Renders a visually appealing card for a vocabulary word, linking to its detail page.
 *
 * @param {object} props
 * @param {string} props.word - The vocabulary word.
 * @param {string} props.type - The type of word (e.g., "Noun").
 * @param {string} props.imageUrl - URL for the card background image.
 * @param {string} props.phonetic - The phonetic spelling.
 * @param {string} props.definition - The word's definition.
 * @param {string[]} props.tags - Array of related tags.
 * @param {string} props.difficulty - The difficulty level (e.g., "Easy").
 * @param {string} props.origin - The word's origin language.
 * @param {string} props.slug - The URL slug for the detail page.
 */
export default function VocabCard({
  word,
  type,
  imageUrl,
  phonetic,
  definition,
  tags,
  difficulty,
  origin,
  slug,
}) {
  // --- Derived State & Logic ---

  // Safely get the type gradient, ensuring 'type' is lowercased for map lookup
  const typeGradient = typeColorMap[type?.toLowerCase()] || typeColorMap.default;

  // Fix casing bug: Convert difficulty to lowercase for map lookup
  const difficultyClasses = difficultyColorMap[difficulty?.toLowerCase()];

  // --- Event Handling (Robustness) ---

  /**
   * Prevents the parent Link navigation from triggering when an action button is clicked.
   */
  const handleActionClick = (e, action) => {
    e.preventDefault(); // Prevents the default button action
    e.stopPropagation(); // Prevents the click from bubbling up to the Link

    if (action === "speak") {
      speakWord(word);
    } else if (action === "bookmark") {
      console.log("Bookmark clicked");
      // Add actual bookmarking logic here
    }
  };

  return (
    <Link href={`/word/${slug}`} className="block h-full">
      <div className="flex flex-col h-full group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-slate-100">
        {/* --- Image Header Area --- */}
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
          <Image
            src={imageUrl || "/fallback.jpg"}
            alt={word || "Vocabulary image"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          {/* Bookmark Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              className="p-2.5 cursor-pointer bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg"
              title="Add bookmark"
              onClick={(e) => handleActionClick(e, "bookmark")}
              variant="transparent"
            >
              <Bookmark className="w-5 h-5 text-slate-600 drop-shadow-md" />
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
        <div className="flex-grow p-6 space-y-4">
          {/* Title + Speaker */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
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
            <p className="text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
              {phonetic}
            </p>
          )}

          {/* Definition */}
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <BookOpen height={18} width={18} className="text-blue-700" />
              Definition
            </span>
          </div>
          <div className="border-l-3 border-blue-200">
            <p className="text-md text-slate-800 leading-relaxed line-clamp-3 bg-blue-50 rounded-lg px-4 py-2">
              {definition}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* --- Footer Area (Difficulty & Origin) --- */}
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
