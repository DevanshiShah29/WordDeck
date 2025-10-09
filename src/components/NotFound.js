import React from "react";
import { ShieldX } from "lucide-react";

/**
 * A dedicated component for displaying a "Not Found" or "Error" state.
 * It provides clear, centered messaging with a friendly design.
 *
 * @param {object} props
 * @param {string} props.message - The primary error message to display (e.g., "Word not found").
 */
export default function NotFound({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">Uh Oh! Missing Artifact</h1>

        <p className="text-slate-500 text-base leading-relaxed">
          {message} Please return to the main list.
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
