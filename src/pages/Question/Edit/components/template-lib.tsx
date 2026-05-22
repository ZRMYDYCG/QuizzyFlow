import React from 'react'
import { message } from '@/utils/app-message'
import { useDispatch } from 'react-redux'
import { Blocks, Plus } from 'lucide-react'
import {
  materialComboGroups,
  buildComponentsFromCombo,
  type MaterialComboDef,
} from '@/components/material-combo'
import { getComponentConfigByType } from '@/components/material'
import { addComponents } from '@/store/modules/question-component'
import { cn } from '@/utils'
import { useTheme } from '@/contexts/ThemeContext'
import ClassifyTitle from './classify-title'

function MaterialComboCard({
  combo,
  theme,
  primaryColor,
  onInsert,
}: {
  combo: MaterialComboDef
  theme: 'dark' | 'light'
  primaryColor: string
  onInsert: (combo: MaterialComboDef) => void
}) {
  const itemLabels = combo.items.map((item) => {
    const config = getComponentConfigByType(item.type)
    return item.title ?? config?.title ?? item.type
  })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onInsert(combo)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onInsert(combo)
        }
      }}
      className={cn(
        'mb-3 cursor-pointer border rounded-lg p-3 transition-all duration-200 group',
        theme === 'dark'
          ? 'bg-[#2a2a2f] border-white/5 hover:bg-[#35353a] hover:shadow-lg'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md'
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          primaryColor + (theme === 'dark' ? '50' : '40')
        if (theme === 'dark') {
          e.currentTarget.style.boxShadow = `0 10px 15px -3px ${primaryColor}10`
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        if (theme === 'dark') {
          e.currentTarget.style.boxShadow = ''
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center',
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
            )}
            style={{ color: primaryColor }}
          >
            <Blocks size={16} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                'text-sm font-semibold truncate',
                theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
              )}
            >
              {combo.name}
            </p>
            <p
              className={cn(
                'text-xs mt-0.5 line-clamp-2',
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              )}
            >
              {combo.description}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'flex-shrink-0 flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
            theme === 'dark'
              ? 'bg-white/10 text-slate-300'
              : 'bg-gray-100 text-gray-600'
          )}
          style={{ color: primaryColor }}
        >
          <Plus size={12} />
          {combo.items.length} 项
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 pointer-events-none">
        {itemLabels.map((label, i) => (
          <span
            key={`${combo.id}-${i}`}
            className={cn(
              'text-xs px-2 py-0.5 rounded-md',
              theme === 'dark'
                ? 'bg-white/5 text-slate-400 border border-white/5'
                : 'bg-gray-50 text-gray-600 border border-gray-100'
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

const TemplateLib: React.FC = () => {
  const dispatch = useDispatch()
  const { theme, primaryColor } = useTheme()

  function handleInsertCombo(combo: MaterialComboDef) {
    const components = buildComponentsFromCombo(combo)
    if (components.length === 0) {
      message.warning('组合内物料不可用，请检查组件类型')
      return
    }
    dispatch(addComponents(components))
    message.success(`已插入「${combo.name}」共 ${components.length} 个物料`)
  }

  return (
    <div className="h-full overflow-y-auto px-3 py-4 custom-scrollbar">
      <p
        className={cn(
          'text-xs mb-4 leading-relaxed',
          theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
        )}
      >
        将多个基础物料打包为常用组合，一键插入画布；插入位置为当前选中物料之后。
      </p>

      {materialComboGroups.map((group, index) => (
        <div key={group.groupName} className={cn(index > 0 && 'mt-6')}>
          <ClassifyTitle groupName={group.groupName} />
          <div className="mt-3">
            {group.combos.map((combo) => (
              <MaterialComboCard
                key={combo.id}
                combo={combo}
                theme={theme}
                primaryColor={primaryColor}
                onInsert={handleInsertCombo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplateLib
