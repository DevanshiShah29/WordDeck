import { CheckCircle, Eye, ListTodo, RotateCw, Trophy, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/buttons/Button";
import { slugify } from "@/utils/helper";

const ReviewScreen = ({ quizHistory, totalScore, totalQuestions, onReviewSelect, onRestart }) => {
  const scorePercentage = ((totalScore / totalQuestions) * 100).toFixed(0);
  const router = useRouter();

  const getReviewItemClass = (quiz) => {
    return quiz.userAnswer === quiz.correct_option
      ? "bg-green-500/5 border-green-500/30"
      : "bg-red-500/5 border-red-500/30";
  };

  return (
    <>
      <div className="container mx-auto py-4 px-4 md:px-8">
        {/* Completion Card */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <Card className="p-8 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="var(--primary)"
                  strokeWidth="8"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * totalScore) / totalQuestions}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-semibold text-lg text-[var(--primary)]">
                {totalScore}/{totalQuestions}
              </span>
            </div>
            {scorePercentage < 70 ? (
              <p className="text-sm text-[var(--slate-600)] mt-2 text-center">
                Try revising some words and take the quiz again 💡
              </p>
            ) : (
              <p className="text-sm text-green-600 mt-2">You’re mastering your vocabulary! 🌟</p>
            )}
          </Card>

          <Card className="p-8 flex flex-col justify-center space-y-3 text-center">
            <h3 className="text-xl font-semibold text-[var(--slate-800)]">Performance Summary</h3>

            <div className="space-y-1 text-sm text-[var(--slate-600)]">
              <p>
                Total Questions:{" "}
                <span className="font-medium text-[var(--slate-900)]">{totalQuestions}</span>
              </p>
              <p>
                Correct Answers: <span className="font-medium text-green-600">{totalScore}</span>
              </p>
              <p>
                Incorrect Answers:{" "}
                <span className="font-medium text-red-600">{totalQuestions - totalScore}</span>
              </p>
              <p>
                Accuracy:{" "}
                <span className="font-medium text-[var(--primary)]">{scorePercentage}%</span>
              </p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-center items-center space-y-3 text-center">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 text-[var(--primary-600)]`} />
              <h2 className="text-xl font-semibold text-[var(--slate-800)]">Quiz Complete!</h2>
            </div>

            <p className="text-lg text-[var(--slate-600)]">
              {scorePercentage === 100
                ? "Perfect score! 🎉"
                : scorePercentage >= 70
                ? "Great job! 👏"
                : scorePercentage >= 50
                ? "Good effort! 💪"
                : "Keep practicing! 📚"}
            </p>

            <div className="flex gap-2 w-full mt-4">
              <Button
                onClick={() => router.push("/word")}
                className={`mt-2 px-4 py-3 w-1/2 bg-[var(--slate-200)] !text-[var(--slate-700)] hover:bg-[var(--slate-300)]`}
              >
                Revise words
              </Button>
              <Button
                onClick={onRestart}
                className={`mt-2 px-4 py-3 w-1/2 bg-[var(--primary-600)] gap-2`}
              >
                <RotateCw className="w-4 h-4 " /> Restart
              </Button>
            </div>
          </Card>
        </div>

        {/* Review Answers Card */}
        <Card className="p-8">
          <h3
            className={`text-xl font-bold mb-6 flex items-center gap-2 text-[var(--slate-800)] pb-3`}
          >
            <ListTodo className={`w-6 h-6 text-[var(--primary-600)]`} /> Review Your Answers
          </h3>
          <div className="space-y-4">
            {quizHistory.map((quiz, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border-2 rounded-lg transition cursor-pointer ${getReviewItemClass(
                  quiz
                )}`}
                onClick={() => onReviewSelect(index)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-sm border-2 ${
                      quiz.userAnswer === quiz.correct_option
                        ? "border-green-500 text-green-700"
                        : "border-[var(--red)] text-red-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <p className="font-semibold text-[var(--slate-800)]">{quiz.word}</p>
                </div>
                <div className="flex items-center gap-3">
                  {quiz.userAnswer === quiz.correct_option ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <Eye
                    className={`w-5 h-5 text-[var(--primary)] hover:text-[var(--primary-600)]`}
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(`/word/${slugify(quiz.word)}`);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default ReviewScreen;
