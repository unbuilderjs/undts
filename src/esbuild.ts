import type { DTSBuildOptions } from './types'
import { createEsbuildPlugin } from 'unplugin'
import { unplugin } from './unplugin'

export const undts = createEsbuildPlugin(unplugin) as (options?: DTSBuildOptions) => any
export default undts
