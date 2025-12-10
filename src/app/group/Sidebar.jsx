"use client";

import React, { useEffect, useState } from "react";
// Lucide Icons
import {
  Volume2,
  Languages,
  Bookmark,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Globe,
  Code,
  Clock,
} from "lucide-react";

// --- START COMPONENT ---

// Placeholder data/utilities (Use your actual imports if available)
const typeColorMap = {
  noun: "from-blue-400 to-indigo-400",
  verb: "from-green-400 to-teal-400",
  adjective: "from-purple-400 to-pink-400",
  default: "from-slate-400 to-gray-400",
};
const difficultyColorMap = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};
const capitalizeFirstLetter = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");
const speakWord = (word) => console.log(`Speaking: ${word}`);

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ label: "", slug: "", emitterId: null });
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  useEffect(() => {
    const onOpen = async (e) => {
      const { slug, label, emitterId } = e?.detail ?? {};
      if (!slug) return;

      setOpen(true);
      setDetail(null);
      setError(null);
      setLoading(true);
      setMeta({ label: label ?? "", slug, emitterId: emitterId ?? null });
      setIsBookmarkedState(false);

      try {
        // Using hardcoded data for demonstration if API fails/is absent
        // NOTE: In a real app, this should be your API call:
        // const res = await fetch(`/api/words?slug=${encodeURIComponent(slug)}`);
        // ... fetch logic ...
        const mockData = {
          word: label, // Use the label for the mock data word
          type: "adjective",
          pronunciation: "/ɪɡˈzuːbərənt/",
          definition: "Full of energy, excitement, and cheerfulness; overflowing with enthusiasm.",
          example:
            "The crowd was exuberant after their team scored the winning goal in the final minute.",
          difficulty: "intermediate",
          origin: "Latin",
          synonyms: ["effervescent", "ebullient", "vivacious", "joyous"],
          etymology:
            "From Latin 'exuberantem', meaning 'overflowing, abundant', from 'ex-' (out) + 'uberare' (to be fruitful, to yield abundantly).",
          etymologyStory:
            "The word 'exuberant' traces its roots back to ancient Rome, stemming from the Latin verb 'uberare', which literally meant 'to be fruitful' or 'to yield abundantly'. Over time, this sense of abundant fertility evolved metaphorically to describe a person's spirit, leading to our modern understanding of someone overflowing with joy and vitality.",
          mnemonics:
            "Think of 'EX-uberant' as 'EXtra-UBER-rant' – someone with extra, super-abundant energy, like an Uber driver who's overly enthusiastic.",
          imageUrl: "https://via.placeholder.com/400x200?text=Illustration+for+Exuberant",
          tags: ["enthusiasm", "joy", "energy", "lively", "positive"],
          createdAt: "2025-10-11T05:18:13.083Z",
          isBookmarked: false,
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const payload = mockData; // Use mockData or actual API response
        setDetail(payload || null);
        setIsBookmarkedState(payload?.bookmarked || false);
      } catch (err) {
        console.error("Sidebar fetch error:", err);
        setError(err?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("miniwordmap:open", onOpen);
    return () => window.removeEventListener("miniwordmap:open", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    setDetail(null);
    setError(null);
    setMeta({ label: "", slug: "", emitterId: null });
    window.dispatchEvent(new Event("miniwordmap:sidebar-closed"));
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isBookmarkedState;
    setIsBookmarkedState(newState);
    console.log(`Attempting to set bookmark to ${newState} for ${detail.word}`);
  }; // --- UI Styles/Content Retrieval ---

  const typeGradient = typeColorMap[detail?.type?.toLowerCase() || "default"];
  const difficultyClasses = difficultyColorMap[detail?.difficulty?.toLowerCase() || "default"];
  const word = detail?.word || meta?.label || "Details";
  const allRelatedTerms = [...(detail?.synonyms || []), ...(detail?.tags || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  return (
    <aside // Main Sidebar Container
      className={`
fixed top-[0px] right-0 
h-[100vh] w-full md:w-96 
bg-white border-l border-slate-200 
shadow-2xl z-50 
transform transition-transform duration-300 ease-in-out
${open ? "translate-x-0" : "translate-x-full"}
`}
      aria-hidden={!open}
      role="dialog"
      aria-label="Word details"
    >
      {/* Close Button - Fixed to Top Right */}
      <button
        aria-label="Close details"
        className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-500 bg-white/70 hover:bg-slate-200 hover:text-slate-800 transition shadow-lg"
        onClick={close}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      {/* Image Header Area (Mimicking the Card Header) */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
          {detail?.imageUrl ? (
            <img
              src={detail.imageUrl}
              alt={`Illustration for ${word}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>[Image Placeholder for {word}]</span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {/* Type Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg bg-gradient-to-r ${typeGradient} text-white capitalize`}
          >
            {detail?.type || "Term"}
          </span>
        </div>
        {/* Bookmark Button (Top Right, near close button) */}
        <button
          className={`absolute top-4 right-16 z-20 p-2.5 cursor-pointer bg-white/90 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg ${
            isBookmarkedState
              ? "text-red-500 hover:text-red-600"
              : "text-slate-600 hover:text-blue-600"
          }`}
          title={isBookmarkedState ? "Remove bookmark" : "Add bookmark"}
          onClick={handleBookmarkClick}
        >
          <Bookmark
            className="w-4 h-4 drop-shadow-md"
            fill={isBookmarkedState ? "currentColor" : "none"}
          />
        </button>
        {/* Word Title & Speaker (Bottom Left Overlay) */}
        <div className="absolute bottom-0 left-0 p-5 w-full flex items-end justify-between">
          <h3 className="text-3xl font-bold text-white drop-shadow-md">{word}</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              speakWord(word);
            }}
            title="Play pronunciation"
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* --- Sidebar Body & Content (SCROLLABLE) --- */}
      <div
        className="p-6 overflow-y-auto"
        style={{ height: "calc(100% - 224px - 84px)" }} // Adjusted for header and new, smaller footer
      >
        {loading && (
          <div className="text-center text-sm text-slate-500 py-6">Loading Details...</div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">Error: {error}</div>
        )}

        {detail && (
          <div className="space-y-6">
            {/* Pronunciation */}
            {detail.pronunciation && (
              <p className="text-lg text-slate-600 font-mono bg-slate-100 px-4 py-2 rounded-xl inline-block shadow-inner">
                {detail.pronunciation}
              </p>
            )}
            {/* Definition Block */}
            <div>
              <h5 className="text-base font-bold flex items-center gap-2 text-slate-700 mb-2">
                <BookOpen height={18} width={18} className="text-blue-600" /> Definition
              </h5>

              <div className="border-l-4 border-blue-200">
                <p className="text-base text-slate-800 leading-relaxed bg-blue-50/50 rounded-r-lg px-4 py-3">
                  {detail.definition}
                </p>
              </div>
            </div>
            {/* Example Block */}
            {detail.example && (
              <div>
                <h5 className="text-base font-bold flex items-center gap-2 text-slate-700 mb-2">
                  <MessageSquare height={18} width={18} className="text-teal-600" /> Example Usage
                </h5>

                <blockquote className="text-base italic text-slate-600 border-l-4 border-teal-300 pl-4 py-2 bg-teal-50/50 rounded-r-lg">
                  "{detail.example}"
                </blockquote>
              </div>
            )}
            {/* Etymology / Origin Story Block */}
            {(detail.etymologyStory || detail.etymology) && (
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 shadow-sm">
                <h5 className="text-base font-bold flex items-center gap-2 text-purple-800 mb-2">
                  <Globe height={18} width={18} className="text-purple-600" /> Etymology & Story
                </h5>
                {detail.etymologyStory && (
                  <p className="text-sm text-slate-700 mb-3">{detail.etymologyStory}</p>
                )}
                {detail.etymology && (
                  <p className="text-xs text-slate-500 font-mono italic mt-1">
                    Source: {detail.etymology}
                  </p>
                )}
              </div>
            )}
            {/* Mnemonics Block */}
            {detail.mnemonics && (
              <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                <h5 className="text-base font-bold flex items-center gap-2 text-yellow-800 mb-2">
                  <Lightbulb height={18} width={18} className="text-yellow-600" />
                  Mnemonics (Memory Aid)
                </h5>
                <p className="text-sm text-slate-700 italic">{detail.mnemonics}</p>
              </div>
            )}
            {/* Synonyms/Tags Block (Combined) */}
            {allRelatedTerms.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-slate-700 mb-2">Related Terms & Tags</h5>

                <div className="flex flex-wrap gap-2">
                  {allRelatedTerms.map((s, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg font-medium shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                      {capitalizeFirstLetter(s)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Footer Area (Fixed to bottom) */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200 bg-white shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Difficulty */}
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-sm font-medium ${difficultyClasses}`}
          >
            🎯 {capitalizeFirstLetter(detail?.difficulty || "N/A")}
          </span>
          {/* Origin */}
          {detail?.origin && (
            <div className="flex items-center gap-1 text-slate-500">
              <Languages className="w-4 h-4" />
              <span className="font-medium">{detail.origin}</span>
            </div>
          )}
          {/* Creation Date */}
          {detail?.createdAt && (
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatDate(detail.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
