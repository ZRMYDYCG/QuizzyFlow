import React from 'react'
import { useEffect } from 'react'
import { Form, Input, Button, Radio, Switch, Select, Slider } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import {
  resetPageInfo,
  setPagePadding,
  setPageLayout,
  setMaxWidth,
  setBgImage,
  setBgRepeat,
  setBgPosition,
  setParallaxEffect,
  setBorderRadius,
} from '@/store/modules/pageinfo-reducer'
import { useTheme } from '@/contexts/ThemeContext'

const { Option } = Select

const PageSetting: React.FC = () => {
  const pageInfo = useGetPageInfo()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const { theme, primaryColor, themeColors } = useTheme()

  useEffect(() => {
    form.setFieldsValue(pageInfo)
  }, [pageInfo])

  const handleValuesChange = (changedValues: any) => {
    const values = form.getFieldsValue()

    // 处理特定字段的变化
    if (changedValues.padding !== undefined) {
      dispatch(setPagePadding(changedValues.padding))
    }
    if (changedValues.layout !== undefined) {
      dispatch(setPageLayout(changedValues.layout))
    }
    if (changedValues.maxWidth !== undefined) {
      dispatch(setMaxWidth(changedValues.maxWidth))
    }
    if (changedValues.bgImage !== undefined) {
      dispatch(setBgImage(changedValues.bgImage))
    }
    if (changedValues.bgRepeat !== undefined) {
      dispatch(setBgRepeat(changedValues.bgRepeat))
    }
    if (changedValues.bgPosition !== undefined) {
      dispatch(setBgPosition(changedValues.bgPosition))
    }
    if (changedValues.parallaxEffect !== undefined) {
      dispatch(setParallaxEffect(changedValues.parallaxEffect))
    }
    if (changedValues.borderRadius !== undefined) {
      dispatch(setBorderRadius(changedValues.borderRadius))
    }

    dispatch(resetPageInfo(values))
  }

  // 文本颜色
  const titleClass = theme === 'dark' ? 'text-slate-200' : 'text-gray-900'
  const labelClass = theme === 'dark' ? 'text-slate-300' : 'text-gray-700'

  return (
    <div className="h-full overflow-y-auto px-3 py-4 custom-scrollbar">
      <Form
        layout="vertical"
        initialValues={pageInfo}
        onValuesChange={handleValuesChange}
        form={form}
      >
        {/* 基础信息 */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span 
              className="w-1 h-4 rounded-full mr-2" 
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            />
            <span className={`text-sm font-semibold ${titleClass}`}>基础信息</span>
          </div>
          
          <Form.Item
            label={<span className={labelClass}>问卷标题</span>}
            name="title"
            rules={[{ required: true, message: '请输入问卷标题' }]}
          >
            <Input placeholder="请输入问卷标题" />
          </Form.Item>

          <Form.Item label={<span className={labelClass}>问卷描述</span>} name="desc">
            <Input.TextArea size="large" placeholder="请输入问卷描述" rows={3} />
          </Form.Item>
        </div>

        {/* 布局设置 */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span 
              className="w-1 h-4 rounded-full mr-2" 
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            />
            <span className={`text-sm font-semibold ${titleClass}`}>布局设置</span>
          </div>
          
          <Form.Item
            label={<span className={labelClass}>页面方向</span>}
            name="layout"
            rules={[{ required: true, message: '请选择页面方向' }]}
          >
            <Radio.Group>
              <Radio value="left">居左</Radio>
              <Radio value="center">居中</Radio>
              <Radio value="right">居右</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={<span className={labelClass}>最大宽度</span>}
              name="maxWidth"
              tooltip="设置页面内容的最大宽度（如：1200px 或 80%）"
            >
              <Input placeholder="1200px 或 80%" />
            </Form.Item>

            <Form.Item
              label={<span className={labelClass}>页面内边距</span>}
              name="padding"
              rules={[{ required: true, message: '请输入内边距' }]}
            >
              <Input placeholder="16px 或 24px" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className={labelClass}>组件圆角</span>}
            name="borderRadius"
            tooltip="设置组件的圆角大小"
          >
            <Input placeholder="8px 或 16px" />
          </Form.Item>
        </div>

        {/* 背景设置 */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span 
              className="w-1 h-4 rounded-full mr-2" 
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            />
            <span className={`text-sm font-semibold ${titleClass}`}>背景设置</span>
          </div>

          <Form.Item 
            label={<span className={labelClass}>背景图片</span>} 
            name="bgImage" 
            tooltip="输入图片URL地址"
          >
            <Input placeholder="输入背景图片URL" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={<span className={labelClass}>背景重复</span>}
              name="bgRepeat"
              tooltip="设置背景图片的重复方式"
            >
              <Select>
                <Option value="no-repeat">不重复</Option>
                <Option value="repeat">重复</Option>
                <Option value="repeat-x">水平重复</Option>
                <Option value="repeat-y">垂直重复</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className={labelClass}>背景位置</span>}
              name="bgPosition"
              tooltip="设置背景图片的位置"
            >
              <Select>
                <Option value="top">顶部</Option>
                <Option value="center">居中</Option>
                <Option value="bottom">底部</Option>
                <Option value="left">左侧</Option>
                <Option value="right">右侧</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label={<span className={labelClass}>视差滚动效果</span>}
            name="parallaxEffect"
            valuePropName="checked"
            tooltip="开启后背景图片固定，产生滚动视差效果"
          >
            <Switch />
          </Form.Item>
        </div>

        {/* 高级设置 */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span 
              className="w-1 h-4 rounded-full mr-2" 
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            />
            <span className={`text-sm font-semibold ${titleClass}`}>高级设置</span>
          </div>

          <Form.Item label={<span className={labelClass}>自定义样式</span>} name="css">
            <Input.TextArea 
              placeholder="请输入自定义 CSS 样式代码" 
              rows={4}
              className="font-mono text-xs"
            />
          </Form.Item>
          
          <Form.Item label={<span className={labelClass}>自定义脚本</span>} name="js">
            <Input.TextArea 
              placeholder="请输入自定义 JavaScript 脚本代码" 
              rows={4}
              className="font-mono text-xs"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default PageSetting
