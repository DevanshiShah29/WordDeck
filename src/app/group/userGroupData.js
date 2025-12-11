// ./useGroupData.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mapDifficultyValueToLabel } from "./utils";

/**
 * Custom hook to fetch, map, and enrich the word group data.
 * @returns {{ groups: Array<Object>, loadingGroups: boolean, groupsError: string | null }}
 */
export const useGroupData = () => {
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoadingGroups(true);
        setGroupsError(null);

        // API Fetch
        const res = await fetch("/api/related", { signal: ac.signal });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || body?.message || `HTTP ${res.status}`);
        }
        const payload = await res.json();
        if (!Array.isArray(payload)) {
          throw new Error("Invalid API response");
        }

        // Initial Mapping and Cleaning
        const mapped = payload
          .map((g, i) => {
            // Logic to handle different API response formats
            let words = [];
            let description = "";

            if (g && typeof g === "object" && !Array.isArray(g)) {
              words = Array.isArray(g.words) ? g.words.map(String) : [];
              description = (g.description || "").trim();
            } else if (Array.isArray(g)) {
              words = g.map(String);
            }

            return {
              id: `g_api_${i}`,
              title: words[0] || `Group ${i + 1}`,
              words,
              description,
            };
          })
          .filter(Boolean)
          .filter((g) => Array.isArray(g.words) && g.words.length >= 2); // drop singletons

        // Enrichment
        const mappedWithDifficulty = mapped.map((g) => {
          const filterableDifficulty = ["beginner", "intermediate", "advanced", null][
            g.words.length % 4
          ];
          const displayDifficulty = mapDifficultyValueToLabel(filterableDifficulty);

          return {
            ...g,
            difficulty: displayDifficulty, // PascalCase for coloring/display
            filterableDifficulty: filterableDifficulty, // Lowercase for useMemo filter logic
          };
        });

        setGroups(mappedWithDifficulty);
      } catch (err) {
        if (err.name === "AbortError") return;
        toast.error("Failed to fetch related groups.");
        setGroupsError(err.message || String(err));
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    })();

    return () => ac.abort();
  }, []);

  return { groups, loadingGroups, groupsError };
};
