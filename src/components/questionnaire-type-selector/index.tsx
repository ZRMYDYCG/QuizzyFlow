/**
 * 问卷类型选择器组件
 */
import React, { useState } from 'react'
import { Tabs, Card, Tag, Badge } from 'antd'
import * as LucideIcons from 'lucide-react'
import { clsx } from 'clsx'
import {
  QuestionnaireType,
  QUESTIONNAIRE_TYPES,
  QUESTIONNAIRE_CATEGORIES,
  getTypesByCategory,
  MVP_RECOMMENDED_TYPES,
  type QuestionnaireTypeConfig,
} from '@/constants/questionnaire-types'

interface QuestionnaireTypeSelectorProps {
  value?: QuestionnaireType
  onChange?: (type: QuestionnaireType) => void
  showMVPOnly?: boolean  // 是否只显示MVP推荐类型
  disabled?: boolean
  className?: string
}

const QuestionnaireTypeSelector: React.FC<QuestionnaireTypeSelectorProps> = ({
  value,
  onChange,
  showMVPOnly = false,
  disabled = false,
  className,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('collect')

  // 渲染类型卡片
  const renderTypeCard = (config: QuestionnaireTypeConfig) => {
    const isSelected = value === config.type
    const Icon = (LucideIcons as any)[config.icon] || LucideIcons.FileText
    const isMVP = MVP_RECOMMENDED_TYPES.includes(config.type)

    return (
      <Card
        key={config.type}
        hoverable={!disabled}
        className={clsx(
          'relative transition-all duration-200 cursor-pointer',
          isSelected && 'ring-2 shadow-lg',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        style={{
          borderColor: isSelected ? config.color : undefined,
          backgroundColor: isSelected ? config.bgColor : undefined,
        }}
        onClick={() => {
          if (!disabled) {
            onChange?.(config.type)
          }
        }}
      >
        {/* MVP 推荐标签 */}
        {isMVP && !showMVPOnly && (
          <Badge.Ribbon text="推荐" color="red" />
        )}

        <div className="flex flex-col items-start gap-3">
          {/* 图标和标题 */}
          <div className="flex items-center gap-3 w-full">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: config.bgColor }}
            >
              <Icon size={24} color={config.color} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold mb-1 flex items-center gap-2">
                {config.label}
                {isSelected && (
                  <LucideIcons.Check size={16} color={config.color} />
                )}
              </h4>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {config.description}
          </p>

          {/* 特性标签 */}
          <div className="flex flex-wrap gap-1">
            {config.features.slice(0, 3).map((feature, index) => (
              <Tag
                key={index}
                color={config.color}
                style={{
                  fontSize: '12px',
                  padding: '0 6px',
                  border: 'none',
                  backgroundColor: config.bgColor,
                  color: config.color,
                }}
              >
                {feature}
              </Tag>
            ))}
            {config.features.length > 3 && (
              <Tag
                style={{
                  fontSize: '12px',
                  padding: '0 6px',
                }}
              >
                +{config.features.length - 3}
              </Tag>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // 渲染分类标签页
  const renderCategoryTabs = () => {
    const categories = Object.values(QUESTIONNAIRE_CATEGORIES)

    return (
      <Tabs
        activeKey={selectedCategory}
        onChange={setSelectedCategory}
        items={categories.map((category) => {
          const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Folder
          const types = getTypesByCategory(category.key as any)
          const filteredTypes = showMVPOnly
            ? types.filter(type => MVP_RECOMMENDED_TYPES.includes(type))
            : types

          // 如果启用 MVP 模式且该分类下没有推荐类型，则不显示
          if (showMVPOnly && filteredTypes.length === 0) {
            return null
          }

          return {
            key: category.key,
            label: (
              <span className="flex items-center gap-2">
                <Icon size={16} />
                {category.label}
                <Badge count={filteredTypes.length} showZero />
              </span>
            ),
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTypes.map(type =>
                  renderTypeCard(QUESTIONNAIRE_TYPES[type])
                )}
              </div>
            ),
          }
        }).filter(Boolean)}
      />
    )
  }

  // MVP 模式：简单网格展示
  const renderMVPGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MVP_RECOMMENDED_TYPES.map(type =>
          renderTypeCard(QUESTIONNAIRE_TYPES[type])
        )}
      </div>
    )
  }

  return (
    <div className={clsx('questionnaire-type-selector', className)}>
      {showMVPOnly ? renderMVPGrid() : renderCategoryTabs()}
    </div>
  )
}

export default QuestionnaireTypeSelector

