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

export const unplugin: UnpluginFactory<DTSBuildOptions> = (dtsOptions = {}, meta) => {
  let entries: string[] | undefined = []

  return {
    name: 'unplugin-undts',

    buildEnd() {
      if (!entries || !entries.length)
        console.warn(`[unplugin-undts] No ${meta.framework} entry found, please specify the entry in the plugin config 'entry' field.`)
      build({
        entry: dtsOptions.entry || entries,
        ...dtsOptions,
      })
    },

    esbuild: {
      config(options) {
        entries = getEsbuildInput(options.entryPoints)
      },
    },

    vite: {
      configResolved(config) {
        const rollupEntry = config.build?.rollupOptions?.input
        const viteEntry = typeof config.build?.lib === 'object'
          ? config.build.lib.entry
          : undefined
        const viteSSREntry = typeof config.build?.ssr === 'string' ? config.build.ssr : undefined
        entries = getInput(rollupEntry || viteEntry || viteSSREntry)
      },
    },

    rollup: {
      options(options) {
        entries = getInput(options.input)
      },
    },
  }
}

export const undts = createUnplugin(unplugin)
