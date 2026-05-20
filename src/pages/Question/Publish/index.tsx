import React, { useState, useEffect, useMemo } from 'react'
import { Button, Spin, Space, message, Tooltip, Modal } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  CopyOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { QuestionComponentType } from '@/store/modules/question-component'
import {
  MaterialLinkageProvider,
  LinkedComponentRenderer,
  isInteractiveComponent,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'
import { computeLinkageRuntimeState } from '@/features/material-linkage'
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
import QuestionnairePagination from '@/components/questionnaire/questionnaire-pagination'

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
  } = useQuestionnairePagination(visibleComponents, pageInfo)

  const { username } = useGetUserInfo()
  const t = useManageTheme()
  const { primaryColor } = useTheme()
  
  const [copying, setCopying] = useState(false)
  const [answerValues, setAnswerValues] = useState<Record<string, any>>({})
  const [startTime] = useState<number>(Date.now())
  const [isSubmitted, setIsSubmitted] = useState(false)

  useTitle(`${pageInfo.title || '问卷'}`)

  // 判断当前用户是否是问卷创建者
  const isAuthor = useMemo(() => {
    // 比较当前登录用户和问卷作者
    if (!username || !pageInfo.author) {
      return false
    }
    return username === pageInfo.author
  }, [username, pageInfo.author])

  // 是否是答题模式（非作者访问已发布问卷）
  const isAnswerMode = !isAuthor && !isSubmitted

  // 提交答卷
  const { loading: submitting, run: handleSubmit } = useRequest(
    async () => {
      if (!id) {
        throw new Error('问卷ID不存在')
      }

      // 收集所有交互组件的答案
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
          // 对于 checkbox，保留空数组；对于其他类型，空值转为 null
          let finalValue = value
          if (value === undefined || value === '') {
            finalValue = null
          } else if (item.type === 'question-checkbox' && Array.isArray(value)) {
            // checkbox 保留空数组
            finalValue = value
          } else if (item.type === 'question-date') {
            // 日期组件：将 Dayjs 对象转换为字符串
            if (value) {
              if (Array.isArray(value)) {
                // Range picker
                finalValue = value.map((v: any) => v?.format?.('YYYY-MM-DD') || v)
              } else if (value.format) {
                // Single picker with Dayjs object
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

      // 计算答题用时（秒）
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

  // 复制链接
  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      setCopying(true)
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
    } finally {
      setCopying(false)
    }
  }

  // 返回编辑
  const handleEdit = () => {
    navigate(`/question/edit/${id}`)
  }

  // 答案变更
  const handleAnswerValuesChange = (values: Record<string, unknown>) => {
    setAnswerValues(values as Record<string, any>)
  }

  // 验证是否所有必填项都已填写
  const linkageRuntime = useMemo(
    () => computeLinkageRuntimeState(componentList, linkages, answerValues),
    [componentList, linkages, answerValues]
  )

  const canSubmit = useMemo(() => {
    const requiredComponents = componentList.filter(
      (item: QuestionComponentType) =>
        !linkageRuntime.hiddenById[item.fe_id] &&
        isInteractiveComponent(item.type) &&
        item.props?.required
    )

    return requiredComponents.every((item: QuestionComponentType) => {
      const value = answerValues[item.fe_id]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    })
  }, [componentList, answerValues, linkageRuntime])

  // 计算布局方向对应的margin
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

  // 视差滚动效果
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

  // 已提交状态
  if (isSubmitted) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${
        t.isDark ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={`text-center p-8 rounded-2xl ${
          t.isDark ? 'bg-slate-800' : 'bg-white'
        } shadow-lg max-w-md`}>
          <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${t.text.primary}`}>
            提交成功！
          </h2>
          <p className={`${t.text.secondary} mb-6`}>
            感谢您的参与，您的答卷已成功提交。
          </p>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
          >
            再次填写
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header - 只在创建者预览时显示 */}
      {isAuthor && (
        <div className={`py-3 px-4 md:px-6 shadow-sm sticky top-0 z-10 ${
          t.isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'
        }`}>
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
                <h2 className={`text-base md:text-lg font-semibold truncate ${t.text.primary}`}>
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
                  borderColor: primaryColor + '20'
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
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                <span className="hidden sm:inline">编辑</span>
              </Button>
            </Space>
          </div>
        </div>
      )}

      {/* Content Area */}
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
          <MaterialLinkageProvider
            componentList={componentList}
            linkages={linkages}
            isAnswerMode={isAnswerMode}
            values={answerValues}
            onValuesChange={handleAnswerValuesChange}
          >
            {displayItems.map((item: QuestionComponentType) => (
              <div key={item.fe_id} className="m-[12px]">
                <LinkedComponentRenderer
                  component={item}
                  isAnswerMode={isAnswerMode}
                  answerValues={answerValues}
                  onAnswerChange={(id, value) =>
                    handleAnswerValuesChange({ ...answerValues, [id]: value })
                  }
                />
              </div>
            ))}
          </MaterialLinkageProvider>

          {paginationEnabled && visibleComponents.length > 0 && (
            <QuestionnairePagination
              current={currentPage}
              total={totalItems}
              pageSize={itemsPerPage}
              onChange={setCurrentPage}
            />
          )}

          {/* 答题模式下的提交按钮 */}
          {isAnswerMode && (
            <div className="m-[12px] mt-8 flex justify-center">
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={submitting}
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="px-12 h-12 text-base font-medium"
              >
                提交问卷
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublishPage
