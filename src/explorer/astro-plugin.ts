import type { Project, SourceFile } from 'ts-morph'
import type { EntryExplorerPlugin } from './explorer'
import fs from 'node:fs'
import path from 'node:path'
import { convertToTSX } from '@astrojs/compiler'

export interface AstroEntryExplorerPluginOptions {}

export function AstroEntryExplorerPlugin(): EntryExplorerPlugin {
  return {
    transformInclude(moduleSpecifier) {
      return moduleSpecifier.endsWith('.astro')
    },

    async transformExportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      const currentSourceFile = declaration.getSourceFile()

      if (!moduleSpecifier || !moduleSpecifier.endsWith('.astro'))
        return

      const filePath = path.resolve(path.dirname(currentSourceFile.getFilePath()), moduleSpecifier)
      if (!filePath.endsWith('.astro') || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
        return
      await transform(sourceFiles, filePath, declaration.getProject())
    },

    async transformImportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      const currentSourceFile = declaration.getSourceFile()

      if (!moduleSpecifier || !moduleSpecifier.endsWith('.astro'))
        return

      const filePath = path.resolve(path.dirname(currentSourceFile.getFilePath()), moduleSpecifier)
      if (!filePath.endsWith('.astro') || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
        return
      await transform(sourceFiles, filePath, declaration.getProject())
    },
  }
}

async function transform(
  sourceFiles: Set<SourceFile>,
  filePath: string,
  project: Project,
): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { code } = await convertToTSX(content, {
    filename: filePath,
    sourcemap: false,
  })

  const tsFilePath = filePath.replace(/\.astro$/, '.astro.ts')
  const sourceFile = project.createSourceFile(tsFilePath, code)
  sourceFiles.add(sourceFile)
}
