import type { CallExpression, SourceFile } from 'ts-morph'
import type { CompilerOptions } from 'typescript'
import type { EntryExplorerOptions } from './explorer'
import { resolveModuleName, sys } from 'typescript'

export interface DynamicImportExplorerOptions {}

export interface DynamicImportExplorerService {
  explore: (importDeclarations: CallExpression[]) => Promise<Set<SourceFile>>
}

export function useDynamicImportExplorer({ plugins = [] }: EntryExplorerOptions = {}): DynamicImportExplorerService {
  async function eachCallExpression(callExpression: CallExpression): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()
    const expression = callExpression.getExpression()
    if (!expression || expression.getText() !== 'import')
      return sourceFiles

    const currentSourceFile = callExpression.getSourceFile()
    const project = currentSourceFile.getProject()

    const callExpressionArgument = callExpression.getArguments()[0]
    if (!callExpressionArgument)
      return sourceFiles
    const moduleSpecifierValue = callExpressionArgument.getText().replace(/['"`]/g, '')
    const resolvedModule = resolveModuleName(
      moduleSpecifierValue,
      currentSourceFile.getFilePath(),
      currentSourceFile.getProject().getCompilerOptions() as CompilerOptions,
      sys,
    )
    if (resolvedModule.resolvedModule && !resolvedModule.resolvedModule.isExternalLibraryImport) {
      sourceFiles.add(project.addSourceFileAtPath(resolvedModule.resolvedModule.resolvedFileName))
      return sourceFiles
    }

    for (const plugin of plugins) {
      if (!plugin.transformInclude)
        continue
      const willTransform = plugin.transformInclude(moduleSpecifierValue)
      if (!willTransform)
        continue
      if (plugin.transformCallExpression)
        await plugin.transformCallExpression(callExpression, sourceFiles)
    }

    return sourceFiles
  }

  async function explore(callExpressions: CallExpression[]): Promise<Set<SourceFile>> {
    const sourceFiles = new Set<SourceFile>()

    for (const exportDeclaration of callExpressions) {
      const importedExplore = await eachCallExpression(exportDeclaration)
      importedExplore.forEach(sourceFilePath => sourceFiles.add(sourceFilePath))
    }

    return sourceFiles
  }

  return {
    explore,
  }
}
