/** 标签页项 */
export interface TabItem {
    path: string
    title: string
    closable?: boolean
    icon?: string
}
  
/** TabNav 组件属性 */
export interface TabNavProps {
    currentPath: string
    tabs: TabItem[]
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
    onCloseOthers: (path: string) => void
    onCloseAll: () => void
    onCloseLeft: (path: string) => void
    onCloseRight: (path: string) => void
}

/** 单个标签项属性 */
export interface TabItemProps {
    tab: TabItem
    isActive: boolean
    currentPath: string
    tabs: TabItem[]
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
    onCloseOthers: (path: string) => void
    onCloseAll: () => void
    onCloseLeft: (path: string) => void
    onCloseRight: (path: string) => void
}
