import React, { createContext, useContext } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

type SortableHandleContextValue = {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}

const SortableHandleContext = createContext<SortableHandleContextValue | null>(
  null,
)

interface ISortItemProps {
  id: string
  children: React.ReactNode
  /** 为 true 时仅 SortableDragHandle 可触发排序，避免与画布外原生拖拽冲突 */
  useDragHandle?: boolean
}

interface SortableDragHandleProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export const SortableDragHandle: React.FC<SortableDragHandleProps> = ({
  children,
  className,
  title,
}) => {
  const ctx = useContext(SortableHandleContext)
  if (!ctx) return null

  return (
    <button
      type="button"
      title={title}
      className={className}
      {...ctx.attributes}
      {...ctx.listeners}
    >
      {children}
    </button>
  )
}

const SortItem: React.FC<ISortItemProps> = ({
  children,
  id,
  useDragHandle = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 10, opacity: 0.85 } : {}),
  }

  if (useDragHandle) {
    return (
      <SortableHandleContext.Provider value={{ attributes, listeners }}>
        <div ref={setNodeRef} style={style}>
          {children}
        </div>
      </SortableHandleContext.Provider>
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default SortItem
