/**
 * 模板卡片组件 - 精美现代化设计
 */
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Heart, Download, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { getCategoryConfig } from '@/constants/template-categories'
import { getQuestionnaireTypeConfig } from '@/constants/questionnaire-types'
import type { Template } from '@/types/template'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'

interface TemplateCardProps {
  template: Template
  onLike?: (id: string) => void
  onUse?: (id: string) => void
}

const TemplateCard: FC<TemplateCardProps> = ({ template, onLike, onUse }) => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const categoryConfig = getCategoryConfig(template.category)
  const typeConfig = getQuestionnaireTypeConfig(template.type)

  const handleClick = () => {
    navigate(`/template/detail/${template._id}`)
  }

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUse?.(template._id)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike?.(template._id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/5' 
          : 'bg-white border border-gray-100 shadow-lg'
        }
        transition-all duration-300
        hover:shadow-2xl
      `}
    >
      {/* 背景装饰光效 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${primaryColor}15, transparent 70%)`
        }}
      />

      {/* 缩略图区域 */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        {/* 分类背景渐变 */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.bgGradient} opacity-20`}
        />
        
        {/* 模板缩略图 */}
        {!imageError && template.thumbnail ? (
          <img 
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{categoryConfig.emoji}</span>
          </div>
        )}

        {/* 悬停遮罩 */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-60'}
        `} />

        {/* 官方/精选标识 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isOfficial && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">官方</span>
            </motion.div>
          )}
          {template.isFeatured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-gradient-to-r from-pink-500/80 to-purple-500/80 border border-white/30 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white">精选</span>
            </motion.div>
          )}
        </div>

        {/* 底部统计信息 */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/90 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{formatNumber(template.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>{formatNumber(template.useCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              <span>{formatNumber(template.likeCount)}</span>
            </div>
          </div>
          
          {/* 快速使用按钮 - 悬停时显示 */}
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleUseTemplate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white backdrop-blur-md transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            >
              立即使用
            </motion.button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 relative">
        {/* 标题 */}
        <h3 className={`text-base font-bold mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300 ${
          theme === 'dark' ? 'text-slate-100 group-hover:from-blue-400 group-hover:to-purple-400' : 'text-gray-900 group-hover:from-blue-600 group-hover:to-purple-600'
        }`}>
          {template.name}
        </h3>

        {/* 描述 */}
        <p className={`text-sm mb-3 line-clamp-2 ${
          theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
        }`}>
          {template.description}
        </p>

        {/* 标签区域 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <QuestionnaireTypeTag 
            type={template.type}
            showIcon={true}
            size="small"
          />
          {template.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded text-xs ${
                theme === 'dark' 
                  ? 'bg-slate-700/50 text-slate-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 作者信息 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
              }}
            >
              {template.authorNickname?.[0] || template.author[0]}
            </div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {template.authorNickname || template.author}
            </span>
          </div>

          {/* 点赞按钮 */}
          <button
            onClick={handleLike}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-slate-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
            } hover:text-red-500 hover:fill-red-500 transition-all`} />
          </button>
        </div>
      </div>

      {/* 发光边框效果 */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px ${primaryColor}40, 0 0 20px ${primaryColor}20`
        }}
      />
    </motion.div>
  )
}

// 数字格式化
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default TemplateCard

