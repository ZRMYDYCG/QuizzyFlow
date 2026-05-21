import React from 'react'
import { Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import {
  MaterialLinkageProvider,
  LinkedComponentRenderer,
} from '@/features/material-linkage'
import QuestionnairePagination from '@/components/questionnaire/questionnaire-pagination'
import { cn } from '@/utils'
import type { PublishQuestionBodyProps } from './publish-question-body.types'

const PublishQuestionBody = ({
  componentList,
  linkages,
  displayItems,
  isAnswerMode,
  answerValues,
  onAnswerValuesChange,
  paginationEnabled,
  visibleCount,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  canSubmit,
  submitting,
  onSubmit,
  identitySection,
  headerSection,
  isDark = false,
}: PublishQuestionBodyProps) => {
  const itemShellClass = cn(
    'm-[12px] p-4 rounded-xl transition-colors',
    isDark
      ? 'bg-slate-800/70 border border-slate-700/60 shadow-none'
      : 'bg-white/90 border border-gray-100 shadow-sm'
  )

  return (
    <div className="publish-question-body">
      {headerSection}
      {isAnswerMode ? identitySection : null}
      <MaterialLinkageProvider
        componentList={componentList}
        linkages={linkages}
        isAnswerMode={isAnswerMode}
        values={answerValues}
        onValuesChange={onAnswerValuesChange}
      >
        {displayItems.map((item) => (
          <div key={item.fe_id} className={itemShellClass}>
            <LinkedComponentRenderer
              component={item}
              isAnswerMode={isAnswerMode}
              answerValues={answerValues}
              onAnswerChange={(componentId, value) => {
                onAnswerValuesChange({
                  ...answerValues,
                  [componentId]: value,
                })
              }}
            />
          </div>
        ))}
      </MaterialLinkageProvider>

      {paginationEnabled && visibleCount !== 0 ? (
        <QuestionnairePagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          onChange={onPageChange}
        />
      ) : null}

      {isAnswerMode ? (
        <div className="m-[12px] mt-8 flex justify-center">
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={submitting}
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
            className="px-12 h-12 text-base font-medium"
          >
            提交问卷
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default PublishQuestionBody
export type { PublishQuestionBodyProps } from './publish-question-body.types'
