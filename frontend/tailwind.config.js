/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#F8FAFC',
        card: '#1E293B',
        'card-hover': '#334155',
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        destructive: '#EF4444',
        muted: '#64748B',
        border: '#334155',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'pulse-dot': 'pulse-dot 1.4s infinite ease-in-out both',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
