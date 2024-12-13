/* eslint-disable no-console */
import { svelte2tsx } from 'svelte2tsx'
import { it } from 'vitest'

it('should work', async () => {
  const { code } = svelte2tsx(`
      <script>
        export let name = 'world'
      </script>
    `, {
    mode: 'dts',
  })
  console.log(code)
})
