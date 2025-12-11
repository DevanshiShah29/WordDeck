// page.js
"use client";

import React, { useMemo, useState, useEffect } from "react";

// Component Imports
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import MiniWordMap from "./MiniWordMap";
import Sidebar from "./Sidebar";
import Loader from "@/components/Loader";
import { transformSingleGroup } from "./utils";
import { toast } from "react-toastify";

export default function GroupPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoadingGroups(true);
        setGroupsError(null);

        const res = await fetch("/api/related", { signal: ac.signal });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || body?.message || `HTTP ${res.status}`);
        }

        const payload = await res.json();

        if (!Array.isArray(payload)) {
          throw new Error("Invalid API response");
        }

        const mapped = payload
          .map((g, i) => {
            // new object form: { words: [...], description: "..." }
            if (g && typeof g === "object" && !Array.isArray(g)) {
              const words = Array.isArray(g.words) ? g.words.map(String) : [];
              return {
                id: `g_api_${i}`,
                title: words[0] || `Group ${i + 1}`,
                words,
                description: (g.description || "").trim(),
              };
            }

            // legacy array form: ["a", "b", ...]
            if (Array.isArray(g)) {
              return {
                id: `g_api_${i}`,
                title: g[0] || `Group ${i + 1}`,
                words: g.map(String),
                description: "",
              };
            }

            return null;
          })
          .filter(Boolean)
          .filter((g) => Array.isArray(g.words) && g.words.length >= 2); // drop singletons

        setGroups(mapped);
      } catch (err) {
        if (err.name === "AbortError") return;
        toast.error("Failed to fetch related groups.");
        setGroupsError(err.message || String(err));
        setGroups([]); // ensure UI has deterministic state
      } finally {
        setLoadingGroups(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((grp) => {
      if (!q && !filters.difficulty && !filters.type) return true;
      if (q) {
        return (
          grp.title?.toLowerCase().includes(q) ||
          (grp.words || []).some((s) => String(s).toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [groups, search, filters]);

  return (
    <>
      <Header title="Word Clusters" />

      {/* mount Sidebar once so it can receive miniwordmap events */}
      <Sidebar />

      <main className="app-main w-full bg-white pt-6 pb-10">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Filters */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <FilterPanel
                onSearch={(q) => setSearch(q)}
                onFiltersChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              />
            </div>

            {/* Right: canvases */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <section className="map-area-vertical gap-8">
                {loadingGroups && <Loader fullscreen={false} title={"Loading groups..."} />}

                {groupsError && (
                  <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
                    Error loading groups: {groupsError}
                  </div>
                )}

                {visibleGroups.length === 0 && !loadingGroups && (
                  <div className="p-6 bg-white rounded-xl border border-[var(--slate-200)]">
                    No groups found
                  </div>
                )}

                {visibleGroups.map((grp) => {
                  const { nodes = [] } = transformSingleGroup(grp.words || [grp.title]);

                  return (
                    nodes.length > 1 && (
                      <div key={grp.id} className="mini-map-wrapper w-full h-[360px]">
                        <MiniWordMap group={grp.words} description={grp.description} />
                      </div>
                    )
                  );
                })}
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
