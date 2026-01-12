import React, { useState } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { createAdminUserAPI } from '@/api/modules/admin'

interface CreateUserModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  roles: any[]
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onCancel,
  onSuccess,
  roles,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createAdminUserAPI(values)
      message.success('用户创建成功')
      form.resetFields()
      onSuccess()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="创建用户"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="用户名（邮箱）"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="用户昵称" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' },
          ]}
        >
          <Input.Password placeholder="至少6位密码" />
        </Form.Item>
        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="选择角色">
            {Array.isArray(roles) &&
              roles.map((role) => (
                <Select.Option key={role.name} value={role.name}>
                  {role.displayName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input placeholder="手机号码（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUserModal
