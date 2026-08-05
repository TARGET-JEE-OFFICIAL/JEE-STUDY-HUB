import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying to GitHub Pages at https://<user>.github.io/<repo>/,
  // uncomment the next line and replace <repo> with your repository name.
  // base: "/<repo>/",
});
