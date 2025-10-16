import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Checkbox } from 'antd'
import { IQuestionUploadProps } from './interface.ts'

const UploadProps: FC<IQuestionUploadProps> = (props: IQuestionUploadProps) => {
  const [form] = Form.useForm()

  const {
    label,
    accept,
    maxCount,
    maxSize,
    listType,
    multiple,
    drag,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      label,
      accept,
      maxCount,
      maxSize,
      listType,
      multiple,
      drag,
    })
  }, [label, accept, maxCount, maxSize, listType, multiple, drag])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        label,
        accept,
        maxCount,
        maxSize,
        listType,
        multiple,
        drag,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标签文字" name="label">
        <Input placeholder="上传文件" />
      </Form.Item>

      <Form.Item label="文件类型" name="accept">
        <Select>
          <Select.Option value="*">全部文件</Select.Option>
          <Select.Option value="image/*">图片</Select.Option>
          <Select.Option value=".pdf,.doc,.docx">文档</Select.Option>
          <Select.Option value=".zip,.rar">压缩包</Select.Option>
          <Select.Option value="video/*">视频</Select.Option>
          <Select.Option value="audio/*">音频</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="最大数量" name="maxCount">
        <InputNumber min={1} max={20} style={{ width: '100%' }} addonAfter="个" />
      </Form.Item>

      <Form.Item label="单文件大小限制" name="maxSize">
        <InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="MB" />
      </Form.Item>

      <Form.Item label="列表样式" name="listType">
        <Select>
          <Select.Option value="text">文本列表</Select.Option>
          <Select.Option value="picture">图片列表</Select.Option>
          <Select.Option value="picture-card">卡片列表</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="多文件上传" name="multiple" valuePropName="checked">
        <Checkbox>允许同时选择多个文件</Checkbox>
      </Form.Item>

      <Form.Item label="拖拽上传" name="drag" valuePropName="checked">
        <Checkbox>启用拖拽上传区域</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default UploadProps

