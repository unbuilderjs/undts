import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { Plugin as RollupPlugin } from 'rollup'
import type { ProjectOptions } from 'ts-morph'
import type { BundleOptions } from './bundler'
import type { CleanerOptions } from './cleaner'
import type { EmitPlugin } from './emit'
import type { EntryExplorerOptions, EntryExplorerPlugin } from './explorer'

export interface ResolveOptions extends RollupNodeResolveOptions {
  /**
   * Specifies the extensions of files that the plugin will operate on.
   * @default ['.mjs','.js','.json','.node','.jsx','.ts','.tsx','.vue','.svelte']
   */
  extensions?: readonly string[]
}

export interface Plugin extends EntryExplorerPlugin, EmitPlugin, RollupPlugin {
  dtsConfig?: (options: DTSBuildOptions) => void | Promise<void> | DTSBuildOptions | Promise<DTSBuildOptions>
}

export interface DTSBuildOptions extends EntryExplorerOptions, CleanerOptions, Omit<BundleOptions, 'emitted'> {
  /**
   * Entry files. Must be a real file path and cannot be a glob pattern.
   */
  entry?: string[]
  /** If set `false`, will not bundle all file into `entry` files. @deprecated */
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
  /** Base typescript compiler options. */
  projectOptions?: ProjectOptions
  /**
   * The plugins of undts. It is extended from `rollup` plugin and add some custom hooks.
   */
  plugins?: Plugin[]
  /** Add `#region` and `#endregion` comment in output file. Default is `true`. */
  regionComment?: false
}

export function defineConfig(options: DTSBuildOptions | DTSBuildOptions[] = {}): DTSBuildOptions | DTSBuildOptions[] {
  return options
}
