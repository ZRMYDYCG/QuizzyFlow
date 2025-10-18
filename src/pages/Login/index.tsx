import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, message, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { loginUser } from '@/api/modules/user'
import { useRequest } from 'ahooks'

// 用户评价数据
const testimonials = [
  {
    text: '这个平台让我的问卷收集效率提升了3倍，数据分析功能特别强大。',
    author: '一勺',
    role: '市场调研经理',
  },
  {
    text: 'QuizzyFlow的界面设计很直观，团队协作功能让我们的工作更高效了。',
    author: 'Janike',
    role: '产品经理',
  },
  {
    text: '从问卷设计到数据导出，整个流程非常流畅，强烈推荐！',
    author: 'Smith',
    role: 'HR主管',
  },
  {
    text: '支持多种题型和逻辑跳转，满足了我们复杂的调研需求。',
    author: 'JustHappy',
    role: '用户研究员',
  },
]

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // 评价轮播效果
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // 每5秒切换一次

    return () => clearInterval(timer)
  }, [])

  const { run: login } = useRequest(
    async (values: any) => {
      setLoading(true)
      try {
        return await loginUser(values)
      } finally {
        setLoading(false)
      }
    },
    {
      manual: true,
      onSuccess: async (result: any) => {
        const { token = '' } = result
        localStorage.setItem('token', token)
        message.success('登录成功')
        navigate('/manage/list')
      },
      onError: () => {
        setLoading(false)
      },
    }
  )

  const onFinish = (values: any) => {
    login(values)
  }

  const handleGoogleLogin = () => {
    message.info('Google 登录功能开发中...')
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
            <h1 className="text-3xl font-bold text-white mb-2">欢迎回到 QuizzyFlow</h1>
            <p className="text-gray-400">登录以继续你的问卷之旅</p>
          </div>

          {/* Google登录按钮 */}
          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            className="mb-6 h-12 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-none"
          >
            <span className="font-medium">使用 Google 账号登录</span>
          </Button>

          {/* 分隔线 */}
          <Divider className="my-6">
            <span className="text-gray-500 text-sm">或</span>
          </Divider>

          {/* 登录表单 */}
          <Form
            form={form}
            name="login"
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
              name="password"
              rules={[{ required: true, message: '请输入你的密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入你的密码..."
                size="large"
                className="h-12"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-400">
                  <span className="text-gray-300">记住我</span>
                </Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-blue-500 hover:text-blue-400 text-sm">
                忘记密码?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 text-base font-medium"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          {/* 注册链接 */}
          <div className="text-center mt-6">
            <span className="text-gray-400">没有账号？</span>
            <Link to="/register" className="text-blue-500 hover:text-blue-400 ml-1 font-medium">
              免费注册
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧背景图区域 */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')`,
          }}
        >
          {/* 渐变叠加层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30" />
          
          {/* 文字叠加 - 用户评价轮播 */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4">用户评价</h2>
              
              {/* 轮播内容 */}
              <div className="relative min-h-[100px]">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      index === currentTestimonial
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <p className="text-gray-200 text-base mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{testimonial.author}</p>
                        <p className="text-sm text-gray-300">{testimonial.role}</p>
                      </div>
                      {/* 轮播指示器 */}
                      <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentTestimonial(i)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i === currentTestimonial
                                ? 'bg-white w-6'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`切换到评价 ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
