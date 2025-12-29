/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lcd: {
          bg: '#e5e5e0',
          text: '#222222',
          'text-secondary': '#666666',
          border: '#999999',
        },
        accent: {
          blue: '#0066cc',
          green: '#22c55e',
          red: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
