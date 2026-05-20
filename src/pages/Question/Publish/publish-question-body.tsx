import React from 'react'
import { Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { QuestionComponentType } from '@/store/modules/question-component'
import {
  MaterialLinkageProvider,
  LinkedComponentRenderer,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'
import QuestionnairePagination from '@/components/questionnaire/questionnaire-pagination'

export interface PublishQuestionBodyProps {
  componentList: QuestionComponentType[]
  linkages: MaterialLinkageRule[]
  displayItems: QuestionComponentType[]
  isAnswerMode: boolean
  answerValues: Record<string, any>
  onAnswerValuesChange: (values: Record<string, unknown>) => void
  paginationEnabled: boolean
  visibleCount: number
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
}

const PublishQuestionBody: React.FC<PublishQuestionBodyProps> = ({
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
}) => {
  return (
    <>
      <MaterialLinkageProvider
        componentList={componentList}
        linkages={linkages}
        isAnswerMode={isAnswerMode}
        values={answerValues}
        onValuesChange={onAnswerValuesChange}
      >
        {displayItems.map((item) => (
          <div key={item.fe_id} className="m-[12px]">
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

      {paginationEnabled && visibleCount > 0 ? (
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
            disabled={!canSubmit}
            onClick={onSubmit}
            className="px-12 h-12 text-base font-medium"
          >
            提交问卷
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default PublishQuestionBody
