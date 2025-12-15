/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'christmas-red': {
          DEFAULT: '#c41e3a',
          dark: '#8b0000',
          light: '#dc143c',
        },
        'christmas-green': {
          DEFAULT: '#165B33',
          dark: '#0f3d22',
          light: '#1e7b46',
        },
        'christmas-gold': {
          DEFAULT: '#FFD700',
          dark: '#DAA520',
          light: '#FFE55C',
        },
      },
    },
  },
  plugins: [],
}
