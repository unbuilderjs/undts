import type { SvelteEntryExplorerPluginOptions } from './svelte-plugin'
import type { VueEntryExplorerPluginOptions } from './vue-plugin'
import { type CallExpression, type ExportDeclaration, type ImportDeclaration, type Project, type SourceFile, SyntaxKind } from 'ts-morph'
import { AstroEntryExplorerPlugin } from './astro-plugin'
import { useDynamicImportExplorer } from './dynamic-import'
import { useExportDeclarationExplorer } from './export-declaration'
import { useImportDeclarationExplorer } from './import-declaration'
import { SkipCSSPlugin } from './skip-css-plugin'
import { SvelteEntryExplorerPlugin } from './svelte-plugin'
import { VineEntryExplorerPlugin, type VineEntryExplorerPluginOptions } from './vine-plugin'
import { VueEntryExplorerPlugin } from './vue-plugin'

export type TransformType = 'ImportDeclaration' | 'ExportDeclaration'

export interface EntryExplorerPlugin {
  transformInclude?: (moduleSpecifier: string) => boolean
  transformImportDeclaration?: (
    importDeclaration: ImportDeclaration,
    sourceFiles: Set<SourceFile>,
  ) => void | Promise<void>
  transformExportDeclaration?: (
    exportDeclaration: ExportDeclaration,
    sourceFiles: Set<SourceFile>,
  ) => void | Promise<void>
  transformCallExpression?: (
    callExpression: CallExpression,
    sourceFiles: Set<SourceFile>,
  ) => void | Promise<void>
  transformSourceFile?: (sourceFile: SourceFile) => void | Promise<void>
}

export interface EntryExplorerOptions {
  plugins?: EntryExplorerPlugin[]
  /** If set `false`, will disable the vue. */
  vue?: false | VueEntryExplorerPluginOptions
  /** If set `false`, will disable the svelte. */
  svelte?: false | SvelteEntryExplorerPluginOptions
  astro?: false
  vine?: false | VineEntryExplorerPluginOptions
  css?: 'skip' | false
}

export interface EntryExplorerService {
  /**
   * Explore the entry files and add them to the project.
   *
   * @memberof EntryExplorerService
   * @param {SourceFile[]} entry - The entry source files to explore.
   */
  explore: (
    entries: SourceFile[],
    project: Project,
  ) => Promise<Set<SourceFile>>
}

export function useEntryExplorer(entryExplorerOptions?: EntryExplorerOptions): EntryExplorerService
export function useEntryExplorer({ plugins = [], vue, svelte, astro, vine, css }: EntryExplorerOptions = {}): EntryExplorerService {
  if (vine !== false)
    plugins.push(VineEntryExplorerPlugin(vine))
  if (vue !== false)
    plugins.push(VueEntryExplorerPlugin(vue))
  if (svelte !== false)
    plugins.push(SvelteEntryExplorerPlugin(svelte))
  if (astro !== false)
    plugins.push(AstroEntryExplorerPlugin())
  if (css !== false)
    plugins.push(SkipCSSPlugin(!css ? false : (css === 'skip')))

  const importDeclarationExplorer = useImportDeclarationExplorer({ plugins })
  const exportDeclarationExplorer = useExportDeclarationExplorer({ plugins })
  const dynamicImportExplorer = useDynamicImportExplorer({ plugins })

  async function explore(entries: SourceFile[], project: Project): Promise<Set<SourceFile>> {
    const sourceFilePaths = new Set<SourceFile>(project.getSourceFiles())

    for (const entry of entries) {
      const importDeclarations = entry.getImportDeclarations()
      const importedExplore = await importDeclarationExplorer.explore(importDeclarations)
      sourceFilePaths.add(entry)
      importedExplore.forEach(sourceFilePath => sourceFilePaths.add(sourceFilePath))

      const exportDeclarations = entry.getExportDeclarations()
      const exportedExplore = await exportDeclarationExplorer.explore(exportDeclarations)
      sourceFilePaths.add(entry)
      exportedExplore.forEach(sourceFilePath => sourceFilePaths.add(sourceFilePath))

      const dynamicImports = entry.getDescendantsOfKind(SyntaxKind.CallExpression)
      const dynamicImportExplore = await dynamicImportExplorer.explore(dynamicImports)
      sourceFilePaths.add(entry)
      dynamicImportExplore.forEach(sourceFilePath => sourceFilePaths.add(sourceFilePath))
    }

    for (const plugin of plugins) {
      for (const sourceFile of sourceFilePaths) {
        if (plugin.transformInclude && plugin.transformInclude(sourceFile.getFilePath()) && plugin.transformSourceFile)
          await plugin.transformSourceFile(sourceFile)
      }
    }

    return sourceFilePaths
  }

  return {
    explore,
  }
}
