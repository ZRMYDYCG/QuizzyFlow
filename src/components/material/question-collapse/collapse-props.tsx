import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { IQuestionCollapseProps } from './interface.ts'

const CollapseProps: FC<IQuestionCollapseProps> = (
  props: IQuestionCollapseProps
) => {
  const [form] = Form.useForm()

  const {
    title,
    content,
    defaultExpanded,
    expandText,
    collapseText,
    showIcon,
    bordered,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      title,
      content,
      defaultExpanded,
      expandText,
      collapseText,
      showIcon,
      bordered,
    })
  }, [title, content, defaultExpanded, expandText, collapseText, showIcon, bordered])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        content,
        defaultExpanded,
        expandText,
        collapseText,
        showIcon,
        bordered,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="折叠标题"
        name="title"
        rules={[{ required: true, message: '请输入折叠标题' }]}
      >
        <Input placeholder="点击展开查看详情" />
      </Form.Item>

      <Form.Item
        label="折叠内容"
        name="content"
        rules={[{ required: true, message: '请输入折叠内容' }]}
      >
        <Input.TextArea
          rows={4}
          placeholder="这里是折叠的内容，可以放置较长的文本..."
        />
      </Form.Item>

      <Form.Item label="展开按钮文字" name="expandText">
        <Input placeholder="展开" />
      </Form.Item>

      <Form.Item label="收起按钮文字" name="collapseText">
        <Input placeholder="收起" />
      </Form.Item>

      <Form.Item label="默认展开" name="defaultExpanded" valuePropName="checked">
        <Checkbox>页面加载时默认展开</Checkbox>
      </Form.Item>

      <Form.Item label="显示图标" name="showIcon" valuePropName="checked">
        <Checkbox>显示展开/收起图标</Checkbox>
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Checkbox>显示边框</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default CollapseProps

