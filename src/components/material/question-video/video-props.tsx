import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox } from 'antd'
import { IQuestionVideoProps } from './interface.ts'

const VideoProps: FC<IQuestionVideoProps> = (props: IQuestionVideoProps) => {
  const [form] = Form.useForm()

  const {
    src,
    width,
    height,
    autoplay,
    loop,
    controls,
    muted,
    poster,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      src,
      width,
      height,
      autoplay,
      loop,
      controls,
      muted,
      poster,
    })
  }, [src, width, height, autoplay, loop, controls, muted, poster])

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
        width,
        height,
        autoplay,
        loop,
        controls,
        muted,
        poster,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="视频URL"
        name="src"
        rules={[{ required: true, message: '请输入视频URL' }]}
      >
        <Input.TextArea rows={2} placeholder="https://example.com/video.mp4" />
      </Form.Item>

      <Form.Item label="封面图URL" name="poster">
        <Input placeholder="视频封面图片URL（可选）" />
      </Form.Item>

      <Form.Item label="宽度" name="width">
        <InputNumber min={200} max={1200} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="高度" name="height">
        <InputNumber min={150} max={800} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="显示控制条" name="controls" valuePropName="checked">
        <Checkbox>显示播放控制条</Checkbox>
      </Form.Item>

      <Form.Item label="自动播放" name="autoplay" valuePropName="checked">
        <Checkbox>页面加载后自动播放</Checkbox>
      </Form.Item>

      <Form.Item label="循环播放" name="loop" valuePropName="checked">
        <Checkbox>循环播放视频</Checkbox>
      </Form.Item>

      <Form.Item label="静音播放" name="muted" valuePropName="checked">
        <Checkbox>默认静音</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default VideoProps

