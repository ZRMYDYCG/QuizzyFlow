import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionDropdownProps } from './interface.ts'

const DropdownProps: React.FC<IQuestionDropdownProps> = (
  props: IQuestionDropdownProps
) => {
  const [form] = Form.useForm()
  const { buttonText, menu, placement, trigger, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      buttonText,
      menu,
      placement,
      trigger,
    })
  }, [buttonText, menu, placement, trigger])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionDropdownProps)
    }
  }

  // 常用图标选项
  const iconOptions = [
    { label: '无图标', value: '' },
    { label: '文件', value: 'FileOutlined' },
    { label: '编辑', value: 'EditOutlined' },
    { label: '删除', value: 'DeleteOutlined' },
    { label: '保存', value: 'SaveOutlined' },
    { label: '复制', value: 'CopyOutlined' },
    { label: '下载', value: 'DownloadOutlined' },
    { label: '上传', value: 'UploadOutlined' },
    { label: '设置', value: 'SettingOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '邮件', value: 'MailOutlined' },
    { label: '通知', value: 'BellOutlined' },
    { label: '搜索', value: 'SearchOutlined' },
    { label: '分享', value: 'ShareAltOutlined' },
    { label: '刷新', value: 'ReloadOutlined' },
  ]

  return (
    <Form
      layout="vertical"
      initialValues={{
        buttonText,
        menu,
        placement,
        trigger,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="按钮文本"
        name="buttonText"
        rules={[
          { required: true, message: '请输入按钮文本！' },
          { max: 20, message: '按钮文本过长，请控制在20字以内' },
        ]}
      >
        <Input placeholder="请输入按钮文本" />
      </Form.Item>

      <Form.Item label="弹出位置" name="placement">
        <Select
          options={[
            { label: '下左', value: 'bottomLeft' },
            { label: '下中', value: 'bottomCenter' },
            { label: '下右', value: 'bottomRight' },
            { label: '上左', value: 'topLeft' },
            { label: '上中', value: 'topCenter' },
            { label: '上右', value: 'topRight' },
          ]}
        />
      </Form.Item>

      <Form.Item label="触发方式" name="trigger">
        <Select
          options={[
            { label: '鼠标悬停', value: 'hover' },
            { label: '鼠标点击', value: 'click' },
          ]}
        />
      </Form.Item>

      <Form.Item label="菜单项列表">
        <Form.List name="menu">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 4,
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'label']}
                      rules={[{ required: true, message: '请输入菜单项文本' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="菜单项文本" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'icon']}
                      style={{ marginBottom: 8 }}
                    >
                      <Select
                        showSearch
                        placeholder="选择图标（可选）"
                        options={iconOptions}
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>

                    <Space>
                      <Form.Item
                        {...restField}
                        name={[name, 'disabled']}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>禁用</Checkbox>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'danger']}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>危险项</Checkbox>
                      </Form.Item>

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      >
                        删除
                      </Button>
                    </Space>
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      key: `${Date.now()}`,
                      label: '新菜单项',
                      icon: '',
                      disabled: false,
                      danger: false,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  添加菜单项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：菜单项点击事件可以在实际应用中自定义处理
      </div>
    </Form>
  )
}

export default DropdownProps

