import { useEffect, useMemo, useState } from 'react'
import {
  ANONYMOUS_DISPLAY_NAME,
  type RespondentIdentityMode,
  type RespondentIdentityState,
  type ResolvedRespondent,
} from '../types'

interface UseRespondentIdentityOptions {
  isLoggedIn: boolean
  username: string
  nickname: string
}

export function useRespondentIdentity({
  isLoggedIn,
  username,
  nickname,
}: UseRespondentIdentityOptions) {
  const accountDisplayName = nickname?.trim() || username?.trim() || ''

  const [state, setState] = useState<RespondentIdentityState>({
    mode: isLoggedIn ? 'account' : 'custom',
    customName: '',
  })

  useEffect(() => {
    setState((prev) => ({
      mode: isLoggedIn ? 'account' : 'custom',
      customName: prev.customName,
    }))
  }, [isLoggedIn])

  const setMode = (mode: RespondentIdentityMode) => {
    setState((prev) => ({ ...prev, mode }))
  }

  const setCustomName = (customName: string) => {
    setState((prev) => ({ ...prev, customName }))
  }

  const resolved = useMemo((): ResolvedRespondent => {
    if (!isLoggedIn || state.mode === 'custom') {
      const name = state.customName.trim()
      return {
        respondentName: name,
        isAnonymous: false,
      }
    }
    if (state.mode === 'anonymous') {
      return {
        respondentName: ANONYMOUS_DISPLAY_NAME,
        isAnonymous: true,
      }
    }
    return {
      respondentName: accountDisplayName,
      isAnonymous: false,
      respondentUsername: username,
    }
  }, [
    isLoggedIn,
    state.mode,
    state.customName,
    accountDisplayName,
    username,
  ])

  const identityValid = useMemo(() => {
    if (!isLoggedIn || state.mode === 'custom') {
      return state.customName.trim().length > 0
    }
    if (state.mode === 'anonymous') {
      return true
    }
    return accountDisplayName.length > 0
  }, [isLoggedIn, state.mode, state.customName, accountDisplayName])

  const identityHint = useMemo(() => {
    if (!isLoggedIn) {
      return '未登录填写需输入昵称，将显示在答卷记录中'
    }
    if (state.mode === 'account') {
      return `将使用您的账号昵称：${accountDisplayName}`
    }
    if (state.mode === 'anonymous') {
      return '匿名提交，作者将看到「匿名用户」'
    }
    return '自定义昵称将替代账号名显示'
  }, [isLoggedIn, state.mode, accountDisplayName])

  return {
    state,
    setMode,
    setCustomName,
    accountDisplayName,
    resolved,
    identityValid,
    identityHint,
  }
}
