export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const baseStyles = 'bg-white rounded-card shadow-card p-4 sm:p-6';
  const hoverStyles = hoverable ? 'transition-shadow hover:shadow-card-hover cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
