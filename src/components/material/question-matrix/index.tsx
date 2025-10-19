import { FC } from 'react'
import { Typography, Radio, Checkbox, Space } from 'antd'
import { IQuestionMatrixProps, QuestionMatrixDefaultProps } from './interface'

const QuestionMatrix: FC<IQuestionMatrixProps> = (props: IQuestionMatrixProps) => {
  const { title, rows, columns, isMultiple, values } = {
    ...QuestionMatrixDefaultProps,
    ...props,
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
                          Array.isArray(values?.[row.value]) &&
                          values?.[row.value]?.includes(col.value)
                        }
                      />
                    ) : (
                      <Radio checked={values?.[row.value] === col.value} />
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

