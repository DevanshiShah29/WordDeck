import React from "react";
import { Loader2 } from "lucide-react";

// --- Base Styles (Consistent Look & Feel) ---
const baseClasses =
  "inline-flex items-center justify-center cursor-pointer rounded-lg transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

// --- Size Mapping ---
const sizeClasses = {
  sm: " text-sm",
  md: " text-base",
  lg: " text-lg",
};

// --- Variant Mapping (Visual Styling) ---
const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-lg font-medium transition",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300  px-4 py-2 rounded-lg font-medium transition",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300 focus:ring-0",
  transparent: "text-slate-600 rounded-lg font-medium transition",
};

/**
 * A general-purpose button component with built-in variants, sizes, and loading state.
 *
 * @param {object} props
 * @param {string} [props.variant='primary'] - The button's visual style ('primary', 'secondary', 'danger', 'ghost').
 * @param {string} [props.size='md'] - The button's size ('sm', 'md', 'lg').
 * @param {boolean} [props.loading=false] - If true, shows a spinner and disables the button.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to merge/override.
 * @param {React.ReactNode} props.children - The content inside the button (text, icons).
 * @param {string} [props.type='button'] - The native button type.
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  type = "button",
  ...props
}) {
  const mergedClasses = [baseClasses, sizeClasses[size], variantClasses[variant], className].join(
    " "
  );

  return (
    <button className={mergedClasses} type={type} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <div className="flex items-center">
          <Loader2 className={`animate-spin mr-2 ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
