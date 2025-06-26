/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Required for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // or ts/tsx if you're using TS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
