<div align="center">

<img src="https://github.com/unbuilderjs/undts/blob/v1/tsdef.svg?raw=true" width="100" height="100" />

# undts

Crazy d.ts files generator, supports `.vue`、`.svelte` and `.astro` files!

![npm](https://img.shields.io/npm/v/undts)
![commit-activity](https://img.shields.io/github/commit-activity/m/unbuilderjs/undts)
![last-commit](https://img.shields.io/github/last-commit/unbuilderjs/undts)

</div>

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
