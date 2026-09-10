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
        brand: {
          blue: '#0B6CCF',
          navy: '#0E1E3E',
        },
        navy: {
          950: '#07101E', // Custom Nav & Footer background
          900: '#0B132B',
          850: '#0E1E3E',
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
          electric: '#0B6CCF',
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
        'neon-blue': '0 0 20px rgba(11, 108, 207, 0.45)',
        'neon-magenta': '0 0 15px rgba(236, 72, 153, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 30%, rgba(11, 108, 207, 0.25) 0%, rgba(14, 30, 62, 0.4) 45%, transparent 70%)',
        'brand-gradient': 'linear-gradient(135deg, #0E1E3E 0%, #081021 50%, #0B6CCF 100%)',
        'site-bg': 'radial-gradient(ellipse at top, #0E1E3E 0%, #081021 60%, #0E1E3E 100%)',
      },
    },
  },
  plugins: [],
}

