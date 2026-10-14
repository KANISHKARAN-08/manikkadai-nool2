/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#061714',
          900: '#0B3029',
          850: '#0E372F',
          800: '#123F35',
          700: '#1B5347',
          600: '#266D5E',
        },
        gold: {
          300: '#FCE7A6',
          400: '#F3D382',
          500: '#E7B95B',
          600: '#C69A3B',
          700: '#9B7424',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F8F4E9',
          200: '#EAE3D2',
          300: '#D5CBBB',
        },
        siddha: {
          muted: '#8EA69A',
          border: 'rgba(231, 185, 91, 0.25)',
          glow: 'rgba(231, 185, 91, 0.15)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        tamil: ['"Noto Sans Tamil"', '"Latha"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(231, 185, 91, 0.12)',
        'gold-md': '0 0 25px rgba(231, 185, 91, 0.18)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
