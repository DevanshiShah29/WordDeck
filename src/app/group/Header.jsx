"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Header({ title = "Word Groups" }) {
  const router = useRouter();
  return (
    <header className="group-header fixed top-0 left-0 right-0 h-16 z-50 flex items-center px-4 md:px-8 bg-white/95 backdrop-blur-sm shadow-sm border-b border-[var(--slate-200)]/60">
      <button
        aria-label="Back"
        onClick={() => router.back()}
        className="h-10 w-10 rounded-md flex items-center justify-center mr-4 text-[var(--slate-800)] hover:bg-[var(--slate-100)]"
      >
        ←
      </button>

      <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
    </header>
  );
}
