/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Nanti kita tambahkan warna brand Ratna Bakery
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#faefd8",
          500: "#d4821a",
          600: "#b86d12",
          700: "#8a4f0a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
