import type { SourceFile } from 'ts-morph'
import type { DTSBuildOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'

export type OutputFilePath = string
export type OutputFileText = string

export interface EmitWriteBundleContext {
  getProjectSourceFiles: () => SourceFile[]
  getCurrentOptions: () => DTSBuildOptions
  setCurrentOptions: (options: DTSBuildOptions) => void
}

export interface EmitPlugin {
  writeCacheBundle?: (
    this: EmitWriteBundleContext,
    sourceFile: SourceFile,
    outputFilePath: OutputFilePath,
    outputFileText: OutputFileText,
  ) => Promise<void> | void | [OutputFilePath, OutputFileText] | Promise<[OutputFilePath, OutputFileText]>
}

export interface EmitService {
  emit: (sourceFiles: SourceFile[]) => Promise<string[]>
}

export function useEmit(entrySourceFileInstances: SourceFile[], options: DTSBuildOptions): EmitService {
  const entryFilePaths = entrySourceFileInstances.map(entrySourceFile => entrySourceFile.getFilePath())

  return {
    async emit(projectSourceFiles): Promise<string[]> {
      const entryOutputFilePaths: string[] = []

      // 用双层 Promise.all 并发处理所有文件而非for循环，提高性能
      await Promise.all(projectSourceFiles.map(async (projectSourceFile) => {
        const outputFiles = projectSourceFile.getEmitOutput().getOutputFiles()

        await Promise.all(outputFiles.map(async (outputFile) => {
          let outputPath: string = outputFile.getFilePath()
          let outputText = outputFile.getText()

          if (entryFilePaths.includes(projectSourceFile.getFilePath()))
            entryOutputFilePaths.push(outputPath)
          await fs.promises.mkdir(path.dirname(outputPath), { recursive: true })

          // Run emit plugin
          for (const plugin of options.plugins || []) {
            if (plugin.writeCacheBundle) {
              const result = await plugin.writeCacheBundle.call({
                getProjectSourceFiles: () => projectSourceFiles,
                getCurrentOptions: () => options,
                setCurrentOptions: newOptions => options = newOptions,
              }, projectSourceFile, outputPath, outputText)
              if (result) {
                outputPath = result[0]
                outputText = result[1]
              }
            }
          }
          await fs.promises.writeFile(outputPath, outputText, 'utf-8')
        }))
      }))

      return entryOutputFilePaths
    },
  }
}
