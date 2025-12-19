import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 This exposes the app to Docker
    port: 5173, // 👈 This locks the port
    strictPort: true, // 👈 This makes it crash if the port is taken (good for debugging)
    watch: {
      usePolling: true, // 👈 Required for Docker hot-reload on some Windows systems
    },
  },
});
