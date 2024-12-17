import type { InputOption } from 'rollup'
import type { UnpluginFactory } from 'unplugin'
import type { DTSBuildOptions } from './types'
import { createUnplugin } from 'unplugin'
import { build } from './build'

function getInput(input?: InputOption): string[] {
  return (Array.isArray(input)
    ? input
    : typeof input === 'object'
      ? Object.values(input)
      : [input]).filter(Boolean) as string[]
}

function getEsbuildInput(entryPoints?: string[] | Record<string, string> | { in: string, out: string }[]): string[] | undefined {
  if (Array.isArray(entryPoints)) {
    const entries: string[] = []
    for (const entry of entryPoints) {
      if (typeof entry === 'string')
        entries.push(entry)
      else if (typeof entry === 'object')
        entries.push(entry.in)
    }
    return entries
  }
  return typeof entryPoints === 'object' ? Object.values(entryPoints) : undefined
}

export const unplugin: UnpluginFactory<DTSBuildOptions> = (dtsOptions = {}) => {
  return {
    name: 'unplugin-undts',

    esbuild: {
      config(options) {
        const entries = getEsbuildInput(options.entryPoints)
        build({
          entry: dtsOptions.entry || entries,
          ...dtsOptions,
        })
      },
    },

    vite: {
      configResolved(config) {
        const rollupEntry = config.build?.rollupOptions?.input
        const viteEntry = typeof config.build?.lib === 'object'
          ? config.build.lib.entry
          : undefined
        const viteSSREntry = typeof config.build?.ssr === 'string' ? config.build.ssr : undefined
        const entries = getInput(rollupEntry || viteEntry || viteSSREntry)
        build({
          entry: entries,
          cacheDir: '../.undts',
          ...dtsOptions,
        })
      },
    },

    rollup: {
      options(options) {
        const entries = getInput(options.input)
        build({
          entry: dtsOptions.entry || entries,
          ...dtsOptions,
        })
      },
    },
  }
}

export const undts = createUnplugin(unplugin)
