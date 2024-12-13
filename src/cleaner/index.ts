import fs from 'node:fs'

export interface CleanerService {
  clean: () => void
  cacheCleaner: () => void
  outDirCleaner: () => void
}

export interface CleanerOptions {
  /**
   * Pre-bundled cache directory. You also can use `[outDir]` to replace the `outDir`.
   *
   * @default './[outDir]/.cache'
   */
  cacheDir?: string
  /** Clean the cache directory before and after the build. If set `false`, will disable the cleaner. */
  cleanCache?: false
  /** @default ./dist */
  outDir?: string
  /** Clean the output directory before the build. If set `false`, will disable the cleaner. */
  cleanOutDir?: false
}

export function useCleaner(cleanerOptions?: CleanerOptions): CleanerService
export function useCleaner({
  cacheDir = './[outDir]/.cache',
  outDir = './dist',
  cleanCache,
  cleanOutDir,
}: CleanerOptions = {}): CleanerService {
  cacheDir = cacheDir.replace(/\[outDir\]/g, outDir)

  function cacheCleaner(): void {
    if (cleanCache !== false) {
      fs.rmSync(cacheDir, { recursive: true, force: true })
    }
  }

  function outDirCleaner(): void {
    if (cleanOutDir !== false) {
      fs.rmSync(outDir, { recursive: true, force: true })
    }
  }

  function clean(): void {
    cacheCleaner()
    outDirCleaner()
  }

  return {
    clean,
    cacheCleaner,
    outDirCleaner,
  }
}
