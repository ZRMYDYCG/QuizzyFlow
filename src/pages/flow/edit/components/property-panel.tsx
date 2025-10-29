import { FC } from 'react'
import { Input, Select, Button, Divider, Badge } from 'antd'
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Settings2, Trash2 } from 'lucide-react'
import { Node } from 'reactflow'
import { FlowNodeData, FlowNodeType } from '@/components/flow/nodes/types'

const { TextArea } = Input
const { Option } = Select

interface PropertyPanelProps {
  selectedNode: Node<FlowNodeData> | null
  onUpdateNode: (id: string, data: Partial<FlowNodeData>) => void
  onDeleteNode: (id: string) => void
}

const PropertyPanel: FC<PropertyPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-[320px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            属性面板
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            未选择节点
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            点击画布中的节点查看属性
          </p>
        </div>
      </div>
    )
  }

  const nodeData = selectedNode.data

  const handleChange = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, { [field]: value })
  }

  const getNodeTypeColor = (type: FlowNodeType) => {
    const colors = {
      [FlowNodeType.START]: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      [FlowNodeType.END]: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      [FlowNodeType.ACTION]: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      [FlowNodeType.CONDITION]: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      [FlowNodeType.INPUT]: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      [FlowNodeType.OUTPUT]: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      [FlowNodeType.CUSTOM]: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    }
    return colors[type] || colors[FlowNodeType.CUSTOM]
  }

  return (
    <div className="w-[320px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            节点设置
          </h2>
          <Badge 
            count={getNodeTypeLabel(selectedNode.type as FlowNodeType)} 
            className={`text-xs px-2 py-0.5 rounded-full border ${getNodeTypeColor(selectedNode.type as FlowNodeType)}`}
            style={{ boxShadow: 'none' }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          ID: {selectedNode.id}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 标签 */}
        <section>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            节点标签 <span className="text-red-500">*</span>
          </label>
          <Input
            value={nodeData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="输入节点标签"
            size="middle"
          />
        </section>

        {/* 描述 */}
        <section>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            节点描述
          </label>
          <TextArea
            value={nodeData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="输入节点描述（可选）"
            rows={3}
            showCount
            maxLength={200}
          />
        </section>

        {/* 条件节点特有属性 */}
        {selectedNode.type === FlowNodeType.CONDITION && (
          <>
            <section>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                条件表达式
              </div>
              <Input
                value={(nodeData as any).condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="例: value > 100"
                className="font-mono text-sm"
              />
            </section>
            <section>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                分支标签
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={(nodeData as any).trueLabel || '是'}
                  onChange={(e) => handleChange('trueLabel', e.target.value)}
                  placeholder="是"
                  size="small"
                />
                <Input
                  value={(nodeData as any).falseLabel || '否'}
                  onChange={(e) => handleChange('falseLabel', e.target.value)}
                  placeholder="否"
                  size="small"
                />
              </div>
            </section>
          </>
        )}

        {/* 动作节点特有属性 */}
        {selectedNode.type === FlowNodeType.ACTION && (
          <section>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              动作类型
            </div>
            <Select
              value={(nodeData as any).actionType || 'http'}
              onChange={(value) => handleChange('actionType', value)}
              className="w-full"
            >
              <Option value="http">HTTP 请求</Option>
              <Option value="email">发送邮件</Option>
              <Option value="notify">发送通知</Option>
              <Option value="script">执行脚本</Option>
            </Select>
          </section>
        )}

        {/* 输入节点特有属性 */}
        {selectedNode.type === FlowNodeType.INPUT && (
          <section>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              输入类型
            </div>
            <Select
              value={(nodeData as any).inputType || 'form'}
              onChange={(value) => handleChange('inputType', value)}
              className="w-full"
            >
              <Option value="form">表单数据</Option>
              <Option value="file">文件上传</Option>
              <Option value="api">API 调用</Option>
            </Select>
          </section>
        )}

        {/* 输出节点特有属性 */}
        {selectedNode.type === FlowNodeType.OUTPUT && (
          <section>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              输出类型
            </div>
            <Select
              value={(nodeData as any).outputType || 'response'}
              onChange={(value) => handleChange('outputType', value)}
              className="w-full"
            >
              <Option value="response">响应结果</Option>
              <Option value="file">文件导出</Option>
              <Option value="webhook">Webhook</Option>
            </Select>
          </section>
        )}

        {/* 自定义节点特有属性 */}
        {selectedNode.type === FlowNodeType.CUSTOM && (
          <section>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              自定义类型
            </div>
            <Input
              value={(nodeData as any).customType}
              onChange={(e) => handleChange('customType', e.target.value)}
              placeholder="输入自定义类型"
            />
          </section>
        )}

      </div>

      {/* Footer - 删除按钮和节点信息 */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex-shrink-0 space-y-3">
        {/* 节点信息卡片 */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <InfoCircleOutlined className="text-blue-500" />
            <span className="font-medium">节点信息</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-5">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">ID:</span>
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
                {selectedNode.id.substring(0, 8)}...
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">位置:</span>
              <span>
                ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
              </span>
            </div>
          </div>
        </div>

        {/* 删除按钮 */}
        <Button
          danger
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => onDeleteNode(selectedNode.id)}
          block
          className="flex items-center justify-center gap-2"
        >
          删除节点
        </Button>
      </div>
    </div>
  )
}

function getNodeTypeLabel(type: FlowNodeType): string {
  const labels: Record<FlowNodeType, string> = {
    [FlowNodeType.START]: '开始',
    [FlowNodeType.END]: '结束',
    [FlowNodeType.ACTION]: '动作',
    [FlowNodeType.CONDITION]: '条件',
    [FlowNodeType.INPUT]: '输入',
    [FlowNodeType.OUTPUT]: '输出',
    [FlowNodeType.CUSTOM]: '自定义',
  }
  return labels[type] || type
}

export default PropertyPanel

