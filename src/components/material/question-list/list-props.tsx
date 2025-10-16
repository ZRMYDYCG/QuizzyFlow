import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Slider } from 'antd'
import { IQuestionListProps } from './interface.ts'

const ListProps: FC<IQuestionListProps> = (props: IQuestionListProps) => {
  const [form] = Form.useForm()

  const {
    items,
    listType,
    markerStyle,
    indent,
    itemSpacing,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      items,
      listType,
      markerStyle,
      indent,
      itemSpacing,
    })
  }, [items, listType, markerStyle, indent, itemSpacing])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const currentListType = Form.useWatch('listType', form) || listType

  return (
    <Form
      layout="vertical"
      initialValues={{
        items,
        listType,
        markerStyle,
        indent,
        itemSpacing,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="列表内容"
        name="items"
        rules={[{ required: true, message: '请输入列表内容' }]}
        extra="每行一个列表项"
      >
        <Input.TextArea
          rows={6}
          placeholder="列表项 1&#10;列表项 2&#10;列表项 3"
        />
      </Form.Item>

      <Form.Item label="列表类型" name="listType">
        <Select>
          <Select.Option value="ordered">有序列表</Select.Option>
          <Select.Option value="unordered">无序列表</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="标记样式" name="markerStyle">
        <Select>
          {currentListType === 'ordered' ? (
            <>
              <Select.Option value="number">数字 (1, 2, 3...)</Select.Option>
              <Select.Option value="letter">字母 (a, b, c...)</Select.Option>
              <Select.Option value="roman">罗马数字 (i, ii, iii...)</Select.Option>
            </>
          ) : (
            <>
              <Select.Option value="disc">实心圆点 (●)</Select.Option>
              <Select.Option value="circle">空心圆点 (○)</Select.Option>
              <Select.Option value="square">方块 (■)</Select.Option>
              <Select.Option value="arrow">箭头 (→)</Select.Option>
              <Select.Option value="check">对勾 (✓)</Select.Option>
            </>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="缩进级别" name="indent">
        <Slider
          min={0}
          max={5}
          marks={{
            0: '0',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
          }}
        />
      </Form.Item>

      <Form.Item label="列表项间距" name="itemSpacing">
        <Select>
          <Select.Option value="compact">紧凑</Select.Option>
          <Select.Option value="normal">正常</Select.Option>
          <Select.Option value="relaxed">宽松</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default ListProps

