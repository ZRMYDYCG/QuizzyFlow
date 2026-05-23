import type { FC } from 'react'
import { Avatar } from 'antd'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

interface UserChatAvatarProps {
  size?: number
  className?: string
}

const UserChatAvatar: FC<UserChatAvatarProps> = ({ size = 32, className }) => {
  const { avatar, nickname, username } = useGetUserInfo()
  const { primaryColor, themeColors } = useTheme()
  const displayName = (nickname || username || 'U').charAt(0).toUpperCase()

  if (avatar) {
    return (
      <Avatar
        src={avatar}
        size={size}
        className={cn('shrink-0 object-cover', className)}
      />
    )
  }

  return (
    <Avatar
      size={size}
      className={cn('shrink-0 text-xs font-semibold text-white', className)}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
      }}
    >
      {displayName}
    </Avatar>
  )
}

export default UserChatAvatar
