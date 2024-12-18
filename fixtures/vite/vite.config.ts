import vue from '@vitejs/plugin-vue'
import undts from 'undts/vite'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    undts({}),
    unocss(),
  ],

  build: {
    ssr: true,
    lib: {
      entry: './src/index.ts',
      cssFileName: 'test',
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          dir: 'dist',
        },
        {
          format: 'cjs',
          dir: 'dist',
        },
        {
          format: 'iife',
          dir: 'dist',
          entryFileNames: 'test.iife.js',
          name: 'Test',
        },
        {
          format: 'umd',
          dir: 'dist',
          entryFileNames: 'test.umd.js',
          name: 'Test',
        },
      ],
    },
  },
})
