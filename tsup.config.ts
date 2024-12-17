import { defineConfig } from 'tsup'
import { undts } from './src/esbuild'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    cli: './src/cli.ts',
    vite: './src/vite.ts',
    rollup: './src/rollup.ts',
    esbuild: './src/esbuild.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  plugins: [undts()],
})
