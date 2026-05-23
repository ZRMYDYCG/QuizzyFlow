import { FC } from 'react'
import { Pagination } from 'antd'
import { useResponsive } from 'ahooks'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'

interface QuestionListPaginationProps {
  total: number
  page: number
  pageSize: number
  onChange: (page: number) => void
  onShowSizeChange: (current: number, size: number) => void
  className?: string
}

const QuestionListPagination: FC<QuestionListPaginationProps> = ({
  total,
  page,
  pageSize,
  onChange,
  onShowSizeChange,
  className,
}) => {
  const responsive = useResponsive()
  const isMobile = !responsive.md
  const t = useManageTheme()

  if (total <= 0) return null

  return (
    <div
      className={cn(
        'flex justify-center md:justify-end pt-4 pb-2',
        className
      )}
    >
      <Pagination
        total={total}
        current={page}
        pageSize={pageSize}
        onChange={onChange}
        onShowSizeChange={onShowSizeChange}
        showSizeChanger={!isMobile}
        pageSizeOptions={[10, 20, 50]}
        showTotal={(count) => `共 ${count} 条`}
        size={isMobile ? 'small' : 'default'}
        simple={isMobile}
        className={t.isDark ? '[&_.ant-pagination-item-link]:bg-transparent' : undefined}
      />
    </div>
  )
}

export default QuestionListPagination
