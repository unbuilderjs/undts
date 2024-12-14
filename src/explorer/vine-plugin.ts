import type { EntryExplorerPlugin } from './explorer'
import * as vine from '@vue-vine/compiler'

export interface VineEntryExplorerPluginOptions {
  ssr?: boolean
}

export function VineEntryExplorerPlugin({ ssr = false }: VineEntryExplorerPluginOptions = {}): EntryExplorerPlugin {
  return {
    transformInclude(moduleSpecifier) {
      return moduleSpecifier.endsWith('.vine.ts') || moduleSpecifier.endsWith('.vine')
    },

    transformSourceFile(sourceFile) {
      let fullText = sourceFile.getFullText()
      const ctx = vine.createCompilerCtx()
      fullText = `/// <reference types="vue-vine/macros" />\n${fullText}`
      const transformResult = vine.compileVineTypeScriptFile(fullText, sourceFile.getFilePath(), {
        compilerHooks: {
          getCompilerCtx: () => ctx,
          onError: error => console.error(error),
          onWarn: warn => console.warn(warn),
        },
      }, ssr)
      const code = transformResult.fileMagicCode.toString()
      sourceFile.replaceWithText(code)
    },
  }
}
