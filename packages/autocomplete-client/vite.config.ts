/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['{src,__tests__}/**/*.test.ts'],
    testTimeout: 100_000, // 100 seconds
  },
})
