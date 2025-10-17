export interface ComponentSelectionProps {
  selectedComponentId: string
  selectedComponentType: string
  setSelectedComponent: (id: string, type: string) => void
}

export interface StatisticsAnswer {
  _id: string
  [key: string]: any
}

export interface StatisticsData {
  total: number
  list: StatisticsAnswer[]
}

export interface PaginationState {
  page: number
  pageSize: number
}

