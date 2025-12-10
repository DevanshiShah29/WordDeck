"use client";

import React from "react";

// Library Imports
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Component Imports
import Button from "@/components/buttons/Button";

export default function Header({ title = "Word Groups" }) {
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-[var(--slate-200)] sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="transparent"
              className="p-2 rounded-lg transition-all duration-300 group hover:bg-slate-100"
              onClick={() => router.back()}
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--slate-600)] group-hover:text-[var(--primary-600)]" />
            </Button>

            <div>
              <h1 className="text-lg md:text-xl font-bold text-[var(--slate-900)]">{title}</h1>
              <p className="mt-1 text-[var(--slate-500)] text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
                Relationships
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
