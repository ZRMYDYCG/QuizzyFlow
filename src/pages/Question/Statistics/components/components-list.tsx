import { memo, useCallback, useMemo } from 'react'
import { getComponentConfigByType } from '@/components/material'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { cn } from '@/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useManageTheme } from '@/hooks/useManageTheme'
import type { ComponentSelectionProps } from '../types'

interface ComponentData {
  fe_id: string
  type: string
  props: Record<string, any>
  isHidden?: boolean
}

const ComponentsList = memo(
  ({ selectedComponentId, setSelectedComponent }: ComponentSelectionProps) => {
    const { componentList } = useGetComponentInfo()
    const { primaryColor } = useTheme()
    const t = useManageTheme()

    const visibleComponents = useMemo(
      () =>
        componentList.filter(
          (component: ComponentData) => !component.isHidden
        ),
      [componentList]
    )

    const handleComponentClick = useCallback(
      (fe_id: string, type: string) => {
        setSelectedComponent(fe_id, type)
      },
      [setSelectedComponent]
    )

  return (
    <div
      className={cn(
        'min-h-full overflow-y-auto p-2 md:p-[12px]',
        t.isDark ? 'bg-[#1e1e23]' : 'bg-white'
      )}
    >
      {visibleComponents.map((component: ComponentData) => {
        const { fe_id, props, type } = component

        const componentConfig = getComponentConfigByType(type)
        if (!componentConfig) return null

        const { component: Component } = componentConfig

        const componentProps = {
          fe_id,
          ...props,
        }

        const isSelected = fe_id === selectedComponentId

        return (
          <div
            key={fe_id}
            onClick={() => handleComponentClick(fe_id, type)}
            className={cn(
              'w-full p-2 md:p-[12px] cursor-pointer border rounded-md transition-all mb-2',
              isSelected
                ? ''
                : t.isDark
                  ? 'border-slate-700/50 hover:bg-slate-800/40'
                  : 'border-white hover:bg-gray-50'
            )}
            style={isSelected ? {
              borderColor: primaryColor,
              backgroundColor: primaryColor + '08',
            } : {}}
          >
            <div className="pointer-events-none scale-90 md:scale-100 origin-top-left">
              <Component {...(componentProps as any)} />
            </div>
          </div>
        )
      })}
    </div>
  )
  }
)

ComponentsList.displayName = 'ComponentsList'

export default ComponentsList
