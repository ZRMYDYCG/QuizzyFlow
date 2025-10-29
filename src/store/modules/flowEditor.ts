import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Node, Edge, Viewport } from 'reactflow'
import undoable, { StateWithHistory } from 'redux-undo'

export interface FlowEditorState {
  flowId: string | null
  title: string
  description: string
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  viewport: Viewport
  isSaving: boolean
  lastSaved: string | null
}

const initialState: FlowEditorState = {
  flowId: null,
  title: '未命名工作流',
  description: '',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  isSaving: false,
  lastSaved: null,
}

const flowEditorSlice = createSlice({
  name: 'flowEditor',
  initialState,
  reducers: {
    loadFlow: (
      state,
      action: PayloadAction<{
        flowId: string
        title: string
        description: string
        nodes: Node[]
        edges: Edge[]
        viewport: Viewport
      }>,
    ) => {
      state.flowId = action.payload.flowId
      state.title = action.payload.title
      state.description = action.payload.description
      state.nodes = action.payload.nodes
      state.edges = action.payload.edges
      state.viewport = action.payload.viewport
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },

    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload
    },

    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload)
    },

    updateNode: (
      state,
      action: PayloadAction<{ id: string; data: any }>,
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.id)
      if (node) {
        node.data = { ...node.data, ...action.payload.data }
      }
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload)
      state.edges = state.edges.filter(
        (e) => e.source !== action.payload && e.target !== action.payload,
      )
    },

    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload
    },

    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload)
    },

    updateEdge: (
      state,
      action: PayloadAction<{ id: string; data: any }>,
    ) => {
      const edge = state.edges.find((e) => e.id === action.payload.id)
      if (edge) {
        edge.data = { ...edge.data, ...action.payload.data }
      }
    },

    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((e) => e.id !== action.payload)
    },

    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload
      state.selectedEdgeId = null
    },

    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdgeId = action.payload
      state.selectedNodeId = null
    },

    setViewport: (state, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload
    },

    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    },

    setSaved: (state) => {
      state.lastSaved = new Date().toISOString()
    },

    resetFlow: () => initialState,
  },
})

export const {
  loadFlow,
  setTitle,
  setDescription,
  addNode,
  updateNode,
  deleteNode,
  setNodes,
  addEdge,
  updateEdge,
  deleteEdge,
  setEdges,
  selectNode,
  selectEdge,
  setViewport,
  setSaving,
  setSaved,
  resetFlow,
} = flowEditorSlice.actions

// 使用 redux-undo 包装
export default undoable(flowEditorSlice.reducer, {
  limit: 20,
  filter: (action) => {
    const excludedActions = [
      'flowEditor/selectNode',
      'flowEditor/selectEdge',
      'flowEditor/setViewport',
      'flowEditor/setSaving',
      'flowEditor/setSaved',
    ]
    return !excludedActions.includes(action.type)
  },
})

export type FlowEditorStateWithHistory = StateWithHistory<FlowEditorState>

