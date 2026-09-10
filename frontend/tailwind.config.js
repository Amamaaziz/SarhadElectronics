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
          950: '#081021', // Primary background
          900: '#0B132B',
          800: '#0F172A',
          700: '#162032',
        },
        surface: {
          DEFAULT: '#1E293B',
          card: '#131D33',
          border: 'rgba(0, 229, 255, 0.15)',
          glow: 'rgba(0, 229, 255, 0.25)',
        },
        cyan: {
          neon: '#00E5FF',
          hover: '#00C8E0',
          glow: 'rgba(0, 229, 255, 0.4)',
        },
        magenta: {
          neon: '#EC4899',
          purple: '#A855F7',
          deep: '#D946EF',
        },
        textMuted: '#94A3B8',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.35)',
        'neon-cyan-lg': '0 0 25px rgba(0, 229, 255, 0.5)',
        'neon-magenta': '0 0 15px rgba(236, 72, 153, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.12) 0%, rgba(168, 85, 247, 0.08) 35%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

