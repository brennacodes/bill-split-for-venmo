/** @type {import('tailwindcss').Config} */

// daisyUI config: https://daisyui.com/docs/config/
export default {
  content: ['./src/**/*.{svelte,js,html,css,json}'],
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'light-green': '#85FFA5',
      'spring-green': '#00FF87',
      'sky-blue': '#07c8f9',
      'electric-blue': '#60EFFF',
      'powder-pink': '#FF9C9C',
      'bittersweet': '#ff5858',
      'pollen': '#FFF95B',
      'yellow': '#f3f520',
      'light-orange': '#FF7E2E',
      'pumpkin': '#EB6424',
      'platinum': '#E3E3E3',
      'silver': '#A4A4A4',
      'slate': '#262627',
      'onyx': '#373841',
      'raisin-black': '#1c1c21',
      'pitch': '#131316',
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
