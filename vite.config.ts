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
      // Register as PRE middleware so it runs before Vite's default middleware
      return {
        pre: [
          {
            handler: async (req, res, next) => {
              // Only handle API routes with Express
              if (req.url?.startsWith("/api/")) {
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
                return expressApp(req, res, next);
              }
              // Let other requests pass through
              next();
            },
            order: "pre" as const,
          },
        ],
      };
    },
  };
}
