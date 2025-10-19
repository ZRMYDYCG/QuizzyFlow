import { FC, useState } from 'react'
import { Typography, Checkbox, Alert } from 'antd'
import { IQuestionConsentProps, QuestionConsentDefaultProps } from './interface'

const QuestionConsent: FC<IQuestionConsentProps> = (props: IQuestionConsentProps) => {
  const { title, content, linkText, linkUrl, required, checked: initialChecked } = {
    ...QuestionConsentDefaultProps,
    ...props,
  }

  const [checked, setChecked] = useState<boolean>(initialChecked || false)

  const handleChange = (e: any) => {
    setChecked(e.target.checked)
  }

  return (
    <div className="w-full">
      {title && (
        <Typography.Paragraph strong className="mb-4">
          {title}
        </Typography.Paragraph>
      )}

      <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <Checkbox checked={checked} onChange={handleChange} className="items-start">
          <span className="text-gray-700">
            {content}{' '}
            {linkText && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={(e) => e.stopPropagation()}
              >
                {linkText}
              </a>
            )}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </Checkbox>

        {required && !checked && (
          <Alert
            message="请阅读并同意隐私政策后继续"
            type="warning"
            showIcon
            className="mt-4"
          />
        )}
      </div>

      {checked && (
        <div className="mt-3 text-sm text-green-600 flex items-center gap-2">
          <span>✓</span>
          <span>感谢您的同意</span>
        </div>
      )}
    </div>
  )
}

export default QuestionConsent

