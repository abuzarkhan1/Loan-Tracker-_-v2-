/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        appBg: "var(--background)",
        appBgSoft: "var(--background-soft)",
        appCard: "var(--card)",
        appSurface: "var(--surface)",
        appInput: "var(--input)",
        appText: "var(--text)",
        appMuted: "var(--muted)",
        appPrimary: "var(--primary)",
        appPrimaryDark: "var(--primary-dark)",
        appSuccess: "var(--success)",
        appWarning: "var(--warning)",
        appDanger: "var(--danger)",
        appPeach: "var(--peach)",
        appMint: "var(--mint)",
        appYellow: "var(--yellow)",
        appBorder: "var(--border)",
        appPill: "var(--pill)",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px var(--shadow-color)",
        elevated: "0 12px 40px var(--shadow-color)",
      }
    },
  },
  plugins: [],
}
