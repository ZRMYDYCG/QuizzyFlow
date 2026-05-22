/**
 * 发布模板弹窗
 */
import { FC } from 'react'
import { Modal, Form, Input, Select, Switch, message, Typography } from 'antd'
import { useRequest } from 'ahooks'
import {
  TemplateCategory,
  getAllCategories,
  POPULAR_TAGS,
} from '@/constants/template-categories'
import { QuestionnaireType } from '@/constants/questionnaire-types'
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

  const { loading, run: handlePublish } = useRequest(
    async (values) => {
      const templateData = {
        title: pageInfo.title || '未命名问卷',
        desc: pageInfo.desc || '',
        type: (pageInfo.type as QuestionnaireType) || QuestionnaireType.FORM,
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
          paginationEnabled: pageInfo.paginationEnabled,
          itemsPerPage: pageInfo.itemsPerPage,
        },
      }

      await createTemplate({
        name: values.name,
        description: values.description,
        thumbnail: values.thumbnail || '',
        category: values.category,
        type: (pageInfo.type as QuestionnaireType) || QuestionnaireType.FORM,
        tags: values.tags || [],
        templateData,
        isPublic: values.isPublic ?? true,
      })

      message.success(
        '已提交。无敏感词将自动公开，含敏感词需审核通过后才会出现在模板市场。',
      )
      form.resetFields()
      onClose()
    },
    {
      manual: true,
      onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
        message.error(
          error?.response?.data?.message || error?.message || '发布失败，请稍后重试',
        )
      },
    },
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
      title="发布为模板"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={520}
      okText="发布"
      cancelText="取消"
      destroyOnClose
    >
      <Typography.Paragraph type="secondary" className="!mb-4 text-sm">
        将当前问卷保存为模板，可在「我的模板」中管理。
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          category: TemplateCategory.CUSTOM,
          isPublic: true,
          tags: [],
        }}
      >
        <Form.Item
          name="name"
          label="模板名称"
          rules={[
            { required: true, message: '请输入模板名称' },
            { max: 50, message: '不超过 50 字' },
          ]}
        >
          <Input placeholder="模板名称" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[
            { required: true, message: '请输入描述' },
            { max: 200, message: '不超过 200 字' },
          ]}
        >
          <Input.TextArea
            placeholder="用途或适用场景"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select
              placeholder="选择分类"
              options={getAllCategories().map((cat) => ({
                label: cat.label,
                value: cat.key,
              }))}
            />
          </Form.Item>

          <Form.Item name="isPublic" label="公开" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </div>

        <Form.Item name="tags" label="标签" extra="最多 5 个，便于搜索">
          <Select
            mode="tags"
            placeholder="选择或输入"
            maxTagCount={5}
            options={POPULAR_TAGS.map((tag) => ({ label: tag, value: tag }))}
          />
        </Form.Item>

        <Form.Item name="thumbnail" label="缩略图" extra="可选，图片 URL">
          <Input placeholder="https://" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PublishTemplateModal
