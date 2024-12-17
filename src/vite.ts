import { createVitePlugin } from 'unplugin'
import { unplugin } from './unplugin'

export const undts = createVitePlugin(unplugin)
export default undts
