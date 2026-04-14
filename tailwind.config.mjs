/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
    "./apps/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
    "../fachada-core/src/**/*.{astro,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
      },
    },
  },
  plugins: [],
};
