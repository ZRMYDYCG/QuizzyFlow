import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox } from 'antd'
import { IQuestionButtonProps } from './interface.ts'

const ButtonProps: React.FC<IQuestionButtonProps> = (
  props: IQuestionButtonProps
) => {
  const [form] = Form.useForm()
  const {
    text,
    type,
    size,
    disabled,
    loading,
    icon,
    shape,
    danger,
    block,
    onClick,
    onChange,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      text,
      type,
      size,
      disabled,
      loading,
      icon,
      shape,
      danger,
      block,
      onClick,
    })
  }, [text, type, size, disabled, loading, icon, shape, danger, block, onClick])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionButtonProps)
    }
  }

  // 常用图标选项
  const iconOptions = [
    { label: '无图标', value: '' },
    { label: '搜索', value: 'SearchOutlined' },
    { label: '保存', value: 'SaveOutlined' },
    { label: '删除', value: 'DeleteOutlined' },
    { label: '编辑', value: 'EditOutlined' },
    { label: '添加', value: 'PlusOutlined' },
    { label: '下载', value: 'DownloadOutlined' },
    { label: '上传', value: 'UploadOutlined' },
    { label: '检查', value: 'CheckOutlined' },
    { label: '关闭', value: 'CloseOutlined' },
    { label: '设置', value: 'SettingOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '主页', value: 'HomeOutlined' },
    { label: '邮件', value: 'MailOutlined' },
    { label: '心形', value: 'HeartOutlined' },
    { label: '星星', value: 'StarOutlined' },
    { label: '眼睛', value: 'EyeOutlined' },
    { label: '锁', value: 'LockOutlined' },
    { label: '解锁', value: 'UnlockOutlined' },
    { label: '右箭头', value: 'RightOutlined' },
    { label: '左箭头', value: 'LeftOutlined' },
    { label: '向上', value: 'UpOutlined' },
    { label: '向下', value: 'DownOutlined' },
  ]

  return (
    <Form
      layout="vertical"
      initialValues={{
        text,
        type,
        size,
        disabled,
        loading,
        icon,
        shape,
        danger,
        block,
        onClick,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="按钮文本"
        name="text"
        rules={[
          { required: true, message: '请输入按钮文本！' },
          { max: 20, message: '按钮文本过长，请控制在20字以内' },
        ]}
      >
        <Input placeholder="请输入按钮文本" />
      </Form.Item>

      <Form.Item label="按钮类型" name="type">
        <Select
          options={[
            { label: '主按钮', value: 'primary' },
            { label: '默认按钮', value: 'default' },
            { label: '虚线按钮', value: 'dashed' },
            { label: '文本按钮', value: 'text' },
            { label: '链接按钮', value: 'link' },
          ]}
        />
      </Form.Item>

      <Form.Item label="按钮尺寸" name="size">
        <Select
          options={[
            { label: '大', value: 'large' },
            { label: '中', value: 'middle' },
            { label: '小', value: 'small' },
          ]}
        />
      </Form.Item>

      <Form.Item label="按钮形状" name="shape">
        <Select
          options={[
            { label: '默认', value: 'default' },
            { label: '圆形', value: 'circle' },
            { label: '圆角', value: 'round' },
          ]}
        />
      </Form.Item>

      <Form.Item label="图标" name="icon">
        <Select
          showSearch
          placeholder="选择图标"
          options={iconOptions}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="点击跳转/操作"
        name="onClick"
        tooltip="输入链接地址或路径"
      >
        <Input placeholder="例如: https://example.com 或 /home" />
      </Form.Item>

      <Form.Item label="危险按钮" name="danger" valuePropName="checked">
        <Checkbox>显示为危险按钮（红色）</Checkbox>
      </Form.Item>

      <Form.Item label="块级按钮" name="block" valuePropName="checked">
        <Checkbox>按钮宽度适应父元素</Checkbox>
      </Form.Item>

      <Form.Item label="禁用状态" name="disabled" valuePropName="checked">
        <Checkbox>禁用按钮</Checkbox>
      </Form.Item>

      <Form.Item label="加载状态" name="loading" valuePropName="checked">
        <Checkbox>显示加载动画</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ButtonProps

