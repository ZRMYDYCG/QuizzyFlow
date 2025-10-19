import { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox, Select } from 'antd'
import { IQuestionMultipageProgressProps } from './interface'

const MultipageProgressProps: FC<IQuestionMultipageProgressProps> = (
  props: IQuestionMultipageProgressProps
) => {
  const {
    title,
    totalPages,
    currentPage,
    showPercentage,
    showPageNumber,
    progressType,
    onChange,
    disabled,
  } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title,
      totalPages,
      currentPage,
      showPercentage,
      showPageNumber,
      progressType,
    })
  }, [title, totalPages, currentPage, showPercentage, showPageNumber, progressType])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        totalPages,
        currentPage,
        showPercentage,
        showPageNumber,
        progressType,
      }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item name="title" label="标题">
        <Input placeholder="如：问卷进度" />
      </Form.Item>

      <Form.Item
        name="totalPages"
        label="总页数"
        rules={[
          { required: true, message: '请输入总页数' },
          { type: 'number', min: 1, message: '至少1页' },
        ]}
      >
        <InputNumber min={1} max={100} className="w-full" placeholder="问卷总页数" />
      </Form.Item>

      <Form.Item
        name="currentPage"
        label="当前页"
        rules={[
          { required: true, message: '请输入当前页' },
          { type: 'number', min: 1, message: '至少第1页' },
        ]}
      >
        <InputNumber min={1} max={100} className="w-full" placeholder="当前第几页" />
      </Form.Item>

      <Form.Item name="progressType" label="进度条类型">
        <Select>
          <Select.Option value="line">线性进度条</Select.Option>
          <Select.Option value="circle">圆形进度条</Select.Option>
          <Select.Option value="steps">步骤条</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="showPercentage" valuePropName="checked">
        <Checkbox>显示百分比</Checkbox>
      </Form.Item>

      <Form.Item name="showPageNumber" valuePropName="checked">
        <Checkbox>显示页码</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">使用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>多页问卷的进度提示</li>
          <li>增强用户体验，减少放弃率</li>
          <li>让用户知道还需要多久完成</li>
          <li>建议页数不超过10页</li>
        </ul>
      </div>
    </Form>
  )
}

export default MultipageProgressProps

