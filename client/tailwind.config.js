/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      colors: {
        ink: '#102027',
        mist: '#eef6f8',
        sea: '#0f766e',
        amber: '#f59e0b',
        coral: '#f97316'
      },
      boxShadow: {
        card: '0 20px 40px rgba(15, 118, 110, 0.12)'
      }
    }
  },
  plugins: []
};
