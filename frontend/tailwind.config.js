/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#121316",
        cardBg: "#1e1f24",
        cardBorder: "#2a2b32",
        accentOrange: "#f97316",
        accentHover: "#ea580c"
      }
    },
  },
  plugins: [],
}
