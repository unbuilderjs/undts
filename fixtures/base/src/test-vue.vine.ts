export function TestVueVineComponent(_props: { name: string }): VueVineComponent {
  return vine`
    <div>Hello world, {{ name }}</div>
  `
}
