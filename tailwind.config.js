/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#121212",
          100: "#1f1b24",
          200: "#2a2a2a",
        },
      },
    },
  },
  plugins: [],
};
