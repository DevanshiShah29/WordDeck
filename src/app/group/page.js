// page.js
"use client";

import React, { useMemo, useState } from "react";

// Component Imports
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import MiniWordMap from "./MiniWordMap";
import Sidebar from "./Sidebar";
import Loader from "@/components/Loader";

// Helper Imports
import { transformSingleGroup, applyGroupFilters } from "./utils";
import { useGroupData } from "./userGroupData";

export default function GroupPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const { groups, loadingGroups, groupsError } = useGroupData();

  const visibleGroups = useMemo(() => {
    return applyGroupFilters(groups, search, filters);
  }, [groups, search, filters]);

  return (
    <>
      <Header title="Word Clusters" />
      <Sidebar />
      <main className="app-main w-full bg-white pt-6 pb-10">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <FilterPanel
                onSearch={setSearch}
                onFiltersChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <section className="map-area-vertical space-y-8">
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
                  const { nodes = [] } = transformSingleGroup(
                    grp.words || [grp.title],
                    grp.difficulty
                  );

                  return (
                    nodes.length > 1 && (
                      <div key={grp.id} className="mini-map-wrapper w-full h-[360px]">
                        <MiniWordMap
                          group={grp.words}
                          description={grp.description}
                          groupDifficulty={grp.difficulty}
                        />
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
