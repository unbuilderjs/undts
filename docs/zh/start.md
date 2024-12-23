# 快速开始

undts是一个TypeScript的bundle工具，内部使用了`rollup` + `rollup-plugin-dts`，因此它能完美支持`.d.ts`文件的tree-shaking！同时这个小工具使用起来也非常的简单，只需要配置一个小文件即可。

## 安装

```bash
pnpm install -D undts
```

## 直接使用

在项目根目录下创建一个`build.ts`文件，然后写入以下内容：

```ts
import { build } from 'undts'

build({
  // 定义你的入口文件
  entry: [
    'src/index.ts',
  ]
})
```

然后执行以下命令，这里使用了`tsx`来直接运行`build.ts`文件：

```bash
pnpx tsx build.ts
```

然后你就可以在`dist`目录下看到打包好的`index.d.ts`文件了。

## 与rollup/esbuild/tsup/vite库模式配合使用

感谢强大的`unplugin`，undts可以与`vite`/`rollup`/`esbuild`等工具无缝配合，它会自动使用`vite`/`rollup`/`esbuild`配置文件的`entry`/`input`选项作为`undts`的`entry`选项。

<details>
<summary>Vite 库模式下使用（推荐）</summary>

```ts
// vite.config.ts
import undts from 'undts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // undts会自动使用这个entry选项，你不需要在插件选项中再次设置
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
<summary>与Rollup + SWC一起使用</summary>

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
    // 它会自动使用input选项作为undts的entry选项
    undts(),
  ],
})
```

</details>
<details>
<summary>与 tsup 一起使用（tsup是基于esbuild的一个很方便的打包工具）</summary>

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'
import undts from 'undts/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  // 禁用tsup的默认dts生成，使用undts代替（提一嘴，其实tsup的dts生成也是基于rollup-plugin-dts的）
  dts: false,
  sourcemap: true,
  esbuildPlugins: [
    // 它会自动使用entry选项作为undts的entry选项
    undts(),
  ],
})
```
</details>
