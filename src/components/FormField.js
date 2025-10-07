import React from "react";
import { useFormikContext } from "formik";

/**
 * Renders a generic form field connected to Formik context.
 * * @param {object} props
 * @param {string} props.label - The visible label for the field.
 * @param {string} props.id - The unique ID and Formik name for the field.
 * @param {string} [props.type='text'] - The HTML input type (e.g., 'text', 'email', 'password').
 * @param {string} [props.placeholder] - The placeholder text.
 * @param {React.ComponentType} [props.icon] - The Lucide icon component to display next to the label.
 * @param {boolean} [props.required] - Indicates if the field is required (displays a red asterisk).
 */
const FormField = ({ label, id, type = "text", placeholder, icon, required }) => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();
  const Icon = icon;

  // Determine the border color based on Formik validation state
  const isError = touched[id] && errors[id];
  const borderColor = isError
    ? "border-red-500 ring-red-500" // Error state
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"; // Default and focus states

  return (
    <div className="space-y-2">
      {/* Label and Icon */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 select-none">
        {/* Icon (if provided) */}
        {Icon && (
          <Icon
            className="w-4 h-4 inline-block align-text-bottom mr-2 text-blue-600"
            aria-hidden="true"
          />
        )}

        {/* Label Text */}
        {label}

        {/* Required Asterisk (if required) */}
        {required && (
          <span className="text-red-600 ml-1 font-bold" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Input Field */}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={values[id] || ""} // Ensure controlled component by defaulting to empty string
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
          transition-colors
          outline-none 
          ring-0 
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

export default FormField;
