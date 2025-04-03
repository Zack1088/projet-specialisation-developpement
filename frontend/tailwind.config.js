/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./register.html",
    "./login.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
