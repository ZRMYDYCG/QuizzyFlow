import type { ThemeConfig } from 'antd'

/**
 * 编辑器亮色主题配置
 */
export const editorLightTheme: ThemeConfig = {
  token: {
    // 基础色
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    
    // 文字颜色
    colorText: '#1f2937',             // gray-800
    colorTextSecondary: '#6b7280',    // gray-500
    colorTextTertiary: '#9ca3af',     // gray-400
    colorTextQuaternary: '#d1d5db',   // gray-300
    
    // 边框
    colorBorder: 'rgba(0, 0, 0, 0.1)',
    colorBorderSecondary: 'rgba(0, 0, 0, 0.05)',
    
    // 主题色
    colorPrimary: '#3b82f6',
    colorPrimaryHover: '#2563eb',
    colorPrimaryActive: '#1d4ed8',
    colorPrimaryBg: 'rgba(59, 130, 246, 0.1)',
    
    // 成功色
    colorSuccess: '#10b981',
    colorSuccessBg: 'rgba(16, 185, 129, 0.1)',
    
    // 警告色
    colorWarning: '#f59e0b',
    colorWarningBg: 'rgba(245, 158, 11, 0.1)',
    
    // 错误色
    colorError: '#ef4444',
    colorErrorBg: 'rgba(239, 68, 68, 0.1)',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 字体
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    
    // 阴影
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  
  components: {
    Button: {
      colorBgContainer: '#ffffff',
      colorBorder: 'rgba(0, 0, 0, 0.1)',
      colorText: '#1f2937',
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Input: {
      colorBgContainer: '#ffffff',
      colorBorder: 'rgba(0, 0, 0, 0.1)',
      colorText: '#1f2937',
      colorTextPlaceholder: '#9ca3af',
      activeBorderColor: '#3b82f6',
      hoverBorderColor: 'rgba(0, 0, 0, 0.2)',
    },
    Tabs: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: 'rgba(0, 0, 0, 0.05)',
      colorText: '#6b7280',
      colorTextHeading: '#1f2937',
      itemActiveColor: '#3b82f6',
      itemHoverColor: '#1f2937',
      itemSelectedColor: '#3b82f6',
      inkBarColor: '#3b82f6',
    },
    Dropdown: {
      colorBgElevated: '#ffffff',
      colorText: '#1f2937',
      controlItemBgHover: '#f3f4f6',
    },
    Tooltip: {
      colorBgSpotlight: '#1f2937',
      colorTextLightSolid: '#ffffff',
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
      titleColor: '#1f2937',
    },
    Empty: {
      colorText: '#6b7280',
      colorTextDescription: '#9ca3af',
    },
    Message: {
      contentBg: '#ffffff',
    },
  },
  
  algorithm: undefined,
}

/**
 * 编辑器深色主题配置
 */
export const editorDarkTheme: ThemeConfig = {
  token: {
    // 基础色
    colorBgBase: '#1a1a1f',           // 主背景色
    colorBgContainer: '#2a2a2f',      // 容器背景
    colorBgElevated: '#35353a',       // 悬浮层/弹窗背景
    colorBgLayout: '#1e1e23',         // 布局背景
    
    // 文字颜色
    colorText: '#cbd5e1',             // 主文字 (slate-300)
    colorTextSecondary: '#94a3b8',    // 次要文字 (slate-400)
    colorTextTertiary: '#64748b',     // 三级文字 (slate-500)
    colorTextQuaternary: '#475569',   // 四级文字 (slate-600)
    
    // 边框
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
    
    // 主题色
    colorPrimary: '#3b82f6',          // blue-500
    colorPrimaryHover: '#2563eb',     // blue-600
    colorPrimaryActive: '#1d4ed8',    // blue-700
    colorPrimaryBg: 'rgba(59, 130, 246, 0.1)',
    
    // 成功色
    colorSuccess: '#10b981',          // green-500
    colorSuccessBg: 'rgba(16, 185, 129, 0.1)',
    
    // 警告色
    colorWarning: '#f59e0b',          // amber-500
    colorWarningBg: 'rgba(245, 158, 11, 0.1)',
    
    // 错误色
    colorError: '#ef4444',            // red-500
    colorErrorBg: 'rgba(239, 68, 68, 0.1)',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 字体
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    
    // 阴影
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  },
  
  components: {
    // Button 组件
    Button: {
      colorBgContainer: '#2a2a2f',
      colorBorder: 'rgba(255, 255, 255, 0.05)',
      colorText: '#cbd5e1',
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    
    // Input 组件
    Input: {
      colorBgContainer: '#2a2a2f',
      colorBorder: 'rgba(255, 255, 255, 0.05)',
      colorText: '#cbd5e1',
      colorTextPlaceholder: '#64748b',
      activeBorderColor: '#3b82f6',
      hoverBorderColor: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Tabs 组件
    Tabs: {
      colorBgContainer: '#1e1e23',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
      colorText: '#94a3b8',
      colorTextHeading: '#cbd5e1',
      itemActiveColor: '#3b82f6',
      itemHoverColor: '#cbd5e1',
      itemSelectedColor: '#3b82f6',
      inkBarColor: '#3b82f6',
    },
    
    // Dropdown 组件
    Dropdown: {
      colorBgElevated: '#2a2a2f',
      colorText: '#cbd5e1',
      controlItemBgHover: '#35353a',
    },
    
    // Tooltip 组件
    Tooltip: {
      colorBgSpotlight: '#2a2a2f',
      colorTextLightSolid: '#cbd5e1',
    },
    
    // Modal 组件
    Modal: {
      contentBg: '#2a2a2f',
      headerBg: '#2a2a2f',
      titleColor: '#cbd5e1',
    },
    
    // Empty 组件
    Empty: {
      colorText: '#64748b',
      colorTextDescription: '#475569',
    },
    
    // Message 组件
    Message: {
      contentBg: '#2a2a2f',
    },
    
    // Space 组件不需要特殊配置
  },
  
  algorithm: undefined, // 不使用内置算法，完全自定义
}

