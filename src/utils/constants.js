export const typeColorMap = {
  noun: "from-emerald-500 to-emerald-600",
  verb: "from-sky-500 to-sky-600",
  adjective: "from-violet-500 to-violet-600",
  adverb: "from-amber-500 to-amber-600",
  default: "from-slate-500 to-slate-600",
};

export const difficultyColorMap = {
  beginner: "bg-emerald-100 text-emerald-600 border-emerald-200",
  intermediate: "bg-amber-100 text-amber-600 border-amber-200",
  advanced: "bg-rose-100 text-rose-600 border-rose-200",
};

export const TYPE_OPTIONS = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Preposition",
  "Conjunction",
  "Interjection",
  "Idiom",
  "Phrase",
  "Proverb",
  "Expression",
  "Slang",
  "Phrasal Verb",
];

export const TAG_OPTIONS = [
  "emotions",
  "nature",
  "philosophy",
  "",
  "technology",
  "culture",
  "science",
  "art",
  "history",
  "sports",
  "food",
  "luck",
  "travel",
  "music",
  "language",
  "education",
  "health",
  "business",
  "politics",
  "entertainment",
];
export const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

// constants.js

export const TYPE_OPTIONS_DROPDOWN = [
  // Core Parts of Speech
  { value: "noun", label: "Noun" }, // Person, place, thing, or idea; "dog," "city," "happiness."
  { value: "verb", label: "Verb" }, // Action or state of being; "run," "is," "think."
  { value: "adjective", label: "Adjective" }, // Describes a noun; "happy," "blue," "quick."
  { value: "adverb", label: "Adverb" }, // Modifies a verb, adjective, or other adverb; "quickly," "very," "well."
  { value: "pronoun", label: "Pronoun" }, // Replaces a noun; "he," "they," "which."
  { value: "preposition", label: "Preposition" }, // Shows relationship between a noun (or pronoun) and other words; "in," "on," "by."
  { value: "conjunction", label: "Conjunction" }, // Connects words, phrases, or clauses; "and," "but," "because."
  { value: "interjection", label: "Interjection" }, // Expresses emotion or surprise; "wow," "ouch," "hey."

  // Phrases & Fixed Expressions
  { value: "idiom", label: "Idiom" }, // Common phrases with figurative meanings; "break the ice" means to initiate social interactions.
  { value: "phrase", label: "Phrase" }, // Group of words acting as a single part of speech; "in a nutshell" means briefly.
  { value: "proverb", label: "Proverb" }, // Teaches wisdom; "A stitch in time saves nine."
  { value: "expression", label: "Expression" },

  // Style, Origin, and Modern Use
  { value: "slang", label: "Slang" }, // Informal words or phrases; "cool" for "great."
  { value: "euphemism", label: "Euphemism" }, // Soften the impact of an unpleasant truth;"letting someone go" instead of "firing someone."
  { value: "loanword", label: "Loanword" }, // Borrowed from another language without translation; "café" from French, Kindergarten from German, Deja vu from French.
  { value: "archaic", label: "Archaic" }, // Outdated or old-fashioned words; "thou" for "you."
  { value: "neologism", label: "Neologism" }, // Newly coined words or expressions; "selfie" for a self-taken photo, googling for searching online.
];

export const TAG_OPTIONS_DROPDOWN = [
  { value: "emotions", label: "emotions" },
  { value: "nature", label: "nature" },
  { value: "philosophy", label: "philosophy" },
  { value: "technology", label: "technology" },
  { value: "culture", label: "culture" },
  { value: "science", label: "science" },
  { value: "art", label: "art" },
  { value: "history", label: "history" },
  { value: "sports", label: "sports" },
  { value: "food", label: "food" },
  { value: "luck", label: "luck" },
  { value: "travel", label: "travel" },
  { value: "music", label: "music" },
  { value: "language", label: "language" },
  { value: "education", label: "education" },
  { value: "health", label: "health" },
  { value: "business", label: "business" },
  { value: "politics", label: "politics" },
  { value: "entertainment", label: "entertainment" },
];

export const LEVEL_OPTIONS_DROPDOWN = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "word_asc", label: "Word (A-Z)" },
  { value: "word_desc", label: "Word (Z-A)" },
  { value: "level_asc", label: "Easy to Hard" },
  { value: "level_desc", label: "Hard to Easy" },
];

export const LEVEL_ORDER = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};
