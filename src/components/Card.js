const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/95 backdrop-blur border border-gray-200/50 rounded-xl shadow-lg ${className}`}
  >
    {children}
  </div>
);
export default Card;
