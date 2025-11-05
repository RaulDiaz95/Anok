
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/Anoktest-web/",
  server: { port: 5173 },
  preview: { port: 5173 },
});
