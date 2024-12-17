import { defineConfig } from 'tsup'
import { undts } from 'undts/esbuild'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  esbuildPlugins: [undts({})],
})
