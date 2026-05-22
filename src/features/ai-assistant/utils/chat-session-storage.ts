const activeKey = (questionId: string) => `ai-chat-active-${questionId}`

export function getActiveChatId(questionId: string): string | null {
  try {
    return localStorage.getItem(activeKey(questionId))
  } catch {
    return null
  }
}

export function setActiveChatId(questionId: string, chatId: string | null) {
  try {
    if (chatId) {
      localStorage.setItem(activeKey(questionId), chatId)
    } else {
      localStorage.removeItem(activeKey(questionId))
    }
  } catch {
    // ignore quota / private mode
  }
}
