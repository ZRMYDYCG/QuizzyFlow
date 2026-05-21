import React from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

export interface SubmitSuccessViewProps {
  isDark: boolean
  textPrimaryClass: string
  textSecondaryClass: string
  onFillAgain: () => void
}

const SubmitSuccessView: React.FC<SubmitSuccessViewProps> = ({
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  onFillAgain,
}) => (
  <div
    className={`flex flex-col items-center justify-center h-screen ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}
  >
    <div
      className={`text-center p-8 rounded-2xl ${
        isDark ? 'bg-slate-800' : 'bg-white'
      } shadow-lg max-w-md`}
    >
      <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
      <h2 className={`text-2xl font-bold mb-2 ${textPrimaryClass}`}>
        提交成功！
      </h2>
      <p className={`${textSecondaryClass} mb-6`}>
        感谢您的参与，您的答卷已成功提交。
      </p>
      <Button type="primary" onClick={onFillAgain}>
        再次填写
      </Button>
    </div>
  </div>
)

export default SubmitSuccessView
