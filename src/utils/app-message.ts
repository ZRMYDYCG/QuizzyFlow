import { message as antdMessage } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'

antdMessage.config({
  top: 64,
  maxCount: 3,
  duration: 3,
})

function wrapMessageMethod<T extends (...args: never[]) => unknown>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>) => Promise.resolve(fn(...args) as ReturnType<T>)
}

export const message: MessageInstance = {
  ...antdMessage,
  success: wrapMessageMethod(antdMessage.success.bind(antdMessage)),
  error: wrapMessageMethod(antdMessage.error.bind(antdMessage)),
  info: wrapMessageMethod(antdMessage.info.bind(antdMessage)),
  warning: wrapMessageMethod(antdMessage.warning.bind(antdMessage)),
  loading: wrapMessageMethod(antdMessage.loading.bind(antdMessage)),
  open: wrapMessageMethod(antdMessage.open.bind(antdMessage)),
}
