<div align="center">

<img src="https://github.com/unbuilderjs/undts/blob/v1/tsdef.svg?raw=true" width="100" height="100" />

# undts

Crazy d.ts files generator💥Supports multiple template languages!

English | [简体中文](./README.zh.md)

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

## License & Author

[Naily Zero](https://github.com/groupguanfang) & MIT
