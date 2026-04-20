import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4fbfa",
          100: "#d9f0ec",
          200: "#b4dfd6",
          300: "#84c4b7",
          400: "#569f91",
          500: "#397f73",
          600: "#2b665d",
          700: "#224f49",
          800: "#1d403c",
          900: "#1a3532"
        },
        accent: "#f4b740",
        ink: "#102422"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 36, 34, 0.12)"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(244,183,64,0.18), transparent 30%), radial-gradient(circle at right, rgba(57,127,115,0.16), transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
