/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-mode="dark"]'], // Enables dark mode by default using a class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color scheme inspired by DSCVR
        background: {
          light: '#121212', // dark background
          DEFAULT: '#1e1e1e', // default background
          dark: '#0f0f0f', // even darker background
        },
        primary: {
          light: '#bb86fc',  // light purple
          DEFAULT: '#6200ea', // deep purple
          dark: '#3700b3',    // darker purple
        },
        secondary: {
          light: '#03dac6',  // light teal
          DEFAULT: '#03dac6', // teal
          dark: '#018786',    // dark teal
        },
        accent: {
          light: '#ff4081',  // light pink
          DEFAULT: '#ff4081', // pink
          dark: '#c51162',    // dark pink
        },
        text: {
          light: '#ffffff',   // white text
          DEFAULT: '#e0e0e0', // light gray text
          dark: '#b0b0b0',    // dark gray text
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Roboto for a modern feel
        mono: ['Source Code Pro', 'monospace'], // Monospaced font
      },
      borderRadius: {
        '2xl': '1rem', // Rounded corners
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
