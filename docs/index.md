---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: undts
  text: Powerful & easy to use declaration file generator
  tagline: Supports ts, tsx, vue, svelte, astro and vue vine!
  actions:
    - theme: brand
      text: Quick Start
      link: /start
  image:
    src: /tsdef.svg
    alt: undts
    width: 200
features:
  - icon: 💡
    title: Simplified Configuration
    details: Configure once with undts and forget about managing complex setups. Integration with Rollup, Vite, and other build tools is streamlined to enhance your development workflow.
  - icon: 🌲
    title: Tree-Shaking Support
    details: Generate leaner and more efficient `.d.ts` files with built-in tree-shaking support, ensuring that your declaration files are as optimized as possible.
  - icon: 🔄
    title: Extensible Plugin System
    details: Extend undts with hooks based on ts-morph to integrate seamlessly with frameworks having their own compilers, like Vue, Svelte, and Astro.
  - icon: 🛠️
    title: Multi-template Support
    details: Out-of-the-box support for multiple file formats including `.vue`, `.svelte`, `.astro`, `.vine.ts`, and standard `.ts`/`.tsx`, facilitating a wide range of project structures.
  - icon: 🚀
    title: Easy to Use
    details: Start quickly with minimal setup. undts simplifies the generation of `.d.ts` files, letting you focus more on development and less on configuration.
  - icon: 🔧
    title: Advanced Customization
    details: Utilize advanced hooks for transforming imports, exports, and dynamic expressions, offering you full control over the declaration generation process.
---
