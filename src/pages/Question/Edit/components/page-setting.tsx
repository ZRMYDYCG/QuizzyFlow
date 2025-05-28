import React from 'react'
import { useEffect } from 'react'
import { Form, Input, InputNumber, Button } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
import {
  resetPageInfo,
  setPagePadding,
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
    if (changedValues.padding !== undefined) {
      dispatch(setPagePadding(changedValues.padding))
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
        label="页面内边距"
        name="padding"
        rules={[{ required: true, message: '请输入内边距（如：16px）' }]}
      >
        <Input placeholder="示例：16px 24px" />
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
