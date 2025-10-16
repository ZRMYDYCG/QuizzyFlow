import { FC } from 'react'
import { Typography } from 'antd'
import {
  CheckCircleFilled,
  RightOutlined,
} from '@ant-design/icons'
import {
  IQuestionListProps,
  QuestionListDefaultProps,
} from './interface.ts'

const QuestionList: FC<IQuestionListProps> = (props: IQuestionListProps) => {
  const {
    items = '',
    listType = 'unordered',
    markerStyle = 'disc',
    indent = 1,
    itemSpacing = 'normal',
  } = {
    ...QuestionListDefaultProps,
    ...props,
  }

  const itemList = items.split('\n').filter((item) => item.trim() !== '')

  // 获取缩进像素值
  const getIndentPixels = () => {
    return indent * 20
  }

  // 获取列表项间距
  const getItemSpacing = () => {
    switch (itemSpacing) {
      case 'compact':
        return '4px'
      case 'relaxed':
        return '12px'
      default:
        return '8px'
    }
  }

  // 获取有序列表标记
  const getOrderedMarker = (index: number) => {
    switch (markerStyle) {
      case 'number':
        return `${index + 1}.`
      case 'letter':
        return `${String.fromCharCode(97 + (index % 26))}.`
      case 'roman':
        return `${toRoman(index + 1)}.`
      default:
        return `${index + 1}.`
    }
  }

  // 转换为罗马数字
  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 10, numeral: 'x' },
      { value: 9, numeral: 'ix' },
      { value: 5, numeral: 'v' },
      { value: 4, numeral: 'iv' },
      { value: 1, numeral: 'i' },
    ]
    let result = ''
    for (const { value, numeral } of romanNumerals) {
      while (num >= value) {
        result += numeral
        num -= value
      }
    }
    return result
  }

  // 获取无序列表标记样式
  const getUnorderedMarkerStyle = () => {
    switch (markerStyle) {
      case 'disc':
        return { listStyleType: 'disc' }
      case 'circle':
        return { listStyleType: 'circle' }
      case 'square':
        return { listStyleType: 'square' }
      default:
        return { listStyleType: 'none' }
    }
  }

  // 渲染自定义图标标记
  const renderCustomMarker = () => {
    if (markerStyle === 'check') {
      return <CheckCircleFilled style={{ color: '#52c41a', fontSize: '14px', marginRight: '8px' }} />
    }
    if (markerStyle === 'arrow') {
      return <RightOutlined style={{ color: '#1890ff', fontSize: '12px', marginRight: '8px' }} />
    }
    return null
  }

  const needsCustomMarker = markerStyle === 'check' || markerStyle === 'arrow'

  return (
    <div style={{ margin: '12px 0' }}>
      {listType === 'ordered' ? (
        <ol
          style={{
            paddingLeft: `${getIndentPixels()}px`,
            margin: 0,
            listStylePosition: 'outside',
          }}
        >
          {itemList.map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: index < itemList.length - 1 ? getItemSpacing() : 0,
                lineHeight: '1.6',
              }}
            >
              <Typography.Text>{item}</Typography.Text>
            </li>
          ))}
        </ol>
      ) : (
        <ul
          style={{
            paddingLeft: needsCustomMarker ? '0' : `${getIndentPixels()}px`,
            margin: 0,
            listStylePosition: 'outside',
            ...(!needsCustomMarker && getUnorderedMarkerStyle()),
          }}
        >
          {itemList.map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: index < itemList.length - 1 ? getItemSpacing() : 0,
                lineHeight: '1.6',
                display: needsCustomMarker ? 'flex' : 'list-item',
                alignItems: needsCustomMarker ? 'flex-start' : 'normal',
                listStyleType: needsCustomMarker ? 'none' : undefined,
                marginLeft: needsCustomMarker ? `${getIndentPixels()}px` : 0,
              }}
            >
              {needsCustomMarker && renderCustomMarker()}
              <Typography.Text style={{ flex: needsCustomMarker ? 1 : undefined }}>
                {item}
              </Typography.Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default QuestionList

