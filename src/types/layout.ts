/**
 * 布局配置类型定义
 */

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'system'

/** 布局模式 */
export type LayoutMode = 'vertical' | 'horizontal' | 'mixed' | 'columns'

/** 菜单主题 */
export type MenuTheme = 'light' | 'dark' | 'transparent'

/** 盒子样式 */
export type BoxStyle = 'border' | 'shadow'

/** 容器宽度 */
export type ContainerWidth = 'full' | 'fixed-1200' | 'fixed-1400' | 'fixed-1600'

/** 标签页样式 */
export type TabStyle = 'default' | 'chrome' | 'card'

/** 页面过渡动画 */
export type PageTransition = 'slide-left' | 'slide-right' | 'fade' | 'zoom' | 'none'

/** 标签页风格（新增：用于标签栏的整体风格） */
export type TabNavStyle = 'default' | 'chrome' | 'card'

/**
 * 完整布局配置接口
 */
export interface LayoutConfig {
  // ========== 主题配置 ==========
  /** 主题模式：亮色/暗色/跟随系统 */
  themeMode: ThemeMode
  
  /** 主题色 */
  primaryColor: string
  
  /** 菜单主题：亮色/暗色/半透明 */
  menuTheme: MenuTheme
  
  // ========== 布局配置 ==========
  /** 布局模式：垂直/水平/混合/双列 */
  layoutMode: LayoutMode
  
  /** 盒子样式：边框/阴影 */
  boxStyle: BoxStyle
  
  /** 容器宽度 */
  containerWidth: ContainerWidth
  
  /** 侧边栏宽度 (200-300px) */
  sidebarWidth: number
  
  // ========== 功能开关 ==========
  /** 开启多标签页 */
  showTabs: boolean
  
  /** 侧边栏多页签模式 */
  showTabsMultiMode: boolean
  
  /** 显示折叠侧边栏按钮 */
  showCollapseButton: boolean
  
  /** 显示快速入口 */
  showQuickEntry: boolean
  
  /** 显示重载页面按钮 */
  showReloadButton: boolean
  
  /** 显示面包屑导航 */
  showBreadcrumb: boolean
  
  /** 显示多语言选择 */
  showLanguageSelector: boolean
  
  /** 显示顶部进度条 */
  showProgressBar: boolean
  
  /** 色弱模式 */
  colorWeaknessMode: boolean
  
  /** 全局水印 */
  showWatermark: boolean
  
  // ========== 标签页配置 ==========
  /** 标签页宽度 (180-300px) */
  tabWidth: number
  
  /** 标签页样式 */
  tabStyle: TabNavStyle
  
  // ========== 动画配置 ==========
  /** 页面切换动画 */
  pageTransition: PageTransition
  
  /** 动画时长 (ms) */
  transitionDuration: number
  
  // ========== 其他配置 ==========
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  
  /** 固定头部 */
  fixedHeader: boolean
  
  /** 固定侧边栏 */
  fixedSidebar: boolean
}

/**
 * 布局配置默认值
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  // 主题配置
  themeMode: 'dark',
  primaryColor: '#3b82f6',
  menuTheme: 'dark',
  
  // 布局配置
  layoutMode: 'vertical',
  boxStyle: 'shadow',
  containerWidth: 'full',
  sidebarWidth: 240,
  
  // 功能开关
  showTabs: true,
  showTabsMultiMode: true,
  showCollapseButton: true,
  showQuickEntry: true,
  showReloadButton: true,
  showBreadcrumb: true,
  showLanguageSelector: true,
  showProgressBar: false,
  colorWeaknessMode: false,
  showWatermark: false,
  
  // 标签页配置
  tabWidth: 230,
  tabStyle: 'default',
  
  // 动画配置
  pageTransition: 'fade',
  transitionDuration: 300,
  
  // 其他配置
  sidebarCollapsed: false,
  fixedHeader: true,
  fixedSidebar: true,
}

/**
 * 预设主题色
 */
export const PRESET_COLORS = [
  { name: '拂晓蓝', color: '#3b82f6' },
  { name: '薄暮紫', color: '#a855f7' },
  { name: '明青', color: '#06b6d4' },
  { name: '极光绿', color: '#10b981' },
  { name: '青', color: '#14b8a6' },
  { name: '日暮橙', color: '#f97316' },
  { name: '法式洋红', color: '#ec4899' },
] as const

