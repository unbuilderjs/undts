# 插件

undts像vite那样扩展了`rollup`优秀的插件系统，在它的基础上提供了几个基于`ts-morph`的钩子，以便于以后新的类似`vue`/`astro`/`svelte`这种拥有自己的编译器的框架能够更好的集成。

## dtsConfig

这个钩子在调用`build`函数时被调用，可以通过这个钩子修改undts的配置。函数签名如下：

```ts
interface DtsConfigHook {
  (options: DTSBuildOptions): void | Promise<void> | DTSBuildOptions | Promise<DTSBuildOptions>
}
```

## transformInclude

如果某个`id`你想要被`transform`开头的钩子处理，那么就返回`true`，否则返回`false`。默认情况下如果没有声明这个钩子，那么所有的`id`都会被本插件的`transformXXX`钩子处理。函数签名如下：

```ts
interface TransformIncludeHook {
  (moduleSpecifier: string): boolean
}
```

## transformImportDeclaration

这个钩子在`transform`钩子处理`import`语句时被调用，可以通过这个钩子修改和处理`import`语句。函数签名如下：

```ts
interface TransformImportDeclarationHook {
  (importDeclaration: ImportDeclaration, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformExportDeclaration

这个钩子在`transform`钩子处理`export`语句时被调用，可以通过这个钩子修改和处理`export`语句。函数签名如下：

```ts
interface TransformExportDeclarationHook {
  (exportDeclaration: ExportDeclaration, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformCallExpression

这个钩子在`transform`钩子处理`CallExpression`时被调用，一般用来修改和处理`dynamic import`。函数签名如下：

```ts
interface TransformCallExpressionHook {
  (callExpression: CallExpression, sourceFiles: Set<SourceFile>): void | Promise<void>
}
```

## transformSourceFile

这个钩子在上面的`所有transform钩子处理完毕`后被调用，可以通过这个钩子修改和处理`sourceFile`。函数签名如下：

```ts
interface TransformSourceFileHook {
  (sourceFile: SourceFile): void | Promise<void>
}
```

## writeCacheBundle

这个钩子会在写入每一个没有被`bundle`的文件时被调用，该函数签名如下：

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

如果此钩子拥有返回值，那么返回值必须是一个元组，第一个元素是`outputFilePath`，第二个元素是`outputFileText`；该元组会覆盖`outputFilePath`和`outputFileText`的值。
