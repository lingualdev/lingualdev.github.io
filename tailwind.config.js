/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./themes/lingual/layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif Pro"'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
