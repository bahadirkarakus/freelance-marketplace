/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    'bg-gradient-to-br',
    'from-blue-50',
    'via-white',
    'to-purple-50',
    'bg-gradient-to-r',
    'from-blue-600',
    'to-purple-600',
    'bg-clip-text',
    'text-transparent',
    'rounded-xl',
    'rounded-2xl',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
