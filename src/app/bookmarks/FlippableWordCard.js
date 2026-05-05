import React from "react";

// Library Imports
import { RotateCcw, BookmarkMinus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Component Imports
import Card from "./Card";
import CardContent from "./CardContent";
import Button from "@/components/buttons/Button";

// Utility Imports
import { typeColorMap, difficultyColorMap } from "@/utils/constants";
import { capitalizeFirstLetter, formatWordListProp } from "@/utils/helper";
import { updateWordStatus } from "./helper";

const FlippableWordCard = ({
  wordData,
  index,
  isFlipped,
  toggleFlip,
  isHintActive,
  handleDeleteBookmark,
  handleStatusChange,
}) => {
  const router = useRouter();
  const getDifficultyClasses = (difficulty) => {
    return difficultyColorMap[difficulty?.toLowerCase()];
  };

  const getTypeGradient = (type) => {
    return typeColorMap[type.toLowerCase()] || typeColorMap.default;
  };

  const safeTags = formatWordListProp(wordData.tags);
  const safeSynonyms = formatWordListProp(wordData.synonyms);
  const shouldShowImage = isHintActive && !!wordData.imageUrl;

  const hintStyles = shouldShowImage
    ? {
        backgroundImage: `url(${wordData.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }
    : {};

  const textColorClass = shouldShowImage ? "text-white" : "text-[var(--slate-900)]";

  const statusColorMap = {
    "dont-know": "bg-red-50",
    skip: "bg-slate-50",
    know: "bg-green-50",
    default: "bg-white",
  };

  const getBackgroundColor = () => {
    if (shouldShowImage) return "bg-[var(--slate-900)]";

    // Check if knowledgeStatus exists on wordData
    return statusColorMap[wordData.knowledgeStatus] || statusColorMap.default;
  };

  const handleStatusUpdate = async (e, status) => {
    e.stopPropagation();
    try {
      await updateWordStatus(wordData._id, status);

      // Update the parent's state so the UI reflects the change everywhere
      handleStatusChange(wordData._id, status);

      toast.success(`Marked as ${status.replace("-", " ")}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="perspective-1000 h-[450px] cursor-pointer" onClick={() => toggleFlip(index)}>
      <div
        className={`relative w-full h-full transition-transform duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT OF CARD  */}
        <Card
          className={`absolute w-full h-full backface-hidden border-[var(--slate-200)] hover:shadow-md transition-all`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent
            className={`flex flex-col items-center justify-center h-full p-8 relative pt-6 rounded-lg ${getBackgroundColor()}`}
            style={hintStyles}
          >
            <div
              className={`absolute top-4 right-14 flex gap-2 z-10 transition-opacity duration-300 ${
                isFlipped ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <Button
                variant="transparent"
                size="icon"
                className={`h-8 w-8 hover:scale-110 group ${
                  shouldShowImage ? "bg-white/10 hover:bg-white/20" : "hover:bg-green-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/word/${wordData.slug}`);
                }}
              >
                <Eye
                  className={`h-4 w-4 ${
                    shouldShowImage
                      ? "text-white"
                      : "text-[var(--slate-300)] group-hover:text-green-600"
                  }`}
                />
              </Button>
            </div>
            <div
              className={`absolute top-4 right-4 flex gap-2 z-10 transition-opacity duration-300 ${
                isFlipped ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <Button
                variant="transparent"
                size="icon"
                className={`h-8 w-8 hover:scale-110 group  ${
                  shouldShowImage ? "bg-white/10 hover:bg-white/20" : "hover:bg-red-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBookmark(wordData._id);
                }}
              >
                <BookmarkMinus
                  className={`h-4 w-4 ${
                    shouldShowImage
                      ? "text-white"
                      : "text-[var(--slate-300)] group-hover:text-red-600"
                  }`}
                />
              </Button>
            </div>
            {/* Difficulty Badge - Top Left */}
            <div
              className={`absolute top-4 left-4 ${shouldShowImage ? "z-10 opacity-80" : ""} ${
                isFlipped ? "!opacity-0" : ""
              }`}
            >
              <div
                variant="secondary"
                className={`font-semibold border ${getDifficultyClasses(
                  wordData.difficulty,
                )} px-3 py-1 text-xs rounded-full`}
              >
                {capitalizeFirstLetter(wordData.difficulty)}
              </div>
            </div>
            {shouldShowImage && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[0px] rounded-lg transition-opacity duration-500 z-0"></div>
            )}
            {/* Main Content */}
            <div className="text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <h3 className={`text-3xl font-bold ${textColorClass} drop-shadow-md`}>
                {wordData.word}
              </h3>

              <div
                className={`inline-flex items-center rounded-full px-4 py-1.5 font-bold shadow-md text-white transition-all ${
                  shouldShowImage
                    ? `bg-white/20 z-10 border`
                    : `shadow-[var(--slate-900)]/10 bg-gradient-to-br ${getTypeGradient(
                        wordData.type,
                      )}`
                } ${isFlipped ? "!opacity-0" : ""}`}
              >
                {capitalizeFirstLetter(wordData.type)}
              </div>
            </div>
            {/* Tags - Bottom */}
            <div className="flex flex-wrap gap-2 justify-center mt-auto ">
              {safeTags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`text-sm px-2.5 py-1 rounded-lg ${
                    shouldShowImage
                      ? "bg-white/20 text-white shadow-md z-10"
                      : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                  } ${isFlipped ? "opacity-0" : ""}`}
                >
                  <span className="opacity-70 mr-0.5">#</span>
                  {capitalizeFirstLetter(tag)}
                </span>
              ))}
            </div>
            <div className="m-[-12] mt-6 pt-4 border-t border-[var(--slate-100)] grid grid-cols-3 gap-2">
              <Button
                variant="transparent"
                className="text-sm bg-red-50 text-red-600 hover:bg-red-100 border-red-200 py-2 px-1"
                onClick={(e) => handleStatusUpdate(e, "dont-know")}
              >
                Don't know
              </Button>
              <Button
                variant="transparent"
                className="text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 py-2 px-1"
                onClick={(e) => handleStatusUpdate(e, "skip")}
              >
                Skip
              </Button>
              <Button
                variant="transparent"
                className="text-sm bg-green-50 text-green-600 hover:bg-green-100 border-green-200 py-2 px-1"
                onClick={(e) => handleStatusUpdate(e, "know")}
              >
                Know it
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BACK OF CARD  */}
        <Card
          className="absolute w-full h-full backface-hidden border-[var(--slate-100)] bg-white rounded-lg shadow-md p-6  hover:shadow-xl hover:shadow-[var(--primary-100)]/20 transition-all"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`h-full flex flex-col hidden-scrollbar ${
              isFlipped ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[var(--primary-100)] pb-4 mb-4">
              <div>
                <h4 className="text-xl font-extrabold text-[var(--slate-900)]">{wordData.word}</h4>
              </div>
              <RotateCcw className="h-4 w-4 text-[var(--primary)] cursor-pointer hover:text-[var(--primary)] transition" />
            </div>

            <div className="space-y-6 flex-grow">
              <div className="text-[var(--slate-800)] bg-blue-50 rounded-lg p-3">
                <span className="flex items-center text-blue-700 font-sm mb-2">Definition</span>
                {wordData.definition}
              </div>

              <div className="text-[var(--slate-800)] bg-violet-50 rounded-lg p-3">
                <span className="flex items-center text-blue-700 font-sm  mb-2">Example Usage</span>
                {wordData.example
                  .split("/")
                  .filter(Boolean)
                  .map((segment, idx) => (
                    <p
                      key={idx}
                      className="text-md text-[var(--slate-700)] italic leading-relaxed first:mt-0 mt-2"
                    >
                      • {segment.trim()}
                    </p>
                  ))}
              </div>

              <div className="text-[var(--slate-800)] bg-green-50 rounded-lg p-3">
                <span className="flex items-center text-green-700 font-sm  mb-2">
                  💡 Memory Aid
                </span>
                {wordData.mnemonics}
              </div>

              {/* Synonyms */}
              <div>
                <h5 className="flex items-center font-sm font-semibold mb-2">Synonyms</h5>
                <div className="flex flex-wrap gap-2">
                  {safeSynonyms.slice(0, 5).map((synonym, index) => (
                    <span
                      key={index}
                      className="text-sm px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg "
                    >
                      {capitalizeFirstLetter(synonym)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlippableWordCard;
