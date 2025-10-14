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
import Pagination from "@/components/Pagination";

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
    origin: [],
    wordLength: [],
    isBookmarked: false,
    dateRange: { from: undefined, to: undefined },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 12; // Define your limit

  // Sync filters from URL search params
  useEffect(() => {
    const dateRangeFrom = searchParams.get("dateRangeFrom") || undefined;
    const dateRangeTo = searchParams.get("dateRangeTo") || undefined;

    const newFilters = {
      type: searchParams.getAll("type"),
      tag: searchParams.getAll("tag"),
      level: searchParams.getAll("level"),
      origin: searchParams.getAll("origin"),
      wordLength: searchParams.getAll("wordLength"),
      isBookmarked: searchParams.get("isBookmarked") === "true",
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

  const handleSortChange = useCallback((newSort) => {
    setCurrentSort(newSort);
  }, []);

  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const filteredVocab = useMemo(() => {
    if (!Array.isArray(vocabData)) {
      return [];
    }
    return filterVocabularies(vocabData, { ...filters, searchTerm });
  }, [filters, searchTerm, vocabData]);

  const sortedVocab = useMemo(() => {
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

  // PAGINATION LOGIC: Slice the sorted data
  const totalPages = Math.ceil(sortedVocab.length / wordsPerPage);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  const displayVocab = useMemo(() => {
    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return sortedVocab.slice(startIndex, endIndex);
  }, [sortedVocab, currentPage, wordsPerPage]);

  // Ensure current page is valid when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && sortedVocab.length > 0) {
      setCurrentPage(1);
    }
  }, [sortedVocab.length, totalPages, currentPage]);

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
        totalWords={filteredVocab.length}
        bookmarkCount={bookmarkCount}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={headerFilters}
        currentSort={currentSort}
        onSortChange={handleSortChange}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
