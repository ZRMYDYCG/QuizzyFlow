import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Typography,
  Skeleton,
} from 'antd'
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { updateUserInfo } from '@/store/modules/user'
import { updateProfile, uploadAvatar } from '@/api/modules/user'
import type { UploadProps } from 'antd'
import { useRequest } from 'ahooks'

const { Title, Text } = Typography
const { TextArea } = Input

const ProfileInfo: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: stateType) => state.user)
  const [form] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState(user.avatar)
  const [isLoading, setIsLoading] = useState(true)

  // 当用户数据更新时，同步更新表单和头像
  React.useEffect(() => {
    // 检查是否有用户数据（判断是否加载完成）
    if (user._id) {
      form.setFieldsValue({
        nickname: user.nickname,
        bio: user.bio,
        phone: user.phone,
      })
      setAvatarUrl(user.avatar)
      setIsLoading(false)
    }
  }, [user._id, user.nickname, user.bio, user.phone, user.avatar, form])

  const { run: runUpload, loading: uploading } = useRequest(
    async (file: File) => {
      return await uploadAvatar(file)
    },
    {
      manual: true,
      onSuccess: async (res) => {
        const newAvatarUrl = res.avatar
        setAvatarUrl(newAvatarUrl)
        message.success('头像上传成功')
        
        // 自动保存头像到用户信息
        await updateProfile({ avatar: newAvatarUrl })
        dispatch(updateUserInfo({ avatar: newAvatarUrl }))
      },
    }
  )

  const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
    const { file } = options
    runUpload(file as File)
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！')
      return false
    }
    return true
  }

  const { run: runUpdate, loading } = useRequest(
    async (values: any) => {
      return await updateProfile({
        nickname: values.nickname,
        bio: values.bio,
        phone: values.phone,
      })
    },
    {
      manual: true,
      onSuccess: (_, [values]) => {
        message.success('保存成功')
        dispatch(updateUserInfo({
          nickname: values.nickname,
          bio: values.bio,
          phone: values.phone,
        }))
      },
    }
  )

  const handleSubmit = async (values: any) => {
    runUpdate(values)
  }

  // 骨架屏
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <Skeleton active avatar paragraph={{ rows: 1 }} className="mb-6" />
          
          <div className="space-y-6">
            {/* 头像骨架 */}
            <div>
              <Skeleton.Avatar active size={100} className="mb-4" />
              <Skeleton.Button active size="default" />
            </div>
            
            {/* 表单字段骨架 */}
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton.Button active size="large" block />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <Title level={3} className="!mb-4 md:!mb-6 text-lg md:text-2xl">
          基本信息
        </Title>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            nickname: user.nickname,
            bio: user.bio,
            phone: user.phone,
          }}
          onFinish={handleSubmit}
        >
          {/* 头像上传 */}
          <Form.Item label="头像">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Avatar
                size={80}
                src={avatarUrl || user.avatar || undefined}
                icon={!avatarUrl && !user.avatar && <UserOutlined />}
                className="bg-blue-500"
              />
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />} loading={uploading} block className="sm:w-auto">
                    {uploading ? '上传中...' : '上传头像'}
                  </Button>
                </Upload>
                <Text type="secondary" className="text-xs md:text-sm text-center sm:text-left">
                  支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
                </Text>
              </div>
            </div>
          </Form.Item>

          {/* 邮箱（只读） */}
          <Form.Item label="邮箱">
            <Input value={user.username} disabled />
            <Text type="secondary" className="text-sm">
              邮箱不可修改，用作登录账号
            </Text>
          </Form.Item>

          {/* 昵称 */}
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 50, message: '昵称长度不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入昵称" maxLength={50} showCount />
          </Form.Item>

          {/* 手机号 */}
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <Input placeholder="请输入手机号（可选）" maxLength={11} />
          </Form.Item>

          {/* 个人简介 */}
          <Form.Item
            label="个人简介"
            name="bio"
            rules={[
              { max: 500, message: '个人简介长度不能超过500个字符' },
            ]}
          >
            <TextArea
              placeholder="介绍一下你自己吧..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          {/* 账户信息 */}
          <Form.Item label="账户信息">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <Text type="secondary">账户状态：</Text>
                <Text strong>{user.isActive ? '正常' : '未激活'}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">注册时间：</Text>
                <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
              </div>
              {user.lastLoginAt && (
                <div className="flex justify-between">
                  <Text type="secondary">最后登录：</Text>
                  <Text>{new Date(user.lastLoginAt).toLocaleString()}</Text>
                </div>
              )}
            </div>
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
              block
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileInfo

