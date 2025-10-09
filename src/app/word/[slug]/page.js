"use client";

import { useState, use, useEffect } from "react";

// Library Imports
import {
  ArrowLeft,
  Volume2,
  Bookmark,
  BookOpen,
  Quote,
  Globe,
  Lightbulb,
  Sparkles,
  Calendar,
  Star,
  Tag,
  Languages,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Utility Imports
import { speakWord, formattedDate } from "@/utils/helper";
import { typeColorMap } from "@/utils/constants";
import { formatWordListProp, fetchWordDetails } from "../helper";

// Component Imports
import TagList from "@/components/TagList";
import Card from "@/components/CommonCard";
import InfoCard from "@/components/InfoCard";
import InfoRow from "@/components/InfoRow";
import Button from "@/components/buttons/Button";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";

const DetailHeader = ({ word, onSpeak, onToggleBookmark, isBookmarked }) => {
  const { word: title, pronunciation } = word;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Back Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/word"
              className="p-2 rounded-lg transition-all duration-300 group hover:bg-slate-100"
              aria-label="Go back to vocabulary list"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="mt-1 text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
                {pronunciation}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="transparent"
              onClick={onSpeak}
              title="Play pronunciation"
              className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 text-slate-600 hover:text-blue-600 transform hover:scale-110 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </Button>

            <Button
              variant="transparent"
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              onClick={onToggleBookmark}
              className={`p-2 cursor-pointer rounded-lg transition transform hover:scale-105 ${
                isBookmarked
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VocabDetail({ params }) {
  const actualParams = use(params);
  const { slug } = actualParams;

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetchWordDetails(slug)
      .then((data) => setWord(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Loader message={`Loading details for "${slug}"...`} />;
  }

  if (!word) {
    return <NotFound message={`Word with slug "${slug}" not found.`} />;
  }

  const {
    word: title,
    pronunciation: phonetic,
    imageUrl: image,
    definition,
    example: usage,
    etymologyStory: etymology_story,
    mnemonics: memory_aid,
    type,
    difficulty,
    origin,
    createdAt,
    synonyms,
    tags,
    etymology: mini_etymology,
  } = word;

  const gradient = typeColorMap[type?.toLowerCase()] || typeColorMap.default;

  const handleSpeak = () => speakWord(title);
  const handleToggleBookmark = () => setBookmarked((prev) => !prev);

  const safeSynonyms = formatWordListProp(synonyms);
  const safeTags = formatWordListProp(tags);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DetailHeader
        word={word}
        onSpeak={handleSpeak}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={bookmarked}
      />

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Core Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image + Word Type */}
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden group border border-slate-100">
              <div className="aspect-video relative">
                <Image
                  src={image || "/placeholder.jpg"}
                  alt={title || "word"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-6 right-6 z-10">
                  <div
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${gradient} text-white capitalize`}
                  >
                    {type}
                  </div>
                </div>
              </div>
            </div>

            <Card
              icon={<BookOpen className="h-5 w-5" />}
              title="Definition"
              iconGradient="from-blue-500 to-blue-600"
              contentBackground="from-blue-50 to-indigo-50"
              contentBorderColor="border-blue-100"
            >
              <p className="text-slate-800 text-lg leading-relaxed font-medium">{definition}</p>
            </Card>

            <Card
              icon={<Quote className="h-5 w-5" />}
              title="Usage Example"
              iconGradient="from-purple-500 to-purple-600"
              contentBackground="from-purple-50 to-pink-50"
              contentBorderColor="border-purple-100"
            >
              <blockquote className="text-lg leading-relaxed text-slate-800 italic">
                "{usage}"
              </blockquote>
            </Card>

            <Card
              icon={<Globe className="h-5 w-5" />}
              title="Etymology Story"
              iconGradient="from-indigo-500 to-indigo-600"
              contentBackground="from-indigo-50 to-blue-50"
              contentBorderColor="border-indigo-100"
            >
              <p className="text-blue-800 text-lg font-semibold mb-2">{mini_etymology}</p>
              <p className="text-slate-700 leading-relaxed text-lg">{etymology_story}</p>
            </Card>

            <Card
              icon={<Lightbulb className="h-5 w-5" />}
              title="Memory Aid"
              iconGradient="from-yellow-500 to-yellow-600"
              contentBackground="from-yellow-50 to-orange-50"
              contentBorderColor="border-yellow-200"
            >
              <p className="text-yellow-800 text-lg leading-relaxed font-medium">{memory_aid}</p>
            </Card>
          </div>

          <div className="space-y-6">
            <InfoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Word Information"
              iconGradient="from-blue-500 to-indigo-600"
            >
              <InfoRow label="Difficulty" value={difficulty} type="difficulty" />
              <InfoRow label="Origin" value={origin} icon={<Languages className="w-4 h-4 " />} />
              <InfoRow
                label="Added date"
                value={typeof window !== "undefined" ? formattedDate(createdAt) : createdAt}
                icon={<Calendar className="w-4 h-4" />}
              />
            </InfoCard>

            <TagList
              icon={<Star className="text-purple-600 h-5 w-5" />}
              title="Synonyms"
              items={safeSynonyms}
              colors="purple"
            />

            <TagList
              icon={<Tag className="text-blue-600 h-5 w-5" />}
              title="Tags"
              items={safeTags}
              colors="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
