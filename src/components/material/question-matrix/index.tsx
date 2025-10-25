import { FC, useState } from 'react'
import { Typography, Radio, Checkbox } from 'antd'
import { IQuestionMatrixProps, QuestionMatrixDefaultProps } from './interface'

const QuestionMatrix: FC<IQuestionMatrixProps> = (props: IQuestionMatrixProps) => {
  const { title, rows, columns, isMultiple, values: initialValues, onChange } = {
    ...QuestionMatrixDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValues = externalValue !== undefined ? externalValue : (initialValues || {})

  // 处理单选
  const handleRadioChange = (rowValue: string, colValue: string) => {
    const newValues = {
      ...currentValues,
      [rowValue]: colValue,
    }
    if (onChange) {
      ;(onChange as any)(newValues)
    }
  }

  // 处理多选
  const handleCheckboxChange = (rowValue: string, colValue: string, checked: boolean) => {
    const currentRowValues = Array.isArray(currentValues[rowValue]) ? currentValues[rowValue] : []
    const newValues = {
      ...currentValues,
      [rowValue]: checked
        ? [...(currentRowValues as string[]), colValue]
        : (currentRowValues as string[]).filter((v) => v !== colValue),
    }
    if (onChange) {
      ;(onChange as any)(newValues)
    }
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 p-3 text-left min-w-[150px]">
                项目 / 评价
              </th>
              {columns?.map((col) => (
                <th
                  key={col.value}
                  className="border border-gray-300 bg-gray-50 p-3 text-center min-w-[100px]"
                >
                  {col.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr key={row.value}>
                <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                  {row.text}
                </td>
                {columns?.map((col) => (
                  <td key={col.value} className="border border-gray-300 p-3 text-center">
                    {isMultiple ? (
                      <Checkbox
                        checked={
                          Array.isArray(currentValues[row.value]) &&
                          (currentValues[row.value] as string[]).includes(col.value)
                        }
                        onChange={(e) =>
                          handleCheckboxChange(row.value, col.value, e.target.checked)
                        }
                      />
                    ) : (
                      <Radio
                        checked={currentValues[row.value] === col.value}
                        onChange={() => handleRadioChange(row.value, col.value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuestionMatrix

