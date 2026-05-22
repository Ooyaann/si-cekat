/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'primary-container': '#1e40af',
        'on-primary-container': '#93c5fd',
        'page-bg': '#F8FAFC',
        'neutral-dark': '#1E293B',
        'neutral-mid': '#64748B',
        'neutral-light': '#F1F5F9',
        
        // Semantic Status
        'status-success': '#16A34A',
        'status-danger': '#DC2626',
        'status-warning': '#D97706',
        
        // Tonal Layering Surfaces
        'surface': '#faf9fe',
        'surface-dim': '#dad9de',
        'surface-bright': '#faf9fe',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f3f8',
        'surface-container': '#eeedf2',
        'surface-container-high': '#e8e7ec',
        'surface-container-highest': '#e3e2e7',
        'on-surface': '#1a1b1f',
        'on-surface-variant': '#43474f',
        
        // Border & Outline
        'outline': '#747780',
        'outline-variant': '#c4c6d0',
        
        // Error Tonal
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        
        // Legacy colors fallback (compatibility)
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#D97706',
        info: '#2563EB',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '0.125rem',     // 2px
        'DEFAULT': '0.25rem',  // 4px
        'md': '0.375rem',      // 6px - Base Radius
        'lg': '0.5rem',        // 8px
        'xl': '0.75rem',       // 12px - Card Radius
        'button': '0.375rem',  // 6px
        'card': '0.75rem',     // 12px
      },
      spacing: {
        'margin-mobile': '16px',
        'margin-desktop': '32px',
        'gutter': '16px',
        'unit': '4px',
        'touch-target-min': '44px',
      },
      boxShadow: {
        'card': '0px 4px 12px rgba(30, 41, 59, 0.05)',
        'card-hover': '0px 10px 18px rgba(30, 41, 59, 0.08)',
      },
    },
  },
  plugins: [],
}
