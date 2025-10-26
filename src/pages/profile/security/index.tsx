import React from 'react'
import { Card, Form, Input, Button, message, Typography, Alert } from 'antd'
import { LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { changePassword } from '@/api/modules/user'
import { useRequest } from 'ahooks'

const { Title, Text } = Typography

const ProfileSecurity: React.FC = () => {
  const [form] = Form.useForm()

  const { run: runChangePassword, loading } = useRequest(
    async (values: any) => {
      return await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('密码修改成功，请重新登录')
        form.resetFields()
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 3000)
      },
    }
  )

  const handleSubmit = async (values: any) => {
    runChangePassword(values)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      {/* 修改密码 */}
      <Card className="shadow-md">
        <Title level={3} className="!mb-4 md:!mb-6 text-lg md:text-2xl">
          <SafetyOutlined className="mr-2" />
          修改密码
        </Title>

        <Alert
          message="密码安全提示"
          description="为了您的账户安全，建议定期更换密码。密码长度至少6位，建议包含字母、数字和特殊字符。"
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* 原密码 */}
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              { required: true, message: '请输入原密码' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入原密码"
              size="large"
              autoComplete="off"
            />
          </Form.Item>

          {/* 新密码 */}
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' },
              { max: 30, message: '密码长度不能超过30位' },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: '密码必须包含字母和数字',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码（至少6位，包含字母和数字）"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          {/* 确认密码 */}
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 安全建议 */}
      <Card title="安全建议" className="shadow-md">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">1</Text>
            </div>
            <div>
              <Text strong className="block mb-1">使用强密码</Text>
              <Text type="secondary">
                密码长度至少8位，包含大小写字母、数字和特殊字符
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">2</Text>
            </div>
            <div>
              <Text strong className="block mb-1">定期更换密码</Text>
              <Text type="secondary">
                建议每3-6个月更换一次密码，提高账户安全性
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">3</Text>
            </div>
            <div>
              <Text strong className="block mb-1">不要使用相同密码</Text>
              <Text type="secondary">
                不要在多个网站使用相同的密码，避免撞库风险
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">4</Text>
            </div>
            <div>
              <Text strong className="block mb-1">注意登录环境</Text>
              <Text type="secondary">
                不要在公共场所或不受信任的设备上登录账户
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfileSecurity

