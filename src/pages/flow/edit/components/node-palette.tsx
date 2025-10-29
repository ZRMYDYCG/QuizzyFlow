import { FC } from 'react'
import { PlayCircle, CircleStop, Zap, GitBranch, Inbox, Send, Box, Plus } from 'lucide-react'
import { FlowNodeType } from '@/components/flow/nodes/types'

interface NodePaletteProps {
  onAddNode: (type: FlowNodeType) => void
}

interface NodeItem {
  type: FlowNodeType
  label: string
  icon: React.ReactNode
  description: string
  gradient: string
}

const nodeItems: NodeItem[] = [
  {
    type: FlowNodeType.START,
    label: '开始',
    icon: <PlayCircle className="w-4 h-4" strokeWidth={2.5} />,
    description: '流程起点',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    type: FlowNodeType.END,
    label: '结束',
    icon: <CircleStop className="w-4 h-4" strokeWidth={2.5} />,
    description: '流程终点',
    gradient: 'from-red-400 to-rose-500',
  },
  {
    type: FlowNodeType.ACTION,
    label: '动作',
    icon: <Zap className="w-4 h-4" strokeWidth={2.5} fill="white" />,
    description: '执行操作',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    type: FlowNodeType.CONDITION,
    label: '条件',
    icon: <GitBranch className="w-4 h-4" strokeWidth={2.5} />,
    description: '分支判断',
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    type: FlowNodeType.INPUT,
    label: '输入',
    icon: <Inbox className="w-4 h-4" strokeWidth={2.5} />,
    description: '接收数据',
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    type: FlowNodeType.OUTPUT,
    label: '输出',
    icon: <Send className="w-4 h-4" strokeWidth={2.5} />,
    description: '输出数据',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    type: FlowNodeType.CUSTOM,
    label: '自定义',
    icon: <Box className="w-4 h-4" strokeWidth={2.5} />,
    description: '自定义节点',
    gradient: 'from-gray-400 to-gray-500',
  },
]

const NodePalette: FC<NodePaletteProps> = ({ onAddNode }) => {
  const NodeButton: FC<{ item: NodeItem }> = ({ item }) => (
    <button
      onClick={() => onAddNode(item.type)}
      className="w-full group relative"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-3 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md active:scale-95">
        <div className="flex items-center gap-3">
          {/* 渐变图标容器 - 和节点卡片一样的风格 */}
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover:scale-110`}>
            <div className="text-white">
              {item.icon}
            </div>
          </div>
          
          {/* 标题和描述 */}
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {item.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {item.description}
            </div>
          </div>

          {/* 添加图标 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  )

  return (
    <div className="w-[280px] border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* 标题 */}
        <div className="px-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            节点库
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">
            点击添加到画布
          </p>
        </div>

        {/* 基础节点 */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider px-1">
            基础节点
          </h3>
          <div className="space-y-2">
            {nodeItems.slice(0, 4).map((item) => (
              <NodeButton key={item.type} item={item} />
            ))}
          </div>
        </section>

        {/* 数据节点 */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider px-1">
            数据节点
          </h3>
          <div className="space-y-2">
            {nodeItems.slice(4, 6).map((item) => (
              <NodeButton key={item.type} item={item} />
            ))}
          </div>
        </section>

        {/* 自定义节点 */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider px-1">
            自定义
          </h3>
          <div className="space-y-2">
            {nodeItems.slice(6).map((item) => (
              <NodeButton key={item.type} item={item} />
            ))}
          </div>
        </section>

        {/* 提示卡片 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-sm">💡</span>
              </div>
              <span className="leading-relaxed">点击节点添加到画布中心位置</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-sm">🔗</span>
              </div>
              <span className="leading-relaxed">拖拽连接点创建节点间的连线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodePalette

