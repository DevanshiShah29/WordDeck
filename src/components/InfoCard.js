import React from "react";

/**
 * A component to display an information card with a header and structured content.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - The Lucide icon or element for the header.
 * @param {string} props.title - The title of the information card.
 * @param {React.ReactNode} props.children - The content (e.g., InfoRow components) displayed below the header.
 * @param {string} [props.iconColors="from-blue-500 to-indigo-600"] - Tailwind class for icon background gradient.
 */
export default function InfoCard({ icon, title, children, iconColors }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transition-transform">
      <div className="flex items-center gap-4 mb-5">
        <div className={`p-3 rounded-xl text-white shadow-lg  bg-gradient-to-r  ${iconColors}`}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="space-y-3 divide-y divide-slate-100">{children}</div>
    </div>
  );
}
