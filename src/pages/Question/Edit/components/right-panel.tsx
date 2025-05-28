import React, { useEffect } from 'react'
import { useState } from 'react'
import { Tabs } from 'antd'
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import ComponentProp from './components-prop'
import PageSetting from './page-setting'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo'

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
        <span>
          <FileTextOutlined />
          属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: 'setting',
      label: (
        <span>
          <SettingOutlined />
          页面设置
        </span>
      ),
      children: <PageSetting />,
    },
  ]
  return (
    <Tabs
      items={tabsItems}
      activeKey={activeKey}
      onChange={setActiveKey}
    ></Tabs>
  )
}

export default RightPanel
