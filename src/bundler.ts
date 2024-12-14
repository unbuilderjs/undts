import type { InputPluginOption, OutputOptions, RollupOptions } from 'rollup'
import type { Options } from 'rollup-plugin-dts'
import type { ResolveOptions } from './types'
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
}: BundleOptions): Promise<BundleService> {
  const bundle = await rollup({
    ...rollupOptions,
    input: emitted,
    plugins: [
      ...((rollupOptions || {}).plugins || []),
      nodeResolve({
        extensions: resolve.extensions || ['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx', '.vue', '.svelte'],
      }),
      Alias(alias),
      dts(dtsOptions),
    ],

    output: {
      ...rollupOptions.output,
      dir: outDir,
      format: 'esm',
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
