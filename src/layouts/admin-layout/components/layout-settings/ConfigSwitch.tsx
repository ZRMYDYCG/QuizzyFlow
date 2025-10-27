import React from 'react'
import { Switch, Space, Slider, Segmented } from 'antd'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import type { BoxStyle, ContainerWidth, TabNavStyle } from '@/types/layout'

/**
 * 配置开关组件
 */
const ConfigSwitch: React.FC = () => {
  const { config, updateConfig } = useLayoutConfig()

  const configItems = [
    {
      key: 'showTabs',
      label: '开启多标签页',
      checked: config.showTabs,
    },
    {
      key: 'showTabsMultiMode',
      label: '侧边栏多页签模式',
      checked: config.showTabsMultiMode,
    },
    {
      key: 'showCollapseButton',
      label: '显示折叠侧边栏按钮',
      checked: config.showCollapseButton,
    },
    {
      key: 'showQuickEntry',
      label: '显示快速入口',
      checked: config.showQuickEntry,
    },
    {
      key: 'showReloadButton',
      label: '显示重载页面按钮',
      checked: config.showReloadButton,
    },
    {
      key: 'showBreadcrumb',
      label: '显示全局面包屑导航',
      checked: config.showBreadcrumb,
    },
    {
      key: 'showLanguageSelector',
      label: '显示多语言选择',
      checked: config.showLanguageSelector,
    },
    {
      key: 'showProgressBar',
      label: '显示顶部进度条',
      checked: config.showProgressBar,
    },
    {
      key: 'colorWeaknessMode',
      label: '色弱模式',
      checked: config.colorWeaknessMode,
    },
    {
      key: 'showWatermark',
      label: '全局水印',
      checked: config.showWatermark,
    },
  ]

  const handleToggle = (key: string, checked: boolean) => {
    updateConfig({ [key]: checked })
  }

  return (
    <div className="space-y-6">
      {/* 开关列表 */}
      <Space direction="vertical" className="w-full" size="middle">
        {configItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            <Switch
              checked={item.checked}
              onChange={(checked) => handleToggle(item.key, checked)}
              size="small"
            />
          </div>
        ))}
      </Space>

      {/* 盒子样式 */}
      <div>
        <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">盒子样式</div>
        <Segmented
          block
          value={config.boxStyle}
          onChange={(value) => updateConfig({ boxStyle: value as BoxStyle })}
          options={[
            { label: '边框', value: 'border' },
            { label: '阴影', value: 'shadow' },
          ]}
        />
      </div>

      {/* 容器宽度 */}
      <div>
        <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">容器宽度</div>
        <Segmented
          block
          value={config.containerWidth}
          onChange={(value) => updateConfig({ containerWidth: value as ContainerWidth })}
          options={[
            { label: '辅满', value: 'full' },
            { label: '定宽', value: 'fixed-1400' },
          ]}
        />
      </div>

      {/* 标签页宽度 */}
      {config.showTabs && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">标签页宽度</span>
            <span className="text-xs text-gray-500">{config.tabWidth}px</span>
          </div>
          <Slider
            min={180}
            max={300}
            value={config.tabWidth}
            onChange={(value) => updateConfig({ tabWidth: value })}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </div>
      )}

      {/* 标签页风格 */}
      {config.showTabs && (
        <div>
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">标签页风格</div>
          <Segmented
            block
            value={config.tabStyle}
            onChange={(value) => updateConfig({ tabStyle: value as TabNavStyle })}
            options={[
              { label: '默认', value: 'default' },
              { label: 'Chrome', value: 'chrome' },
              { label: '卡片', value: 'card' },
            ]}
          />
        </div>
      )}

      {/* 侧边栏宽度 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">侧边栏宽度</span>
          <span className="text-xs text-gray-500">{config.sidebarWidth}px</span>
        </div>
        <Slider
          min={200}
          max={300}
          value={config.sidebarWidth}
          onChange={(value) => updateConfig({ sidebarWidth: value })}
          tooltip={{ formatter: (value) => `${value}px` }}
        />
      </div>
    </div>
  )
}

export default ConfigSwitch

