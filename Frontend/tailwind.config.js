/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./src/*.{js,jsx,ts,tsx,html}",
    "./public/**/*.html",
    "./public/*.html",
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
};
