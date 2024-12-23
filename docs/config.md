# Configuration Options

Below are all the available configuration options. Except for `entry`, all other configuration options are optional.

## Basic Configuration

### entry

- Type: `string[]`

Specifies the entry files to be packaged. Only specific file paths can be specified, and it cannot use glob patterns or directories.

### include

- Type: `string[] | undefined`

Specifies the files to be included in the packager. If a file cannot be scanned by a plugin and its dependencies resolved, an error will be thrown. In such cases, you can modify the `include` configuration to resolve this.

In this configuration, you can use `fast-glob` patterns to match files.

### ignore

- Type: `string[] | undefined`
- Default value: `node_modules`

Specifies the files to ignore using `fast-glob` patterns.

### projectOptions

- Type: `ProjectOptions | undefined`

Specifies the configuration options for the `ts-morph` project. You can modify `compilerOptions` and more. By default, it reads from the `tsconfig.json` of the current project.

### plugins

- Type: `Plugin[] | undefined`

Specifies the rollup plugins/undts plugins to be used.

### regionComment

- Type: `false | undefined`

Enables region comments. By default, the plugin inserts `#region` and `#endregion` comments in the packaged files to help locate the source files. If you do not need this feature, you can set it to `false`.

If you use vscode, you can see the effect of region comments in the vscode scrollbar minimap:

<div align="center">

<img src="/mini-vscode-map.png" width="200" />

</div>

## Explorer Configuration

### vue

- Type: `false | VueEntryExplorerPluginOptions | undefined`

Specifies the configuration for the built-in `vue` plugin. Set to `false` to disable parsing of `vue` files. The type definition for `VueEntryExplorerPluginOptions` is as follows:

```ts
interface VueEntryExplorerPluginOptions {
  // Allows you to customize which version of @vue/compiler-sfc you want to use
  compiler?: typeof import('@vue/compiler-sfc')
}
```

### svelte

- Type: `false | SvelteEntryExplorerPluginOptions | undefined`

Specifies the configuration for the built-in `svelte` plugin. Set to `false` to disable parsing of `svelte` files. The type definition for `SvelteEntryExplorerPluginOptions` is as follows:

```ts
export type SvelteVersion = 'legacy' | 'runes'

interface SvelteEntryExplorerPluginOptions {
  // Allows you to set the default version of Svelte.
  defaultVersion?: SvelteVersion
}
```

:::tip

You can also customize the Svelte version for each file by adding a comment at the beginning of the file, such as this file using the traditional Svelte version:

```svelte
<script lang="ts">
/// <reference undts-svelte="legacy" />
</script>
```

This is a file using Svelte 5 runes version:

```svelte
<script lang="ts">
/// <reference undts-svelte="runes" />
</script>
```

:::

### astro

- Type: `false | undefined`

Set to `false` to disable parsing of `astro` files.

### vine

- Type: `false | VineEntryExplorerPluginOptions | undefined`

Specifies the configuration for the built-in `vue vine` plugin. Set to `false` to disable parsing of `vine.ts` files. The type definition for `VineEntryExplorerPluginOptions` is as follows:

```ts
interface VineEntryExplorerPluginOptions {
  ssr?: boolean
}
```

### css

- Type: `'skip' | false | undefined`

If your project imports these files using import statements:

`css`/`.scss`/`.sass`/`.less`/`.styl`/`.stylus`/`.pcss`/`.postcss`

You can set this configuration to `skip` to bypass the `.d.ts` parsing of these files, otherwise, it will generate errors. This often occurs when using `vite library mode` for packaging.

## Cache and Cleanup Configuration

### cacheDir

- Type: `string | undefined`
- Default value: `./[outDir]/.cache`

Specifies the path for the directory of cached `.d.ts` files. By default, the plugin creates a `.cache` directory under the `[outDir]` as the cache directory.

### cleanCache

- Type: `false | undefined`

If set to `false`, the plugin will not clean up the cache directory at the end.

:::warning

Moreover, if the program exits abnormally, the cache directory will not be cleaned.

:::

### outDir

- Type: `string | undefined`
- Default value: `./dist`

Specifies the output directory for the packaged files. By default, the plugin outputs the packaged files to the `dist` directory.

### cleanOutDir

- Type: `false | undefined`

If set to `false`, the plugin will not clean the output directory before packaging.
