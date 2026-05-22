import { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect - Dropdown Kustom yang Elegan, Interaktif, dan Profesional
 * 
 * Properti:
 * - value: Nilai yang sedang terpilih
 * - onChange: Callback ketika nilai berubah, mengembalikan object mirip event target: { target: { value } }
 * - options: Array dari string atau object { value, label }
 * - placeholder: Teks placeholder ketika tidak ada yang terpilih
 * - label: Label di atas select
 * - disabled: Status non-aktif
 * - required: Status wajib diisi
 * - className: Class tambahan untuk container
 */
export const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Pilih opsi...',
  label,
  disabled = false,
  required = false,
  className = '',
  heightClass = 'h-11'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Klik di luar komponen untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menormalisasi opsi menjadi format { value, label }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

  const handleSelect = (val) => {
    if (disabled) return;
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full ${heightClass} px-3 bg-slate-50/50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 select-none
          ${disabled ? 'opacity-55 cursor-not-allowed bg-slate-100/80 border-slate-200' : 'hover:border-slate-300 hover:bg-white'}
          ${isOpen ? 'border-primary ring-2 ring-primary/10 bg-white shadow-sm' : ''}
          text-sm font-semibold`}
      >
        <span className={selectedOption ? 'text-slate-800' : 'text-slate-400 font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 text-[20px] ${isOpen ? 'rotate-180 text-primary' : ''}`}>
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-[999] w-full mt-1.5 bg-white border border-slate-150 rounded-xl shadow-lg max-h-60 overflow-y-auto no-scrollbar py-1 animate-scale-in">
          {normalizedOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 text-center font-medium">Tidak ada pilihan tersedia</div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors duration-150 flex items-center justify-between select-none
                    ${isSelected 
                      ? 'bg-primary/5 text-primary' 
                      : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
