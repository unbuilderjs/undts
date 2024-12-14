/* eslint-disable ts/explicit-function-return-type */
export { default as TestAstroComponent } from './test-astro.astro'
export { default as TestSvelteLegacyComponent } from './test-svelte-legacy.svelte'
export { default as TestSvelteRunesComponent } from './test-svelte-runes.svelte'
export { default as TestVueComponent } from './test-vue-component.vue'
export { TestVueVineComponent } from './test-vue.vine'

export function TestDynamicImport() {
  return import('./dynamic-imported')
}

export function TestDynamicImportVue() {
  return import('./dynamic-imported-vue.vue')
}
