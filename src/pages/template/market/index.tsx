/**
 * 模板市场主页 - AI 创作 + 瀑布流社区
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTitle } from 'ahooks'
import { message } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { createQuestion } from '@/api/modules/question'
import { cn } from '@/utils'
import MarketAIDialog from '@/components/template/MarketAIDialog'
import CommunityWaterfall from '@/components/template/CommunityWaterfall'
import TemplatePreviewModal from '@/components/template/TemplatePreviewModal'
import communityTemplatesData from '@/data/community-templates.json'
import type { CommunityTemplate } from '@/types/community-template'

const communityTemplates = communityTemplatesData as CommunityTemplate[]

const TemplateMarketPage = () => {
  useTitle('模板社区 - QuizzyFlow')
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
    <div className="pb-16">
      <MarketAIDialog />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2
              className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}
            >
              发现作品
            </h2>
            <p className={cn('text-sm', theme === 'dark' ? 'text-slate-500' : 'text-gray-500')}>
              点击预览社区精选模板
            </p>
          </div>
        </div>

        <CommunityWaterfall
          templates={communityTemplates}
          onPreview={setPreviewTemplate}
        />
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
      />
    </div>
  )
}

export default TemplateMarketPage
