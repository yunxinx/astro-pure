import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import vercel from '@astrojs/vercel'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, fontProviders } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// 本地集成
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki 配置
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  // [基础配置]
  site: 'https://astro-pure.js.org',
  // 部署到子路径
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },

  // [适配器]
  // https://docs.astro.build/en/guides/deploy/
  adapter: vercel(),
  output: 'server',
  // 本地（独立模式）
  // adapter: node({ mode: 'standalone' }),
  // output: 'server',

  // [资源配置]
  image: {
    responsiveStyles: true,
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // [Markdown 配置]
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {}],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // node_modules 下有两份 @shikijs/types 副本
        // （一份在 node_modules 下，另一份嵌套在 @astrojs/markdown-remark → shiki 中）
        // 官方转换器
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        transformerNotationDiff(),
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        transformerNotationHighlight(),
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        transformerRemoveNotationEscape(),
        // 自定义转换器
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        updateStyle(),
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        addTitle(),
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        addLanguage(),
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        addCopyButton(2000), // 超时时间（毫秒）
        // @ts-ignore 由于 shiki 类型的多个版本导致此问题
        addCollapse(15) // 需要折叠的最大行数
      ]
    }
  },

  // [集成配置]
  integrations: [
    // astro-pure 会自动添加 sitemap、mdx 和 unocss
    // sitemap(),
    // mdx(),
    AstroPureIntegration(config)
  ],

  // [实验性功能]
  experimental: {
    // 允许兼容的编辑器为内容集合条目提供智能感知功能
    // https://docs.astro.build/en/reference/experimental-flags/content-intellisense/
    contentIntellisense: true,
    // 为 SVG 资源启用 SVGO 优化
    // https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
    svgo: true,
    // 启用字体预加载和优化
    // https://docs.astro.build/en/reference/experimental-flags/fonts/
    fonts: [
      {
        provider: fontProviders.fontshare(),
        name: 'Satoshi',
        cssVariable: '--font-satoshi',
        // 默认包含：
        // weights: [400],
        // styles: ["normal", "italics"],
        // subsets: ["cyrillic-ext", "cyrillic", "greek-ext", "greek", "vietnamese", "latin-ext", "latin"],
        // fallbacks: ["sans-serif"],
        styles: ['normal', 'italic'],
        weights: [400, 500],
        subsets: ['latin']
      }
    ]
  }
})
