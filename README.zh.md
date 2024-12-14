<div align="center">

<img src="https://github.com/unbuilderjs/undts/blob/v1/tsdef.svg?raw=true" width="100" height="100" />

# undts

强大的 d.ts 文件打包器💥支持多种模板~

[English](./README.md) | 简体中文

![npm](https://img.shields.io/npm/v/undts)
![commit-activity](https://img.shields.io/github/commit-activity/m/unbuilderjs/undts)
![last-commit](https://img.shields.io/github/last-commit/unbuilderjs/undts)

</div>

## 它可以将哪些文件打包为 `d.ts`？

- [x] 普通的`.ts`，`.tsx`文件，直接由`tsc`转换
- [x] `.vue`文件，使用 `@vue/compiler-sfc`转换
- [x] `.svelte`文件，使用 `svelte2tsx`转换
- [x] `.astro`文件，使用`@astrojs/compiler`转换
- [x] `.vine.ts`文件，使用`@vue-vine/compiler`转换

所有特殊文件都可以通过选项快速禁用，只需设置为 `vue: false`，`svelte: false` 就行。

> 我会保持配置尽可能简单，就像 tsup 那样 ⚡️

## 快速开始

```bash
pnpm install undts
```

在项目根目录创建一个文件：

```js
import { build } from 'undts'

build({
  entry: [
    // 在这里添加你的入口文件
    './src/index.ts'
  ],

  // ... 更多选项，可以在源码中查看 jsdoc
})
```

## License & Author

[Naily Zero](https://github.com/groupguanfang) & MIT
