import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'
import type { QuestionnaireType } from '@/constants/questionnaire-types'

export interface AuthorPreviewBarProps {
  title: string
  type?: string
  primaryColor: string
  copying: boolean
  textPrimaryClass: string
  isDark: boolean
  onBack: () => void
  onCopyLink: () => void
  onEdit: () => void
}

const AuthorPreviewBar: React.FC<AuthorPreviewBarProps> = ({
  title,
  type,
  primaryColor,
  copying,
  textPrimaryClass,
  isDark,
  onBack,
  onCopyLink,
  onEdit,
}) => (
  <div
    className={`py-3 px-4 md:px-6 shadow-sm sticky top-0 z-10 ${
      isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'
    }`}
  >
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={onBack}
          className="flex-shrink-0"
        >
          <span className="hidden sm:inline">返回</span>
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2
            className={`text-base md:text-lg font-semibold truncate ${textPrimaryClass}`}
          >
            {title}
          </h2>
          {type ? (
            <QuestionnaireTypeTag
              type={type as QuestionnaireType}
              showIcon
              size="small"
            />
          ) : null}
        </div>
        <div
          className="hidden sm:block px-2 py-1 text-xs rounded flex-shrink-0 border"
          style={{
            backgroundColor: `${primaryColor}10`,
            color: primaryColor,
            borderColor: `${primaryColor}20`,
          }}
        >
          预览模式
        </div>
      </div>
      <Space className="flex-shrink-0">
        <Tooltip title="复制链接">
          <Button
            type="text"
            icon={<CopyOutlined />}
            loading={copying}
            onClick={onCopyLink}
          >
            <span className="hidden sm:inline">分享</span>
          </Button>
        </Tooltip>
        <Button type="default" icon={<EditOutlined />} onClick={onEdit}>
          <span className="hidden sm:inline">编辑</span>
        </Button>
      </Space>
    </div>
  </div>
)

export default AuthorPreviewBar
