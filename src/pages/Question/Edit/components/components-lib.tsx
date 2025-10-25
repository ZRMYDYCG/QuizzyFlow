import React from 'react'
import { nanoid } from 'nanoid'
import { componentConfigGroup } from '@/components/material'
import { ComponentConfigType } from '@/components/material'
import { cn } from '@/utils'
import { addComponent } from '@/store/modules/question-component'
import { useDispatch } from 'react-redux'
import ClassifyTitle from './classify-title'
import { useTheme } from '@/contexts/ThemeContext'

function generateComponent(c: ComponentConfigType, theme: 'dark' | 'light', primaryColor: string, themeColors: any) {
  const { title, type, component: Component, defaultProps } = c
  const dispatch = useDispatch()

  function handleClick() {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title: title,
        type: type,
        props: defaultProps,
      } as any)
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'mb-3 cursor-pointer border rounded-lg p-3 transition-all duration-200 group',
        theme === 'dark'
          ? 'bg-[#2a2a2f] border-white/5 hover:bg-[#35353a] hover:shadow-lg'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md'
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = primaryColor + (theme === 'dark' ? '50' : '40')
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
      <div className="pointer-events-none transition-transform group-hover:scale-[1.02]">
        <Component />
      </div>
    </div>
  )
}

const ComponentsLib: React.FC = () => {
  const { theme, primaryColor, themeColors } = useTheme()
  
  return (
    <div className="h-full overflow-y-auto px-3 py-4 custom-scrollbar">
      {componentConfigGroup.map((group, index) => {
        const { groupName, components } = group
        return (
          <div key={index} className={cn(index > 0 && 'mt-6')}>
            <ClassifyTitle groupName={groupName} />
            <div className="mt-3">
              {components.map((c) => generateComponent(c, theme, primaryColor, themeColors))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ComponentsLib
