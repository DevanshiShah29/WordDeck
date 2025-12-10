// page.js
"use client";

import React, { useMemo, useState } from "react";

// Component Imports
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import MiniWordMap from "./MiniWordMap";
import Sidebar from "./Sidebar";
import { transformSingleGroup } from "./utils";

const SAMPLE_GROUPS = [
  [
    "Exuberant",
    "over the moon",
    "chirpy",
    "vivacious",
    "beaming",
    "frisky",
    "gratification",
    "Pramod",
  ],
  ["Melancholy", "somber", "lamentation", "a wave of guilt", "bummer"],
  [
    "Bewildered",
    "baffled",
    "flummoxed",
    "astonished",
    "flabbergasted",
    "taken aback",
    "caught me off guard",
  ],
  ["Hysterical", "frantic", "worked up", "rip roaring", "trepidation", "palpitations"],
  [
    "Irk",
    "gets my goat",
    "to ruffle my feathers",
    "scornful",
    "hostile",
    "huff and puff",
    "inflammatory",
  ],
  [
    "Affable",
    "amiable",
    "cordial",
    "gracious",
    "benevolent",
    "affectionate",
    "all heart",
    "camaraderie",
    "amicable",
    "amicorum",
  ],
  [
    "Knack",
    "to have a knack for it",
    "competence",
    "naturally endowed",
    "prolific",
    "apt",
    "connoisseur",
    "wordsmith",
  ],
  ["Infallible", "rock solid", "steadfast", "The rock of Gibraltar", "resilient"],
  ["Ineffable", "intangible", "transcendental", "sublime"],
  ["Paramount", "pivotal", "indispensable", "crux of the matter"],
  ["Annihilated", "mutilated", "obliterated", "disintegration"],
  ["Opulence", "affluence", "born with a silver spoon"],
  ["Vigilant", "wary", "prudent", "walking on eggshells"],
  ["Haste"],
  ["Sluggish"],
  ["Enigmatic", "intrigue"],
  ["Omnipotent", "omniscience", "omnipresent"],
  [
    "Drip",
    "couture",
    "spiffy",
    "suave",
    "sleek and slender",
    "stilettos",
    "bejeweled",
    "too glam to give a damn",
    "tacky",
  ],
  [
    "Let the cat out of the bag",
    "whistle blower",
    "tell all",
    "gives it away",
    "blatant",
    "big mouth",
  ],
  [
    "Scornful",
    "jibe at",
    "belittle",
    "dissing",
    "derogatory",
    "condescending",
    "trivialize",
    "gloat",
  ],
  ["Entice", "instigate", "sway by", "to prompt"],
  ["Gravitas", "poised", "prim and proper"],
  ["Mellow", "zen mode", "nonchalant", "Prasham", "Sambhaav", "Virakti", "Vitaraga", "indifferent"],
  ["Immaculate"],
  ["Mayhem", "pandemonium broke loose", "volatile", "unhinged"],
  ["Altercations", "tussle", "grouse against something", "combated"],
  [
    "Familiarity breeds contempt",
    "absence makes the heart grow fonder",
    "a stitch in time saves nine",
    "a bird in the hand is worth two in the bush",
    "it takes two to tango",
    "more the merrier",
    "practice what you preach",
    "early bird catches the worm",
    "birds of same feather flock together",
    "know thyself",
  ],
  ["Metaphor", "analogy", "personification", "understatement", "irony", "paradox"],
  ["Thick skull", "tubelight", "oblivious", "out of touch", "incompetent", "gullible", "layman"],
  [
    "Blood, sweat and tears",
    "tough nut to crack",
    "bite the bullet",
    "run for the money",
    "pushed against a wall",
  ],
  ["Repercussion", "ramification", "the effect it has"],
  ["Scrutinize", "leave no stone unturned", "every nook and cranny", "interrogate", "deciphred"],
  ["Ephemeral", "impermanence", "perpetuating"],
  ["Pondering", "contemplate", "infer", "muse"],
  ["Conned", "gaslighting", "breadcrumbing", "swindle", "rigged"],
  ["Spunk", "valiant", "feisty", "audacity", "fire in the belly"],
  ["Secluded", "ostracized", "living in a bubble", "cliquish", "clannish"],
  ["Admiration", "revered", "put someone on a pedestal", "high esteem", "laurels"],
  ["Metamorphosis", "renaissance", "sprung back", "retrograde", "disintegration"],
  ["Pan out", "flying colors", "hit the bullseye"],
  ["Botched", "futile"],
  ["Swayed by", "we've been conditioned", "preconceived notions", "prejudiced"],
  ["Untethered", "going rogue"],
  ["Contradictory"],
  ["Sanctity", "pious"],
  ["Whimsical", "jest", "amusing"],
  ["Cocky", "snooty", "vain"],
  ["Serendipity", "fluke"],
  [
    "Under the weather",
    "cryotherapy",
    "body dysmorphia",
    "thyroid",
    "melatonin",
    "EpiPen",
    "palpitations",
  ],
  [
    "Eloquent",
    "monologue",
    "speak volumes",
    "jargon",
    "put words in mouth",
    "needless to say",
    "attest",
    "wordsmith",
  ],
  ["Wanderlust", "meander", "hitchhike", "drifting away"],
  ["Cannot fathom", "labyrinth"],
  ["Call the shots", "gatekeeping"],
  ["Cathartic", "cathartic moment", "venting"],
  ["Succumb", "renounce", "yield"],
  ["Façade"],
  ["Colossal", "staggering"],
  ["Ghati karma", "Aghati karma", "Kashaya", "Vishay Kashay", "Upsham", "Nirjara", "Kshayopsham"],
  ["Manah Paryaya Gyan", "Avadhi Gyan", "Jati Smaran Gyan", "Samyak Darshan"],
  ["Austerity", "Penances", "The five mahavratas", "Prasham", "Sambhaav", "Virakti", "Vitaraga"],
  ["Jiv tatva", "Pudgal", "Tattvartha", "Anekantavada", "Nimitt", "Panchbhut / Panchtatva"],
  [
    "Kalyanak",
    "Chyavan Kalyanak",
    "Asthaprakari puja",
    "Gahuli",
    "Chakravarti",
    "Asthapad",
    "14 Gunasthans",
  ],
  ["Mithyatva", "Sanshay", "Papasthanak (Pāpa Sthānaka)", "Pratikramana", "Iriyavahiyam"],
  ["My roman empire"],
  ["TL;DR"],
  ["Rizz"],
  ["Do it with style"],
  ["Tad loud for my taste"],
  ["Its not my turf"],
  ["Gender is a construct"],
  ["Perpetrate the patriarchy"],
  ["Surf and turf"],
  ["Can't control mother nature"],
  ["Enamel"],
  ["Urban legend"],
  ["Are you quizzing me?"],
  ["In her element"],
  ["Needs no saving"],
  ["Sublime to the ridiculous"],
  ["Fashion Faux pas"],
  ["Nonaction"],
  ["Takes after"],
  ["To run it by you"],
  ["Lay it out on the table"],
  ["Jump on the wagon"],
  ["Ragebait"],
  ["Coming to terms with"],
  ["Underlying truth"],
  ["Frontal lobe"],
  ["Metabolism"],
  ["Gluten"],
  ["Metacognition"],
  ["Moral compass"],
  ["Dry spell"],
  ["Blasphemous"],
  ["Vindicated"],
  ["Rejuvenation"],
  ["Posterior"],
  ["Sounding board"],
  ["Brain went into overdrive"],
  ["Quintessential"],
  ["Brownie points"],
  ["Humble plea"],
  ["Burn the bridges"],
  ["Posterity"],
  ["Shackled"],
  ["Scared the daylights out of me"],
  ["Pardon my immodesty"],
  ["Apprehension"],
  ["Be more on your feet"],
  ["Let the moment play out"],
  ["Catering to"],
  ["Ambiance"],
  ["Braille"],
  ["Stole my words"],
  ["Solace"],
  ["Fuss"],
  ["I'll cross that bridge when I come to it"],
  ["Stealing thunder"],
  ["Pick me"],
  ["Spike the food"],
  ["Out of body experience"],
  ["Double edged sword"],
  ["Concession"],
  ["Flattered"],
  ["Pun intended"],
  ["Superficial"],
  ["Dark Ages"],
  ["Webster"],
  ["Off the roof"],
  ["Melodramatic"],
  ["Reckon"],
  ["Shatter the glass ceiling"],
  ["NPC"],
  ["In the mix"],
  ["Indigenous"],
  ["Draw the line"],
  ["Far more then we give them credit"],
  ["Salivating"],
  ["Meditation"],
  ["Lowkey"],
  ["A piece of cake"],
  ["Cherry on top"],
  ["Shifting gears a bit"],
  ["Parasocial"],
  ["Omen"],
  ["Prophet"],
  ["Phenomenon"],
  ["Veteran"],
  ["Taking a back seat"],
  ["Vicinity"],
  ["Prarabdh"],
  ["Nocturnal"],
  ["Divine intervention"],
  ["Intuition"],
  ["Hispanic"],
  ["Hitchhike"],
  ["Engulfed"],
  ["Palatable"],
  ["Stockholm Syndrome"],
  ["Classic deflection"],
  ["Rain check"],
  ["Sapiosexual"],
  ["Alluring"],
  ["Alluding"],
  ["Buoyancy"],
  ["Slander"],
  ["Blunt"],
  ["Nirvana"],
  ["Abbreviation"],
  ["Trivia"],
  ["Alas"],
  ["Errands"],
  ["Scouted"],
  ["Bougie"],
  ["Go down the rabbit hole"],
  ["Sinister"],
  ["Human instillation"],
];

export default function GroupPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const groups = useMemo(
    () => SAMPLE_GROUPS.map((g, i) => ({ id: `g${i}`, title: g[0], raw: g })),
    []
  );

  const visibleGroups = useMemo(() => {
    if (!search && !filters.difficulty && !filters.type) return groups;
    const q = search.trim().toLowerCase();
    return groups.filter((grp) => {
      if (!q) return true;
      return (
        grp.title?.toLowerCase().includes(q) || grp.raw?.some((s) => s.toLowerCase().includes(q))
      );
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
            {/* Left: Filters (keeps same 3/9 layout) */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <FilterPanel
                onSearch={(q) => setSearch(q)}
                onFiltersChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              />
            </div>

            {/* Right: full-width stacked canvases (no multi-column grid) */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <section className="map-area-vertical gap-8">
                {visibleGroups.length === 0 && (
                  <div className="p-6 bg-white rounded-xl border border-[var(--slate-200)]">
                    No groups found
                  </div>
                )}

                {visibleGroups.map((grp) => {
                  const { nodes = [], edges = [] } = transformSingleGroup(grp.raw || [grp.title]);

                  return (
                    nodes.length > 1 && (
                      <div className="mini-map-wrapper w-full h-[360px]">
                        <MiniWordMap group={grp.raw} />
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
