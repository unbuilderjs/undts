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
}

export interface BundleService {
  write: () => Promise<void>
}

export async function useBundler({
  emitted = [],
  resolve = {},
  alias = {},
  dtsOptions = {},
  outDir = './dist',
}: BundleOptions): Promise<BundleService> {
  const bundle = await rollup({
    input: emitted,

    plugins: [
      nodeResolve({
        extensions: resolve.extensions || ['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx', '.vue', '.svelte'],
      }),

      Alias(alias),

      dts(dtsOptions),
    ],

    output: {
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
