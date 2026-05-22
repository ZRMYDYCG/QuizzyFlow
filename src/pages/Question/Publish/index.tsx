import React, { useMemo, useState } from 'react'
import { LoadingSpin } from '@/components/loading-spin'
import { Alert, Button, Result, Typography, Modal } from 'antd'
import { message } from '@/utils/app-message'
import { useNavigate, useParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import useLoadQuestionData from '@/hooks/useLoadQuestionData'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useManageTheme } from '@/hooks/useManageTheme'
import { useTheme } from '@/contexts/ThemeContext'
import { useQuestionnairePagination } from '@/hooks/useQuestionnairePagination'
import { isInteractiveComponent } from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'
import type { QuestionComponentType } from '@/store/modules/question-component'
import { submitAnswer } from '@/api/modules/answer'
import PublishQuestionBody from './publish-question-body'
import RespondentIdentityCard from './components/respondent-identity-card'
import AuthorPreviewBar from './components/author-preview-bar'
import AnswerProgressBar from './components/answer-progress-bar'
import SubmitSuccessView from './components/submit-success-view'
import { useRespondentIdentity } from './hooks/use-respondent-identity'
import { useAnswerProgress } from './hooks/use-answer-progress'
import { buildAnswerList } from './utils/build-answer-list'
import { isAnswerFilled } from './utils/is-answer-filled'
import { cn } from '@/utils'

const { Title, Paragraph } = Typography

const publishCanvasBg = (isDark: boolean, hasBgImage: boolean) =>
  hasBgImage ? 'transparent' : isDark ? '#1a1a1f' : '#f9fafb'

const pageShellClass = (isDark: boolean) =>
  cn(
    'flex justify-center items-center h-screen p-6',
    isDark ? 'bg-[#1a1a1f]' : 'bg-gray-50'
  )

const PublishPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, error } = useLoadQuestionData()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const linkages = (pageInfo.linkages ?? []) as MaterialLinkageRule[]
  const { username, nickname, isLoggedIn } = useGetUserInfo()
  const t = useManageTheme()
  const { primaryColor } = useTheme()

  const [copying, setCopying] = useState(false)
  const [answerValues, setAnswerValues] = useState<Record<string, unknown>>({})
  const [startTime] = useState(() => Date.now())
  const [isSubmitted, setIsSubmitted] = useState(false)

  useTitle(pageInfo.title || '问卷填写')

  const isAuthor = useMemo(() => {
    if (!username || !pageInfo.author) return false
    return username === pageInfo.author
  }, [username, pageInfo.author])

  const isAnswerMode = !isAuthor && !isSubmitted

  const {
    state: identityState,
    setMode,
    setCustomName,
    accountDisplayName,
    resolved: respondent,
    identityValid,
    identityHint,
  } = useRespondentIdentity({
    isLoggedIn,
    username,
    nickname,
  })

  const visibleComponents = useMemo(
    () => componentList.filter((item) => !item.isHidden),
    [componentList]
  )

  const {
    paginationEnabled,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    displayItems,
  } = useQuestionnairePagination<QuestionComponentType>(
    visibleComponents,
    pageInfo
  )

  const { total: progressTotal, done: progressDone, percent: progressPercent, linkageRuntime } =
    useAnswerProgress(componentList, linkages, answerValues)

  const answersComplete = useMemo(() => {
    const required = componentList.filter(
      (item) =>
        !linkageRuntime.hiddenById[item.fe_id] &&
        isInteractiveComponent(item.type) &&
        Boolean((item.props as { required?: boolean })?.required)
    )
    return required.every((item) => isAnswerFilled(answerValues[item.fe_id]))
  }, [componentList, answerValues, linkageRuntime])

  const canSubmit = isAnswerMode && identityValid && answersComplete

  const { loading: submitting, run: handleSubmit } = useRequest(
    async () => {
      if (!id) throw new Error('问卷ID不存在')
      if (!identityValid) throw new Error('请完善填写身份')

      const answerList = buildAnswerList(componentList, linkages, answerValues)
      const duration = Math.floor((Date.now() - startTime) / 1000)

      return submitAnswer({
        questionId: id,
        answerList,
        duration,
        respondentName: respondent.respondentName,
        isAnonymous: respondent.isAnonymous,
        respondentUsername: respondent.respondentUsername,
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
      onError: (err: Error) => {
        message.error(err.message || '提交失败，请稍后重试')
      },
    }
  )

  const handleCopyLink = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(window.location.href)
      message.success('链接已复制到剪贴板')
    } catch {
      message.error('复制失败，请手动复制')
    } finally {
      setCopying(false)
    }
  }

  const handleFillAgain = () => {
    setIsSubmitted(false)
    setAnswerValues({})
    setCustomName('')
    if (isLoggedIn) {
      setMode('account')
    }
  }

  const getLayoutMargin = () => {
    switch (pageInfo.layout) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      default:
        return '0 auto'
    }
  }

  const parallaxStyle = pageInfo.parallaxEffect
    ? {
        backgroundAttachment: 'fixed' as const,
        backgroundPosition: `${pageInfo.bgPosition || 'center'} center`,
      }
    : {}

  if (loading) {
    return (
      <div className={pageShellClass(t.isDark)}>
        <LoadingSpin tip="加载问卷中..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className={pageShellClass(t.isDark)}>
        <Result
          status="warning"
          title="无法加载问卷"
          subTitle={error.message || '问卷不存在或未发布'}
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      </div>
    )
  }

  if (!pageInfo.isPublished && !isAuthor) {
    return (
      <div className={pageShellClass(t.isDark)}>
        <Result
          status="403"
          title="问卷未发布"
          subTitle="该问卷尚未发布，暂时无法填写"
          extra={
            <Button type="primary" onClick={() => navigate('/login')}>
              登录后管理问卷
            </Button>
          }
        />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <SubmitSuccessView
        isDark={t.isDark}
        textPrimaryClass={t.text.primary}
        textSecondaryClass={t.text.secondary}
        onFillAgain={handleFillAgain}
      />
    )
  }

  const fillHeader = isAnswerMode ? (
    <div className="m-[12px] mb-4">
      <Title level={2} className={t.text.primary}>
        {pageInfo.title || '问卷'}
      </Title>
      {pageInfo.desc ? (
        <Paragraph className={t.text.secondary}>{pageInfo.desc}</Paragraph>
      ) : null}
      {!isLoggedIn ? (
        <Alert
          type="info"
          showIcon
          className="mt-2"
          message="无需登录即可填写"
          description={
            <>
              填写完成后可直接提交。
              <Button type="link" size="small" onClick={() => navigate('/login')}>
                已有账号？去登录
              </Button>
            </>
          }
        />
      ) : null}
    </div>
  ) : null

  const identitySection = (
    <RespondentIdentityCard
      isLoggedIn={isLoggedIn}
      accountDisplayName={accountDisplayName}
      mode={identityState.mode}
      customName={identityState.customName}
      hint={identityHint}
      onModeChange={setMode}
      onCustomNameChange={setCustomName}
      isDark={t.isDark}
    />
  )

  const hasBgImage = Boolean(pageInfo.bgImage)

  return (
    <div
      className={cn(
        'flex flex-col h-screen',
        !hasBgImage && (t.isDark ? 'bg-[#1a1a1f]' : 'bg-gray-50')
      )}
    >
      {isAuthor ? (
        <AuthorPreviewBar
          title={pageInfo.title || '问卷'}
          type={pageInfo.type}
          primaryColor={primaryColor}
          copying={copying}
          textPrimaryClass={t.text.primary}
          isDark={t.isDark}
          onBack={() => navigate(-1)}
          onCopyLink={handleCopyLink}
          onEdit={() => navigate(`/question/edit/${id}`)}
        />
      ) : null}

      {isAnswerMode && progressTotal > 0 ? (
        <AnswerProgressBar
          percent={progressPercent}
          answered={progressDone}
          total={progressTotal}
          primaryColor={primaryColor}
          isDark={t.isDark}
          paginationLabel={
            paginationEnabled ? `第 ${currentPage} / ${totalPages} 页` : undefined
          }
        />
      ) : null}

      <div
        className="flex-1 overflow-auto"
        style={{
          padding: pageInfo.padding || '20px',
          backgroundImage: hasBgImage ? `url(${pageInfo.bgImage})` : 'none',
          backgroundColor: publishCanvasBg(t.isDark, hasBgImage),
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
            onAnswerValuesChange={setAnswerValues}
            paginationEnabled={paginationEnabled}
            visibleCount={visibleComponents.length}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            canSubmit={canSubmit}
            submitting={submitting}
            onSubmit={handleSubmit}
            headerSection={fillHeader}
            identitySection={identitySection}
            isDark={t.isDark}
          />
        </div>
      </div>
    </div>
  )
}

export default PublishPage
