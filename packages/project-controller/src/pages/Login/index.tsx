import {Form, Typography, Input, Space, Button, Checkbox} from 'antd'
import { Link } from 'react-router-dom'

const { Title } = Typography

const Register = () => {
    const onFinish = (values: never) => {
        console.log(values)
    }

    return (
        <div className="h-[calc(100vh-60px-71px)] flex justify-center items-center flex-col">
            <div className="flex items-center">
                <img className="w-[80px] h-[80px] mb-[20px]" src="/public/vite.svg" alt="register" />
                <Title level={4}>登录</Title>
            </div>
            <div>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码" name="password">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Space>
                            <Button type="primary" htmlType="submit">登录</Button>
                            <Link to="/login">注册新用户</Link>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register
