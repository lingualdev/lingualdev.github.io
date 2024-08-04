/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./themes/lingual/layouts/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
