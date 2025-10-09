import React, { useMemo } from "react";
import Select from "react-select";
import { useFormikContext } from "formik";

/**
 * Renders a Select field (single or multi) integrated with Formik and react-select.
 * Preserves original custom styles defined in selectStyles and selectClassNames.
 *
 * @param {object} props
 * @param {string} props.label - The visible label for the field.
 * @param {string} props.id - The unique ID and Formik name for the field.
 * @param {Array<object>} props.options - Array of select options.
 * @param {boolean} [props.required] - Indicates if the field is required.
 * @param {boolean} [props.isMulti=false] - Enables multi-select mode.
 */
const SelectField = ({ label, id, options, required, isMulti = false, ...props }) => {
  const { values, setFieldValue, setFieldTouched, touched, errors } = useFormikContext();

  const isInvalid = touched[id] && errors[id];

  const handleSelectChange = (option) => {
    // Determine the value to set: array of values for multi, single value, or empty string
    const newValue = isMulti ? option.map((opt) => opt.value) : option ? option.value : "";

    setFieldValue(id, newValue);
  };

  const handleSelectBlur = () => {
    setFieldTouched(id, true);
  };

  // --- Value Mapping (Memoized for efficiency) ---
  const selectValue = useMemo(() => {
    const currentValue = values[id];

    if (isMulti) {
      // Return an array of option objects matching the current array of values
      // Use optional chaining just in case values[id] is null/undefined initially
      return options.filter((option) => currentValue?.includes(option.value));
    }

    // Return a single option object matching the current value
    return options.find((option) => option.value === currentValue) || null;
  }, [values, id, isMulti, options]);

  // --- Original Custom Styles (Functional and Preserved) ---

  const selectStyles = {
    // This is necessary if you need complex, state-dependent styling that CSS/Tailwind can't easily handle
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      // Using your original blue-gray color values
      backgroundColor: state.isSelected
        ? "rgba(96, 125, 222, 1)"
        : state.isFocused
        ? "rgba(239, 242, 255, 1)"
        : "white",
      cursor: "pointer",
      ":active": {
        backgroundColor: state.isSelected ? "rgba(96, 125, 222, 1)" : "rgb(239, 246, 255)",
      },
    }),
  };

  // --- Original Custom ClassNames (Functional and Preserved) ---

  const selectClassNames = {
    // Preserve the original class structure and logic for control styling
    control: (state) =>
      `bg-white px-3 py-1.5 border rounded-lg custom-select transition-all ${
        state.isFocused
          ? "border-blue-500 ring-1 ring-blue-500 shadow-md"
          : isInvalid
          ? "border-red-500 ring-1 ring-red-500" // Added ring for error state consistency
          : "border-gray-300"
      }`,
    placeholder: () => "text-gray-500",
    singleValue: () => "text-gray-900",
    option: (state) => `py-2 px-4 cursor-pointer`,
    menu: () => "rounded-lg overflow-hidden mt-1 bg-white shadow-xl",
    menuList: () => "thin-scrollbar", // Preserved custom scrollbar class
    dropdownIndicator: () => "text-gray-400 hover:text-gray-600 transition",
    clearIndicator: () => "text-gray-400 hover:text-red-500 transition",
    indicatorSeparator: () => "hidden",

    // Multi-select classes for better styling consistency
    multiValue: () => "bg-blue-100 text-blue-800 rounded-md",
    multiValueLabel: () => "py-1 pl-3 text-sm font-medium",
    multiValueRemove: () => "pl-1 pr-2 text-blue-500 hover:text-red-500 transition",
  };

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

      {/* Select Component */}
      <Select
        id={id}
        name={id}
        options={options}
        isMulti={isMulti}
        value={selectValue}
        onChange={handleSelectChange}
        onBlur={handleSelectBlur}
        styles={selectStyles} // Re-applied styles object
        classNames={selectClassNames} // Re-applied classNames object
        aria-invalid={isInvalid ? "true" : "false"}
        aria-describedby={isInvalid ? `${id}-error` : undefined}
        {...props}
      />

      {/* Error Message */}
      {isInvalid && (
        <div id={`${id}-error`} className="text-red-600 text-sm font-medium mt-1" role="alert">
          {errors[id]}
        </div>
      )}
    </div>
  );
};

export default SelectField;
