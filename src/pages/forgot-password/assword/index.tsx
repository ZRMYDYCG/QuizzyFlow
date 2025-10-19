import React, { useState } from 'react'
import { Form, Input, Button, message, Result } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const onFinish = async (values: { email: string }) => {
    setLoading(true)
    try {
      // TODO: 调用重置密码API
      // await resetPasswordRequest(values.email)
      
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setEmail(values.email)
      setEmailSent(true)
      message.success('重置密码邮件已发送')
    } catch (error) {
      message.error('发送失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12">
        <div className="w-full max-w-md">
          <Result
            status="success"
            title="邮件已发送！"
            subTitle={
              <div className="text-gray-600">
                <p className="mb-2">
                  我们已向 <strong>{email}</strong> 发送了密码重置链接
                </p>
                <p className="text-sm">请检查你的邮箱（包括垃圾邮件文件夹），并点击链接重置密码</p>
              </div>
            }
            extra={[
              <Button type="primary" key="login" onClick={() => navigate('/login')}>
                返回登录
              </Button>,
              <Button key="resend" onClick={() => setEmailSent(false)}>
                重新发送
              </Button>,
            ]}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧表单区域 */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-[#0f1419] px-6 py-12">
        <div className="w-full max-w-md">
          {/* 返回按钮 */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftOutlined />
            <span>返回登录</span>
          </Link>

          {/* Logo和标题 */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-xl">Q</span>
              </div>
              <span className="text-white text-xl font-semibold">QuizzyFlow</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">忘记密码？</h1>
            <p className="text-gray-400">
              输入你的注册邮箱，我们将向你发送重置密码的链接
            </p>
          </div>

          {/* 重置密码表单 */}
          <Form
            form={form}
            name="forgot-password"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入你的邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="请输入你的注册邮箱..."
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 text-base font-medium"
              >
                {loading ? '发送中...' : '发送重置链接'}
              </Button>
            </Form.Item>
          </Form>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-blue-400">提示：</strong>
              重置链接将在24小时内有效。如果没有收到邮件，请检查垃圾邮件文件夹或稍后重试。
            </p>
          </div>

          {/* 其他选项 */}
          <div className="text-center mt-8">
            <span className="text-gray-400">想起密码了？</span>
            <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-1 font-medium">
              立即登录
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧背景图区域 */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')`,
          }}
        >
          {/* 渐变叠加层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40" />

          {/* 信息卡片 */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4">账户安全保护</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">邮箱验证</p>
                    <p className="text-sm text-gray-200">确保只有你能重置密码</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">限时链接</p>
                    <p className="text-sm text-gray-200">重置链接24小时后失效</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">数据安全</p>
                    <p className="text-sm text-gray-200">你的数据始终受到保护</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

