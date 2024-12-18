import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    cli: './src/cli.ts',
    vite: './src/vite.ts',
    rollup: './src/rollup.ts',
    esbuild: './src/esbuild.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
})
