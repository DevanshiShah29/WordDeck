"use client";

import { useState, use, useEffect } from "react";

// Library Imports
import {
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
import { useRouter } from "next/navigation";

// Utility Imports
import { speakWord, formattedDate } from "@/utils/helper";
import { typeColorMap } from "@/utils/constants";
import { formatWordListProp, fetchWordDetails } from "../helper";

// Component Imports
import TagList from "@/components/TagList";
import Card from "@/components/CommonCard";
import InfoCard from "@/components/InfoCard";
import InfoRow from "@/components/InfoRow";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import DetailHeader from "./DetailHeader";

export default function VocabDetail({ params }) {
  const actualParams = use(params);
  const router = useRouter();

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
  const handleEditClick = () => {
    router.push(`/edit/${slug}`);
  };

  const safeSynonyms = formatWordListProp(synonyms);
  const safeTags = formatWordListProp(tags);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DetailHeader
        word={word}
        onSpeak={handleSpeak}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={bookmarked}
        handleEditClick={handleEditClick}
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
