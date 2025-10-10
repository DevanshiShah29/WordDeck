// src/app/word/page.js
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

// Library Imports
import { useSearchParams } from "next/navigation";

// Utility Imports
import { filterVocabularies } from "@/utils/filterVocabularies";
import { fetchAllWords } from "./helper";
import { LEVEL_ORDER } from "@/utils/constants";

// Component Imports
import VocabCard from "@/components/VocabCard";
import VocabularyHeader from "@/components/VocabularyHeader";
import Loader from "@/components/Loader";

export default function HomePage() {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [vocabData, setVocabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState("date_desc");
  const [filters, setFilters] = useState({
    type: [],
    tag: [],
    level: [],
    dateRange: { from: undefined, to: undefined },
  });

  // Sync filters from URL search params
  useEffect(() => {
    const dateRangeFrom = searchParams.get("dateRangeFrom") || undefined;
    const dateRangeTo = searchParams.get("dateRangeTo") || undefined;

    const newFilters = {
      type: searchParams.getAll("type"),
      tag: searchParams.getAll("tag"),
      level: searchParams.getAll("level"),
      dateRange: { from: dateRangeFrom, to: dateRangeTo },
    };

    setFilters(newFilters);
  }, [searchParams]);

  // Initial data fetch
  useEffect(() => {
    fetchAllWords()
      .then((data) => {
        setVocabData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setCurrentSort(newSort);
  }, []);

  const filteredVocab = useMemo(() => {
    if (!Array.isArray(vocabData)) {
      return [];
    }
    return filterVocabularies(vocabData, { ...filters, searchTerm });
  }, [filters, searchTerm, vocabData]);

  const displayVocab = useMemo(() => {
    const wordsToSort = filteredVocab;
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
      case "date_desc":
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  }, [filteredVocab, currentSort]);

  const bookmarkCount = useMemo(
    () => (Array.isArray(vocabData) ? vocabData.filter((v) => v.isBookmarked).length : 0),
    [vocabData]
  );

  if (loading) {
    return <Loader message="Loading vocabulary list..." />;
  }

  const headerFilters = { ...filters, searchTerm: searchTerm };

  return (
    <>
      <VocabularyHeader
        totalWords={displayVocab.length}
        bookmarkCount={bookmarkCount}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={headerFilters}
        currentSort={currentSort}
        onSortChange={handleSortChange}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVocab.length > 0 ? (
              displayVocab.map((vocab) => (
                <VocabCard
                  key={vocab._id || vocab.slug}
                  {...vocab}
                  phonetic={vocab.pronunciation}
                />
              ))
            ) : (
              <p className="text-slate-500 text-lg sm:col-span-2 lg:col-span-3">
                No words match the current filters. Try broadening your search!
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
