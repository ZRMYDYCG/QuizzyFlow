import React, { FC, useEffect } from 'react'
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd'
import { IQuestionTimerProps } from './interface.ts'

const TimerProps: FC<IQuestionTimerProps> = (props: IQuestionTimerProps) => {
  const [form] = Form.useForm()

  const {
    mode,
    duration,
    format,
    showProgress,
    autoStart,
    title,
    warningTime,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      mode,
      duration,
      format,
      showProgress,
      autoStart,
      title,
      warningTime,
    })
  }, [mode, duration, format, showProgress, autoStart, title, warningTime])

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
        duration,
        format,
        showProgress,
        autoStart,
        title,
        warningTime,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="计时器标题" />
      </Form.Item>

      <Form.Item label="模式" name="mode">
        <Radio.Group>
          <Radio value="countdown">倒计时</Radio>
          <Radio value="stopwatch">正计时</Radio>
        </Radio.Group>
      </Form.Item>

      {currentMode === 'countdown' && (
        <>
          <Form.Item
            label="倒计时时长"
            name="duration"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <InputNumber
              min={1}
              max={86400}
              style={{ width: '100%' }}
              addonAfter="秒"
            />
          </Form.Item>

          <Form.Item
            label="警告时间"
            name="warningTime"
            tooltip="剩余时间少于此值时显示红色警告"
          >
            <InputNumber
              min={0}
              max={3600}
              style={{ width: '100%' }}
              addonAfter="秒"
            />
          </Form.Item>

          <Form.Item label="显示进度条" name="showProgress" valuePropName="checked">
            <Checkbox>显示进度条</Checkbox>
          </Form.Item>
        </>
      )}

      <Form.Item label="时间格式" name="format">
        <Select>
          <Select.Option value="HH:MM:SS">时:分:秒</Select.Option>
          <Select.Option value="MM:SS">分:秒</Select.Option>
          <Select.Option value="SS">秒</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="自动开始" name="autoStart" valuePropName="checked">
        <Checkbox>页面加载后自动开始</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default TimerProps

