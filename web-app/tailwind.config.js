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
        appTextSecondary: "var(--text-secondary)",
        appMuted: "var(--muted)",
        appPrimary: "var(--primary)",
        appPrimaryHover: "var(--primary-hover)",
        appSecondary: "var(--secondary)",
        appSuccess: "var(--success)",
        appWarning: "var(--warning)",
        appDanger: "var(--danger)",
        appBorder: "var(--border)",
        appPill: "var(--pill)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        code: ["Fira Code", "monospace"],
      },
      boxShadow: {
        level1: "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        level2: "0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.06)",
        level3: "0 12px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
        soft: "0 2px 4px var(--shadow-color), 0 1px 2px var(--shadow-color)",
        elevated: "0 12px 24px var(--shadow-color-strong), 0 4px 8px var(--shadow-color)",
      }
    },
  },
  plugins: [],
}
