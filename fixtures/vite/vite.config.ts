import vue from '@vitejs/plugin-vue'
import undts from 'undts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    undts({}),
  ],

  build: {
    ssr: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
    },
  },
})
