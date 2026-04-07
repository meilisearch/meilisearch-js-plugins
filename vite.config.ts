/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    projects: ['packages/*'],
    fileParallelism: false,
  },
})
