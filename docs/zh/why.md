# Why Do We Need undts?

Currently, many of the `.d.ts` generation methods available on npm are particularly inconvenient to use. There are several main approaches:

- Directly using TypeScript's `declaration` option to output `.d.ts` files, but this method does not support bundling `.d.ts` files into a single file, let alone supporting tree-shaking.
- Using `@microsoft/api-extractor`, but this tool is very complex to use.
- Using `dts-bundle-generator`, but this tool does not support tree-shaking in the generated `.d.ts` files.
- Using `rollup` + `rollup-plugin-dts`, this combination perfectly supports tree-shaking and is also the method used by `tsup` for generating `dts`. However, using it directly with `rollup` is still not very convenient, especially in terms of configuration. For example, configuring a Vue component library packaging requires setting up two `rollup` configurations, which is very troublesome:

```ts
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import vue from 'unplugin-vue/rollup'

export default defineConfig([
  // First configuration, for outputting JS files
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      vue(),
    ],
  },
  // Second configuration, for outputting d.ts files
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      // If you need support for Vue files, you need to use the unplugin-vue plugin again
      vue(),
      dts(),
    ],
  }
])
```

At the same time, you have to maintain two sets of `plugins` arrays, which is very troublesome. I couldn't stand it anymore, so I created the `undts` tool, which has built-in support for multiple templates (`.vue`, `.svelte`, `.astro`, `.vine.ts`, etc., and of course, `.ts` and `.tsx` too). You only need to configure one file, and it can also be used in conjunction with `rollup`, which is very convenient:

```ts
import { defineConfig } from 'rollup'
import { undts } from 'undts'
import vue from 'unplugin-vue/rollup'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    vue(),
    undts.rollup(),
  ],
})
```

Flattening a layer, it looks much more comfortable 😌. This tool can also be used on its own:

```ts
import { build } from 'undts'

build({
  entry: ['src/index.ts'],
})
```

It greatly facilitates the generation of `.d.ts` files while also supporting tree-shaking.
