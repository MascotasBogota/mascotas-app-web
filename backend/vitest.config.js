// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8', // Específica que use v8
      reporter: ['text', 'json', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.js',
        'coverage/',
        'server.js'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
