/**
 * 模板分类导航组件
 */
import { FC } from 'react'
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { TemplateCategory, getAllCategories, getCategoryConfig } from '@/constants/template-categories'

interface CategoryNavProps {
  activeCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

const CategoryNav: FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  const { theme, primaryColor, themeColors } = useTheme()
  const categories = [
    getCategoryConfig(TemplateCategory.ALL),
    ...getAllCategories()
  ]

  return (
    <div className="relative">
      {/* 横向滚动容器 */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-4">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.key
          const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Grid3x3

          return (
            <motion.button
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.key)}
              className={`
                relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap
                transition-all duration-300
                ${isActive 
                  ? 'text-white shadow-lg' 
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
                }
              `}
              style={isActive ? {
                background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
              } : {}}
            >
              {/* 图标 */}
              <Icon className="w-5 h-5 flex-shrink-0" />
              
              {/* 标签文字 */}
              <span className="text-sm font-semibold">
                {category.label}
              </span>

              {/* Emoji */}
              <span className="text-lg">{category.emoji}</span>

              {/* 激活指示器 */}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                    zIndex: -1
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryNav

