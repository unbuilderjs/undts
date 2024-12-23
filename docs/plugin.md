# Plugins

Like Vite, undts extends the excellent plugin system of Rollup, providing several hooks based on `ts-morph` to facilitate better integration with future frameworks like `vue`, `astro`, and `svelte` that have their own compilers.

## dtsConfig

This hook is called when the `build` function is invoked, allowing you to modify undts's configuration through this hook. The function signature is as follows:

```ts
interface DtsConfigHook {
  (options: DTSBuildOptions): void | Promise<void> | DTSBuildOptions | Promise<DTSBuildOptions>
}
```

## transformInclude

If you want a certain `id` to be processed by hooks starting with `transform`, then return `true`, otherwise return `false`. By default, if this hook is not declared, all `ids` will be processed by this plugin's `transformXXX` hooks. The function signature is as follows:

```ts
interface TransformIncludeHook {
  (moduleSpecifier: string): boolean
}
```

## transformImportDeclaration

This hook is called when the `transform` hook processes an `import` statement, allowing you to modify and handle `import` statements through this hook. The function signature is as follows:

```ts
interface TransformImportDeclarationHook {
  (importDeclaration: ImportDeclaration, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformExportDeclaration

This hook is called when the `transform` hook processes an `export` statement, allowing you to modify and handle `export` statements through this hook. The function signature is as follows:

```ts
interface TransformExportDeclarationHook {
  (exportDeclaration: ExportDeclaration, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformCallExpression

This hook is called when the `transform` hook processes a `CallExpression`, typically used to modify and handle `dynamic imports`. The function signature is as follows:

```ts
interface TransformCallExpressionHook {
  (callExpression: CallExpression, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformSourceFile

This hook is called after all the above `transform` hooks have completed processing, allowing you to modify and handle the `sourceFile` through this hook. The function signature is as follows:

```ts
interface TransformSourceFileHook {
  (sourceFile: SourceFile): void | Promise<void>
}
```

## writeCacheBundle

This hook is called when writing each file that has not been bundled. The function signature is as follows:

```ts
export interface EmitWriteBundleContext {
  getProjectSourceFiles: () => SourceFile[]
  getCurrentOptions: () => DTSBuildOptions
  setCurrentOptions: (options: DTSBuildOptions) => void
}

interface WriteCacheBundleHook {
  writeCacheBundle?: (
    this: EmitWriteBundleContext,
    sourceFile: SourceFile,
    outputFilePath: string,
    outputFileText: string,
  ) => Promise<void> | void | [string, string] | Promise<[string, string]>
}
```

If this hook returns a value, the return must be a tuple where the first element is `outputFilePath` and the second is `outputFileText`; this tuple will override the values of `outputFilePath` and `outputFileText`.
