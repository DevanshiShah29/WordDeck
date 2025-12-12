"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
// Library Imports
import {
  Volume2,
  Languages,
  Bookmark,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Globe,
  Clock,
  X,
  Target,
} from "lucide-react";
import { toast } from "react-toastify";

// Component Imports
import Loader from "@/components/Loader";
import ImageWithFallback from "@/components/ImageWithFallback";
import Button from "@/components/buttons/Button";

// Utility Imports
import { typeColorMap, difficultyColorMap } from "@/utils/constants";
import { speakWord } from "@/utils/helper";

const SECTION_STYLES = {
  definition: "bg-white shadow-md",
  example: "bg-blue-50/70 shadow-sm",
  etymology: "bg-purple-50/70 shadow-sm",
  mnemonics: "bg-yellow-50/70 shadow-sm",
};

const capitalizeFirstLetter = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ label: "", slug: "", emitterId: null });
  const [isBookmarked, setIsBookmarked] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setDetail(null);
    setError(null);
    setMeta({ label: "", slug: "", emitterId: null });

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    window.dispatchEvent(new Event("miniwordmap:sidebar-closed"));
  }, []);

  const handleBookmarkClick = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      const nextState = !isBookmarked;
      setIsBookmarked(nextState);

      try {
        const slug = detail?.slug ?? meta?.slug;
        if (!slug) throw new Error("Missing slug");

        const res = await fetch(`/api/bookmarks?slug=${encodeURIComponent(slug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookmarked: nextState }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          toast.error(`Failed to update bookmark: ${body?.error || body?.message || res.status}`);
        } else {
          toast.success(`Bookmark ${nextState ? "added" : "removed"} successfully!`);
        }

        const payload = await res.json().catch(() => null);
        if (payload && typeof payload.bookmarked !== "undefined") {
          setIsBookmarked(Boolean(payload.bookmarked));
        } else if (payload && typeof payload.isBookmarked !== "undefined") {
          setIsBookmarked(Boolean(payload.isBookmarked));
        }

        window.dispatchEvent(
          new CustomEvent("miniwordmap:bookmark-changed", {
            detail: { slug, isBookmarked: Boolean(payload?.bookmarked ?? nextState) },
          })
        );
      } catch (err) {
        toast.error(`Error updating bookmark: ${err?.message || err}`);
        setIsBookmarked((v) => !nextState);
      }
    },
    [isBookmarked, detail, meta]
  );

  useEffect(() => {
    const onOpen = async (e) => {
      const { slug, label, emitterId } = e?.detail ?? {};
      if (!slug) return;

      setOpen(true);
      setDetail(null);
      setError(null);
      setLoading(true);
      setMeta({ label: label ?? "", slug, emitterId: emitterId ?? null });
      setIsBookmarked(false);

      try {
        const res = await fetch(`/api/words?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Fetch failed (${res.status})`);
        }
        const payload = await res.json();
        if (!payload || Object.keys(payload).length === 0) {
          throw new Error(`No details for "${label}"`);
        }
        setDetail(payload);
        setIsBookmarked(Boolean(payload?.isBookmarked));
      } catch (err) {
        setError(err?.message ?? "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("miniwordmap:open", onOpen);
    return () => window.removeEventListener("miniwordmap:open", onOpen);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return;

    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      if (typeof window !== "undefined" && document.body) {
        document.body.classList.remove("no-scroll");
      }
    };
  }, [open]);

  const word = detail?.word || meta?.label || "Details";
  const difficultyClasses = difficultyColorMap[detail?.difficulty?.toLowerCase() || "default"];
  const typeGradient = typeColorMap[detail?.type?.toLowerCase()] || typeColorMap.default;
  const allRelatedTerms = [...(detail?.synonyms || []), ...(detail?.tags || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-full md:w-[26rem] lg:w-[28rem] bg-white border-l border-slate-100 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      } overscroll-y-contain`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${word}`}
    >
      <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">
        <div className="p-5 pb-4 border-b border-slate-100 flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 w-[275px] md:w-auto ">{word}</h2>

            <div>
              <Button
                onClick={handleBookmarkClick}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                variant="transparent"
                aria-pressed={isBookmarked}
                className={`p-2 md:p-2.5 bg-white/90 rounded-xl mr-2 hover:bg-[var(--primary-100)] hover:text-[var(--primary-600)] hover:scale-110 ${
                  isBookmarked ? "text-[var(--primary-600)]" : "text-slate-600"
                } `}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
              <Button
                aria-label="Close details"
                onClick={close}
                variant="transparent"
                className="p-2 md:2.5 bg-white/90  rounded-xl hover:bg-[var(--primary-100)] hover:text-[var(--primary-600)] hover:scale-110 "
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {detail?.pronunciation && (
            <div className=" flex items-center gap-2">
              <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg inline-block text-slate-500">
                {detail.pronunciation}
              </p>
              <Button
                onClick={() => speakWord(detail.word)}
                aria-label="Play pronunciation"
                title="Play pronunciation"
                variant="transparent"
                className="p-2 rounded-md text-slate-700 transition hover:text-[var(--primary-600)] hover:bg-[var(--primary-100)] hover:scale-110"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {/*  Content */}
        <div className="p-5 overflow-y-auto flex-grow bg-slate-50/50 thin-scrollbar">
          {loading && <Loader fullScreen={false} title="loading" />}
          {error && (
            <div className="text-sm text-red-700 bg-red-100 p-4 rounded-xl border border-red-300">
              Error: {error}
            </div>
          )}
          {detail && (
            <div className="space-y-6">
              {detail?.imageUrl && (
                <div className="relative w-full h-45 rounded-xl overflow-hidden shadow-lg bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                  <ImageWithFallback
                    src={detail.imageUrl}
                    alt={`Illustration for ${word}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                  <div className="absolute right-4 top-4 z-20">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg bg-gradient-to-r ${typeGradient} text-white capitalize`}
                    >
                      {detail?.type || "Term"}
                    </span>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg ${SECTION_STYLES.definition}`}>
                <h3 className="text-sm font-semibold flex items-center gap-2 text-blue-800 mb-2">
                  <BookOpen className="text-blue-500 h-4 w-4" /> Definition
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed pl-4">{detail.definition}</p>
              </div>

              {detail.example && (
                <div className={`p-4 rounded-lg ${SECTION_STYLES.example}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-blue-800 mb-2">
                    <MessageSquare className="text-blue-500 h-4 w-4" /> Example Usage
                  </h3>

                  <div className="text-sm italic text-slate-700 pl-4 border-l border-blue-300 py-1">
                    {detail.example}
                  </div>
                </div>
              )}
              {/* Etymology / Origin Story Block */}
              {(detail.etymologyStory || detail.etymology) && (
                <div className={`p-4 rounded-lg ${SECTION_STYLES.etymology}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-purple-800 mb-2">
                    <Globe className="text-purple-500 h-4 w-4" /> Word Origin Story
                  </h3>

                  {detail.etymologyStory && (
                    <p className="text-sm text-slate-700 pl-4">{detail.etymologyStory}</p>
                  )}

                  {detail.etymology && (
                    <p className="text-sm text-slate-700 mt-3 pt-3 border-t border-purple-200 pl-4">
                      Root: {detail.etymology}
                    </p>
                  )}
                </div>
              )}
              {/* Mnemonics Block */}
              {detail.mnemonics && (
                <div className={`p-4 rounded-lg ${SECTION_STYLES.mnemonics}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-yellow-800 mb-2">
                    <Lightbulb className="text-yellow-500 h-4 w-4" /> Memory Aid
                  </h3>

                  <p className="text-sm text-slate-700 italic pl-4">{detail.mnemonics}</p>
                </div>
              )}
              {/* Synonyms/Tags Block  */}
              {allRelatedTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">
                    Related Terms & Tags
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {allRelatedTerms.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                      >
                        {capitalizeFirstLetter(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/*  Footer Area */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white shadow-inner">
          {detail && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${difficultyClasses}`}
              >
                <Target className="w-3.5 h-3.5" />
                {capitalizeFirstLetter(detail.difficulty)}
              </span>
              {detail.origin && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{detail.origin}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
