import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Ensure the path points correctly to "src"
      "@pages": path.resolve(__dirname, "src/pages"),
      "@api": path.resolve(__dirname, "src/api")
    },
  },
});
