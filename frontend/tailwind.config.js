/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Or wherever your components are
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],  // Add this line
}