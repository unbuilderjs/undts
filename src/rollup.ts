import { createRollupPlugin } from 'unplugin'
import { unplugin } from './unplugin'

export const undts = createRollupPlugin(unplugin)
export default undts
