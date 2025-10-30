import { FC, useEffect, useCallback, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, message, Spin, Tooltip, Dropdown, Badge } from 'antd'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons'
import { 
  Maximize2, 
  Minimize2, 
  Settings, 
  Grid3x3, 
  ZoomIn, 
  ZoomOut,
  Play,
  Share2,
} from 'lucide-react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ActionCreators } from 'redux-undo'
import { nanoid } from 'nanoid'
import { debounce } from 'lodash-es'
import { stateType } from '@/store'
import {
  loadFlow,
  setTitle,
  setSaving,
  setSaved,
  setNodes as setReduxNodes,
  setEdges as setReduxEdges,
} from '@/store/modules/flowEditor'
import { getFlow, updateFlow } from '@/api/flow'
import { nodeTypes, FlowNodeType, FlowNodeData } from '@/components/flow/nodes'
import NodePalette from './components/node-palette'
import PropertyPanel from './components/property-panel'
import ExportDialog from './components/export-dialog'
import { useFlowThumbnail } from '@/hooks/flow/useFlowThumbnail'

const FlowEdit: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null)
  const [exportDialogVisible, setExportDialogVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const { title, viewport } = useSelector(
    (state: stateType) => state.flowEditor.present,
  )
  const { past, future } = useSelector((state: stateType) => state.flowEditor)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { generateThumbnail } = useFlowThumbnail(id)

  // 加载工作流数据
  useEffect(() => {
    const loadFlowData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getFlow(id)
        dispatch(
          loadFlow({
            flowId: data._id,
            title: data.title,
            description: data.description || '',
            nodes: data.nodes || [],
            edges: data.edges || [],
            viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
          }),
        )
        setNodes(data.nodes || [])
        setEdges(data.edges || [])
      } catch (error) {
        message.error('加载工作流失败')
        navigate('/flow/list')
      } finally {
        setLoading(false)
      }
    }

    loadFlowData()
  }, [id])

  // 自动保存
  const debouncedSave = useCallback(
    debounce(async (flowData: any) => {
      if (!id) return
      try {
        setIsSaving(true)
        dispatch(setSaving(true))
        await updateFlow(id, flowData)
        dispatch(setSaved())
        setLastSaved(new Date())
      } catch (error) {
        message.error('自动保存失败')
      } finally {
        setIsSaving(false)
        dispatch(setSaving(false))
      }
    }, 2000),
    [id],
  )

  // 监听节点和边的变化，触发自动保存
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      debouncedSave({ nodes, edges, viewport })
      dispatch(setReduxNodes(nodes))
      dispatch(setReduxEdges(edges))
    }
  }, [nodes, edges])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const handleSave = async () => {
    if (!id) return
    try {
      setIsSaving(true)
      dispatch(setSaving(true))
      await updateFlow(id, { title, nodes, edges, viewport })
      
      // 生成并保存缩略图
      if (reactFlowWrapper.current && nodes.length > 0) {
        await generateThumbnail(reactFlowWrapper.current)
      }
      
      dispatch(setSaved())
      setLastSaved(new Date())
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setIsSaving(false)
      dispatch(setSaving(false))
    }
  }

  // 格式化最后保存时间
  const formatLastSaved = () => {
    if (!lastSaved) return ''
    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 10) return '刚刚保存'
    if (seconds < 60) return `${seconds}秒前保存`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}分钟前保存`
    return lastSaved.toLocaleTimeString()
  }

  // 添加节点
  const handleAddNode = (type: FlowNodeType) => {
    const newNode: Node<FlowNodeData> = {
      id: nanoid(),
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        type,
        label: getDefaultLabel(type),
        description: '',
      } as any,
    }
    setNodes((nds) => [...nds, newNode])
  }

  // 更新节点数据
  const handleUpdateNode = (id: string, data: Partial<FlowNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    )
  }

  // 删除节点
  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id))
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    )
    setSelectedNode(null)
  }

  // 节点选择
  const onNodeClick = useCallback((_: any, node: Node<FlowNodeData>) => {
    setSelectedNode(node)
  }, [])

  // 画布点击
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spin size="large" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">加载工作流中...</p>
      </div>
    )
  }

  const moreMenuItems = [
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: '预览',
    },
    {
      key: 'share',
      icon: <Share2 className="w-4 h-4" />,
      label: '分享',
    },
    {
      key: 'settings',
      icon: <Settings className="w-4 h-4" />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: '导出',
      onClick: () => setExportDialogVisible(true),
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Tooltip title="返回列表">
            <button
              onClick={() => navigate('/manage/flow')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftOutlined className="text-gray-600 dark:text-gray-400" />
            </button>
          </Tooltip>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          
          <Input
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            className="w-80"
            placeholder="未命名工作流"
            bordered={false}
            style={{ 
              fontSize: 14, 
              fontWeight: 600,
              color: 'inherit'
            }}
          />

          {/* 保存状态指示器 */}
          <div className="flex items-center gap-2 text-xs">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <LoadingOutlined className="text-sm" />
                保存中...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <CheckCircleOutlined className="text-sm" />
                {formatLastSaved()}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-400">
                <CloudSyncOutlined className="text-sm" />
                未保存
              </span>
            )}
          </div>
        </div>

        {/* Center Section - 工具栏 */}
        <div className="flex items-center gap-1">
          {/* 撤销/重做 */}
          <div className="flex items-center gap-1 px-1">
            <Tooltip title="撤销 (Ctrl+Z)">
              <button
                disabled={past.length === 0}
                onClick={() => dispatch(ActionCreators.undo())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <UndoOutlined className="text-gray-600 dark:text-gray-400" />
              </button>
            </Tooltip>
            <Tooltip title="重做 (Ctrl+Y)">
              <button
                disabled={future.length === 0}
                onClick={() => dispatch(ActionCreators.redo())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RedoOutlined className="text-gray-600 dark:text-gray-400" />
              </button>
            </Tooltip>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* 视图控制 */}
          <Tooltip title={showGrid ? '隐藏网格' : '显示网格'}>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                showGrid ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </Tooltip>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Tooltip title="运行工作流">
            <Button 
              icon={<Play className="w-4 h-4" />}
              className="flex items-center gap-1"
            >
              运行
            </Button>
          </Tooltip>

          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={isSaving}
          >
            保存
          </Button>

          <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧节点面板 */}
        {!isFullscreen && <NodePalette onAddNode={handleAddNode} />}

        {/* Canvas */}
        <div className="flex-1 relative bg-white dark:bg-gray-900" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            snapToGrid={showGrid}
            snapGrid={[15, 15]}
            defaultViewport={viewport}
            className="bg-white dark:bg-gray-900"
          >
            {showGrid && (
              <Background 
                color="#94a3b8"
                gap={16} 
                size={1}
                className="dark:opacity-20"
              />
            )}
            <Controls 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start':
                    return '#22c55e'
                  case 'end':
                    return '#ef4444'
                  case 'condition':
                    return '#f59e0b'
                  case 'action':
                    return '#3b82f6'
                  case 'input':
                    return '#6366f1'
                  case 'output':
                    return '#d946ef'
                  default:
                    return '#6b7280'
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            />
          </ReactFlow>

          {/* 空状态提示 */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-center">
                {/* 图标 */}
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* 文案 */}
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  开始构建您的工作流
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  从左侧面板拖拽或点击节点添加到画布，连接节点构建自动化流程
                </p>

                {/* 快捷键提示 */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Z</kbd>
                    <span className="ml-1">撤销</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">S</kbd>
                    <span className="ml-1">保存</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 节点统计 - 右上角 */}
          {nodes.length > 0 && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2 flex items-center gap-4 text-xs z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {nodes.length} 节点
                </span>
              </div>
              <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {edges.length} 连线
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 右侧属性面板 */}
        {!isFullscreen && (
          <PropertyPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
          />
        )}
      </div>

      {/* Export Dialog */}
      <ExportDialog
        visible={exportDialogVisible}
        onClose={() => setExportDialogVisible(false)}
        reactFlowWrapper={reactFlowWrapper.current}
        nodes={nodes}
        edges={edges}
        flowTitle={title}
      />
    </div>
  )
}

function getDefaultLabel(type: FlowNodeType): string {
  const labels: Record<FlowNodeType, string> = {
    [FlowNodeType.START]: '开始',
    [FlowNodeType.END]: '结束',
    [FlowNodeType.ACTION]: '动作',
    [FlowNodeType.CONDITION]: '条件判断',
    [FlowNodeType.INPUT]: '输入',
    [FlowNodeType.OUTPUT]: '输出',
    [FlowNodeType.CUSTOM]: '自定义节点',
  }
  return labels[type] || '未命名节点'
}

export default FlowEdit
