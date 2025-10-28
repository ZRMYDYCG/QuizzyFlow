export const LAYOUT_CONFIG = {
    // 响应式断点
    breakpoint: {
      mobile: 768,
    },
    // 侧边栏宽度
    sidebar: {
      expanded: 200,
      collapsed: 0,
    },
    // 间距配置
    spacing: {
      collapsed: 'p-3',
      expanded: 'p-[30px]',
    },
    // 内容区内边距
    contentPadding: {
      mobile: 'p-4',
      desktop: 'md:p-8',
    },
  } as const