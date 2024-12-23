# 配置项

下面是所有可用的配置项，除了`entry`之外，其他配置项都是可选的。

## 基础配置

### entry

- 类型: `string[]`

指定需要打包的入口文件。只能指定具体的文件路径，`不能`为glob模式或者目录。

### include

- 类型: `string[] | undefined`

指定需要加入到打包器中的文件，当文件无法被插件扫描到并解析出依赖时会报错，此时可以通过修改`include`配置项来解决。

在这个配置项中，你可以使用`fast-glob`模式来匹配文件。

### ignore

- 类型: `string[] | undefined`
- 默认值: `node_modules`

指定`fast-glob`模式需要忽略的文件。

### projectOptions

- 类型: `ProjectOptions | undefined`

指定`ts-morph`项目的配置项。可以通过此修改`compilerOptions`等，默认情况下从当前项目中的`tsconfig.json`中读取。

### plugins

- 类型: `Plugin[] | undefined`

指定需要使用的rollup插件/undts插件。

### regionComment

- 类型: `false | undefined`

是否启用区域注释。默认情况下，插件会在打包后的文件中插入`#region`和`#endregion`注释，以便于在打包后的文件中查找源文件的位置。如果你不需要这个功能，可以将其设置为`false`。

如果你使用vscode，你可以看到vscode滚动条小地图中的区域注释效果：

<div align="center">

<img src="/mini-vscode-map.png" width="200" />

</div>

## 探索器配置

### vue

- 类型: `false | VueEntryExplorerPluginOptions | undefined`

指定内置`vue`插件的配置项。设置为`false`时关闭`vue`文件的解析。`VueEntryExplorerPluginOptions`的类型定义如下：

```ts
interface VueEntryExplorerPluginOptions {
  // 允许你自定义你想要使用哪个版本的@vue/compiler-sfc
  compiler?: typeof import('@vue/compiler-sfc')
}
```

### svelte

- 类型: `false | SvelteEntryExplorerPluginOptions | undefined`

指定内置`svelte`插件的配置项。设置为`false`时关闭`svelte`文件的解析。`SvelteEntryExplorerPluginOptions`的类型定义如下：

```ts
export type SvelteVersion = 'legacy' | 'runes'

interface SvelteEntryExplorerPluginOptions {
  // 允许你设置默认的svelte版本。
  defaultVersion?: SvelteVersion
}
```

:::tip

你也可以自定义每一个文件的svelte版本，只需要在文件的开头添加注释，比如这是使用传统svelte版本的文件：

```svelte
<script lang="ts">
/// <reference undts-svelte="legacy" />
</script>
```

这是使用svelte 5 runes版本的文件：

```svelte
<script lang="ts">
/// <reference undts-svelte="runes" />
</script>
```

:::

### astro

- 类型: `false | undefined`

设置为`false`时关闭`astro`文件的解析。

### vine

- 类型: `false | VineEntryExplorerPluginOptions | undefined`

指定内置`vue vine`插件的配置项。设置为`false`时关闭`vine.ts`文件的解析。`VineEntryExplorerPluginOptions`的类型定义如下：

```ts
interface VineEntryExplorerPluginOptions {
  ssr?: boolean
}
```

### css

- 类型: `'skip' | false | undefined`

如果项目中使用导入语句导入了这些文件：

`css`/`.scss`/`.sass`/`.less`/`.styl`/`.stylus`/`.pcss`/`.postcss`

可以指定此配置项为`skip`来跳过这些文件的`.d.ts`解析，否则会产生错误。此情况常出现在使用`vite库模式`打包时。

## 缓存与清理配置

### cacheDir

- 类型: `string | undefined`
- 默认值: `./[outDir]/.cache`

指定缓存的`.d.ts`文件目录的路径。默认情况下，插件会在`[outDir]`目录下创建`.cache`目录作为缓存目录。

### cleanCache

- 类型: `false | undefined`

如果设置为`false`，插件将不会在最后清理缓存目录。

:::warning

此外，如果程序不正常退出，缓存目录也不会被清理。

:::

### outDir

- 类型: `string | undefined`
- 默认值: `./dist`

指定打包后的文件输出目录。默认情况下，插件会将打包后的文件输出到`dist`目录下。

### cleanOutDir

- 类型: `false | undefined`

如果设置为`false`，插件将不会在打包前清理输出目录。
