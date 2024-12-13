import type { SourceFile } from 'ts-morph'
import fs from 'node:fs'
import path from 'node:path'

export interface EmitService {
  emit: (sourceFiles: SourceFile[]) => Promise<string[]>
}

export function useEmit(): EmitService {
  return {
    async emit(projectSourceFiles): Promise<string[]> {
      const entryOutputFilePaths: string[] = []

      // 用双层 Promise.all 并发处理所有文件而非for循环，提高性能
      await Promise.all(projectSourceFiles.map(async (projectSourceFile) => {
        const outputFiles = projectSourceFile.getEmitOutput().getOutputFiles()

        await Promise.all(outputFiles.map(async (outputFile) => {
          const originalFilepath = outputFile.getFilePath()
          const replacedFilePath = originalFilepath.replace(/\.d\.ts$/, '.ts') as ReturnType<typeof outputFile.getFilePath>
          if (originalFilepath.endsWith('.d.ts'))
            entryOutputFilePaths.push(replacedFilePath)
          await fs.promises.mkdir(path.dirname(replacedFilePath), { recursive: true })
          await fs.promises.writeFile(replacedFilePath, outputFile.getText(), 'utf-8')
        }))
      }))

      return entryOutputFilePaths
    },
  }
}
