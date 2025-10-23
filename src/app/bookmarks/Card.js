import React from "react";

const Card = ({ className, ...props }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white text-gray-800 shadow-lg transition-all duration-300 ${className}`}
    {...props}
  />
);
export default Card;
