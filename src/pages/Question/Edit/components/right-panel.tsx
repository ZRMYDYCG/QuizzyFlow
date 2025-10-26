import React, { useEffect } from 'react'
import { useState } from 'react'
import { Tabs } from 'antd'
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import ComponentProp from './components-prop'
import PageSetting from './page-setting'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import TextAIProvider from '@/features/ai-assistant/components/TextAIProvider'

const RightPanel: React.FC = () => {
  const [activeKey, setActiveKey] = useState('prop')
  const { selectedId } = useGetComponentInfo()

  useEffect(() => {
    if (selectedId) setActiveKey('prop')
    else setActiveKey('setting')
  }, [selectedId])

  const tabsItems = [
    {
      key: 'prop',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          <span>物料属性</span>
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: 'setting',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          <span>页面设置</span>
        </span>
      ),
      children: <PageSetting />,
    },
  ]
  
  return (
    <TextAIProvider enabled={true}>
      <div className="flex flex-col h-full">
        <Tabs
          items={tabsItems}
          activeKey={activeKey}
          onChange={setActiveKey}
          className="flex-1 overflow-hidden [&_.ant-tabs-content]:h-full [&_.ant-tabs-tabpane]:h-full"
          tabBarStyle={{ 
            marginBottom: 0, 
            paddingLeft: 12, 
            paddingRight: 12,
            paddingTop: 8
          }}
        />
      </div>
    </TextAIProvider>
  )
}

export default RightPanel
