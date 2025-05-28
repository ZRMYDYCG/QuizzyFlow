import { Form, Typography, Input, Space, Button, Checkbox, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/modules/user.ts'
import { useRequest } from 'ahooks'

const { Title } = Typography

const Register = () => {
  const navigate = useNavigate()
  const onFinish = (values: never) => {
    login(values)
  }

  const { run: login } = useRequest(
    async (values: any) => {
      return await loginUser(values)
    },
    {
      manual: true,
      onSuccess: async (result: any) => {
        const { token = '' } = result
        localStorage.setItem('token', token)
        message.success('登录成功')
        navigate('/manage/list')
      },
    }
  )

  return (
    <div className="h-[calc(100vh-60px-71px)] flex justify-center items-center flex-col">
      <div className="flex items-center">
        <img
          className="w-[80px] h-[80px] mb-[20px]"
          src="/public/vite.svg"
          alt="register"
        />
        <Title level={4}>登录</Title>
      </div>
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 5, message: '用户名长度至少为 5 个字符！' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 16 }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit" onClick={onFinish}>
                登录
              </Button>
              <Link to="/login">注册新用户</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register
