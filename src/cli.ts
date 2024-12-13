#!/usr/bin/env node

import type { DTSBuildOptions } from './types'
import { loadConfig } from 'c12'
import { build } from './build'

loadConfig<DTSBuildOptions | DTSBuildOptions[]>({
  name: 'undts',
  packageJson: 'undts',
  dotenv: false,
  rcFile: '.undtsrc',
  defaultConfig: {},
}).then(({ config }): Promise<void | void[]> => {
  if (Array.isArray(config))
    return Promise.all(config.map(build))
  return build(config)
})
