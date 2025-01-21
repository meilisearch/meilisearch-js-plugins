const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

// https://vite.dev/config/
module.exports = defineConfig({
  server: { port: 5174, strictPort: true },
  plugins: [react()],
});
