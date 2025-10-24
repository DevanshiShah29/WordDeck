"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";

// Library Imports
import { Bookmark, BookOpen } from "lucide-react";
import { toast } from "react-toastify";

// Component Imports
import Button from "@/components/buttons/Button";
import FlippableWordCard from "./FlippableWordCard";
import Card from "./Card";
import Header from "./Header";

// Utility Imports
import { getBookmarkedWords, removeBookmark } from "./helper";
import { LEVEL_ORDER } from "@/utils/constants";

const Bookmarks = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const [bookmarkedWords, setBookmarkedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState("random");
  const [isHintActive, setIsHintActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookmarkedWords();
        setBookmarkedWords(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = useCallback((newSearchTerm) => {
    setSearchQuery(newSearchTerm);
  }, []);

  const handleDeleteBookmark = async (wordId) => {
    try {
      await removeBookmark(wordId);
      setBookmarkedWords((prev) => prev.filter((word) => word._id !== wordId));
    } catch (error) {
      toast.error(error);
    }
  };

  const toggleFlip = useCallback((index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setCurrentSort(newSort);
  }, []);

  const handleHintToggle = useCallback(() => {
    setIsHintActive((prev) => !prev);
  }, []);

  const filteredWords = useMemo(
    () =>
      bookmarkedWords.filter(
        (word) =>
          word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.type.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [bookmarkedWords, searchQuery]
  );

  const sortedVocab = useMemo(() => {
    const wordsToSort = filteredWords;
    if (!wordsToSort || wordsToSort.length === 0) return [];
    let sorted = [...wordsToSort];

    switch (currentSort) {
      case "word_asc":
        sorted.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "word_desc":
        sorted.sort((a, b) => b.word.localeCompare(a.word));
        break;
      case "date_asc":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "level_asc":
        sorted.sort((a, b) => LEVEL_ORDER[a.difficulty] - LEVEL_ORDER[b.difficulty]);
        break;
      case "level_desc":
        sorted.sort((a, b) => LEVEL_ORDER[b.difficulty] - LEVEL_ORDER[a.difficulty]);
        break;
      case "random":
        for (let i = sorted.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }
        break;
      case "date_desc":
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  }, [currentSort, filteredWords]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        bookmarkedWords={bookmarkedWords}
        onSearch={handleSearch}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        isHintActive={isHintActive}
        onHintToggle={handleHintToggle}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {sortedVocab.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sortedVocab.map((wordData, index) => (
              <FlippableWordCard
                key={index}
                wordData={wordData}
                index={index}
                isFlipped={!!flippedCards[index]}
                toggleFlip={toggleFlip}
                isHintActive={isHintActive}
                handleDeleteBookmark={handleDeleteBookmark}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white border-gray-200 p-12 text-center mb-6">
            <div className="max-w-md mx-auto">
              <div className={`p-6 rounded-full w-fit mx-auto mb-6`}>
                <Bookmark className={`h-16 w-16`} />
              </div>
              <h3 className={`text-2xl font-bold  mb-3`}>
                {searchQuery ? "No matching bookmarks" : "No bookmarks yet"}
              </h3>
              <p className={`text-base mb-8 leading-relaxed`}>
                {searchQuery
                  ? "Try adjusting your search terms or clear the search to see all bookmarks."
                  : "Start bookmarking words from your vocabulary collection to build your personalized study list."}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button
                    className={`text-white h-12 px-8 text-base shadow-lg transition-all hover:-translate-y-1`}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Words
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}

        {sortedVocab.length > 0 && (
          <Card className={`bg-gray-50 border-gray-200 p-8 text-center`}>
            <h3 className={`text-xl font-bold mb-6`}>Quick Actions</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="transparent"
                className="p-3 hover:border-blue-700 hover:bg-blue-100 transition-all"
              >
                Export Bookmarks
              </Button>
              <Button
                variant="transparent"
                className="p-3 hover:border-blue-700 hover:bg-blue-100 transition-all"
              >
                Study Session
              </Button>
              <Button
                variant="transparent"
                className="p-3 hover:border-blue-700 hover:bg-blue-100 transition-all"
              >
                Print List
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
