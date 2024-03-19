/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
    theme: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      }
    }
  },
  daisyui: {
    themes: ["light"],
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui"), require("flowbite/plugin")],
};
