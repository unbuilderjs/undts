import type { Node, Project, SourceFile } from 'ts-morph'
import type { EntryExplorerPlugin } from './explorer'
import fs from 'node:fs'
import path from 'node:path'
import { svelte2tsx } from 'svelte2tsx'

export type SvelteVersion = 'legacy' | 'runes'

export interface SvelteEntryExplorerPluginOptions {
  defaultVersion?: SvelteVersion
}

export function SvelteEntryExplorerPlugin({ defaultVersion = 'runes' }: SvelteEntryExplorerPluginOptions = {}): EntryExplorerPlugin {
  return {
    transformInclude(moduleSpecifier) {
      return moduleSpecifier.endsWith('.svelte')
    },

    transformExportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      const currentSourceFile = declaration.getSourceFile()
      if (!moduleSpecifier || !moduleSpecifier.endsWith('.svelte'))
        return
      transformer(declaration, sourceFiles, moduleSpecifier, currentSourceFile.getProject(), defaultVersion)
    },

    transformImportDeclaration(declaration, sourceFiles) {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      if (!moduleSpecifier || !moduleSpecifier.endsWith('.svelte'))
        return
      transformer(declaration, sourceFiles, moduleSpecifier, declaration.getProject(), defaultVersion)
    },

    transformCallExpression(callExpression, sourceFiles) {
      const moduleSpecifier = callExpression.getExpression().getText().replace(/['"`]/g, '')
      if (!moduleSpecifier || !moduleSpecifier.endsWith('.svelte'))
        return
      transformer(callExpression, sourceFiles, moduleSpecifier, callExpression.getProject(), defaultVersion)
    },
  }
}

function transformer(node: Node, sourceFiles: Set<SourceFile>, moduleSpecifier: string, project: Project, defaultVersion: SvelteVersion): void {
  const currentSourceFile = node.getSourceFile()

  if (!moduleSpecifier || !moduleSpecifier.endsWith('.svelte'))
    return

  const filePath = path.resolve(path.dirname(currentSourceFile.getFilePath()), moduleSpecifier)
  if (!filePath.endsWith('.svelte') || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
    return
  transform(sourceFiles, filePath, project, defaultVersion)
}

function transform(
  sourceFiles: Set<SourceFile>,
  filePath: string,
  project: Project,
  defaultVersion: SvelteVersion = 'runes',
): void {
  const content = fs.readFileSync(filePath, 'utf-8')
  const inlineCommentVersion: SvelteVersion | undefined = content.split('\n')
    .find((line): SvelteVersion | undefined => {
      if (line.includes('<reference undts-svelte="legacy" />'))
        return 'legacy'
      else if (line.includes('<reference undts-svelte="runes" />'))
        return 'runes'
      else return undefined
    }) as SvelteVersion | undefined

  const computedVersion = inlineCommentVersion || defaultVersion
  const tsContent = svelte2tsx(content, {
    mode: 'dts',
    filename: filePath,
    isTsFile: /<script\s[^>]*?lang=(?:'|")(?:ts|typescript)(?:'|")/.test(content),
    version: computedVersion === 'runes' ? '5.0.0' : '4.0.0',
  })

  if (computedVersion === 'runes') {
    tsContent.code = `/// <reference types="svelte2tsx/svelte-shims-v4.d.ts" />\n${tsContent.code}`
    tsContent.code = `/// <reference types="svelte2tsx/svelte-jsx.d.ts" />\n${tsContent.code}`
  }
  else if (computedVersion === 'legacy') {
    tsContent.code = `/// <reference types="svelte2tsx/svelte-shims.d.ts" />\n${tsContent.code}`
  }
  const tsFilePath = filePath.replace(/\.svelte$/, '.svelte.ts')
  const tsSourceFile = project.createSourceFile(
    tsFilePath,
    tsContent.code,
    { overwrite: true },
  )
  sourceFiles.add(tsSourceFile)
}
