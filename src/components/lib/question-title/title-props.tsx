import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox, Select, message } from 'antd'
import { IQuestionTitleProps, QuestionTitleDefaultData } from './interface.ts'

const TitleProps: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const [form] = Form.useForm()
  const {
    text,
    level,
    isCenter,
    animateType,
    onChange,
    disabled,
    color,
    typewriter,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      text,
      level,
      isCenter,
      animateType,
      color,
      typewriter: {
        isOpen: typewriter?.isOpen,
        config: typewriter?.config,
      },
    })
  }, [text, level, isCenter, animateType, color, typewriter])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      if (values.text && values.text.length > 50) {
        message.warning('标题内容过长，请控制在50字以内')
        return
      }
      onChange(values as IQuestionTitleProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        text,
        level,
        isCenter,
        animateType,
        color,
        typewriter: {
          isOpen: typewriter?.isOpen || false,
          config:
            typewriter?.config || QuestionTitleDefaultData.typewriter?.config,
        },
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="标题内容"
        name="text"
        rules={[
          { required: true, message: '请输入标题内容！' },
          { max: 50, message: '标题内容过长，请控制在50字以内' },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="层级" name="level">
        <Select
          options={[1, 2, 3, 4, 5].map((v) => ({ label: `H${v}`, value: v }))}
        />
      </Form.Item>

      <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item label="自定义颜色" name="color">
        <Input className="w-16 h-8 border rounded" type="color" />
      </Form.Item>

      <Form.Item label="动画类型" name="animateType">
        <Select
          options={[
            { label: '无动画', value: 'none' },
            { label: '抖动效果', value: 'shake' },
            { label: '浮动效果', value: 'float' },
          ]}
        />
      </Form.Item>

      {/* 打字机效果配置 */}
      <Form.Item
        label="启用打字机效果"
        name={['typewriter', 'isOpen']}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      {typewriter?.isOpen && (
        <div className="pl-4 ml-8 mt-2 border-l-2 border-gray-100">
          <Form.Item
            label="打字速度(ms/字符)"
            name={['typewriter', 'config', 'speed']}
            rules={[
              {
                required: true,
                type: 'number',
                min: 10,
                message: '速度至少10ms/字符',
              },
            ]}
          >
            <InputNumber min={10} placeholder="建议50-200ms" />
          </Form.Item>

          <Form.Item
            label="光标字符"
            name={['typewriter', 'config', 'cursor']}
            rules={[{ required: true, message: '请输入光标字符' }]}
          >
            <Input maxLength={2} placeholder="例：⎟ |" />
          </Form.Item>

          <Form.Item
            label="无限循环"
            name={['typewriter', 'config', 'isInfinite']}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>

          {!typewriter?.config?.isInfinite && (
            <Form.Item
              label="循环次数"
              name={['typewriter', 'config', 'loopCount']}
              rules={[
                {
                  required: true,
                  type: 'number',
                  min: 1,
                  message: '至少1次循环',
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
          )}
        </div>
      )}
    </Form>
  )
}

export default TitleProps
