import React, { useState } from 'react'
import { Form, Input, Button, message, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons'
import { registerUser } from '@/api/modules/user'
import { useRequest } from 'ahooks'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const { run: register } = useRequest(
    async (values: any) => {
      setLoading(true)
      try {
        const { username, password, nickname } = values
        await registerUser({ username, password, nickname })
      } finally {
        setLoading(false)
      }
    },
    {
      manual: true,
      onSuccess: async () => {
        message.success('注册成功，请登录')
        navigate('/login')
      },
      onError: () => {
        setLoading(false)
      },
    }
  )

  const onFinish = (values: any) => {
    register(values)
  }

  const handleGoogleRegister = () => {
    message.info('Google 注册功能开发中...')
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧表单区域 */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-[#0f1419] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo和标题 */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-xl">Q</span>
              </div>
              <span className="text-white text-xl font-semibold">QuizzyFlow</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">创建你的账号</h1>
            <p className="text-gray-400">开始你的问卷创作之旅</p>
          </div>

          {/* Google注册按钮 */}
          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleGoogleRegister}
            className="mb-6 h-12 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-none"
          >
            <span className="font-medium">使用 Google 账号注册</span>
          </Button>

          {/* 分隔线 */}
          <Divider className="my-6">
            <span className="text-gray-500 text-sm">或</span>
          </Divider>

          {/* 注册表单 */}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入你的邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="请输入你的邮箱..."
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="nickname"
              rules={[
                { required: true, message: '请输入你的昵称' },
                { min: 2, max: 20, message: '昵称长度应为2-20个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入你的昵称..."
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入你的密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入你的密码..."
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认你的密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请再次输入密码..."
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
                className="h-12 text-base font-medium mt-2"
              >
                {loading ? '注册中...' : '创建账号'}
              </Button>
            </Form.Item>
          </Form>

          {/* 登录链接 */}
          <div className="text-center mt-6">
            <span className="text-gray-400">已有账号？</span>
            <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-1 font-medium">
              立即登录
            </Link>
          </div>

          {/* 服务条款 */}
          <div className="text-center mt-6 text-xs text-gray-500">
            注册即表示你同意我们的
            <Link to="/terms" className="text-blue-500 hover:text-blue-400 mx-1">
              服务条款
            </Link>
            和
            <Link to="/privacy" className="text-blue-500 hover:text-blue-400 mx-1">
              隐私政策
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧背景图区域 */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          {/* 渐变叠加层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30" />
          
          {/* 特性展示 */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4">为什么选择 QuizzyFlow？</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">拖拽式问卷编辑</p>
                    <p className="text-sm text-gray-200">可视化设计器，支持单选、多选、填空等多种题型</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">智能数据分析</p>
                    <p className="text-sm text-gray-200">自动生成图表报告，实时查看答卷统计</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">多端分享发布</p>
                    <p className="text-sm text-gray-200">一键生成链接，支持微信、邮件等多渠道分发</p>
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

export default Register
