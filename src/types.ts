import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupOptions } from 'rollup'
import type { ProjectOptions } from 'ts-morph'
import type { BundleOptions } from './bundler'
import type { CleanerOptions } from './cleaner'
import type { EntryExplorerOptions, EntryExplorerPlugin } from './explorer'

export interface ResolveOptions extends RollupNodeResolveOptions {
  /**
   * Specifies the extensions of files that the plugin will operate on.
   * @default ['.mjs','.js','.json','.node','.jsx','.ts','.tsx','.vue','.svelte']
   */
  extensions?: readonly string[]
}

export interface Plugin extends EntryExplorerPlugin {}

export interface DTSBuildOptions extends EntryExplorerOptions, CleanerOptions, Omit<BundleOptions, 'emitted'> {
  /**
   * Entry files. Must be a real file path and cannot be a glob pattern.
   */
  entry?: string[]
  /** If set `false`, will not bundle all file into `entry` files. */
  bundled?: false
  /**
   * If you want to include some files, you can use this option.
   *
   * - It like `include` field in `tsconfig.json`.
   * - It can be a glob pattern.
   *
   * @default []
   */
  include?: string[]
  /** Default exclude `node_modules`. */
  ignore?: string[]
  /** Base rollup bundler options. */
  rollupOptions?: RollupOptions
  /** Base typescript compiler options. */
  projectOptions?: ProjectOptions
  /** Rollup alias options. */
  alias?: RollupAliasOptions
  /** Rollup resolve options. */
  resolve?: ResolveOptions
  /** DTS plugin. */
  plugins?: Plugin[]
}

export function defineConfig(options: DTSBuildOptions | DTSBuildOptions[] = {}): DTSBuildOptions | DTSBuildOptions[] {
  return options
}
