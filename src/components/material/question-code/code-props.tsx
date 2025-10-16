import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Select } from 'antd'
import { IQuestionCodeProps } from './interface.ts'

const CodeProps: FC<IQuestionCodeProps> = (props: IQuestionCodeProps) => {
  const [form] = Form.useForm()

  const {
    code,
    language,
    showLineNumbers,
    theme,
    title,
    showCopyButton,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      code,
      language,
      showLineNumbers,
      theme,
      title,
      showCopyButton,
    })
  }, [code, language, showLineNumbers, theme, title, showCopyButton])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        code,
        language,
        showLineNumbers,
        theme,
        title,
        showCopyButton,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="代码内容"
        name="code"
        rules={[{ required: true, message: '请输入代码内容' }]}
      >
        <Input.TextArea
          rows={10}
          placeholder="在此输入代码"
          style={{
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
          }}
        />
      </Form.Item>

      <Form.Item label="编程语言" name="language">
        <Select>
          <Select.Option value="javascript">JavaScript</Select.Option>
          <Select.Option value="typescript">TypeScript</Select.Option>
          <Select.Option value="python">Python</Select.Option>
          <Select.Option value="java">Java</Select.Option>
          <Select.Option value="cpp">C++</Select.Option>
          <Select.Option value="c">C</Select.Option>
          <Select.Option value="csharp">C#</Select.Option>
          <Select.Option value="php">PHP</Select.Option>
          <Select.Option value="ruby">Ruby</Select.Option>
          <Select.Option value="go">Go</Select.Option>
          <Select.Option value="rust">Rust</Select.Option>
          <Select.Option value="swift">Swift</Select.Option>
          <Select.Option value="kotlin">Kotlin</Select.Option>
          <Select.Option value="sql">SQL</Select.Option>
          <Select.Option value="html">HTML</Select.Option>
          <Select.Option value="css">CSS</Select.Option>
          <Select.Option value="json">JSON</Select.Option>
          <Select.Option value="xml">XML</Select.Option>
          <Select.Option value="yaml">YAML</Select.Option>
          <Select.Option value="markdown">Markdown</Select.Option>
          <Select.Option value="bash">Bash</Select.Option>
          <Select.Option value="powershell">PowerShell</Select.Option>
          <Select.Option value="plaintext">纯文本</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="标题（可选）" name="title">
        <Input placeholder="输入代码块标题" />
      </Form.Item>

      <Form.Item label="主题" name="theme">
        <Select>
          <Select.Option value="light">浅色</Select.Option>
          <Select.Option value="dark">深色</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="显示行号"
        name="showLineNumbers"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="显示复制按钮"
        name="showCopyButton"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
    </Form>
  )
}

export default CodeProps

