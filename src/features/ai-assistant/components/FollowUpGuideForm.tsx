/**
 * 对话完成后的 AI 引导追问表单
 */
import React, { useMemo, useState } from 'react'
import { Button, Checkbox, Input, Radio } from 'antd'
import { Lightbulb, X } from 'lucide-react'
import type { FollowUpField, FollowUpGuide } from '../types'
import { composeFollowUpMessage } from '../utils/follow-up'
import { cn } from '@/utils'

interface FollowUpGuideFormProps {
  guide: FollowUpGuide
  onSubmit: (message: string) => void
  onDismiss: () => void
  disabled?: boolean
}

function ChoiceField({
  field,
  value,
  onChange,
}: {
  field: FollowUpField
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
}) {
  if (field.type === 'multi_choice') {
    return (
      <Checkbox.Group
        className="flex flex-col gap-1.5"
        value={Array.isArray(value) ? value : []}
        onChange={(checked) => onChange(checked as string[])}
        options={field.options?.map((opt) => ({
          label: <span className="text-xs">{opt.label}</span>,
          value: opt.value,
        }))}
      />
    )
  }

  return (
    <Radio.Group
      className="flex flex-col gap-1.5"
      value={typeof value === 'string' ? value : undefined}
      onChange={(e) => onChange(e.target.value)}
      options={field.options?.map((opt) => ({
        label: <span className="text-xs">{opt.label}</span>,
        value: opt.value,
      }))}
    />
  )
}

const FollowUpGuideForm: React.FC<FollowUpGuideFormProps> = ({
  guide,
  onSubmit,
  onDismiss,
  disabled,
}) => {
  const [values, setValues] = useState<Record<string, string | string[]>>({})

  const hasFormFields = useMemo(
    () => guide.fields.some((f) => f.type !== 'chips'),
    [guide.fields],
  )

  const updateValue = (fieldId: string, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleChipClick = (message: string) => {
    if (disabled) return
    onSubmit(message)
  }

  const handleSubmit = () => {
    const message = composeFollowUpMessage(guide, values).trim()
    if (!message) return
    onSubmit(message)
  }

  return (
    <div
      className={cn(
        'mb-3 overflow-hidden rounded-xl border',
        'border-amber-200/80 bg-amber-50/70',
        'dark:border-amber-900/40 dark:bg-amber-950/25',
      )}
    >
      <div className="flex items-start gap-2 px-3 py-2.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-amber-900 dark:text-amber-100">
            {guide.title || '还可以继续帮你优化'}
          </div>
          {guide.description && (
            <p className="mt-0.5 text-[11px] leading-snug text-amber-800/80 dark:text-amber-200/70">
              {guide.description}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="关闭引导"
          onClick={onDismiss}
          disabled={disabled}
          className="shrink-0 rounded p-1 text-amber-700/70 hover:bg-amber-100/80 dark:text-amber-300/70 dark:hover:bg-amber-900/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3 border-t border-amber-200/60 px-3 py-3 dark:border-amber-900/30">
        {guide.fields.map((field) => (
          <div key={field.id}>
            {field.type === 'chips' ? (
              <div>
                {field.label && (
                  <div className="mb-1.5 text-[11px] text-amber-800/70 dark:text-amber-200/60">
                    {field.label}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {field.options?.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleChipClick(opt.value)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                        'border-amber-300/80 bg-white text-amber-900 hover:bg-amber-100',
                        'dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/40',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 text-[11px] font-medium text-amber-900/90 dark:text-amber-100/90">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </div>
                {field.type === 'text' ? (
                  <Input.TextArea
                    rows={2}
                    disabled={disabled}
                    placeholder={field.placeholder || '请输入...'}
                    value={typeof values[field.id] === 'string' ? values[field.id] : ''}
                    onChange={(e) => updateValue(field.id, e.target.value)}
                    className="text-xs"
                  />
                ) : (
                  <ChoiceField
                    field={field}
                    value={values[field.id]}
                    onChange={(val) => updateValue(field.id, val)}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {hasFormFields && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="primary"
              size="small"
              disabled={disabled}
              onClick={handleSubmit}
            >
              {guide.submitLabel || '发送'}
            </Button>
            <Button type="text" size="small" disabled={disabled} onClick={onDismiss}>
              {guide.dismissLabel || '暂不需要'}
            </Button>
          </div>
        )}

        {!hasFormFields && (
          <button
            type="button"
            disabled={disabled}
            onClick={onDismiss}
            className="text-[11px] text-amber-700/70 hover:text-amber-900 dark:text-amber-300/70 dark:hover:text-amber-100"
          >
            {guide.dismissLabel || '暂不需要'}
          </button>
        )}
      </div>
    </div>
  )
}

export default FollowUpGuideForm
