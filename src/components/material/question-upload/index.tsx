import { FC } from 'react'
import { Upload, Space, Typography, message } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import {
  IQuestionUploadProps,
  QuestionUploadDefaultProps,
} from './interface.ts'

const { Text } = Typography
const { Dragger } = Upload

const QuestionUpload: FC<IQuestionUploadProps> = (
  props: IQuestionUploadProps
) => {
  const {
    label = '上传文件',
    accept = '*',
    maxCount = 5,
    maxSize = 10,
    listType = 'text',
    multiple = true,
    drag = false,
  } = {
    ...QuestionUploadDefaultProps,
    ...props,
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple,
    accept,
    maxCount,
    listType,
    beforeUpload: (file) => {
      const isLtSize = file.size / 1024 / 1024 < maxSize
      if (!isLtSize) {
        message.error(`文件大小不能超过 ${maxSize}MB!`)
      }
      return false // 阻止自动上传
    },
  }

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {label && <Text>{label}</Text>}
        {drag ? (
          <Dragger {...uploadProps} style={{ width: '100%' }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，最多{maxCount}个文件，每个文件不超过{maxSize}MB
            </p>
          </Dragger>
        ) : (
          <Upload {...uploadProps}>
            <button
              type="button"
              style={{
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <UploadOutlined /> 选择文件
            </button>
          </Upload>
        )}
      </Space>
    </div>
  )
}

export default QuestionUpload

