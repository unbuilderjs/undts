import { resolveModuleName, sys } from 'typescript'
import { it } from 'vitest'

it('should pass', () => {
  const name = resolveModuleName('./svelte.test', __filename, {}, sys)
  console.warn(name.resolvedModule)
})
