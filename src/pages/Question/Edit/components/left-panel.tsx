import React from 'react'
import { Tabs } from 'antd'
import ComponentsLib from './components-lib'
import Layers from './layers'
import { AppstoreAddOutlined, BarChartOutlined } from '@ant-design/icons'

const LeftPanel: React.FC = () => {
  const tabsItems = [
    {
      key: 'componentLib',
      label: (
        <span>
          <AppstoreAddOutlined />
          <span>组件库</span>
        </span>
      ),
      children: <ComponentsLib />,
    },
    {
      key: 'layers',
      label: (
        <span>
          <BarChartOutlined />
          <span>图层</span>
        </span>
      ),
      children: <Layers />,
    },
  ]

  return (
    <>
      <Tabs defaultActiveKey="componentLib" items={tabsItems}></Tabs>
    </>
  )
}

export default LeftPanel
