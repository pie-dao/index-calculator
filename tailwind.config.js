module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
