export const typeColorMap = {
  // Core Parts of Speech
  noun: "from-emerald-500 to-emerald-600",
  verb: "from-sky-500 to-sky-600",
  adjective: "from-violet-500 to-violet-600",
  adverb: "from-amber-500 to-amber-600",
  pronoun: "from-red-500 to-red-600",
  preposition: "from-fuchsia-500 to-fuchsia-600",
  conjunction: "from-pink-500 to-pink-600",
  interjection: "from-rose-500 to-rose-600",
  // Phrases & Fixed Expression
  idiom: "from-teal-500 to-teal-600",
  phrase: "from-cyan-500 to-cyan-600",
  proverb: "from-lime-500 to-lime-600",
  expression: "from-yellow-500 to-yellow-600",
  // Style, Origin, and Modern Use
  slang: "from-gray-500 to-gray-600",
  euphemism: "from-blue-500 to-blue-600",
  loanword: "from-orange-500 to-orange-600",
  archaic: "from-zinc-500 to-zinc-600",
  neologism: "from-indigo-500 to-indigo-600",
  // Fallback for missing or unknown types
  default: "from-slate-500 to-slate-600",
};

export const difficultyColorMap = {
  beginner: "bg-emerald-100 text-emerald-600 border-emerald-200",
  intermediate: "bg-amber-100 text-amber-600 border-amber-200",
  advanced: "bg-rose-100 text-rose-600 border-rose-200",
};

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
  { value: "random", label: "Random" },
];

export const LEVEL_ORDER = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export const ORIGIN_OPTIONS = [
  "Latin",
  "Greek",
  "French",
  "German",
  "Old English",
  "Spanish",
  "Italian",
  "Dutch",
  "Arabic",
  "Sanskrit",
  "Japanese",
  "Hebrew",
];
export const WORD_LENGTH_OPTIONS = ["Short (1-5)", "Medium (6-10)", "Long (11+)"];
