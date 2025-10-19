import { FC, useState } from 'react'
import { Typography, Radio, Checkbox } from 'antd'
import { IQuestionMatrixProps, QuestionMatrixDefaultProps } from './interface'

const QuestionMatrix: FC<IQuestionMatrixProps> = (props: IQuestionMatrixProps) => {
  const { title, rows, columns, isMultiple, values: initialValues } = {
    ...QuestionMatrixDefaultProps,
    ...props,
  }

  const [values, setValues] = useState<Record<string, string | string[]>>(
    initialValues || {}
  )

  // 处理单选
  const handleRadioChange = (rowValue: string, colValue: string) => {
    setValues((prev) => ({
      ...prev,
      [rowValue]: colValue,
    }))
  }

  // 处理多选
  const handleCheckboxChange = (rowValue: string, colValue: string, checked: boolean) => {
    setValues((prev) => {
      const currentValues = Array.isArray(prev[rowValue]) ? prev[rowValue] : []
      if (checked) {
        return {
          ...prev,
          [rowValue]: [...(currentValues as string[]), colValue],
        }
      } else {
        return {
          ...prev,
          [rowValue]: (currentValues as string[]).filter((v) => v !== colValue),
        }
      }
    })
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
                          Array.isArray(values[row.value]) &&
                          (values[row.value] as string[]).includes(col.value)
                        }
                        onChange={(e) =>
                          handleCheckboxChange(row.value, col.value, e.target.checked)
                        }
                      />
                    ) : (
                      <Radio
                        checked={values[row.value] === col.value}
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

