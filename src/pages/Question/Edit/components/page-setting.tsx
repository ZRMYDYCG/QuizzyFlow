import React from 'react'
import { useEffect } from 'react'
import { Form, Input, Button, Radio, Switch, Select, Slider } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
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
} from '../../../../store/modules/pageinfo-reducer.ts'

const { Option } = Select

const PageSetting: React.FC = () => {
  const pageInfo = useGetPageInfo()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

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

  return (
    <Form
      layout="vertical"
      initialValues={pageInfo}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="问卷标题"
        name="title"
        rules={[{ required: true, message: '请输入问卷标题' }]}
      >
        <Input placeholder="请输入问卷标题" />
      </Form.Item>

      <Form.Item label="问卷描述" name="desc">
        <Input.TextArea size="large" placeholder="请输入问卷描述" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="页面方向"
          name="layout"
          rules={[{ required: true, message: '请选择页面方向' }]}
        >
          <Radio.Group>
            <Radio value="left">居左</Radio>
            <Radio value="center">居中</Radio>
            <Radio value="right">居右</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="最大宽度"
          name="maxWidth"
          tooltip="设置页面内容的最大宽度（如：1200px 或 80%）"
        >
          <Input placeholder="示例：1200px 或 80%" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="页面内边距"
          name="padding"
          rules={[{ required: true, message: '请输入内边距' }]}
        >
          <Input placeholder="示例：16px 或 24px" />
        </Form.Item>

        <Form.Item
          label="组件圆角"
          name="borderRadius"
          tooltip="设置组件的圆角大小"
        >
          <Input placeholder="示例：8px 或 16px" />
        </Form.Item>
      </div>

      <Form.Item label="背景图片" name="bgImage" tooltip="输入图片URL地址">
        <Input placeholder="输入背景图片URL" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="背景重复"
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
          label="背景位置"
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
        label="视差滚动效果"
        name="parallaxEffect"
        valuePropName="checked"
        tooltip="开启后背景图片固定，产生滚动视差效果"
      >
        <Switch />
      </Form.Item>

      <Form.Item label="样式代码" name="css">
        <Input.TextArea size="large" placeholder="请输入样式代码" rows={4} />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <Input.TextArea size="large" placeholder="请输入脚本代码" rows={4} />
      </Form.Item>
    </Form>
  )
}

export default PageSetting
