import swc from '@rollup/plugin-swc'
import { defineConfig } from 'rollup'
import { undts } from 'undts'

export default defineConfig({
  input: 'src/index.ts',

  plugins: [
    swc(),
    undts.rollup(),
  ],

  output: {
    dir: 'dist',
  },
})
