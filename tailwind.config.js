/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        stone: '#B6B09F',
        linen: '#EAE4D5',
        chalk: '#F2F2F2',
        white: '#FFFFFF',
        lime: '#C8F135',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  corePlugins: {
    // Brand: square corners, no shadows — but keep utilities available; enforced via usage.
  },
  plugins: [],
}
