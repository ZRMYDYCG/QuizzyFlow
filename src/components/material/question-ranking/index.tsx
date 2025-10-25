import { FC, useState } from 'react'
import { Typography } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import { IQuestionRankingProps, QuestionRankingDefaultProps, RankingOptionType } from './interface'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 可拖拽的选项组件
const SortableItem: FC<{
  option: RankingOptionType
  index: number
  showNumbers?: boolean
}> = ({ option, index, showNumbers }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option.value })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-move group"
    >
      {/* 拖拽手柄 */}
      <HolderOutlined className="text-gray-400 text-lg group-hover:text-blue-500" />

      {/* 序号 */}
      {showNumbers && (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white font-bold rounded-full text-sm">
          {index + 1}
        </div>
      )}

      {/* 选项文本 */}
      <div className="flex-1 font-medium text-gray-700">{option.text}</div>
    </div>
  )
}

const QuestionRanking: FC<IQuestionRankingProps> = (props: IQuestionRankingProps) => {
  const { title, options: initialOptions, showNumbers, description, onChange } = {
    ...QuestionRankingDefaultProps,
    ...props,
  }

  // 按order排序
  const sortedInitialOptions = [...(initialOptions || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentOptions = externalValue !== undefined ? externalValue : sortedInitialOptions

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后才触发拖拽
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over === null) return

    if (active.id !== over.id) {
      const oldIndex = currentOptions.findIndex((item: RankingOptionType) => item.value === active.id)
      const newIndex = currentOptions.findIndex((item: RankingOptionType) => item.value === over.id)

      const newItems = arrayMove(currentOptions, oldIndex, newIndex)
      // 更新 order
      const updatedItems = newItems.map((item, index) => ({ ...item, order: index + 1 }))
      
      if (onChange) {
        ;(onChange as any)(updatedItems)
      }
    }
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-2">
        {title}
      </Typography.Paragraph>

      {description && (
        <Typography.Paragraph className="text-gray-500 text-sm mb-4">
          {description}
        </Typography.Paragraph>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={currentOptions.map((o: RankingOptionType) => o.value)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {currentOptions.map((option: RankingOptionType, index: number) => (
              <SortableItem
                key={option.value}
                option={option}
                index={index}
                showNumbers={showNumbers}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default QuestionRanking

