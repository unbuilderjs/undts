import type { UnpluginFactory } from 'unplugin'
import type { DTSBuildOptions } from './types'
import { createUnplugin } from 'unplugin'
import { build } from './build'

export const unplugin: UnpluginFactory<DTSBuildOptions> = (dtsOptions = {}) => {
  return {
    name: 'unplugin-undts',

    rollup: {
      options(options) {
        const entries = (Array.isArray(options.input)
          ? options.input
          : typeof options.input === 'object'
            ? Object.values(options.input)
            : [options.input]).filter(Boolean) as string[]

        build({
          entry: dtsOptions.entry || entries,
          ...dtsOptions,
        })
      },
    },
  }
}

export const undts = createUnplugin(unplugin)
