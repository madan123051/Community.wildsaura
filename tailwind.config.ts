import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wa-bg': '#0b0c0e',
        'wa-card': '#16181c',
        'wa-border': '#262a31',
        'wa-gold': '#d4a373',
        'wa-gold-light': '#e9c46a',
        'wa-teal': '#4ECDC4',
        'wa-text': '#e4e4e7',
        'wa-muted': '#8a8f98',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
