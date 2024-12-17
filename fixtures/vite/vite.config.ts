import { undts } from 'undts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    undts.vite({}),
  ],

  build: {
    ssr: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
    },
  },
})
