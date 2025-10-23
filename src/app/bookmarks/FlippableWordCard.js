import React from "react";

// Library Imports
import { RotateCcw, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import Card from "./Card";
import CardContent from "./CardContent";
import Button from "@/components/buttons/Button";

// Utility Imports
import { typeColorMap, difficultyColorMap } from "@/utils/constants";
import { capitalizeFirstLetter, formatWordListProp } from "@/utils/helper";

const FlippableWordCard = ({ wordData, index, isFlipped, toggleFlip }) => {
  const router = useRouter();
  const getDifficultyClasses = (difficulty) => {
    return difficultyColorMap[difficulty?.toLowerCase()];
  };

  const getTypeGradient = (type) => {
    return typeColorMap[type.toLowerCase()] || typeColorMap.default;
  };

  const safeTags = formatWordListProp(wordData.tags);
  const safeSynonyms = formatWordListProp(wordData.synonyms);

  return (
    <div
      key={index}
      className="perspective-1000 h-[400px] cursor-pointer group"
      onClick={() => toggleFlip(index)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT OF CARD  */}
        <Card
          className={`absolute w-full h-full backface-hidden border-gray-200  hover:shadow-xl transition-all`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8 relative pt-6">
            <div className="absolute top-4 right-14 flex gap-2  z-10">
              <Button
                variant="transparent"
                size="icon"
                className="h-8 w-8 hover:scale-110 hover:bg-green-100 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/word/${wordData.slug}`);
                }}
              >
                <Eye className="h-4 w-4 text-gray-400 hover:text-green-600" />
              </Button>
            </div>
            <div className="absolute top-4 right-4 flex gap-2  z-10">
              <Button
                variant="transparent"
                size="icon"
                className="h-8 w-8 hover:scale-110 hover:bg-red-100 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Deleting word");
                }}
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
              </Button>
            </div>

            {/* Difficulty Badge - Top Left */}
            <div className="absolute top-4 left-4">
              <div
                variant="secondary"
                className={`font-semibold border ${getDifficultyClasses(
                  wordData.difficulty
                )} px-3 py-1 text-xs rounded-full`}
              >
                {capitalizeFirstLetter(wordData.difficulty)}
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <h3 className={`text-xl font-semibold  `}>{wordData.word}</h3>

              <div
                className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm px-4 py-1.5 font-bold shadow-md shadow-slate-900/10 transition-all
                  bg-gradient-to-br ${getTypeGradient(wordData.type)} text-white`}
              >
                {capitalizeFirstLetter(wordData.type)}
              </div>
            </div>

            {/* Tags - Bottom */}
            <div className="flex flex-wrap gap-2 justify-center mt-auto">
              {safeTags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-sm px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg "
                >
                  <span className="opacity-70 mr-0.5">#</span>
                  {capitalizeFirstLetter(tag)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BACK OF CARD  */}
        <Card
          className="absolute w-full h-full backface-hidden border-gray-100 bg-white rounded-xl shadow-2xl p-6  hover:shadow-xl hover:shadow-blue-100/20 transition-all"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col overflow-y-auto hidden-scrollbar">
            <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-4">
              <div>
                <h4 className="text-xl font-extrabold text-gray-900">{wordData.word}</h4>
              </div>
              <RotateCcw className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-600 transition" />
            </div>

            <div className="space-y-6 flex-grow">
              <div className="text-slate-800 bg-blue-50 rounded-lg p-3">
                <span className="flex items-center text-blue-700 font-sm mb-2">Definition</span>
                {wordData.definition}
              </div>

              <div className="text-slate-800 bg-violet-50 rounded-lg p-3">
                <span className="flex items-center text-blue-700 font-sm  mb-2">Example Usage</span>
                {wordData.example
                  .split("/")
                  .filter(Boolean)
                  .map((segment, idx) => (
                    <p
                      key={idx}
                      className="text-md text-gray-700 italic leading-relaxed first:mt-0 mt-2"
                    >
                      • {segment.trim()}
                    </p>
                  ))}
              </div>

              <div className="text-slate-800 bg-green-50 rounded-lg p-3">
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
