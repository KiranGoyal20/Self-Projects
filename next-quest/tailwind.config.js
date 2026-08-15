/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f6fb",
          100: "#e6eaf5",
          200: "#c4cce0",
          300: "#9ba3c2",
          400: "#6f779e",
          500: "#525a83",
          600: "#3c4368",
          700: "#2a2f4d",
          800: "#1a1d36",
          900: "#0e1024",
          950: "#070815",
        },
        brand: {
          50: "#eef9ff",
          100: "#d7f1ff",
          200: "#b3e6ff",
          300: "#75d5ff",
          400: "#2dbfff",
          500: "#02a4f0",
          600: "#0083cc",
          700: "#0269a5",
          800: "#065986",
          900: "#0b4a70",
          950: "#073049",
        },
        neon: {
          green: "#5eead4",
          pink: "#f472b6",
          violet: "#a78bfa",
          amber: "#fbbf24",
          sky: "#38bdf8",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 50px -10px rgba(45, 191, 255, 0.45)",
        "glow-pink": "0 0 50px -10px rgba(244, 114, 182, 0.45)",
        "glow-violet": "0 0 50px -10px rgba(167, 139, 250, 0.45)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.55)",
      },
      backgroundImage: {
        "mesh-aurora":
          "radial-gradient(at 18% 14%, rgba(167,139,250,0.35) 0px, transparent 50%), radial-gradient(at 82% 6%, rgba(45,191,255,0.28) 0px, transparent 50%), radial-gradient(at 4% 96%, rgba(94,234,212,0.22) 0px, transparent 55%), radial-gradient(at 96% 92%, rgba(244,114,182,0.22) 0px, transparent 50%)",
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        "gradient-x": "gradientX 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
