"use client";

import React from "react";
// Component Imports
import PageHeader from "@/components/header/PageHeader";

export default function Header({ title = "Word Groups" }) {
  const groupSubtitle = (
    <p className="mt-1 text-[var(--slate-500)] text-sm py-1 rounded-lg inline-block">
      Related words visualized as interactive canvases{" "}
    </p>
  );
  return <PageHeader title={title} subtitle={groupSubtitle} />;
}
