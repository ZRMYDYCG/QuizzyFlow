import { useState, useEffect, type FC } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { loginUser, getUserInfo } from '@/api/modules/user'
import { loginReducer } from '@/store/modules/user'
import { setUserPermissions } from '@/store/modules/admin'
import { useRequest } from 'ahooks'
import Logo from '@/components/Logo'

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

const Login: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // 评价轮播效果
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const { run: login, loading } = useRequest(
    async (values: any) => {
      console.log('🔐 开始登录流程...')
      
      // 1. 登录获取 token
      const loginResult = await loginUser(values)
      const { token } = loginResult
      console.log('✅ 步骤1: 获取到 token (前50字符):', token?.substring(0, 50))
      
      // 2. 保存 token
      localStorage.setItem('token', token)
      console.log('✅ 步骤2: token 已保存到 localStorage')
      
      // 3. 获取用户完整信息
      const userInfo = await getUserInfo()
      console.log('✅ 步骤3: 获取到用户信息:', {
        username: userInfo.username,
        role: userInfo.role,
        _id: userInfo._id
      })
      
      return { token, userInfo }
    },
    {
      manual: true,
      onSuccess: async ({ token, userInfo }) => {
        console.log('✅ 步骤4: 开始存储到 Redux store')
        console.log('  - username:', userInfo.username)
        console.log('  - role:', userInfo.role)
        console.log('  - token (前50字符):', token?.substring(0, 50))
        
        // 4. 存储到 Redux store（包含所有字段）
        dispatch(
          loginReducer({
            _id: userInfo._id,
            username: userInfo.username,
            nickname: userInfo.nickname,
            isActive: userInfo.isActive,
            lastLoginAt: userInfo.lastLoginAt,
            createdAt: userInfo.createdAt,
            updatedAt: userInfo.updatedAt,
            avatar: userInfo.avatar || '',
            bio: userInfo.bio || '',
            phone: userInfo.phone || '',
            preferences: userInfo.preferences || {
              theme: 'light',
              language: 'zh-CN',
              editorSettings: {
                autoSave: true,
                autoSaveInterval: 30,
                defaultScale: 1,
                showGrid: true,
                showRulers: true,
              },
              listView: 'card',
            },
            role: userInfo.role || 'user',  // ← 关键！
            customPermissions: userInfo.customPermissions || [],  // ← 关键！
            isBanned: userInfo.isBanned || false,
            token,
          })
        )
        console.log('✅ 步骤4完成: Redux store 已更新')
        
        // 5. 如果是管理员，设置 admin store
        if (userInfo.role === 'admin' || userInfo.role === 'super_admin') {
          console.log('✅ 步骤5: 检测到管理员角色，设置 admin store')
          dispatch(
            setUserPermissions({
              role: userInfo.role,
              permissions: [],
              customPermissions: userInfo.customPermissions || [],
            })
          )
        }
        
        message.success('登录成功')
        
        // 6. 根据角色跳转到合适的页面
        if (userInfo.role === 'admin' || userInfo.role === 'super_admin') {
          console.log('✅ 步骤6: 准备跳转到 /admin/dashboard')
          navigate('/admin/dashboard', { replace: true })
          console.log('✅ navigate 调用完成')
        } else {
          console.log('✅ 步骤6: 准备跳转到 /manage/list')
          navigate('/manage/list', { replace: true })
        }
      },
      onError: (error: any) => {
        message.error(error?.message || '登录失败，请检查邮箱和密码')
      },
    }
  )

  const onFinish = (values: any) => {
    login(values)
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧表单区域 */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-[#0f1419] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo和标题 */}
          <div className="mb-10">
            <div className="mb-6">
              <Logo size="medium" showText={true} onClick={() => navigate('/')} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">欢迎回到 QuizzyFlow</h1>
            <p className="text-gray-400">登录以继续你的问卷之旅</p>
          </div>

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
