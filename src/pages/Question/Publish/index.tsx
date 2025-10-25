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
import { getComponentConfigByType } from '@/components/material'
import { QuestionComponentType } from '@/store/modules/question-component'
import useLoadQuestionData from '@/hooks/useLoadQuestionData'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import useGetUserInfo from '@/hooks/useGetUserInfo'
import { useTitle, useRequest } from 'ahooks'
import { submitAnswer, AnswerItem } from '@/api/modules/answer'
import { useManageTheme } from '@/hooks/useManageTheme'

// 生成组件 - 区分预览模式和答题模式
function genComponent(
  componentInfo: QuestionComponentType,
  isAnswerMode: boolean,
  answerValues: Record<string, any>,
  onAnswerChange: (componentId: string, value: any) => void
) {
  const { type, props, fe_id } = componentInfo
  const componentConfig = getComponentConfigByType(type)

  if (componentConfig === null) return null

  const { component: Component } = componentConfig

  // 如果是答题模式，需要处理交互组件
  if (isAnswerMode && isInteractiveComponent(type)) {
    const ComponentToRender = Component as any
    const currentValue = answerValues[fe_id]
    return (
      <div key={fe_id}>
        <ComponentToRender
          {...props}
          value={currentValue}
          onChange={(value: any) => onAnswerChange(fe_id, value)}
        />
      </div>
    )
  }

  // 预览模式或展示组件，只渲染不可交互
  const ComponentToRender = Component as any
  return (
    <div key={fe_id}>
      <ComponentToRender {...props} disabled={!isAnswerMode} />
    </div>
  )
}

// 判断是否是交互组件（需要收集答案的组件）
function isInteractiveComponent(type: string): boolean {
  const interactiveTypes = [
    // 基础表单组件
    'question-input',
    'question-textarea',
    'question-radio',
    'question-checkbox',
    'question-select',
    'question-rate',
    'question-slider',
    'question-date',
    'question-upload',
    // 高级选择组件
    'question-cascader',
    'question-autocomplete',
    'question-transfer',
    // 高级交互组件
    'question-ranking',
    'question-matrix',
    'question-nps',
    'question-image-choice',
    'question-star-rating',
    'question-signature',
    'question-color-picker',
    'question-emoji-picker',
  ]
  return interactiveTypes.includes(type)
}

const PublishPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading } = useLoadQuestionData()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const { username } = useGetUserInfo()
  const t = useManageTheme()
  
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
      const answerList: AnswerItem[] = componentList
        .filter((item: QuestionComponentType) => 
          !item.isHidden && isInteractiveComponent(item.type)
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
  const handleAnswerChange = (componentId: string, value: any) => {
    setAnswerValues(prev => ({
      ...prev,
      [componentId]: value,
    }))
  }

  // 验证是否所有必填项都已填写
  const canSubmit = useMemo(() => {
    const requiredComponents = componentList.filter(
      (item: QuestionComponentType) => 
        !item.isHidden && 
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
  }, [componentList, answerValues])

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
              <h2 className={`text-base md:text-lg font-semibold truncate ${t.text.primary}`}>
                {pageInfo.title}
              </h2>
              <div className="hidden sm:block px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded flex-shrink-0 border border-blue-500/20">
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
          {componentList
            .filter((item: QuestionComponentType) => !item.isHidden)
            .map((item: QuestionComponentType) => {
              return (
                <div key={item.fe_id} className="m-[12px]">
                  {genComponent(item, isAnswerMode, answerValues, handleAnswerChange)}
                </div>
              )
            })}

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
