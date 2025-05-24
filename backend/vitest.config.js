// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Usa el entorno de Node.js para tus tests de backend
    include: ["**/tests/**/*.test.js"], // Patrón para tus archivos de prueba
    globals: true, // Esto hace que 'vi', 'expect', 'describe', etc. estén disponibles globalmente
    coverage: {
      reporter: ["text", "json", "html"], // Formatos de reporte de cobertura
      include: ["controllers/**/*.js", "models/**/*.js", "routes/**/*.js"], // Archivos a incluir en la cobertura
    },
  },
});
