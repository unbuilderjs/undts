---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: undts
  text: 强大且易于使用的声明文件生成器
  tagline: 支持 ts、tsx、vue、svelte、astro 和 vue vine！
  actions:
    - theme: brand
      text: 快速开始
      link: /start
  image:
    src: /tsdef.svg
    alt: undts
    width: 200
features:
  - icon: 💡
    title: 配置简化
    details: 与 Rollup、Vite 等构建工具的集成被大大简化，优化您的开发流程。
  - icon: 🌲
    title: 支持摇树（Tree-Shaking）
    details: 内置Tree-Shaking，生成更精简、更高效的.d.ts文件，确保您的声明文件尽可能地优化。
  - icon: 🔄
    title: 可扩展插件系统
    details: 利用基于 ts-morph 的钩子扩展 undts，无缝集成如 Vue、Svelte 和 Astro 等具有自己编译器的框架。
  - icon: 🛠️
    title: 支持多种模板
    details: 内置支持.vue、.svelte、.astro、.vine.ts以及常规的.ts/.tsx等多种文件格式，适应多样的项目结构。
  - icon: 🚀
    title: 易于上手
    details: 简化.d.ts文件的生成过程，快速启动，减少配置工作，让您更专注于开发。
  - icon: 🔧
    title: 高度自定义
    details: 使用高级钩子自定义导入、导出和动态表达式的处理，完全掌控声明文件的生成过程。
---
