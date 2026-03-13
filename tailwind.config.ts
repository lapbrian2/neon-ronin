import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0f',
        charcoal: '#1a1a22',
        'warm-gray': '#3d3830',
        parchment: '#e8dfd0',
        cream: '#f2ebe0',
        mist: '#d4cec4',
        gold: '#c4a055',
        'blood-red': '#8c1a1a',
        accent: '#c83030',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Noto Serif JP', 'serif'],
        jp: ['Noto Serif JP', 'serif'],
      },
      fontSize: {
        hero: 'clamp(4rem, 10vw, 10rem)',
        chapter: 'clamp(2.5rem, 5vw, 5rem)',
        subheading: 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      letterSpacing: {
        display: '0.08em',
        wide: '0.2em',
      },
    },
  },
  plugins: [],
} satisfies Config
