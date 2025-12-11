// components/PageHeader.js
"use client";

import React from "react";
// Library Imports
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import Button from "@/components/buttons/Button"; // Assuming this is correct

/**
 * Common Header Component for various pages (Bookmarks, Word Groups, Quiz).
 * @param {string} title - The main title text (e.g., "Bookmarks", "Word Groups").
 * @param {React.ReactNode} subtitle - JSX for the subtitle/status area (e.g., word count, description).
 * @param {React.ReactNode} actions - JSX for elements in the far right of the top row (e.g., Restart Button).
 * @param {React.ReactNode} controls - JSX for the second row (e.g., Search, Sort, Hint).
 */
export default function PageHeader({ title, subtitle, actions, controls }) {
  const router = useRouter();

  return (
    <header className="bg-white backdrop-blur-sm shadow-sm border-b border-[var(--slate-200)]/50 z-40 sticky top-0">
      <div className="container mx-auto p-6">
        {/*  Back Button, Title/Subtitle, Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Button
              variant="transparent"
              size="icon"
              className="p-2 rounded-lg transition-all duration-300 group hover:bg-slate-100"
              onClick={() => router.back()}
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--slate-600)] group-hover:text-[var(--primary-600)]" />
            </Button>
            {/* Title and Subtitle/Status */}
            <div>
              <h1 className="text-xl font-bold text-[var(--slate-900)]">{title} </h1>
              <p className="text-md text-[var(--slate-500)]"> {subtitle}</p>
            </div>
          </div>
          {/* Top-Row Actions (e.g., Quiz Restart) */} <div>{actions}</div>
        </div>
        {/* --- ROW 2: Controls (Search, Sort, Hint) --- */}
        {controls && (
          <div className="flex flex-col md:flex-row items-stretch mt-3 gap-4">{controls} </div>
        )}
      </div>
    </header>
  );
}
