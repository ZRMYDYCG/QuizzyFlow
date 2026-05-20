import React from 'react'
import { Pagination } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

interface QuestionnairePaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  className?: string
}

const QuestionnairePagination: React.FC<QuestionnairePaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  className,
}) => {
  const { theme } = useTheme()

  if (total <= 1) return null

  return (
    <div
      className={cn(
        'flex justify-center py-4 mt-2 border-t',
        theme === 'dark' ? 'border-white/10' : 'border-gray-200',
        className
      )}
    >
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        showTotal={(t, range) => `第 ${range[0]}-${range[1]} 项，共 ${t} 项`}
      />
    </div>
  )
}

export default QuestionnairePagination
