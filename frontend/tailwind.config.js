/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // App surfaces
        'app-bg':      '#F4F6F8',
        'app-surface': '#FFFFFF',
        'app-surface2':'#F9FAFB',
        'app-border':  '#E5E7EB',
        'app-border2': '#D1D5DB',
        'app-muted':   '#6B7280',
        'app-muted2':  '#9CA3AF',
        'app-fg':      '#111827',
        // Brand green
        'brand-green': {
          DEFAULT: '#16663A',
          light:   '#22C55E',
          lighter: '#DCFCE7',
          dark:    '#0F4D2B',
          muted:   '#BBF7D0',
        },
        // Accent colors
        'accent-blue':   '#2563EB',
        'accent-purple': '#7C3AED',
        'accent-amber':  '#D97706',
        'accent-rose':   '#E11D48',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        'xl':  '0.75rem',
        'lg':  '0.5rem',
        'md':  '0.375rem',
      },
      fontFamily: {
        sans:    ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card':      '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover':'0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'brand':     '0 4px 14px 0 rgba(22,102,58,0.2)',
        'brand-lg':  '0 8px 30px 0 rgba(22,102,58,0.25)',
        'modal':     '0 20px 60px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },             to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
