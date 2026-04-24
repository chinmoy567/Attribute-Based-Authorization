/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        floatIn: "floatIn 500ms ease-out forwards",
      },
      boxShadow: {
        panel: "0 22px 50px rgba(12, 18, 28, 0.22)",
      },
    },
  },
  plugins: [],
};
