/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f6fa",
          100: "#e9ebf2",
          200: "#c9cee0",
          300: "#a3aac4",
          400: "#7a82a3",
          500: "#5b6285",
          600: "#454a68",
          700: "#33374d",
          800: "#22243a",
          900: "#13142a",
          950: "#0a0b1a",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 50px -10px rgba(168, 85, 247, 0.45)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "mesh-aurora":
          "radial-gradient(at 20% 20%, rgba(168,85,247,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236,72,153,0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(59,130,246,0.30) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245,158,11,0.20) 0px, transparent 50%)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
