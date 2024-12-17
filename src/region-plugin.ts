import type { Plugin } from './types'
import path from 'node:path'
import { cwd } from 'node:process'

export function RegionPlugin(enable?: false): Plugin {
  return {
    name: 'dts-region-plugin',
    writeCacheBundle(sourceFile, outputFilePath, outputFileText) {
      if (enable !== false)
        outputFileText = `// #region ${path.relative(cwd(), sourceFile.getFilePath())}\n${outputFileText}\n// #endregion\n`
      return [outputFilePath, outputFileText]
    },
  }
}
