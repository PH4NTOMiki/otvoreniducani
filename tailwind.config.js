import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.svelte', './src/**/*.css'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

