import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { createQuestion } from '@/api/modules/question'
import CommunityWaterfall from '@/components/template/CommunityWaterfall'
import TemplatePreviewModal from '@/components/template/TemplatePreviewModal'
import communityTemplates from '@/data/community-templates'
import { cn } from '@/utils'
import type { CommunityTemplate } from '@/types/community-template'

const LandingShowcase: FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { token } = useGetUserInfo()
  const [previewTemplate, setPreviewTemplate] = useState<CommunityTemplate | null>(null)

  const handleUseTemplate = async (template: CommunityTemplate) => {
    if (!token) {
      message.info('请先登录')
      navigate('/login')
      return
    }

    try {
      const res = await createQuestion({
        title: template.schema.title,
        desc: template.schema.desc,
        componentList: template.schema.componentList,
      })
      message.success('模板已应用')
      setPreviewTemplate(null)
      navigate(`/question/edit/${res._id}`)
    } catch {
      message.error('创建失败，请稍后重试')
    }
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
      <h2
        className={cn(
          'mb-8 text-center text-2xl font-semibold md:text-3xl',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}
      >
        探索更多
      </h2>

      <CommunityWaterfall
        templates={communityTemplates}
        onPreview={setPreviewTemplate}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
      />
    </section>
  )
}

export default LandingShowcase
