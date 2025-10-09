import React, { useState } from "react";
import { Loader2 } from "lucide-react"; // Using Loader2 for the rotating loading spinner

/**
 * A button component that handles an asynchronous generation task and displays a loading state.
 * It uses predefined CSS class names (`generate-ai-btn`, `ai-icon`, etc.) for styling.
 *
 * @param {object} props
 * @param {function} props.onGenerate - The asynchronous function to call when the button is clicked.
 */
const GenerateWithAIButton = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    // Return early if already loading to prevent multiple submissions
    if (loading) return;

    setLoading(true);
    try {
      // Execute the passed-in async function
      await onGenerate();
    } catch (error) {
      console.error("AI generation failed:", error);
      // Optional: Handle UI feedback for errors here
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = `
    generate-ai-btn cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed pointer-events-none" : "hover:opacity-90"}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={handleGenerate}
      disabled={loading} // Crucial: Disables the native button click handler
      aria-live="polite" // Announces state changes to screen readers
    >
      <span className="ai-icon">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-label="Generating..." />
        ) : (
          <>✨</>
        )}
      </span>

      <span>{loading ? "Generating..." : "Generate with AI"}</span>
    </button>
  );
};

export default GenerateWithAIButton;
