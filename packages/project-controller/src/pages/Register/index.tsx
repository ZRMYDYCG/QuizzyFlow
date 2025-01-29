import {Form, Typography, Input, Space, Button} from 'antd'
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
                <Title level={4}>注册</Title>
            </div>
            <div>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
                    <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }, { min: 5, max: 20, message: '用户名长度至少为 5' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="确认密码" name="password_confirmation" dependencies={['password']} rules={[
                        { required: true, message: '请确认密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('两次输入的密码不一致!')
                                }
                            },
                        }),
                    ]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="昵称" name="nickname">
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Space>
                            <Button type="primary" htmlType="submit">注册</Button>
                            <Link to="/login">已有账号?登录</Link>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register
