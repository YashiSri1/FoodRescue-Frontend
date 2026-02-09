module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        dark: '#2c3e50',
        light: '#ecf0f1'
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
