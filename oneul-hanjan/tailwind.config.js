/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bar: {
          bg: '#161009',
          bg2: '#1f160e',
          card: '#241a11',
          border: '#3c2c1c',
          amber: '#cf9a44',
          amberdim: '#8a6a37',
          gold: '#b99461',
          burgundy: '#7a2e37',
          ivory: '#f1e6d2',
          ivorydim: '#c9bba2',
        },
      },
      fontFamily: {
        display: ['"Noto Serif KR"', 'serif'],
        body: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(207, 154, 68, 0.12)',
      },
    },
  },
  plugins: [],
};
