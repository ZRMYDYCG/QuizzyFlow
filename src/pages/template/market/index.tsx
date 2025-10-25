/**
 * 模板市场主页 - 超级精美设计
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest, useTitle } from 'ahooks'
import { message, Spin, Empty } from 'antd'
import { motion } from 'framer-motion'
import { ArrowRight, Filter, SortDesc } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import HeroSection from '@/components/template/HeroSection'
import CategoryNav from '@/components/template/CategoryNav'
import TemplateCard from '@/components/template/TemplateCard'
import { getTemplateList, getFeaturedTemplates, likeTemplate, useTemplate } from '@/api/modules/template'
import { TemplateCategory } from '@/constants/template-categories'
import { TemplateSortBy, SORT_OPTIONS } from '@/constants/template-categories'
import type { Template } from '@/types/template'

const TemplateMarketPage = () => {
  useTitle('模板市场 - QuizzyFlow')
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()

  // 状态管理
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>(TemplateCategory.ALL)
  const [sortBy, setSortBy] = useState<TemplateSortBy>(TemplateSortBy.POPULAR)
  const [keyword, setKeyword] = useState<string>('')
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([])

  // 获取精选模板
  const { loading: loadingFeatured } = useRequest(
    async () => {
      const res = await getFeaturedTemplates(6)
      setFeaturedTemplates(res)
      return res
    },
    {
      onError: () => {
        // message.error('获取精选模板失败')
      }
    }
  )

  // 获取模板列表
  const { data: templateList, loading, refresh } = useRequest(
    async () => {
      const params: any = {
        page: 1,
        pageSize: 12,
        sortBy,
      }
      if (activeCategory !== TemplateCategory.ALL) {
        params.category = activeCategory
      }
      if (keyword) {
        params.keyword = keyword
      }
      const res = await getTemplateList(params)
      return res.list
    },
    {
      refreshDeps: [activeCategory, sortBy, keyword],
      onError: () => {
        // message.error('获取模板列表失败')
      }
    }
  )

  // 点赞模板
  const handleLike = async (templateId: string) => {
    try {
      await likeTemplate(templateId)
      message.success('点赞成功')
      refresh()
    } catch (error) {
      // message.error('点赞失败')
    }
  }

  // 使用模板
  const handleUseTemplate = async (templateId: string) => {
    try {
      await useTemplate(templateId)
      message.success('正在创建问卷...')
      // 这里后续会跳转到编辑页
      navigate(`/template/detail/${templateId}`)
    } catch (error) {
      // message.error('使用模板失败')
    }
  }

  // 搜索模板
  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword)
  }

  return (
    <div className="min-h-screen">
      {/* 英雄区 */}
      <HeroSection onSearch={handleSearch} />

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 精选模板区域 */}
        {featuredTemplates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            {/* 区块标题 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  ✨ 精选推荐
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  精心挑选的高质量模板，快速开始你的项目
                </p>
              </div>
              <button
                onClick={() => setActiveCategory(TemplateCategory.ALL)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>查看全部</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 精选模板网格 */}
            {loadingFeatured ? (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template, index) => (
                  <motion.div
                    key={template._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TemplateCard
                      template={template}
                      onLike={handleLike}
                      onUse={handleUseTemplate}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* 分隔线 */}
        <div className={`my-12 border-t ${
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        }`} />

        {/* 模板浏览区域 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* 区块标题 */}
          <div className="mb-6">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              📦 浏览模板
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              按分类查找适合你的模板
            </p>
          </div>

          {/* 分类导航 */}
          <div className="mb-8">
            <CategoryNav
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* 筛选和排序栏 */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            {/* 结果统计 */}
            <div className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              找到 <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                }}
              >
                {templateList?.length || 0}
              </span> 个模板
            </div>

            {/* 排序选择器 */}
            <div className="flex items-center gap-2">
              <SortDesc className={`w-4 h-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TemplateSortBy)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium cursor-pointer outline-none transition-all
                  ${theme === 'dark'
                    ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 模板网格 */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : templateList && templateList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templateList.map((template, index) => (
                <motion.div
                  key={template._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TemplateCard
                    template={template}
                    onLike={handleLike}
                    onUse={handleUseTemplate}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20">
              <Empty
                description={
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                    暂无模板数据
                  </span>
                }
              />
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default TemplateMarketPage

