import type { Project, SourceFile } from 'ts-morph'
import type { EntryExplorerPlugin } from './explorer'
import fs from 'node:fs'
import path from 'node:path'
import * as vueCompiler from '@vue/compiler-sfc'

export interface VueEntryExplorerPluginOptions {
  compiler?: typeof vueCompiler
}

export function VueEntryExplorerPlugin({ compiler = vueCompiler }: VueEntryExplorerPluginOptions = {}): EntryExplorerPlugin {
  return {
    transformInclude(moduleSpecifier) {
      return moduleSpecifier.endsWith('.vue')
    },

    transformExportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      const currentSourceFile = declaration.getSourceFile()

      if (!moduleSpecifier || !moduleSpecifier.endsWith('.vue'))
        return

      const filePath = path.resolve(path.dirname(currentSourceFile.getFilePath()), moduleSpecifier)
      if (!filePath.endsWith('.vue') || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
        return

      transform(sourceFiles, filePath, declaration.getProject())
    },

    transformImportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      const project = declaration.getProject()
      const currentSourceFile = declaration.getSourceFile()

      if (!moduleSpecifier || !moduleSpecifier.endsWith('.vue'))
        return

      const filePath = path.resolve(path.dirname(currentSourceFile.getFilePath()), moduleSpecifier)
      if (!filePath.endsWith('.vue') || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
        return

      transform(sourceFiles, filePath, project, compiler)
    },
  }
}

function transform(
  sourceFiles: Set<SourceFile>,
  filePath: string,
  project: Project,
  compiler = vueCompiler,
): void {
  const content = fs.readFileSync(filePath, 'utf-8')
  const sfc = compiler.parse(content)
  // 拿到`script`和`scriptSetup`，然后合并内容，生成新的`.vue.ts`文件。
  const { script, scriptSetup } = sfc.descriptor
  /** 最终合并好的`.vue.ts`文件内容。 */
  let finalScriptContent = ''
  /** 是否是TS文件。 */
  let isTS = false

  if (script) {
    finalScriptContent += script.content
    if (script.lang === 'ts' || script.lang === 'tsx')
      isTS = true
  }
  if (scriptSetup) {
    // scriptSetup需要通过compiler.compileScript编译。
    finalScriptContent += compiler.compileScript(sfc.descriptor, {
      id: 'xxx',
    }).content
    if (scriptSetup.lang === 'ts' || scriptSetup.lang === 'tsx')
      isTS = true
  }

  const vueSourceFile = project.createSourceFile(
    filePath.replace(/\.vue$/, isTS ? '.vue.ts' : '.vue.js'),
    finalScriptContent,
    { overwrite: true },
  )

  sourceFiles.add(vueSourceFile)
}
