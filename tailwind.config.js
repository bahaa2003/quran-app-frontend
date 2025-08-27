/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'noto-arabic': ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        'islamic-gold': '#D4AF37',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}