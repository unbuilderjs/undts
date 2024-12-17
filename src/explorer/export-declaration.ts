import type { ExportDeclaration, SourceFile } from 'ts-morph'
import type { EntryExplorerOptions } from './explorer'

export interface ExportDeclarationExplorerService {
  explore: (exportDeclarations: ExportDeclaration[]) => Promise<Set<SourceFile>>
}

export function useExportDeclarationExplorer(ExportDeclarationExplorerOptions?: EntryExplorerOptions): ExportDeclarationExplorerService
export function useExportDeclarationExplorer({ plugins = [] }: EntryExplorerOptions = {}): ExportDeclarationExplorerService {
  async function eachExportDeclaration(exportDeclaration: ExportDeclaration): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()
    const moduleSpecifierSourceFile = exportDeclaration.getModuleSpecifierSourceFile()
    if (moduleSpecifierSourceFile && !moduleSpecifierSourceFile.isInNodeModules()) {
      sourceFiles.add(moduleSpecifierSourceFile)
      const importedExplore = await explore(moduleSpecifierSourceFile.getExportDeclarations())
      importedExplore.forEach(sourceFilePath => sourceFiles.add(sourceFilePath))
    }

    for (const plugin of plugins) {
      const moduleSpecifierValue = exportDeclaration.getModuleSpecifierValue()
      if (!moduleSpecifierValue)
        continue
      if (!plugin.transformInclude)
        continue
      const willTransform = plugin.transformInclude(moduleSpecifierValue)
      if (!willTransform)
        continue
      if (plugin.transformExportDeclaration)
        await plugin.transformExportDeclaration(exportDeclaration, sourceFiles)
    }

    return sourceFiles
  }

  async function explore(exportDeclarations: ExportDeclaration[]): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()

    for (const exportDeclaration of exportDeclarations) {
      const importedExplore = await eachExportDeclaration(exportDeclaration)
      importedExplore.forEach(sourceFilePath => sourceFiles.add(sourceFilePath))
    }

    return sourceFiles
  }

  return {
    explore,
  }
}
