import { FC, memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Zap } from 'lucide-react'
import { ActionNodeData } from './types'
import clsx from 'clsx'

const ActionNode: FC<NodeProps<ActionNodeData>> = ({ data, selected }) => {
  const getActionTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      http: 'HTTP 请求',
      email: '发送邮件',
      notify: '发送通知',
      script: '执行脚本',
    }
    return type ? labels[type] || type : '未设置'
  }

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[260px] border-2',
        selected 
          ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/50 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'border-gray-200 dark:border-gray-700'
      )}
    >
      {/* Target Handle - 顶部输入 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white dark:!border-gray-800 !-top-1.5"
      />

      {/* 节点内容 */}
      <div className="p-4">
        {/* 图标和标题 */}
        <div className="flex items-start gap-3 mb-3">
          {/* 图标容器 */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} fill="white" />
          </div>
          
          {/* 标题和子标题 */}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-0.5">
              {data.label || '动作'}
            </h3>
            {data.actionType && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getActionTypeLabel(data.actionType)}
              </p>
            )}
          </div>
        </div>

        {/* 描述 */}
        {data.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {data.description}
          </p>
        )}

        {/* 输入输出标识 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              ● input
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">str: data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              ○ output
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">str: result</span>
          </div>
        </div>
      </div>

      {/* Source Handle - 底部输出 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white dark:!border-gray-800 !-bottom-1.5"
      />
    </div>
  )
}

export default memo(ActionNode)
