import type { DTSBuildOptions } from './types'
import glob from 'fast-glob'
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from 'ts-morph'
import * as ts from 'typescript'
import { useBundler } from './bundler'
import { useCleaner } from './cleaner'
import { useEmit } from './emit'
import { useEntryExplorer } from './explorer'

export async function build(options?: DTSBuildOptions): Promise<void>
export async function build({
  entry = [],
  include = [],
  ignore = [],
  projectOptions,
  cacheDir = './[outDir]/.cache',
  outDir = './dist',
  bundled,
  ...extraOptions
}: DTSBuildOptions = {}): Promise<void> {
  cacheDir = cacheDir.replace(/\[outDir\]/g, outDir)

  const project = new Project({
    ...projectOptions,
    defaultCompilerOptions: {
      ...(projectOptions || {}).defaultCompilerOptions || {},
      declaration: true,
      emitDeclarationOnly: true,
      jsx: ts.JsxEmit.Preserve,
      moduleResolution: ModuleResolutionKind.Bundler,
      module: ModuleKind.ES2022,
      target: ScriptTarget.ES2022,
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      allowJs: true,
      outDir: bundled === false ? outDir : cacheDir,
    },
  })

  const includedFiles = glob.globSync(include, {
    absolute: true,
    onlyFiles: true,
    ignore: ignore ? ['**/node_modules/**'] : undefined,
  })
  includedFiles.forEach(file => project.addSourceFileAtPath(file))

  const cleaner = useCleaner({ cacheDir, outDir, ...extraOptions })
  const explorer = useEntryExplorer(extraOptions)
  const entrySourceFileInstances = entry.map(entry => project.addSourceFileAtPath(entry))
  const exploredSourceFiles = await explorer.explore(entrySourceFileInstances, project)

  cleaner.clean()
  await Promise.all([...exploredSourceFiles].map(file => file.emit()))
  const emitted = await useEmit().emit(entrySourceFileInstances)

  if (bundled === false)
    return undefined

  const bundler = await useBundler({
    emitted,
    outDir,
    ...extraOptions,
  })
  await bundler.write()
  cleaner.cacheCleaner()
}
