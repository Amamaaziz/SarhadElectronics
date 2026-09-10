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
        ink: {
          DEFAULT: '#0B0F1A',
          soft: '#151B2B',
        },
        page: '#F6F7F9',
        card: '#FFFFFF',
        line: '#E7E9EE',
        muted: '#8A8F98',
        body: '#1F2430',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 20, 30, 0.04), 0 8px 24px -12px rgba(16, 20, 30, 0.10)',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
}