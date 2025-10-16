import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Checkbox } from 'antd'
import { IQuestionDateProps } from './interface.ts'

const DateProps: FC<IQuestionDateProps> = (props: IQuestionDateProps) => {
  const [form] = Form.useForm()

  const {
    mode,
    format,
    label,
    placeholder,
    showTime,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      mode,
      format,
      label,
      placeholder,
      showTime,
    })
  }, [mode, format, label, placeholder, showTime])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const currentMode = Form.useWatch('mode', form)

  return (
    <Form
      layout="vertical"
      initialValues={{
        mode,
        format,
        label,
        placeholder,
        showTime,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标签文字" name="label">
        <Input placeholder="请选择日期" />
      </Form.Item>

      <Form.Item label="选择模式" name="mode">
        <Select>
          <Select.Option value="date">日期</Select.Option>
          <Select.Option value="time">时间</Select.Option>
          <Select.Option value="datetime">日期时间</Select.Option>
          <Select.Option value="range">日期范围</Select.Option>
        </Select>
      </Form.Item>

      {currentMode !== 'time' && currentMode !== 'datetime' && (
        <Form.Item label="日期格式" name="format">
          <Select>
            <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            <Select.Option value="YYYY/MM/DD">YYYY/MM/DD</Select.Option>
            <Select.Option value="DD-MM-YYYY">DD-MM-YYYY</Select.Option>
            <Select.Option value="MM-DD-YYYY">MM-DD-YYYY</Select.Option>
          </Select>
        </Form.Item>
      )}

      <Form.Item label="占位符" name="placeholder">
        <Input placeholder="请选择" />
      </Form.Item>

      {currentMode === 'range' && (
        <Form.Item label="包含时间" name="showTime" valuePropName="checked">
          <Checkbox>选择日期时间范围</Checkbox>
        </Form.Item>
      )}
    </Form>
  )
}

export default DateProps

