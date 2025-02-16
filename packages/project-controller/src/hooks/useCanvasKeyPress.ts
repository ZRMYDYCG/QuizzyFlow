import { useKeyPress } from 'ahooks'
import { useDispatch } from 'react-redux'
import {
  extraComponents,
  changeComponentsVisible,
  changeComponentsLock,
  copySelectedComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
} from '../store/modules/question-component.ts'

function isActiveElement() {
  const activeElement = document.activeElement

  if (activeElement === document.body) return true
  if (activeElement?.matches('div[role="button"]')) return true

  return false
}

function useCanvasKeyPress() {
  const dispatch = useDispatch()
  // 删除组件
  useKeyPress(['backspace', 'delete'], () => {
    if (!isActiveElement()) return
    dispatch(extraComponents())
  })
  // 复制组件
  useKeyPress(['ctrl.c', 'meta.c'], () => {
    dispatch(copySelectedComponent())
  })
  // 粘贴组件
  useKeyPress(['ctrl.v', 'meta.v'], () => {
    dispatch(pasteComponent())
  })
  // 选中上一个组件
  useKeyPress(['uparrow'], () => {
    if (!isActiveElement()) return
    dispatch(selectPrevComponent())
  })
  // 选中下一个组件
  useKeyPress(['downarrow'], () => {
    if (!isActiveElement()) return
    dispatch(selectNextComponent())
  })
}

export default useCanvasKeyPress
