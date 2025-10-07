"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

// Library Imports
import { useSearchParams, useRouter } from "next/navigation";

// Utility Imports
import { filterVocabularies } from "@/utils/filterVocabularies";
import { fetchAllWords } from "./helper";

// Component Imports
import VocabCard from "@/components/VocabCard";
import VocabularyHeader from "@/components/VocabularyHeader";

export default function HomePage() {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    tag: [],
    level: [],
    dateRange: { from: undefined, to: undefined },
  });
  const [vocabData, setVocabData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredVocab = useMemo(() => {
    if (!Array.isArray(vocabData)) {
      return [];
    }
    return filterVocabularies(vocabData, { ...filters, searchTerm });
  }, [filters, searchTerm, vocabData]);

  const bookmarkCount = useMemo(
    () => (Array.isArray(vocabData) ? vocabData.filter((v) => v.isBookmarked).length : 0),
    [vocabData]
  );

  if (loading) {
    return <p className="p-8 text-xl text-slate-600">Loading vocabulary list...</p>;
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
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocab.length > 0 ? (
              filteredVocab.map((vocab) => (
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
