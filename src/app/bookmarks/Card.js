import React from "react";

const Card = ({ className, ...props }) => (
  <div
    className={`rounded-xl border border-[var(--slate-200)] bg-white text-[var(--slate-800)] shadow-md transition-all duration-300 ${className}`}
    {...props}
  />
);
export default Card;
