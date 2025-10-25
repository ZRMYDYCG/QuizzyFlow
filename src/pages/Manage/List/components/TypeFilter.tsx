/**
 * 问卷类型筛选器组件
 */
import { FC } from 'react'
import { Select } from 'antd'
import * as LucideIcons from 'lucide-react'
import {
  QuestionnaireType,
  QUESTIONNAIRE_TYPES,
  MVP_RECOMMENDED_TYPES,
} from '@/constants/questionnaire-types'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'

interface TypeFilterProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const TypeFilter: FC<TypeFilterProps> = ({ value, onChange, className }) => {
  return (
    <Select
      placeholder="筛选类型"
      value={value}
      onChange={onChange}
      allowClear
      className={className}
      style={{ minWidth: 150 }}
      optionLabelProp="label"
    >
      {MVP_RECOMMENDED_TYPES.map((type) => {
        const config = QUESTIONNAIRE_TYPES[type]
        const Icon = (LucideIcons as any)[config.icon] || LucideIcons.FileText

        return (
          <Select.Option
            key={type}
            value={type}
            label={
              <div className="flex items-center gap-1">
                <Icon size={14} />
                <span>{config.label}</span>
              </div>
            }
          >
            <div className="flex items-center gap-2 py-1">
              <Icon size={16} color={config.color} />
              <span>{config.label}</span>
            </div>
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default TypeFilter

