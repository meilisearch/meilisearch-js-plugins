import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    include: ['{src,__tests__}/**/*.test.ts'],
    testTimeout: 100_000, // 100 seconds
  },
})
