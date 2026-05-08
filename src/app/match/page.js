"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  RotateCw,
  CheckCircle,
  Trophy,
  Type,
  BookOpen,
  Link2,
  Quote,
  Globe2,
  Image as ImageIcon,
  Tags,
  Loader2,
} from "lucide-react";

// Component Imports
import Card from "@/components/Card";
import Button from "@/components/buttons/Button";
import Loader from "@/components/Loader";
import PageHeader from "@/components/header/PageHeader";
import ImageWithFallback from "@/components/ImageWithFallback";

// Utility Imports
import { fetchWithBackoff, selectRandomWords } from "../quiz/helper";
import { slugify } from "@/utils/helper";

const MATCH_LENGTH = 5;

const COLUMNS_CONFIG = [
  { key: "word", title: "Word", icon: Type, color: "from-blue-500 to-blue-700" },
  {
    key: "definition",
    title: "Definition",
    icon: BookOpen,
    color: "from-purple-500 to-purple-700",
  },
  { key: "synonyms", title: "Synonyms", icon: Link2, color: "from-emerald-500 to-emerald-700" },
  { key: "type", title: "Type", icon: Tags, color: "from-orange-500 to-orange-700" },
  { key: "example", title: "Example", icon: Quote, color: "from-pink-500 to-pink-700" },
  { key: "etymology", title: "Etymology", icon: Globe2, color: "from-indigo-500 to-indigo-700" },
  { key: "image", title: "Image", icon: ImageIcon, color: "from-rose-500 to-rose-700" },
];

const MATCH_COLORS = [
  "border-blue-400 bg-blue-50 text-blue-900 shadow-blue-500/20",
  "border-purple-400 bg-purple-50 text-purple-900 shadow-purple-500/20",
  "border-emerald-400 bg-emerald-50 text-emerald-900 shadow-emerald-500/20",
  "border-orange-400 bg-orange-50 text-orange-900 shadow-orange-500/20",
  "border-pink-400 bg-pink-50 text-pink-900 shadow-pink-500/20",
];

const ACTIVE_COLOR =
  "border-[2px] border-dashed border-slate-600 bg-slate-50 text-slate-900 ring-4 ring-slate-200 scale-[1.05] z-20 shadow-lg";
const STANDARD_COLOR =
  "glass-panel text-slate-700 hover:bg-white hover:border-indigo-200 card-hover";

const MatchGame = () => {
  const [loading, setLoading] = useState(true);

  // Columns Data
  const [columnsData, setColumnsData] = useState({
    word: [],
    definition: [],
    synonyms: [],
    type: [],
    example: [],
    etymology: [],
    image: [],
  });
  const [wordColors, setWordColors] = useState({});
  const [wordCount, setWordCount] = useState(0);

  // Game State
  const [matchedGroups, setMatchedGroups] = useState([]);
  const [activeWordId, setActiveWordId] = useState(null);
  const [currentSelections, setCurrentSelections] = useState({});

  // Animation Triggers
  const [errorCard, setErrorCard] = useState(null);
  const [justCompleted, setJustCompleted] = useState(null);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchGameData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithBackoff("/api/word", { method: "GET" });
      const wordsArray = await response.json();

      if (response.ok && Array.isArray(wordsArray) && wordsArray.length > 0) {
        const actualLength = Math.min(MATCH_LENGTH, wordsArray.length);
        const selected = selectRandomWords(wordsArray, actualLength);

        const promises = selected.map((word) =>
          fetchWithBackoff(`/api/words?slug=${slugify(word)}`, { method: "GET" }).then((res) =>
            res.json(),
          ),
        );

        const fullWords = await Promise.all(promises);
        const validWords = fullWords.filter((w) => !w.error && w.definition);

        if (validWords.length === 0) {
          toast.error("No valid words found.");
          setLoading(false);
          return;
        }

        const newData = {
          word: [],
          definition: [],
          synonyms: [],
          type: [],
          example: [],
          etymology: [],
          image: [],
        };
        const colors = {};

        validWords.forEach((w, index) => {
          colors[w._id] = index % MATCH_COLORS.length;

          newData.word.push({ id: w._id, text: w.word, type: "word" });
          newData.definition.push({ id: w._id, text: w.definition || "N/A", type: "definition" });
          newData.etymology.push({ id: w._id, text: w.etymologyStory || "N/A", type: "etymology" });
          newData.example.push({ id: w._id, text: w.example || "N/A", type: "example" });
          newData.type.push({ id: w._id, text: w.type || "N/A", type: "type" });

          // Image
          newData.image.push({ id: w._id, text: w.imageUrl || null, type: "image" });

          // Synonyms
          let synText = "N/A";
          if (Array.isArray(w.synonyms) && w.synonyms.length > 0) {
            synText = w.synonyms.join(", ");
          } else if (typeof w.synonyms === "string" && w.synonyms.trim().length > 0) {
            synText = w.synonyms;
          }
          newData.synonyms.push({ id: w._id, text: synText, type: "synonyms" });
        });

        // Shuffle all columns independently
        const shuffledData = {};
        Object.keys(newData).forEach((key) => {
          shuffledData[key] = shuffleArray(newData[key]);
        });

        setColumnsData(shuffledData);
        setWordColors(colors);
        setWordCount(validWords.length);

        // Reset Game State
        setMatchedGroups([]);
        setActiveWordId(null);
        setCurrentSelections({});
        setErrorCard(null);
        setJustCompleted(null);
      } else {
        toast.error("Not enough words in the database.");
      }
    } catch (err) {
      toast.error("Failed to load match game.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  const handleCardClick = (card) => {
    if (matchedGroups.includes(card.id)) return;

    if (!activeWordId) {
      setActiveWordId(card.id);
      setCurrentSelections({ [card.type]: true });
    } else {
      if (card.id === activeWordId) {
        const newSelections = { ...currentSelections, [card.type]: !currentSelections[card.type] };
        const activeCount = Object.values(newSelections).filter(Boolean).length;

        if (activeCount === 0) {
          setActiveWordId(null);
          setCurrentSelections({});
        } else {
          setCurrentSelections(newSelections);

          // Check for full completion (all 7 columns)
          if (activeCount === COLUMNS_CONFIG.length) {
            setMatchedGroups((prev) => [...prev, card.id]);
            setActiveWordId(null);
            setCurrentSelections({});

            setJustCompleted(card.id);
            setTimeout(() => setJustCompleted(null), 800);
          }
        }
      } else {
        setErrorCard({ id: card.id, type: card.type });
        setTimeout(() => setErrorCard(null), 500);
      }
    }
  };

  const isGameComplete = wordCount > 0 && matchedGroups.length === wordCount;

  const restartButton = (
    <Button
      variant="transparent"
      onClick={fetchGameData}
      className="bg-white/50 backdrop-blur-sm group p-3 hover:bg-white transition-all shadow-sm rounded-full"
    >
      <RotateCw className="w-5 h-5 text-[var(--slate-700)] group-hover:text-[var(--primary)] group-hover:rotate-180 transition-transform duration-500" />
    </Button>
  );

  const renderItemContent = (item) => {
    if (item.type === "image") {
      if (!item.text || item.text === "N/A") {
        return <span className="text-slate-400 italic text-sm">No Image</span>;
      }
      return (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          <ImageWithFallback
            src={item.text}
            alt="Vocab image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      );
    }

    return (
      <span
        className={`text-sm md:text-base font-medium leading-relaxed ${item.type === "word" ? "font-bold text-lg" : ""}`}
      >
        {item.text}
      </span>
    );
  };

  const renderColumn = (colConfig, items, colType) => {
    const Icon = colConfig.icon;
    const isEtymology = colType === "etymology";
    const colWidth = isEtymology ? "w-88 md:w-96 lg:w-[28rem]" : "w-56 md:w-64 lg:w-72";
    return (
      <div key={colType} className={`flex flex-col gap-4 shrink-0 ${colWidth}`}>
        <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-slate-200/60 sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-sm">
          <div
            className={`p-2 rounded-lg bg-gradient-to-br ${colConfig.color} text-white shadow-sm`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 tracking-wide">{colConfig.title}</h3>
        </div>
        <div className="flex flex-col gap-3 pb-4">
          {items.map((item) => {
            const isCompleted = matchedGroups.includes(item.id);
            const isSelected = activeWordId === item.id && currentSelections[colType];
            const isError = errorCard?.id === item.id && errorCard?.type === colType;
            const colorClass = MATCH_COLORS[wordColors[item.id]] || MATCH_COLORS[0];

            let wrapperClass =
              "rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 flex flex-col justify-center min-h-[6rem] ";

            if (isCompleted) {
              wrapperClass += `${colorClass} shadow-md opacity-90`;
              if (justCompleted === item.id) wrapperClass += " animate-pop-match z-10";
            } else if (isSelected) {
              wrapperClass += ACTIVE_COLOR;
            } else if (isError) {
              wrapperClass +=
                "bg-red-50 border-red-400 animate-shake-error text-red-700 z-10 shadow-lg";
            } else {
              wrapperClass += STANDARD_COLOR;
              if (activeWordId) wrapperClass += " opacity-60 hover:opacity-100";
            }

            return (
              <div key={item.id} onClick={() => handleCardClick(item)} className={wrapperClass}>
                {renderItemContent(item)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans overflow-hidden">
      <style>{`
        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
        .animate-shake-error {
          animation: shakeError 0.4s ease-in-out;
        }
        @keyframes popMatch {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); filter: brightness(1.1); box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.6); }
          100% { transform: scale(1); }
        }
        .animate-pop-match {
          animation: popMatch 0.6s ease-out forwards;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .scroller-container::-webkit-scrollbar {
          height: 0px;
        }
      
      `}</style>

      <PageHeader
        title="7-Column Epic Match"
        subtitle="Connect all 7 pieces of information for every word!"
        actions={restartButton}
      />

      <div className="w-full py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 bg-white rounded-lg p-8 mx-8 shadow-sm border border-indigo-100">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-slate-600 animate-pulse">
              Preparing the massive puzzle...
            </p>
          </div>
        ) : wordCount === 0 ? (
          <div className="text-center py-20 glass-panel rounded-xl w-full mx-4">
            <h2 className="text-2xl font-bold text-[var(--slate-700)]">No words available</h2>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Progress Bar */}
            <div className="px-4 md:px-8 w-full">
              {!isGameComplete && (
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between shadow-sm z-20 max-w-7xl mx-auto">
                  <span className="text-slate-600 font-medium hidden sm:block">
                    {activeWordId
                      ? `Select the matching pieces across the board... (${Object.values(currentSelections).filter(Boolean).length}/7)`
                      : "Click any card in any column to start a connection..."}
                  </span>
                  <span className="text-slate-600 font-medium sm:hidden text-sm">
                    {activeWordId
                      ? `Matching... (${Object.values(currentSelections).filter(Boolean).length}/7)`
                      : "Swipe & connect"}
                  </span>
                  <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-inner border border-slate-200 ml-auto">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-700">
                      {matchedGroups.length} / {wordCount} Words
                    </span>
                  </div>
                </div>
              )}

              {/* Victory Screen */}
              {isGameComplete && (
                <div className="glass-panel p-10 text-center rounded-2xl border-green-200 bg-green-50/80 animate-pop-match max-w-3xl w-full shadow-2xl">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-3">
                    Vocabulary Master!
                  </h2>
                  <p className="text-green-700 text-lg mb-8 font-medium">
                    You've successfully connected all 35 vocabulary pieces.
                  </p>
                  <Button
                    variant="primary"
                    onClick={fetchGameData}
                    className="px-10 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-emerald-500 to-green-500 border-none"
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>

            {/* Horizontally Scrollable 7-Column Board */}
            {!isGameComplete && (
              <div className="w-full overflow-x-auto scroller-container">
                <div className="min-w-max flex gap-4 md:gap-6 px-4 md:px-8 justify-start">
                  {COLUMNS_CONFIG.map((col) =>
                    renderColumn(col, columnsData[col.key] || [], col.key),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchGame;
