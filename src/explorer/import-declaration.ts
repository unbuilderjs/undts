import type { ImportDeclaration, SourceFile } from 'ts-morph'
import type { EntryExplorerOptions } from './explorer'

export interface ImportDeclarationExplorerService {
  explore: (importDeclarations: ImportDeclaration[]) => Promise<Set<SourceFile>>
}

export function useImportDeclarationExplorer(ImportDeclarationExplorerOptions?: EntryExplorerOptions): ImportDeclarationExplorerService
export function useImportDeclarationExplorer({ plugins = [] }: EntryExplorerOptions = {}): ImportDeclarationExplorerService {
  async function eachImportDeclaration(importDeclaration: ImportDeclaration): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()
    const moduleSpecifierSourceFile = importDeclaration.getModuleSpecifierSourceFile()
    if (moduleSpecifierSourceFile && !moduleSpecifierSourceFile.isInNodeModules()) {
      sourceFiles.add(moduleSpecifierSourceFile)
      const importedExplore = await explore(moduleSpecifierSourceFile.getImportDeclarations())
      importedExplore.forEach(sourceFilePath => sourceFiles.add(sourceFilePath))
    }

    for (const plugin of plugins) {
      if (!plugin.transformInclude)
        continue
      const willTransform = plugin.transformInclude(importDeclaration.getModuleSpecifierValue())
      if (!willTransform)
        continue
      if (plugin.transformImportDeclaration)
        await plugin.transformImportDeclaration(importDeclaration, sourceFiles)
    }

    return sourceFiles
  }

  async function explore(importDeclarations: ImportDeclaration[]): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()

    for (const importDeclaration of importDeclarations) {
      const importedExplore = await eachImportDeclaration(importDeclaration)
      importedExplore.forEach(sourceFilePath => sourceFiles.add(sourceFilePath))
    }

    return sourceFiles
  }

  return {
    explore,
  }
}
