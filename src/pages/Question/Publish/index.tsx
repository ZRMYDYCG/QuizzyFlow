import React, { useState, useMemo } from 'react'
import { Button, Spin, Space, message, Tooltip, Modal } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { QuestionComponentType } from '@/store/modules/question-component'
import {
  isInteractiveComponent,
  computeLinkageRuntimeState,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'
import useLoadQuestionData from '@/hooks/useLoadQuestionData'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useTitle, useRequest } from 'ahooks'
import { submitAnswer, AnswerItem } from '@/api/modules/answer'
import { useManageTheme } from '@/hooks/useManageTheme'
import { useTheme } from '@/contexts/ThemeContext'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'
import { QuestionnaireType } from '@/constants/questionnaire-types'
import { useQuestionnairePagination } from '@/hooks/useQuestionnairePagination'
import PublishQuestionBody from './publish-question-body'

const PublishPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading } = useLoadQuestionData()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const linkages = (pageInfo.linkages ?? []) as MaterialLinkageRule[]

  const visibleComponents = useMemo(
    () => componentList.filter((item: QuestionComponentType) => !item.isHidden),
    [componentList]
  )

  const {
    paginationEnabled,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    totalItems,
    displayItems,
  } = useQuestionnairePagination<QuestionComponentType>(visibleComponents, pageInfo)

  const { username } = useGetUserInfo()
  const t = useManageTheme()
  const { primaryColor } = useTheme()

  const [copying, setCopying] = useState(false)
  const [answerValues, setAnswerValues] = useState<Record<string, any>>({})
  const [startTime] = useState<number>(Date.now())
  const [isSubmitted, setIsSubmitted] = useState(false)

  useTitle(`${pageInfo.title || '问卷'}`)

  const isAuthor = useMemo(() => {
    if (!username || !pageInfo.author) {
      return false
    }
    return username === pageInfo.author
  }, [username, pageInfo.author])

  const isAnswerMode = !isAuthor && !isSubmitted

  const { loading: submitting, run: handleSubmit } = useRequest(
    async () => {
      if (!id) {
        throw new Error('问卷ID不存在')
      }

      const submitRuntime = computeLinkageRuntimeState(
        componentList,
        linkages,
        answerValues
      )
      const answerList: AnswerItem[] = componentList
        .filter(
          (item: QuestionComponentType) =>
            !submitRuntime.hiddenById[item.fe_id] &&
            isInteractiveComponent(item.type)
        )
        .map((item: QuestionComponentType) => {
          const value = answerValues[item.fe_id]
          let finalValue = value
          if (value === undefined || value === '') {
            finalValue = null
          } else if (item.type === 'question-checkbox' && Array.isArray(value)) {
            finalValue = value
          } else if (item.type === 'question-date') {
            if (value) {
              if (Array.isArray(value)) {
                finalValue = value.map((v: any) => v?.format?.('YYYY-MM-DD') || v)
              } else if (value.format) {
                finalValue = value.format('YYYY-MM-DD HH:mm:ss')
              } else {
                finalValue = value
              }
            } else {
              finalValue = null
            }
          } else if (value === null) {
            finalValue = null
          }

          return {
            componentId: item.fe_id,
            componentType: item.type,
            value: finalValue,
          }
        })

      const duration = Math.floor((Date.now() - startTime) / 1000)

      return await submitAnswer({
        questionId: id,
        answerList,
        duration,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        setIsSubmitted(true)
        Modal.success({
          title: '提交成功',
          content: '感谢您的参与！您的答卷已成功提交。',
          okText: '确定',
        })
      },
      onError: (error: any) => {
        message.error(error.message || '提交失败，请稍后重试')
      },
    }
  )

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      setCopying(true)
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch {
      message.error('复制失败，请手动复制')
    } finally {
      setCopying(false)
    }
  }

  const handleEdit = () => {
    navigate(`/question/edit/${id}`)
  }

  const handleAnswerValuesChange = (values: Record<string, unknown>) => {
    setAnswerValues(values as Record<string, any>)
  }

  const linkageRuntime = useMemo(
    () => computeLinkageRuntimeState(componentList, linkages, answerValues),
    [componentList, linkages, answerValues]
  )

  const canSubmit = useMemo(() => {
    const requiredComponents = componentList.filter(
      (item: QuestionComponentType) =>
        !linkageRuntime.hiddenById[item.fe_id] &&
        isInteractiveComponent(item.type) &&
        Boolean((item.props as { required?: boolean })?.required)
    )

    return requiredComponents.every((item: QuestionComponentType) => {
      const value = answerValues[item.fe_id]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    })
  }, [componentList, answerValues, linkageRuntime])

  const getLayoutMargin = () => {
    switch (pageInfo.layout) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      case 'center':
      default:
        return '0 auto'
    }
  }

  const parallaxStyle = pageInfo.parallaxEffect
    ? {
        backgroundAttachment: 'fixed',
        backgroundPosition: `${pageInfo.bgPosition || 'center'} center`,
      }
    : {}

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen ${
          t.isDark ? 'bg-slate-900' : 'bg-gray-50'
        }`}
      >
        <div
          className={`text-center p-8 rounded-2xl ${
            t.isDark ? 'bg-slate-800' : 'bg-white'
          } shadow-lg max-w-md`}
        >
          <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${t.text.primary}`}>
            提交成功！
          </h2>
          <p className={`${t.text.secondary} mb-6`}>
            感谢您的参与，您的答卷已成功提交。
          </p>
          <Button type="primary" onClick={() => window.location.reload()}>
            再次填写
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {isAuthor && (
        <div
          className={`py-3 px-4 md:px-6 shadow-sm sticky top-0 z-10 ${
            t.isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
                className="flex-shrink-0"
              >
                <span className="hidden sm:inline">返回</span>
              </Button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2
                  className={`text-base md:text-lg font-semibold truncate ${t.text.primary}`}
                >
                  {pageInfo.title}
                </h2>
                {pageInfo.type && (
                  <QuestionnaireTypeTag
                    type={pageInfo.type as QuestionnaireType}
                    showIcon={true}
                    size="small"
                  />
                )}
              </div>
              <div
                className="hidden sm:block px-2 py-1 text-xs rounded flex-shrink-0 border"
                style={{
                  backgroundColor: primaryColor + '10',
                  color: primaryColor,
                  borderColor: primaryColor + '20',
                }}
              >
                预览模式
              </div>
            </div>
            <Space className="flex-shrink-0">
              <Tooltip title="复制链接">
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  loading={copying}
                  onClick={handleCopyLink}
                >
                  <span className="hidden sm:inline">分享</span>
                </Button>
              </Tooltip>
              <Button type="default" icon={<EditOutlined />} onClick={handleEdit}>
                <span className="hidden sm:inline">编辑</span>
              </Button>
            </Space>
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-auto"
        style={{
          padding: pageInfo.padding || '20px',
          backgroundImage: pageInfo.bgImage
            ? `url(${pageInfo.bgImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
          backgroundPosition: pageInfo.bgPosition || 'center',
          ...parallaxStyle,
        }}
      >
        <div
          style={{
            maxWidth: pageInfo.maxWidth || '800px',
            margin: getLayoutMargin(),
            transition: 'all 0.3s ease',
          }}
        >
          <PublishQuestionBody
            componentList={componentList}
            linkages={linkages}
            displayItems={displayItems}
            isAnswerMode={isAnswerMode}
            answerValues={answerValues}
            onAnswerValuesChange={handleAnswerValuesChange}
            paginationEnabled={paginationEnabled}
            visibleCount={visibleComponents.length}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            canSubmit={canSubmit}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default PublishPage
