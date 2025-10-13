// src/app/edit/[slug]/page.js
"use client";

import React, { useCallback, useState, useEffect } from "react";

// Library Imports
import Link from "next/link";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Assets & Icons
import { BookIcon, GlobeIcon, LightbulbIcon, ImageIcon, TagsIcon, SaveIcon } from "@/assets/svgs";
import { ArrowLeft } from "lucide-react";

// Component Imports
import FormField from "@/components/formItems/FormField";
import TextareaField from "@/components/formItems/TextareaField";
import SelectField from "@/components/formItems/SelectField";
import GenerateWithAIButton from "@/components/buttons/GenerateWithAI";
import Button from "@/components/buttons/Button";

// Data Imports
import { LEVEL_OPTIONS_DROPDOWN, TYPE_OPTIONS_DROPDOWN } from "@/utils/constants";
import { validationSchema } from "../../add/helper";
import Loader from "@/components/Loader";

// Helper to convert array fields back to comma-separated strings for the form
const arrayToCommaString = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || "");

const DUMMY_INITIAL_VALUES = {
  // Must match the full structure of the form's initial values
  word: "",
  type: "noun",
  pronunciation: "",
  definition: "",
  example: "",
  difficulty: "beginner",
  origin: "",
  synonyms: "",
  etymology: "",
  etymologyStory: "",
  mnemonics: "",
  imageUrl: "",
  tags: "",
};

const FormHeader = ({ word }) => (
  <div className="bg-white backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-40">
    <div className="container mx-auto px-8 py-4">
      <div className="flex items-center gap-2">
        <Link
          href="/word"
          className="p-2 rounded-lg transition-all duration-300 group hover:bg-slate-100"
          aria-label="Go back to vocabulary list"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Word: {word || "Loading..."}</h1>
          <p className="mt-1 text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block">
            Modify vocabulary entry
          </p>
        </div>
      </div>
    </div>
  </div>
);

const EditVocabularyForm = ({ params }) => {
  const { slug } = params;
  const router = useRouter();

  // 1. State for data and loading/error status
  // Initialize with DUMMY values to keep Formik's structure consistent on first render
  const [initialValues, setInitialValues] = useState(DUMMY_INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 2. Fetch data using useEffect
  useEffect(() => {
    if (!slug) return;

    const fetchWordData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/words?slug=${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch word.");
        }

        // Format the fetched data for Formik
        setInitialValues({
          _id: data._id,
          word: data.word || "",
          type: data.type || "noun",
          pronunciation: data.pronunciation || "",
          definition: data.definition || "",
          example: data.example || "",
          difficulty: data.difficulty || "beginner",
          origin: data.origin || "",
          synonyms: arrayToCommaString(data.synonyms),
          etymology: data.etymology || "",
          etymologyStory: data.etymologyStory || "",
          mnemonics: data.mnemonics || "",
          imageUrl: data.imageUrl || "",
          tags: arrayToCommaString(data.tags),
        });
        setIsDataLoaded(true);
      } catch (e) {
        console.error("Fetch Error:", e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordData();
  }, [slug]);

  // 3. handleSubmit
  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const response = await fetch(`/api/words?_id=${values._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMessage = result.error || "Failed to update word.";
          toast.error(`Failed to update word: ${errorMessage}`);
          return;
        }

        toast.success(`Word "${values.word}" updated successfully!`);

        const newSlug = result.slug || values.slug;
        if (newSlug && newSlug !== slug) {
          router.replace(`/word/${newSlug}`);
        } else {
          router.push("/word");
        }
      } catch (error) {
        toast.error("Failed to update word due to a network or connection error.");
      } finally {
        setSubmitting(false);
      }
    },
    [router, slug]
  );

  // 4. handleGenerateAnswer
  const handleGenerateAnswer = async (word, setFieldValue) => {
    if (!word || word.trim() === "") {
      toast.info("Please enter a word in the 'Word' field first.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-word-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`AI Generation Failed: ${result.error || "Server error."}`);
        return;
      }

      Object.keys(result).forEach((key) => {
        if (key !== "word" && key !== "_id") {
          setFieldValue(key, result[key], false);
        }
      });
    } catch (error) {
      toast.error("AI generation failed due to a network error.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine the word for the header
  let headerWord = "Loading...";
  if (error) {
    headerWord = "Error";
  } else if (isDataLoaded) {
    headerWord = initialValues.word;
  }

  // 5. Form Render (Using consistent structure to prevent hydration errors)
  return (
    <>
      <FormHeader word={headerWord} />

      {/* Main Content Wrapper: Always rendered */}
      <div className="bg-slate-50 min-h-screen pb-10">
        {/* Conditional Content Rendering */}
        {error ? (
          <div className="text-center p-10 text-red-500 container mx-auto">
            Failed to load word: {error.message || "Word not found."}
          </div>
        ) : isLoading && !isDataLoaded ? (
          <Loader message="Loading word data..." />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // Re-initializes from DUMMY to real data
          >
            {({ isSubmitting, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-8 container mx-auto p-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <BookIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">1. Basic Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField id="word" label="Word" placeholder="Enter the word" required />
                    <SelectField
                      id="type"
                      label="Word Type"
                      options={TYPE_OPTIONS_DROPDOWN}
                      required
                    />
                    <FormField
                      id="pronunciation"
                      label="Pronunciation"
                      placeholder="/prəˌnʌnsiˈeɪʃən/ (IPA)"
                      required
                    />
                    <SelectField
                      id="difficulty"
                      label="Difficulty Level"
                      options={LEVEL_OPTIONS_DROPDOWN}
                    />
                  </div>
                  <div className="mt-6">
                    <TextareaField
                      id="definition"
                      label="Definition"
                      rows="3"
                      placeholder="Provide a clear definition of the word"
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <TextareaField
                      id="example"
                      label="Usage Example"
                      rows="2"
                      placeholder="Provide an example sentence using this word"
                      required
                    />
                  </div>
                </div>

                {/* Etymology & Origin Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <GlobeIcon className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">2. Origin & Story</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      id="origin"
                      label="Origin Language"
                      placeholder="e.g., Latin, Greek, French"
                      required
                    />
                    <FormField
                      id="synonyms"
                      label="Synonyms"
                      placeholder="Separate with commas: happy, joyful, elated"
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <TextareaField
                      id="etymology"
                      label="Etymology (Brief)"
                      rows="2"
                      placeholder="Brief etymology or word root information"
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <TextareaField
                      id="etymologyStory"
                      label="Etymology Story"
                      rows="4"
                      placeholder="Tell the fascinating story behind this word's origin"
                      required
                    />
                  </div>
                </div>

                {/* Memory Aids & Media Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <LightbulbIcon className="w-6 h-6 text-yellow-600" />
                    <h2 className="text-xl font-semibold text-gray-900">3. Memory & Media</h2>
                  </div>
                  <div className="space-y-6">
                    <TextareaField
                      id="mnemonics"
                      label="Memory Aid / Mnemonics"
                      rows="2"
                      placeholder="Create a memorable way to remember this word (e.g., rhyme, association)"
                      required
                    />
                    <FormField
                      id="imageUrl"
                      label="Image URL"
                      type="url"
                      icon={ImageIcon}
                      placeholder="https://example.com/image.jpg"
                    />
                    <FormField
                      id="tags"
                      label="Tags"
                      icon={TagsIcon}
                      placeholder="Separate with commas: emotions, literature, formal"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <GenerateWithAIButton
                    onGenerate={() => handleGenerateAnswer(values.word, setFieldValue)}
                    loading={isGenerating}
                  />

                  <div className="flex items-center gap-4">
                    <Link
                      href="/word"
                      className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      Cancel
                    </Link>
                    <Button
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      disabled={isSubmitting || isGenerating}
                    >
                      <SaveIcon className="w-5 h-5 mr-3" />
                      {isSubmitting ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};

export default EditVocabularyForm;
