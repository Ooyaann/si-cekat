export const Badge = ({ status, text, className = '', showIcon = true }) => {
  const configs = {
    success: { bg: 'bg-status-success/10', text: 'text-status-success', border: 'border-status-success/20', icon: 'check_circle' },
    warning: { bg: 'bg-status-warning/10', text: 'text-status-warning', border: 'border-status-warning/20', icon: 'warning' },
    danger: { bg: 'bg-status-danger/10', text: 'text-status-danger', border: 'border-status-danger/20', icon: 'cancel' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', icon: 'info' },
    default: { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-200', icon: 'info' },
  };

  const config = configs[status] || configs.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}>
      {showIcon && (
        <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
          {config.icon}
        </span>
      )}
      {text}
    </span>
  );
};
