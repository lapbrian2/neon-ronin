import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#08080F',
        night: '#0D0D2B',
        steel: '#1A1B3A',
        smoke: '#3A3F5C',
        ash: '#8B8FA3',
        light: '#E8E6E3',
        neon: {
          red: '#FF1744',
          cyan: '#00E5FF',
          amber: '#FFD740',
          violet: '#AA00FF',
        },
        ink: {
          black: '#1A1814',
          gray: '#4A4540',
          paper: '#E8DFD0',
          red: '#8B2500',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif JP', 'serif'],
      },
      fontSize: {
        hero: 'clamp(4rem, 10vw, 10rem)',
        chapter: 'clamp(2.5rem, 5vw, 5rem)',
        subheading: 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      letterSpacing: {
        display: '0.08em',
      },
    },
  },
  plugins: [],
} satisfies Config
