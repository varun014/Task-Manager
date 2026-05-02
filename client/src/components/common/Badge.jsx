const Badge = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
