import React from 'react'
import {
  Card,
  Form,
  Switch,
  InputNumber,
  Radio,
  Button,
  message,
  Typography,
  Divider,
} from 'antd'
import { SettingOutlined, SaveOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { updateUserInfo } from '@/store/modules/user'
import { updatePreferences } from '@/api/modules/user'
import { useRequest } from 'ahooks'

const { Title, Text } = Typography

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: stateType) => state.user)
  const [form] = Form.useForm()

  const { run: runUpdate, loading } = useRequest(
    async (values: any) => {
      const params = {
        theme: values.theme,
        language: values.language,
        listView: values.listView,
        editorSettings: {
          autoSave: values.autoSave,
          autoSaveInterval: values.autoSaveInterval,
          defaultScale: values.defaultScale,
          showGrid: values.showGrid,
          showRulers: values.showRulers,
        },
      }
      return await updatePreferences(params)
    },
    {
      manual: true,
      onSuccess: (_, [values]) => {
        message.success('保存成功')
        dispatch(updateUserInfo({
          preferences: {
            theme: values.theme,
            language: values.language,
            listView: values.listView,
            editorSettings: {
              autoSave: values.autoSave,
              autoSaveInterval: values.autoSaveInterval,
              defaultScale: values.defaultScale,
              showGrid: values.showGrid,
              showRulers: values.showRulers,
            },
          },
        }))
        
        // 如果主题改变了，触发主题切换
        if (values.theme !== user.preferences.theme) {
          message.info(`主题已切换为${values.theme === 'dark' ? '暗色' : '亮色'}模式`)
        }
      },
    }
  )

  const handleSubmit = async (values: any) => {
    runUpdate(values)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <Title level={3} className="!mb-4 md:!mb-6 text-lg md:text-2xl">
          <SettingOutlined className="mr-2" />
          偏好设置
        </Title>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            theme: user.preferences?.theme || 'light',
            language: user.preferences?.language || 'zh-CN',
            listView: user.preferences?.listView || 'card',
            autoSave: user.preferences?.editorSettings?.autoSave ?? true,
            autoSaveInterval: user.preferences?.editorSettings?.autoSaveInterval || 30,
            defaultScale: user.preferences?.editorSettings?.defaultScale || 1,
            showGrid: user.preferences?.editorSettings?.showGrid ?? true,
            showRulers: user.preferences?.editorSettings?.showRulers ?? true,
          }}
          onFinish={handleSubmit}
        >
          {/* 外观设置 */}
          <div className="mb-6">
            <Title level={5}>外观设置</Title>
            <Divider className="!mt-2 !mb-4" />

            <Form.Item
              label="主题模式"
              name="theme"
              tooltip="切换亮色或暗色主题"
            >
              <Radio.Group>
                <Radio.Button value="light">亮色</Radio.Button>
                <Radio.Button value="dark">暗色</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="语言"
              name="language"
              tooltip="选择界面显示语言"
            >
              <Radio.Group>
                <Radio.Button value="zh-CN">简体中文</Radio.Button>
                <Radio.Button value="en-US">English</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="列表展示方式"
              name="listView"
              tooltip="选择问卷列表的展示方式"
            >
              <Radio.Group>
                <Radio.Button value="card">卡片视图</Radio.Button>
                <Radio.Button value="table">表格视图</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* 编辑器设置 */}
          <div className="mb-6">
            <Title level={5}>编辑器设置</Title>
            <Divider className="!mt-2 !mb-4" />

            <Form.Item
              label="自动保存"
              name="autoSave"
              valuePropName="checked"
              tooltip="开启后会自动保存编辑内容"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="自动保存间隔（秒）"
              name="autoSaveInterval"
              tooltip="自动保存的时间间隔"
              rules={[
                { required: true, message: '请设置自动保存间隔' },
              ]}
            >
              <InputNumber
                min={10}
                max={300}
                step={10}
                style={{ width: 200 }}
                addonAfter="秒"
              />
            </Form.Item>

            <Form.Item
              label="默认缩放比例"
              name="defaultScale"
              tooltip="编辑器画布的默认缩放比例"
              rules={[
                { required: true, message: '请设置默认缩放比例' },
              ]}
            >
              <InputNumber
                min={0.1}
                max={3}
                step={0.1}
                style={{ width: 200 }}
                formatter={value => `${Math.round((value || 1) * 100)}%`}
                parser={value => Number(value?.replace('%', '')) / 100}
              />
            </Form.Item>

            <Form.Item
              label="显示网格"
              name="showGrid"
              valuePropName="checked"
              tooltip="在编辑器中显示背景网格"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="显示标尺"
              name="showRulers"
              valuePropName="checked"
              tooltip="在编辑器中显示标尺"
            >
              <Switch />
            </Form.Item>
          </div>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
              block
            >
              保存设置
            </Button>
          </Form.Item>

          {/* 提示信息 */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <Text type="secondary">
              💡 提示：某些设置可能需要刷新页面后才能完全生效
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSettings

