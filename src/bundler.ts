import type { InputPluginOption, OutputOptions, RollupOptions } from 'rollup'
import type { Options } from 'rollup-plugin-dts'
import type { Plugin, ResolveOptions } from './types'
import Alias, { type RollupAliasOptions } from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import { dts } from 'rollup-plugin-dts'

export interface BundleOptions {
  emitted?: string[]
  /** Rollup alias options. */
  alias?: RollupAliasOptions
  /** Rollup resolve options. */
  resolve?: ResolveOptions
  /** `rollup-plugin-dts` options. */
  dtsOptions?: Options
  /** Output directory. */
  outDir?: string
  /** Base rollup options. */
  rollupOptions?: BaseRollupOptions
  /** undts plugins also extend from `rollup` plugin. */
  plugins?: Plugin[]
}

export interface BundleService {
  write: () => Promise<void>
}

export interface BaseRollupOptions extends RollupOptions {
  plugins?: InputPluginOption[]
  output?: OutputOptions
}

export async function useBundler({
  emitted = [],
  resolve = {},
  alias = {},
  dtsOptions = {},
  rollupOptions = {},
  outDir = './dist',
  plugins = [],
}: BundleOptions): Promise<BundleService> {
  const bundle = await rollup({
    ...rollupOptions,
    input: emitted,

    plugins: [
      ...((rollupOptions || {}).plugins || []),
      ...plugins,
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx', '.vue', '.svelte'],
        ...(resolve || {}),
      }),
      Alias(alias),
      dts(dtsOptions),
      {
        name: 'rename-output-files',
        generateBundle(options, bundle) {
          for (const [fileName, fileInfo] of Object.entries(bundle)) {
            if (fileName.endsWith('.d.d.ts')) {
              const newFileName = fileName.replace('.d.d.ts', '.d.ts')
              fileInfo.fileName = newFileName
            }
          }
        },
      },
    ],

    output: {
      ...rollupOptions.output,
      dir: outDir,
      format: 'esm',
      entryFileNames: '[name].ts',
    },
  })

  async function write(): Promise<void> {
    await bundle.write({
      dir: outDir,
      format: 'esm',
    })
  }

  return {
    write,
  }
}
