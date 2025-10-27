import React from 'react'
import { Drawer, Divider, Button, Space } from 'antd'
import { 
  SettingOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  ImportOutlined,
  CheckOutlined 
} from '@ant-design/icons'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeSelector from './ThemeSelector'
import LayoutSelector from './LayoutSelector'
import ColorPicker from './ColorPicker'
import ConfigSwitch from './ConfigSwitch'

interface LayoutSettingsProps {
  visible: boolean
  onClose: () => void
}

/**
 * 布局设置抽屉
 */
const LayoutSettings: React.FC<LayoutSettingsProps> = ({ visible, onClose }) => {
  const { config, updateConfig, resetConfig, exportConfig, importConfig } = useLayoutConfig()
  const { theme } = useTheme()

  // 导出配置
  const handleExport = () => {
    const json = exportConfig()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'layout-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入配置
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const json = event.target?.result as string
          if (importConfig(json)) {
            console.log('配置导入成功')
          } else {
            console.error('配置导入失败')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <SettingOutlined />
          <span>布局设置</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={320}
      extra={
        <Space size="small">
          <Button 
            size="small" 
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>
          <Button 
            size="small" 
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
            导入
          </Button>
          <Button 
            size="small" 
            icon={<ReloadOutlined />}
            onClick={resetConfig}
          >
            重置
          </Button>
        </Space>
      }
      className={theme === 'dark' ? 'dark-drawer' : ''}
    >
      <div className="space-y-6">
        {/* 主题风格 */}
        <section>
          <h4 className="text-sm font-medium mb-3">主题风格</h4>
          <ThemeSelector />
        </section>

        <Divider className="my-4" />

        {/* 菜单布局 */}
        <section>
          <h4 className="text-sm font-medium mb-3">菜单布局</h4>
          <LayoutSelector />
        </section>

        <Divider className="my-4" />

        {/* 系统主题色 */}
        <section>
          <h4 className="text-sm font-medium mb-3">系统主题色</h4>
          <ColorPicker />
        </section>

        <Divider className="my-4" />

        {/* 基础配置 */}
        <section>
          <h4 className="text-sm font-medium mb-3">基础配置</h4>
          <ConfigSwitch />
        </section>

        {/* 底部提示 */}
        <div className="mt-8 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
            <CheckOutlined className="mt-0.5" />
            <div>
              <div className="font-medium mb-1">配置已自动保存</div>
              <div className="text-blue-500 dark:text-blue-500">
                所有设置会自动保存到浏览器本地存储
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default LayoutSettings

