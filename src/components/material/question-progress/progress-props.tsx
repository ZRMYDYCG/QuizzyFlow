import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Checkbox } from 'antd'
import { IQuestionProgressProps } from './interface.ts'

const ProgressProps: FC<IQuestionProgressProps> = (props: IQuestionProgressProps) => {
  const [form] = Form.useForm()

  const {
    percent,
    type,
    status,
    strokeColor,
    showInfo,
    label,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      percent,
      type,
      status,
      strokeColor,
      showInfo,
      label,
    })
  }, [percent, type, status, strokeColor, showInfo, label])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        percent,
        type,
        status,
        strokeColor,
        showInfo,
        label,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标签文字" name="label">
        <Input placeholder="完成进度" />
      </Form.Item>

      <Form.Item label="进度百分比" name="percent">
        <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
      </Form.Item>

      <Form.Item label="进度条类型" name="type">
        <Select>
          <Select.Option value="line">线型</Select.Option>
          <Select.Option value="circle">圆形</Select.Option>
          <Select.Option value="dashboard">仪表盘</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="状态" name="status">
        <Select>
          <Select.Option value="normal">正常</Select.Option>
          <Select.Option value="success">成功</Select.Option>
          <Select.Option value="exception">异常</Select.Option>
          <Select.Option value="active">进行中</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="进度条颜色" name="strokeColor">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="显示百分比" name="showInfo" valuePropName="checked">
        <Checkbox>显示百分比文字</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ProgressProps

