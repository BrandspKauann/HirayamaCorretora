import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const disableCSPPlugin = (): Plugin => {
  return {
    name: "disable-csp",
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        if (typeof res.removeHeader === "function") {
          res.removeHeader("Content-Security-Policy");
          res.removeHeader("X-Content-Security-Policy");
          res.removeHeader("X-WebKit-CSP");
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/consorcio/",
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: false,
      hmr: {
        overlay: false,
      },
      headers: {
        "Content-Security-Policy":
          mode === "development"
            ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
            : undefined,
      },
    },
    build: {
      sourcemap: mode === "development" ? "inline" : false,
      minify: "esbuild",
      rollupOptions: {
        output: {
          format: "es",
        },
      },
    },
    plugins: [
      react(),
      ...(mode === "development" ? [disableCSPPlugin()] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      legalComments: "none",
      format: "esm",
    },
  };
});
