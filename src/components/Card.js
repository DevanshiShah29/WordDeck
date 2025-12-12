const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/95 backdrop-blur border border-[var(--slate-200)]/50 rounded-lg shadow-md ${className}`}
  >
    {children}
  </div>
);
export default Card;
