/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./themes/lingual/layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif Pro"'],
        mono: ['"Fira Code"'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
