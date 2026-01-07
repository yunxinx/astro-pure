import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [基本配置]
  /** 网站标题，用于元数据和浏览器标签页标题 */
  title: '月微yuewei',
  /** 用于首页和版权声明 */
  author: 'yuewei',
  /** 网站描述元数据 */
  description: '闲静则观书，欲知而望海；月微yuewei 的网站、文档、笔记',
  /** 网站默认 favicon，应为 `public/` 目录下的图片路径 */
  favicon: '/favicon/favicon.ico',
  /** 网站默认社交分享卡片图片，应为 `public/` 目录下的图片路径 */
  socialCard: '/images/social-card.png',
  /** 指定网站的默认语言 */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // 日期语言
    dateLocale: 'zh-CN',
    dateOptions: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  },
  /** 设置首页显示的 logo 图片 */
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true, // 禁用预渲染时不支持 pagefind 搜索
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // 仍在测试中
  head: [
    /* Telegram 频道 */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** 配置网站头部导航 */
  header: {
    menu: [
      { title: 'Blog', link: '/blog' },
      { title: 'Docs', link: '/docs' },
      // { title: 'Projects', link: '/projects' },
      { title: 'Links', link: '/links' },
      { title: 'About', link: '/about' }
    ]
  },

  /** 配置网站底部 */
  footer: {
    // 年份格式
    year: `© ${new Date().getFullYear()}`,
    // year: `© 2019 - ${new Date().getFullYear()}`,
    links: [
      // 备案链接 (pos=1 显示在分隔符后)
      {
        title: '湘ICP备2025136512号-1',
        link: 'https://beian.miit.gov.cn/',
        pos: 1
      },
      // 公安链接 (pos=1 显示在分隔符后，带图标)
      ({
        title: '湘公网安备43080202001051号',
        link: 'https://beian.mps.gov.cn/#/query/webSearch?code=43080202001051',
        pos: 1,
        icon: '/images/gongan.png'
      } as any),
      // Pure theme powered (pos=2 追加到版权行)
      {
        title: 'Pure theme powered',
        link: 'https://github.com/cworld1/astro-theme-pure',
        pos: 2
      }
    ],
    /** 是否在底部显示 "Astro & Pure theme powered" 链接 */
    credits: false,
    /** 网站社交媒体账号配置 */
    social: { email: 'mailto:zzz@yueweix.com' }
  },

  // [内容配置]
  content: {
    /** 外部链接配置 */
    externalLinks: {
      content: ' ↗',
      /** 外部链接元素的属性 */
      properties: {
        style: 'user-select:none'
      }
    },
    /** 博客分页每页文章数量 */
    blogPageSize: 8,
    // 目前支持 weibo, x, bluesky
    share: ['weibo']
  }
}

export const integ: IntegrationUserConfig = {
  // [友链配置]
  // https://astro-pure.js.org/docs/integrations/links
  links: {
    // 友链留言板
    logbook: [
      { date: '2025-03-16', content: 'Is there a leakage?' },
      { date: '2025-03-16', content: 'A leakage of what?' },
      { date: '2025-03-16', content: 'I have a full seat of water, like, full of water!' },
      { date: '2025-03-16', content: 'Must be the water.' },
      { date: '2025-03-16', content: "Let's add that to the words of wisdom." }
    ],
    // 你的网站信息（用于友链申请展示）
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: 'https://yueweix.com/' },
      { name: 'Avatar', val: 'https://yueweix.com/favicon/favicon.ico' }
    ],
    // 在 `public/avatars/` 缓存头像以提升用户体验
    cacheAvatar: false
  },
  // [搜索]
  pagefind: true,
  // 在底部添加随机引言（默认显示在首页底部）
  // 参考: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // [引言]
  quote: {
    // - 一言
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // server: 'https://v1.hitokoto.cn/?c=i',
    // target: `(data) => (data.hitokoto || 'Error')`
    // - Quoteable
    // https://github.com/lukePeavey/quotable
    // server: 'http://api.quotable.io/quotes/random?maxLength=60',
    // target: `(data) => data[0].content || 'Error'`
    // - DummyJSON
    server: 'https://v1.hitokoto.cn/?c=i',
    target: `(data) => data.hitokoto || 'Error'`
  },
  // [排版]
  // https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base',
    // 引用块字体样式 `normal` / `italic`（默认为斜体）
    blockquoteStyle: 'italic',
    // 行内代码块样式 `code` / `modern`（默认为 code）
    inlineCodeBlockStyle: 'modern'
  },
  // [图片灯箱]
  // 可添加图片缩放效果的灯箱库
  // https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // 禁用后不会加载整个库
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // 评论系统
  waline: {
    enable: false,
    // 服务端链接
    server: 'https://astro-theme-pure-waline.arthals.ink/',
    // 是否显示评论元信息
    showMeta: false,
    // 参考 https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // 参考 https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: 'Welcome to comment. (Email to receive replies. Login is unnecessary)'
      },
      imageUploader: false
    }
  }
}

export const terms: CardListData = {
  title: 'Terms content',
  list: [
    {
      title: 'Privacy Policy',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Terms and Conditions',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Copyright',
      link: '/terms/copyright'
    },
    {
      title: 'Disclaimer',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config
