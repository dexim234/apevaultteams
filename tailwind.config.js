/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4E6E49',
          dark: '#4E6E49',
        },
        slot: '#4E6E49',
        dayoff: '#fbbf24',
        vacation: '#f97316',
        sick: '#a855f7',
        background: '#0A0A0A',
        green: {
          50: '#f0f4ef',
          100: '#d9e3d8',
          200: '#b3c7b1',
          300: '#8dab8a',
          400: '#678f63',
          500: '#4E6E49',
          600: '#3e583d',
          700: '#2f4230',
          800: '#1f2c1f',
          900: '#0f160f',
        },
      },
    },
  },
  plugins: [],
}



