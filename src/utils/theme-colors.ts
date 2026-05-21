/**
 * 主题色工具：生成 Ant Design 兼容的主色色板与半透明背景
 */

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface PrimaryPalette {
  base: string
  bg: string
  bgHover: string
  border: string
  borderHover: string
  hover: string
  active: string
  steps: Record<number, string>
}

const HEX_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

export function hexToRgb(hex: string): Rgb {
  const result = HEX_RE.exec(hex)
  if (!result) return { r: 59, g: 130, b: 246 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0')).join('')}`
}

export function mixColors(color: string, mixColor: string, weight: number): string {
  const c1 = hexToRgb(color)
  const c2 = hexToRgb(mixColor)
  const w = Math.min(1, Math.max(0, weight))
  return rgbToHex(
    c1.r * (1 - w) + c2.r * w,
    c1.g * (1 - w) + c2.g * w,
    c1.b * (1 - w) + c2.b * w
  )
}

/** 主色半透明背景，避免激活态盖住表单文字 */
export function primaryAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function generatePrimaryPalette(primaryColor: string, isDark: boolean): PrimaryPalette {
  const base = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`
  const light = '#ffffff'
  const dark = isDark ? '#141414' : '#000000'

  const steps: Record<number, string> = {
    1: mixColors(base, light, isDark ? 0.92 : 0.9),
    2: mixColors(base, light, isDark ? 0.84 : 0.8),
    3: mixColors(base, light, isDark ? 0.76 : 0.65),
    4: mixColors(base, light, isDark ? 0.68 : 0.5),
    5: mixColors(base, light, isDark ? 0.55 : 0.35),
    6: base,
    7: mixColors(base, dark, isDark ? 0.25 : 0.15),
    8: mixColors(base, dark, isDark ? 0.35 : 0.25),
    9: mixColors(base, dark, isDark ? 0.45 : 0.35),
    10: mixColors(base, dark, isDark ? 0.55 : 0.45),
  }

  return {
    base,
    bg: primaryAlpha(base, isDark ? 0.15 : 0.08),
    bgHover: primaryAlpha(base, isDark ? 0.22 : 0.12),
    border: primaryAlpha(base, isDark ? 0.35 : 0.25),
    borderHover: primaryAlpha(base, isDark ? 0.45 : 0.35),
    hover: steps[5],
    active: steps[7],
    steps,
  }
}

export function getTextOnPrimary(primaryColor: string): string {
  const { r, g, b } = hexToRgb(primaryColor)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#1f2937' : '#ffffff'
}

const PRIMARY_TOKEN_KEYS = [
  'colorPrimary',
  'colorPrimaryHover',
  'colorPrimaryActive',
  'colorPrimaryBg',
  'colorPrimaryBgHover',
  'colorPrimaryBorder',
  'colorPrimaryBorderHover',
  'colorPrimaryText',
  'colorPrimaryTextHover',
  'colorPrimaryTextActive',
] as const

/** 移除 token 中的主色相关字段，避免与动态主题 / 算法冲突 */
export function omitPrimaryTokens<T extends Record<string, unknown>>(token: T): Omit<T, (typeof PRIMARY_TOKEN_KEYS)[number]> {
  const result = { ...token }
  for (const key of PRIMARY_TOKEN_KEYS) {
    delete result[key as keyof T]
  }
  return result as Omit<T, (typeof PRIMARY_TOKEN_KEYS)[number]>
}
