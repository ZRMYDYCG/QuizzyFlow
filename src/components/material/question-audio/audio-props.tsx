import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Slider } from 'antd'
import { IQuestionAudioProps } from './interface.ts'

const AudioProps: FC<IQuestionAudioProps> = (props: IQuestionAudioProps) => {
  const [form] = Form.useForm()

  const {
    src,
    autoplay,
    loop,
    controls,
    volume,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      src,
      autoplay,
      loop,
      controls,
      volume,
    })
  }, [src, autoplay, loop, controls, volume])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        src,
        autoplay,
        loop,
        controls,
        volume,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="音频URL"
        name="src"
        rules={[{ required: true, message: '请输入音频URL' }]}
      >
        <Input.TextArea rows={2} placeholder="https://example.com/audio.mp3" />
      </Form.Item>

      <Form.Item label="默认音量" name="volume">
        <Slider min={0} max={100} marks={{ 0: '0%', 50: '50%', 100: '100%' }} />
      </Form.Item>

      <Form.Item label="显示控制条" name="controls" valuePropName="checked">
        <Checkbox>显示播放控制条</Checkbox>
      </Form.Item>

      <Form.Item label="自动播放" name="autoplay" valuePropName="checked">
        <Checkbox>页面加载后自动播放</Checkbox>
      </Form.Item>

      <Form.Item label="循环播放" name="loop" valuePropName="checked">
        <Checkbox>循环播放音频</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default AudioProps

