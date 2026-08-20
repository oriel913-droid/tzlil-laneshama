/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ערכת צבעים חמה, יוקרתית, בהשראת עץ וזהב (סעיף 18 בספר היסוד)
      colors: {
        wood: {
          50: "#faf6f1",
          100: "#f0e4d6",
          200: "#e0c8ac",
          300: "#cca87c",
          400: "#b8875a",
          500: "#9c6b3f",
          600: "#7d5432",
          700: "#5f3f27",
          800: "#432c1b",
          900: "#2b1c11",
        },
        gold: {
          50: "#fdf9ee",
          100: "#f8ecc8",
          200: "#f0d68d",
          300: "#e6bb54",
          400: "#d9a02f",
          500: "#b9821f",
          600: "#916419",
          700: "#6c4a15",
        },
        surface: {
          DEFAULT: "#fffdf9",
          muted: "#f7f2ea",
        },
      },
      fontFamily: {
        sans: ["Assistant", "Heebo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
