import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Switch, message } from 'antd'
import { updateAdminUserAPI } from '@/api/modules/admin'
import { ROLES } from '@/constants/roles'

interface EditUserModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  user: any | null
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onCancel,
  onSuccess,
  user,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        nickname: user.nickname,
        phone: user.phone || '',
        bio: user.bio || '',
        isActive: user.isActive !== false,
      })
    }
  }, [open, user, form])

  const handleOk = async () => {
    if (!user) return
    if (user.role === ROLES.SUPER_ADMIN) {
      message.warning('不能编辑超级管理员')
      return
    }

    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateAdminUserAPI(user._id, values)
      message.success('用户信息已更新')
      form.resetFields()
      onSuccess()
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.response?.data?.message || '更新失败')
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
      title={`编辑用户 — ${user?.nickname || ''}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={520}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label="用户名（邮箱）">
          <Input value={user?.username} disabled />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="用户昵称" maxLength={50} />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input placeholder="手机号码（可选）" maxLength={20} />
        </Form.Item>
        <Form.Item label="个人简介" name="bio">
          <Input.TextArea placeholder="个人简介（可选）" rows={3} maxLength={200} />
        </Form.Item>
        <Form.Item
          label="账号启用"
          name="isActive"
          valuePropName="checked"
          extra="关闭后用户将无法登录；若用户已封禁，启用账号会同时解除封禁"
        >
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditUserModal
