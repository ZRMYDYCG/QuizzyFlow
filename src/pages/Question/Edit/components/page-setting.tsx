import React from 'react'
import { useEffect } from 'react'
import { Form, Input, InputNumber, Button, Radio, Switch } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
import {
  resetPageInfo,
  setPagePadding,
  setPageLayout,
  setMaxWidth,
  setBgImage,
} from '../../../../store/modules/pageinfo-reducer.ts'

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

      <Form.Item
        label="页面内边距"
        name="padding"
        rules={[{ required: true, message: '请输入内边距（如：16px）' }]}
      >
        <Input placeholder="示例：16px 24px" />
      </Form.Item>

      <Form.Item label="背景图片" name="bgImage" tooltip="输入图片URL地址">
        <Input placeholder="输入背景图片URL" />
      </Form.Item>

      <Form.Item label="样式代码" name="css">
        <Input.TextArea size="large" placeholder="请输入样式代码" />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <Input.TextArea size="large" placeholder="请输入脚本代码" />
      </Form.Item>
    </Form>
  )
}

export default PageSetting
