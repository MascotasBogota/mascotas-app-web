// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Usa el entorno de Node.js para tus tests de backend
    globals: true, // Esto hace que 'vi', 'expect', 'describe', etc. estén disponibles globalmente
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov", "html"], // Formatos de reporte de cobertura
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.test.js",
        "coverage/",
        "server.js",
      ],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
