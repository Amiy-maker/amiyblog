import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  let expressApp: any;

  return {
    name: "express",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // Lazy-load the server on first request
          if (!expressApp) {
            try {
              const { createServer } = await import("./server/index.js");
              expressApp = createServer();
            } catch (error) {
              console.error("Failed to load Express server:", error);
              return res.status(500).json({
                error: "Server initialization failed",
                details: error instanceof Error ? error.message : String(error),
              });
            }
          }

          // Delegate to Express server
          expressApp(req, res, next);
        });
      };
    },
  };
}
