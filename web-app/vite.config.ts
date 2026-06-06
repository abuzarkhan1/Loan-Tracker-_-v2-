import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rolldownOptions: {
      output: {
        chunkFileNames: "assets/chunks/[name]-[hash].js",
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
            return "react-vendor";
          }
          if (id.includes("@tanstack") || id.includes("axios") || id.includes("zustand")) {
            return "data-vendor";
          }
          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts-vendor";
          }
          if (id.includes("lucide-react")) {
            return "icons-vendor";
          }
          return "vendor";
        },
      },
    },
  },
});
