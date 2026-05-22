import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Select, Button, Alert, Result } from 'antd'
import { message } from '@/utils/app-message'
import type { Rule } from 'antd/es/form'
import {
  ArrowLeftOutlined,
  BugOutlined,
  BulbOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { createFeedback, type FeedbackType, type CreateFeedbackPayload } from '@/api/modules/feedback'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { CyberBackdrop } from '@/pages/Home/components'
import '@/pages/Home/home.css'

const { TextArea } = Input

const TYPE_OPTIONS: { value: FeedbackType; label: string; icon: React.ReactNode }[] = [
  { value: 'bug', label: 'Bug 报告', icon: <BugOutlined /> },
  { value: 'feature', label: '功能请求', icon: <BulbOutlined /> },
  { value: 'improvement', label: '改进建议', icon: <ToolOutlined /> },
  { value: 'other', label: '其他', icon: <QuestionCircleOutlined /> },
]

const optionalEmailRules: Rule[] = [
  {
    validator: async (_, value) => {
      const trimmed = typeof value === 'string' ? value.trim() : ''
      if (!trimmed) return
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
      if (!ok) throw new Error('请输入有效邮箱')
    },
  },
]

function collectEnvInfo() {
  const ua = navigator.userAgent
  const platform = navigator.platform || ''
  return { browserInfo: ua.slice(0, 500), osInfo: platform.slice(0, 120) }
}

const FeedbackPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm<CreateFeedbackPayload>()
  const { isLoggedIn, username, nickname } = useGetUserInfo()
  const envInfo = useMemo(() => collectEnvInfo(), [])
  const [submitted, setSubmitted] = useState(false)

  const { loading, run: submitFeedback } = useRequest(
    async (values: CreateFeedbackPayload) => {
      const payload: CreateFeedbackPayload = {
        ...values,
        ...envInfo,
        authorEmail: values.authorEmail?.trim() || undefined,
      }
      return createFeedback(payload)
    },
    {
      manual: true,
      onSuccess: () => {
        form.resetFields()
        setSubmitted(true)
        message.success('反馈提交成功')
      },
      onError: (err: Error) => {
        message.error(err.message || '提交失败，请稍后重试')
      },
    }
  )

  const handleSubmit = (values: CreateFeedbackPayload) => {
    submitFeedback(values)
  }

  const handleFinishFailed = () => {
    message.warning('请检查表单填写是否完整')
  }

  const displayName = nickname || username

  const emailRules: Rule[] = isLoggedIn
    ? optionalEmailRules
    : [
        { required: true, message: '请填写联系邮箱' },
        ...optionalEmailRules,
      ]

  return (
    <div className="home-cyber relative flex min-h-screen flex-col overflow-hidden bg-[var(--cyber-bg)] text-zinc-300">
      <CyberBackdrop />

      <header className="relative z-10 flex items-center justify-between border-b border-zinc-900/80 px-6 py-5 md:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase no-underline transition-colors hover:text-[var(--cyber-accent)]"
        >
          <ArrowLeftOutlined />
          返回首页
        </Link>
        <span className="font-mono text-sm tracking-[0.2em] text-zinc-400">QuizzyFlow</span>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-xl flex-1 px-6 py-10 md:px-10">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center justify-center text-[var(--cyber-accent)]">
            <MessageOutlined className="text-2xl" />
          </div>
          <h1 className="mb-2 font-mono text-xl tracking-[0.15em] text-white uppercase">意见反馈</h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            遇到问题或有新想法？告诉我们，你的反馈会出现在管理后台的反馈列表中。
          </p>
        </div>

        {isLoggedIn ? (
          <p className="mb-6 text-center font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
            当前账号：{displayName}
          </p>
        ) : (
          <Alert
            type="info"
            showIcon
            className="mb-6 border border-zinc-800 bg-zinc-950/40"
            message="无需登录即可提交"
            description="未登录时请填写联系邮箱，便于我们回复你。已登录用户会自动关联账号。"
          />
        )}

        {submitted ? (
          <div className="home-cyber-glow rounded-lg border border-[var(--cyber-accent-dim)] bg-zinc-950/60 p-6">
            <Result
              status="success"
              title="反馈已提交"
              subTitle="感谢你的反馈，我们会尽快在后台查看并处理。"
              extra={[
                <Button
                  key="again"
                  onClick={() => setSubmitted(false)}
                  className="border-zinc-700 text-zinc-400"
                >
                  继续提交
                </Button>,
                <Button
                  key="home"
                  type="primary"
                  onClick={() => navigate('/')}
                  className="bg-[var(--cyber-accent)] text-black hover:opacity-90"
                >
                  返回首页
                </Button>,
              ]}
            />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleFinishFailed}
            disabled={loading}
            requiredMark={false}
            className="home-cyber-glow rounded-lg border border-[var(--cyber-accent-dim)] bg-zinc-950/60 p-6 md:p-8"
          >
            <Form.Item
              name="type"
              label={<span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">反馈类型</span>}
              rules={[{ required: true, message: '请选择反馈类型' }]}
            >
              <Select
                placeholder="选择类型"
                getPopupContainer={(node) => node.parentElement ?? document.body}
                options={TYPE_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: (
                    <span className="inline-flex items-center gap-2">
                      {opt.icon}
                      {opt.label}
                    </span>
                  ),
                }))}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label={<span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">标题</span>}
              rules={[
                { required: true, message: '请输入标题' },
                { max: 100, message: '标题不超过 100 字' },
              ]}
            >
              <Input placeholder="简要描述问题或建议" maxLength={100} showCount />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">详细描述</span>}
              rules={[
                { required: true, message: '请填写详细描述' },
                { min: 10, message: '至少 10 个字符' },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="请描述复现步骤、期望行为或具体建议…"
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="authorEmail"
              label={
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                  联系邮箱{isLoggedIn ? '（选填）' : ''}
                </span>
              }
              rules={emailRules}
            >
              <Input placeholder={isLoggedIn ? '便于我们回复你' : '用于接收处理进展'} />
            </Form.Item>

            <Form.Item className="mb-0 pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-11 border-0 bg-[var(--cyber-accent)] font-mono text-xs tracking-[0.25em] text-black uppercase hover:opacity-90"
              >
                提交反馈
              </Button>
            </Form.Item>
          </Form>
        )}
      </main>
    </div>
  )
}

export default FeedbackPage
