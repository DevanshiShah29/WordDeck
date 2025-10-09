import React from "react";
import { useFormikContext } from "formik";

/**
 * Renders a standard textarea field connected to Formik context.
 * * @param {object} props
 * @param {string} props.label - The visible label for the field.
 * @param {string} props.id - The unique ID and Formik name for the field.
 * @param {string} [props.placeholder] - The placeholder text.
 * @param {number} [props.rows=3] - The number of visible text lines in the control.
 * @param {boolean} [props.required] - Indicates if the field is required (displays a red asterisk).
 */
const TextareaField = ({ label, id, placeholder, rows = 3, required }) => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  // Derived state for cleaner JSX
  const isError = touched[id] && errors[id];

  // Determine border and focus classes
  const borderColor = isError
    ? "border-red-500 focus:ring-red-500" // Error state
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"; // Default and focus states

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 select-none">
        {label}
        {required && (
          <span className="text-red-600 ml-1 font-bold" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Textarea */}
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        // Ensure controlled component by defaulting value to empty string
        value={values[id] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={isError ? "true" : "false"}
        aria-describedby={isError ? `${id}-error` : undefined}
        className={`
          w-full 
          px-4 
          py-3 
          border 
          rounded-xl 
          text-gray-900 
          placeholder-gray-500 
          shadow-sm
          outline-none 
          transition-colors
          resize-y
          focus:ring-2 
          ${borderColor}
        `}
      />

      {/* Error Message */}
      {isError && (
        <div
          id={`${id}-error`}
          className="text-red-600 text-sm font-medium mt-1"
          role="alert" // Accessibility enhancement
        >
          {errors[id]}
        </div>
      )}
    </div>
  );
};

export default TextareaField;
