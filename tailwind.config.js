/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yankee-navy': '#001c43',
        'yankee-slate': '#2c3e50',
        'yankee-gray': '#34495e',
        'yankee-light': '#7f8c8d',
      },
    },
  },
  plugins: [],
}


