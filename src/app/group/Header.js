"use client";

import React from "react";
// Component Imports
import PageHeader from "@/components/header/PageHeader";

export default function Header({ title = "Word Groups" }) {
  return <PageHeader title={title} subtitle={"Related words visualized as interactive canvases"} />;
}
