import { FC } from 'react'
import { Modal, Button, Tag } from 'antd'
import { Eye, Heart, Rocket } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import type { CommunityTemplate } from '@/types/community-template'

interface TemplatePreviewModalProps {
  template: CommunityTemplate | null
  open: boolean
  onClose: () => void
  onUse?: (template: CommunityTemplate) => void
}

const TemplatePreviewModal: FC<TemplatePreviewModalProps> = ({
  template,
  open,
  onClose,
  onUse,
}) => {
  const { theme, primaryColor, themeColors } = useTheme()

  if (!template) return null

  const componentCount = template.schema.componentList.length

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      className="template-preview-modal"
    >
      <div
        className="relative -mx-6 -mt-5 mb-5 overflow-hidden rounded-t-lg"
        style={{ height: 240, background: template.cover }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <h2 className="text-xl font-bold text-white">{template.title}</h2>
          <p className="mt-1 text-sm text-white/80">by {template.author}</p>
        </div>
      </div>

      <p className={cn('mb-4 text-sm leading-relaxed', theme === 'dark' ? 'text-slate-300' : 'text-gray-600')}>
        {template.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {template.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <div className="mb-5 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {template.views} 浏览
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {template.likes} 喜欢
        </span>
        <span>{componentCount} 个组件</span>
      </div>

      <div
        className={cn(
          'mb-5 rounded-xl border p-4',
          theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'
        )}
      >
        <p className={cn('mb-1 text-xs font-medium', theme === 'dark' ? 'text-slate-400' : 'text-gray-500')}>
          问卷预览
        </p>
        <p className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {template.schema.title}
        </p>
        <p className={cn('mt-1 text-sm', theme === 'dark' ? 'text-slate-400' : 'text-gray-600')}>
          {template.schema.desc}
        </p>
      </div>

      <div className="flex gap-3">
        <Button block onClick={onClose}>
          关闭
        </Button>
        <Button
          block
          type="primary"
          icon={<Rocket className="h-4 w-4" />}
          onClick={() => onUse?.(template)}
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
          }}
        >
          使用此模板
        </Button>
      </div>
    </Modal>
  )
}

export default TemplatePreviewModal
