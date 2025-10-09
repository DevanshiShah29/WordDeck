import React from "react";
import { Loader2 } from "lucide-react";

/**
 * A centralized, full-screen loading component.
 * It features a prominent spinner and an optional message.
 *
 * @param {object} props
 * @param {string} [props.message='Loading content, please wait...'] - The text displayed below the spinner.
 * @param {string} [props.fullScreen=true] - If true, the loader takes up the full viewport height.
 */
export default function Loader({ message = "Loading content, please wait...", fullScreen = true }) {
  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen bg-white/95 fixed inset-0 z-50 p-8"
    : "flex flex-col items-center justify-center w-full h-full bg-white/80 p-8";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />

      <div
        className="text-lg font-medium tracking-wide text-slate-700 
                   animate-pulse transition-opacity duration-700"
      >
        {message}
      </div>
    </div>
  );
}
