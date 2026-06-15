/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d0e0f',
          surface: '#1f2020',
          'surface-higher': '#292a2a',
          border: '#383939',
          text: '#e3e2e2',
          'text-muted': '#b9ccb2',
          green: '#00e639',
          'green-bright': '#00ff41',
          red: '#ffb4ab',
        },
      },
      fontFamily: {
        heading: ['Geist', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
};
