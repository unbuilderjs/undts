import * as vine from '@vue-vine/compiler'
import { it } from 'vitest'

it('should pass', () => {
  const ctx = vine.createCompilerCtx()
  const result = vine.compileVineTypeScriptFile(`
    export function Hello() {
      return vine\`<div>Hello</div>\`
    }
    `, '', {
    compilerHooks: {
      getCompilerCtx() {
        return ctx
      },
      onError(err) {
        console.error(err)
      },
      onWarn(warn) {
        console.warn(warn)
      },
    },
  })

  // eslint-disable-next-line no-console
  console.log(result.fileMagicCode.toString())
})
