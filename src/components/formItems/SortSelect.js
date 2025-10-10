// src/components/SortSelect.jsx
import React, { useMemo } from "react";
import Select from "react-select";
import { ArrowDownNarrowWide } from "lucide-react";

/**
 * Renders a highly-styled, non-Formik, single-select dropdown for sorting.
 *
 * @param {object} props
 * @param {string} props.currentSort - The currently selected sort value (e.g., 'date_desc').
 * @param {function} props.onSortChange - Handler function called when a new option is selected.
 * @param {Array<object>} props.options - Array of sort options ({ value, label }).
 */
const SortSelect = ({ currentSort, onSortChange, options }) => {
  const selectValue = useMemo(() => {
    return options.find((option) => option.value === currentSort) || null;
  }, [currentSort, options]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      onSortChange(selectedOption.value);
    }
  };

  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected
        ? "rgba(96, 125, 222, 1)"
        : state.isFocused
        ? "#eff6ff"
        : "white",
      cursor: "pointer",
      ":active": {
        backgroundColor: state.isSelected ? "rgba(96, 125, 222, 1)" : "#dbeafe",
      },
    }),
  };

  const selectClassNames = {
    control: (state) => `bg-white rounded-lg px-1 text-sm font-medium transition-all `,
    valueContainer: () => "p-0 pl-3 cursor-pointer",
    singleValue: () => "text-slate-700",
    indicatorsContainer: () => "pr-2",
    dropdownIndicator: () => "text-slate-500 hover:text-slate-700 transition",
    indicatorSeparator: () => "hidden",

    // Dropdown menu styling
    menu: () => "rounded-lg overflow-hidden mt-1 bg-white shadow-xl w-48",
    option: () => `py-2 px-4 cursor-pointer`,
  };

  const CustomControl = ({ children, ...rest }) => (
    <div
      {...rest.innerProps}
      className={`${rest.className} border border-slate-300 min-w-[200px] py-2.5 rounded-lg hover:border-slate-400 `}
    >
      <div className="flex items-center">
        {children}
        <ArrowDownNarrowWide size={20} className="text-slate-500 mr-3" />
      </div>
    </div>
  );

  return (
    <div className="relative flex-shrink-0">
      <Select
        // Basic configuration
        id="sort-select"
        isMulti={false}
        isClearable={false}
        isSearchable={false}
        // Controlled properties
        value={selectValue}
        options={options}
        onChange={handleSelectChange}
        // Styling
        classNames={selectClassNames}
        styles={selectStyles}
        // Custom component to wrap the internal elements
        components={{
          Control: CustomControl,
          // Hides the standard indicator arrow
          DropdownIndicator: () => null,
        }}
      />
    </div>
  );
};

export default SortSelect;
