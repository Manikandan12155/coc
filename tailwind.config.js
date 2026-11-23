/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatBg: '#212121',
        chatCard: '#2f2f2f',
        chatHover: '#383838',
        chatBorder: 'rgba(255, 255, 255, 0.1)',
        chatText: '#ECECEC',
        chatMuted: '#9B9B9B',
      }
    },
  },
  plugins: [],
}

