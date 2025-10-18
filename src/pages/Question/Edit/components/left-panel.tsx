import React from 'react'
import { Tabs } from 'antd'
import ComponentsLib from './components-lib'
import Layers from './layers'
import TemplateLib from './template-lib'
import {
  AppstoreAddOutlined,
  BarChartOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'

const LeftPanel: React.FC = () => {
  const tabsItems = [
    {
      key: 'componentLib',
      label: (
        <span className="flex items-center gap-2">
          <AppstoreAddOutlined />
          <span>基础物料</span>
        </span>
      ),
      children: <ComponentsLib />,
    },
    {
      key: 'template',
      label: (
        <span className="flex items-center gap-2">
          <RadarChartOutlined />
          <span>物料组合</span>
        </span>
      ),
      children: <TemplateLib />,
    },
    {
      key: 'layers',
      label: (
        <span className="flex items-center gap-2">
          <BarChartOutlined />
          <span>画布图层</span>
        </span>
      ),
      children: <Layers />,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Tabs 
        defaultActiveKey="componentLib" 
        items={tabsItems}
        className="flex-1 overflow-hidden [&_.ant-tabs-content]:h-full [&_.ant-tabs-tabpane]:h-full"
        tabBarStyle={{ 
          marginBottom: 0, 
          paddingLeft: 12, 
          paddingRight: 12,
          paddingTop: 8
        }}
      />
    </div>
  )
}

export default LeftPanel
