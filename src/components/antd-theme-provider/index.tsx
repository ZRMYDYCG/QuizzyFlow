import React, { useMemo } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'
import { useTheme } from '../../contexts/ThemeContext'
import { editorDarkTheme, editorLightTheme } from '../../config/theme.config'
import {
  generatePrimaryPalette,
  getTextOnPrimary,
  omitPrimaryTokens,
} from '../../utils/theme-colors'
import zhCN from 'antd/locale/zh_CN'

interface AntdThemeProviderProps {
  children: React.ReactNode
}

const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  const { theme, primaryColor } = useTheme()
  const isDark = theme === 'dark'

  const themeConfig = useMemo((): ThemeConfig => {
    const editorBase = isDark ? editorDarkTheme : editorLightTheme
    const palette = generatePrimaryPalette(primaryColor, isDark)
    const textOnPrimary = getTextOnPrimary(primaryColor)

    const seedToken = omitPrimaryTokens({
      ...editorBase.token,
      colorPrimary: palette.base,
    })

    const computed = antdTheme.getDesignToken({
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: seedToken,
    })

    const surfaceText = computed.colorText
    const selectBg = palette.bg
    const selectBgHover = palette.bgHover

    return {
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: seedToken,
      components: {
        ...editorBase.components,
        Button: {
          ...editorBase.components?.Button,
          primaryShadow: 'none',
          defaultShadow: 'none',
          dangerShadow: 'none',
        },
        Input: {
          ...editorBase.components?.Input,
          colorText: surfaceText,
          colorTextPlaceholder: computed.colorTextPlaceholder,
          activeBorderColor: palette.base,
          hoverBorderColor: palette.borderHover,
          activeShadow: `0 0 0 2px ${selectBg}`,
        },
        InputNumber: {
          colorText: surfaceText,
          activeBorderColor: palette.base,
          hoverBorderColor: palette.borderHover,
          activeShadow: `0 0 0 2px ${selectBg}`,
        },
        Select: {
          ...editorBase.components?.Select,
          colorText: surfaceText,
          colorTextPlaceholder: computed.colorTextPlaceholder,
          optionSelectedBg: selectBg,
          optionSelectedColor: surfaceText,
          optionActiveBg: selectBgHover,
          activeBorderColor: palette.base,
          hoverBorderColor: palette.borderHover,
        },
        TreeSelect: {
          colorText: surfaceText,
          nodeSelectedBg: selectBg,
        },
        Cascader: {
          colorText: surfaceText,
          optionSelectedBg: selectBg,
          optionSelectedColor: surfaceText,
        },
        AutoComplete: {
          colorText: surfaceText,
          optionSelectedBg: selectBg,
          optionSelectedColor: surfaceText,
        },
        Table: {
          ...editorBase.components?.Table,
          rowSelectedBg: selectBg,
          rowSelectedHoverBg: selectBgHover,
        },
        Tabs: {
          ...editorBase.components?.Tabs,
          inkBarColor: palette.base,
          itemSelectedColor: palette.base,
          itemHoverColor: palette.base,
        },
        Menu: {
          itemSelectedBg: selectBg,
          itemSelectedColor: surfaceText,
          itemHoverColor: palette.base,
          itemActiveBg: selectBgHover,
        },
        Dropdown: {
          ...editorBase.components?.Dropdown,
        },
        Pagination: {
          itemActiveBg: palette.base,
          itemActiveColor: textOnPrimary,
        },
        Radio: {
          colorText: surfaceText,
          buttonCheckedBg: palette.base,
          buttonCheckedColor: textOnPrimary,
        },
        Checkbox: {
          colorText: surfaceText,
        },
        DatePicker: {
          colorText: surfaceText,
          activeBorderColor: palette.base,
          cellActiveWithRangeBg: selectBg,
          cellHoverWithRangeBg: selectBgHover,
          cellRangeBorderColor: palette.border,
        },
        Calendar: {
          controlItemBgActive: selectBg,
        },
        Form: {
          labelColor: surfaceText,
        },
        Segmented: {
          itemSelectedBg: selectBg,
          itemSelectedColor: surfaceText,
          itemHoverColor: palette.base,
        },
      },
    }
  }, [isDark, primaryColor])

  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      {children}
    </ConfigProvider>
  )
}

export default AntdThemeProvider
