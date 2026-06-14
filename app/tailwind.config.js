/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e2535',
          700: '#161b27',
          800: '#0f1117',
          900: '#080b10',
        },
      },
    },
  },
  plugins: [],
}
