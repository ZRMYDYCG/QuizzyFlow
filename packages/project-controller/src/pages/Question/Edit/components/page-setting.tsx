import React from 'react'
import { useEffect } from 'react'
import { Form, Input } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
import { resetPageInfo } from '../../../../store/modules/pageinfo-reducer.ts'

const PageSetting: React.FC = () => {
  const pageInfo = useGetPageInfo()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  // 更新表单内容
  useEffect(() => {
    form.setFieldsValue(pageInfo)
  }, [pageInfo])

  const handleValuesChange = () => {
    const values = form.getFieldsValue()
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
      <Form.Item label="样式代码" name="css">
        <Input.TextArea size="large" placeholder="请输入样式代码" />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <Input.TextArea size="large" placeholder="请输入脚本代码" />
      </Form.Item>
      <Form.Item label="封面" name="cover"></Form.Item>
      <Form.Item label="背景图" name="background"></Form.Item>
    </Form>
  )
}

export default PageSetting
