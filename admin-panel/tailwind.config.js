/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#081021',
          900: '#0B132B',
          800: '#0F172A',
          700: '#162032',
        },
        surface: {
          DEFAULT: '#1E293B',
          card: '#131D33',
          border: 'rgba(0, 229, 255, 0.15)',
        },
        cyan: {
          neon: '#00E5FF',
          hover: '#00C8E0',
        },
        magenta: {
          neon: '#EC4899',
          purple: '#A855F7',
        },
        textMuted: '#94A3B8',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}

