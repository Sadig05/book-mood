import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';


export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change this to any port you prefer

  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Ensure the path points correctly to "src"
      "@pages": path.resolve(__dirname, "src/pages"),
      "@api": path.resolve(__dirname, "src/api")
    },
  },
});
