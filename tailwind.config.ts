import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e11d48",     // Rose/Red
        secondary: "#f472b6",   // Pink
        accent: "#1d4ed8",      // Blue
        dark: "#1e1b4b",        // Deep Indigo Dark
      },
    },
  },
  plugins: [],
} satisfies Config

