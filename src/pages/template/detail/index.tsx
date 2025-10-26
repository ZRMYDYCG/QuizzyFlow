/**
 * 模板详情页 - 精美展示
 */
import { useParams, useNavigate } from 'react-router-dom'
import { useRequest, useTitle } from 'ahooks'
import { Button, Spin, message, Modal } from 'antd'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Heart, 
  Download, 
  Eye, 
  Star,
  Rocket,
  Copy,
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getTemplateDetail, likeTemplate, useTemplate } from '@/api/modules/template'
import { createQuestionFromTemplate } from '@/api/modules/template'
import { getCategoryConfig } from '@/constants/template-categories'
import { getQuestionnaireTypeConfig } from '@/constants/questionnaire-types'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'
import type { Template } from '@/types/template'

const TemplateDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()

  // 获取模板详情
  const { data: template, loading } = useRequest(
    async () => {
      if (!id) throw new Error('模板ID不存在')
      return await getTemplateDetail(id)
    },
    {
      onError: () => {
        message.error('获取模板详情失败')
        navigate('/template/market')
      }
    }
  )

  useTitle(template?.name || '模板详情')

  // 使用模板创建问卷
  const { loading: creating, run: handleUseTemplate } = useRequest(
    async () => {
      if (!id) return
      
      Modal.confirm({
        title: '使用模板创建问卷',
        content: '确定要使用此模板创建新问卷吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await useTemplate(id)
            const result = await createQuestionFromTemplate(id)
            message.success('问卷创建成功！')
            navigate(`/question/edit/${result._id}`)
          } catch (error) {
            message.error('创建问卷失败，请稍后重试')
          }
        }
      })
    },
    { manual: true }
  )

  // 点赞模板
  const { run: handleLike } = useRequest(
    async () => {
      if (!id) return
      await likeTemplate(id)
      message.success('点赞成功')
    },
    { manual: true }
  )

  // 复制链接
  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch (err) {
      message.error('复制失败')
    }
  }

  if (loading || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  const categoryConfig = getCategoryConfig(template.category)
  const typeConfig = getQuestionnaireTypeConfig(template.type)

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航栏 */}
      <div className={`sticky top-0 z-10 backdrop-blur-md border-b ${
        theme === 'dark' 
          ? 'bg-slate-900/80 border-slate-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            返回
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              icon={<Copy className="w-4 h-4" />}
              onClick={handleCopyLink}
            >
              复制链接
            </Button>
            <Button
              icon={<Heart className="w-4 h-4" />}
              onClick={handleLike}
            >
              点赞 {template.likeCount}
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：模板信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 模板头部 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* 标签组 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {template.isOfficial && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-500">官方</span>
                  </div>
                )}
                {template.isFeatured && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span className="text-xs font-bold text-pink-500">精选</span>
                  </div>
                )}
                <QuestionnaireTypeTag type={template.type} showIcon size="small" />
              </div>

              {/* 标题 */}
              <h1 className={`text-3xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {template.name}
              </h1>

              {/* 描述 */}
              <p className={`text-base mb-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {template.description}
              </p>

              {/* 统计信息 */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{template.viewCount.toLocaleString()} 浏览</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>{template.useCount.toLocaleString()} 使用</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{template.likeCount.toLocaleString()} 点赞</span>
                </div>
              </div>
            </motion.div>

            {/* 模板预览 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                📸 模板预览
              </h2>
              
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.bgGradient} opacity-20`} />
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">{categoryConfig.emoji}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 模板详情 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                📦 模板内容
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {template.templateData.componentList.length}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    组件数量
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {categoryConfig.label}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    分类
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧：操作栏 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`sticky top-24 p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* 主操作按钮 */}
              <Button
                type="primary"
                size="large"
                icon={<Rocket className="w-5 h-5" />}
                loading={creating}
                onClick={handleUseTemplate}
                className="w-full h-14 text-base font-semibold mb-4 shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                }}
              >
                立即使用模板
              </Button>

              {/* 次要操作 */}
              <div className="space-y-2">
                <Button
                  size="large"
                  icon={<Heart className="w-4 h-4" />}
                  onClick={handleLike}
                  className="w-full"
                >
                  点赞支持
                </Button>
                <Button
                  size="large"
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={handleCopyLink}
                  className="w-full"
                >
                  分享模板
                </Button>
              </div>

              {/* 分隔线 */}
              <div className={`my-6 border-t ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`} />

              {/* 作者信息 */}
              <div>
                <div className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  👤 作者信息
                </div>
                <div className="flex items-center gap-3">
                  {template.authorAvatar ? (
                    <img 
                      src={template.authorAvatar} 
                      alt="author avatar" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                      }}
                    >
                      {(template.authorNickname || template.author || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {template.authorNickname || template.author}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                    }`}>
                      创建于 {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              {template.tags.length > 0 && (
                <>
                  <div className={`my-6 border-t ${
                    theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                  }`} />
                  <div>
                    <div className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      🏷️ 标签
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2.5 py-1 rounded-lg text-xs ${
                            theme === 'dark'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateDetailPage

