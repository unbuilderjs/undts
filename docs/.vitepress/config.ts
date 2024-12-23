import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'undts',
  description: 'Powerful & easy to use declaration file generator',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      { text: 'Quick start', link: '/start' },
      { text: 'Why?', link: '/why' },
      { text: 'Config', link: '/config' },
      { text: 'Plugin', link: '/plugin' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unbuilderjs/undts' },
    ],
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
        ],

        sidebar: [
          { text: '快速开始', link: '/zh/start' },
          { text: '为什么？', link: '/zh/why' },
          { text: '配置项', link: '/zh/config' },
          { text: '插件', link: '/zh/plugin' },
        ],
      },
    },
  },
})
