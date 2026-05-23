import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useRequest } from 'ahooks'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { createQuestion } from '@/api/modules/question'
import AIPromptInput from '@/components/ai-prompt-input'
import { inferQuestionnaireType } from '@/utils/infer-questionnaire-type'
import { cn } from '@/utils'

const LandingHero: FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { token } = useGetUserInfo()

  const { loading, run: handleCreate } = useRequest(
    async (content: string) => {
      const res = await createQuestion({
        title: content.slice(0, 40) || '未命名问卷',
        desc: content,
        type: inferQuestionnaireType(content),
      })
      return { ...res, content }
    },
    {
      manual: true,
      onSuccess: (res) => {
        message.success('问卷创建成功，AI 助手已就绪')
        navigate(`/question/edit/${res._id}`, {
          state: { aiOpen: true, aiMessage: res.content },
        })
      },
      onError: () => {
        message.error('创建失败，请稍后重试')
      },
    }
  )

  const handleSend = (content: string) => {
    if (!token) {
      message.info('请先登录后再创建问卷')
      navigate('/login')
      return
    }
    handleCreate(content)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-16 pb-8 text-center sm:pt-20">
      <h1
        className={cn(
          'mb-8 text-2xl font-semibold tracking-tight md:text-3xl',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}
      >
        描述你想要的问卷，AI 帮你快速生成
      </h1>

      <AIPromptInput
        variant="chat"
        showAvatar={false}
        placeholder="描述你想要的问卷，例如：创建一份关于用户购物习惯的调查..."
        isLoading={loading}
        onSend={handleSend}
      />
    </section>
  )
}

export default LandingHero
