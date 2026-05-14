/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#14110d",
        paper: "#f4efe6",
        "paper-warm": "#ebe4d6",
        accent: "#1a6b6b",
        "accent-dark": "#0f4d4d",
        moss: "#3a4a32",
        stone: "#8a8276",
        line: "#d8cfbf",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
