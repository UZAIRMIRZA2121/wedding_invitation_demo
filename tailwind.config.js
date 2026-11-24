/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#faf6ee',
          100: '#f3ebd6',
          200: '#e7d5ab',
          300: '#d9bd7d',
          400: '#cba354',
          500: '#b88a38',
          600: '#9d6f2c',
          700: '#7e5426',
          800: '#674424',
          900: '#563821',
        },
        emerald: {
          950: '#0d1f14',
          900: '#162e20',
          850: '#1b3726',
          800: '#234631',
          700: '#2f5b41',
        },
        cream: {
          50: '#fffdf9',
          100: '#fdfbf5',
          200: '#f9f4ea',
          300: '#f3ecdc',
          400: '#e8dcbe',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        script: ['var(--font-vibes)', 'cursive'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
