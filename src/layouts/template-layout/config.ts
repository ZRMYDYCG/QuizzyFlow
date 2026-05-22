import type { LucideIcon } from 'lucide-react'
import { Compass, LayoutGrid, Sparkles, PenLine } from 'lucide-react'

export interface TemplateNavItem {
  key: string
  label: string
  path: string
  icon: LucideIcon
  match?: (pathname: string) => boolean
}

export interface TemplateFooterLink {
  label: string
  href: string
  external?: boolean
}

export interface TemplateFooterSection {
  title: string
  links: TemplateFooterLink[]
}

export const TEMPLATE_NAV_ITEMS: TemplateNavItem[] = [
  {
    key: 'discover',
    label: '发现模板',
    path: '/template/market',
    icon: Compass,
    match: (pathname) =>
      pathname === '/template/market' || pathname.startsWith('/template/detail'),
  },
  {
    key: 'featured',
    label: '精选推荐',
    path: '/template/market#featured',
    icon: Sparkles,
  },
  {
    key: 'browse',
    label: '分类浏览',
    path: '/template/market#browse',
    icon: LayoutGrid,
  },
  {
    key: 'publish',
    label: '发布模板',
    path: '/manage/list',
    icon: PenLine,
  },
]

export const TEMPLATE_FOOTER_SECTIONS: TemplateFooterSection[] = [
  {
    title: '产品',
    links: [
      { label: '模板市场', href: '/template/market' },
      { label: '问卷编辑器', href: '/manage/list' },
      { label: '数据统计', href: '/manage/list' },
    ],
  },
  {
    title: '社区',
    links: [
      { label: '精选模板', href: '/template/market#featured' },
      { label: '发布作品', href: '/manage/list' },
      { label: '用户反馈', href: '/feedback' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '使用指南', href: '/manage' },
      { label: '帮助中心', href: '/feedback' },
    ],
  },
  {
    title: '关于',
    links: [
      { label: '服务条款', href: '/terms', external: true },
      { label: '隐私政策', href: '/privacy', external: true },
    ],
  },
]
