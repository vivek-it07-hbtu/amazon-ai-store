/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          blue: '#131921',
          light: '#232F3E',
          yellow: '#FEBD69',
          orange: '#FF9900',
        },
      },
    },
  },
  plugins: [],
}
