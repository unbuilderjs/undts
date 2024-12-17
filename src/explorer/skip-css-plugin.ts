import type { EntryExplorerPlugin } from './explorer'
import path from 'node:path'

export function SkipCSSPlugin(enable: boolean = true): EntryExplorerPlugin {
  return {
    transformInclude(moduleSpecifier) {
      return moduleSpecifier.endsWith('.css')
        || moduleSpecifier.endsWith('.scss')
        || moduleSpecifier.endsWith('.sass')
        || moduleSpecifier.endsWith('.less')
        || moduleSpecifier.endsWith('.styl')
        || moduleSpecifier.endsWith('.stylus')
        || moduleSpecifier.endsWith('.pcss')
        || moduleSpecifier.endsWith('.postcss')
    },

    transformImportDeclaration(importDeclaration, sourceFiles) {
      if (!enable)
        return
      const sourceFile = importDeclaration.getSourceFile()
      const project = sourceFile.getProject()
      const value = importDeclaration.getModuleSpecifierValue()
      let newSourceFilePath = path.resolve(path.dirname(sourceFile.getFilePath()), value)
      if (newSourceFilePath.endsWith('/')) {
        newSourceFilePath = newSourceFilePath.slice(0, -1)
        newSourceFilePath = `${newSourceFilePath}.ts`
      }
      else {
        newSourceFilePath = `${newSourceFilePath}.tsx`
      }
      const newSourceFile = project.createSourceFile(newSourceFilePath, '', { overwrite: true })
      sourceFiles.add(newSourceFile)
      importDeclaration.setModuleSpecifier(newSourceFilePath)
    },
  }
}
