import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { useRequest } from 'ahooks'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { createQuestion } from '@/api/modules/question'
import { cn } from '@/utils'

const QUICK_PROMPTS = [
  '创建一份用户满意度调查问卷',
  '设计一个活动报名表',
  '制作员工反馈收集表',
  '生成产品需求调研问卷',
]

const MarketAIDialog: FC = () => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const { token } = useGetUserInfo()
  const [prompt, setPrompt] = useState('')

  const { loading, run: handleCreate } = useRequest(
    async (content: string) => {
      const res = await createQuestion({
        title: content.slice(0, 40) || '未命名问卷',
        desc: content,
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const content = prompt.trim()
    if (!content) return
    if (!token) {
      message.info('请先登录后再创建问卷')
      navigate('/login')
      return
    }
    handleCreate(content)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 pb-6 text-center">
      <h1
        className={cn(
          'mb-2 text-3xl font-bold tracking-tight md:text-4xl',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}
      >
        模板市场
      </h1>
      <p className={cn('mb-8 text-sm md:text-base', theme === 'dark' ? 'text-slate-400' : 'text-gray-500')}>
        描述你想要的问卷，AI 帮你快速生成
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            'rounded-2xl border p-4 shadow-lg transition-shadow focus-within:shadow-xl',
            theme === 'dark'
              ? 'border-slate-700 bg-slate-900/80'
              : 'border-gray-200 bg-white'
          )}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的问卷，例如：创建一份关于用户购物习惯的调查..."
            rows={3}
            disabled={loading}
            className={cn(
              'w-full resize-none bg-transparent text-base outline-none',
              theme === 'dark'
                ? 'text-white placeholder:text-slate-500'
                : 'text-gray-900 placeholder:text-gray-400'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-purple-500">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI 智能生成</span>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
              }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? '创建中...' : '开始创作'}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPrompt(item)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  )
}

export default MarketAIDialog
