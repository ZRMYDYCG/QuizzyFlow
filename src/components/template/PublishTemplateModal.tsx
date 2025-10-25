/**
 * 发布模板弹窗组件
 */
import { FC } from 'react'
import { Modal, Form, Input, Select, Switch, message, Upload, Button } from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import { useRequest } from 'ahooks'
import { 
  TemplateCategory, 
  TEMPLATE_CATEGORIES, 
  getAllCategories,
  POPULAR_TAGS 
} from '@/constants/template-categories'
import { 
  QuestionnaireType, 
  QUESTIONNAIRE_TYPES,
  MVP_RECOMMENDED_TYPES 
} from '@/constants/questionnaire-types'
import { createTemplate } from '@/api/modules/template'
import type { QuestionComponentType } from '@/store/modules/question-component'
import type { IPageInfo } from '@/store/modules/pageinfo-reducer'

interface PublishTemplateModalProps {
  open: boolean
  onClose: () => void
  componentList: QuestionComponentType[]
  pageInfo: IPageInfo
}

const PublishTemplateModal: FC<PublishTemplateModalProps> = ({
  open,
  onClose,
  componentList,
  pageInfo,
}) => {
  const [form] = Form.useForm()

  // 发布模板
  const { loading, run: handlePublish } = useRequest(
    async (values) => {
      const templateData = {
        title: pageInfo.title || '未命名问卷',
        desc: pageInfo.desc || '',
        type: pageInfo.type as QuestionnaireType || QuestionnaireType.FORM,
        componentList,
        pageInfo: {
          layout: pageInfo.layout,
          padding: pageInfo.padding,
          maxWidth: pageInfo.maxWidth,
          bgImage: pageInfo.bgImage,
          bgRepeat: pageInfo.bgRepeat,
          bgPosition: pageInfo.bgPosition,
          parallaxEffect: pageInfo.parallaxEffect,
          borderRadius: pageInfo.borderRadius,
        },
      }

      await createTemplate({
        name: values.name,
        description: values.description,
        thumbnail: values.thumbnail || '',
        category: values.category,
        type: pageInfo.type as QuestionnaireType || QuestionnaireType.FORM,
        tags: values.tags || [],
        templateData,
        isPublic: values.isPublic ?? true,
      })

      message.success('模板发布成功！')
      form.resetFields()
      onClose()
    },
    {
      manual: true,
      onError: () => {
        message.error('发布失败，请稍后重试')
      }
    }
  )

  const handleOk = () => {
    form.validateFields().then(handlePublish)
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="📤 发布为模板"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="发布模板"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: TemplateCategory.CUSTOM,
          isPublic: true,
          tags: [],
        }}
      >
        {/* 模板名称 */}
        <Form.Item
          name="name"
          label="模板名称"
          rules={[
            { required: true, message: '请输入模板名称' },
            { max: 50, message: '名称不能超过50个字符' }
          ]}
        >
          <Input 
            placeholder="为你的模板起个好听的名字"
            size="large"
          />
        </Form.Item>

        {/* 模板描述 */}
        <Form.Item
          name="description"
          label="模板描述"
          rules={[
            { required: true, message: '请输入模板描述' },
            { max: 200, message: '描述不能超过200个字符' }
          ]}
        >
          <Input.TextArea
            placeholder="描述模板的用途和特点..."
            rows={3}
            size="large"
          />
        </Form.Item>

        {/* 分类选择 */}
        <Form.Item
          name="category"
          label="模板分类"
          rules={[{ required: true, message: '请选择模板分类' }]}
        >
          <Select size="large" placeholder="选择适合的分类">
            {getAllCategories().map(cat => (
              <Select.Option key={cat.key} value={cat.key}>
                <div className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* 标签 */}
        <Form.Item
          name="tags"
          label="模板标签"
          help="选择或输入标签，方便其他用户搜索"
        >
          <Select
            mode="tags"
            size="large"
            placeholder="选择或输入标签"
            maxTagCount={5}
            options={POPULAR_TAGS.map(tag => ({ label: tag, value: tag }))}
          />
        </Form.Item>

        {/* 缩略图URL */}
        <Form.Item
          name="thumbnail"
          label="缩略图链接（可选）"
          help="提供一个模板预览图片的URL"
        >
          <Input
            placeholder="https://example.com/image.jpg"
            size="large"
          />
        </Form.Item>

        {/* 是否公开 */}
        <Form.Item
          name="isPublic"
          label="是否公开"
          valuePropName="checked"
          help="公开后其他用户可以在模板市场中看到并使用"
        >
          <Switch />
        </Form.Item>

        {/* 提示信息 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-600 dark:text-blue-400">
          <p className="mb-2">📝 发布提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>发布后的模板将包含当前问卷的所有组件和配置</li>
            <li>其他用户可以使用你的模板快速创建问卷</li>
            <li>你可以随时在"我的模板"中管理发布的模板</li>
          </ul>
        </div>
      </Form>
    </Modal>
  )
}

export default PublishTemplateModal

