"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Library Imports
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  ListTodo,
  Eye,
  Trophy,
} from "lucide-react";
import { toast } from "react-toastify";

// Component Imports
import Card from "@/components/Card";
import Button from "@/components/buttons/Button";
import Loader from "@/components/Loader";
import Header from "./Header";

// Utility Imports
import { fetchWithBackoff, selectRandomWords } from "./helper";

// --- Configuration ---
const QUIZ_LENGTH = 10;
const PRIMARY_COLOR_CLASS = "text-indigo-600";
const PRIMARY_BG_CLASS = "bg-indigo-600";

const Progress = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className={`${PRIMARY_BG_CLASS} h-3 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

const ReviewScreen = ({ quizHistory, totalScore, totalQuestions, onReviewSelect, onRestart }) => {
  const scorePercentage = ((totalScore / totalQuestions) * 100).toFixed(0);

  const getReviewItemClass = (quiz) => {
    return quiz.userAnswer === quiz.correct_option
      ? "bg-green-500/5 border-green-500/30"
      : "bg-red-500/5 border-red-500/30";
  };

  return (
    <div className="container mx-auto space-y-6 w-full">
      {/* Completion Card */}
      <Card className="p-8 md:p-12 text-center">
        <div
          className={`inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-50 mb-6`}
        >
          <Trophy className={`h-10 w-10 ${PRIMARY_COLOR_CLASS}`} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz Complete!</h2>
        <div className="inline-flex items-baseline gap-2 mb-6">
          <span className={`text-3xl font-bold ${PRIMARY_COLOR_CLASS}`}>{totalScore}</span>
          <span className="text-2xl text-gray-500">/ {totalQuestions}</span>
        </div>
        <p className="text-xl font-medium text-gray-500 mb-8">
          {scorePercentage === "100"
            ? "Perfect score! 🎉"
            : scorePercentage >= 70
            ? "Great job! 👏"
            : scorePercentage >= 50
            ? "Good effort! 💪"
            : "Keep practicing! 📚"}
        </p>
        <Button
          onClick={onRestart}
          className={`inline-flex items-center justify-center px-6 py-3 ${PRIMARY_BG_CLASS} gap-2`}
        >
          <RotateCw className="w-5 h-5" /> Start New Quiz
        </Button>
      </Card>
      {/* Review Answers Card */}
      <Card className="p-8 md:p-10">
        <h3
          className={`text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-3`}
        >
          <ListTodo className={`w-6 h-6 ${PRIMARY_COLOR_CLASS}`} /> Review Your Answers
        </h3>
        <div className="space-y-4">
          {quizHistory.map((quiz, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border-2 rounded-lg transition hover:shadow-md cursor-pointer ${getReviewItemClass(
                quiz
              )}`}
              onClick={() => onReviewSelect(index)}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-sm border-2 ${
                    quiz.userAnswer === quiz.correct_option
                      ? "border-green-500 text-green-700"
                      : "border-red-500 text-red-700"
                  }`}
                >
                  {index + 1}
                </span>
                <p className="font-semibold text-gray-800">{quiz.word}</p>
              </div>
              <div className="flex items-center gap-3">
                {quiz.userAnswer === quiz.correct_option ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <Eye
                  className={`w-5 h-5 text-indigo-500 hover:text-indigo-700`}
                  onClick={(e) => {
                    e.stopPropagation();

                    router.push(`/word/${quiz.word}`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
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

  // --- Derived State ---
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

  // --- Data Fetching and Selection Logic ---
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
          toast.error("The vocabulary database is empty. Please add words to start the quiz.");
          setQuizWords([]);
        } else {
          const selected = selectRandomWords(wordsArray, QUIZ_LENGTH);
          setQuizWords(selected);
        }
      } else {
        throw new Error(wordsArray.error || "Failed to fetch word list from server.");
      }
    } catch (err) {
      toast.error(err.message || "Could not load vocabulary list.");
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
    if (allWords.length === 0 && !error && isWordsLoading) {
      fetchAllWords();
    }
  }, [allWords.length, error, fetchAllWords, isWordsLoading]);

  useEffect(() => {
    if (!isWordsLoading && quizWords.length > 0 && quizHistory.length === 0 && !loading && !error) {
      // This will fetch the *first* question (word 1 of 10)
      generateNewQuestion();
    }
  }, [isWordsLoading, quizWords.length, quizHistory.length, loading, error, generateNewQuestion]);

  // --- Interaction Handlers ---

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
      return "bg-white border-gray-300 text-gray-800 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm transition-all hover:scale-[1.01]";
    }

    // Review/Answered Mode (Show feedback colors)
    if (option === currentQuiz.correct_option) {
      return "border-green-500 bg-green-500/20 text-green-700 shadow-md transition-all";
    }
    if (option === currentQuiz.userAnswer && option !== currentQuiz.correct_option) {
      return "border-red-500 bg-red-500/20 text-red-700 shadow-md transition-all";
    }
    return "bg-gray-100 border-gray-200 text-gray-500 cursor-default transition-all";
  };

  if (isReviewing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/20 font-sans p-4 sm:p-8 flex items-start justify-center pt-12">
        <ReviewScreen
          quizHistory={quizHistory}
          totalScore={totalScore}
          totalQuestions={quizWords.length}
          onReviewSelect={handleReviewSelect}
          onRestart={handleRestart}
        />
      </div>
    );
  }

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

      <div className="container mx-auto p-4 sm:p-8 pt-12">
        {/*  Loading Vocabulary List (Below header) */}
        {isWordsLoading && (
          <Card className="text-center py-20 w-full mb-8">
            <Loader message="Loading vocabulary list..." fullScreen={false} />
          </Card>
        )}

        {/* Generating First Question (Below header, after words loaded but before first question generated) */}
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
                  <div className={`text-4xl font-bold ${PRIMARY_COLOR_CLASS}`}>
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
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {/* Navigation Section */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between gap-3">
                  {/* Previous Button */}
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0 || isTotalLoading}
                    className="flex items-center px-4 py-2 bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 "
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                  </Button>
                  {/* Next/Results Button */}
                  <Button
                    varient="primary"
                    onClick={handleMainButtonClick}
                    disabled={isActionButtonDisabled}
                    className={`flex-1 max-w-xs inline-flex px-6 py-3`}
                  >
                    {actionButtonText}
                    {actionButtonText.includes("Next") ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : null}

                    {actionButtonText.includes("Results") ? <Eye className="w-5 h-5" /> : null}
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
