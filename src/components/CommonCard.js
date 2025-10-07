/**
 * Generic Card component for displaying sections of content with an icon and title.
 * It's highly customizable via Tailwind class props for styling flexibility.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - The Lucide icon or SVG component to display.
 * @param {string} props.title - The title of the card section.
 * @param {React.ReactNode} props.children - The content to be placed inside the inner styled container.
 * @param {string} [props.iconGradient] - Tailwind classes for the icon's background gradient.
 * @param {string} [props.contentBackground] - Tailwind classes for the inner content's background gradient.
 * @param {string} [props.contentBorderColor] - Tailwind class for the inner content's border color.
 */
export default function Card({
  icon,
  title,
  children,
  iconGradient = "from-blue-500 to-blue-600",
  contentBackground = "from-blue-50 to-indigo-50",
  contentBorderColor = "border-blue-100",
}) {
  return (
    // 🎯 IMPROVEMENT 2: Consolidate wrapper classes
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-slate-100">
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Icon Container */}
        {/* 🎯 IMPROVEMENT 3: Use template literal for cleaner class merging */}
        <div className={`p-3 bg-gradient-to-r ${iconGradient} rounded-xl text-white`}>{icon}</div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      {/* Card Content Area */}
      <div
        className={`bg-gradient-to-r ${contentBackground} p-5 rounded-xl border ${contentBorderColor}`}
      >
        {children}
      </div>
    </div>
  );
}
