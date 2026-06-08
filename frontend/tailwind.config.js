/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9D4EDD',
        secondary: '#3A86FF',
        accent: '#FB5607',
        success: '#06A77D',
        danger: '#D62828',
        warning: '#F77F00',
        bg: {
          primary: '#09090B',
          secondary: '#1A1A1E',
          tertiary: '#2D2D33',
          card: '#18181D',
          input: '#27272F',
          muted: '#52525B',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#D4D4D8',
          muted: '#A1A1A8',
        },
      },
    },
  },
  plugins: [],
};
