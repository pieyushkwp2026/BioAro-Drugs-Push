/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F8F6F4", 50: "#FCFBF8", 100: "#F8F6F4", 200: "#F1EEE6" },
        ink: { DEFAULT: "#1B1A17", 900: "#161412", 800: "#1B1A17", 700: "#4A473F" },
        forest: { DEFAULT: "#2F4F3E", 600: "#2F4F3E", 700: "#1F3C2D", 400: "#4D8167" },
        gold: { DEFAULT: "#B08A4E", 400: "#C7923A", 600: "#8E6A35" },
        sand: { DEFAULT: "#E2DED2" },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["Inter", "sans-serif"],
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 18px 44px -26px rgba(27,26,23,0.28)",
        "glass-lg": "0 26px 80px -36px rgba(27,26,23,0.34)",
      },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};
