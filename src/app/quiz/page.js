"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { notFound } from "next/navigation";

// Library Imports
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";

// Component Imports
import Card from "@/components/Card";
import Button from "@/components/buttons/Button";
import Loader from "@/components/Loader";
import Header from "./Header";
import ReviewScreen from "./Result";

// Utility Imports
import { fetchWithBackoff, selectRandomWords } from "./helper";

const QUIZ_LENGTH = 5;
const FAILURE_THRESHOLD = 5;

const Progress = ({ value, className = "" }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Quiz progress"
      className={`w-full bg-[var(--slate-200)] rounded-full h-3 ${className}`}
    >
      <div
        className={`bg-[var(--primary-600)] h-3 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

const QuizGenerator = () => {
  const [quizWords, setQuizWords] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isWordsLoading, setIsWordsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  // Prevent double API calls in dev
  const hasFetched = useRef(false);

  // Derived State
  const currentQuiz = useMemo(() => quizHistory[currentIndex], [quizHistory, currentIndex]);

  const isAnswered = currentQuiz?.isAnswered;
  const isLastQuestion = currentIndex === quizHistory.length - 1;
  const isQuizCompleted = isLastQuestion && isAnswered;

  const { totalAnswered, totalScore } = useMemo(() => {
    let totalAnswered = 0;
    let totalScore = 0;

    quizHistory.forEach((q) => {
      if (q.isAnswered) totalAnswered++;
      if (q.userAnswer === q.correct_option) totalScore++;
    });

    return { totalAnswered, totalScore };
  }, [quizHistory]);

  const progressPercentage =
    quizWords.length === 0 ? 0 : Math.round((totalAnswered / quizWords.length) * 100);

  const fetchBatchQuestions = useCallback(async (selectedWords) => {
    setLoading(true);
    try {
      const response = await fetchWithBackoff("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: selectedWords }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const initializedQuestions = data.map((q) => ({
        ...q,
        userAnswer: null,
        isAnswered: false,
      }));

      setQuizHistory(initializedQuestions);
      setCurrentIndex(0);
      setConsecutiveFailures(0);
    } catch (err) {
      toast.error("Failed to generate quiz content.");
      setConsecutiveFailures((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllWords = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setIsWordsLoading(true);
    try {
      const response = await fetchWithBackoff("/api/word", {
        method: "GET",
      });

      const wordsArray = await response.json();

      if (response.ok && Array.isArray(wordsArray) && wordsArray.length > 0) {
        const selected = selectRandomWords(wordsArray, QUIZ_LENGTH);
        setQuizWords(selected);
        fetchBatchQuestions(selected);
      } else {
        toast.error("The database is empty.");
      }
    } catch {
      setConsecutiveFailures((prev) => prev + 1);
    } finally {
      setIsWordsLoading(false);
    }
  }, [fetchBatchQuestions]);

  // EFFECT: Check if the failure threshold has been reached
  useEffect(() => {
    if (consecutiveFailures >= FAILURE_THRESHOLD) {
      // Call the Next.js notFound function
      notFound();
    }
  }, [consecutiveFailures]);

  useEffect(() => {
    fetchAllWords();
  }, [fetchAllWords]);

  // Focus question on change (non-visual improvement)
  useEffect(() => {
    const el = document.getElementById("question-heading");
    el?.focus();
  }, [currentIndex]);

  const handleRestart = () => {
    hasFetched.current = false;
    setQuizHistory([]);
    setCurrentIndex(-1);
    setIsReviewing(false);
    fetchAllWords();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < quizHistory.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnswerClick = (option) => {
    if (isAnswered) return;

    setQuizHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory[currentIndex] = {
        ...newHistory[currentIndex],
        userAnswer: option,
        isAnswered: true,
      };
      return newHistory;
    });
  };

  const handleReviewSelect = (index) => {
    setIsReviewing(false);
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getOptionClass = (option) => {
    // If not answered, use hover/default styling
    if (!isAnswered) {
      return "bg-white border-[var(--slate-300)] text-[var(--slate-800)] hover:bg-[var(--primary-50)] hover:border-[var(--primary)] shadow-sm transition-all hover:scale-[1.01]";
    }

    // Review/Answered Mode (Show feedback colors)
    if (option === currentQuiz.correct_option) {
      return "border-green-500 bg-green-500/20 text-green-700 shadow-md transition-all";
    }
    if (option === currentQuiz.userAnswer && option !== currentQuiz.correct_option) {
      return "border-[var(--red)] bg-red-500/20 text-red-700 shadow-md transition-all";
    }
    return "bg-[var(--slate-100)] border-[var(--slate-200)] text-[var(--slate-500)] cursor-default transition-all";
  };

  const isTotalLoading = isWordsLoading || (loading && quizHistory.length === 0);
  const isActionButtonDisabled = isTotalLoading || !currentQuiz || !isAnswered;

  const handleMainButtonClick = () => {
    if (isQuizCompleted) {
      setIsReviewing(true);
    } else {
      handleNext();
    }
  };

  if (isWordsLoading || (loading && quizHistory.length === 0)) {
    return (
      <Card className="text-center py-20 w-full mb-8">
        <Loader message="Loading the list..." fullScreen={false} aria-live="polite" />
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--slate-100)] font-sans">
      <h1 className="sr-only">Vocabulary Quiz</h1>

      <Header handleRestart={handleRestart} />

      {isReviewing ? (
        <ReviewScreen
          quizHistory={quizHistory}
          totalScore={totalScore}
          totalQuestions={quizHistory.length}
          onReviewSelect={handleReviewSelect}
          onRestart={handleRestart}
        />
      ) : (
        <div className="container mx-auto py-4 px-4 md:px-8">
          {currentQuiz && (
            <>
              {/* Screen reader live region */}
              <div aria-live="polite" className="sr-only">
                {totalScore} correct answers out of {quizHistory.length}
              </div>

              {/* Progress */}
              <div className="mb-8 space-y-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--slate-500)]">
                      Question {currentIndex + 1} of {quizWords.length}
                    </p>
                    <p className="text-2xl font-bold text-[var(--slate-900)]">
                      {totalScore} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[var(--primary-600)]">
                      {progressPercentage}%
                    </div>
                    <p className="text-xs text-[var(--slate-500)]">Quiz Progress</p>
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <Card className="p-8 md:p-12 mb-6 shadow-md">
                <div className="mb-8">
                  <h2
                    id="question-heading"
                    tabIndex={-1}
                    className="text-2xl font-bold mb-3 text-[var(--slate-900)]"
                  >
                    {currentQuiz.question}
                  </h2>
                </div>

                <div role="radiogroup" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {currentQuiz.options.map((option, index) => {
                    const isSelected = currentQuiz.userAnswer === option;

                    return (
                      <Button
                        key={index}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        variant="transparent"
                        onClick={() => handleAnswerClick(option)}
                        disabled={isAnswered}
                        className={`w-full h-auto py-5 px-6 text-md rounded-lg border-2 justify-start disabled:opacity-90 ${
                          isAnswered && "!justify-between"
                        } ${getOptionClass(option)}`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full bg-[var(--slate-100)] text-sm ${
                              isAnswered ? "bg-white" : "border-[var(--slate-300)]"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 text-base text-md">{option}</span>
                        </span>

                        {isAnswered && option === currentQuiz.correct_option && (
                          <CheckCircle
                            aria-label="Correct answer"
                            className="h-5 w-5 text-green-500 flex-shrink-0"
                          />
                        )}
                        {isAnswered &&
                          option === currentQuiz.userAnswer &&
                          option !== currentQuiz.correct_option && (
                            <XCircle
                              aria-label="Incorrect answer"
                              className="h-5 w-5 text-[var(--red)] flex-shrink-0"
                            />
                          )}
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-10 pt-6 border-t border-[var(--slate-200)] flex flex-col gap-4 md:flex-row md:justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-5 py-4 bg-[var(--slate-100)] border-[var(--slate-300)] !text-[var(--slate-700)] hover:bg-[var(--slate-200)] w-full md:w-auto flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleMainButtonClick}
                    disabled={isActionButtonDisabled}
                    className={`w-full md:w-auto flex items-center justify-center py-4`}
                  >
                    {isQuizCompleted ? "View Results" : "Next Question"}
                    {isQuizCompleted ? (
                      <Eye className="w-5 h-5 ml-1" />
                    ) : (
                      <ChevronRight className="w-5 h-5 ml-1" />
                    )}
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
