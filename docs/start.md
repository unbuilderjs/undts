# Quick Start

undts is a TypeScript bundle tool that internally uses `rollup` + `rollup-plugin-dts`, enabling perfect support for tree-shaking `.d.ts` files! Additionally, this tool is very simple to use, requiring only a small configuration file.

## Installation

```bash
pnpm install -D undts
```

## Direct Use

Create a `build.ts` file in the root directory of your project and write the following content:

```ts
import { build } from 'undts'

build({
  // Define your entry file
  entry: [
    'src/index.ts',
  ]
})
```

Then run the following command, using `tsx` to directly execute the `build.ts` file:

```bash
pnpx tsx build.ts
```

After that, you can see the packaged `index.d.ts` file in the `dist` directory.

## Integration with rollup/esbuild/tsup/vite Library Mode

Thanks to the powerful `unplugin`, undts can seamlessly integrate with tools like `vite`, `rollup`, `esbuild`, etc. It automatically uses the `entry`/`input` options from the `vite`/`rollup`/`esbuild` configuration files as the `entry` option for `undts`.

<details>
<summary>Using with Vite Library Mode (Recommended)</summary>

```ts
// vite.config.ts
import undts from 'undts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // undts will automatically use this entry option, so you don't need to set it again in the plugin options
      entry: 'src/index.ts',
    },
  },

  plugins: [
    undts()
  ],
})
```
</details>
<details>
<summary>Using with Rollup + SWC</summary>

```js
// rollup.config.ts
import swc from '@rollup/plugin-swc'
import { defineConfig } from 'rollup'
import undts from 'undts/rollup'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },

  plugins: [
    swc(),
    // It will automatically use the input option as the entry option for undts
    undts(),
  ],
})
```

</details>
<details>
<summary>Using with tsup (tsup is a convenient packaging tool based on esbuild)</summary>

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'
import undts from 'undts/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  // Disable tsup's default dts generation and use undts instead (mentioning that tsup's dts generation is also based on rollup-plugin-dts)
  dts: false,
  sourcemap: true,
  esbuildPlugins: [
    // It will automatically use the entry option as the entry option for undts
    undts(),
  ],
})
```
</details>
