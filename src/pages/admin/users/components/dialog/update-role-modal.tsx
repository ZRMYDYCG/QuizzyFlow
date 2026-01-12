import React, { useEffect, useState } from 'react'
import { Modal, Form, Select, message } from 'antd'
import { updateUserRoleAPI } from '@/api/modules/admin'

interface UpdateRoleModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  user: any
  roles: any[]
}

const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({
  open,
  onCancel,
  onSuccess,
  user,
  roles,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({ role: user.role })
    }
  }, [open, user, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateUserRoleAPI(user._id, values)
      message.success('角色更新成功')
      form.resetFields()
      onSuccess()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
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
      title="修改用户角色"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
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
      </Form>
    </Modal>
  )
}

export default UpdateRoleModal
