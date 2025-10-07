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

  // Determine the dynamic class list.
  // You can add Tailwind classes for disabled/loading state here if they override your CSS.
  const buttonClasses = `
    generate-ai-btn
    ${loading ? "opacity-70 cursor-not-allowed pointer-events-none" : "hover:opacity-90"}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={handleGenerate}
      disabled={loading} // Crucial: Disables the native button click handler
      aria-live="polite" // Announces state changes to screen readers
    >
      {/* The icon slot should conditionally render the spinner or the AI icon.
        The 'ai-icon' class is preserved here.
      */}
      <span className="ai-icon">
        {loading ? (
          // Use an inline Tailwind class to make the Lucide icon spin
          <Loader2 className="w-5 h-5 animate-spin" aria-label="Generating..." />
        ) : (
          // Preserve the original AI symbol/icon
          <>✨</>
        )}
      </span>

      {/* Button text changes based on state */}
      <span>{loading ? "Generating..." : "Generate with AI"}</span>
    </button>
  );
};

export default GenerateWithAIButton;
