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
  Expand,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Utility Imports
import { speakWord, formattedDate, capitalizeFirstLetter } from "@/utils/helper";
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
import Button from "@/components/buttons/Button";

export default function VocabDetail({ params }) {
  const actualParams = use(params);
  const router = useRouter();

  const { slug } = actualParams;

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetchWordDetails(slug)
      .then((data) => setWord(data))
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (loading) {
    return <Loader message={`Loading details for ${slug}...`} />;
  }

  if (!word) {
    return <NotFound message={`Word with slug ${slug} not found.`} />;
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

  const handleDeleteClick = async (e) => {
    if (!window.confirm(`Are you sure you want to delete the word ${slug}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/words?slug=${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete word: ${response.status}`);
      }

      toast.success(`Word ${slug} deleted successfully.`);
      router.push("/word");
    } catch (error) {
      toast.error(error.message || "Failed to delete word. Please try again.");
    }
  };

  const uppercaseSynonyms = synonyms.map((syn) => capitalizeFirstLetter(syn));
  const safeSynonyms = formatWordListProp(uppercaseSynonyms);
  const safeTags = formatWordListProp(tags);

  return (
    <div className="min-h-screen bg-[var(--slate-100)]">
      <DetailHeader
        word={word}
        onSpeak={handleSpeak}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={bookmarked}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Core Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image + Word Type */}
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden group border border-slate-100">
              <div className="aspect-video relative">
                <Image
                  src={image || "/placeholder.jpg"}
                  alt={title || "word"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-md bg-gradient-to-r ${gradient} text-white capitalize`}
                  >
                    {type}
                  </div>
                </div>
                <div
                  className="absolute bottom-0 right-0 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Expand className="h-9 w-9 bg-[var(--slate-900)] text-white p-2 rounded-lg" />
                </div>
              </div>
            </div>

            {isModalOpen && (
              <div
                className="fixed inset-0 z-[100] bg-black/90 m-0 flex items-center justify-center p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <Button
                  variant="transparent"
                  className="absolute top-8 right-5 z-10 text-white !text-xl font-light bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>

                <div
                  className="relative w-full h-full max-w-screen-xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={image || "/placeholder.jpg"}
                    alt={title || "word"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <Card
              icon={<BookOpen className="h-5 w-5" />}
              title="Definition"
              iconGradient="from-blue-500 to-blue-600"
              contentBackground="from-blue-50 to-indigo-50"
              contentBorderColor="border-blue-100"
            >
              <p className="text-[var(--slate-800)] text-lg leading-relaxed font-medium">
                {definition}
              </p>
            </Card>

            <Card
              icon={<Quote className="h-5 w-5" />}
              title="Usage Example"
              iconGradient="from-purple-500 to-purple-600"
              contentBackground="from-purple-50 to-pink-50"
              contentBorderColor="border-purple-100"
            >
              <blockquote className="text-lg leading-relaxed text-[var(--slate-800)] italic">
                {usage}
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
              <p className="text-[var(--slate-700)] leading-relaxed text-lg">{etymology_story}</p>
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
