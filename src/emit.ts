import type { SourceFile } from 'ts-morph'
import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

export interface EmitService {
  emit: (sourceFiles: SourceFile[]) => Promise<string[]>
}

export function useEmit(entrySourceFileInstances: SourceFile[], regionComment?: false): EmitService {
  const entryFilePaths = entrySourceFileInstances.map(entrySourceFile => entrySourceFile.getFilePath())

  return {
    async emit(projectSourceFiles): Promise<string[]> {
      const entryOutputFilePaths: string[] = []

      // 用双层 Promise.all 并发处理所有文件而非for循环，提高性能
      await Promise.all(projectSourceFiles.map(async (projectSourceFile) => {
        const outputFiles = projectSourceFile.getEmitOutput().getOutputFiles()

        await Promise.all(outputFiles.map(async (outputFile) => {
          const outputPath = outputFile.getFilePath()
          if (entryFilePaths.includes(projectSourceFile.getFilePath()))
            entryOutputFilePaths.push(outputPath)

          await fs.promises.mkdir(path.dirname(outputPath), { recursive: true })
          let outputText = outputFile.getText()
          if (regionComment !== false)
            outputText = `// #region ${path.relative(cwd(), projectSourceFile.getFilePath())}\n${outputText}\n// #endregion\n`
          await fs.promises.writeFile(outputPath, outputText, 'utf-8')
        }))
      }))

      return entryOutputFilePaths
    },
  }
}
