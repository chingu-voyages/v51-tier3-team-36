import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EEEEEE",
        surface: "#f8f9fa",
        primary: "#8c6ef7",
        secondary: "#D1D8C5",
        tertiary: "#27374d",
        onPrimary: "#EEEEEE",
        onBackground: "#373A40",
        onSurface: "#023047",
        linkedin: "#0a66c2",
        instagram: "#f60078",
        discord: "#5865F2",
        github: "#333"
      },
      gridTemplateRows: {
        'repeat-3-250': 'repeat(3, 250px)',
      },
      keyframes: {
        scrollKF: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(calc(-100%))",
          },
        },
      },
      animation: {
        scroll: "scrollKF 15s linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
