/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          50: "#f7f4ef",
          100: "#ece6db",
          200: "#d6ccb8",
          300: "#b8a88a",
          400: "#9a8664",
          500: "#7d6a4d",
          600: "#65553f",
          700: "#4f4334",
          800: "#2c261e",
          900: "#1a1612",
          950: "#0c0b0a",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Outfit"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 24px 50px -24px rgba(0, 0, 0, 0.55)",
        widget: "0 10px 40px -18px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
    },
  },
  plugins: [],
};
