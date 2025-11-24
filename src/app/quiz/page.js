"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";

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

const Progress = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className={`bg-[var(--primary-600)] h-3 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

const QuizGenerator = () => {
  const [allWords, setAllWords] = useState([]);
  const [quizWords, setQuizWords] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [usedWords, setUsedWords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWordsLoading, setIsWordsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [wordBeingFetched, setWordBeingFetched] = useState(null);

  // Derived State
  const currentQuiz = useMemo(() => quizHistory[currentIndex], [quizHistory, currentIndex]);
  const isAnswered = currentQuiz?.isAnswered;
  const isLastGeneratedQuestion = currentIndex === quizHistory.length - 1;

  const isGenerationComplete = usedWords.length === quizWords.length && quizWords.length > 0;
  const isQuizCompleted = isGenerationComplete && isAnswered && isLastGeneratedQuestion;

  const totalQuestionsAnswered = quizHistory.filter((q) => q.isAnswered).length;
  const totalScore = useMemo(() => {
    return quizHistory.filter((q) => q.userAnswer === q.correct_option).length;
  }, [quizHistory]);

  const progressPercentage =
    quizWords.length === 0 ? 0 : Math.round((totalQuestionsAnswered / quizWords.length) * 100);

  // Checks if we are transitioning from word loading to first question generation
  const isFirstQuestionGenerating =
    !isWordsLoading && quizWords.length > 0 && quizHistory.length === 0 && loading;

  // Data Fetching and Selection Logic
  const fetchAllWords = useCallback(async () => {
    setQuizWords([]);
    setAllWords([]);
    setIsWordsLoading(true);

    try {
      setError(null);
      const response = await fetchWithBackoff("/api/word", { method: "GET" });
      const wordsArray = await response.json();
      if (response.ok && Array.isArray(wordsArray)) {
        setAllWords(wordsArray);
        if (wordsArray.length === 0) {
          toast.error("The database is empty. Please add words to start the quiz.");
          setQuizWords([]);
        } else {
          const selected = selectRandomWords(wordsArray, QUIZ_LENGTH);
          setQuizWords(selected);
        }
      } else {
        throw new Error(wordsArray.error || "Failed to fetch word list from server.");
      }
    } catch (err) {
      toast.error(err.message || "Could not load the list.");
    } finally {
      setIsWordsLoading(false);
    }
  }, []);

  const fetchQuizQuestion = useCallback(async (word) => {
    const payload = { word: word };

    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithBackoff("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        const errorMessage = result.error?.message || "Failed to generate quiz content.";
        throw new Error(errorMessage);
      }

      const parsedData = result;
      const newQuestion = { ...parsedData, userAnswer: null, isAnswered: false, word: word };

      // FIX: Update history AND index synchronously on success
      setQuizHistory((prev) => {
        const newHistory = [...prev, newQuestion];
        // If this is the very first question, set index to 0
        if (prev.length === 0) {
          setCurrentIndex(0);
        } else {
          // Otherwise, move to the newly added index
          setCurrentIndex(prev.length);
        }
        return newHistory;
      });
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred during quiz generation.");
    } finally {
      setLoading(false);
      setWordBeingFetched(null);
    }
  }, []);

  const generateNewQuestion = useCallback(() => {
    if (usedWords.length === quizWords.length) {
      setLoading(false);
      return;
    }

    const availableWords = quizWords.filter((word) => !usedWords.includes(word));
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const nextWord = availableWords[randomIndex];

    setUsedWords((prev) => [...prev, nextWord]);
    setWordBeingFetched(nextWord);
    fetchQuizQuestion(nextWord);
  }, [usedWords, quizWords, fetchQuizQuestion]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (allWords.length === 0 && !error && isWordsLoading) {
      fetchAllWords();
    }
  }, [allWords.length, error, fetchAllWords, isWordsLoading]);

  useEffect(() => {
    if (!isWordsLoading && quizWords.length > 0 && quizHistory.length === 0 && !loading && !error) {
      generateNewQuestion();
    }
  }, [isWordsLoading, quizWords.length, quizHistory.length, loading, error, generateNewQuestion]);

  const handleRestart = () => {
    setUsedWords([]);
    setQuizHistory([]);
    setCurrentIndex(-1);
    setError(null);
    setIsReviewing(false);
    fetchAllWords();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizHistory.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (isLastGeneratedQuestion && isAnswered && !isQuizCompleted) {
      generateNewQuestion();
    }
  };

  const handleAnswerClick = (option) => {
    if (!isLastGeneratedQuestion || isAnswered) return;

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
  };

  const getOptionClass = (option) => {
    // If not answered, use hover/default styling
    if (!isAnswered && isLastGeneratedQuestion) {
      return "bg-white border-gray-300 text-gray-800 hover:bg-[var(--primary-50)] hover:border-[var(--primary)] shadow-sm transition-all hover:scale-[1.01]";
    }

    // Review/Answered Mode (Show feedback colors)
    if (option === currentQuiz.correct_option) {
      return "border-green-500 bg-green-500/20 text-green-700 shadow-md transition-all";
    }
    if (option === currentQuiz.userAnswer && option !== currentQuiz.correct_option) {
      return "border-[var(--red)] bg-red-500/20 text-red-700 shadow-md transition-all";
    }
    return "bg-gray-100 border-gray-200 text-gray-500 cursor-default transition-all";
  };

  const actionButtonText = isQuizCompleted
    ? "View Results"
    : currentIndex < quizHistory.length - 1
    ? "Next Question"
    : "Generate Next Word";

  const isTotalLoading = loading || isWordsLoading || isFirstQuestionGenerating;

  const isActionButtonDisabled =
    isTotalLoading ||
    !currentQuiz ||
    (!isAnswered && isLastGeneratedQuestion && !isGenerationComplete);

  const handleMainButtonClick = () => {
    if (isQuizCompleted || (isGenerationComplete && isLastGeneratedQuestion && isAnswered)) {
      setIsReviewing(true);
      return;
    }
    handleNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/20 font-sans">
      <Header handleRestart={handleRestart} />
      {isReviewing ? (
        <ReviewScreen
          quizHistory={quizHistory}
          totalScore={totalScore}
          totalQuestions={quizWords.length}
          onReviewSelect={handleReviewSelect}
          onRestart={handleRestart}
        />
      ) : (
        <div className="container mx-auto py-4 px-4 md:px-8">
          {/*  Loading List  */}
          {isWordsLoading && (
            <Card className="text-center py-20 w-full mb-8">
              <Loader message="Loading the list..." fullScreen={false} />
            </Card>
          )}

          {/* Generating First Question  */}
          {isFirstQuestionGenerating && (
            <Card className="text-center py-20 w-full mb-8">
              <Loader message="Generating first question..." fullScreen={false} />
            </Card>
          )}

          {/* Main Quiz Content (Only renders if a question is available AND not in the initial loading states) */}
          {currentQuiz && !isWordsLoading && !isFirstQuestionGenerating && (
            <>
              {/* Progress & Score Metrics */}
              <div className="mb-8 space-y-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Question {currentIndex + 1} of {quizWords.length}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{totalScore} correct</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold text-[var(--primary-600)]`}>
                      {progressPercentage}%
                    </div>
                    <p className="text-xs text-gray-500">Quiz Progress</p>
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              {/* Generating Subsequent Question (Below progress bar) */}
              {loading ? (
                <Card className="text-center py-16 mb-8">
                  <Loader
                    message={`Generating question for ${wordBeingFetched} ...`}
                    fullScreen={false}
                  />
                </Card>
              ) : (
                // Main Quiz Card
                <Card className="p-8 md:p-12 mb-6 shadow-xl">
                  {/* Question section */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">{currentQuiz.word}</h2>
                    <p className="text-lg text-gray-600">{currentQuiz.question}</p>
                  </div>

                  {/* Options section */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentQuiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        disabled={!isLastGeneratedQuestion || isAnswered}
                        className={`
                        w-full justify-between h-auto py-5 px-6 text-left text-md font-medium rounded-xl border-2 
                        flex items-center text-left
                        ${getOptionClass(option)}
                      `}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm ${
                              isAnswered ? "bg-white" : "border-gray-300"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 text-base text-md">{option}</span>
                        </span>
                        {isAnswered && (
                          <>
                            {option === currentQuiz.correct_option && (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                            {option === currentQuiz.userAnswer &&
                              option !== currentQuiz.correct_option && (
                                <XCircle className="h-5 w-5 text-[var(--red)] flex-shrink-0" />
                              )}
                          </>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Navigation Section */}
                  <div
                    className="
                  mt-10 pt-6 border-t border-gray-200 
    flex flex-col gap-4
    md:flex-row md:justify-between
                  "
                  >
                    <Button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0 || isTotalLoading}
                      className="
                      px-5 py-3 bg-gray-100 border-gray-300 !text-gray-700 hover:bg-gray-200

      w-full md:w-auto 
      flex items-center justify-center
                       "
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      Previous
                    </Button>
                    <Button
                      varient="primary"
                      onClick={handleMainButtonClick}
                      disabled={isActionButtonDisabled}
                      className={`
                        px-5 py-3 
      w-full md:w-auto 
      flex items-center justify-center
                        `}
                    >
                      {actionButtonText}
                      {actionButtonText.includes("Next") ? (
                        <ChevronRight className="w-5 h-5 ml-1" />
                      ) : null}

                      {actionButtonText.includes("Results") ? (
                        <Eye className="w-5 h-5 ml-1" />
                      ) : null}
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
