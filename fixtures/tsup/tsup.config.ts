import { defineConfig } from 'tsup'
import { undts } from 'undts/esbuild'
import unocss from 'unocss/postcss'
import vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  esbuildPlugins: [
    undts(),

    vue({
      style: {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        preprocessLang: 'less',
        postcssPlugins: [unocss()],
      },
    }),
  ],
})
