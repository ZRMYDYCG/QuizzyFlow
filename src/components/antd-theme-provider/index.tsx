import React from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { useTheme } from '../../contexts/ThemeContext'
import zhCN from 'antd/locale/zh_CN'

interface AntdThemeProviderProps {
  children: React.ReactNode
}

const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  const { theme, primaryColor } = useTheme()

  // 将 hex 颜色转换为 RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // 调整颜色亮度
  const adjustBrightness = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex)
    const r = Math.min(255, Math.max(0, rgb.r + percent))
    const g = Math.min(255, Math.max(0, rgb.g + percent))
    const b = Math.min(255, Math.max(0, rgb.b + percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  // 生成完整的色板（10个色阶）
  const generateColorPalette = (baseColor: string) => {
    return {
      1: adjustBrightness(baseColor, theme === 'dark' ? 80 : 120),   // 最浅
      2: adjustBrightness(baseColor, theme === 'dark' ? 60 : 90),
      3: adjustBrightness(baseColor, theme === 'dark' ? 40 : 60),
      4: adjustBrightness(baseColor, theme === 'dark' ? 20 : 30),
      5: adjustBrightness(baseColor, theme === 'dark' ? 10 : 15),
      6: baseColor,                                                   // 基础色
      7: adjustBrightness(baseColor, theme === 'dark' ? -10 : -15),
      8: adjustBrightness(baseColor, theme === 'dark' ? -20 : -30),
      9: adjustBrightness(baseColor, theme === 'dark' ? -30 : -45),
      10: adjustBrightness(baseColor, theme === 'dark' ? -40 : -60), // 最深
    }
  }

  const colorPalette = generateColorPalette(primaryColor)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          // 主色
          colorPrimary: primaryColor,
          colorPrimaryBg: colorPalette[1],
          colorPrimaryBgHover: colorPalette[2],
          colorPrimaryBorder: colorPalette[3],
          colorPrimaryBorderHover: colorPalette[4],
          colorPrimaryHover: colorPalette[5],
          colorPrimaryActive: colorPalette[7],
          colorPrimaryTextHover: primaryColor,
          colorPrimaryText: primaryColor,
          colorPrimaryTextActive: primaryColor,
          
          // 信息色
          colorInfo: primaryColor,
          colorInfoBg: colorPalette[1],
          colorInfoBorder: colorPalette[3],
          
          // 链接色（使用主题色）
          colorLink: primaryColor,
          colorLinkHover: colorPalette[5],
          colorLinkActive: colorPalette[7],
          
          // 文字颜色（不受主题色影响，只适配白天/夜晚）
          colorText: theme === 'dark' ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
          colorTextTertiary: theme === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          colorTextQuaternary: theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
          // 实心按钮的文字颜色（白色）
          colorTextLightSolid: '#ffffff',
          colorWhite: '#ffffff',
          
          // 成功、警告、错误色
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',
          
          // 圆角
          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,
          borderRadiusXS: 4,
          
          // 字体
          fontSize: 14,
          fontSizeHeading1: 38,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontSizeHeading4: 20,
          fontSizeHeading5: 16,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          
          // 阴影
          boxShadow: theme === 'dark' 
            ? '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2)'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
          boxShadowSecondary: theme === 'dark'
            ? '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.24)'
            : '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
        },
        components: {
          // 按钮
          Button: {
            borderRadius: 8,
            controlHeight: 36,
            fontSize: 14,
            fontWeight: 500,
            // ===== 主色配置 =====
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorPrimaryActive: colorPalette[7],
            colorPrimaryBorder: primaryColor,
            // ===== 其他配置 =====
            primaryShadow: 'none',
            defaultShadow: 'none',
            dangerShadow: 'none',
          },
          
          // 输入框
          Input: {
            borderRadius: 8,
            controlHeight: 36,
            fontSize: 14,
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorPrimaryActive: colorPalette[7],
            activeBorderColor: primaryColor,
            hoverBorderColor: colorPalette[5],
            activeShadow: `0 0 0 2px ${colorPalette[2]}`,
            errorActiveShadow: `0 0 0 2px rgba(245, 34, 45, 0.2)`,
            warningActiveShadow: `0 0 0 2px rgba(250, 173, 20, 0.2)`,
          },
          
          // 选择器
          Select: {
            borderRadius: 8,
            controlHeight: 36,
            fontSize: 14,
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorPrimaryActive: colorPalette[7],
            optionSelectedBg: colorPalette[1],
            optionSelectedColor: primaryColor,
            optionActiveBg: colorPalette[2],
          },
          
          // 树选择
          TreeSelect: {
            borderRadius: 8,
            controlHeight: 36,
            colorPrimary: primaryColor,
          },
          
          // 级联选择
          Cascader: {
            borderRadius: 8,
            controlHeight: 36,
            colorPrimary: primaryColor,
          },
          
          // 卡片
          Card: {
            borderRadiusLG: 12,
            colorBorderSecondary: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          },
          
          // 模态框
          Modal: {
            borderRadiusLG: 12,
            colorPrimary: primaryColor,
          },
          
          // 抽屉
          Drawer: {
            colorPrimary: primaryColor,
          },
          
          // 表格
          Table: {
            borderRadius: 8,
            headerBg: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fafafa',
            rowHoverBg: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.02)',
            rowSelectedBg: colorPalette[1],
            rowSelectedHoverBg: colorPalette[2],
            colorPrimary: primaryColor,
          },
          
          // 标签页
          Tabs: {
            colorPrimary: primaryColor,
            colorPrimaryActive: colorPalette[7],
            colorPrimaryHover: colorPalette[5],
            // 标签文字颜色
            itemColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
            itemHoverColor: primaryColor,
            itemSelectedColor: primaryColor,
            itemActiveColor: primaryColor,
          },
          
          // 折叠面板
          Collapse: {
            borderRadius: 8,
            colorBorder: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          },
          
          // 消息提示
          Message: {
            borderRadiusLG: 8,
            colorInfo: primaryColor,
          },
          
          // 通知提醒框
          Notification: {
            borderRadiusLG: 12,
            colorInfo: primaryColor,
          },
          
          // 标签
          Tag: {
            borderRadiusSM: 6,
            colorPrimary: primaryColor,
          },
          
          // 徽标数
          Badge: {
            colorPrimary: primaryColor,
          },
          
          // 进度条
          Progress: {
            colorSuccess: primaryColor,
            colorInfo: primaryColor,
            defaultColor: primaryColor,
          },
          
          // 分页
          Pagination: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            itemActiveBg: primaryColor,
          },
          
          // 单选框
          Radio: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorPrimaryActive: colorPalette[7],
            buttonCheckedBg: primaryColor,
          },
          
          // 复选框
          Checkbox: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorPrimaryBorder: primaryColor,
          },
          
          // 开关
          Switch: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
          },
          
          // 滑动输入条
          Slider: {
            colorPrimary: primaryColor,
            colorPrimaryBorder: primaryColor,
            colorPrimaryBorderHover: colorPalette[5],
            trackBg: colorPalette[3],
            trackHoverBg: colorPalette[4],
            handleColor: primaryColor,
            handleActiveColor: primaryColor,
          },
          
          // 日期选择器
          DatePicker: {
            borderRadius: 8,
            controlHeight: 36,
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            colorLink: primaryColor,
            colorLinkHover: colorPalette[5],
            colorLinkActive: colorPalette[7],
          },
          
          // 日历
          Calendar: {
            colorPrimary: primaryColor,
            controlItemBgActive: colorPalette[1],
          },
          
          // 表单
          Form: {
            itemMarginBottom: 20,
            labelFontSize: 14,
            verticalLabelPadding: '0 0 8px',
          },
          
          // 加载中
          Spin: {
            colorPrimary: primaryColor,
          },
          
          // 步骤条
          Steps: {
            colorPrimary: primaryColor,
            colorPrimaryBorder: primaryColor,
          },
          
          // 菜单
          Menu: {
            colorPrimary: primaryColor,
            colorPrimaryBorder: primaryColor,
            itemSelectedBg: colorPalette[1],
            itemSelectedColor: primaryColor,
            itemHoverBg: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            itemHoverColor: primaryColor,
            itemActiveBg: colorPalette[1],
          },
          
          // 下拉菜单
          Dropdown: {
            borderRadiusLG: 8,
            colorPrimary: primaryColor,
          },
          
          // 工具提示
          Tooltip: {
            borderRadius: 6,
            colorPrimary: primaryColor,
          },
          
          // 气泡卡片
          Popover: {
            borderRadiusLG: 8,
            colorPrimary: primaryColor,
          },
          
          // 时间轴
          Timeline: {
            dotBg: primaryColor,
            tailColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(5, 5, 5, 0.06)',
          },
          
          // 评分
          Rate: {
            colorFillContent: primaryColor,
          },
          
          // 上传
          Upload: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
          },
          
          // 穿梭框
          Transfer: {
            colorPrimary: primaryColor,
          },
          
          // 分割线
          Divider: {
            colorSplit: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(5, 5, 5, 0.06)',
          },
          
          // 锚点
          Anchor: {
            colorPrimary: primaryColor,
            colorPrimaryHover: colorPalette[5],
            linkPaddingBlock: 4,
            linkPaddingInlineStart: 16,
          },
          
          // 回到顶部
          BackTop: {
            colorPrimary: primaryColor,
            colorBgTextHover: colorPalette[5],
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntdThemeProvider

