import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/moloni': {
        target: 'https://api.moloni.pt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moloni/, ''),
      },
      '/sap': {
        target: 'https://s53.gb.ucc.cit.tum.de/sap/opu/odata/sap',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sap/, ''),
      },
    },
  },
});