<div align="center">

<img src="https://github.com/unbuilderjs/undts/blob/v1/tsdef.svg?raw=true" width="100" height="100" />

# undts

Crazy d.ts files generator💥Supports multiple template languages!

English | [简体中文](https://github.com/unbuilderjs/undts/blob/v1/README.zh.md)

![npm](https://img.shields.io/npm/v/undts)
![commit-activity](https://img.shields.io/github/commit-activity/m/unbuilderjs/undts)
![last-commit](https://img.shields.io/github/last-commit/unbuilderjs/undts)

</div>

## What files can it bundle to become `d.ts`?

- [x] Normal `.ts`, `.tsx` files
- [x] `.vue` files, using `@vue/compiler-sfc`
- [x] `.svelte` files, using `svelte2tsx`
- [x] `.astro` files, using `@astrojs/compiler`
- [x] `.vine.ts` files, using `@vue-vine/compiler`

All special files can be disabled by options, just set like `vue: false`, `svelte: false`, etc.

> I will keep the configuration as simple as possible, just like tsup ⚡️

## Quick Start

```bash
pnpm install undts
```

Create a file in your project root directory:

```js
import { build } from 'undts'

build({
  entry: [
    // Add your entry files here
    './src/index.ts'
  ],

  // ... more options, you can see jsdoc in the source code
})
```

Then run this file with `node`/`tsx`/`ts-node`, for example:

```bash
pnpx tsx your-file.ts
```

It will generate d.ts file in `dist` directory by default. You can change the output directory by `outDir` option:

```js
build({
  entry: ['./src/index.ts'],
  outDir: './types', // default is './dist'
})
```

## Using with frameworks

Thanks to the powerful `unplugin`, undts can be used in combination with `vite`/`rollup`/`esbuild` with zero configuration, it will automatically using the `vite`/`rollup`/`esbuild` configuration file's `entry`/`input` option as the `entry` option of `undts`.

<details>
<summary>Using with Vite Lib mode</summary>

```ts
// vite.config.ts
import undts from 'undts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // undts will automatically use this entry, you don't need to set it again in plugin options
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
// rollup.config.mjs
import swc from '@rollup/plugin-swc'
import { defineConfig } from 'rollup'
import undts from 'undts/rollup'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },

  plugins: [
    swc(),
    // It will automatically use input option as the entry option of undts
    undts(),
  ],
})
```

</details>
<details>
<summary>Using with tsup（it powered by esbuild）</summary>

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'
import undts from 'undts/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  // Disable tsup's default dts generation, use undts instead
  dts: false,
  sourcemap: true,
  plugins: [
    // It will automatically use entry option as the entry option of undts
    undts(),
  ],
})
```
</details>

## Plugin

`undts`'s plugin system is extended from `rollup` and added some new hooks, you can use it to customize the behavior of `undts`.

- `dtsConfig`: This hook is called when starting call `build` function, you can modify the `undts`'s configuration by this hook.
- `transformInclude`: This hook is called when `undts` encounters a file that needs to be included in the cache bundle, you can use this hook to modify the file content before it is included in the cache bundle.
- `transformCallExpression`: This hook is called when `undts` encounters a TypeScript `CallExpression` node, the main purpose of this hook is to convert the `import()` function.
- `transformImportDeclaration/transformExportDeclaration`: These hooks are called when `undts` encounters a TypeScript `ImportDeclaration`/`ExportDeclaration` node, the main purpose of these hooks is to convert the `import`/`export` statement.
- `transformSourceFile`: This hook is called when `undts` encounters a TypeScript `SourceFile` instance, this hook will be called after all of the above hooks have been called.
- `writeCacheBundle`: This hook is called when `undts` writes the cache bundle to the disk, you can use this hook to modify the cache bundle before it is written to the disk. It enabled `bundled` option (default is enabled), the real cache bundle path will be delivered to `rollup`'s `input` option and transform by `rollup-plugin-dts` plugin.

## License & Author

[Naily Zero](https://github.com/groupguanfang) & MIT
