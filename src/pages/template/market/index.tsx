/**
 * 模板市场 - 分类浏览与搜索
 */
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRequest, useTitle } from 'ahooks'
import { Empty, Pagination, message } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { getTemplateList, createQuestionFromTemplate, useTemplate } from '@/api/modules/template'
import { TemplateCategory, TemplateSortBy } from '@/constants/template-categories'
import HeroSection from '@/components/template/HeroSection'
import CategoryNav from '@/components/template/CategoryNav'
import MarketToolbar from '@/components/template/MarketToolbar'
import TemplateCard from '@/components/template/TemplateCard'
import TemplateCardSkeleton from '@/layouts/template-layout/components/template-card-skeleton'
import { cn } from '@/utils'

const PAGE_SIZE = 12

const TemplateMarketPage = () => {
  useTitle('模板市场 - QuizzyFlow')
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const { token } = useGetUserInfo()
  const browseRef = useRef<HTMLDivElement>(null)

  const [keyword, setKeyword] = useState('')
  const [activeCategory, setActiveCategory] = useState(TemplateCategory.ALL)
  const [sortBy, setSortBy] = useState(TemplateSortBy.POPULAR)
  const [page, setPage] = useState(1)
  const [featuredOnly, setFeaturedOnly] = useState(false)

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash === 'featured') {
      setFeaturedOnly(true)
      setPage(1)
      browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (hash === 'browse') {
      browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const { data, loading, refresh } = useRequest(
    () =>
      getTemplateList({
        page,
        pageSize: PAGE_SIZE,
        keyword: keyword || undefined,
        category: activeCategory !== TemplateCategory.ALL ? activeCategory : undefined,
        sortBy,
        isFeatured: featuredOnly || undefined,
      }),
    {
      refreshDeps: [page, keyword, activeCategory, sortBy, featuredOnly],
    }
  )

  const handleSearch = (value: string) => {
    setKeyword(value.trim())
    setPage(1)
  }

  const handleCategoryChange = (category: TemplateCategory) => {
    setActiveCategory(category)
    setPage(1)
  }

  const handleSortChange = (sort: TemplateSortBy) => {
    setSortBy(sort)
    setPage(1)
  }

  const handleUseTemplate = async (templateId: string) => {
    if (!token) {
      message.info('请先登录后再使用模板')
      navigate('/login')
      return
    }

    try {
      await useTemplate(templateId)
      const result = await createQuestionFromTemplate(templateId)
      message.success('问卷创建成功')
      navigate(`/question/edit/${result._id}`)
    } catch {
      message.error('创建失败，请稍后重试')
    }
  }

  const templates = data?.list ?? []
  const total = data?.total ?? 0

  return (
    <div className="pb-16">
      <HeroSection onSearch={handleSearch} />

      <div ref={browseRef} className="mx-auto max-w-7xl scroll-mt-20 px-4 sm:px-6">
        <div className="mb-6">
          <CategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </div>

        {featuredOnly && (
          <div
            className={cn(
              'mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
              theme === 'dark' ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700'
            )}
          >
            正在浏览精选模板
            <button
              type="button"
              onClick={() => {
                setFeaturedOnly(false)
                window.history.replaceState(null, '', '/template/market')
              }}
              className="underline opacity-80 hover:opacity-100"
            >
              查看全部
            </button>
          </div>
        )}

        <MarketToolbar total={total} sortBy={sortBy} onSortChange={handleSortChange} />

        {loading ? (
          <TemplateCardSkeleton count={6} />
        ) : templates.length === 0 ? (
          <Empty
            description={keyword ? `未找到与「${keyword}」相关的模板` : '暂无模板，敬请期待'}
            className="py-16"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard
                key={template._id}
                template={template}
                onUse={handleUseTemplate}
                onLike={() => refresh()}
              />
            ))}
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="mt-10 flex justify-center">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
              showTotal={(count) => `共 ${count} 个模板`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateMarketPage
