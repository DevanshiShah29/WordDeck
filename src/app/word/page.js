"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Utility Imports
import { buildQueryString } from "@/utils/helper";

// Component Imports
import VocabCard from "@/components/VocabCard";
import VocabularyHeader from "@/components/VocabularyHeader";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";

const LOCAL_STORAGE_KEY = "vocab_app_state";

// Application State - Source of Truth for all parameters
const DEFAULT_APP_STATE = {
  page: 1,
  limit: 12,
  sort: "date_desc",
  search: "",
  type: [],
  tag: [],
  level: [],
  origin: [],
  wordLength: [],
  isBookmarked: false,
  dateRangeFrom: undefined,
  dateRangeTo: undefined,
};

// Default Pagination State
const DEFAULT_PAGINATION = {
  currentPage: 1,
  wordsPerPage: 12,
  totalWords: 0,
  totalPages: 1,
};

// Helper to load state from Local Storage
const loadAppState = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (saved) {
        const parsedState = JSON.parse(saved);
        return {
          ...DEFAULT_APP_STATE,
          ...parsedState,
          isBookmarked: parsedState.isBookmarked === "true" || parsedState.isBookmarked === true,
        };
      }
    } catch (e) {
      console.error("Could not parse app state from localStorage", e);
    }
  }
  return DEFAULT_APP_STATE;
};

// Helper to save state to Local Storage
const saveAppState = (state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }
};

export default function HomePage() {
  const router = useRouter();

  const [appState, setAppState] = useState(null);
  const [vocabResponse, setVocabResponse] = useState({
    data: [],
    pagination: DEFAULT_PAGINATION,
  });
  const [loading, setLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const updateAppState = useCallback((updates, shouldResetPage = true) => {
    setAppState((prevState) => {
      const newState = {
        ...prevState,
        ...updates,
      };

      // Reset page to 1 if necessary (for search, sort, or filter changes)
      if (shouldResetPage) {
        newState.page = 1;
      }

      saveAppState(newState);
      return newState;
    });
  }, []);

  const handleSortChange = useCallback(
    (newSort) => {
      updateAppState({ sort: newSort }, false);
    },
    [updateAppState]
  );

  const handleSearch = useCallback(
    (newSearchTerm) => {
      updateAppState({ search: newSearchTerm || "" }, true);
    },
    [updateAppState]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      const filterUpdates = {
        type: newFilters.type || [],
        tag: newFilters.tag || [],
        level: newFilters.level || [],
        origin: newFilters.origin || [],
        wordLength: newFilters.wordLength || [],
        isBookmarked: !!newFilters.isBookmarked,
        dateRangeFrom: newFilters.dateRange.from,
        dateRangeTo: newFilters.dateRange.to,
      };
      updateAppState(filterUpdates, true);
    },
    [updateAppState]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      updateAppState({ page: newPage }, false);
    },
    [updateAppState]
  );

  const onBookmarkClick = useCallback(() => {
    router.push("/bookmarks");
  }, [router]);

  //  API Fetch Parameters
  const apiParams = useMemo(() => {
    if (!appState) return {}; // Safety check
    return {
      page: appState.page,
      limit: appState.limit,
      sort: appState.sort,
      search: appState.search,

      // Filters
      type: appState.type,
      tag: appState.tag,
      level: appState.level,
      origin: appState.origin,
      wordLength: appState.wordLength,

      // Convert boolean back to API string for backend
      isBookmarked: appState.isBookmarked ? "true" : undefined,
      dateRangeFrom: appState.dateRangeFrom,
      dateRangeTo: appState.dateRangeTo,
    };
  }, [appState]);

  // Header Filters object for display
  const headerFilters = useMemo(() => {
    if (!appState) return {}; // Safety check
    return {
      searchTerm: appState.search,
      type: appState.type,
      tag: appState.tag,
      level: appState.level,
      origin: appState.origin,
      wordLength: appState.wordLength,
      isBookmarked: appState.isBookmarked,
      dateRange: { from: appState.dateRangeFrom, to: appState.dateRangeTo },
    };
  }, [appState]);

  // Display/Helper Calculations (Client-side logic)
  const displayVocab = useMemo(() => {
    if (!appState || vocabResponse.data.length === 0) return [];

    if (appState.sort === "random") {
      let sorted = [...vocabResponse.data];
      // Fisher-Yates shuffle
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
      return sorted;
    }
    return vocabResponse.data;
  }, [vocabResponse.data, appState]);

  const bookmarkCount = useMemo(
    () => displayVocab.filter((v) => v.bookmarked).length,
    [displayVocab]
  );

  // Initialize state from Local Storage once on client side
  useEffect(() => {
    if (appState === null) {
      setAppState(loadAppState());
    }
  }, [appState]);

  // Effect to fetch data on apiParams change
  useEffect(() => {
    if (appState === null) return;

    const newQueryString = buildQueryString(apiParams);

    if (loading) {
      setLoading(true);
    } else {
      setIsContentLoading(true);
    }

    fetch(`/api/words?${newQueryString}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch words");
        return res.json();
      })
      .then((response) => {
        // Extract data and pagination from the response
        const responseData = response.data || [];
        const responsePagination = response.pagination || DEFAULT_PAGINATION;
        // If there's no data or totalWords is 0, ensure totalPages is 1
        let newTotalPages = responsePagination.totalPages;
        if (responseData.length === 0 || responsePagination.totalWords === 0) {
          newTotalPages = 1;
        }

        setVocabResponse({
          data: responseData.map((word) => ({ ...word, bookmarked: !!word.bookmarked })),
          pagination: {
            ...responsePagination,
            totalPages: newTotalPages,
          },
        });
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setVocabResponse((prev) => ({
          data: [],
          pagination: { ...prev.pagination, totalWords: 0, totalPages: 1 },
        }));
      })
      .finally(() => {
        setLoading(false);
        setIsContentLoading(false);
      });
  }, [apiParams, loading, appState]);

  if (appState === null) {
    return <Loader message="Initializing state..." />;
  }

  const { totalPages, currentPage, totalWords } = vocabResponse.pagination;

  if (loading && vocabResponse.data.length === 0) {
    return <Loader message="Loading vocabulary list..." />;
  }

  return (
    <>
      <VocabularyHeader
        totalWords={totalWords}
        bookmarkCount={bookmarkCount}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={headerFilters}
        currentSort={appState.sort}
        onSortChange={handleSortChange}
        onBookmarkClick={onBookmarkClick}
      />

      {isContentLoading ? (
        <Loader message="Updating words..." fullScreen={false} />
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayVocab.length > 0 ? (
                displayVocab.map((vocab) => (
                  <VocabCard
                    key={vocab._id || vocab.slug}
                    {...vocab}
                    phonetic={vocab.pronunciation}
                    isBookmarked={vocab.bookmarked}
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
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
