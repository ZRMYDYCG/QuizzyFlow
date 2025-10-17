import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionMenuProps } from './interface.ts'

const MenuProps: React.FC<IQuestionMenuProps> = (props: IQuestionMenuProps) => {
  const [form] = Form.useForm()
  const { mode, items, theme, selectedKeys, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      mode,
      items,
      theme,
      selectedKeys,
    })
  }, [mode, items, theme, selectedKeys])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionMenuProps)
    }
  }

  // 常用图标选项
  const iconOptions = [
    { label: '无图标', value: '' },
    { label: '主页', value: 'HomeOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '设置', value: 'SettingOutlined' },
    { label: '文件', value: 'FileOutlined' },
    { label: '文件夹', value: 'FolderOutlined' },
    { label: '邮件', value: 'MailOutlined' },
    { label: '日历', value: 'CalendarOutlined' },
    { label: '团队', value: 'TeamOutlined' },
    { label: '应用', value: 'AppstoreOutlined' },
    { label: '仪表盘', value: 'DashboardOutlined' },
    { label: '购物车', value: 'ShoppingCartOutlined' },
    { label: '心形', value: 'HeartOutlined' },
    { label: '星星', value: 'StarOutlined' },
    { label: '通知', value: 'BellOutlined' },
  ]

  // 渲染菜单项表单
  const renderMenuItemForm = (namePrefix: any, level: number = 0) => (
    <Form.List name={namePrefix}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div
              key={key}
              style={{
                marginBottom: 12,
                marginLeft: level * 20,
                padding: 12,
                background: level === 0 ? '#f5f5f5' : '#e8f4ff',
                borderRadius: 4,
                borderLeft: level > 0 ? '3px solid #1890ff' : 'none',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space style={{ width: '100%' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    rules={[{ required: true, message: '请输入菜单名称' }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Input placeholder="菜单名称" />
                  </Form.Item>

                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </Space>

                <Form.Item
                  {...restField}
                  name={[name, 'icon']}
                  style={{ marginBottom: 0 }}
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

                <Form.Item
                  {...restField}
                  name={[name, 'disabled']}
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox>禁用此菜单项</Checkbox>
                </Form.Item>

                {level === 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px dashed #d9d9d9',
                    }}
                  >
                    <div style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>
                      子菜单：
                    </div>
                    {renderMenuItemForm([name, 'children'], level + 1)}
                  </div>
                )}
              </Space>
            </div>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() =>
                add({
                  key: `${Date.now()}`,
                  label: level === 0 ? '新菜单项' : '新子菜单',
                  icon: '',
                  disabled: false,
                })
              }
              block
              icon={<PlusOutlined />}
              size="small"
            >
              添加{level === 0 ? '菜单项' : '子菜单'}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )

  return (
    <Form
      layout="vertical"
      initialValues={{
        mode,
        items,
        theme,
        selectedKeys,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item label="菜单模式" name="mode">
        <Select
          options={[
            { label: '垂直菜单', value: 'vertical' },
            { label: '水平菜单', value: 'horizontal' },
            { label: '内嵌菜单', value: 'inline' },
          ]}
        />
      </Form.Item>

      <Form.Item label="主题" name="theme">
        <Select
          options={[
            { label: '亮色主题', value: 'light' },
            { label: '暗色主题', value: 'dark' },
          ]}
        />
      </Form.Item>

      <Form.Item label="菜单项列表">
        {renderMenuItemForm('items')}
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：支持最多两级菜单结构
      </div>
    </Form>
  )
}

export default MenuProps

