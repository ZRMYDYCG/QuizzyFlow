import React, { useEffect } from 'react'
import { Drawer, Descriptions, Tag, message, Spin } from 'antd'
import { useRequest } from 'ahooks'
import { getUserDetailAPI } from '@/api/modules/admin'
import { ROLE_NAMES, ROLE_COLORS } from '@/constants/roles'

interface UserDetailDrawerProps {
  open: boolean
  onClose: () => void
  userId: string | null
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  open,
  onClose,
  userId,
}) => {
  const {
    data: userDetail,
    run: fetchUserDetail,
    loading,
  } = useRequest(
    async (id: string) => {
      return await getUserDetailAPI(id)
    },
    {
      manual: true,
      onError: () => {
        message.error('加载用户详情失败')
      },
    }
  )

  useEffect(() => {
    if (open && userId) {
      fetchUserDetail(userId)
    }
  }, [open, userId, fetchUserDetail])

  return (
    <Drawer
      title="用户详情"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
    >
      <Spin spinning={loading}>
        {userDetail ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">
              {userDetail.username}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {userDetail.nickname}
            </Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag
                color={
                  ROLE_COLORS[userDetail.role as keyof typeof ROLE_COLORS] ||
                  'default'
                }
              >
                {ROLE_NAMES[userDetail.role as keyof typeof ROLE_NAMES] ||
                  userDetail.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {userDetail.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="个人简介">
              {userDetail.bio || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建的问卷">
              {userDetail.statistics?.questionCount || 0} 个
            </Descriptions.Item>
            <Descriptions.Item label="回答的问卷">
              {userDetail.statistics?.answerCount || 0} 个
            </Descriptions.Item>
            <Descriptions.Item label="最后登录">
              {userDetail.lastLoginAt
                ? new Date(userDetail.lastLoginAt).toLocaleString('zh-CN')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {new Date(userDetail.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          !loading && <div className="text-center text-gray-500">暂无数据</div>
        )}
      </Spin>
    </Drawer>
  )
}

export default UserDetailDrawer
