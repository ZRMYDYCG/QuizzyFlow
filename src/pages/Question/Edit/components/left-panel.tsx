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
        <span>
          <AppstoreAddOutlined />
          <span>物料基础</span>
        </span>
      ),
      children: <ComponentsLib />,
    },
    {
      key: 'template',
      label: (
        <span>
          <RadarChartOutlined />
          <span>物料组合</span>
        </span>
      ),
      children: <TemplateLib />,
    },
    {
      key: 'layers',
      label: (
        <span>
          <BarChartOutlined />
          <span>画布图层</span>
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
